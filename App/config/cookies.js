module.exports = [
    {
        name: 'jwt',
        options: {
            ttl: null,
            isSecure: false,
            isHttpOnly: true,
            encoding: 'base64json',
            clearInvalid: true,
            strictHeader: true,
            path: '/',
        },
    },
    {
        name: 'isLoggedIn',
        options: {
            ttl: null,
            isSecure: false,
            isHttpOnly: true,
            encoding: 'base64json',
            clearInvalid: true,
            strictHeader: true,
            path: '/',
        },
    },
    {
        name: 'twoFAPassed',
        options: {
            ttl: null,
            isSecure: false,
            isHttpOnly: true,
            encoding: 'base64json',
            clearInvalid: true,
            strictHeader: true,
            path: '/',
        },
    },
];
