import React from 'react';
import { Link } from 'react-router-dom';
import Helmet from './Helmet';
import AppContext from '../contexts/app.js';
import { Container, Grid } from '@material-ui/core';

const NotFound = () => {
    const { notFoundEvent } = React.useContext(AppContext);

    notFoundEvent();

    return (
        <Container>
            <Helmet title="404">
                <meta name="robots" content="noindex" />
            </Helmet>
            <Grid container className="justify-content-center">
                <Grid item className="text-center" md={5}>
                    <h2>404 Ikke funnet</h2>
                    <p>Forespurt side ble ikke funnet</p>
                    <p>
                        Vi har nettopp lansert nettsiden på nytt igjen og det
                        kan derfor være noe lenke som ikke er gyldig lenger.
                    </p>
                    <Link to="/">Gå til landingssiden</Link>
                </Grid>
            </Grid>
        </Container>
    );
};

export default NotFound;
