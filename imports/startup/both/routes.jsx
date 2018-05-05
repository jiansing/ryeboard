import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from '/imports/ui/pages/app/home/main';
import Missing from '/imports/ui/pages/missing/main';
import Login from '/imports/ui/pages/login/main';

class PureRoutes extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        console.log('routing');

        return(
            <Switch>
                <Route exact path="/" render={(props) => <Home {...props} />} />
                <Route exact path="/login" render={(props) => <Login {...props} />} />
                <Route component={Missing} />
            </Switch>
        )
    }
}

export default Routes = (
    <PureRoutes />
)
