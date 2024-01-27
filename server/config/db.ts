import mongoose from "mongoose";

export const connect = () => {
    mongoose
      .connect(process.env.DATABASE_URL || '', {
      })
      .then(() => {
        console.log('Database Is Connected Successfully');
      })
      .catch((err) => {
        console.error(err);
        console.log('Error While Connecting To Database ', err);
        process.exit(-1);
      });
  };