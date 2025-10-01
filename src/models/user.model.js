// models/user.model.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { isPostalCode } from "validator";

const addressSchema = new mongoose.Schema({
    label: { type: String, required: [true, "Address label is required"] },
    street: { type: String, required: [true, "Street is required"] },
    city: { type: String, required: [true, "City is required"] },
    state: { type: String, required: [true, "State is required"] },
    zip: {
        type: String,
        required: [true, "ZIP code is required"],
        validate: {
            validator: function (v) {
                return isPostalCode(v, this.country);
            },
            message: (props) => `${props.value} is not a valid postal code for ${props.instance.country}`,
        },
    },
    country: { type: String, required: [true, "Country is required"] }
}, {
    _id: false
});

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [50, "Name can be max 50 characters"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Please provide a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        },
        role: {
            type: String,
            enum: ['customer', 'admin'],
            default: 'customer'
        },
        phone: {
            type: String,
            validate: {
                validator: (v) => !v || /^\+?\d{7,15}$/.test(v),
                message: (props) => `${props.value} is not a valid phone number`,
            },
        },
        addresses: [addressSchema],
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            }
        ],
    },
    {
        timestamps: true
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    if (this.role == "admin") return next();

});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
