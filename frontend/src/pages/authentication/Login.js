import React, { useState } from 'react'
import styles from "./auth.module.css";
import {BiLogIn} from "react-icons/bi"
import Card from '../../components/card/Card';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser, validateEmail } from '../../services/authService';
import { toast } from 'react-toastify';
import { SET_LOGIN, SET_NAME } from '../../redux/features/auth/authSlice';
import Loader from '../../components/loader/Loader';

 
const initialState = {
  email: '',
  password: '',
}

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState(initialState)
  const {email,password} = formData

  const handleInputChange = (e) => {
    const {name,value} = e.target;
    setFormData({...formData, [name]: value})
  }

  const login = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      return toast.error("All fields are required")
    }

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email")
    }

    const userData = {
      email,
      password
    }
    setIsLoading(true)

    // neeche vale try catch block me hi hum yahan pe us login 
    // function ka use karenge jo humne authservices me banaya hai
    try {
      const data = await loginUser(userData)
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
              <BiLogIn size = {35} color = '#999'/>
            </div>
            <h2>Login</h2>

              <form onSubmit={login}>
                <input type="email" placeholder="Email" required name = "email" value={email} onChange = {handleInputChange}/>
                <input type="password" placeholder="Password" required name = "password" value={password} onChange = {handleInputChange}/>
                <button type="submit" className = "--btn --btn-primary --btn-block">Login</button>
              </form>

              <Link to="/forgot">Forgot Password</Link>

              <span className={styles.register}>
              {/* humne link par click kiya vo 'to' path pe gaya vahan se
              vo data app.js me jo route ke andar hai uske element ko
              us path pe access karega.. */}
                <Link to = "/">Home</Link> 
                <p> &nbsp; Don't have an account? &nbsp;</p>
                <Link to = "/register">Register</Link>
              </span>
          </div>
        </Card>
    </div>
  )
} 

export default Login