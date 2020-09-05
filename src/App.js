import React, {Suspense} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthCheck, useAuth} from 'reactfire';
import Login from './pages/Login/Login.component';
import CardManagement from './pages/CardManagement';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';
import {Container, Navbar, Nav} from 'react-bootstrap';
import {t} from 'ttag';

function MainNavbar () {
    const auth = useAuth();

    return <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">{t`Fidelity Cards`}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link href="/app">Home</Nav.Link>
                <Nav.Link href="#link">Link</Nav.Link>
                <Nav.Link onClick={() => auth.signOut()}>{t`Logout`}</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>;
}

function App () {

    return (
        <Suspense fallback={<Container className="pageContainer">Loading</Container>}>
            <AuthCheck fallback={<Login/>}>
                <MainNavbar/>
                <Router>
                    <Switch>
                        <Route path="/login">
                            <Login></Login>
                        </Route>
                        <Route path="/app">
                            <CardManagement/>
                        </Route>
                    </Switch>
                </Router>
            </AuthCheck>
        </Suspense>
    );
}

export default App;
