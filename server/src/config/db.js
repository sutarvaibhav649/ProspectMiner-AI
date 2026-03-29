import mongoose from 'mongoose';
import dns from 'dns';


/**
    This file have settings to connect with the mongoDB atlas
    Here the DNS is set so the system can connect to the MongoDB atlas

    The connectDB function try to connect and it is then exported as default

    @author Vaibhav Sutar
    @version 1.0
 */

// Set DNS servers for stability
dns.setServers(['8.8.8.8', '1.1.1.1']);
const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");
    }catch(error){
        console.error("DB Connection Failed:", error.message);
        process.exit(1);
    }
}

export default connectDB;