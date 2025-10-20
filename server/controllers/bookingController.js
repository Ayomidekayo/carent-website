import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

/* ---------------------------------------------------------
   Helper Function: Check Car Availability for Given Dates
--------------------------------------------------------- */
const checkAvailability = async (carId, pickupDate, returnDate) => {
  const bookings = await Booking.find({
    car: carId,
    // find bookings that overlap with the given date range
    $or: [
      { pickup: { $lte: returnDate, $gte: pickupDate } },
      { returnDate: { $gte: pickupDate, $lte: returnDate } },
      {
        $and: [
          { pickup: { $lte: pickupDate } },
          { returnDate: { $gte: returnDate } },
        ],
      },
    ],
  });

  return bookings.length === 0;
};

/* ---------------------------------------------------------
   API: Check Availability of Cars for Date & Location
--------------------------------------------------------- */
export const checkAvilabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

    // ✅ Fetch all available cars for the given location
    const cars = await Car.find({ location, isAvailable: true });

    // ✅ Check each car’s availability for the date range
    const availableCarsPromises = cars.map(async (car) => {
      const isAvailable = await checkAvailability(
        car._id,
        new Date(pickupDate),
        new Date(returnDate)
      );
      return { ...car._doc, isAvailable };
    });

    let availableCars = await Promise.all(availableCarsPromises);
    availableCars = availableCars.filter((car) => car.isAvailable === true);

    res.json({ success: true, availableCars });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

/* ---------------------------------------------------------
   API: Create a Booking
--------------------------------------------------------- */
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    // ✅ Validate required fields
    if (!car || !pickupDate || !returnDate) {
      return res.json({ success: false, message: "All fields are required." });
    }

    // ✅ Check if car exists
    const carData = await Car.findById(car);
    if (!carData) {
      return res.json({ success: false, message: "Car not found." });
    }

    // ✅ Check if car is available
    const isAvailable = await checkAvailability(car, pickupDate, returnDate);
    if (!isAvailable) {
      return res.json({ success: false, message: "Car is not available." });
    }

    // ✅ Calculate price based on date difference
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);

    // Prevent negative or zero-day booking
    const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
    if (noOfDays <= 0) {
      return res.json({
        success: false,
        message: "Return date must be after pickup date.",
      });
    }

    const price = carData.pricePerDay * noOfDays;

    // ✅ Create booking (fixed field name)
    const booking = await Booking.create({
      car,
      owner: carData.owner,
      user: _id,
      pickupDate: picked, // ✅ Corrected field name
      returnDate: returned,
      price,
    });

    return res.json({
      success: true,
      message: "Booking created successfully.",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error.message);
    return res.json({ success: false, message: error.message });
  }
};
/* ---------------------------------------------------------
   API: Get User Bookings
--------------------------------------------------------- */
export const getUserBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const bookings = await Booking.find({ user: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

/* ---------------------------------------------------------
   API: Get Owner Bookings
--------------------------------------------------------- */
export const getOwnerBooking = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({ owner: req.user._id })
      .populate("car user", "-password")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

/* ---------------------------------------------------------
   API: Change Booking Status
--------------------------------------------------------- */
export const changeBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const { bookingId, status } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    if (booking.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, message: "Booking status updated", booking });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
