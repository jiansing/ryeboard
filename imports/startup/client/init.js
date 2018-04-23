import React from "react";
import { render } from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import Routes from '/imports/startup/both/routes'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from '/imports/redux/reducers/main';

const store = createStore(reducers);

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