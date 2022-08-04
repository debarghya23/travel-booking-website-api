const { Room } = require("../models/Room.schema");
const asyncWrapper = require("../asyncWrapper");
const { Hotel } = require("../models/Hotel.schema");

const createRoom = asyncWrapper(async (request, response) => {
    const hotelId = request.params.hotelId;
    try {
        const room = await Room.create(request.body);
        const savedRoom = await room.save();
        try {
            await Hotel.findByIdAndUpdate(hotelId, { $push: { rooms: savedRoom.id } })
        } catch (error) {
            return response.status(500).json(error);
        }
        return response.status(201).json(room);

    } catch (error) {
        return response.status(500).json(error);
    }
});

const getRooms = asyncWrapper(async (request, response) => {
    try {
        const rooms = await Room.find();
        return response.status(200).json(rooms);

    } catch (error) {
        return response.status(500).json(error);
    }
});

const getRoom = asyncWrapper(async (request, response) => {
    const { id } = request.params;

    const room = await Room.findOne(id);

    if (!room) {
        return response.status(404).json({ message: `No room was found with id: ${id}` });
    }
    return response.status(200).json(room);
});

const updateRoom = asyncWrapper(async (request, response) => {
    const { id } = request.params;

    const room = await Room.findOneAndUpdate({ id: id }, request.body, { new: true, overwrite: true });

    if (!room) {
        return response.status(404).json({ message: `No room was found with id: ${id}` });
    }
    return response.status(200).json(room);
});

const updateRoomAvailability = asyncWrapper(async (request, response) => {
    const { id } = request.params;

    const room = await Room.updateOne({ "roomNumbers._id": id }, {
        $push: {
            "roomNumbers.$.unavailableDates": request.body.dates
        }
    });

    if (!room) {
        return response.status(404).json({ message: `No room was found with id: ${id}` });
    }
    return response.status(200).json(room);
});

const deleteRoom = asyncWrapper(async (request, response) => {
    const { id, hotelId } = request.params;

    const room = await Room.findOneAndDelete({ id: id });
    try {
        await Hotel.findByIdAndUpdate(hotelId, { $pull: { rooms: id } })
    } catch (error) {
        return response.status(500).json(error);
    }
    if (!room) {
        return response.status(404).json({ message: `No room was found with id: ${id}` });
    }
    return response.status(200).json(room);
}
);

module.exports = { createRoom, getRooms, getRoom, updateRoom, updateRoomAvailability, deleteRoom };
