const { User } = require("../models/User.schema");
const asyncWrapper = require("../asyncWrapper");

const getUsers = asyncWrapper(async (request, response) => {
    try {
        const users = await User.find();
        return response.status(200).json(users);

    } catch (error) {
        return response.status(500).json(error);
    }
});

const getUser = asyncWrapper(async (request, response) => {
    const { id } = request.params;

    const user = await User.findOne({id});

    if (!user) {
        return response.status(404).json({ message: `No user was found with id: ${id}` });
    }
    return response.status(200).json(user);
});

const updateUser = asyncWrapper(async (request, response) => {
    const { id } = request.params;

    const user = await User.findOneAndUpdate(id, request.body, { new: true, overwrite: true });
    await user.save();

    if (!user) {
        return response.status(404).json({ message: `No user was found with id: ${id}` });
    }
    return response.status(200).json(user);
});

const deleteUser = asyncWrapper(async (request, response) => {
    const { id } = request.params;

    const user = await User.findOneAndDelete(id);

    if (!user) {
        return response.status(404).json({ message: `No user was found with id: ${id}` });
    }
    return response.status(200).json(user);
}
);

module.exports = { getUsers, getUser, updateUser, deleteUser };
