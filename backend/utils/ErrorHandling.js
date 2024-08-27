const errorCodes = new Map();
errorCodes.set('ValidationError', 400);
errorCodes.set('GetAllUsersError', 400);
errorCodes.set('CreateUserError', 400);
errorCodes.set('DefaultError', 400);
errorCodes.set('TokenError', 401);
errorCodes.set('InvalidPasswordError', 400);
errorCodes.set('AuthenticationError', 401);
errorCodes.set('AuthorizationError', 401);
errorCodes.set('MongoServerError', 400);
errorCodes.set('findDegreeCoursesError', 400);
errorCodes.set('CreateDegreeCourseError', 400);
errorCodes.set('NotFoundError', 404);
errorCodes.set('DataError', 400);

function handleErrors(res, err) {

    let errorName = err.name;
    if (errorCodes.has(errorName)) {
        res.status(errorCodes.get(errorName))
    }
    else {
        res.status(errorCodes.get('DefaultError'))
    }
    res.json(err)
}

module.exports = {
    handleErrors
};