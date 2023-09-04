const express = require("express");
const router = express.Router();
const User = require("../models/User");

const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "Harshisagood$boy";
const fetchuser = require("../middleware/fetchuser");
const UserSpecificBook = require("../models/Book");


router.post(
  "/createuser",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("name", "Enter a Valid Name").isLength({ min: 3 }),
    body("password", "Enter a Valid Password").isLength({ min: 5 }),
    body("phone", "Enter Valid Phone Number").isLength({ min: 10 }),
    body("address", "Enter Valid Address").isLength({ min: 5 }),
    body("college", "Enter Valid College Name").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: "Sorry, a user with this email already exists.",
        });
      }
      
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
        phone: req.body.phone,
        college: req.body.college,
        address: req.body.address,
      });

      // Create default books for the user immediately after user creation
      const defaultBooks = [
        {
          name: "The Lost World",
          category: "Sci-fi",
          user: user._id,
          isDefault: true,
         
        },
        {
          name: "Dune",
          category: "Sci-fi",
          user: user._id,
          isDefault: true,
          
        },
        {
          name: "Alchemist",
          category: "Fiction",
          user: user._id,
          isDefault: true,
          
        },
        {
          name: "Brave New World",
          category: "Fiction",
          user: user._id,
          isDefault: true,
          
        },
        {
          name: "Champak",
          category: "Comedy",
          user: user._id,
          isDefault: true,
          
        },
        {
          name: "Tenaliraman",
          category: "Comedy",
          user: user._id,
          isDefault: true,
          
        },
        // Add more default books as needed
      ];

      const createdBooks = await UserSpecificBook.insertMany(defaultBooks);

      // Debugging output
      console.log("Default Books Created:", createdBooks);

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      console.log("Response Data:", { success, authtoken, user });

      success = true;
      res.status(201).json({ success, authtoken, user });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Your other routes for login, get user, etc. go here

module.exports = router;

router.post(
  "/login",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password cannot be blank.").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Please login with the right credentials." });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Please login with the right credentials." });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      console.log(user);
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.status(200).json({ success, authtoken, user });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userid = req.user.id;
    console.log(userid);
    const user2 = await User.findById(userid).select("-password");
    res.send(user2);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
