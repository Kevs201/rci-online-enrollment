import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import orderModel, { IOrder } from "../models/orderModel";
import userModel from "../models/user.model";
import CourseModel, { ICourse } from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import notificationModel from "../models/notification.Model";
import { getAllORdersService, newOrder } from "../services/order.service";
import { redis } from "../utils/redis";
import cloudinary from "cloudinary"; // Assuming Cloudinary is already set up
import mongoose from "mongoose";

require("dotenv").config();

// create order (no payment logic)
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        courseId,
        fName,
        mName,
        lName,
        phoneNumber,
        age,
        bday,
        gender,
        civilStatus,
        city,
        btgy,
        street,
        province,
        school,
        schoolAddress,
        juniorHighSchool,
        juniorHighSchoolAddress,
        elementarySchool,
        elementarySchoolAddress,
        LRNnumber,
        profileImage,
        idPicture, // Extract both profileImage and idPicture from the body
      } = req.body as IOrder;

      const user = await userModel.findById(req.user?._id);

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      const courseExistInUser = user.courses.some(
        (course: any) => course._id.toString() === courseId
      );

      if (courseExistInUser) {
        return next(
          new ErrorHandler("You have already purchased this course", 400)
        );
      }

      const course: ICourse | null = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 400));
      }

      // Handle Profile Image upload (if provided)
      let profileImageData = null;
      if (profileImage) {
        const myCloudProfile = await cloudinary.v2.uploader.upload(
          profileImage,
          {
            folder: "orders", // Save the image in the "orders" folder in Cloudinary
          }
        );
        profileImageData = {
          public_id: myCloudProfile.public_id,
          url: myCloudProfile.secure_url,
        };
      }

      // Handle ID Picture upload (if provided)
      let idPictureData = null;
      if (idPicture) {
        const myCloudIdPicture = await cloudinary.v2.uploader.upload(
          idPicture,
          {
            folder: "orders", // Save the image in the "orders" folder in Cloudinary
          }
        );
        idPictureData = {
          public_id: myCloudIdPicture.public_id,
          url: myCloudIdPicture.secure_url,
        };
      }

      // Get the current year (last two digits)
      const currentYear = new Date().getFullYear().toString().slice(2); // Last 2 digits of the year

      // Count the number of orders placed in the current year
      const orderCount = await orderModel.countDocuments({
        createdAt: { $gte: new Date(`${new Date().getFullYear()}-01-01`) }, // Make sure it's from the start of the year
      });

      // Generate the orderDataID (e.g., "250001" for the 1st order in 2025)
      const orderDataID = `${currentYear}${(orderCount + 1)
        .toString()
        .padStart(4, "0")}`;

      const orderData: any = {
        orderDataID, // Automatically generated orderDataID
        courseId: course._id,
        userId: user._id,
        fName, // First name
        mName, // Middle name
        lName, // Last name
        phoneNumber, // Extension name
        age, // Age
        bday, // Birthday
        gender, // Gender
        civilStatus, // Civil status
        city, // City
        btgy, // Barangay
        street, // Street
        province, // Province
        school, // School name
        schoolAddress, // School address
        juniorHighSchool, // Junior high school
        juniorHighSchoolAddress, // Junior high school address
        elementarySchool, // Elementary school
        elementarySchoolAddress, // Elementary school address
        LRNnumber, // LRN number
        profileImage: profileImageData, // Save profileImage data if it exists
        idPicture: idPictureData, // Save idPicture data if it exists
      };

      // Save the order data in the OrderModel
      const newOrder = await orderModel.create(orderData);

      const mailData = {
        order: {
          _id: newOrder.orderDataID, // Use the orderDataID here
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-PH", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      // Add course to the user's list
      user.courses.push(course.id);

      // Update user data in redis
      await redis.set(req.user?.id, JSON.stringify(user));

      // Save the user with the new course
      await user.save();

      // Create a notification
      await notificationModel.create({
        user: user._id,
        title: "Someone new has enrolled",
        message: `You have a new student for ${course.name}`,
      });

      course.purchased += 1;

      res.status(201).json({
        success: true,
        order: newOrder, // Return the created order object
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all orders --- only for admin
export const getALlOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllORdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// delete order
export const deleteOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Find the order by its ID
      const order = await orderModel.findById(id);

      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }

      // Find the user who made the order
      const user = await userModel.findById(order.userId);
      if (user) {
        // If order has a courseId, remove it from the user's courses if it exists
        if (order.courseId) {
          // Check if user.courses is an array of objects and access the courseId in each object
          const courseIndex = user.courses.findIndex(
            (course: any) => course._id.toString() === order.courseId.toString()
          );

          if (courseIndex > -1) {
            user.courses.splice(courseIndex, 1); // Remove the courseId
            await user.save(); // Save the updated user data
          }
        }
      }

      // If order has a profile image, delete it from Cloudinary (if needed)
      if (order.profileImage?.public_id) {
        await cloudinary.v2.uploader.destroy(order.profileImage.public_id);
      }

      // Delete the order
      await order.deleteOne();

      // Optionally, delete any related cache in Redis
      await redis.del(id);

      // Send a response back
      res.status(200).json({
        success: true,
        message: "Order deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// View a single order
export const getSingleOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = req.params.id; // Order ID passed as a parameter

      // Fetch the order directly from the database
      const order = await orderModel
        .findById(orderId)
        .populate("userId") // Populate the user details
        .populate("courseId"); // Populate the course details (if needed)

      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }

      // Return the order data in the response
      return res.status(200).json({
        success: true,
        order,
      });
    } catch (error: any) {
      console.error("Error in fetching order:", error);
      return next(new ErrorHandler(error.message, 500)); // Handle errors
    }
  }
);


export const updateOrderStatus = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, cancellationReason } = req.body;
      const { id: orderId } = req.params;  // Retrieve orderId from URL parameter

      // Validate the orderId format
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return next(new ErrorHandler("Invalid orderId", 400));
      }

      // Find the order by its ID and populate the courseId field
      const order = await orderModel.findById(orderId).populate('courseId');
      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }

      // If the new status is "canceled", ensure that the cancellationReason is provided
      if (status === "canceled" && !cancellationReason) {
        return next(new ErrorHandler("Cancellation reason is required", 400));
      }

      // If the order is already canceled and the user wants to approve it, proceed
      if (status === "approved" && order.status === "canceled") {
        // If the order is approved after being canceled, reset cancellation-related fields
        order.cancellationReason = undefined;
        order.cancelledAt = undefined;
      }

      // Update the status
      order.status = status;

      if (status === "canceled") {
        // If canceled, record the cancellation reason
        order.cancellationReason = cancellationReason;
        order.cancelledAt = new Date();

        // Remove the course from the user's courses if the order is canceled
        const user = await userModel.findById(order.userId);
        if (user) {
          const courseIndex = user.courses.findIndex((course: any) => course._id.toString() === order.courseId.toString());
          if (courseIndex > -1) {
            user.courses.splice(courseIndex, 1);  // Remove the course
            await user.save();
          }
        }
      }

      // Save the updated order
      await order.save();

      // Notify the user about the status update
      const user = await userModel.findById(order.userId);
      if (user) {
        const message = status === "approved" ? 
          `Your form for ${order?.courseId} has been approved!` :
          `Your form for ${order?.courseId} has been canceled. Reason: ${cancellationReason || 'No reason provided'}`;

        await notificationModel.create({
          user: user._id,
          title: `Order Status Update`,
          message,
        });

        // Send an email to the user with the order details
        await sendMail({
          email: user.email,
          subject: "Order Status Update",
          template: "order-status-update.ejs",  // Path to the email template
          data: { order, status, cancellationReason },  // Pass the entire order object
        });
      }

      res.status(200).json({
        success: true,
        message: `Order status updated to ${status}`,
      });
    } catch (error: any) {
      console.error("Error in updating order status:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);





