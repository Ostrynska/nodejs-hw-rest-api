const express = require('express')

const router = express.Router()

<<<<<<< Updated upstream
router.get('/', async (req, res, next) => {
  res.json({ message: 'template message' })
})
=======
const ctrl = require('../../controllers/contacts');
const { validateBody, updateValidateBody, updateValidateFavorite, isValidId, authenticate } = require('../../middlewares');
>>>>>>> Stashed changes

router.get('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

<<<<<<< Updated upstream
router.post('/', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

module.exports = router
=======
router.get('/', authenticate, ctrl.listContacts)

router.get('/:id', authenticate, isValidId, ctrl.getContactById)

router.post('/', authenticate, validateBody(schemas.addSchema), ctrl.addContact)

router.delete('/:id', authenticate, isValidId, ctrl.removeContact)

router.put('/:id', authenticate, isValidId, updateValidateBody(schemas.addSchema), ctrl.updateContact)

router.patch("/:id/favorite", authenticate, isValidId, updateValidateFavorite(schemas.updateFavoriteSchema), ctrl.updateFavorite);

module.exports = router;
>>>>>>> Stashed changes
