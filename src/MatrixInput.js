import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Grid, Box, Typography, Snackbar, Alert } from '@mui/material';
import config from './config'; // Import the config file

const MatrixInput = () => {
    const location = useLocation();
    const [n, setN] = useState(0);
    const [m, setM] = useState(0);
    const [p, setP] = useState(0);
    const [matrix, setMatrix] = useState([]);
    const [errors, setErrors] = useState({ n: '', m: '', p: '' });
    const [isValid, setIsValid] = useState(false);
    const [selectedCells, setSelectedCells] = useState([{ i: 0, j: 0 }]); // Khởi tạo với tọa độ [0,0]
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [matrixName, setMatrixName] = useState('');

    const validateInputs = useCallback(() => {
        let valid = true;
        const newErrors = { n: '', m: '', p: '' };
        if (n < 1 || n > 500) {
            newErrors.n = '1 <= n <= 500';
            valid = false;
        }
        if (m < 1 || m > 500) {
            newErrors.m = '1 <= m <= 500';
            valid = false;
        }
        if (p < 1 || p > n * m) {
            newErrors.p = '1 <= p <= n * m';
            valid = false;
        }
        setErrors(newErrors);
        setIsValid(valid);
    }, [n, m, p]);

    useEffect(() => {
        // setMatrix([]); // Reset matrix
        if (location.state?.matrix) {
            const { matrixName, m, n, p, matrixData } = location.state.matrix;
            setMatrixName(matrixName);
            setM(m);
            setN(n);
            setP(p);
            setMatrix(JSON.parse(matrixData));
        } else {
            const newMatrix = Array.from({ length: n }, () => Array(m).fill(0));
            setMatrix(newMatrix);
        }
        validateInputs();
    }, [n, m, p, validateInputs, location.state]);

    const handleSaveMatrixClick = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleDialogOk = () => {
        fetch(`${config.baseURL}/insert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ n, m, p, matrixName, matrix, selectedCells }),
        })
            .then(response => response.json())
            .then(data => {
                setSnackbarMessage('Matrix saved successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            })
            .catch(error => {
                setSnackbarMessage('Failed to save matrix');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
        setDialogOpen(false);
    };

    const handleCheck = () => {
        fetch(`${config.baseURL}/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ n, m, p, matrix, selectedCells }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                if (data.message === 'OK') {
                    setSnackbarMessage('Success: The road is the shortest');
                    setSnackbarSeverity('success');
                } else {
                    setSnackbarMessage('Fail: Its not correct');
                    setSnackbarSeverity('error');
                }
                setSnackbarOpen(true);
            })
            .catch(error => {
                console.error('Error:', error);
                setSnackbarMessage('An error occurred');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };

    const handleMatrixChange = (i, j, value) => {
        const newMatrix = [...matrix];
        newMatrix[i][j] = value;
        setMatrix(newMatrix);
    };

    const handleDoubleClick = (i, j) => {
        const cell = { i, j };
        setSelectedCells([...selectedCells, cell]);
    };

    const resetSelection = () => {
        setSelectedCells([{ i: 0, j: 0 }]); // Đặt lại với tọa độ [0,0]
    };

    const generateMatrix = () => {
        const newMatrix = Array.from({ length: n }, () => Array(m).fill(0));
        let nums = Array(p - 1).fill().flatMap((_, i) => Array(1).fill(i + 1));
        while (nums.length < n * m - 1) {
            nums.push(Math.floor(Math.random() * (p - 1)) + 1);
        }
        nums.push(p); // Ensure one cell is p
        nums.sort(() => Math.random() - 0.5);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                newMatrix[i][j] = nums[i * m + j];
            }
        }
        setMatrix(newMatrix);
    };

    const getCellStyle = (i, j) => {
        if (i === 0 && j === 0) {
            return { backgroundColor: 'green' };
        }
        if (matrix[i][j] === p) {
            return { backgroundColor: 'yellow' };
        }
        return {};
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Rows (n)"
                        type="number"
                        value={n}
                        onChange={e => setN(Number(e.target.value))}
                        fullWidth
                        error={!!errors.n}
                        helperText={errors.n}
                        InputProps={{ inputProps: { min: 1, max: 500, style: { appearance: 'textfield' } } }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Columns (m)"
                        type="number"
                        value={m}
                        onChange={e => setM(Number(e.target.value))}
                        fullWidth
                        error={!!errors.m}
                        helperText={errors.m}
                        InputProps={{ inputProps: { min: 1, max: 500, style: { appearance: 'textfield' } } }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Value (p)"
                        type="number"
                        value={p}
                        onChange={e => setP(Number(e.target.value))}
                        fullWidth
                        error={!!errors.p}
                        helperText={errors.p}
                        InputProps={{ inputProps: { min: 1, max: n * m, style: { appearance: 'textfield' } } }}
                    />
                </Grid>
                {isValid && (
                    <Grid item xs={12}>
                        <Button variant="contained" color="secondary" onClick={generateMatrix}>
                            Generate Matrix
                        </Button>
                    </Grid>
                )}
                {matrix.length > 0 && ((Array.from({ length: matrix.length }).map((_, i) => (
                    <Grid item xs={12} key={i}>
                        <Grid container spacing={2}>
                            {Array.from({ length: m }).map((_, j) => (
                                <Grid item key={j}>
                                    <TextField
                                        label={`(${i}, ${j})`}
                                        type="number"
                                        value={matrix[i][j]}
                                        onChange={e => handleMatrixChange(i, j, Number(e.target.value))}
                                        onDoubleClick={() => handleDoubleClick(i, j)}
                                        sx={{
                                            width: '60px',
                                            ...getCellStyle(i, j)
                                        }}
                                        InputProps={{ inputProps: { style: { appearance: 'textfield' } } }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                ))))}

                {isValid && (
                    <>
                        <Grid item xs={12}>
                            <Typography variant="h6">The Road to Treasure</Typography>
                            {selectedCells.length > 0 && (
                                <Typography variant="body1">Steps: {selectedCells.map(cell => `(${cell.i}, ${cell.j})`).join(', ')}</Typography>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="secondary" onClick={resetSelection} sx={{ mr: 2 }}>
                                Reset Selection
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleCheck}>
                                Check
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={handleSaveMatrixClick}>
                                Save Matrix
                            </Button>
                            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                                <DialogTitle>Enter Matrix Name</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Please enter a name for the matrix.
                                    </DialogContentText>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        label="Matrix Name"
                                        fullWidth
                                        value={matrixName}
                                        onChange={(e) => setMatrixName(e.target.value)}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleDialogClose} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={handleDialogOk} color="primary">
                                        OK
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Grid>
                    </>
                )}
            </Grid>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MatrixInput;