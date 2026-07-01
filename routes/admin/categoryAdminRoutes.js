const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/categoryController');

router.get('/', categoryController.adminIndex);
router.get('/new', categoryController.adminNewForm);
router.post('/', categoryController.adminCreate);
router.get('/edit/:id', categoryController.adminEditForm);
router.put('/:id', categoryController.adminUpdate);
router.get('/delete/:id', categoryController.adminDeleteConfirm);
router.delete('/:id', categoryController.adminDelete);

module.exports = router;
