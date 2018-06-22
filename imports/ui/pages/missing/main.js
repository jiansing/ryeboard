import React, {Component} from 'react';

/*
 *  A page to redirect users to existing (home) page.
 */

const Missing = ({ history }) => (
    <div className="container-default"
         style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <h2>The page you're looking for (<strong>{history.location.pathname.replace('/','')}</strong>) does not exist!</h2>
        <button className='btn-ghost' onClick={()=> history.push("/")}>
            Go back to Homepage
        </button>
    </div>
);

export default Missing;