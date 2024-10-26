import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Box, Typography } from '@mui/material';

const MatrixInput = ({ onSubmit, onCheck }) => {
    const [n, setN] = useState(0);
    const [m, setM] = useState(0);
    const [p, setP] = useState(0);
    const [matrix, setMatrix] = useState([]);
    const [errors, setErrors] = useState({ n: '', m: '', p: '' });
    const [isValid, setIsValid] = useState(false);
    const [selectedCells, setSelectedCells] = useState([]);

    useEffect(() => {
        const newMatrix = Array.from({ length: n }, () => Array(m).fill(0));
        setMatrix(newMatrix);
        validateInputs();
    }, [n, m, p]);

    const validateInputs = () => {
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
    };

    const handleSubmit = () => {
        onSubmit(n, m, p, matrix);
    };

    const handleCheck = () => {
        const selectedCellsData = selectedCells.map(cell => {
            const [i, j] = cell.slice(1, -1).split(', ').map(Number);
            return matrix[i][j];
        });
        onCheck(n, m, p, matrix, selectedCellsData);
    };

    const handleMatrixChange = (i, j, value) => {
        const newMatrix = [...matrix];
        newMatrix[i][j] = value;
        setMatrix(newMatrix);
    };

    const handleDoubleClick = (i, j) => {
        const cell = `(${i}, ${j})`;
        if (!selectedCells.includes(cell)) {
            setSelectedCells([...selectedCells, cell]);
        }
    };

    const resetSelection = () => {
        setSelectedCells([]);
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
                {Array.from({ length: n }).map((_, i) => (
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
                                            backgroundColor: selectedCells.includes(`(${i}, ${j})`) ? 'red' : 'inherit'
                                        }}
                                        InputProps={{ inputProps: { style: { appearance: 'textfield' } } }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                ))}
                {isValid && (
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleCheck}>
                            Check
                        </Button>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Typography variant="h6">The Road to Treasure</Typography>
                    {selectedCells.length > 0 && (
                        <Typography variant="body1">Selected Cells: {selectedCells.join(', ')}</Typography>
                    )}
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="secondary" onClick={resetSelection}>
                        Reset Selection
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MatrixInput;
