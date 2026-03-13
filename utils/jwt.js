// import jwt from "jsonwebtoken";

// export const generateToken = (user) => {
//   return jwt.sign(
//     { id: user._id, mobile: user.mobile },
//     process.env.JWT_SECRET,
//     { expiresIn: "7d" }
//   );
// };

import jwt from "jsonwebtoken";

export const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
};