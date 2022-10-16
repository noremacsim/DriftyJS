module.exports = (sequelize, DataTypes) => {
    const RecentlyPlayed = sequelize.define("RecentlyPlayed", {
      Channel: {
          type: DataTypes.STRING,
          allowNull: true,
      },
    });

    RecentlyPlayed.associate = function(models) {
      RecentlyPlayed.belongsTo(models.Client);
    };
    
    return RecentlyPlayed;
};
