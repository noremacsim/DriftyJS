
module.exports = (sequelize, DataTypes) => {
    const CalendarEvents = sequelize.define("CalendarEvents", {
        startTime: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        },
        Date: {
            type: DataTypes.DATEONLY,
            unique: false,
            allowNull: false,
        },
    });

    CalendarEvents.associate = function(models) {
        CalendarEvents.belongsTo(models.Calendar);
    };

    return CalendarEvents;
};
