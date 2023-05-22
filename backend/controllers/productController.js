const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

//create product
const createProduct = asyncHandler(async(req,res)=> {
    const {name,sku,category,quantity,price,description} = req.body

    //validation of request
    if (!name || !category || !quantity || !price || !description) {
        res.status(400)
        throw new Error("Please fill in all fields!")
    }

    // handle the image upload
    let fileData = {}
    if(req.file) {
        //save image to cloudinary
        let uploadedFile;
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path,
                {
                folder: "inventory-ap", 
                resource_type: "image"
            });
        } catch (error) {
            res.status(500)
            throw new Error("Image could not be uploaded!")
        }
        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),
            //2 is actually telling the decimal places 
        }
    }

    // create products
    const product = await Product.create({
        user: req.user.id,   
        name,
        sku,
        category,
        quantity,
        price,
        description,
        image: fileData
    });

    res.status(201).json(product);
})


//get all product
const getProducts = asyncHandler(async(req,res)=> {
    const products = await Product.find({user: req.user.id}).sort("-createdAt")
    res.status(200).json(products)
})


//get single product
const getProduct = asyncHandler(async(req,res)=> {
    const product = await Product.findById(req.params.id)
    //if product doesnot exist
    if(!product) {
        res.status(404)
        throw new Error("Prouct not found!")
    }
    //match product to its user
    if (product.user.toString() != req.user.id) {
        res.status(401)
        throw new Error("User not authorized!")
    }
    res.status(200).json(product);
})

//delete a product
const deleteProduct = asyncHandler(async(req,res)=> {
    const product = await Product.findById(req.params.id)
    //if product doesnot exist
    if(!product) {
        res.status(404)
        throw new Error("Prouct not found!")
    }
    if (product.user.toString() != req.user.id) {
        res.status(401)
        throw new Error("User not authorized!")
    }
    console.log(product.remove);
    await product.remove();
    res.status(200).json({message: "Product deleted sucessfully!"});
})

//update a product details
const updateProduct = asyncHandler(async(req,res)=> {
    const {name,category,quantity,price,description} = req.body

    const product = await Product.findById(req.params.id)

    //if product does not exist
    if(!product) {
        res.status(404)
        throw new Error("Product not found!")
    }

    //match product to its user
    if (product.user.toString() != req.user.id) {
        res.status(401)
        throw new Error("User not authorized!")
    }

    // handle the image upload
    let fileData = {};
    if(req.file) {
        //save image to cloudinary
        let uploadedFile;
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path,
                {
                folder: "inventory-ap", 
                resource_type: "image"
            });
        } catch (error) {
            res.status(500)
            throw new Error("Image could not be uploaded!")
        }
        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),
            //2 is actually telling the decimal places 
        }
    }

    // update product
    const updatedProduct = await Product.findByIdAndUpdate(
        {_id: req.params.id},
        {
            name,
            category,
            quantity,
            price,
            description,
            image: Object.keys(fileData).length === 0 ?  product?.image : fileData,
        },
        {
            new: true,
            runValidators: true
        }
    )

    res.status(200).json(updatedProduct);
})

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct,
}