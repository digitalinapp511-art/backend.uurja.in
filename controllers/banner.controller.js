import Banner from "../models/Banner.js";

/* ===============================
   CREATE BANNER (Admin)
================================= */
export const createBanner = async (req, res) => {
  try {
    const { title, subtitle, redirectUrl, displayOrder } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Banner image required",
      });
    }

    const banner = await Banner.create({
      title,
      subtitle,
      image: req.file.path,
      redirectUrl,
      displayOrder,
    });

    res.status(201).json({
      success: true,
      data: banner,
    });

  } catch (error) {
    console.error("createBanner error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ===============================
   GET ACTIVE BANNERS (Frontend)
================================= */
export const getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true })
      .sort({ displayOrder: 1 });

    res.status(200).json({
      success: true,
      data: banners,
    });

  } catch (error) {
    console.error("getActiveBanners error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ===============================
   GET ALL BANNERS (Admin)
================================= */
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: banners,
    });

  } catch (error) {
    console.error("getAllBanners error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ===============================
   UPDATE BANNER
================================= */
export const updateBanner = async (req, res) => {
  try {
    console.log("req.file:", req.file);   // ✅ debug
    console.log("req.body:", req.body);   // ✅ debug

    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    // ✅ Update image if provided
    if (req.file) {
      banner.image = req.file.path;
    }

    // ✅ Update other fields only if provided
    const { title, subtitle, redirectUrl, isActive, displayOrder } = req.body;
    if (title !== undefined) banner.title = title;
    if (subtitle !== undefined) banner.subtitle = subtitle;
    if (redirectUrl !== undefined) banner.redirectUrl = redirectUrl;
    if (isActive !== undefined) banner.isActive = isActive;
    if (displayOrder !== undefined) banner.displayOrder = displayOrder;

    await banner.save();

    res.status(200).json({
      success: true,
      data: banner,
    });

  } catch (error) {
    console.error("updateBanner error:", error.message); // ✅ see real error
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ===============================
   DELETE BANNER
================================= */
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });

  } catch (error) {
    console.error("deleteBanner error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};