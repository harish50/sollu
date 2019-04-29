import React from 'react'
import {ActivityIndicator, Text, View} from 'react-native';
import styles from '../Styles/LoadingIndicator'

export const Loading = (props) => {
    return (
        <View style={styles.loadingIcon}>
            <ActivityIndicator size="large" color="#cc504e"/>
            <View>
                <Text style={styles.loadingText}>{props.message}</Text>
            </View>
        </View>
    );
}