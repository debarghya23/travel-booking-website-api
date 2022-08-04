const express = require('express');
const router = express.Router();
const { createRoom, getRooms, getRoom, updateRoom, updateRoomAvailability, deleteRoom } = require("../controllers/Rooms.controller");
const { verifyAdmin } = require('../utils/verify');

router.post('/:hotelId', verifyAdmin, createRoom);
router.get('/', getRooms);
router.get('/:id', getRoom);
router.put('/:id/', updateRoom);
router.put('/:id/availability', updateRoomAvailability);
router.delete('/:id/:hotelId', verifyAdmin, deleteRoom);

// router.route('/').get(getRooms).post(createRoom);
// router.route('/:id').get(getRoom).put(updateRoom).delete(deleteRoom);

module.exports = router;