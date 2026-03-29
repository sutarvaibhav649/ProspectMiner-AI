import { getBalance,deductCredits } from "./credit.service.js";

// get balance
export const balance = async (req,res,next)=>{
    try {
        const userId = req.user.user_id;

        const user_balance = await getBalance(userId);

        res.status(200).json({
            success: true,
            credits: user_balance
        });
    } catch (error) {
        next(error);
    }
}