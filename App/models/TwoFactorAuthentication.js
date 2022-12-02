const dotenv = require('dotenv');
const twoFactor = require('node-2fa');
dotenv.config();

module.exports = (sequelize, DataTypes) => {
    const TwoFactorAuthentication = sequelize.define(
        'TwoFactorAuthentication',
        {
            secret: DataTypes.STRING,
            uri: DataTypes.STRING,
            qr: DataTypes.STRING,
            userAgent: DataTypes.STRING,
        },
        {}
    );

    TwoFactorAuthentication.associate = function ({User}) {
        TwoFactorAuthentication.belongsTo(User);
    };

    TwoFactorAuthentication.generate = async function (User, headers) {
        let userAgent = headers['user-agent'];

        if (!User.id) {
            throw new Error('2Fa requires a user ID');
        }

        await TwoFactorAuthentication.destroy({
            where: {userAgent, UserId: User.id},
        });

        const newSecret = twoFactor.generateSecret({
            name: 'DriftyJS',
            account: User.id,
        });
        const createValues = {
            secret: newSecret['secret'],
            uri: newSecret['uri'],
            qr: newSecret['qr'],
            UserId: User.id,
            userAgent,
        };

        return TwoFactorAuthentication.create(createValues);
    };

    TwoFactorAuthentication.validate = async function (user, token, headers) {
        const {AuthToken} = sequelize.models;

        let userAgent = headers['user-agent'];

        if (!user.id) {
            throw new Error('2Fa requires a user ID');
        }

        const twoFA = await TwoFactorAuthentication.findOne({
            where: {UserId: user.id},
        });

        const verify = twoFactor.verifyToken(twoFA['secret'], token);

        if (!verify) {
            return false;
        }

        if (verify['delta'] !== 0) {
            return false;
        }

        user.TwoFAEnabled = true;
        user.save();

        let authToken = await AuthToken.findOne({
            where: {UserId: user.id, userAgent},
        });

        authToken.TwoFactorPassed = true;
        authToken.save();

        return true;
    };

    return TwoFactorAuthentication;
};
