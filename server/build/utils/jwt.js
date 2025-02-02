"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.refreshTokenOptions = exports.accessTokenOptions = void 0;
require("dotenv").config();
const redis_1 = require("./redis");
// Set access token expiration to 60 minutes (1 hour)
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "60", 10); // 60 minutes = 1 hour
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200", 10); // 1200 minutes = 20 hours
// Cookie options for the access token
exports.accessTokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
};
// Cookie options for the refresh token
exports.refreshTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
};
// Send token and set session in Redis
const sendToken = (user, statusCode, res) => {
    const accessToken = user.SignAccessToken(); // Generate access token
    const refreshToken = user.SignRefreshToken(); // Generate refresh token
    // Upload session to Redis (use user ID as a string for the key)
    redis_1.redis.set(user.id.toString(), JSON.stringify(user));
    // Only set secure to true in production
    if (process.env.NODE_ENV === "production") {
        exports.accessTokenOptions.secure = true;
    }
    // Set cookies for access and refresh tokens
    res.cookie("access_token", accessToken, exports.accessTokenOptions);
    res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
    // Send response with token and user data
    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
    });
};
exports.sendToken = sendToken;
