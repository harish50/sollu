import React, {Component} from 'react';
import {FlatList, View} from 'react-native';
import {LoadingContacts} from "./LoadingContacts";

export default class HomeView extends Component {
    render() {
        if (this.props.contacts.length === 0) {
            return (
                <LoadingContacts/>
            )
        }
        else {
            return (
                <View>
                    <FlatList
                        data={this.props.contacts}
                        renderItem={this.props.renderContact}
                    />
                </View>
            );
        }
    }
};


