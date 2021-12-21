const basePath = process.cwd()
const {startCreating, buildSetup} = require(`${basePath}/src/main.js`)
const {startUploadFile} = require(`${basePath}/utils/IKUtils/uploadFiles.js`)
const colors = require('colors')
const {program} = require('commander')
const version = require('./package.json').version
program.version(version)

function build () {
  buildSetup()
  startCreating()
}

console.log(
  '*******************************************************\n' +
  'NFT-Cli'.bgCyan + ' Version:' + version.bgRed + '\n' +
  'Made with ' + '❤'.red + ' @is4yNo-\n' +
  '*******************************************************'
)
program.command('build').action(build)
program.command('upload').action(startUploadFile)

program.parse(process.argv)
