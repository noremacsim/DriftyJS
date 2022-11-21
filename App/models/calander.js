
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
