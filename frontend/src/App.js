import React, { useEffect } from 'react'
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter,Routes,Route} from "react-router-dom"
import Home from "./pages/Home/Home";
import Reset from "./pages/authentication/Reset";
import Forgot from "./pages/authentication/Forgot";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import Dashboard from './pages/dashboard/Dashboard';
import Sidebar from './components/sidebar/Sidebar';
import Layout from './components/layout/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { getLoginStatus } from './services/authService';
import { SET_LOGIN } from './redux/features/auth/authSlice';
import AddProduct from "./pages/addProduct/AddProduct";
import ProductDetail from './components/product/productDetail/ProductDetail';
import Profile from './pages/profile/Profile';
import EditProduct from './pages/editProduct/EditProduct';
import EditProfile from './pages/profile/EditProfile';
import Contact from './pages/contact/Contact';

axios.defaults.withCredentials = true;
// by the help of this above statement , anytime we make a request with
// axios across the full application the full frontend its going to make
// sure that we are able to save credentials, 
// and so we have done this here we set a default property here, and what 
// that means is that we can skip adding this credentials every where in 
// our application and still going to save the credentials of that user..
// but in authService.js we have done this manually for register user 
// so that we know how to set it in a single url



function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    async function loginStatus() {
      const status = await getLoginStatus()
      dispatch(SET_LOGIN(status))
      // here status is passing as a payload
    }
    loginStatus()
  }, [dispatch])
  
  return (
    // browser router surrounds all our routes
    <BrowserRouter>  
    <ToastContainer/>
      <Routes>
        {/* route me bata rahe hain ki jab hum us path pe hain 
        tho kya cheej access hogi jo ki hai element */}
        <Route path = "/" element = {<Home/>} />
        <Route path = "/login" element = {<Login/>} />
        <Route path = "/register" element = {<Register/>} />
        <Route path = "/forgot" element = {<Forgot/>} />
        <Route path = "/resetpassword/:resetToken" element = {<Reset/>} />
        <Route path = "/dashboard" element = {
          <Sidebar>
            <Layout>
              <Dashboard/>
            </Layout>
          </Sidebar>
        } />
        <Route
          path="/add-product" element={
            <Sidebar>
              <Layout>
                <AddProduct />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/product-detail/:id" element={
            <Sidebar>
              <Layout>
                <ProductDetail />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/edit-product/:id" element={
            <Sidebar>
              <Layout>
                <EditProduct />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/profile" element={
            <Sidebar>
              <Layout>
                <Profile />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/edit-profile" element={
            <Sidebar>
              <Layout>
                <EditProfile />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/contact-us" element={
            <Sidebar>
              <Layout>
                <Contact />
              </Layout>
            </Sidebar>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
