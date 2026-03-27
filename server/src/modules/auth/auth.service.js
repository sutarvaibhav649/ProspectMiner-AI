import User from "../../models/user.model.js";
import bcrypt from 'bcrypt';
import AppError from '../../utils/AppError.js'; 
import { generateToken } from "./auth.middleware.js";

export const createUser = async (user) => {
    const { name, email, password } = user;

    // 1. check if user already exists 
    const userInDb = await User.findOne({ email });
    if (userInDb) {
        throw new AppError("User already exists", 400);
    }

    // 2. hash the password 
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. save the user
    const savedUser = await User.create({
        name,
        email,
        password: hashedPassword
    });

    const userResponse = savedUser.toObject();
    delete userResponse.password;

    return {
        success: true,
        message: "User registered successfully",
        user: userResponse
    };
};

export const loginUser = async (user_details) => {
    const { email, password } = user_details;

    const userInDb = await User.findOne({ email });

    // Use throw for clean error handling
    if (!userInDb) {
        throw new AppError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(password, userInDb.password);
    if (!isMatch) {
        throw new AppError("Invalid Credentials", 401);
    }

    const token = generateToken(userInDb._id, userInDb.email);
    
    const userResponse = userInDb.toObject();
    delete userResponse.password;

    return {
        message: "User logged in successfully",
        user: userResponse,
        token
    };
};