import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';
import MatrixInput from './MatrixInput';
import MatrixList from './MatrixList';

const App = () => {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/input">
            Matrix Input
          </Button>
          <Button color="inherit" component={Link} to="/list">
            Matrix List
          </Button>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/input" element={<MatrixInput />} />
        <Route path="/list" element={<MatrixList />} />
        <Route path="/" element={<MatrixInput />} />
      </Routes>
    </Router>
  );
};

export default App;