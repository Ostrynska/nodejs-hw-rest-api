const { validateBody, updateValidateBody, updateValidateFavorite } = require("./validateBody");
const isValidId = require("./isValidId");
const authenticate = require("./authenticate");
const upload = require("./upload");

module.exports = {
    validateBody,
    updateValidateBody,
    updateValidateFavorite,
    isValidId,
    authenticate,
    upload,
}