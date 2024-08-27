import React from "react";
import TopMenu from "../NavComponents/TopMenu";
import { Image } from "react-bootstrap";
import bibliothek from '../../../src/images/bibliothek.jpg';
import { useSelector } from 'react-redux';

// #2C3E50

// this is the page when the user is NOT logged in!
function LandingPage() {

    const isDarkMode = useSelector((state) => state.login.showDarkMode);

    return (
        <div className="page-content" id="LandingPage">
            <TopMenu />
            <div style={{ position: 'relative', width: '100%', maxWidth: '100%', height: '500px', overflow: 'hidden', background: '#2C3E50' }}>
                <Image
                    src={bibliothek}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', opacity: '0.5' }}
                />
                <div style={{ position: 'absolute', top: '50%', left: '10%', transform: 'translateY(-50%)', color: 'white' }}>
                    <h2>Welcome to Scholar Sphere</h2>
                    <p>Application for study, Research, Student events</p>
                </div>
            </div>

            <div style={{ marginLeft: '12.5%', marginTop: '20px', marginBottom: '20px', color: isDarkMode? 'white' : '#2C3E50', textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                <h3 style={{ marginRight: '20px' }}>Why Choose Scholar Sphere?</h3>
                <div style={{ textAlign: 'left', maxWidth: '60%', verticalAlign: 'top', marginLeft: '20%' }}>
                    <p>
                        <span style={{ fontWeight: 'bold' }}>1. Diverse Degree Programs:</span><br />Explore a comprehensive range of degree courses across various disciplines.<br /> From business and technology to arts and sciences, Scholar Sphere offers a spectrum of educational options <br /> to suit your interests and career aspirations.
                    </p>
                    <p>
                        <span style={{ fontWeight: 'bold' }}>2. Personalized Guidance: Our platform goes beyond just listing courses.</span><br />We provide personalized guidance to help you navigate through the multitude of options,<br /> ensuring that you make informed decisions about your academic future.
                    </p>
                    <p>
                        <span style={{ fontWeight: 'bold' }}>3. Interactive Learning Environment:</span><br />Engage in a dynamic and interactive learning environment.<br /> Connect with educators, fellow students, and industry experts, <br />fostering a collaborative space for academic growth and knowledge exchange.
                    </p>
                    <p>
                        <span style={{ fontWeight: 'bold' }}>4. Application Made Easy:</span><br />Say goodbye to complex application processes. <br />Scholar Sphere simplifies the application process, streamlining it for your convenience. <br />Apply to multiple programs with ease and track your application status effortlessly.
                    </p>
                    <p>
                        Ready to embark on your educational journey? <br/>Sign up now and discover the world of possibilities that Scholar Sphere has in store for you!
                    </p>
                </div>
            </div>



        </div>

    );
}

export default LandingPage;