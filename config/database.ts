import mongoose from "mongoose";

export const connect = async (): Promise<void> => {
  try {
    const mongoUrl = process.env.MONGO_URL;

    // Kiểm tra xem biến có tồn tại không
    if (!mongoUrl) {
      throw new Error("Missing MONGO_URL in environment variables");
    }

    await mongoose.connect(mongoUrl);
    console.log("connect success");
  } catch (error) {
    console.log("connect error", error);
  }
};
