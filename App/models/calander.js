// The Calander db will have
// Title
// Description
// StartTime
// EndTime
// Startdate
// EndDate (If none set we net to have a max repeat length for 1yr or 2 for example)
//     Repeat (Weekly, Fortnightly, 4 Weeks, Monthly, yearly)
// DayNumber (1-7) This will be for if its a repeated slot in one of the weeks
// FixedDay () This will be if its for a fixed day of the month on a Monthly reat
// FixedMonth () This Will Be if its for a fixed Month of the year if its repeated yearly
// RoomID
// CompanyID
// GroupID

// CalanderUsersMiddle
// UserID
// CalanderID


module.exports = (sequelize, DataTypes) => {
    const Calendar = sequelize.define("Calendar", {
        title: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
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
        startDate: {
            type: DataTypes.DATEONLY,
            unique: false,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATEONLY,
            unique: false,
            allowNull: false,
        },
        dayNumber: {
            type: DataTypes.SMALLINT,
            unique: false,
            allowNull: true,
        },
        fixedDay: {
            type: DataTypes.SMALLINT,
            unique: false,
            allowNull: true,
        },
        fixedMonth: {
            type: DataTypes.SMALLINT,
            unique: false,
            allowNull: true,
        },
        repeat: {
            type: DataTypes.ENUM('weekly', 'fortnightly', '4 weeks', 'monthly', 'yearly'),
            unique: false,
            allowNull: true,
        },
    });

    Calendar.associate = function(models) {
        Calendar.hasMany(models.CalendarEvents);
        Calendar.belongsToMany(models.User, {through: 'calendar_users'});
    };

    return Calendar;
};
