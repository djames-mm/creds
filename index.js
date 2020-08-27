#!/usr/bin/env node

const glob = require('glob')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

let options = {
    cwd: process.cwd(),
}

glob('**/@(config|_ss_environment).php', options, function (er, files) {
    files = files.filter(file => !file.includes('vendor'))

    if(!files.length) {
        console.log(chalk.red('no config file found in current directory'))
        process.exit()
    }

    let filePath = path.join(options.cwd, files[0])
    
    let file = fs.readFileSync(filePath, 'utf-8')

    let regex = /\('SS_DEFAULT_ADMIN_(\w+)', '([^']+)'\);/

    let results = []

    for(let line of file.split('\n')) {
        let matches = line.match(regex)
        if(matches) {
            let key = matches[1]
            let value = matches[2]

            results.push({
                key,
                value
            })
        }
    }
    
    if(results.length) {
        console.log('found admin credentials in config file: ')
        for(let result of results) {
            console.log(`${chalk.green(result.key.padStart(10))}: ${result.value}`)
        }
    } else {
        console.log(chalk.red('no admin credentials found'))
    }

})