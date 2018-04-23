import React from 'react';
import Board from '/imports/ui/components/board/main';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import Menu from '/imports/ui/components/menu/main';
import NavBar from '/imports/ui/components/navbar/main';

class Home extends React.Component{

    componentDidMount() {
        window.scrollTo(0,0);
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

export default DragDropContext(HTML5Backend)(Home);