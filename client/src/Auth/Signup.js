import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {useNavigate,Link} from 'react-router-dom';
import signupimg from '../assets/img/SignUp.jpg' ;
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: `url(${signupimg}) center`
  },
  loginCard: {
    width: '300px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    // background:"burlywood !important"
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  textField: {
    marginBottom: '15px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
  }));

const Signup = () => {
  const navigate = useNavigate();


const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const classes = useStyles();

  const [verificationCode, setVerificationCode] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [alertState, setAlertMsg] = useState({ open: false, color: '', message: '' })



  const handleSignUp = async (e) => {
    e.preventDefault();
    // Call backend API to register the user
    // This is where you would typically send the email and password to your backend server
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
       
        headers: {
          'Content-Type': 'application/json',
        },     
        body: JSON.stringify({email,password }),
      });
      if (response.ok) {
        //  await sendVerificationCode();
         const responseData = await response.json();
         const message = responseData.message; 
         console.log(message,"message")
        setAlertWithDuration(true,"success",message)
        setIsVerificationSent(true);
      } else {
        // Handle error response
        const responseData = await response.json();
        const errorMessage = responseData.message; 
        setAlertWithDuration(true,"error",errorMessage)
        // navigate('/login')
      }
    } catch (error) {
      // Handle network error
      setAlertWithDuration(true,"error",error)
   
    }
  };


  const setAlertWithDuration = (open,color,message, duration = 3000) => {
    setAlertMsg({ open, color, message });
    setTimeout(() => setAlertMsg({ open: false, color: '', message: '' }), duration);
  };
 

  const handleVerification = async (e) => {
    e.preventDefault();
    // Call backend API to verify the code
    try {
      const response = await fetch('http://localhost:3000/verifyEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verificationCode }),
      });
      if (response.ok) {
        // Email verification successful, do something
        const responseData = await response.json();
        const message = responseData.message; 
       setAlertWithDuration(true,"success",message)
       navigate('/login');
      } else {
        // Handle verification error
        const responseData = await response.json();
        const message = responseData.message; 
       setAlertWithDuration(true,"error",message)
      }
    } catch (error) {
      // Handle network error
      setAlertWithDuration(true,"error",error)
    }
  };

  return (
    <>
    <Alert open={alertState.open} severity={alertState.color}>{alertState.message}</Alert>
    <div className={classes.container} >
    <div className={classes.loginCard}>
    <h2>Sign Up</h2>
      {!isVerificationSent ? (
        <form className={classes.form} onSubmit={handleSignUp}>
          <TextField
            className={classes.textField}
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            className={classes.textField}
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
          >
            Sign Up
          </Button>
        </form>
      ) : (
        <form className={classes.form} onSubmit={handleVerification}>
          <TextField
            className={classes.textField}
            label="Verification Code"
            variant="outlined"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
          >
            Verify
          </Button>
        </form>
      )}
      <h3>Already Registered ? <Link to='/login'>Log in</Link></h3>
    </div>
    </div>
    </>
  )
}

export default Signup
