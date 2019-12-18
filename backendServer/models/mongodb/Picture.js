const Mongodb = require("./Mongodb");
const mongoose = Mongodb.mongoose;


const PictureSchema = new mongoose.Schema({
    //_id: String,
    Type: String,
    group: String,
    body: String

});
let Picture = mongoose.model('Picture', PictureSchema);


const insert = function (Type, body, Group, done) {
    let picture = new Picture({
        Type: Type,
        body: body,
        group: Group,
    })
    picture.save(function (err, doc) {
        if (err) return done(err);
        else return done(doc._id);

    })
}
// Trả về đối tượng picture có các thuộc tính _id, Type, body, group 
const GetPictureByID = function (pictureID, done) {
    Picture.findById(pictureID, function (err, doc) {
        if (err) return done(err);
        else return done(doc);

    })
}

// Trả về mảng picture có các thuộc tính _id, Type, body, group
const GetStickerByName = function (stickerName, done) {
    Picture.find({ 'Type': 'Sticker', 'group': stickerName }, function (err, doc) {
        if (err) return done(err);
        else return done(doc);

    })
}

// Trả về mảng gồm tất cả các sticker 
const GetAllSticker = function (done) {
    Picture.find({ 'Type': 'Sticker' }, function (err, doc) {
        if (err) return done(err);
        else return done(doc);

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

// GetPictureByID('5df5acb2d1bd6f03c9c0d7cb', function (data) {
//     console.log(data)
// })
