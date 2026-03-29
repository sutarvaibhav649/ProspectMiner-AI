import User from '../../models/user.model.js';
import AppError from '../../utils/AppError.js';


// get balance function
export const getBalance = async (userId)=>{
    const user = await User.findOne({_id:userId});
    if(!user) throw new AppError("User Not Found");

    return user.credits;
}

// check and deduct the credits
export const deductCredits = async (userId,amount)=>{
    const user = await User.findOneAndUpdate(
        {
            _id : userId,
            credits : {$gt: amount}
        },
        {
            $inc: {credits:-amount}
        },
        {new:true}
    );

    if (!user) {
        throw new Error("Insufficient credits");
    }

    return user.credits;
}



