import mongoose from 'mongoose';

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB Connected Successfully");
    } catch (error) {
        console.error("DB Connection Error:", error);
        process.exit(1);
    }
};

export default connectDatabase;
