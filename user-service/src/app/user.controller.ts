import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userDTO } from "../modules/user/dto/user.dto";

export const users: userDTO[] = [];

const registerUser = async (req: Request, res: Response): Promise<Response> => {
    const { username, password, email, role } = req.body;

    // Check if user already exists
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add user to array
    users.push({ username, password: hashedPassword, email, role });

    return res.status(201).json({ message: "User registered!" });
};

const loginUser = async (req: Request, res: Response): Promise<Response> => {
    const { username, password } = req.body;

    // Find user by username
    const user = users.find(user => user.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ username }, "secretKey", { expiresIn: "1h" });

    return res.json({ token });
};

export { registerUser, loginUser };
