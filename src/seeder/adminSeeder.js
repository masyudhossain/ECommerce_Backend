import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

const seedAdmin = async () => {
    const email = process.env.FIRST_ADMIN_EMAIL;
    const password = process.env.FIRST_ADMIN_PASSWORD;

    // Check if admin already exists
    let admin = await User.findOne({ email, role: "admin" });
    if (admin) {
        console.log("Admin already exists:", email);
        return; // Stop here — will not create again
    }

    // Create admin
    admin = await User.create({
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
