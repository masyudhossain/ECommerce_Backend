// seeder/adminSeeder.js

import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import Category from "../models/category.model.js";

const seedAdmin = async () => {
    const email = process.env.FIRST_ADMIN_EMAIL;
    const password = process.env.FIRST_ADMIN_PASSWORD;

    // Check if admin already exists
    const existingAdmin = await User.exists({ email, role: "admin" });
    if (existingAdmin) {
        return; // Admin exists, do nothing
    }
    if (!existingAdmin) {
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
    }
    // Seed "Uncategorized" category
    const uncategorizedExists = await Category.findOne({ name: "Uncategorized" });
    if (!uncategorizedExists) {
        await Category.create({ name: "Uncategorized", parentCategoryId: null });
        console.log('"Uncategorized" category created');
    } else {
        console.log('"Uncategorized" category already exists, skipping...');
    }
};

export default seedAdmin;
