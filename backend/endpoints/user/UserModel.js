const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// the /publicUser endpoint is just a test to learn how to set up a server
// authentication and password security is irrelevant in this endpoint
// the endpoint for that is: /user

const userSchema = new mongoose.Schema({

    userID: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    isAdministrator: { type: Boolean, default: false }
}, { timestamps: true }
);

// hash password:
userSchema.pre('save', async function (next) {
    try {
        // current user
        let user = this;

        // check if the password is already hashed:
        if (!user.isModified('password')) {

            return next();
        }
        // create random value
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        this.password = hashedPassword;
        next();
    }
    catch (error) {
        next(error);
    }
})

userSchema.methods.comparePassword = async function (userPassword) {
    try {
        match = await bcrypt.compare(userPassword, this.password);

        if (!match) {

            throw { name: 'InvalidPasswordError', message: "The password given is incorrect." };
        }
        return match;

    } catch (error) {
        throw(error);
    }
}

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;