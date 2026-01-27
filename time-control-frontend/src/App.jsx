import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import { Button, Container, Typography } from '@mui/material';

function App() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Time Control Frontend
      </Typography>
      <Button variant="contained" color="primary">
        Empezar
      </Button>
    </Container>
  );
}

export default App;
