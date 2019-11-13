const Mongodb = require('./Mongodb');
const mongoose = Mongodb.mongoose;

var PictureSchema = new mongoose.Schema({
    Type: String,
    body: String
    
});
var Picture = mongoose.model('Picture', PictureSchema);

var InsertPicture = function (picture, done) {
    picture.save(function (err, data) {
        if(err) return console.log(err);
        return done(data._id);
    })
};

var idExisted=(id)=>{
    var result
    Picture.find({"_id":id}).exec((error,data)=>{
        if (error || !data){result=false}
        else { result= true}
    })
    return result
}

module.exports = {
    PictureModel:  Picture,
    InsertPicture,
    idExisted
};