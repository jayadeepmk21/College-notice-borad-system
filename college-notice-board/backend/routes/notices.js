const express = require('express');
const {
  createNotice,
  getNotices,
  updateNotice,
  deleteNotice
} = require('../controllers/noticeController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', getNotices);
router.post('/', auth, createNotice);
router.put('/:id', auth, updateNotice);
router.delete('/:id', auth, deleteNotice);

module.exports = router;