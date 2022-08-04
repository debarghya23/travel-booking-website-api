const jwt = require('jsonwebtoken');
const createError = require('./error');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) return next(createError(401, 'you are not authenticated'));

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) return next(createError(403, 'token is not valid'));

        req.user = user;
        next();
    });
}

const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if ((req.params.id === req.user.id) || req.user.isAdmin) {
            next();
        }
        else {
            return next(createError(403, 'you are not authorized'));
        }
    });
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        }
        else {
            return next(createError(403, 'you are not an admin'));
        }
    });
};

module.exports = { verifyToken, verifyUser, verifyAdmin };