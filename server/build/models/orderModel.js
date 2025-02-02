"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Updated order schema to include the new field orderDataID, status, and cancellation information
const orderSchema = new mongoose_1.Schema({
    courseId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    payment_info: {
        type: Object,
    },
    LRNnumber: {
        type: String,
        required: true,
        unique: true,
        index: true, // Create an index for quicker lookups
    },
    idPicture: {
        public_id: {
            required: true,
            type: String,
        },
        url: {
            required: true,
            type: String,
        },
    },
    fName: {
        type: String,
        required: true,
    },
    mName: {
        type: String,
        required: false, // Optional field
    },
    lName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true, // Optional field for name extension (e.g., Jr., III)
    },
    age: {
        type: Number,
        required: true,
    },
    bday: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    civilStatus: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    btgy: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    province: {
        type: String,
        required: true,
    },
    school: {
        type: String,
        required: true,
    },
    schoolAddress: {
        type: String,
        required: true,
    },
    juniorHighSchool: {
        type: String,
        required: true,
    },
    juniorHighSchoolAddress: {
        type: String,
        required: true,
    },
    elementarySchool: {
        type: String,
        required: true,
    },
    elementarySchoolAddress: {
        type: String,
        required: true,
    },
    profileImage: {
        public_id: {
            required: true,
            type: String,
        },
        url: {
            required: true,
            type: String,
        },
    },
    orderDataID: {
        type: String,
        required: true,
        unique: true, // Ensure orderDataID is unique
    },
    status: {
        type: String,
        enum: ["pending", "approved", "canceled"],
        required: true,
        default: "pending", // Default status is "pending"
    },
    cancellationReason: {
        type: String,
        required: false,
    },
    cancelledAt: {
        type: Date,
        required: false,
    },
}, { timestamps: true });
// Pre-save hook to generate orderDataID
orderSchema.pre("save", async function (next) {
    const order = this;
    if (order.isNew) {
        const currentYear = new Date().getFullYear().toString().slice(2); // Get the last two digits of the year
        // Find the last order made in the current year
        const lastOrder = await mongoose_1.default
            .model("Order")
            .findOne({ orderDataID: { $regex: `^${currentYear}` } })
            .sort({ orderDataID: -1 });
        let nextSequenceNumber = 1;
        if (lastOrder) {
            // Extract the last 4 digits of the orderDataID and increment it
            const lastID = lastOrder.orderDataID.slice(-4);
            nextSequenceNumber = parseInt(lastID, 10) + 1;
        }
        // Pad the sequence number to 4 digits
        const sequenceNumber = nextSequenceNumber.toString().padStart(4, '0');
        // Combine the current year (2 digits) and the sequence number (4 digits)
        order.orderDataID = `${currentYear}${sequenceNumber}`;
    }
    next();
});
// Create the model from the updated schema
const OrderModel = mongoose_1.default.model("Order", orderSchema);
exports.default = OrderModel;
