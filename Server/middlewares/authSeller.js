import jwt from 'jsonwebtoken'

const authSeller = async (req, res, next) => {
    const {sellerToken} = req.cookies;
    if (!sellerToken) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    try {
        const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
       if(decoded.email === process.env.SELLER_EMAIL){
           next();
       }else{
           return res.status(401).json({ message: 'Unauthorized: Invalid seller token' });
       }
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}

export default authSeller;


