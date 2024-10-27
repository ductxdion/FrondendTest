import React from 'react';
import MatrixInput from './MatrixInput';
import { Container } from '@mui/material';

const App = () => {
  const handleSubmit = (n, m, matrix) => {
    // Send data to backend
    fetch('http://localhost:5000/api/treasurehunt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ n, m, matrix }),
    })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
  };

  return (
    <Container>
      <h1>Treasure Hunt</h1>
      <MatrixInput />
    </Container>
  );
};

export default App;
