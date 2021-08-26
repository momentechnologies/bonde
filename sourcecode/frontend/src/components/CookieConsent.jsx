import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import AppContext from '../contexts/app';
import { Button, Container, Grid } from '@material-ui/core';

const Wrapper = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #222;
    padding: 5px;
    color: white;
    text-align: center;
`;

const CookieConsent = () => {
    const { acceptedCookies } = React.useContext(AppContext);
    const [isJustSet, setIsJustSet] = React.useState(false);

    if (acceptedCookies() === 'yes' || isJustSet) {
        return <></>;
    }

    return (
        <Wrapper>
            <Container>
                <Grid container>
                    <Grid item>
                        Vi bruker informasjonskapsler på våre nettsider for å gi
                        deg en best mulig brukeropplevelse. Les mer om dette{' '}
                        <Link to="privacy-policy">her</Link>.{' '}
                        <Button
                            onClick={() => {
                                Cookies.set('acceptedCookies', 'yes', {
                                    expires: 365,
                                });
                                setIsJustSet(true);
                            }}
                            color="primary"
                            variant="contained"
                        >
                            Ok
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Wrapper>
    );
};

export default CookieConsent;
