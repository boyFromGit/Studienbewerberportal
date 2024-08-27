import React from "react";
import Spinner from 'react-bootstrap/Spinner';
import { useSelector } from 'react-redux';

function MySpinner() {

    const loginPending = useSelector((state) => state.login.loginPending);

    return (
        <div>
            <div hidden={!loginPending}>
                <Spinner as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true" />

                Loading...
            </div>
        </div>
    );
}

export default MySpinner;