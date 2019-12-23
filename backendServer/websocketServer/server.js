const mongodb = require("../models/mongodb")



module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("connected")
    socket["userId"] = null;
    socket.emit("welcome", "wellcome message")


    socket.on("userId", (userId) => {
      //users.push({ userId, socket });

      //inform every user's online room about users'online event, change rooms's user's online status 
      mongodb.Room.getRoomsByUserIdAndStatus(socket.userId, (room) => room.online == true, (err, onlineRooms) => {
        if (err) { console.log("getRoomsByUserIdAndStatus's error: ", err) }
        else (
          onlineRooms.forEach(roomId => {
            socket.join(roomId)
            socket.to(roomId).emit("iAmOnline", { "userId":socket.userId, roomId });
            mongodb.Room.changeMemberOnlineStatus(roomId, socket.userId, true, (err, data) => {
              if (err) console.log(err)
            })
          })
        )
      })

      // change offline rooms's user's online status
      mongodb.Room.getRoomsByUserIdAndStatus(socket.userId, (room) => room.online == false, (err, offlineRooms) => {
        if (err) { console.log("getRoomsByUserIdAndStatus's error: ", err) }
        else (
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
        )
      })
    })

    socket.on("send", (msg) => {
      socket.to(msg.roomId).emit("message",msg)
      mongodb.Room.CreateMessage(msg.roomId,
        msg.senderId,
        msg.type,
        msg.Body,
        msg.time,
        (err, savedMsg) => {
          if (err) console.log(err)
        })
    })

    socket.on("disconnect", function () {
      //auto left all joined rooms
      //set all room in DB to offline and return all room id
      mongodb.Room.getRoomsByUserIdAndStatus(socket.userId, (room) => true, (err, data) => {
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
