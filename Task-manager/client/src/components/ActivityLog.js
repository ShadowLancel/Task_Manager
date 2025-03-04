// src/components/ActivityLog.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

function ActivityLog() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/activity_log/', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setLogs(response.data);
            } catch (err) {
                setError('Failed to fetch logs.');
                console.error('Error fetching logs:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;
    if (logs.length === 0) return <Typography>No activity logs available.</Typography>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Activity Log</Typography>
            <List>
                {logs.map((log) => (
                    <ListItem key={log.id}>
                        <ListItemText
                            primary={`${log.action} on task '${log.task_title}' by user '${log.user_name}'`}
                            secondary={new Date(log.timestamp).toLocaleString()}
                        />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
}

export default ActivityLog;