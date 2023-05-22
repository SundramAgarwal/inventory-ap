const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose"); //imported all dependencies
mongoose.set('strictQuery', false);
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const contactRoute = require("./routes/contactRoute");
const errorHandler = require("./middleWare/errorMiddleware");
const cookieParser = require("cookie-parser")
const path = require("path");

const app = express();
// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:3000","http://inventory-ap.vercel.app"],  //, 
    credentials: true
})); //cors helps us to resolve conflict when we are
// making a request from the backend through the frontend


//neeche vala multer image upload vale lam ke samy likha gaya hai
app.use("/uploads",express.static(path.join(__dirname,"uploads"))); //it will points to upload folder

// Route Middleware
app.use("/api/users", userRoute); 
//jab hum api/users ko call karenge tab vo useroute me jaiga or fir
//vahan se dekhega ki call kiske liye kiya gaya hai logout ke liye
//login ,register ya kisi or cheej ke liye.
//user route vale folder me hame bar bar api/users na likhna pade iss liye
//yahan pe humne uska ek middleware bana rakha hai..
//middleware mtlb is raste se tho gujarna hi hai..
//Routes
app.use("/api/products", productRoute);
app.use("/api/contactus",contactRoute);


app.get("/", (req,res) => {
    res.send("Home Page");
});

// Error Middleware
app.use(errorHandler);

//connect to DB and start server
const PORT = process.env.PORT || 5000;
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server Running on PORT: ${PORT}`);
        })
    })
    .catch((err) => {
        console.log(err);
    })