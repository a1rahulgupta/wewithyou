const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
name: {type: String},
email:{ type: String},
subject: {type: String},
message:{type:String},
mobile : {type: Number}
}
,{
    collection: 'users'
});


module.exports = mongoose.model('User', User);
