import mongoose,{Schema,Types} from "mongoose";
import { Category } from "./Category.model";

interface product{
    category:Types.ObjectId|typeof Category;
    descripion:string;
    name: string;
    price:number,
    stock:number,
    image:string,
    createdAt:Date,
    updatedAt?: Date
};

const ProductSchema=new Schema<product>(
    {
        category:{
            type: Types.ObjectId,
            ref:"Category",
        },
        name:{
            type:String,
            required:true,
        },
        descripion:{
            type: String,
            required:true,
        },
        stock:{
            type:Number,
            required:true,
        },
        image:{
            type:String,
            required:true,
        },
        createdAt:{
            type:Date,
        },
        updatedAt:{
            type:Date,
        }   
    }
);

export const Product=mongoose.model<product>("Product",ProductSchema);