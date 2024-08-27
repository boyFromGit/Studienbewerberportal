import React, { useState } from "react";
import TopMenu from "../NavComponents/TopMenu";
import bibliothek from '../../../src/images/bibliothek.jpg';
import logo from '../../logo.svg';
import { Image } from "react-bootstrap";
import { useSelector } from 'react-redux';

// this is the page when the user is logged in!
function StartPage() {

    const user = useSelector((state) => state.login.user);
    const lastUser = useSelector((state) => state.login.lastUser); // Lernerfolgskontrolle
    const isDarkMode = useSelector((state) => state.login.showDarkMode);

    return (
        <div className="page-content" id="StartPage">
            <TopMenu />
            <div style={{ position: 'relative', width: '100%', maxWidth: '100%', height: '500px', overflow: 'hidden', background: '#2C3E50' }}>
                <Image
                    src={bibliothek}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', opacity: '0.5' }}
                />
                <div style={{ position: 'absolute', top: '50%', left: '10%', transform: 'translateY(-50%)', color: 'white' }}>
                    <h2>Welcome to Scholar Sphere</h2>
                    <p>Application for study, Research, Student events</p>
                    {lastUser?
                        (
                            <p>The last user logged in was '{lastUser.user.userID}' on {lastUser.date}.</p> // Lernerfolgskontrolle
                        ) : null
                    }
                </div>
            </div>

            <div style={{ marginLeft: '12.5%', marginTop: '20px', marginBottom: '20px', color: isDarkMode ? 'white' : '#2C3E50', textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                <div>
                    <h3 style={{ marginRight: '20px' }}>Welcome back {user.userID}!</h3>
                    <p style={{}}>Are you ready to begin your journey?</p>
                </div>
                <div style={{ textAlign: 'left', maxWidth: '60%', verticalAlign: 'top', marginLeft: '30%' }}>
                    <img src={logo} alt="App Logo" className="App-logo" />
                </div>
            </div>
        </div>
    );
}

export default StartPage;