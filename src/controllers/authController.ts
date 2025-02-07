import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AppError } from '../utils/appError';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            idNumber,
            fullName,
            email,
            password,
            phoneNumber,
            dateOfBirth,
            userType
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { idNumber }] });
        if (existingUser) {
            throw new AppError('User already exists with this email or ID number', 400);
        }

        // Create new user
        const user = await User.create({
            idNumber,
            fullName,
            email,
            password,
            phoneNumber,
            dateOfBirth,
            userType
        });

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET!,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    userType: user.userType
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idNumber, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ idNumber });
        if (!user) {
            throw new AppError('Invalid ID number or password', 401);
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new AppError('Invalid ID number or password', 401);
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET!,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    userType: user.userType
                }
            }
        });
    } catch (error) {
        next(error);
    }
}; 