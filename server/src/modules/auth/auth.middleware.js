import jwt from 'jsonwebtoken';


/**
    This is auth middleware file In this file following function presents
    1. generateToken
    2. validateToken
    3. extractEmailFromToken

    @auther Vaibhav Sutar
    @version 1.0
 */

/**
    This Function generate the JWT token for the authentication
    @param user_id 
    @param email 
    @returns token
*/
// Function to create the json token
export const generateToken= (user_id,email)=>{
    const payload = {user_id:user_id,user_email:email};

    const token = jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    return token;
};

/**
    This function validate the jwt token using the JWT_SECRET
    and the JWT_EXPIRES_IN 
    @param token 
    @returns payload 
 */

// function to validate token
const validateToken = (token)=>{
    try {
        const payload = jwt.verify(token,process.env.JWT_SECRET);
        return payload;
    } catch (error) {
        console.error("Error in validating token: ",error.message);
        return null;
    }
}

/**
    This function extract the email from the token
    @param token 
    @returns user_email
 */
// function to extract the email
export const extractEmailFromToken = (token)=>{
    const payload = validateToken(token);

    return payload ? payload.user_email : null;
}
