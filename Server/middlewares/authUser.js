//This middleware is used to protect routes by checking if the user has a valid JWT token stored in cookies.

import jwt from 'jsonwebtoken';
import 'dotenv/config';

const authUser = (req, res, next) => {
  const {token} = req.cookies;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if(tokenDecode.id){
        req.body.userId = tokenDecode.id;
    }else{
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    next();
  }catch (error) {
    console.error('Error in authUser middleware:', error);
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
}

export default authUser;