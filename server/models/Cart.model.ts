import { Schema,Types } from "mongoose";
import mongoose from "mongoose";

type Product={
    productId: Types.ObjectId;
    quantity: number;  
}

interface cart{
    User?:Types.ObjectId;
    products:Array<Product>;
}

const CartSchema=new Schema<cart>({
    User:{
        type:Schema.Types.ObjectId,  
        ref:"Users",
    },
    products:{
        type: [
            {
              productId: {
                type: Schema.Types.ObjectId,
                ref: "Products",
              },
              quantity: {
                type: Number,
                required: true,
                min: [1, "Quantity can not be less then 1."],
                default: 1,
              },
            },
          ],
        default: [],
    }
});

export const Cart=mongoose.model<cart>("Cart",CartSchema);