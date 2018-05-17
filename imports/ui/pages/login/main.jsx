import React from 'react';
import {connectAdvanced} from "react-redux";
import equals from 'react-fast-compare';
import * as Actions from "/imports/redux/actions/main";
import { ActionCreators } from 'redux-undo';
import {bindActionCreators} from 'redux';

class PureHome extends React.Component{

    navigateBack() {
        let locationState = this.props.location.state;

        if(locationState){
            let returnUrl = locationState.returnUrl || '/';
            this.props.history.push({
                pathname: returnUrl
            })
        }
        else {
            this.props.history.push({
                pathname: '/'
            })
        }

    }

    loginWithGoogle(){
        let self = this;
        Meteor.loginWithGoogle({
        }, (err) => {
            if (err) {
                console.log("Hi, there seems to be an error:", err);
            } else {
                console.log("Hi, you have logged in");
                self.navigateBack();
            }
        });
    }

    render(){

        return(
            <div id='board' className={'grid show'} style={{display: 'flex', alignItems: 'center',
                justifyContent: 'center', width: '100vw', height: '100vh'}}>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <div className='container-tight'>

                        <button className="btn-default"
                                onClick={() => this.loginWithGoogle()}
                                style={{display: "block", width: '100%',  marginTop: '1rem'}}>
                            Continue with Google
                        </button>

                        <button className="btn-default"
                                onClick={() => this.toSignUp()}
                                style={{display: "block", width: '100%', marginTop: '1rem', opacity: .5, fontSize: '1rem'}}>
                            Sign up with Email
                        </button>

                        <button className="btn-default"
                                onClick={() => this.toLogin()}
                                style={{display: "block", width: '100%', opacity: .5, fontSize: '1rem'}}>
                            Login with Email
                        </button>

                        <button className="btn-default"
                                onClick={() => this.navigateBack()}
                                style={{display: "block", width: '100%', opacity: 1, fontSize: '1rem'}}>
                            Back
                        </button>
                    </div>
                </div>

            </div>
        )
    }
}

function selector(dispatch) {

    let result = {};
    const actions = bindActionCreators(Object.assign({}, Actions, ActionCreators), dispatch);

    return (nextState, props) => {

        nextState = nextState.undoable.present;

        const nextResult = {
            actions: actions,
            settings: nextState.settings,
            ...props
        };
        if(!equals(nextResult, result)){
            result = nextResult;
        }
        return result
    }
}

export default connectAdvanced(selector)(PureHome);