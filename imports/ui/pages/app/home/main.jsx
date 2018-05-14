import React from 'react';
import Board from '/imports/ui/components/board/main';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import {connectAdvanced} from "react-redux";
import equals from 'fast-deep-equal';
import * as Actions from "/imports/redux/actions/main";
import { ActionCreators } from 'redux-undo';
import {bindActionCreators} from 'redux';
import { withTracker } from 'meteor/react-meteor-data';

import Menu from '/imports/ui/components/menu/main';
import NavBar from '/imports/ui/components/navbar/main';

class PureHome extends React.Component{

    constructor(props){
        super(props);
        this.state = {didMount: false};
    }

    componentDidMount() {
        let self = this;
        window.scrollTo(0,0);
        window.addEventListener('keydown', function(event){
            if(document.activeElement === document.body){

                if(event.metaKey && event.keyCode === 90){
                    if(event.shiftKey){
                        self.props.actions.redo();
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    else{
                        self.props.actions.undo();
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
            }
        }, true);
        this.setState({didMount: true});
    }

    setData(){
        if(this.props.currentUser){
            Meteor.call('boards.find', (error, result) => {
                if(error || typeof result === 'undefined') return '';
                let state = result.state;
                this.props.actions.setState(state);
            });
        }
        else {
            this.props.actions.setState();
        }
    }

    render(){

        if(this.state.didMount) this.setData();

        return(
            <div>
                <NavBar history={this.props.history}/>
                <Menu />
                <Board />
            </div>
        )
    }
}

let dndHome = DragDropContext(HTML5Backend)(PureHome);

let trackedHome = withTracker(() => {
    return {
        currentUser: Meteor.user(),
    };
})(dndHome);

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

export default connectAdvanced(selector)(trackedHome);