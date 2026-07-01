const express = require('express');
const router = express.Router();
const pageController = require('../../controllers/pageController');

router.get('/', pageController.adminIndex);
router.get('/new', pageController.adminNewForm);
router.post('/', pageController.adminCreate);
router.get('/edit/:id', pageController.adminEditForm);
router.put('/:id', pageController.adminUpdate);
router.delete('/:id', pageController.adminDelete);

module.exports = router;
