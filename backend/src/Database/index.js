import mongoose from "mongoose";

const connnectDB = async()=>{
    
   try {
     const connectionInstance = await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWAORD}@cluster0.l4xeyto.mongodb.net/`);
     console.log(`MONGO DB CONNECTED SUCCESSFULLY!!!`)
   } catch (error) {
    console.log("mongo DB connection failed!!, error:",error);
   }
}

export {connnectDB}