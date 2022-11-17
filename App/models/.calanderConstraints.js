//This will be any contraints on the callander

// We could technically support multiple bookings on the same times, so we can set constraints on times, through a contraints table
//
// CalanderConstraints
// StartTime
// EndTime
// Startdate
// EndDate (If none set we net to have a max repeat length for 1yr or 2 for example)
// Repeat (Weekly, Fortnightly, 4 Weeks, Monthly, yearly)
// DayNumber (1-7) This will be for if its a repeated slot in one of the weeks
// FixedDay () This will be if its for a fixed day of the month on a Monthly reat
// FixedMonth () This Will Be if its for a fixed Month of the year if its repeated yearly
// Avalible - If the slot is availible or unavalible
// AvalibleAmount - the amount of users able to book the same slot, If a groups booking it we need to check there is enough users in group etc
// CompanyID
// GroupID
// RoomID

// We can set company constraints for everything
// Group Constraints for all users/rooms in groups
// Room Contraints for all user in room

// Avalible true will always come first before unavailble
// for example a group contraint might be 9am to 5pm availble
// but if a room was availble till 6 pm we still want to show availiblity for this at that time if set