import React from 'react'
import {ActivityIndicator, Text, View} from 'react-native';
import styles from "../../../Stylesheet/styleSheet";

export const LoadingContacts = () => {
    return (
        <View style={styles.loadingIcon}>
            <ActivityIndicator size="large" color="#cc504e"/>
            <View>
                <Text style={styles.loadingtextbox}>Getting contacts...</Text>
            </View>
        </View>
    );
}