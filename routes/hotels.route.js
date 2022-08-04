const express = require('express');
const router = express.Router();
const { createHotel, getHotels, getHotel, updateHotel, deleteHotel, getHotelscountByCity, getHotelscountByType, getHotelRooms } = require("../controllers/hotels.controller");
const { verifyAdmin } = require('../utils/verify');

router.post('/', verifyAdmin, createHotel);
router.get('/', getHotels);

router.get('/countByCity', getHotelscountByCity);
router.get('/countByType', getHotelscountByType);
router.get('/:id/rooms', getHotelRooms);

router.get('/:id', getHotel);
router.put('/:id', verifyAdmin, updateHotel);
router.delete('/:id', verifyAdmin, deleteHotel);

// router.route('/').get(getHotels).post(createHotel);
// router.route('/:id').get(getHotel).put(updateHotel).delete(deleteHotel);

module.exports = router;