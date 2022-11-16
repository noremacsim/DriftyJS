const Moment = require("moment");
const bcrypt = require('bcrypt');


module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Email Address Required'
                }
            }
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Username Required'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: DataTypes.STRING,
        middleName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        TwoFAEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        },
        activeDate: {
            type: DataTypes.DATE,
            get: function() {
                return Moment(this.getDataValue("date")).format("MMMM Do, YYYY");
            }
        },
    });

    User.associate = function(models) {
        User.hasMany(models.AuthToken);
        User.hasOne(models.TwoFactorAuthentication);
    };

    User.logout = async function(request) {
        const { AuthToken } = sequelize.models;

        let userAgent = request.headers['user-agent']

        if (!request.user) {
            return true;
        }

        if (!request.user.id) {
            return true;
        }

        await AuthToken.destroy(
            {where: {userAgent, UserId: request.user.id}}
        );
        return true;
    }

    User.authenticate = async function(username, password, request) {
        const { AuthToken } = sequelize.models;

        let userAgent = request.headers['user-agent']
        const user = await User.findOne({ where: { username } });

        if (bcrypt.compareSync(password, user.password)) {
            let UserId = user['id'];
            await AuthToken.destroy(
                {where: {userAgent, UserId}}
            );
            return user.authorize(request);
        }

        throw new Error('invalid password');
    }

    User.prototype.authorize = async function (request) {
        const { AuthToken } = sequelize.models;
        const user = this

        const authToken = await AuthToken.generate(this.id, request.headers);

        await user.addAuthToken(authToken);

        return { user, authToken }
    };

    return User;
};
