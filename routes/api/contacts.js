const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/contacts');
const { validateBody, updateValidateBody } = require('../../middlewares');
const schemas = require('../../schemas/contacts')

router.get('/', ctrl.listContacts)

router.get('/:id', ctrl.getContactById)

router.post('/', validateBody(schemas.addSchema), ctrl.addContact)

router.delete('/:id', ctrl.removeContact)

router.put('/:id',  updateValidateBody(schemas.addSchema), ctrl.updateContact)

module.exports = router;
