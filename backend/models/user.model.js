import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: function () {
        return !this.isGuest; // Only required if not a guest
      },
    },
    email: {
      type: String,
      required: function () {
        return !this.isGuest; // Only required if not a guest
      },
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.isGuest; // Only required if not a guest
      },
      minlength: [6, "Password must be at least 6 characters long"],
    },
    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
    role: {
      type: String,
      enum: ["customer", "admin", "guest"],
      default: "customer",
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    // New fields for guest users
    guestId: {
      type: String, // Unique identifier for guest users
      unique: true,
      sparse: true, // Allows this field to be unique but nullable
    },
    isGuest: {
      type: Boolean,
      default: false, // Set to true for guest users
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password before saving to database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;

// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: [6, "Password must be at least 6 characters long"],
//     },
//     cartItems: [
//       {
//         quantity: {
//           type: Number,
//           default: 1,
//         },
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product",
//         },
//       },
//     ],
//     role: {
//       type: String,
//       enum: ["customer", "admin"],
//       default: "customer",
//     },
//     resetPasswordToken: { type: String },
//     resetPasswordExpires: { type: Date },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Pre-save hook to hash password before saving to database
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   try {
//     // what is genSalt? It generates a salt for the bcrypt hashing function to use
//     // what is salt? It is a random value that is used with the password to generate a hash
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// userSchema.methods.comparePassword = async function (password) {
//   return bcrypt.compare(password, this.password);
// };

// // i can pass a third argument as the collection name in the database like this: mongoose.model("User", userSchema, "users") so that it will not pluralize the collection name and stores data in the users collection
// const User = mongoose.model("User", userSchema);

// export default User;
