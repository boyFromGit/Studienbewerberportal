const express = require('express');
const UserService = require("./UserService")
const router = express.Router();
const { isAuthenticated } = require('../../utils/AuthenticationUtils');
const { handleErrors } = require('../../utils/ErrorHandling');
const { mapId } = require('../../utils/MapId');

// get all users:
// the server only uses this module if the url is .../publicUsers
// '/user' would be wrong, because the following url would be interpreted: .../publicUsers/user
router.get('/', isAuthenticated, async function (req, res, next) {
    try {
        const isAdmin = req.tokenData.isAdministrator;
        let users = null;

        if (isAdmin) {
            users = await UserService.getAllUsers();
        }
        else {
            throw { name: "AuthorizationError", message: "User is not authorized to retrieve information about other users." };
        }
        res.header('Authorization', 'Bearer ' + req.tokenData.token);
        res.status(200).send(users.map((user) => {
            //console.log(user);
            const { password, ...partialObject } = user.toJSON();
            return mapId(partialObject, false);
        }));

    } catch (err) {

        console.error("UserRoute: router.get('/') Error: " + err.name, err);
        handleErrors(res, err);
    }
});

// create a new user:
router.post('/', isAuthenticated, async function (req, res, next) {
    try {
        const isAdmin = req.tokenData.isAdministrator;
        let user = null;

        if (isAdmin) {
            const { password, ...partialObject } = (await UserService.createUser(req.body)).toJSON();
            user = mapId(partialObject, false);
        }
        else {
            throw { name: "AuthorizationError", message: "User is not authorized to create other users." };
        }
        res.header('Authorization', 'Bearer ' + req.tokenData.token);
        res.status(201).send(user);

    } catch (err) {
        console.error("UserRoute: router.post('/') Error: " + err.name);
        handleErrors(res, err);
    }
});

// get one user:
// find a user by userID property using dynamic routing 
// requires req.params (property is mapped to the route parameters)
router.get('/:userID', isAuthenticated, async function (req, res, next) {
    try {
        const tokenUserID = req.tokenData.userID;
        const isAdmin = req.tokenData.isAdministrator;
        let user = null;

        if (tokenUserID === req.params.userID || isAdmin) {
            const { password, ...partialObject } = (await UserService.findUserByID(req.params.userID)).toJSON();
            user = mapId(partialObject, false);
        }
        else {
            throw { name: "AuthorizationError", message: "User is not authorized to retrieve information about other users." };
        }
        res.header('Authorization', 'Bearer ' + req.tokenData.token);
        res.status(200).send(user);

    } catch (err) {

        console.error("UserRoute: router.get('/:userID') Error: " + err.name, err);
        handleErrors(res, err);
    }
});

// update user:
router.put('/:userID', isAuthenticated, async function (req, res, next) {
    try {
        const userID = req.tokenData.userID;
        const isAdmin = req.tokenData.isAdministrator;
        let user = null;

        if (userID === req.params.userID || isAdmin) {
            const { password, ...partialObject } = (await UserService.updateUser(req.params.userID, req.body, isAdmin)).toJSON();
            user = mapId(partialObject, false);
        }
        else {
            throw { name: "AuthorizationError", message: "User is not authorized to update information of other users." };
        }
        res.header('Authorization', 'Bearer ' + req.tokenData.token);
        res.status(200).send(user);

    } catch (err) {

        console.error("UserRoute: router.put('/:userID') Error: " + err.name, err);
        handleErrors(res, err);
    }
});

// delete user:
router.delete('/:userID', isAuthenticated, async function (req, res, next) {
    try {
        const userID = req.tokenData.userID;
        const isAdmin = req.tokenData.isAdministrator;

        if (userID === req.params.userID || isAdmin) {
            await UserService.deleteUser(req.params.userID);
        }
        else {
            throw { name: "AuthorizationError", message: "User is not authorized to delete other users." };
        }
        res.header('Authorization', 'Bearer ' + req.tokenData.token);
        res.status(204).send("Deleted User with userID: " + req.params.userID);

    } catch (err) {

        console.error("UserRoute: router.delete('/:userID') Error: " + err.name, err);
        handleErrors(res, err);
    }
});

module.exports = router;