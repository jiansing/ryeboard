import React, {Component} from 'react';
import {connectAdvanced} from "react-redux";
import equals from 'react-fast-compare';
import {bindActionCreators} from 'redux';
import * as Actions from "/imports/redux/actions/main";
import {previews} from '../widget/main';

/**
 * Left menu that houses addable widgets and widget options
 */

class PureMenu extends Component {

    constructor(props){
        super(props);
    }

    renderPreviews(){

        //Render menu children
        let elementList =  previews.map(function(Elem){
            return (
                <div key={Math.random()} style={{padding: '5px', width: '100%'}}>
                    <Elem />
                </div>
            )
        });

        //Wrap children into container
        return (
            <div key={Math.random()} style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
                alignItems: 'center', marginTop: '12px', marginBottom: '12px', justifyContent: 'center'}}>
                <label style={{textAlign: 'center', color: '#DB5461', fontWeight: 700}}>Menu</label>
                <hr />
                {elementList}
            </div>
        )
    }

    renderMenu(){

        let self = this;

        //Render menu children
        let elementList = this.props.currentMenu.map(function(elem){

            let selected = true;

            //Title of menu item is needed
            if(!elem.title) return '';

            //If condition is not met, item is not rendered
            if(elem.condition && !elem.condition(self.props.currentContext.data)) return '';

            //Special styling if selected
            if(elem.selected) {
                //Run function with current widget data to see if it should be selected
                selected = elem.selected(self.props.currentContext.data);
            }

            return (
                <div style={{textAlign: 'center', width: '100%', padding: '5px'}}
                     key={Math.random()}
                     onClick={()=>{
                         elem.fun(self.props.currentContext.data, self.props.currentData);
                     }}>
                    <img src={elem.icon} height={20} width={20} style={{opacity: selected ? 1 : .25}}/>
                    <p style={{margin: '0', fontSize: '.85rem'}}>{elem.title(self.props.currentContext.data)}</p>
                </div>
            )
        });

        //Wrap children into container
        return(
            <div key={Math.random()} style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
                alignItems: 'center', marginTop: '12px', marginBottom: '12px', justifyContent: 'center'}}>
                <label style={{textAlign: 'center', color: '#DB5461', fontWeight: 700}}>Widget Menu</label>
                <hr />
                {elementList}
            </div>
        )
    }

    render() {

        //TODO: Add animation when switching elements
        let relevantElement =
            this.props.currentMenu === null || typeof this.props.currentMenu === 'undefined' ?
                this.renderPreviews() : this.renderMenu();

        return (
            <div id='menuBar'>
                {relevantElement}
            </div>
        );
    }
}

function selector(dispatch) {
    let result = {};

    const actions = bindActionCreators(Actions, dispatch);
    return (nextState, nextOwnProps) => {

        nextState = nextState.undoable.present;

        let selection = nextState.boardLogic.selected;

        /**
         * Although similar, currentContext and currentData serve slightly different purposes.
         * currentData allows widgets to send data to the menu component directly without updating the whole widget.
         * currentContext gives the current boardLayout data of the widget which can be outdated
         *
         * Basically, currentData allows for real-time feedback while currentContext gives slightly static data.
         */
        const nextResult = {
            selection: selection,
            //Data shared with menu for communication with selected widget
            currentData: function(){
                if(Array.isArray(selection)) {
                    return null;
                }
                return nextState.boardLogic.data;
            }(),
            //Menu to be rendered with current selected widget
            currentMenu: selection ? function(){
                if(Array.isArray(selection)) {
                    return null;
                }
                let menu = selection && selection.data ?
                    selection.data.menu : null;

                return menu ? menu() : null;
            }() : null,
            //Widget data of the current selected widget.
            currentContext: selection ? function(){
                if(Array.isArray(selection)) return null;
                let selectedWidget = nextState.boardLayout.findIndex((elem) => elem.id === selection.id);
                return  nextState.boardLayout[selectedWidget];
            }() : null,
            ...nextOwnProps,
        };

        if(!equals(nextResult, result)){
            result = nextResult;
        }
        return result
    }
}

export default connectAdvanced(selector)(PureMenu)