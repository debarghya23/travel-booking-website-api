const express = require('express');
const router = express.Router();
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/users.controller');
const { verifyToken, verifyUser, verifyAdmin } = require('../utils/verify');


router.get('/checkauthentication', verifyToken, (req, res, next) => {
    return res.send({ message: 'you are logged in' });
});

router.get('/',verifyAdmin, getUsers);
router.get('/:id',verifyUser, getUser);
router.put('/:id',verifyUser, updateUser);
router.delete('/:id', verifyUser, deleteUser);

/* alternative approach*/

// router.route('/').get(getEmployees).post(createEmployee);
// router.route('/:id').get(getEmployee).put(updateEmployee).delete(deleteEmployee);

module.exports = router;