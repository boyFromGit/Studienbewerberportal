const userService = require('../user/UserService');
const jwt = require('jsonwebtoken');
const config = require('config');

async function createSessionToken(userID, password) {
    try {
        console.log('AuthenticationService: Create token.')

        if (!userID || !password) {
            throw { name: 'AuthenticationError', message: "Invalid Authentication Credentials" }
        }

        user = await userService.findUserByID(userID, true);

        await user.comparePassword(password);
        
        let issuedAt = new Date().getTime();
        let expirationTime = config.get('session.timeout');
        let expiresAt = issuedAt + (expirationTime * 1000);
        let privateKey = config.get("session.tokenKey");
        let token = jwt.sign({ 'userID': user.userID, 'isAdministrator': user.isAdministrator }, privateKey, { expiresIn: expiresAt, algorithm: 'HS256' });

        if (!token) {
            console.err("Token could not be created. Token is: " + token);
            throw { name: 'TokenError', message: "Session token could not be created. Token is: " + token }
        }

        console.log("Token creation succesful. Token: " + token);
        return { token, user };

    } catch (error) {
        throw error;
    }
}

module.exports = {
    createSessionToken
}