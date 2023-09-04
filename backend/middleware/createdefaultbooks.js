const Book = require("../models/Book");

// Define an array of default books
const defaultBooks = [
  { name: "The Lost World", category: "Sci-fi" },
  { name: "Dune", category: "Sci-fi" },
  { name: "Alchemist", category: "Fiction" },
  { name: "Brave New World", category: "Fiction" },
  { name: "Champak", category: "Comedy" },
  { name: "Tenaliraman", category: "Comedy" },
  // Add more default books as needed
];

const createdefaultbooks = async (req, res, next) => {
  try {
    // Get the user ID from the request object (assuming you've set it during user registration)
    const userId = req.user.id;

    // Create default books for the user
    const createdBooks = await Book.insertMany(defaultBooks.map((book) => ({ ...book, user: userId })));

    // Optionally, you can send a response indicating that default books were created
    res.status(201).json({ message: "Default books created for the user", books: createdBooks });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = createdefaultbooks;
