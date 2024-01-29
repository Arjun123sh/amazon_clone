import { Request } from "express";
/**
 * Interface for a request with a user object.
 */
export interface IUserRequest extends Request {
    user: any;
}

/**
 * Interface for the request to add an item to the cart.
 */
export interface CartInterface extends IUserRequest {
    body: {
        cartId: string;
        productId: string;
        quantity: string;
    };
}

export interface AddressInterface extends IUserRequest{
    addressLine1:string;
    addressLine2:string;
    city:string;
    country:string;
    pincode:string;
    state:string;
}


