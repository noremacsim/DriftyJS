//For each contraint we will create a calanderconstrainevent

// this will have
// StartTime
// EndTime
// Date

// We will have middle able between contraintsevents and contraints

// We send a message to a message group
// The peaple in the group will be declared by middle table
// We load a group then its message
// We use Group Read status to show who has seen a message
// We use GroupMessageStatus to show whos typing in a group
// We use messageReaction to react to a message
// Makes Sense.... :D

//Messages
//UserID -> Who Sent the message
//message -> The Acctual Message
//sentDate -> The date and time the message has been sent
//MessageGroupID -> If We have messaged a group

//MessageReadStatus
//MessageID
//UserId -> Who Has seen the message

//MessageGroups
// Title
//MessageGroupStatusID

//MessageGroupStatus
//UserId
//Typing - true/false

//MessageMiddleGroups
//UserID
//MessageGroupID

//MessageReaction
//MessageId
//UserId
//Reaction