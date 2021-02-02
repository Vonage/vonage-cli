#!/usr/bin/env node

const prompt = require('prompt')
const copydir = require('copy-dir')
const fs = require('fs')

prompt.start()

prompt.get(
    [
        {
            name: 'package',
            description: 'Plugin Name',
            type: 'string',
            required: true,
        },
        {
            name: 'description',
            default: 'A plugin for Vonage CLI',
            description: 'Description',
            type: 'string',
        },
        {
            name: 'author',
            description: 'Author',
            default: 'Vonage Dev Rel <devrel@vonage.com>',
            type: 'string',
        },
    ],
    function (err, result) {
        if (err) {
            return onErr(err)
        }

        let { author, description, package } = result

        let pkgName = result.package.replace(/\s/g, '').toLowerCase()

        let dir = `${process.cwd()}/packages/${pkgName}`

        if (!fs.existsSync(dir)) {
            console.log('Writing directory')
            fs.mkdirSync(dir)
        } else {
            // return onErr(new Error('Package already exists'))
        }

        //copy files to new location
        copydir.sync('./.template/files', dir, {
            utimes: true,
            mode: true,
            cover: true,
        })

        fs.renameSync(
            `${dir}/__tests__/PACKAGE.test.ts`,
            `${dir}/__tests__/${pkgName}.test.ts`
        )

        if (!fs.existsSync(`${dir}/src/commands/${pkgName}`)) {
            fs.mkdirSync(`${dir}/src/commands/${pkgName}`)
        }

        fs.copyFileSync(
            `${dir}/src/commands/index.ts`,
            `${dir}/src/commands/${pkgName}/index.ts`
        )

        fs.unlinkSync(`${dir}/src/commands/index.ts`)

        let testText = fs.readFileSync(
            `${dir}/__tests__/${pkgName}.test.ts`,
            'utf-8'
        )
        let newTestText = testText.replace(/PACKAGE/gim, pkgName)
        fs.writeFileSync(
            `${dir}/__tests__/${pkgName}.test.ts`,
            newTestText,
            'utf-8'
        )

        let indexText = fs.readFileSync(
            `${dir}/src/commands/${pkgName}/index.ts`,
            'utf-8'
        )
        let newIndexText = indexText
            .replace(/PACKAGE/gim, pkgName)
        fs.writeFileSync(
            `${dir}/src/commands/${pkgName}/index.ts`,
            newIndexText,
            'utf-8'
        )

        let jestConfig = fs.readFileSync(`${dir}/jest.config.js`, 'utf-8')
        let newJestConfig = jestConfig.replace(/PACKAGE/gim, pkgName)
        fs.writeFileSync(`${dir}/jest.config.js`, newJestConfig, 'utf-8')

        let packageJson = fs.readFileSync(`${dir}/package.json`, 'utf-8')
        let newPackageJson = packageJson
            .replace(/PACKAGE/gim, pkgName)
            .replace(/AUTHOR-NAME/gim, author)
            .replace(/DESCRIPTION/gim, description)
        fs.writeFileSync(`${dir}/package.json`, newPackageJson, 'utf-8')

        let readmeText = fs.readFileSync(`${dir}/README.md`, 'utf-8')
        let newReadmeText = readmeText.replace(/PACKAGE/gim, pkgName)
        fs.writeFileSync(`${dir}/README.md`, newReadmeText, 'utf-8')

        console.log('New package created.')
    }
)

function onErr(err) {
    console.log(err)
    return 1
}
