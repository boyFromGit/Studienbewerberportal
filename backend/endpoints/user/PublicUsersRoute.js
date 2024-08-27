const express = require('express');
const UserService = require("./UserService")
const router = express.Router();
const { handleErrors } = require('../../utils/ErrorHandling');

// get all users:
// the server only uses this module if the url is .../publicUsers
// '/user' would be wrong, because the following url would be interpreted: .../publicUsers/user
router.get('/', async function (req, res, next) {
    try {
        const users = await UserService.getAllUsers()
        res.status(200).send(users);

    } catch (err) {

        console.error("UserRoute: router.get('/') Error: " + err.name, err);
        handleErrors(res, err);
    }
});

// create a new user:
router.post('/', async function (req, res, next) {
    try {
        let user = await UserService.createUser(req.body);
        res.status(201).send(user);

    } catch (err) {
        console.error("UserRoute: router.post('/') Error: " + err.name, err);
        handleErrors(res, err);
    }
});

// get one user:
// find a user by userID property using dynamic routing 
// requires req.params (property is mapped to the route parameters)
router.get('/:userID', async function (req, res, next) {
    try {

        let user = await UserService.findUserByID(req.params.userID);
        res.status(200).send(user);

    } catch (err) {

        console.error("UserRoute: router.get('/:userID') Error: " + err.name, err);
        handleErrors(res, err);
    }
});

// update user:
router.put('/:userID', async function (req, res, next) {
    try {
        let user = await UserService.updatePublicUser(req.params.userID, req.body);

        res.status(200).send(user);

    } catch (err) {

        console.error("UserRoute: router.put('/:userID') Error: " + err.name, err);
        handleErrors(res, err);
    }
});

// delete user:
router.delete('/:userID', async function (req, res, next) {
    try {
        await UserService.deleteUser(req.params.userID);

        res.status(204).send("Deleted User with userID: " + req.params.userID);
    } catch (err) {

        console.error("UserRoute: router.delete('/:userID') Error: " + err.name, err);
        handleErrors(res, err);
    }
});

module.exports = router;