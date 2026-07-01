const express = require('express');
const router = express.Router();
const audioController = require('../../controllers/audioController');

router.get('/', audioController.adminIndex);
router.get('/new', audioController.adminNewForm);
router.post('/', audioController.adminCreate);
router.get('/edit/:id', audioController.adminEditForm);
router.get('/preview/:id', audioController.adminPreview);
router.put('/:id', audioController.adminUpdate);
router.delete('/:id', audioController.adminDelete);

module.exports = router;
