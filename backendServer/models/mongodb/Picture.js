const Mongodb = require("./Mongodb");
const mongoose = Mongodb.mongoose;
//const genPicId = require("../../common").genPicId;
var PictureSchema = new mongoose.Schema({
    //_id: String,
    Type: String,
    group: String,
    body: String

});
let Picture = mongoose.model('Picture', PictureSchema);


  // Trả về _id của picture vừa insert 
var insert = function (Type, body, Group, done) {
    console.log("PICTURE-----------------insert")
    let picture = new Picture({
        Type: Type,
        body: body,
        group: Group,
    })
    picture.save(function (err, doc) {
        if(err) console.log(err);
        return done(err, doc._id);

    })
}
// Trả về đối tượng picture có các thuộc tính _id, Type, body, group 
var GetPictureByID = function(pictureID, done){
    console.log("PICTURE-----------------29", pictureID)
    Picture.findById(pictureID, function (err, doc) {
        if(err) console.log(err);
        return done(err, doc);

    })
}

// Trả về mảng picture có các thuộc tính _id, Type, body, group
var GetStickerByName = function(stickerName, done){
    console.log("PICTURE-----------------40")
    Picture.find({'Type': 'Sticker', 'group': stickerName}, function (err, doc) {
        if(err) console.log(err);
        return done(err, doc);

    })
}  

// Trả về mảng gồm tất cả các sticker 
var GetAllSticker = function(done){
    console.log("PICTURE-----------------50")
    Picture.find({'Type': 'Sticker'}, function (err, doc) {
        if(err) return done(err);
        return done(err, doc);

    })
}

module.exports = {
    insert,
    GetPictureByID,
    GetAllSticker,
    GetStickerByName
};


//-------------------------------******TEST******------------------------------

// insert('Sticker', '11sdwe11', 'Cat', function (data) {
//     console.log(data);
//
// })

// GetStickerByName('Cat', function (data) {
//     console.log(data);
// })

// GetPictureByID('5df5acb2d1bd6f03c9c0d7cb', function (err, data) {
//     console.log(data)
// })

// GetPictureByID('5df5acb2d1bd6f03c9c0d7cb', function (data) {
//                                  console.log(data)
// })