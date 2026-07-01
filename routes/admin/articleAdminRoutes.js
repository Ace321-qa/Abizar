const express = require('express');
const router = express.Router();
const articleController = require('../../controllers/articleController');

router.get('/', articleController.adminIndex);
router.get('/new', articleController.adminNewForm);
router.post('/', articleController.adminCreate);
router.get('/edit/:id', articleController.adminEditForm);
router.get('/preview/:id', articleController.adminPreview);
router.put('/:id', articleController.adminUpdate);
router.delete('/:id', articleController.adminDelete);

module.exports = router;
