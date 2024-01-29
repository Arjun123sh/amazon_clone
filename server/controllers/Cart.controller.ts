import { Users } from "../models/Users.model";
import { Cart } from "../models/Cart.model";
import { Product } from "../models/Product.model";
import mongoose from "mongoose";
import { Request, RequestHandler, Response } from "express";
import { IUserRequest,CartInterface } from "../types";

/**
 * Clear cart items from the database.
 * @param req - IUserRequest (request object containing user information)
 * @param res - Response (response object)
 */
const clearCart = async (req: IUserRequest, res: Response) => {
    try {
        const id = req.user.id;
        const response = await Cart.deleteOne({ User: new mongoose.Types.ObjectId(id) });

        if (response) {
            return res.status(200).json({
                success: true,
                message: "Cart Removed Successfully",
            });
        }
    } catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
};

/**
 * Add an item to the cart.
 * @param req - CartInterface (request object containing cart information)
 * @param res - Response (response object)
 */
const addItemToCart = async (req: CartInterface, res: Response) => {
    try {
        const { cartId, productId, quantity } = req.body;

        const cart = await Cart.findById(new mongoose.Types.ObjectId(cartId));

        if (!cart) {
            const newCart = await Cart.create({
                User: req.user.id,
                products: [{ productId, quantity }],
            });

            return res.status(200).json({
                success: true,
                message: "Product Added To Cart",
            });
        } else {
            const updatedCart = await Cart.findOneAndUpdate(
                { _id: cartId },
                {
                    $push: {
                        products: {
                            productId,
                            quantity,
                        },
                    },
                },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                data: updatedCart,
            });
        }
    } catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
};

/**
 * Remove an item from the cart.
 * @param req - IUserRequest (request object containing user information)
 * @param res - Response (response object)
 */
const removeItemFromCart = async (req: IUserRequest, res: Response) => {
    try {
        const productId = req.params.productId as string;

        const productExisted = await Product.findById(new mongoose.Types.ObjectId(productId));

        if (!productExisted) {
            return res.status(404).json({
                success: false,
                message: "Invalid request",
            });
        }

        const updatedCart = await Cart.findOneAndUpdate(
            { User: new mongoose.Types.ObjectId(req.user.id) },
            {
                $pull: {
                    products: {
                        productId,
                    },
                },
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            data: updatedCart,
        });
    } catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
};

/**
 * Get cart items for a user.
 * @param req - IUserRequest (request object containing user information)
 * @param res - Response (response object)
 */
const getCartItems = async (req: IUserRequest, res: Response) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const cartId = req.params.id;
        const cartExists = await Cart.findById(new mongoose.Types.ObjectId(cartId));

        if (!cartExists) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const response = await Cart.aggregate([
            {
                $match: {
                    User: userId,
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "products.productId",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
        ]);

        return res.status(200).json({
            success: true,
            data: response,
        });
    } catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
};

export { clearCart, removeItemFromCart, addItemToCart, getCartItems };
