import React from 'react';
import { Container, Grid, Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container maxWidth="md" style={{ paddingTop: '50px' }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box display="flex" justifyContent="center">
            <img src="/assets/404.svg" alt="404 Not Found" style={{ width: '100%', maxWidth: '600px' }} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h3" component="h1" gutterBottom>
            404 - Page Not Found
          </Typography>
          <Typography variant="h6" component="p" gutterBottom>
            Sorry, the page you are looking for does not exist.
          </Typography>
          <Button 
            variant="contained" 
            component={Link} 
            to="/" 
            sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'grey' } }}
          >
            Go to Homepage
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NotFound;
