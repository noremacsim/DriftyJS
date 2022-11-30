const { Models } = require('../');
const util = require("util");
const exec = util.promisify(require('child_process').exec);
const fs = require("fs");
const os = require("os");
const fsExtra = require('fs-extra');

module.exports = {
    name: 'driftyInstaller',

    setName: async (request, h) => {
        console.log(request.payload.name);
        let settings = await Models.Drifty_Settings.create(
            {name: request.payload.name, step: 1}
        );
        return true;
    },

    getSteps: async (request, h) => {
        let settings = await Models.Drifty_Settings.findOne();
        return settings.step
    },

    installModules: async (request, h) => {
        const constCoreModules = [
            'https://github.com/DriftyJS/DriftyJS-UserAuth-Module.git'
        ];

        for (const gitRepo of constCoreModules) {
            let repoUrl = gitRepo.split("/");
            let name = repoUrl.slice(-1)[0]
            try {
                const { stdout, stderr } = await exec(`git clone ${gitRepo} Modules/${name}`);
                console.log('stdout:', stdout);
                console.log('stderr:', stderr);
            } catch (e) {
                console.error(e);
            }
        }

        if (fs.existsSync(`Modules/${name}/themes`)) {
            fs.readdirSync(`Modules/${name}/themes`)
                .filter((folder) => folder.indexOf('.') !== 0 && folder !== 'index.js' && folder !== 'readme.md')
                .forEach((folder) => {
                    fsExtra.copy(`Modules/${name}/themes/${folder}/templates`, `App/themes/${folder}/`, err => {
                        if(err) return console.error(err);
                        console.log('success!');
                    });
                });
        }

        let settings = await Models.Drifty_Settings.findOne();
        settings.step = 2;
        settings.save();
        return true;
    },

    complete: async (request, h) => {
        const ENV_VARS = fs.readFileSync("./.env", "utf8").split(os.EOL);
        const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
            return line.match(new RegExp('INSTALLED'));
        }));
        ENV_VARS.splice(target, 1, `INSTALLED=1`);
        fs.writeFileSync("./.env", ENV_VARS.join(os.EOL));
        return true;
    },
};
