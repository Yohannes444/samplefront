// src/components/UserForm.js
import React, { useState } from 'react';
import { TextField, Button, FormControlLabel, Checkbox } from '@mui/material';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserForm = () => {
  // Define state for each field
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [active, setActive] = useState(true);
  const navigate = useNavigate();

  // Handle form field changes
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === 'checkbox') {
      setActive(checked);
    } else {
      switch (name) {
        case 'name':
          setName(value);
          break;
        case 'email':
          setEmail(value);
          break;
        case 'password':
          setPassword(value);
          break;
        case 'phone':
          setPhone(value);
          break;
        default:
          break;
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Combine state variables into a single object
    const formData = {
      fullName:name,
      email:email,
      password:password,
      phoneNumber:phone,
      role: 'cashier'
    };

    try {
      
      // Send POST request to auth/signup endpoint
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_VITE_API_URL}/user/signup`, formData);
      if(response.status < 299){
        navigate("/");
      }
      console.log(response.data); // Handle response
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: 'auto' }}>
      <TextField
        fullWidth
        label="Name"
        margin="normal"
        name="name"
        value={name}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="Email"
        margin="normal"
        name="email"
        type="email"
        value={email}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        name="password"
        value={password}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="Phone"
        margin="normal"
        name="phone"
        value={phone}
        onChange={handleChange}
      />
      <FormControlLabel
        control={<Checkbox checked={active} onChange={handleChange} name="active" />}
        label="Active"
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};

export default UserForm;
