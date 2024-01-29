import { Product } from "../models/Product.model";
import { Category } from "../models/Category.model";
import mongoose from "mongoose";
import { Request, RequestHandler, Response } from "express";
import { ProductInterface } from "../types";

/**
 * @description Add a new product to the database
 * @param {Object} req.body - The request body
 * @param {string} req.body.name - The name of the product
 * @param {string} req.body.category - The ID of the category to which the product belongs
 * @param {string} req.body.description - The description of the product
 * @param {number} req.body.price - The price of the product
 * @param {number} req.body.stock - The stock quantity of the product
 */
const AddProduct: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { name, category, description, price, stock }:ProductInterface = req.body;
        const response = await Product.create({
            name,
            category: category,
            description,
            price,
            stock,
        });

        const categoryToBeAdded = await Category.findById(new mongoose.Types.ObjectId(category));

        if (!categoryToBeAdded) {
            return res.status(404).json({
                success: false,
                message: "Category Not Present",
            });
        }
        console.log("Added Product is ", response);
        return res.status(200).json({
            success: true,
            message: "New Product Added",
        });
    } catch (err) {
        console.log("Error in add product: " + err);
        if (err instanceof Error) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
};

/**
 * @description Fetch all products with pagination
 * @access Public
 */
const GetAllProducts: RequestHandler = async (req: Request, res: Response) => {
    try {
        const page = 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        const AllProducts = await Product.aggregate([
            {
                $match: {},
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $addFields: {
                    category: { $first: "$category" },
                },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
        ]);

        if (AllProducts.length > 0) {
            return res.status(200).json({
                success: true,
                AllProducts,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No Products Present",
            });
        }
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
};

/**
 * @description Get a product by its ID
 * @param {string} req.params.id - The ID parameter
 */
const GetProductById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await Product.findById(new mongoose.Types.ObjectId(id)).populate("category");
        return res.status(200).json({
            success: true,
            response,
        });
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
};

/**
 * @description Update a product in the database
 * @param {Object} req.body - The request body
 * @param {string} req.body.id - The ID parameter
 * @param {string} req.body.name - The updated name of the product
 * @param {string} req.body.category - The updated ID of the category to which the product belongs
 * @param {string} req.body.description - The updated description of the product
 * @param {number} req.body.price - The updated price of the product
 * @param {number} req.body.stock - The updated stock quantity of the product
 */
const UpdateProducts = async (req: Request, res: Response) => {
    try {
        const { id, name, category, description, price, stock } = req.body;
        const updateProduct = await Product.updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            {
                $set: {
                    name,
                    category,
                    description,
                    price,
                    stock,
                },
            }
        );
        console.log("Updated Product is ", updateProduct);
        return res.status(200).json({
            success: true,
            message: "Product Updated Successfully",
        });
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
};

/**
 * @description Get products by category with pagination
 * @param {string} req.params.category - The category ID parameter
 */
const GetProductsByCategory = async (req: Request, res: Response) => {
    try {
        const page = 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        const selectedProducts = await Product.aggregate([
            {
                $match: {
                    "category": req.params.category,
                },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
        ]);

        if (!selectedProducts || selectedProducts.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No Products Found",
            });
        } else {
            return res.status(200).json({
                success: true,
                selectedProducts,
            });
        }
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
};

/**
 * @description Delete a product from the database
 * @param {string} req.params.id - The ID parameter
 */
const DeletePrduct = async (req: Request, res: Response) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const response = await Product.findByIdAndDelete(id);
        if (response) {
            return res.status(200).json({
                success: true,
                message: "Product Deleted Successfully",
            });
        }
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
};

export {
    AddProduct,
    GetAllProducts,
    GetProductById,
    UpdateProducts,
    GetProductsByCategory,
    DeletePrduct,
};
