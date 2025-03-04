import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography } from '@mui/material';

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/tasks/', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setTasks(response.data);
            } catch (err) {
                setError('Failed to fetch tasks. Check your connection or token.');
                console.error('Error fetching tasks:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;
    if (tasks.length === 0) return <Typography>No tasks available.</Typography>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Tasks
            </Typography>
            {tasks.map((task) => (
                <Card key={task.id} style={{ margin: '10px 0' }}>
                    <CardContent>
                        <Typography variant="h6">{task.title}</Typography>
                        <Typography variant="body2">{task.description}</Typography>
                        <Typography variant="caption">
                            Project: {task.project && task.project.name ? task.project.name+'; ' : 'None; '}
                        </Typography>
                        <Typography variant="caption">
                            Tags: {task.tags && task.tags.length > 0 ? task.tags.map(t => t.name).join(', ')+'; ' : 'None; '}
                        </Typography>
                        <Typography variant="caption">
                            Due Date: {task.due_date ? new Date(task.due_date).toLocaleString() : 'Not set'}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Container>
    );
}

export default TaskList;