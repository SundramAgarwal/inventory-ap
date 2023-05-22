const express = require("express");
const { createProduct, getProducts, getProduct, deleteProduct, updateProduct } = require("../controllers/productController");
const protect = require("../middleWare/authMiddleware");
const { upload } = require("../utils/fileUpload");
const router = express.Router();

// for uploading multiple files in place of upload.single we will write upload.array
router.post("/",protect,upload.single("image"), createProduct);
router.get("/",protect,getProducts);
router.get("/:id",protect,getProduct);
router.delete("/:id",protect,deleteProduct);
router.patch("/:id",protect,upload.single("image"), updateProduct);

module.exports = router;