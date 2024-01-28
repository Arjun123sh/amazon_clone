import mongoose from "mongoose";
import { Category } from "../models/Category.model";
import { Product } from "../models/Product.model";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

const createCategory: RequestHandler = async (req: Request, res: Response) => {
    console.log('Inside Controller');
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Category Name is Required',
            });
        }

        const existingCategory = await Category.findOne({ categoryName: name });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category Already Exists',
            });
        }

        const newCategory = await Category.create({ categoryName: name });

        console.log('Category is ', newCategory);

        return res.status(201).json({
            success: true,
            message: 'Category Added',
        });
    } catch (err) {
        console.error(err);

        if (err instanceof Error) {
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: err.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

// Use Mongoose Document type for response data

const GetAllCategories = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    try {
        const response = await Category.aggregate([
            {
                $match: {}
            },
        ]);

        console.log("Categories are ", response);

        return res.status(200).json({
            success: true,
            data: response,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: err.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

const GetById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const categoryId: string = req.params.id;
        if (!categoryId) throw new Error('Invalid Request');
        const response = await Category.findById(new mongoose.Types.ObjectId(categoryId));
        return res.status(200).json({
            success: true,
            response,
        })
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: err.message,
            });
        }
    }
}

/**
 * @param {Object} req.body - The request body
 * @param {string} req.body.id - The ID parameter
 * @param {string} req.body.newCategoryName - The new category name parameter
 */

const UpdateCategory:RequestHandler = async (req:Request, res:Response) => {
    try {
        const { id , newCategoryName } = req.body ;
        const response= await Category.updateOne(
            { _id: new mongoose.Types.ObjectId(id), },
            { $set: { categoryName: newCategoryName, } }
        );
        console.log("Response is ", response);
        return res.status(201).json({
            success: true,
            message: "Category Updated Successfully",
        })
    }
    catch (err) {
        if(err instanceof Error){
            return res.status(500).json({
                success: false,
                message: err.message,
            })
        }
    }
}

/**
 * @param {Object} req.body - The request body
 * @param {string} req.params.id - The ID parameter
*/

const DeleteCategoryById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        await Category.findByIdAndDelete(new mongoose.Types.ObjectId(id));
        return res.status(200).json({
            success: true
        })
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                success: false,
                message: err.message,
            })
        }
    }
}

export {
    createCategory,
    GetAllCategories,
    GetById,
    UpdateCategory,
    DeleteCategoryById,
};
