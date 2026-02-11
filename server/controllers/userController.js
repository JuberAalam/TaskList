import User from "../models/User.js";

/* ================= GET PROFILE ================= */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /* ✅ Update only if provided */
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    /* ✅ Duplicate email protection */
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};
