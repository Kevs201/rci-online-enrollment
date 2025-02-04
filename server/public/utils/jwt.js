"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.accessTokenOptions = void 0;
require("dotenv").config();
const redis_1 = require("./redis");
// Set access token expiration to 60 minutes (1 hour)
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "60", 10); // 60 minutes = 1 hour
// Cookie options for the access token
exports.accessTokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
};
// Send token and set session in Redis
const sendToken = (user, statusCode, res) => {
    const accessToken = user.SignAccessToken(); // Generate access token
    // Upload session to Redis (use user ID as a string for the key)
    redis_1.redis.set(user._id.toString(), JSON.stringify(user));
    // Set secure cookie option for production environment
    if (process.env.NODE_ENV === "production") {
        exports.accessTokenOptions.secure = true;
    }
    // Set cookie for access token only (no refresh token anymore)
    res.cookie("access_token", accessToken, exports.accessTokenOptions);
    // Send response with the access token and user data (no refresh token)
    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
    });
};
exports.sendToken = sendToken;
