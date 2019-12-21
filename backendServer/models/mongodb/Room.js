const Mongodb = require('./Mongodb');
const mongoose = Mongodb.mongoose;
const ObjectId= mongoose.Types.ObjectId
const User=require("./User")

const RoomSchema = new mongoose.Schema({
    name: String,
    members: [{
            userId: ObjectId,
            online: Boolean
    }],
    messages: [{
        From: String,
        Type: String,
        Body: {
            type: String,
            default: ''
        },
        time: {
            type: Date,
            default: Date.now()
        },
    }],
    online: Boolean
});
const Room = mongoose.model('Room', RoomSchema);

const create = function (members,callback, name = null) {
    let room = new Room();
    room.name = name;
    room.members = members.map((idString) => ({
        userId: ObjectId(idString),
        online : false
    }))
    room.online=false;
    room.save(callback)
}

const findByUserId=function(userId, callback){
    Room.find({members: {$elemMatch: {userId}}}).exec(callback)
}

// Trả về mảng gồm các _id của các thành viên trong room
var GetRoomMembers = function (roomID, done) {
    Room.findById(roomID, 'members', function (err, doc) {
        done(err, doc.members.map((userId, online)=>userId))
    })
};

// Trả về true nế thêm tin nhắn thành công
var CreateMessage =  function (roomID, From, Type, Body, time, done) {
    let message = {
        From: From,
        Type: Type,
        Body: Body,
        time: time
    }
    GetRoomByID(roomID, function (err1,data) {
        if (err1) {return done(err1,null)}
        else{
            data.messages.push(message);
            data.save(function (err, doc) {
                return done(err,message)
            })
        }
    })    
} 

 // Chi viec post message, ham se tu kiem tra su ton tai cua room, neu chua co se them
 var GetLastTimeARoom = function(roomID, done){
    Room.findById(roomID, 'message', function (err, doc) {
        if(err) console.log(err);
        return done(err, doc.messages[doc.messages.length-1].time);

    })
}

// Trả về mảng gồm 'number' tin nhắn trong room. ví dụ cần lấy 5 tin nhắn thì number = 5.
var GetMessengerInRoom = function(roomID, number, done){
    Room.findById(roomID, 'messages', function (err, doc) {
        if(err) console.log(err);
        return done(err, doc.messages);

    }).limit(number)
}

var SetRoomStatus = function(roomID, status, done){
    Room.updateOne({_id: roomID}, {
         
            'online': status
    }, function () {
         console.log(('Update complete'));
         return done(null, true);
    })
}

var GetRoomStatus = function(roomID, done){
    Room.findById(roomID, 'online', function (err, doc) {
        if(err) console.log(err);
        return done(err, doc.isOnline);

    })
}


var GetRoomByID =  function (roomID, done) {
    Room.findById(roomID, 'members isOnline messages', function (err, doc) {
        if(err) console.log(err);
        return done(err, doc);

    })
};

const getOnlineRoomsByUserId=function(userId, callback){
    User.getRoomListByUserId(userId,(err, roomList)=>{
        if (err){
            console.log("cannot find room list of user having Id: "+userId)
            callback(err, roomList)
        }else{
            onlineRoom=roomList.filter((room)=>room.online)
            callback(err, onlineRoom)
        }

    })
}

const setAllRoomToOnline=function(userId){
    User.getRoomListByUserId(userId, (err, roomList)=>{
        if (err){
            console.log("cannot find room list of user having Id: "+userId)
        }else{
            roomList.forEach((roomId)=>{
                SetRoomStatus(roomId, true, (err, data)=>{
                    //do nothing
                })
            })
        }
    })
}

//create(["5df8a8176377113751905e66","5dc994237ca7c207c3b36ba1"],(err, data)=>{console.log(data)}, "test room")
// findByUserId("313131313131313131313132",(err, data)=>{
//     console.log(err, data)
// })

//CreateMessage("5dfa00d14a06793b0a76a342","5dfa00d14a06793b0a76a343","text","reply to the first one",1,(err,data)=>{console.log(data)})

module.exports = {
    findByUserId,
    create,
    GetLastTimeARoom,
    GetMessengerInRoom,
    GetRoomByID,
    GetRoomMembers,
    GetRoomStatus,
    SetRoomStatus,
    CreateMessage,
    getOnlineRoomsByUserId,
    setAllRoomToOnline
};

