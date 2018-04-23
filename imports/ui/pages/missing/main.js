import React, {Component} from 'react';

const Missing = ({ history }) => (
    <div className="container-default container-center-hv" style={{minHeight: '100vh'}}>
        <div>
            <h2>The page you're looking for (<strong>{history.location.pathname.replace('/','')}</strong>) does not exist!</h2>
            <button onClick={()=> history.push("/")}>
                Go back to Homepage
            </button>
        </div>
    </div>
);

export default Missing;