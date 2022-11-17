//This will be whats been bookend in the calander th db will have

// CalanderEvents
// StartTime
// EndTime
// Date

//This will be joined to the calander table from a middle table
//calanderID
//CalanderEventsID
// No it wont well just have calanderid in here, a user will have multiple calnader froma  middle table

//So if wee book something in the calander create the event and associate them together

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
