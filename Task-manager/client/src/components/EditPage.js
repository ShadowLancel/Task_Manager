// src/components/EditPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Tabs, Tab, Select, MenuItem } from '@mui/material';
import DynamicForm from './DynamicForm';

function EditPage() {
    const [entity, setEntity] = useState('project');
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/${entity}s/`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setItems(response.data);
                setSelectedItem('');
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };
        fetchItems();
    }, [entity]);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Edit</Typography>
            <Tabs value={entity} onChange={(e, newValue) => setEntity(newValue)}>
                <Tab label="Project" value="project" />
                <Tab label="Tag" value="tag" />
                <Tab label="Task" value="task" />
            </Tabs>
            <Select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                fullWidth
                margin="normal"
                displayEmpty
            >
                <MenuItem value="" disabled>Select {entity}</MenuItem>
                {items.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                        {item.name || item.title}
                    </MenuItem>
                ))}
            </Select>
            {selectedItem && <DynamicForm mode="edit" entity={entity} itemId={selectedItem} />}
        </Container>
    );
}

export default EditPage;