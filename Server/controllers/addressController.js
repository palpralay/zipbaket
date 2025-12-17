import Address from "../models/address.js";

export const addAddress = async (req, res) => {
    try {
        const {address, userID} = req.body;
        await Address.create({...address, userId: userID});
        res.json({success: true, message: "Address added successfully"});
    } catch (error) {
       console.log(error);
       res.status(500).json({success: false, message: "Server Error"}); 
    }
}

export const getAddress = async (req, res) => {
    try {
        const { userID} = req.body;
        const addresses = await Address.find({userId: userID});
        res.json({success: true, addresses});
    } catch (error) {
       console.log(error);
       res.status(500).json({success: false, message: "Server Error"}); 
    }
}