// everything that concerns making HTTP Request to the 
// backend will be having inside of this authService.js

//  and we also going to have a .env file that will point to
// the backend , so our backend url we are going to slot 
// it inside the .env file and here it wil be local host 5000
import axios from 'axios';
import { toast } from 'react-toastify';

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL; 

export const validateEmail = (email) => {
    return email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

// so when ever i want to register a user there is some 
// information that we are going to send to the data base 
// and that parameter will going to be "userData"


// Register User
export const registerUser = async (userData) => {
// in downstatement the last think after userData is that we want to be able to
// allow this request to get some form of credential from that API endpoint
// when we register a user we are getting back a cookie from that backend URL
// and its that cookie that will be saved in our front end and enable us to 
// know that this user is loggedIn so for that their is a property in axios 
// that we need to specify so that it is able to get that cookie and then save
// it in your browser and that property is going to enter an object and name of
// that property is  {withCredentials}
// so now remember that we are also going to make another request to log in the
// user ,Does it mean that we will be adding this with credential everywhere?
// so technically yes , so to simply this process from the root of our application
// for that we go to root of our application i.e app.js and then import axios there
// and axios.defauts.withCredentials = true
    try {
        const response = await axios.post(`${BACKEND_URL}/api/users/register`, 
        userData,{withCredentials: true});
        if (response.statusText === "OK") {
            toast.success("User - Registered Successfully")
        }
        return response.data
    } catch (error) {
        const message = (
            error.response && error.response.data && error.response.data.message
        ) || error.message || error.toString();
        toast.error(message);
    }
};

// Login User
export const loginUser = async (userData) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/users/login`, 
            userData,);
            if (response.statusText === "OK") {
                toast.success("User - Logged IN Successfully")
            }
            return response.data
        } catch (error) {
            const message = (
                error.response && error.response.data && error.response.data.message
            ) || error.message || error.toString();
            toast.error(message);
        }
    };

// logout user
export const logoutUser = async () => {
    try {
        await axios.get(
            `${BACKEND_URL}/api/users/logout`,
            toast.success("Logged Out Successfully")
        );
 
    } catch (error) {
        const message = (
            error.response && error.response.data && error.response.data.message
        ) || error.message || error.toString();
        toast.error(message);
    }
};

// Forgot password
export const forgotPassword = async (userData) => {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/api/users/forgotpassword`, userData);
            toast.success(response.data.message) //video number 127 to understand this line
    } catch (error) {
        const message = (
            error.response && error.response.data && error.response.data.message
        ) || error.message || error.toString();
        toast.error(message);
    }
};

//Reset password
export const resetPassword = async (userData,resetToken) => {
    try {
        const response = await axios.put(
            `${BACKEND_URL}/api/users/resetpassword/${resetToken}`, userData);
            return response.data
    } catch (error) {
        const message = (
            error.response && error.response.data && error.response.data.message
        ) || error.message || error.toString();
        toast.error(message);
    }
};
// Get Login Status
export const getLoginStatus = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/users/loggedin`);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  };

// get user profile

export const getUser = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/users/getuser`);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  };


// update profile

export const updateUser = async (formData) => {
    try {
      const response = await axios.patch(`${BACKEND_URL}/api/users/updateuser`, formData);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  };

// change password

export const changePassword = async (formData) => {
    try {
      const response = await axios.patch(`${BACKEND_URL}/api/users/changepassword`, formData);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  };

