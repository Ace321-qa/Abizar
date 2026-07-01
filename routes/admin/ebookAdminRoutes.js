const express = require('express');
const router = express.Router();
const ebookController = require('../../controllers/ebookController');

router.get('/', ebookController.adminIndex);
router.get('/new', ebookController.adminNewForm);
router.post('/', ebookController.adminCreate);
router.get('/edit/:id', ebookController.adminEditForm);
router.get('/preview/:id', ebookController.adminPreview);
router.put('/:id', ebookController.adminUpdate);
router.delete('/:id', ebookController.adminDelete);

module.exports = router;
