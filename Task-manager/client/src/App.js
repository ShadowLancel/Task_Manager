// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import TaskList from './components/TaskList';
import Login from './components/Login';
import Register from './components/Register'; // Новый импорт
import PrivateRoute from './components/PrivateRoute';
import CreatePage from './components/CreatePage';
import EditPage from './components/EditPage';
import DeletePage from './components/DeletePage';
import ActivityLog from './components/ActivityLog';
import Home from './components/Home';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        window.location.href = '/login';
    };

    return (
        <Router>
            <Header isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/tasks"
                    element={
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                            <TaskList />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/create"
                    element={
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                            <CreatePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/edit"
                    element={
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                            <EditPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/delete"
                    element={
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                            <DeletePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/activity-log"
                    element={
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                            <ActivityLog />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;