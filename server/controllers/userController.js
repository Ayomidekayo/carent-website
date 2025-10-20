import jwt from "jsonwebtoken";
import User from "../models/User.js"
import bcrypt from 'bcrypt'
import Car from "../models/Car.js";

//generate jwtToken


export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // optional, but recommended
  });
};

//Register user
export const registerUser=async(req,res)=>{
    try {
        const {name,email,password}=req.body
       if (!name || !email || !password) {
    return res.json({ success: false, message: 'All fields are required' });
}

        if (password.length < 8) {
            return res.json({ success: false, message: 'Password must be at least 8 characters long' });
        }
        const userExist=await User.findOne({email})
        if(userExist){
            return res.json({success:false,message:'User already exists'})
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            name,email,password: hashedPassword
        })

        const token=generateToken(user._id.toString())
        res.json({success:true,token});
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
};

//Login User 

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    // ✅ Generate proper JWT token with object payload
    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};



//Get user data using Token (JWT)

export const getUserData=async(req,res)=>{
    try {
       const {user}=req; 
       res.json({success:true,user})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
};

//Get user data using Token (JWT)

export const getCar=async(req,res)=>{
    try {
       const cars=await Car.find({isAvaliable:true}); 
       res.json({success:true,cars})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
};


