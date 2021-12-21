const FormData = require("form-data")
const fetch = require("node-fetch")

const path = require("path")
const isLocal = typeof process.pkg === "undefined"
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath)
const fs = require("fs")
let backoffCount = 1

async function waitSecond (sec) {
  console.log(`->正在等待${sec.toFixed(2)}秒,以防文件上传请求超限`)
  return new Promise(resolve => setTimeout(resolve, sec * 1000))
}

const AUTH = 'a73f9bfb-4e00-4f62-a67c-ffae85315326'
const startUploadFile = async function () {
  const files = fs.readdirSync(`${basePath}/build/images`)
  console.log("-->开始上传图片")
  console.log("-->图片文件总数" + files.length)
  for (const file of files) {

    await waitSecond(1.1 ** backoffCount++)
    console.log('->等待结束,开始上传')
    const formData = new FormData()
    const fileStream = fs.createReadStream(`${basePath}/build/images/${file}`)
    formData.append("file", fileStream)
    let url = "https://api.nftport.xyz/v0/files"
    let options = {
      method: "POST",
      headers: {
        Authorization: AUTH
      },
      body: formData
    }

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) {
          throw json.error.message
        }
        const fileName = path.parse(json.file_name).name
        let metaData = JSON.parse(fs.readFileSync(`${basePath}/build/json/${fileName}.json`))

        metaData.image = json.ipfs_url

        fs.writeFileSync(
          `${basePath}/build/json/${fileName}.json`,
          JSON.stringify(metaData, null, 2)
        )

        console.log(`<--${json.file_name} 已经上传 & ${fileName}.json 文件已经更新!`)
      })
      .catch((err) => console.error("error:" + err))
  }

}

module.exports = {
  startUploadFile
}
