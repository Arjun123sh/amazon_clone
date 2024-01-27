import mongoose,{Schema} from "mongoose";

interface category{
    categoryName:string,
    createdAt:Date,
};

const categorySchema=new Schema<category>(
    {
        categoryName:{
            type:String,
            required:true,
        },
        createdAt:{
            type:Date,
        }
    }
);

export const Category=mongoose.model<category>("Category",categorySchema);