import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from '/imports/ui/pages/app/home';
import Board from '/imports/ui/pages/app/board';
import Missing from '/imports/ui/pages/missing/main';
import Login from '/imports/ui/pages/login/main';


/**
 * Routes for Website
 */

class PureRoutes extends React.Component{
    constructor(props){
        super(props);
    }
    render(){

        return(
            <Switch>
                <Route exact path="/" render={(props) => <Home {...props} />} />
                <Route exact path="/board/:id" render={(props) => <Board {...props} />} />
                <Route exact path="/login" render={(props) => <Login {...props} />} />
                <Route component={Missing} />
            </Switch>
        )
    }
}

export default Routes = (
    <PureRoutes />
)
