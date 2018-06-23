import React, {Component} from 'react';

export default class FloatingMenu extends React.Component{
    constructor(props){
        super(props);
    }

    zoomOut(){
        let zoom = this.props.zoom ? this.props.zoom.value : 1;
        if(zoom === 1.5) zoom = 1.25;
        else if(zoom === 1.25) zoom = 1;
        else if(zoom === 1) zoom = .75;
        else if(zoom === .75) zoom = .6;
        else if(zoom === .6) zoom = .5;
        else return;

        let scale = 'scale(' + zoom + ', ' + zoom + ')';

        let top = document.getElementById('board-container').pageYOffset ||
            document.getElementById('board-container').scrollTop || 0,
            left = document.getElementById('board-container').pageXOffset ||
                document.getElementById('board-container').scrollLeft || 0,
            width = document.getElementById('board-container').scrollWidth,
            height = document.getElementById('board-container').scrollHeight,
            cWidth = document.getElementById('board-container').clientWidth,
            cHeight = document.getElementById('board-container').clientHeight;

        let vPercent = top / (height - cHeight) || 0;
        let hPercent = left / (width - cWidth) || 0;

        let scrollTop = vPercent * (5000 * zoom - cHeight);
        let scrollLeft = hPercent  * (5000 * zoom- cWidth);

        this.props.actions.modifySettingsParam({zoom: {value: zoom, scale, scroll: {scrollTop, scrollLeft}}});
    }

    zoomIn(){
        let zoom = this.props.zoom ? this.props.zoom.value : 1;
        if(zoom === .5) zoom = .6;
        else if(zoom === .6) zoom = .75;
        else if(zoom === .75) zoom = 1;
        else if(zoom === 1) zoom = 1.25;
        else if(zoom === 1.25) zoom = 1.5;
        else return;

        let scale = 'scale(' + zoom + ', ' + zoom + ')';

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

        let scrollTop = vPercent * (5000 * zoom - cHeight);
        let scrollLeft = hPercent  * (5000 * zoom- cWidth);

        this.props.actions.modifySettingsParam({zoom: {value: zoom, scale, scroll: {scrollTop, scrollLeft}}});
    }

    resetZoom(){
        let zoom = 1;

        let scale = 'scale(' + zoom + ', ' + zoom + ')';

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