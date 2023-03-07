const { Schema, model } = require('mongoose');
const Joi = require("joi");

const { handleMongooseError } = require("../helpers"); 

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const subscriptionList = ["starter", "pro", "business"];

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: emailRegexp,
        unique: true,
    },
    password: {
        type: String,
        minlength: 6,
        unique: true,
        required: [true, 'Set password for user'],
    },
    subscription: {
        type: String,
        enum: subscriptionList,
        default: "starter",
    },
    token: {
        type: String,
        default: "",
    }
}, {versionKey: false, timestamps: true});

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string().valid(...subscriptionList),
});

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
});

const subscriptionSchema = Joi.object({
    subscription: Joi.string().valid(...subscriptionList).required(),
});

const schemas = {
    registerSchema,
    loginSchema,
    subscriptionSchema,
};

const User = model('user', userSchema);

module.exports = {
    User,
    schemas,
}
