const { Controllers } = require('../')

module.exports = [
    {
        method: 'POST',
        path: '/setname',
        handler: Controllers.driftyInstaller.setName,
        config: {
            description: 'Set Application Name',
        },
    },
    {
        method: 'POST',
        path: '/installModules',
        handler: Controllers.driftyInstaller.installModules,
        config: {
            description: 'Installl Core Modules',
        },
    },
    {
        method: 'POST',
        path: '/getsteps',
        handler: Controllers.driftyInstaller.getSteps,
        config: {
            description: 'get curent step',
        },
    },
    {
        method: 'POST',
        path: '/complete',
        handler: Controllers.driftyInstaller.complete,
        config: {
            description: 'complete setup',
        },
    },
];
