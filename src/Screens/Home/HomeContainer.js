import React, {Component} from 'react';
import HomeView from './HomeView'

export default class HomeContainer extends Component {

    state={
        contacts: []
    };


    render() {
        return (
            <HomeView contacts={this.state.contacts}/>
        )
    }
}