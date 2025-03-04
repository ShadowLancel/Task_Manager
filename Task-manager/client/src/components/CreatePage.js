// src/components/CreatePage.js
import React, { useState } from 'react';
import { Container, Typography, Tabs, Tab } from '@mui/material';
import DynamicForm from './DynamicForm';

function CreatePage() {
    const [entity, setEntity] = useState('project');

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Create</Typography>
            <Tabs value={entity} onChange={(e, newValue) => setEntity(newValue)}>
                <Tab label="Project" value="project" />
                <Tab label="Tag" value="tag" />
                <Tab label="Task" value="task" />
            </Tabs>
            <DynamicForm mode="create" entity={entity} />
        </Container>
    );
}

export default CreatePage;