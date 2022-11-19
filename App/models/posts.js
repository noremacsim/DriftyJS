module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define("Posts", {
        content: {
            type: DataTypes.TEXT('medium'),
            unique: false,
            allowNull: true,
        }
    });

    Posts.associate = function(models) {
        Posts.belongsTo(models.User);
    };

    return Posts;
};

