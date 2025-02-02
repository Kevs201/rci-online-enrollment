import mongoose, { Document, Model, Schema } from "mongoose";

// Updated IOrder interface to include orderDataID, status, cancellationReason, and cancelledAt
export interface IOrder extends Document {
  courseId: string;
  userId: string;
  payment_info: object;
  LRNnumber: string;  // LRN number (unique and cannot be repeated)
  idPicture: {
    public_id: string;
    url: string;
  };
  fName: string;      // First name
  mName: string;      // Middle name
  lName: string;      // Last name
  phoneNumber: string;  // Extension name
  age: number;        // Age
  bday: Date;         // Birthday
  gender: string;     // Gender
  civilStatus: string;  // Civil status (e.g., married, single, etc.)
  city: string;         // City
  btgy: string;         // Barangay (local area)
  street: string;       // Street name
  province: string;     // Province
  school: string;       // School name
  schoolAddress: string;  // School address
  juniorHighSchool: string;
  juniorHighSchoolAddress: string;
  elementarySchool: string;
  elementarySchoolAddress: string;
  profileImage: {
    public_id: string;    // Public ID of the image
    url: string;          // URL of the image
  };
  orderDataID: string;    // New field for the order ID
  status: "pending" | "approved" | "canceled";  // New field for order status
  cancellationReason?: string;  // Optional field for cancellation reason
  cancelledAt?: Date;  // Optional field for cancellation date
}

// Updated order schema to include the new field orderDataID, status, and cancellation information
const orderSchema = new Schema<IOrder>(
  {
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
      required: true,  // Ensure LRNnumber is provided
      unique: true,    // Ensure LRNnumber is unique across all orders
      index: true,     // Create an index for quicker lookups
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
      unique: true,  // Ensure orderDataID is unique
    },
    status: {
      type: String,
      enum: ["pending", "approved", "canceled"],  // Ensure the status is one of these values
      required: true,
      default: "pending",  // Default status is "pending"
    },
    cancellationReason: {
      type: String,
      required: false,
    },
    cancelledAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

// Pre-save hook to generate orderDataID
orderSchema.pre("save", async function (next) {
  const order = this;

  if (order.isNew) {
    const currentYear = new Date().getFullYear().toString().slice(2); // Get the last two digits of the year

    // Find the last order made in the current year
    const lastOrder = await mongoose
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
const OrderModel: Model<IOrder> = mongoose.model("Order", orderSchema);

export default OrderModel;
