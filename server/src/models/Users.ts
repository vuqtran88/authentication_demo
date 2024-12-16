import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
    userName: {
        type: String,
        required: true,
        unique: true,
    },

    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { collection: "users" });


UserSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 10);
    }

    next();
});

export const User = mongoose.model<IUser>("User", UserSchema);