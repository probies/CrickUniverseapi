const express = require('express');
const router = express.Router();
const {
    create,
    read,
    remove,
    photo
} = require('../controllers/notes');

const { requireSignin, adminMiddleware, authMiddleware ,verifyMiddleware } = require('../controllers/auth');

router.post('/notes', requireSignin, adminMiddleware, create);
router.get('/notes/:slug', read);
router.delete('/notes/:slug', requireSignin, adminMiddleware, remove);
router.get('/notes/photo/:slug', photo);

module.exports = router;
