import React, { useState } from 'react'
// import "./Register.css";
// import { FaUserPlus } from 'react-icons/fa';
// import { GiHumanPyramid  } from 'react-icons/gi';
import styles from "./auth.module.css";
import {TiUserAddOutline} from "react-icons/ti"
import Card from '../../components/card/Card';
import { Link,useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser, validateEmail } from '../../services/authService';
import { useDispatch} from "react-redux";
import { SET_LOGIN, SET_NAME } from '../../redux/features/auth/authSlice';
import Loader from '../../components/loader/Loader';

const initialState = {
  name: '',
  email: '',
  password: '',
  password2: '',
}

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState(initialState)
  const {name,email,password,password2} = formData

  const handleInputChange = (e) => {
    const {name,value} = e.target;
    setFormData({...formData, [name]: value})
  }

  const register = async (e) => {
    e.preventDefault()

    if (!name || !email || !password || !password2) {
      return toast.error("All fields are required")
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters")
    }

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email")
    }

    if (password !== password2) {
      return toast.error("Passwords do not match")
    }

    const userData = {
      name,
      email,
      password
    }
    setIsLoading(true)

    // neeche vale try catch block me hi hum yahan pe us register 
    // function ka use karenge jo humne authservices me banaya hai
    try {
      const data = await registerUser(userData)
      await dispatch(SET_LOGIN(true))
      await dispatch(SET_NAME(data.name))
      navigate("/dashboard")
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false) 
      toast.error(error.message)
    }
  }

  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader/>}
        {/* We can see the content that is written inside Card tags in 
        login.js has reached the Card.js component through the prop 'children'. */}
        <Card>
          <div className={styles.form}>
            <div className='--flex-center'>
              <TiUserAddOutline size = {35} color = '#999'/>
            </div>
            <h2>Register</h2>

              <form onSubmit={register}>
                <input type="text" placeholder="Name" required name = "name" value={name} onChange = {handleInputChange}/>
                <input type="email" placeholder="Email" required name = "email" value={email} onChange = {handleInputChange}/>
                <input type="password" placeholder="Password" required name = "password" value={password} onChange = {handleInputChange}/>
                <input type="password" placeholder="Confirm Password" required name = "password2" value={password2} onChange = {handleInputChange}/>
                <button type="submit" className = "--btn --btn-primary --btn-block">Register</button>
              </form>

              <span className={styles.register}>
                <Link to = "/">Home</Link>
                <p> &nbsp; Already an account? &nbsp;</p>
                <Link to = "/login">Login</Link>
              </span>
          </div>
        </Card>
    </div>
  //   {/* <div className="full">
  //   {isLoading && <Loader/>}
  //   <div className="box1">
  //   <div class="register-logo"> <GiHumanPyramid size={80}/> </div> 
    
  //     <div className="register-box"> 
  //     <form onSubmit={register}>
  //       <h2 className="register-heading"> <FaUserPlus size = {35} /> Register </h2>
        
  //       <input type="text" className="form-control" id="input1" placeholder="  Enter Your Name" name = "name" aria-label="Username" aria-describedby="addon-wrapping" value={name} onChange = {handleInputChange} required/>

  //       <input type="email" className="form-control" id="input2" placeholder="  Enter Your Email" name = "email" aria-label="Username" aria-describedby="addon-wrapping" value={email} onChange = {handleInputChange} required />

  //       <input type="password" className="form-control" id="input3" placeholder="  Enter Your Password" name = "password" aria-label="Username" aria-describedby="addon-wrapping" value={password} onChange = {handleInputChange} required/>

  //       <input type="password" className="form-control" id="input4" placeholder=" Re-type Password" name = "password2" aria-label="Username" aria-describedby="addon-wrapping" value={password2} onChange = {handleInputChange} required/>

  //       <button type="submit" className ="btn btn-primary" id="register-btn1"> Register </button>
  //       </form>

  //     </div>
  //   </div>
    
  // </div> */}
  )
}

export default Register;