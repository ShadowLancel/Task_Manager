import React from 'react';
import { Container, Typography } from '@mui/material';

function Home() {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
               Добро пожаловать!
            </Typography>
            <Typography variant="body1">
               Авторизуйтесь или зарегистрируйтесь для работы в Task Manager.
            </Typography>
        </Container>
    );
}

export default Home;