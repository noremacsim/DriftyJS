const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const fsExtra = require('fs-extra');

module.exports = {
    name: 'driftyInstaller',

    installModules: async (gitRepo, name) => {
        if (!fs.existsSync(`Modules/${name}`)) {
            try {
                const {stdout, stderr} = await exec(
                    `git clone ${gitRepo} Modules/${name}`
                );
                console.log('stdout:', stdout);
                console.log('stderr:', stderr);
            } catch (e) {
                console.error(e);
            }

            if (fs.existsSync(`Modules/${name}/themes`)) {
                fs.readdirSync(`Modules/${name}/themes`)
                    .filter(
                        (folder) =>
                            folder.indexOf('.') !== 0 &&
                            folder !== 'index.js' &&
                            folder !== 'readme.md'
                    )
                    .forEach((folder) => {
                        fsExtra.copy(
                            `Modules/${name}/themes/${folder}/templates`,
                            `App/themes/${folder}/`,
                            (err) => {
                                if (err) return console.error(err);
                                console.log('success!');
                            }
                        );

                        fsExtra.copy(
                            `Modules/${name}/themes/${folder}/assets`,
                            `App/assets/themes/${folder}/`,
                            (err) => {
                                if (err) return console.error(err);
                                console.log('success!');
                            }
                        );
                    });
            }
        }

        return true;
    },
};
