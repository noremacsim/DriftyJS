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
//MessageGroupID -> the message group

//MessageReadStatus
//MessageID
//UserId -> Who Has seen the message

//MessageGroups
//Title
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

//freinds
//User_ID
//Friend_ID
//Confirmed

//Basically firends will work like this
// User one will send a friend request so
// User_ID = 1
// Friend_ID = 2
// Confirmed = false;

// User 2 can see pending requests by gettings confirmed = false where Friend_ID = 2
// They can see their unconfirmed sent requests by doing confirmed = false where User_ID = 2
// Once User 2 has accepted the request we then add a new db entry
// User_ID = 2
// Friend_ID = 1
// Confirmed = true

// We will also update the original with confirmed true.

// Anytime we load a friends list it will just be where user_id = logged in user

// Posts
// This will be what people post a post will have content.
// a post will have reactions
// a post will have comments

// Comments
// comments will have content
// comments will have reactions
// comments will be related to posts

// reactions
// Wil either be releated to comment or post
// Will have the reaction type

// All of these will be associated with a user

// When loading the posts view we can get that users friend user_id = logged in user from friends
// Include, Posts