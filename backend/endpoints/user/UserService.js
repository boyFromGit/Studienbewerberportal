const User = require("./UserModel");

async function getAllUsers() {
    try {

        const users = await User.find();
        if (users) {
            return users;
        }
        else {
            throw { name: 'GetAllUsersError', message: "Users could not be retrieved." }
        }
    }
    catch (err) {
        throw err;
    }
}


async function createUser(user) {
    try {
        let newUser = await User.create(user);
        if (newUser) {
            return newUser;
        }
        else {
            throw { name: 'CreateUserError', message: "Users could not be created." }
        }
    } catch (err) {
        throw err;
    }
}

async function findUserByID(searchUserID, boolean) {
    try {
        let user = await User.findOne({ userID: searchUserID }).exec();

        if (user) {
            return user;
        }
        else {
            if(boolean){
                throw { name: 'AuthenticationError', message: "'" + searchUserID + "' is not a viable userID." };
            }
            throw { name: 'NotFoundError', message: "User with the ID: '" + searchUserID + "' could not be found." };
        }
    }
    catch (err) {
        throw err;
    }
}

async function updateUser(searchUserID, body, isAdmin) {
    try {
        let user = await findUserByID(searchUserID);
        const { firstName, lastName, password, isAdministrator } = body;
        // check if the data is filled and store in object
        const updatedFields = {};
        if (firstName) updatedFields.firstName = firstName;
        if (lastName) updatedFields.lastName = lastName;
        if (password) updatedFields.password = password;
        if(isAdmin){
            if(isAdministrator !== undefined) updatedFields.isAdministrator = isAdministrator;
        }
        Object.assign(user, updatedFields);
        await user.save();
        return user;
    }
    catch (err) {
        throw err;
    }
}

async function deleteUser(searchUserID) {
    try {
        // check if the user exists: if not throw error inside find function
        await findUserByID(searchUserID);
        await User.deleteOne({ userID: searchUserID }).exec();
    }
    catch (err) {
        throw err;
    }
}

async function createDefaultAdmin() {

    try {
        let defaultAdmin = await User.findOne({ userID: 'admin' });
        if (!defaultAdmin) {
            console.log("No admin user found. Creating a default admin account.");
            await User.create({ userID: 'admin', password: '123', isAdministrator: true });
        }
    } catch (err) {
        console.log(err);
    }
}

async function updatePublicUser(searchUserID, body) {
    try {
        let user = await findUserByID(searchUserID);
        Object.assign(user, body);
        await user.save();
        return user;
    }
    catch (err) {
        throw err;
    }
}

module.exports = {
    getAllUsers,
    createUser,
    findUserByID,
    updateUser,
    updatePublicUser,
    deleteUser,
    createDefaultAdmin
}
