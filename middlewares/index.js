const { validateBody, updateValidateBody, updateValidateFavorite } = require("./validateBody");
const isValidId = require("./isValidId");
const authenticate = require("./authenticate");

module.exports = {
    validateBody,
    updateValidateBody,
    updateValidateFavorite,
    isValidId,
    authenticate,
}