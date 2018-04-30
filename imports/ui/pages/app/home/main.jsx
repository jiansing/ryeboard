import React from 'react';
import Board from '/imports/ui/components/board/main';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import {connectAdvanced} from "react-redux";
import equals from 'fast-deep-equal';
import * as Actions from "/imports/redux/actions/main";
import { ActionCreators } from 'redux-undo';
import {bindActionCreators} from 'redux';

import Menu from '/imports/ui/components/menu/main';
import NavBar from '/imports/ui/components/navbar/main';

class PureHome extends React.Component{

    componentDidMount() {
        let self = this;
        window.scrollTo(0,0);
        window.addEventListener('keydown', function(event){
            if(document.activeElement === document.body){

                if(event.metaKey && event.keyCode === 90){
                    if(event.shiftKey){
                        console.log('redoing');
                        self.props.actions.redo();
                    }
                    else{
                        console.log('undoing');
                        self.props.actions.undo();
                    }
                }
            }
        }, true)
    }

    render(){

        return(
            <div>
                <NavBar />
                <Menu />
                <Board />
            </div>
        )
    }
}

let dndHome = DragDropContext(HTML5Backend)(PureHome);

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

export default connectAdvanced(selector)(dndHome);