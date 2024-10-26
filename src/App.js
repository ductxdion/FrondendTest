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

  const handleCheck = async (n, m, p, matrix, selectedCellsData) => {
    const response = await fetch('https://localhost:7188/api/Matrix/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ n, m, p, matrix, selectedCellsData }),
    });
    const result = await response.json();
    console.log('Check Result:', result);
  };

  return (
    <Container>
      <h1>Treasure Hunt</h1>
      <MatrixInput onSubmit={handleSubmit} onCheck={handleCheck} />
    </Container>
  );
};

export default App;
