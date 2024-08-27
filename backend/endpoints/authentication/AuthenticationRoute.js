const express = require('express');
const router = express.Router();
const { handleErrors } = require('../../utils/ErrorHandling');
const { mapId } = require('../../utils/MapId');
const authenticationService = require('./AuthenticationService');

router.get('/', async function (req, res, next) {
    try {

        console.log('AuthenticationRoute: Start creating token.');

        // check for basic auth header
        if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
            throw { name: "AuthenticationError", message: 'Missing Authorization Header' };
        }

        // verify auth credentials
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [userID, userPassword] = credentials.split(':');
        const { token, user } = await authenticationService.createSessionToken(userID, userPassword);

        res.header('Authorization', 'Bearer ' + token);
   
        // calling toJSON somehow excludes the internal attributes we get when using destructuring assignment (and we dont want them!)
        const { password, ...partialObject } = user.toJSON();
        userWithoutPassword = partialObject;
        res.status(200).send(userWithoutPassword);

    } catch (err) {

        console.error("AuthenticationRoute: router.get('/') Error: " + err.name, err);
        handleErrors(res, err);
    }
})

module.exports = router;

