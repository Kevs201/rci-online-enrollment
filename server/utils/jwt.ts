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

// Cookie options for the access token
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000), // 1 hour expiration
  maxAge: accessTokenExpire * 60 * 60 * 1000, // 1 hour
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

// Send token and set session in Redis
export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken(); // Generate access token

  // Upload session to Redis (use user ID as a string for the key)
  redis.set(user._id.toString(), JSON.stringify(user));
  
  // Set secure cookie option for production environment
  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }

  // Set cookie for access token only (no refresh token anymore)
  res.cookie("access_token", accessToken, accessTokenOptions);

  // Send response with the access token and user data (no refresh token)
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
