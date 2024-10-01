import React, { useState } from "react";
import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/system";
import { Link, useLocation } from "react-router-dom";
import SpeedIcon from "@mui/icons-material/Speed";
const drawerWidth = 200; // Reduced width

const DrawerStyled = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    backgroundColor: "#1a1d47", // Light green color or #efefef (to change to grey color)
    color: "#f5f5f5",
  },
}));

const Logo = styled("img")({
  width: "80%",
  height: "auto",
  margin: "20px auto",
});

const ListItemStyled = styled(ListItem)(({ theme }) => ({
  "&:hover": {
    color: "#f5f5f5",
    backgroundColor: "#d7a022",
  },
}));

const SelectedListItem = styled(ListItem)(({ theme }) => ({
  color: "black",
  backgroundColor: "#d7a022",
}));

const NestedListItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
}));

const Sidebar = ({ userRole }) => {
  const location = useLocation();
  

  return (
    <DrawerStyled variant="permanent">
      <List>
        <Box textAlign="center">
          <Logo src="/assets/betlogin.png" alt="Logo" />
        </Box>

        {userRole === "cashier" && (
          <>
            <ListItemStyled
        component={Link}
        to="/dashboard"
        button
        className={
          location.pathname.startsWith("/dashboard")
            ? SelectedListItem.className
            : ""
        }
      >
        <ListItemIcon
          style={{
            color: location.pathname.startsWith("/dashboard")
              ? "black"
              : "#d7a022",
          }}
        >
          <SpeedIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />

      </ListItemStyled>
           
          </>
        )}
      </List>
    </DrawerStyled>
  );
};

export default Sidebar;
