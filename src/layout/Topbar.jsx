import { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Popover,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { toast } from "react-toastify"; // Import the toast module
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout, selectUser } from "../redux/slice/userSlice";

const Topbar = ({ userRole }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [anchorEl, setAnchorEl] = useState(null);
  // State to manage user role
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logout successful"); // Display success toast for logout
    navigate("/");
    setAnchorEl(null); // Close the popover after logout
  };

  const handleUserIconClick = (event) => {
    setAnchorEl(event.currentTarget);
   
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      margin="-8px"
      display="flex"
      justifyContent="space-between"
      p={2}
      backgroundColor="#efefef" // Set your desired background color here
    >
     
      <Box display="flex" borderRadius="3px" backgroundColor="#d7a022">
        
        {/* Add your search bar component here if needed */}
      </Box>

      {/* ICONS */}
      <Box display="flex" color="#d7a022" alignItems="center">
      <IconButton onClick={handleUserIconClick} sx={{ color: "#d7a022", display: 'flex', alignItems: 'center' }}>
      {/* <h3>{import.meta.env.VITE_REACT_APP_VITE_API_URL}</h3> */}
     
      
       <PersonOutlinedIcon />
      <Box ml={1}>
        
        <Typography variant="body1" sx={{ color: "black" }}>
          Welcome, 
        </Typography>
      </Box>
    </IconButton>

        {/* Display the username next to the user profile icon */}
        {user && (
          <Typography variant="body2" color="#d7a022" sx={{ mr: 1 }} fontSize={22}>
            {user.name}
          </Typography>
        )}

        {/* User Information Popover */}
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Paper>
            <List>
              {user && (
                <>
                  <ListItem>
                    <ListItemText primary={`Name: ${user.name} `} />
                  </ListItem>
                  {userRole === "cashier" && (
                    <>
                      <ListItem>
                        <ListItemText primary={`Role: ${userRole}`} />
                      </ListItem>
                      <Divider />
                    </>
                  )}
                  {userRole === "Registral" && (
                    <>
                      <ListItem>
                        <ListItemText primary={`Role: ${userRole}`} />
                      </ListItem>
                      <Divider />
                    </>
                  )}
                </>
              )}
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Paper>
        </Popover>
      </Box>
    </Box>
  );
};

export default Topbar;
