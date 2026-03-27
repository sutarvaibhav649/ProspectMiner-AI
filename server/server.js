import express from 'express';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv'


/**
    This file contains configurations to start the express app

    @author Vaibhav Sutar
    @version 1.0
 */

dotenv.config({
    path: "./.env"
})

const app = express();
app.use(express.json())

// connect the DB
try{
    connectDB();
}catch(error){
    console.error("Error in the setting the app: ",error.message);
}

