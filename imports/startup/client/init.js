import React from "react";
import { render } from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import Routes from '/imports/startup/both/routes'
import { Provider } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import store from '/imports/redux/store';

class Main extends React.Component {

    render() {

        return (
            <Provider store = {store}>
                <BrowserRouter>
                    {Routes}
                </BrowserRouter>
            </Provider>
        )
    }
}

Meteor.startup(() => {
    render(
        <Main />
        ,document.getElementById('render-target')
    );
});