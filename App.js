import React, {Component} from 'react';
import {View} from 'react-native';
import styles from "./Stylesheet/styleSheet";
import AppContainer from "./src/Navigator";

export default class App extends Component {

    render() {
        return (
            <View style={styles.mainContainer}>
                <AppContainer/>
            </View>
        );
    }
}
