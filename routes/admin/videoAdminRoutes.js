const express = require('express');
const router = express.Router();
const videoController = require('../../controllers/videoController');

router.get('/', videoController.adminIndex);
router.get('/new', videoController.adminNewForm);
router.post('/', videoController.adminCreate);
router.get('/edit/:id', videoController.adminEditForm);
router.put('/:id', videoController.adminUpdate);
router.delete('/:id', videoController.adminDelete);

module.exports = router;
