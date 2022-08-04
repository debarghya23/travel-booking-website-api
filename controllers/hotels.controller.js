const { Hotel } = require("../models/Hotel.schema");
const { Room } = require("../models/Room.schema");
const asyncWrapper = require("../asyncWrapper");

const createHotel = asyncWrapper(async (request, response) => {
    try {
        const hotel = await Hotel.create(request.body);
        await hotel.save();
        return response.status(201).json(hotel);

    } catch (error) {
        return response.status(500).json(error);
    }
});

const getHotels = asyncWrapper(async (request, response) => {
    const { min, max, ...rest } = request.query;
    try {
        const hotels = await Hotel.find({
            ...rest,
            cheapestPrice: { $gte: min | 0, $lte: max || 10000 }
        }).limit(request.query.limit);
        return response.status(200).json(hotels);

    } catch (error) {
        return response.status(500).json(error);
    }
});

const getHotelscountByCity = asyncWrapper(async (request, response) => {
    const cities = request.query.cities.split(',');
    try {
        const hotels = await Promise.all(cities.map(city => {
            return Hotel.countDocuments({ city });
        }))
        return response.status(200).json(hotels);

    } catch (error) {
        return response.status(500).json(error);
    }
});

const getHotelscountByType = asyncWrapper(async (request, response) => {
    try {
        const numberOfHotels = await Hotel.countDocuments({ type: "hotel" });
        const numberOfApartments = await Hotel.countDocuments({ type: "apartment" });
        const numberOfVillas = await Hotel.countDocuments({ type: "villa" });
        const numberOfCabins = await Hotel.countDocuments({ type: "cabin" });
        const numberOfCottages = await Hotel.countDocuments({ type: "cottage" });

        return response.status(200).json([
            { type: "hotel", count: numberOfHotels },
            { type: "apartment", count: numberOfApartments },
            { type: "villa", count: numberOfVillas },
            { type: "cabin", count: numberOfCabins },
            { type: "cottage", count: numberOfCottages }
        ]);

    } catch (error) {
        return response.status(500).json(error);
    }
});

const getHotel = asyncWrapper(async (request, response) => {
    const { id } = request.params;

    const hotel = await Hotel.findOne({ _id:id });

    if (!hotel) {
        return response.status(404).json({ message: `No hotel was found with id: ${id}` });
    }
    return response.status(200).json(hotel);
});

const updateHotel = asyncWrapper(async (request, response) => {
    const { id } = request.params;

    const hotel = await Hotel.findOneAndUpdate({ _id: id }, request.body, { new: true, overwrite: true });
    await hotel.save();

    if (!hotel) {
        return response.status(404).json({ message: `No hotel was found with id: ${id}` });
    }
    return response.status(200).json(hotel);
});

const deleteHotel = asyncWrapper(async (request, response) => {
    const { id } = request.params;

    const hotel = await Hotel.findOneAndDelete({ _id: id });

    if (!hotel) {
        return response.status(404).json({ message: `No hotel was found with id: ${id}` });
    }
    return response.status(200).json(hotel);
}
);

const getHotelRooms = asyncWrapper(async (request, response) => {
    const { id } = request.params;

    const hotel = await Hotel.findOne({ id });

    const rooms = await Promise.all(hotel.rooms.map((room) => {
        return Room.findById(room);
    }))

    if (!hotel) {
        return response.status(404).json({ message: `No hotel was found with id: ${id}` });
    }
    return response.status(200).json(rooms);
});

module.exports = { createHotel, getHotels, getHotel, getHotelRooms, updateHotel, deleteHotel, getHotelscountByCity, getHotelscountByType };
