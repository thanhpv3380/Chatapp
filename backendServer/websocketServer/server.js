const mongodb = require("../models/mongodb")

let sockets={}

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket["userId"] = null;
    socket.emit("welcome", "wellcome message")

    socket.on("userId", (userId) => {
      sockets[userId]=socket.id
      //users.push({ userId, socket });
      socket.userId=userId
      //inform every user's online room about users'online event, change rooms's user's online status 
      
      mongodb.Room.getRoomsByUserIdAndStatus(socket.userId, (room) => room.online == true, (err, onlineRooms) => {
        if (err) { console.log("getRoomsByUserIdAndStatus's error: ", err) }
        else {
          onlineRooms.forEach(roomId => {
            socket.join(roomId)
            socket.to(roomId).emit("iAmOnline", { "userId":socket.userId, roomId });
            mongodb.Room.changeMemberOnlineStatus(roomId, socket.userId, true, (err, data) => {
              if (err) console.log(err)
              else{
              }
            })
          })
        }
      })

      // change offline rooms's user's online status
      mongodb.Room.getRoomsByUserIdAndStatus(socket.userId, (room) => room.online == false, (err, offlineRooms) => {
        if (err) { console.log("getRoomsByUserIdAndStatus's error: ", err) }
        else {
          //console.log("offlineRooms---34: ",offlineRooms)
          offlineRooms.forEach(roomId => {
            socket.join(roomId)
            mongodb.Room.changeMemberOnlineStatus(roomId, socket.userId, true, (err, data) => {
              if (err) console.log(err)
            })
            mongodb.Room.countOnlineUser(roomId, (err, count) => {
              if (err) {
                console.log("Error when countOnlineUser: ", err)
              } else if (count == 1) {
                mongodb.Room.SetRoomStatus(roomId, true, (err, data) => {
                  //notthing
                })
              }
            })

          })
        }
      })
    })

    socket.on("send", (msg) => {
      //console.log(msg)
      io.to(msg.roomId).emit("message",msg)
      mongodb.Room.CreateMessage(msg.roomId,
        msg.from,
        msg.type,
        msg.Body,
        msg.time,
        (err, savedMsg) => {
          if (err) console.log(err)
          else console.log("")//savedMsg)
        })
    })

    socket.on("friendRequest",({from, to})=>{
      if(sockets.hasOwnProperty(to)){
        io.to(sockets[to]).emit("newFriendRequest",{from})
      }
      //add to wait list
    })

    socket.on("exceptFriendRequest",({friendId})=>{
      
    } )

    socket.on("disconnect", function () {
      //auto left all joined rooms
      //set all room in DB to offline and return all room id
      delete sockets[socket.userId]
      mongodb.Room.getRoomsByUserIdAndStatus(socket.userId, (room) => true, (err, onlineRooms) => {
        if (err) { console.log("getRoomsByUserIdAndStatus's error: ", err) }
        else {
          onlineRooms.forEach(roomId => {
            //inform left room event
            mongodb.Room.countOnlineUser(roomId, (err, count) => {
              if (count > 1) {
                io.in(roomId).emit("iAmOffline", {
                  roomId,
                  "userId": socket.userId
                })
              }
            })
            //change in online status in DB
            mongodb.Room.changeMemberOnlineStatus(roomId, socket.userId, false, (err, data) => {
              if (err) console.log(err)
              else {
              //nothing yet
              console.log("")}
            })
          })
        }
      })
      console.log(socket.userId + " disconnected")
    })

  })
}