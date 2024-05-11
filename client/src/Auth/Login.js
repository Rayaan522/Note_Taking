import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {useNavigate,Link} from 'react-router-dom';
import loginimg from '../assets/img/login.jpg';
import Alert from '@material-ui/lab/Alert';


const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: `url(${loginimg}) center`
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
  signUpLink: {
    marginTop: '15px',
    fontSize: '1rem',
    textAlign: 'center',
  },
  signUpLinkA: {
    color: '#007bff',
    textDecoration: 'none',
  },
  signUpLinkA: {
    color: '#007bff',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

const Login = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  // State variables to store email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertState, setAlertMsg] = useState({ open: false, color: '', message: '' })


  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password}),
        });
      
        if (response.ok) {
          const data = await response.json();
         localStorage.setItem("userId",data.userId)
       setAlertWithDuration(true,"success","Login SuccessFully")
        
         navigate('/notes');
        } else {
          
          // const responseData = await response.json();
          // const message = responseData.message; 
         setAlertWithDuration(true,"error","Invalid credentials")
        }
      } catch (error) {
        // Handle network error
        setAlertWithDuration(true,"error","Something went wrong")
      }
  };
  const setAlertWithDuration = (open,color,message, duration = 3000) => {
    setAlertMsg({ open, color, message });
    setTimeout(() => setAlertMsg({ open: false, color: '', message: '' }), duration);
  };
  return (
    <>
    <Alert open={alertState.open} severity={alertState.color}>{alertState.message}</Alert>
    <div className={classes.container} >
<div className={classes.loginCard}>

      <h2>Login</h2>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          className={classes.textField}
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          className={classes.textField}
          label="Password"
          type="password"
          variant="outlined"
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
          Login
        </Button>
        <div className={classes.signUpLink}>
          <h3>Not Registered? <Link to='/' className={classes.signUpLinkA}>Sign up</Link></h3>
        </div>
      </form>
    </div>
    </div>
    </>
  );
};

export default Login;
