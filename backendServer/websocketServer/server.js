const mongodb = require("../models/mongodb")



module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("connected")
    userId = null;
    socket.emit("welcome", "wellcome message")


    socket.on("userId", (userId) => {
      //users.push({ userId, socket });

      mongodb.Room.getOnlineRoomsByUserId(userId, (err, onlineRooms) => {
        if (err) { console.log("getOnlineRoomById's error: ", err) }
        else (
          onlineRooms.array.forEach(roomId => {
            socket.join(roomId)
            socket.to(roomId).emit("iAmOnline", { userId, roomId });
          })
        )
        mongodb.Room.setAllRoomToOnline(userId)
      })
    })

    socket.on("send", (msg)=>{
      socket.to(msg.roomId).emit(msg)
      mongodb.Room.CreateMessage(msg.roomId, 
                                msg.senderId, 
                                msg.type, 
                                msg.Body, 
                                msg.time,
                                (err, savedMsg)=>{
                                  if (err) console.log(err)
                                })
    })

    socket.on("disconnect", function () {
      //set all room in DB to offline and return all room id
      // allRooms = ['1', '2', '3', '4'];
      // for (roomId in allRooms) {
      //   socket.to(allRooms[roomId]).emit("iAmOffline", userId);
      // }
      console.log(userId + " disconnected")
    })
  })
}
