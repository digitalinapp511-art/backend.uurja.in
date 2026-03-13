import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    const { mobile, pin } = req.body;
    console.log("Received mobile:", mobile, typeof mobile);
    console.log("Received pin:", pin, typeof pin);
    console.log("ENV mobile:", process.env.ADMIN_MOBILE, typeof process.env.ADMIN_MOBILE);
    console.log("ENV pin:", process.env.ADMIN_PIN, typeof process.env.ADMIN_PIN);

    if (!mobile || !pin) {
      return res.status(400).json({
        success: false,
        message: "Mobile and PIN required",
      });
    }

    if (
      mobile !== process.env.ADMIN_MOBILE ||
      pin !== process.env.ADMIN_PIN
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: "admin",
        isAdmin: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

