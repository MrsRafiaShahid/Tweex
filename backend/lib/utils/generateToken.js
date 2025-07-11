import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  // Set cookie with httpOnly flag to prevent access from client side javascript code that runs in the browser
  res.cookie("token", token, {
    httpOnly: true, //Prevent access from client side javascript code that runs in the browser
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), //15 days
    sameSite: "strict", //Prevent CSRF attacks against your users by setting the SameSite attribute to Strict
    maxAge: 15 * 24 * 60 * 60 * 1000, //Milli seconds
    secure: process.env.NODE_ENV === "production" ? true : false,
  });
  return token;
};

export default generateTokenAndSetCookie;
