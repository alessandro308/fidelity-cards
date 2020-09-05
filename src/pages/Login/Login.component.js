import React, {useState} from 'react';
import {Form, Button, Container, Alert} from 'react-bootstrap';
import {t} from 'ttag';
import {useAuth} from 'reactfire';

export default function Login () {
    const auth = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const login = (e) => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
        .catch(err => {
            setError(err.message);
        });
    };

    const handleChange = (event) => {
        switch(event.target.name){
            case 'email':
                setEmail(event.target.value);
                break;
            case 'password':
                setPassword(event.target.value);
                break;
            default:
                break;
        }
    }

    return <Container className="pageContainer">
        {error ? <Alert  variant='danger'>
                Error: {error}
            </Alert> :  null}
        <Form onSubmit={login}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" onChange={handleChange} name="email" placeholder={t`Enter email`}/>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" onChange={handleChange} placeholder={t`Password`}/>
            </Form.Group>
            <Button variant="primary" type="submit">
                {t`Submit`}
            </Button>
        </Form>
    </Container>;
};
