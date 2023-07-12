const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs/promises');
const { nanoid } = require('nanoid');

const { User } = require('../models/user');

const { HttpError, ctrlWrapper, sendEmail } = require('../helpers');

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const register = async (req, res) =>
{
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, "Email in use")
    }
    const hashPassword = await bcrypt.hash(password, 6);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
        "user": {
            email: newUser.email,
            subscription: newUser.subscription,
        }
    })
};

const verifyEmail = async (req, res) =>
{
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw HttpError(404, "User not found")
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });

    res.status(200).json({
        message: "Verification successful"
    })
};

const resendVerifyEmail = async (req, res) =>
{
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(400, "Missing required field email")
    }
    if (user.verify) {
        throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify email</a>`
    };

    await sendEmail(verifyEmail);

    res.status(200).json({
        message: "Verification email sent"
    })
};

const login = async (req, res) =>
{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong")
    }

    if (!user.verify) {
        throw HttpError(404, "User not found")
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong")
    }
    const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '23h'});
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        }
    })
};

const getCurrent = async (req, res) =>
{
    const {email, subscription} = req.user;
    if (!email) {
        throw HttpError(401, "Not authorized")
    }
    res.status(200).json({
        email,
        subscription,
    })
};

const logout = async(req, res) => {
    const { _id } = req.user;
    if (!_id ) {
        throw HttpError(401, "Not authorized")
    }
    await User.findByIdAndUpdate(_id, {token: ""});

    res.status(204).json();
}

const updateSubscription = async (req, res) =>
{
    const {_id} = req.user;
    const { subscription } = req.body;
    if (!subscription) {
        throw HttpError(404, "Not found");
    }
    await User.findByIdAndUpdate(_id, {subscription});
    res.json({
       message: `Your subscription has been changed to ${subscription}`
    })
};

const updateAvatar = async (req, res) =>
{
    const {_id} = req.user;
    const { path: tmpUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`
    const image = await Jimp.read(tmpUpload);
    await image.resize(250, 250).writeAsync(tmpUpload);
    const resultUpload = path.join(avatarsDir, filename);
    if (!tmpUpload) {
        await fs.unlink(tmpUpload);
        throw HttpError(401, "Not authorized");
    }    
    await fs.rename(tmpUpload, resultUpload);
    const avatarURL = path.join('avatars', filename);
    await User.findByIdAndUpdate(_id, { avatarURL });
    res.json({ avatarURL });
}

module.exports = {
    register: ctrlWrapper(register),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
}