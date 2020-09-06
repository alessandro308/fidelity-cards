import React, {Suspense} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthCheck, useAuth} from 'reactfire';
import Login from './pages/Login/Login.component';
import CardManagement from './pages/CardManagement';
import {
    Redirect,
    BrowserRouter,
    Switch,
    Route,
    Link,
} from 'react-router-dom';
import {Container, Navbar, Nav, Spinner} from 'react-bootstrap';
import {t} from 'ttag';
import NewCard from './pages/NewCard';
import ManageDb from './pages/ManageDb';

import {appConfig} from './config/config';

function MainNavbar () {
    const auth = useAuth();

    return <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">{appConfig.appName || t`Fidelity Cards`}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link><Link to={{pathname: '/app'}}>{t`Home`}</Link></Nav.Link>
                <Nav.Link><Link to={{pathname: '/new-card'}}>{t`Create Card`}</Link></Nav.Link>
                <Nav.Link><Link to={{pathname: '/manage-db'}}>{t`Manage Db`}</Link></Nav.Link>
                <Nav.Link onClick={() => auth.signOut()}>{t`Logout`}</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>;
}

function App () {

    return (
        <Suspense fallback={<Container className="pageContainer loaderContainer"><Spinner  variant="primary" animation="border"/></Container>}>
            <AuthCheck fallback={<Login/>}>
                <BrowserRouter>
                    <MainNavbar/>
                    <Switch>
                        <Route path="/login">
                            <Login></Login>
                        </Route>
                        <Route path="/app">
                            <CardManagement/>
                        </Route>
                        <Route path="/new-card">
                            <NewCard/>
                        </Route>
                        <Route path="/manage-db">
                            <ManageDb/>
                        </Route>
                        <Route exact path="/">
                            <Redirect to="/app" />
                        </Route>
                    </Switch>
                </BrowserRouter>
            </AuthCheck>
        </Suspense>
    );
}

export default App;
