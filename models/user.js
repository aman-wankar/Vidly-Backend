const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlenght: 5,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        minlenght: 5,
        maxlength: 255,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlenght: 8,
        maxlength: 1024,
    },
    isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin:this.isAdmin}, config.get("jwtPrivateKey"));
    return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
    const complexityOptions = {
        min: 10,
        max: 1024,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 4,
    };
    const schema = Joi.object({
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: passwordComplexity(complexityOptions),
    });

    return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
