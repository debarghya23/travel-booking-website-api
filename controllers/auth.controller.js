const asyncWrapper = require("../asyncWrapper");
const { User } = require("../models/User.schema");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = asyncWrapper(async (request, response) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(request.body.password, salt);

        const user = await User.create(
            {
                username: request.body.username,
                email: request.body.email,
                password: hash,
            }
        );
        user.save();
        return response.status(201).json(user);

    } catch (error) {
        return response.status(500).json(error);
    }
});

const login = asyncWrapper(async (request, response) => {
    try {
        const user = await User.findOne(
            {
                username: request.body.username
            }
        );

        if (!user) return response.status(404).send({ message: "user not found" });

        const isCorrectPassword = await bcrypt.compare(request.body.password, user.password);

        if (!isCorrectPassword) return response.status(403).send({ message: "incorrect password" });

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);

        return response.cookie('access_token', token, { httpOnly: true }).status(200).send(user);

    } catch (error) {
        return response.status(500).json(error);
    }
});

module.exports = { register, login };
