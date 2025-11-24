import imagekit from "../configs/imageKit.js";
import User from "../models/User.js";
import Car from "../models/Car.js";
import fs from 'fs'

import Booking from "../models/Booking.js";

//api to change role of user
export const changeRoleToOwner=async(req,res)=>{
    try {
        const {_id}=req.user;
        await User.findByIdAndUpdate(_id, {role:"owner"})
        res.json({success:true, message:"Now you can list cars"})
    } catch (error) {
        console.log(error.message);
        res.json({success:true, message:error.message})
    }
};

//api to list Car



export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    // Use buffer if using memoryStorage, or fs.readFileSync if using diskStorage
    const fileBuffer = imageFile.buffer || fs.readFileSync(imageFile.path);

    // Upload to ImageKit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    if (!response || !response.url) {
      throw new Error("Image upload failed: no URL returned from ImageKit");
    }

    // Optimize image URL
    const optimizedImageUrl = imagekit.url({
      src: response.url, // ✅ use src instead of path
      transformation: [
        { width: "1280" }, // width resizing
        { quality: "auto" }, // auto compression
        { format: "webp" }, // modern format
      ],
    });

    await Car.create({
      ...car,
      owner: _id,
      image: optimizedImageUrl,
    });

    res.json({ success: true, message: "Car Added Successfully", image: optimizedImageUrl });
  } catch (error) {
    console.error("❌ addCar error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// APi to list Owner Cars
export const getOwnerCars=async(req,res)=>{
    try {
        const {_id}=req.user;
        const cars=await Car.find({owner:_id})
        res.json({success:true,cars})
        
    } catch (error) {
         console.log(error.message);
        res.json({success:true, message:error.message})
    }
}
//Api to Toggle Car Availability 
export const toggleCarAvailability=async(req,res)=>{
    try {
        const {_id}=req.user;
        const {carId}=req.body
        const car=await Car.findById(carId);
        //Checking if car belongs to the the owner
        if(car.owner.toString() !== _id.toString()){
            return res
            .json({success:false,message:"Unauthorized"})
        }
       car.isAvaliable=!car.isAvaliable;
       await car.save();
        res.json({
            success:true,
            message:"Availability Toggled"
        })
    } catch (error) {
        console.log(error.message);
        res.json({success:true, message:error.message})
    }
}


//Api to Delete a Car 
export const deleteCar=async(req,res)=>{
    try {
        const {_id}=req.user;
        const {carId}=req.body
        const car=await Car.findById(carId);
        //Checking if car belongs to the the owner
        if(car.owner.toString() !== _id.toString()){
            return res
            .json({success:false,message:"Unauthorized"})
        }
       car.owner=null;
       car.isAvaliable=false;
       await car.save();
        res.json({
            success:true,
            message:"Car Romove"
        })
    } catch (error) {
        console.log(error.message);
        res.json({success:true, message:error.message})
    }
}

//APi to get Dashboard data

export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    // ✅ Allow only owners
    if (role !== 'owner') {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // ✅ Fetch all cars owned by this owner
    const cars = await Car.find({ owner: _id });

    // ✅ Fetch all bookings related to this owner's cars
    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    // ✅ Separate bookings by status
    const pendingBookings = bookings.filter(
      (booking) => booking.status === "pending"
    );
    const confirmedBookings = bookings.filter(
      (booking) => booking.status === "confirmed"
    );

    // ✅ Calculate current month's revenue
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyRevenue = confirmedBookings.reduce((acc, booking) => {
      const bookingDate = new Date(booking.createdAt);
      if (
        bookingDate.getMonth() === currentMonth &&
        bookingDate.getFullYear() === currentYear
      ) {
        return acc + booking.price;
      }
      return acc;
    }, 0);

    // ✅ Prepare response data
    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: confirmedBookings.length,
      recentBookings: bookings.slice(0, 3),
      monthlyRevenue,
    };

    return res.json({ success: true, dashboardData });
  } catch (error) {
    console.error("❌ getDashboardData error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};



export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    // ✅ If using diskStorage
    // const fileBuffer = fs.readFileSync(imageFile.path);

    // ✅ If using memoryStorage
    const fileBuffer = imageFile.buffer;

    // Upload image to ImageKit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });

    // ✅ Use response.url instead of response.filePath
    if (!response || !response.url) {
      throw new Error("Image upload failed: no URL returned from ImageKit");
    }  
    const image = response.url;
    await User.findByIdAndUpdate(_id, { image });

    res.json({
      success: true,
      message: "Profile image updated",
      image,
    });
  }
    catch (error) {

    console.log("Update image error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while updating the image.",
    });
  }
};



