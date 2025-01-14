import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  getRecommendedProducts,
  getProductByCategory,
  toggleFeaturedProduct,
  createProduct,
  deleteProduct,
  getProductById,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import multer from "multer";

const router = express.Router();
// where this uploads folder is created?
// It is created in the root folder of the project.
// The uploads folder is created when you upload a file.
// The file is saved temporarily in the uploads folder before being processed by the controller.
// The file is then deleted after processing.
// The uploads folder is not committed to the repository.

// Set up Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Directory to save images
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname); // Extract file extension
//     const fileName = ext + Date.now(); // Create a unique filename
//     cb(null, fileName);
//   },
// });
// const upload = multer({ storage }); // Save files in the 'uploads' folder
const upload = multer({ dest: "uploads/" }); // Save files temporarily in 'uploads' folder

router.post(
  "/",
  protectRoute,
  adminRoute,
  upload.array("images"),
  createProduct
);
router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/recommendations", getRecommendedProducts);
router.get("/category/:category", getProductByCategory);
router.get("/:id", getProductById);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
