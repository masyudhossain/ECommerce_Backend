// seeder/adminSeeder.js

import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

const seedAdmin = async () => {
    const email = process.env.FIRST_ADMIN_EMAIL;
    const password = process.env.FIRST_ADMIN_PASSWORD;

    // Check if admin already exists
    const existingAdmin = await User.exists({ email, role: "admin" });
    if (existingAdmin) {
        return; // Admin exists, do nothing
    }

    // Create admin
    const admin = await User.create({
        name: "Super Admin",
        email,
        password,
        role: "admin",
    });

    console.log("Admin created successfully!");
    console.log("Email:", admin.email);
    console.log("Password:", password);
    console.log("Token:", generateToken(admin._id));
};

export default seedAdmin;
