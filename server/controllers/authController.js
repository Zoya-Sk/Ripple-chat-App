const User = require("../models/userModels");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

// sign up
exports.signup = async (req, res) => {
  try {
    // fetch data
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the input fields",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password should match",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }

    // check if the user is already registered or not
    const isUserExist = await User.findOne({ email: email });

    if (isUserExist) {
      return res.status(400).json({
        success: false,
        message: "User already registered!",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate profile picture
    const profilePicture = `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}%20${lastName}`;

    // create entry
    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      profilePicture: profilePicture,
    });

    // return response
    return res.status(200).json({
      success: true,
      message: "User Registered Successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// login
exports.login = async (req, res) => {
  try {
    // fetch data
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the input fields",
      });
    }

    // check if email is registered or not
    const isUserRegistered = await User.findOne({ email: email });

    if (!isUserRegistered) {
      return res.status(400).json({
        success: false,
        message: "Email not registered",
      });
    }
    // verify password
    const isPasswordMatched = await bcrypt.compare(
      password,
      isUserRegistered.password,
    );

    // if password is correct
    if (isPasswordMatched) {
    // generate token
        const payload = {
            email:email,
            userId:isUserRegistered._id,
        }
        const token = jsonwebtoken.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"1d",
        });

        isUserRegistered.password = undefined;

    // return response with token and user details
    return res.status(200).json({
      success: true,
      message: "User Logged in Successfully!",
      token:token,
      userDetails:isUserRegistered,
    });

    } else {
      // if password is incorrect
      return res.status(400).json({
        success:false,
        message:"Incorrect password!",
      })
    }
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// get multiple(all existing) users
exports.getAllUsers = async(req, res) => {
    try {
        const userId = req.user.userId;

        // validation
        if(!userId) {
            return res.status(400).json({
                success: false,
                message: "Couldn't fetch User ID!",
            })
        }

        const allUsers = await User.find({_id: {$ne: userId}}).select("-password");

        return res.status(200).json({
            success: true,
            message: "Successfully fetched all users",
            allUsers: allUsers,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        })
    }
}