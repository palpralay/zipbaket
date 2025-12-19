import Address from "../models/address.js";

// Add address
export const addAddress = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;
    const { address } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "User ID is required" 
      });
    }

    if (!address) {
      return res.status(400).json({ 
        success: false, 
        message: "Address data is required" 
      });
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'streetAddress', 'city', 'state', 'zipCode', 'country'];
    const missingFields = requiredFields.filter(field => !address[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(address.email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email format" 
      });
    }

    // Validate phone number (basic validation)
    if (address.phoneNumber.toString().length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid phone number" 
      });
    }

    const newAddress = await Address.create({ 
      ...address, 
      userId 
    });

    res.status(201).json({ 
      success: true, 
      message: "Address added successfully",
      address: newAddress 
    });
  } catch (error) {
    console.error("Add address error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server Error" 
    });
  }
};

// Get user addresses
export const getAddress = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId || req.body.userID;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "User ID is required" 
      });
    }

    const addresses = await Address.find({ userId }).sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      addresses 
    });
  } catch (error) {
    console.error("Get address error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server Error" 
    });
  }
};

// Get address by ID
export const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: "Address ID is required" 
      });
    }

    const address = await Address.findOne({ _id: id, userId });

    if (!address) {
      return res.status(404).json({ 
        success: false, 
        message: "Address not found" 
      });
    }

    res.json({ 
      success: true, 
      address 
    });
  } catch (error) {
    console.error("Get address by ID error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server Error" 
    });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { address } = req.body;

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: "Address ID is required" 
      });
    }

    if (!address) {
      return res.status(400).json({ 
        success: false, 
        message: "Address data is required" 
      });
    }

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: id, userId },
      address,
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ 
        success: false, 
        message: "Address not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Address updated successfully",
      address: updatedAddress 
    });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server Error" 
    });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: "Address ID is required" 
      });
    }

    const deletedAddress = await Address.findOneAndDelete({ _id: id, userId });

    if (!deletedAddress) {
      return res.status(404).json({ 
        success: false, 
        message: "Address not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Address deleted successfully" 
    });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server Error" 
    });
  }
};