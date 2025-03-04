// src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Header({ isAuthenticated, handleLogout }) {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Task Manager
                </Typography>
                {isAuthenticated ? (
                    <>
                        <Button color="inherit" component={Link} to="/tasks">
                            Tasks
                        </Button>
                        <Button color="inherit" component={Link} to="/create">
                            Create
                        </Button>
                        <Button color="inherit" component={Link} to="/edit">
                            Edit
                        </Button>
                        <Button color="inherit" component={Link} to="/delete">
                            Delete
                        </Button>
                        <Button color="inherit" component={Link} to="/activity-log">
                            Activity Log
                        </Button>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                        <Button color="inherit" component={Link} to="/register">
                            Register
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Header;