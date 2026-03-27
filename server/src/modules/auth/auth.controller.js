import { createUser,loginUser } from "./auth.service.js";


/**
    controller to register the user
 */
export const register = async (req,res)=>{
    const result = await createUser(req.body);
    res.status(201).json(result);
}


/**
    controller to login the user
 */
export const login = async (req,res)=>{
    const result = await loginUser(req.body);

    res.status(200).json({
        success: true,
        ...result
    });
}