var jwt = require("jsonwebtoken");
const JWT_SECRET = "Harshisagood$boy";

const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    // jwt.verify ka use verification aur decoding k liye hota hai
    // console.log(data) // yeh hume user bhi dega aur iat bhi isliye hum req.user = data nhi kar sakte hume req.user = data.user karna hi hoga
    req.user = data.user;
    // console.log(req.user)

    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchuser;
