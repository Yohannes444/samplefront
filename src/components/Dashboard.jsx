// src/App.js

import  { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { selectUser } from "../redux/slice/userSlice";
import { useSelector } from "react-redux";


const HoverCard = styled(Card)({
  transition: 'transform 0.3s, box-shadow 0.3s',
  backgroundColor: '#e0f2e9', // Light green background color
  '&:hover': {
    transform: 'scale(0.99)',
    boxShadow: '0 10px 20px rgba(0, 128, 0, 0.6)', // Green shadow color
  },
});

const TitleBox = styled(Box)({
  backgroundColor: 'green', // Background color for the title
  color: 'white', // Text color for better readability
  padding: '8px',
  borderRadius: '4px',
  marginBottom: '16px',
  display: 'inline-block', // Make the box fit the content only
});

const DataText = styled(Typography)({
  fontSize: '1.2rem', // Larger font size for data text
  color: 'text.secondary',
});

function App() {
  const [data, setData] = useState(null);
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    setLoading(true); // Set loading to true when fetching data starts
    fetch(`${import.meta.env.VITE_REACT_APP_VITE_API_URL}/stat?tiketerId=${user._id}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false); // Set loading to false when data fetching completes
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false in case of error
      });
  }, [user._id]); // Dependency array ensures useEffect runs when user ID changes

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2}>
        {Object.entries(data).map(([key, value]) => (
          <Grid item xs={12} sm={6} md={6} key={key}>
            <HoverCard>
              <CardContent>
                <TitleBox>
                  <Typography variant="h5" component="div">
                    {key}
                  </Typography>
                </TitleBox>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <DataText variant="body2" sx={{fontSize:"25px", fontFamily:"bold"}}>
                      Total
                    </DataText>
                  </Grid>
                  <Grid item xs={4}>
                    <DataText variant="body2" sx={{fontSize:"25px", fontFamily:"bold"}}>
                      Profit
                    </DataText>
                  </Grid>
                  <Grid item xs={4}>
                    <DataText variant="body2" sx={{fontSize:"25px", fontFamily:"bold"}}>
                      Paid
                    </DataText>
                  </Grid>
                  <Grid item xs={4}>
                    <DataText variant="body2" sx={{fontSize:"25px", fontStyle:"bold"}}>
                      {value.total} Birr
                    </DataText>
                  </Grid>
                  <Grid item xs={4}>
                    <DataText variant="body2" sx={{fontSize:"25px", fontStyle:"bold"}}>
                      {value.profit} Birr
                    </DataText>
                  </Grid>
                  <Grid item xs={4}>
                    <DataText variant="body2" sx={{fontSize:"25px", fontStyle:"bold"}}>
                      {value.paid} Birr
                    </DataText>
                  </Grid>
                </Grid>
              </CardContent>
            </HoverCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default App;
