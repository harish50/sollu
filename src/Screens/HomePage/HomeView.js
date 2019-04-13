import React, {Component} from 'react';
import {ActivityIndicator, FlatList, Text, TouchableOpacity, View} from 'react-native';
import styles from "../../../Stylesheet/styleSheet";
import Profile from "../../../Components/Profile";

export default class HomeView extends Component {
    constructor(props){
        super(props)
    }


    renderName(contact) {

        return (
            <Text>contact</Text>
        );
    }

    render() {
        if (this.props.contacts.length === 0) {
            return (
                <View style={styles.loadingIcon}>
                    <ActivityIndicator size="large" color="#cc504e"/>
                    <View>
                        <Text style={styles.loadingtextbox}>No contacts</Text>
                    </View>
                </View>
            );
        }
        else {
            return (
                <View>
                    <FlatList
                        data={this.props.contacts}
                        renderItem={this.renderName.bind(this)}
                    />
                </View>
            );
        }
    }
};


