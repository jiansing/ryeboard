import React, {Component} from 'react';

/**
 * Floating, right, bottom, menu on the board.
 *
 * Currently is used for zoom control
 */

export default class FloatingMenu extends React.Component{
    constructor(props){
        super(props);
    }

    zoomOut(){
        let zoom = this.props.zoom ? this.props.zoom.value : 1;

        //Move onto next zoom iteration
        if(zoom === 1.5) zoom = 1.25;
        else if(zoom === 1.25) zoom = 1;
        else if(zoom === 1) zoom = .75;
        else if(zoom === .75) zoom = .6;
        else if(zoom === .6) zoom = .5;
        else return;

        //Create css attribute
        let scale = 'scale(' + zoom + ', ' + zoom + ')';

        this.modifyZoomValue(zoom, scale);
    }

    zoomIn(){
        let zoom = this.props.zoom ? this.props.zoom.value : 1;

        //Move onto next zoom iteration
        if(zoom === .5) zoom = .6;
        else if(zoom === .6) zoom = .75;
        else if(zoom === .75) zoom = 1;
        else if(zoom === 1) zoom = 1.25;
        else if(zoom === 1.25) zoom = 1.5;
        else return;

        //Create css attribute
        let scale = 'scale(' + zoom + ', ' + zoom + ')';

        this.modifyZoomValue(zoom, scale);
    }

    resetZoom(){
        let zoom = 1;

        //Create css attribute
        let scale = 'scale(' + zoom + ', ' + zoom + ')';

        this.modifyZoomValue(zoom, scale);
    }

    modifyZoomValue(zoom, scale){
        let top = document.getElementById('board-container').pageYOffset ||
            document.getElementById('board-container').scrollTop || 0,
            left = document.getElementById('board-container').pageXOffset ||
                document.getElementById('board-container').scrollLeft || 0,
            width = document.getElementById('board-container').scrollWidth,
            height = document.getElementById('board-container').scrollHeight,
            cWidth = document.getElementById('board-container').clientWidth,
            cHeight = document.getElementById('board-container').clientHeight;

        let vPercent = (top / (height - cHeight)) || 0;
        let hPercent = (left / (width - cWidth)) || 0;

        //5000 is board height and width
        //TODO: create dynamic way of replacing absolute 5000 value
        let scrollTop = vPercent * (5000 * zoom - cHeight);
        let scrollLeft = hPercent  * (5000 * zoom- cWidth);

        this.props.actions.modifySettingsParam({zoom: {value: zoom, scale, scroll: {scrollTop, scrollLeft}}});
    }

    render(){
        return (
            <div style={{position: 'fixed', right: '15px', bottom: '20px', display: 'flex', width: '75px',
                flexDirection: 'column', zIndex: '15'}}
                 onClick={(event)=>event.stopPropagation()}>
                <label style={{textAlign: 'center'}}>
                    X{this.props.zoom ? this.props.zoom.value : 1}
                </label>

                <button style={{textAlign: 'center', margin: '5px', marginTop: '10px'}}
                        className={'btn-floating'}
                        onClick={() => this.zoomIn()}>
                    <img src={'/icons/zoom-in.svg'} height={30} width={30}/>
                </button>

                <button style={{textAlign: 'center', margin: '5px'}}
                        className={'btn-floating'}
                        onClick={() => this.zoomOut()}>
                    <img src={'/icons/zoom-out.svg'} height={30} width={30}/>
                </button>

                <button style={{textAlign: 'center', margin: '5px'}}
                        className={'btn-floating'}
                        onClick={() => this.resetZoom()}>
                    <img src={'/icons/zoom-reset.svg'} height={30} width={30}/>
                </button>
            </div>
        )
    }
}