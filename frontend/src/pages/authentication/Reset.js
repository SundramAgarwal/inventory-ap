import React, { useState } from 'react'
import styles from "./auth.module.css";
import {MdPassword} from "react-icons/md"; 
import Card from '../../components/card/Card';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword } from '../../services/authService';

const initialState = {
  password: '',
  password2: '',
}

const Reset = () => {

  const [formData, setFormData] = useState(initialState);
  const {password, password2} = formData
  const {resetToken} = useParams()


  const handleInputChange = (e) => {
    const {name,value} = e.target;
    setFormData({...formData, [name]: value})
  }

  const reset = async (e) => {
    e.preventDefault();

    if (!password || !password2) {
      return toast.error("All fields are required")
    }

    if (password !== password2) {
      return toast.error("Passwords do not match")
    }

    const userData = {
      password,
      password2
    } 

    try {
      // yahan se neeche vale line me yeh hora hai ki yahan se
      // humne authservices me jo reset password ka banaya hai
      // usko access karenge or vo backend me jo resetpassword
      // ka banaya hai usse access karega tho data.message se 
      // hume vo msg mil raha hai jo humne backend me set kiya 
      // hua hai
      const data = await resetPassword(userData,resetToken)
      toast.success(data.message)
    } catch (error) {
      console.log(error.message)
    }
  };


  return (
    <div className={`container ${styles.auth}`}>
{/* We can see the content that is written inside Card tags in 
login.js has reached the Card.js component through the prop 'children'. */}
        <Card>
          <div className={styles.form}>
            <div className='--flex-center'>
              <MdPassword size = {35} color = '#999'/>
            </div>
            <h2>Reset Password</h2>

              <form onSubmit={reset}>
                <input type="password" placeholder="New Password" required name = "password" value={password} onChange = {handleInputChange}/>
                <input type="password" placeholder="Confirm New Password" required name = "password2" value={password2} onChange = {handleInputChange}/>
                <button type="submit" className = "--btn --btn-primary --btn-block">Reset Password</button>
                <div className={styles.links}>
                <p><Link to = "/">-Home</Link></p>
                <p><Link to = "/login">-Login</Link></p>
              </div>
              </form>
     
          </div>
        </Card>
    </div>
  )
}

export default Reset;