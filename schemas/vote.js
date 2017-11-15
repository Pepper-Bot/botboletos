var mongoose = require('mongoose');

var Quiz = mongoose.Schema({
    dateStart: {
        type: Date,
        default: Date.now
    },
    dateEnd: {
        type: Date,
        default: Date.now
    },

    fbId: String,
    fullName: String,


});



var Quiz = mongoose.Schema({
    dateStart: {
        type: Date,
        default: Date.now
    },
    dateEnd: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    employees: [{
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        role: {
            type: Schema.ObjectId,
            ref: "Roles"
        },
    }],
});

var Roles = new Schema({
    business_id: {
        type: Schema.ObjectId,
        ref: "Empresas"
    },
    name: {
        type: String,
        required: true
    },
    permissions: [{
        type: Schema.ObjectId,
        ref: "Permisos"
    }],
});

var Permisos = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('Quiz', Quiz);