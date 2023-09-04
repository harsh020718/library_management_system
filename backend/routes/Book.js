const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const fetchuser = require("../middleware/fetchuser");
const authMiddleware = require('../middleware/authmiddleware'); // You'll need authentication middleware
const User = require('../models/User');

const { body, validationResult } = require("express-validator");

router.get("/fetchallbooks", async (req, res) => {
  try {
    const {  userId } = req.query;
    const userBooks = await Book.find({  isDefault: true, user: userId });

    

    res.json(userBooks);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/showBorrowedBook", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Fetch the user's booklist
    const borrowedBooks = user.booklist;

    res.json(borrowedBooks); // Send the user's booklist as a response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



router.post(
  "/addbook",
  fetchuser,
  [
    body("name", "Enter a Valid Name").isLength({ min: 3 }),
    body("category", "category must be atleast 5 characters.").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { name, category } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const book = new Book({
        name,
        category,
        isDefault: false,
        
      });
      const savedBook = await book.save();
      res.json(savedBook);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
router.post('/borrow/:bookId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have a user object in the request (authenticated user)
    const bookId = req.params.bookId;

    const { name, category } = req.body;
    // Check if the user has already borrowed the book
    const user = await User.findById(userId);

    // if (user.booklist.includes(bookId)) {
    //   return res.status(400).json({ message: 'You have already borrowed this book.' });
    // }
    if (user.booklist.some(book => book._id.toString() === bookId)) {
      return res.status(400).json({ message: 'You have already borrowed this book.' });
    }
    // Add the book to the user's booklist
    user.booklist.push({ _id: bookId, name, category });

    // Save the updated user object
    await user.save();

    res.status(200).json({ message: 'Book borrowed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.post('/return/:bookId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have a user object in the request (authenticated user)
    const bookId = req.params.bookId;

    const { name, category } = req.body;
    // Check if the user has already borrowed the book
    const user = await User.findById(userId);

    
    user.booklist.remove({ _id: bookId, name, category });

    
    await user.save();

    res.status(200).json({ message: 'Book removed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




module.exports = router;
