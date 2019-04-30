import React, {Component} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import styles from "./HomeStyles";
import ProfileIconContainer from "../Profile/ProfileIconContainer";
import {Loading} from "../../Generics/Components/LoadingIndicator";

export default class HomeView extends Component {

    renderContact = (contact) => {
        return (
            <TouchableOpacity onPress={() => {
                this.props.onContactPress(contact)
            }} style={styles.contactContainer}>
                <ProfileIconContainer user={contact.item.key}/>
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


