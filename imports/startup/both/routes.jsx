import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '/imports/ui/pages/app/home/main';
import Missing from '/imports/ui/pages/missing/main';
import equals from 'fast-deep-equal';

class PureRoutes extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        let props = this.props;

        return(
            <Switch>
                <Route exact path="/" render={(props) => <Home {...props} />} />
                <Route component={Missing} />
            </Switch>
        )
    }
}
/*
function selector(dispatch) {
    let result = {};

    return (nextState, nextOwnProps) => {

        const nextResult = {
            isLoggedIn: nextState.testing.loggedIn,
            ...nextOwnProps
        };

        if(!equals(nextResult, result)){
            result = nextResult;
        }
        return result
    }
}

const ConnectedRoutes = connectAdvanced(selector)(PureRoutes);*/

export default Routes = (
    <PureRoutes />
)
