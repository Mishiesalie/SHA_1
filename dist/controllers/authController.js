"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const appError_1 = require("../utils/appError");
const register = async (req, res, next) => {
    try {
        const { idNumber, fullName, email, password, phoneNumber, dateOfBirth, userType } = req.body;
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ $or: [{ email }, { idNumber }] });
        if (existingUser) {
            throw new appError_1.AppError('User already exists with this email or ID number', 400);
        }
        // Create new user
        const user = await User_1.default.create({
            idNumber,
            fullName,
            email,
            password,
            phoneNumber,
            dateOfBirth,
            userType
        });
        // Generate token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
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
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { idNumber, password } = req.body;
        // Check if user exists
        const user = await User_1.default.findOne({ idNumber });
        if (!user) {
            throw new appError_1.AppError('Invalid ID number or password', 401);
        }
        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new appError_1.AppError('Invalid ID number or password', 401);
        }
        // Generate token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
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
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
