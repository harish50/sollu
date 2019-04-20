import React, {Component} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {Loading} from "./Loading";
import styles from "./HomeStyles";

export default class HomeView extends Component {

    renderContact = (contact) => {
        return (
            <TouchableOpacity onPress={() => {
                this.props.onContactPress(contact)
            }} style={styles.contactContainer}>
                <Text style={styles.item}> {contact.item.name} </Text>
            </TouchableOpacity>

        );
    };
    render() {
        if (this.props.contacts.length === 0) {
            return (
                <Loading message = {"Getting Contacts"}/>
            )
        }
        else {
            return (
                <View>
                    <FlatList
                        data={this.props.contacts}
                        renderItem={this.renderContact}
                    />
                </View>
            );
        }
    }
};

