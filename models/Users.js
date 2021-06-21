const {Schema, model} = require('mongoose')

const Users = new Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    email: {type: String, required: true},
    sex: {type: String, required: true},
    phone: {type: String, required: true},
    cars: {type: Array},
    password: {type: String, required: false}
})

module.exports = model("Users", Users)