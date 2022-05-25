const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

module.exports = (sequelize, DataTypes) => {

    const AuthToken = sequelize.define('AuthToken', {
        token: DataTypes.STRING,
        userAgent: DataTypes.STRING,
    }, {});

    AuthToken.associate = function({ User }) {
        AuthToken.belongsTo(User);
    };

    AuthToken.generate = async function(UserId, headers) {

        let userAgent = headers['user-agent'];

        if (!UserId) {
            throw new Error('AuthToken requires a user ID')
        }

        const token = jwt.sign({UserId: UserId},
            process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRY }
        );

        return AuthToken.create({token, UserId, userAgent})
    }

    return AuthToken;
};