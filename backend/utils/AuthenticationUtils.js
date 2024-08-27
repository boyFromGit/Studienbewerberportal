const jwt = require('jsonwebtoken');
const config = require('config');
const { handleErrors } = require('./ErrorHandling');

async function isAuthenticated(req, res, next) {
    try {
        if (!req.headers.authorization) {
            throw { name: "AuthenticationError", message: 'Missing Authorization Header' };
        }

        let token = req.headers.authorization.split(" ")[1];

        if(!token) {
            throw { name: "AuthenticationError", message: 'Token is ' + token };
        }

        let privateKey = config.get('session.tokenKey');

        // verify token and save the payload
        let payload = await jwt.verify(token, privateKey, { algorithm: "HS256" })
        
        // append token to payload
        payload.token = token;

        // append payload to req object
        // example content: { userID: 'admin', isAdministrator: true, iat: 1700040002, exp: 1701740342158, token: blabla }
        req.tokenData = payload;
        return next();

    } catch (error) {
        console.error(error);
        handleErrors(res, error);
    }
}

module.exports = {
    isAuthenticated
};