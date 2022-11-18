module.exports = (sequelize, DataTypes) => {
    const Friends = sequelize.define("Friends", {
        User_ID: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        friend_ID: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        confirmed: {
            type: DataTypes.BOOLEAN,
            unique: false,
        },
    });

    return Friends;
};

