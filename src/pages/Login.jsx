import React, { useState, useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { CircularProgress } from '@mui/material';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { loginUserAsync } from "../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios'

export default function SignIn() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const [loading, setLoading] = useState(false); // State to manage loading spinner
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_VITE_API_URL}/user`);
        console.log("fetch users: ",response.data.length );
        if (response.data.length < 1) {
          navigate("/signup");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/signup");
      }
    };

    fetchUser();
  }, [navigate]); 

  const handleLogin = async () => {
    setLoading(true);
    try {
      await dispatch(loginUserAsync({ email, password }));
      navigate("/dashboard");
      toast.success("Login successful");
    } catch (error) {
      console.error("Login failed:", error.message);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="md" // Adjust the container's max width as necessary
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "90vh",
        width: "100%",
      }}
    >
      <Paper
        elevation={3}
        className="authForm"
        style={{
          padding: "2rem",
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: "900px", // Adjust the maximum width of the card
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              maxWidth: "400px", // Adjust the maximum width of the image
            }}
            src="/assets/betlogin.png"
            alt="Purpose Black Ethiopia"
          />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          <Avatar style={{ backgroundColor: "green", marginBottom: "1rem" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            variant="h5"
            gutterBottom
            style={{
              fontFamily: "cursive",
              color: "#333",
              marginBottom: "1rem",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            Welcome To 3-s Betting 
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Phone Number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'} // Toggle password visibility
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{ // Add input adornment for password visibility toggle
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )
            }}
          />
          <Button
            fullWidth
            variant="contained"
            style={{
              backgroundColor: "green", // Change the color to #d7a022
              color: "black",
              padding: "1rem",
              marginTop: "1rem",
            }}
            onClick={handleLogin}
            disabled={loading} // Disable button when loading
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"} 
          </Button>
        </div>
      </Paper>

      {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Container>
  );
}
