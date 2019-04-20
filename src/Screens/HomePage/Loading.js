import React from 'react'
import {ActivityIndicator, Text, View} from 'react-native';
import styles from "./HomeStyles";

export const Loading = (props) => {
    console.log(props)
    return (
        <View>
            <ActivityIndicator size="large" color="#cc504e"/>
            <View>
                <Text style={styles.loadingText}>{props.message}</Text>
            </View>
        </View>
    );
}