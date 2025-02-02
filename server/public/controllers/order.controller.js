"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getSingleOrder = exports.deleteOrder = exports.getALlOrders = exports.createOrder = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const user_model_1 = __importDefault(require("../models/user.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const notification_Model_1 = __importDefault(require("../models/notification.Model"));
const order_service_1 = require("../services/order.service");
const redis_1 = require("../utils/redis");
const cloudinary_1 = __importDefault(require("cloudinary")); // Assuming Cloudinary is already set up
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv").config();
// create order (no payment logic)
exports.createOrder = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { courseId, fName, mName, lName, phoneNumber, age, bday, gender, civilStatus, city, btgy, street, province, school, schoolAddress, juniorHighSchool, juniorHighSchoolAddress, elementarySchool, elementarySchoolAddress, LRNnumber, profileImage, idPicture, // Extract both profileImage and idPicture from the body
         } = req.body;
        const user = yield user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        if (!user) {
            return next(new ErrorHandler_1.default("User not found", 400));
        }
        const courseExistInUser = user.courses.some((course) => course._id.toString() === courseId);
        if (courseExistInUser) {
            return next(new ErrorHandler_1.default("You have already purchased this course", 400));
        }
        const course = yield course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 400));
        }
        // Handle Profile Image upload (if provided)
        let profileImageData = null;
        if (typeof profileImage === 'string') {
            const myCloudProfile = yield cloudinary_1.default.v2.uploader.upload(profileImage, {
                folder: 'orders', // Save the image in the "orders" folder in Cloudinary
            });
            profileImageData = {
                public_id: myCloudProfile.public_id,
                url: myCloudProfile.secure_url,
            };
        }
        else {
            // Handle case where profileImage is not a string
            console.error("Profile image must be a string URL or file path.");
        }
        // Handle ID Picture upload (if provided)
        let idPictureData = null;
        if (typeof idPicture === 'string') {
            const myCloudIdPicture = yield cloudinary_1.default.v2.uploader.upload(idPicture, {
                folder: "orders", // Save the image in the "orders" folder in Cloudinary
            });
            idPictureData = {
                public_id: myCloudIdPicture.public_id,
                url: myCloudIdPicture.secure_url,
            };
        }
        else {
            console.error("idPicture image must be a string URL or file path");
        }
        // Get the current year (last two digits)
        const currentYear = new Date().getFullYear().toString().slice(2); // Last 2 digits of the year
        // Count the number of orders placed in the current year
        const orderCount = yield orderModel_1.default.countDocuments({
            createdAt: { $gte: new Date(`${new Date().getFullYear()}-01-01`) }, // Make sure it's from the start of the year
        });
        // Generate the orderDataID (e.g., "250001" for the 1st order in 2025)
        const orderDataID = `${currentYear}${(orderCount + 1)
            .toString()
            .padStart(4, "0")}`;
        const orderData = {
            orderDataID,
            courseId: course._id,
            userId: user._id,
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
            profileImage: profileImageData,
            idPicture: idPictureData, // Save idPicture data if it exists
        };
        // Save the order data in the OrderModel
        const newOrder = yield orderModel_1.default.create(orderData);
        const mailData = {
            order: {
                _id: newOrder.orderDataID,
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                }),
            },
        };
        const html = yield ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/order-confirmation.ejs"), { order: mailData });
        try {
            if (user) {
                yield (0, sendMail_1.default)({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "order-confirmation.ejs",
                    data: mailData,
                });
            }
        }
        catch (error) {
            return next(new ErrorHandler_1.default(error.message, 500));
        }
        // Add course to the user's list
        user.courses.push(course.id);
        // Update user data in redis
        yield redis_1.redis.set((_b = req.user) === null || _b === void 0 ? void 0 : _b.id, JSON.stringify(user));
        // Save the user with the new course
        yield user.save();
        // Create a notification
        yield notification_Model_1.default.create({
            user: user._id,
            title: "Someone new has enrolled",
            message: `You have a new student for ${course.name}`,
        });
        course.purchased += 1;
        res.status(201).json({
            success: true,
            order: newOrder, // Return the created order object
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
// get all orders --- only for admin
exports.getALlOrders = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, order_service_1.getAllORdersService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
// delete order
exports.deleteOrder = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { id } = req.params;
        // Find the order by its ID
        const order = yield orderModel_1.default.findById(id);
        if (!order) {
            return next(new ErrorHandler_1.default("Order not found", 404));
        }
        // Find the user who made the order
        const user = yield user_model_1.default.findById(order.userId);
        if (user) {
            // If order has a courseId, remove it from the user's courses if it exists
            if (order.courseId) {
                // Check if user.courses is an array of objects and access the courseId in each object
                const courseIndex = user.courses.findIndex((course) => course._id.toString() === order.courseId.toString());
                if (courseIndex > -1) {
                    user.courses.splice(courseIndex, 1); // Remove the courseId
                    yield user.save(); // Save the updated user data
                }
            }
        }
        // If order has a profile image, delete it from Cloudinary (if needed)
        if ((_c = order.profileImage) === null || _c === void 0 ? void 0 : _c.public_id) {
            yield cloudinary_1.default.v2.uploader.destroy(order.profileImage.public_id);
        }
        // Delete the order
        yield order.deleteOne();
        // Optionally, delete any related cache in Redis
        yield redis_1.redis.del(id);
        // Send a response back
        res.status(200).json({
            success: true,
            message: "Order deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
// View a single order
exports.getSingleOrder = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id; // Order ID passed as a parameter
        // Fetch the order directly from the database
        const order = yield orderModel_1.default
            .findById(orderId)
            .populate("userId") // Populate the user details
            .populate("courseId"); // Populate the course details (if needed)
        if (!order) {
            return next(new ErrorHandler_1.default("Order not found", 404));
        }
        // Return the order data in the response
        return res.status(200).json({
            success: true,
            order,
        });
    }
    catch (error) {
        console.error("Error in fetching order:", error);
        return next(new ErrorHandler_1.default(error.message, 500)); // Handle errors
    }
}));
exports.updateOrderStatus = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, cancellationReason } = req.body;
        const { id: orderId } = req.params; // Retrieve orderId from URL parameter
        // Validate the orderId format
        if (!mongoose_1.default.Types.ObjectId.isValid(orderId)) {
            return next(new ErrorHandler_1.default("Invalid orderId", 400));
        }
        // Find the order by its ID and populate the courseId field
        const order = yield orderModel_1.default.findById(orderId).populate('courseId');
        if (!order) {
            return next(new ErrorHandler_1.default("Order not found", 404));
        }
        // If the new status is "canceled", ensure that the cancellationReason is provided
        if (status === "canceled" && !cancellationReason) {
            return next(new ErrorHandler_1.default("Cancellation reason is required", 400));
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
            const user = yield user_model_1.default.findById(order.userId);
            if (user) {
                const courseIndex = user.courses.findIndex((course) => course._id.toString() === order.courseId.toString());
                if (courseIndex > -1) {
                    user.courses.splice(courseIndex, 1); // Remove the course
                    yield user.save();
                }
            }
        }
        // Save the updated order
        yield order.save();
        // Notify the user about the status update
        const user = yield user_model_1.default.findById(order.userId);
        if (user) {
            const message = status === "approved" ?
                `Your form for ${order === null || order === void 0 ? void 0 : order.courseId} has been approved!` :
                `Your form for ${order === null || order === void 0 ? void 0 : order.courseId} has been canceled. Reason: ${cancellationReason || 'No reason provided'}`;
            yield notification_Model_1.default.create({
                user: user._id,
                title: `Order Status Update`,
                message,
            });
            // Send an email to the user with the order details
            yield (0, sendMail_1.default)({
                email: user.email,
                subject: "Order Status Update",
                template: "order-status-update.ejs",
                data: { order, status, cancellationReason }, // Pass the entire order object
            });
        }
        res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
        });
    }
    catch (error) {
        console.error("Error in updating order status:", error);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
