// src/components/DynamicForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Select, MenuItem } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function DynamicForm({ mode, entity, itemId }) {
    const [formData, setFormData] = useState({});
    const [projects, setProjects] = useState([]);
    const [tags, setTags] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchOptions = async () => {
            if (entity === 'task') {
                try {
                    const [projectsResp, tagsResp] = await Promise.all([
                        axios.get('http://127.0.0.1:8000/projects/', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
                        axios.get('http://127.0.0.1:8000/tags/', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
                    ]);
                    setProjects(projectsResp.data);
                    setTags(tagsResp.data);
                } catch (error) {
                    console.error('Error fetching options:', error);
                }
            }
        };

        const fetchItem = async () => {
            if (mode === 'edit' && itemId) {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/${entity}s/${itemId}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    });
                    if (entity === 'task') {
                        setFormData({
                            title: response.data.title,
                            description: response.data.description,
                            project_id: response.data.project_id || '',
                            tag_ids: response.data.tags ? response.data.tags.map(tag => tag.id) : [],
                            due_date: response.data.due_date ? new Date(response.data.due_date) : null,
                        });
                    } else {
                        setFormData(response.data);
                    }
                } catch (error) {
                    console.error('Error fetching item:', error);
                }
            } else {
                setFormData({ name: '', description: '', due_date: null, title: '', project_id: '', tag_ids: [] });
            }
        };

        fetchOptions();
        fetchItem();
    }, [mode, entity, itemId]);

    const handleSubmit = async () => {
        const url = mode === 'create' ? `http://127.0.0.1:8000/${entity}s/` : `http://127.0.0.1:8000/${entity}s/${itemId}`;
        const method = mode === 'create' ? 'post' : 'put';
        try {
            await axios[method](url, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setMessage(`${entity} ${mode === 'create' ? 'created' : 'updated'} successfully!`);
            if (mode === 'create') {
                setFormData({ name: '', description: '', due_date: null, title: '', project_id: '', tag_ids: [] });
            }
        } catch (error) {
            setMessage(`Failed to ${mode} ${entity}. Check data.`);
            console.error('Error:', error);
        }
    };

    const renderForm = () => {
        if (entity === 'project') {
            return (
                <>
                    <TextField
                        label="Name"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label="Due Date"
                            value={formData.due_date || null}
                            onChange={(newValue) => setFormData({ ...formData, due_date: newValue })}
                            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                        />
                    </LocalizationProvider>
                </>
            );
        } else if (entity === 'tag') {
            return (
                <TextField
                    label="Name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    fullWidth
                    margin="normal"
                />
            );
        } else if (entity === 'task') {
            return (
                <>
                    <TextField
                        label="Title"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <Select
                        value={formData.project_id || ''}
                        onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                        fullWidth
                        margin="normal"
                        displayEmpty
                    >
                        <MenuItem value="" disabled>Select Project</MenuItem>
                        {projects.map((project) => (
                            <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
                        ))}
                    </Select>
                    <Select
                        multiple
                        value={formData.tag_ids || []}
                        onChange={(e) => setFormData({ ...formData, tag_ids: e.target.value })}
                        fullWidth
                        margin="normal"
                        displayEmpty
                    >
                        <MenuItem value="" disabled>Select Tags</MenuItem>
                        {tags.map((tag) => (
                            <MenuItem key={tag.id} value={tag.id}>{tag.name}</MenuItem>
                        ))}
                    </Select>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label="Due Date"
                            value={formData.due_date || null}
                            onChange={(newValue) => setFormData({ ...formData, due_date: newValue })}
                            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                        />
                    </LocalizationProvider>
                </>
            );
        }
        return null;
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>{mode === 'create' ? 'Create' : 'Edit'} {entity}</Typography>
            {renderForm()}
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                {mode === 'create' ? 'Create' : 'Update'}
            </Button>
            {message && <Typography color={message.includes('Failed') ? 'error' : 'success'}>{message}</Typography>}
        </Container>
    );
}

export default DynamicForm;