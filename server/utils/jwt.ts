require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

// Set access token expiration to 60 minutes (1 hour)
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "60", 10); // 60 minutes = 1 hour
const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "1200",
  10
); // 1200 minutes = 20 hours

// Cookie options for the access token
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000), // 1 hour expiration
  maxAge: accessTokenExpire * 60 * 60 * 1000, // 1 hour
  httpOnly: true,
  sameSite: "lax",
};

// Cookie options for the refresh token
export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000), // 20 hours expiration
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000, // 20 hours
  httpOnly: true,
  sameSite: "lax",
};

// Send token and set session in Redis
export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken(); // Generate access token
  const refreshToken = user.SignRefreshToken(); // Generate refresh token

  // Upload session to Redis (use user ID as a string for the key)
  redis.set(user.id.toString(), JSON.stringify(user));

  // Only set secure to true in production
  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }

  // Set cookies for access and refresh tokens
  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  // Send response with token and user data
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
