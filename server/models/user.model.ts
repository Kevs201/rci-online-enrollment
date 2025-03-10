require('dotenv').config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Define the regex pattern for validating emails
const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Define IUser interface
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId; // explicitly define _id as ObjectId
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

// Create schema for user
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value); // email validation using the regex pattern
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String, // using 'courseId' instead of 'course'
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving to database
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // skip if password is not modified
  }
  this.password = await bcrypt.hash(this.password, 10); // hash password before saving
  next();
});

// sing Access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({id: this._id}, process.env.ACCESS_TOKEN || '',{
    expiresIn: "5m",
  });
}

// sign Refresh token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({id: this._id}, process.env.REFRESH_TOKEN || '',{
    expiresIn: "3d"
  });
}

// Compare password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the User model
const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;
