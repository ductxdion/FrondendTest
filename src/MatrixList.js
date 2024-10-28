import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import config from './config'; // Import the config file

const MatrixList = () => {
    const [matrices, setMatrices] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${config.baseURL}/list`)
            .then(response => response.json())
            .then(data => setMatrices(data))
            .catch(error => console.error('Error fetching matrix list:', error));
    }, []);

    const handleEdit = (matrix) => {
        navigate('/input', { state: { matrix } });
    };

    const handleDelete = (id) => {
        fetch(`${config.baseURL}/delete/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    setMatrices(matrices.filter(matrix => matrix.id !== id));
                    setSnackbarMessage('Matrix deleted successfully');
                    setSnackbarSeverity('success');
                } else {
                    throw new Error('Failed to delete matrix');
                }
            })
            .catch(error => {
                console.error('Error deleting matrix:', error);
                setSnackbarMessage('Failed to delete matrix');
                setSnackbarSeverity('error');
            })
            .finally(() => {
                setSnackbarOpen(true);
            });
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Matrix Name</TableCell>
                        <TableCell align="right">M</TableCell>
                        <TableCell align="right">N</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {matrices.map((matrix) => (
                        <TableRow key={matrix.id}>
                            <TableCell component="th" scope="row">
                                {matrix.matrixName}
                            </TableCell>
                            <TableCell align="right">{matrix.m}</TableCell>
                            <TableCell align="right">{matrix.n}</TableCell>
                            <TableCell align="right">
                                <Button onClick={() => handleEdit(matrix)}>Edit</Button>
                                <Button onClick={() => handleDelete(matrix.id)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
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
        </TableContainer>
    );
};

export default MatrixList;