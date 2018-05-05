import React, {Component} from 'react';
import {connectAdvanced} from "react-redux";
import equals from 'fast-deep-equal';
import {bindActionCreators} from 'redux';
import * as Actions from "/imports/redux/actions/main";
import { withTracker } from 'meteor/react-meteor-data';
import store from '/imports/redux/store';

class PureNavBar extends Component {

    constructor(props){
        super(props);
        console.log(this.props.title);
    }

    login(){
        this.props.history.push({
            pathname: '/login',
            state: {
                returnUrl: '/'
            }
        })
    }

    logout(){
        Meteor.logout();
    }

    handleEdit(event){
        this.props.actions.modifySettingsParam({title: event.target.value});
    }

    saveTitle(event){
        this.props.actions.modifySettingsParam({title: event.target.value});
        Meteor.call('boards.update', store.getState());
    }

    render() {

        console.log('setting as title:', this.props.title);

        return (
            <div style={{background: '#FFFFFF', height: '50px', display: 'flex', position: 'fixed',
                top: 0, left: 0, width: '100%', zIndex: 5, boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.15), 0 0px 1px 0 rgba(0, 0, 0, 0.15)'}}>
                <div style={{flex: 1}} />
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', flex: 2}}>
                    <input style={{textAlign: 'center', border: 'none', fontSize: '1.25rem', width: '100%'}}
                           value={this.props.title}
                           onChange={(event)=>this.handleEdit(event)}
                           onBlur={(event)=> this.saveTitle(event)}
                           placeholder={'your title'} tabIndex={-1}/>
                </div>
                <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '1rem'}}>
                    <button className={'btn-empty'} onClick={()=> this.test()}>
                        <img src={'/ph.svg'} height={25} width={25} style={{margin: '.5rem'}}/>
                    </button>
                    <button className={'btn-empty'} onClick={()=> Meteor.userId() ? this.logout() : this.login()}>
                        <img src={'/ph.svg'} height={25} width={25} style={{margin: '.5rem', opacity: Meteor.userId() ? 1 : .5}}/>
                    </button>
                </div>
            </div>
        );
    }
}

let TrackedNavBar = withTracker(() => {
    return {
        currentUser: Meteor.user(),
    };
})(PureNavBar);

function selector(dispatch) {
    let result = {};
    const actions = bindActionCreators(Actions, dispatch);
    return (nextState, nextOwnProps) => {

        const nextResult = {
            title: nextState.settings.title || '',
            actions: actions,
            ...nextOwnProps
        };

        console.log(nextState);

        if(!equals(nextResult, result)){
            result = nextResult;
        }
        return result
    }
}

export default connectAdvanced(selector)(TrackedNavBar)