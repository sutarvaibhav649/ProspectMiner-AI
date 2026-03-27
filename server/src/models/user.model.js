import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowecase:true
    },
    password:{
        type:String,
        required:true
    },
    credits:{
        type:Number,
        default:150   // initial free credits
    }
},{timestamps:true});

export default mongoose.model("User",userSchema);