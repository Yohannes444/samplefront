import React from "react";
import { Box, FormControl, FormLabel, Button, CircularProgress } from "@mui/material";
import Input from "@mui/joy/Input";

const InputForm = ({ formData, handleInputChange, handleGetOrderClick, loading }) => (
  <Box
    component="form"
    sx={{ marginBottom: "16px", display: "flex", gap: "16px" }}
  >
    <FormControl>
      <FormLabel sx={{color:"black", fontWeight:"bold"}} >Start Date</FormLabel>
      <Input
        type="date"
        name="startDate"
        value={formData.startDate}
        onChange={handleInputChange}
      />
    </FormControl>
    <FormControl>
      <FormLabel sx={{color:"black", fontWeight:"bold"}} >End Date</FormLabel>
      <Input
        type="date"
        name="endDate"
        value={formData.endDate}
        onChange={handleInputChange}
      />
    </FormControl>
    <Button
      fullWidth
      variant="contained"
      style={{
        backgroundColor: "#000000",
        color: "white",
        padding: "1rem",
        marginTop: "1.5rem",
        width: "200px",
        height: "40px",
      }}
      onClick={handleGetOrderClick}
      disabled={loading}
    >
      {loading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        "GET ORDERS"
      )}
    </Button>
  </Box>
);

export default InputForm;
