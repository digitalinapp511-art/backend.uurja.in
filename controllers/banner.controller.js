import Banner from "../models/Banner.js";

/* ===============================
   CREATE BANNER (Admin)
================================= */
export const createBanner = async (req, res, next) => {
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
    next(error);
  }
};


/* ===============================
   GET ACTIVE BANNERS (Frontend)
================================= */
export const getActiveBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({ isActive: true })
      .sort({ displayOrder: 1 });

    res.status(200).json({
      success: true,
      data: banners,
    });

  } catch (error) {
    next(error);
  }
};


/* ===============================
   GET ALL BANNERS (Admin)
================================= */
export const getAllBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: banners,
    });

  } catch (error) {
    next(error);
  }
};


/* ===============================
   UPDATE BANNER
================================= */
export const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    const { title, subtitle, redirectUrl, isActive, displayOrder } = req.body;

    if (req.file) {
      banner.image = req.file.path;
    }

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
    next(error);
  }
};


/* ===============================
   DELETE BANNER
================================= */
export const deleteBanner = async (req, res, next) => {
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
    next(error);
  }
};