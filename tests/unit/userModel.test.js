// tests/unit/userModel.test.js

import mongoose from "mongoose";
import User from "../../src/models/user.model.js";

describe("User Model - Full Coverage", () => {
    // Clear DB before each test
    beforeEach(async () => {
        await mongoose.connection.collections.users.deleteMany({});
    });

    // Disconnect after all tests
    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it("should fail validation if email is invalid", async () => {
        const user = new User({ name: "Test", email: "invalid", password: "secret123" });
        let err;
        try {
            await user.validate();
        } catch (error) {
            err = error;
        }
        expect(err.errors.email).toBeDefined();
    });

    it("should require name, email, and password", async () => {
        const user = new User({});
        let err;
        try {
            await user.validate();
        } catch (error) {
            err = error;
        }
        expect(err.errors.name).toBeDefined();
        expect(err.errors.email).toBeDefined();
        expect(err.errors.password).toBeDefined();
    });

    it("should hash password before save for customer", async () => {
        const user = new User({ name: "John", email: "john@example.com", password: "secret123", role: "customer" });
        await user.save();
        expect(user.password).not.toBe("secret123");
    });

    it("should hash password before save for admin role", async () => {
        const user = new User({ name: "Admin", email: "admin@example.com", password: "adminpass", role: "admin" });
        await user.save();
        expect(user.password).not.toBe("adminpass");
    });

    it("should skip hashing if password not modified", async () => {
        const user = new User({ name: "Jane", email: "jane@example.com", password: "mypassword" });
        await user.save();
        const originalPassword = user.password;

        user.name = "Jane Updated";
        await user.save();

        expect(user.password).toBe(originalPassword); // password should not change
    });

    it("should match password correctly", async () => {
        const user = new User({ name: "Mike", email: "mike@example.com", password: "mypassword" });
        await user.save();

        const isMatch = await user.matchPassword("mypassword");
        const isNotMatch = await user.matchPassword("wrongpassword");

        expect(isMatch).toBe(true);
        expect(isNotMatch).toBe(false);
    });

    it("should allow adding multiple addresses", async () => {
        const user = new User({
            name: "Alice",
            email: "alice@example.com",
            password: "alice123",
            addresses: [
                { label: "Home", street: "123 Street", city: "City1", state: "State1", zip: "11111", country: "Country1" },
                { label: "Work", street: "456 Avenue", city: "City2", state: "State2", zip: "22222", country: "Country2" },
            ],
        });
        await user.save();
        expect(user.addresses.length).toBe(2);
        expect(user.addresses[0].label).toBe("Home");
        expect(user.addresses[1].label).toBe("Work");
    });

    it("should allow empty wishlist and addresses", async () => {
        const user = new User({ name: "Bob", email: "bob@example.com", password: "bob123" });
        await user.save();
        expect(user.addresses).toHaveLength(0);
        expect(user.wishlist).toHaveLength(0);
    });

    it("should throw validation error for invalid role", async () => {
        const user = new User({ name: "Invalid", email: "invalid@example.com", password: "pass123", role: "superuser" });
        let err;
        try {
            await user.validate();
        } catch (error) {
            err = error;
        }
        expect(err.errors.role).toBeDefined();
    });

    it("should handle very long name, email, password (boundary test)", async () => {
        const longName = "a".repeat(50);
        const longEmail = `${"b".repeat(30)}@test.com`;
        const longPassword = "p".repeat(30);
        const user = new User({ name: longName, email: longEmail, password: longPassword });
        await user.validate(); // should pass
        expect(user.name).toBe(longName);
        expect(user.email).toBe(longEmail);
        expect(user.password).toBe(longPassword);
    });
});
