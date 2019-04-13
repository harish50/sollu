import React, {Component} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import styles from "../../../Stylesheet/styleSheet";

const HomeView = (props) => {
    console.log("inside HomeView");
    console.log(props.contacts);
    if (props.contacts.length === 0) {
        return (
            <View style={styles.loadingIcon}>
                <ActivityIndicator size="large" color="#cc504e"/>
                <View>
                    <Text style={styles.loadingtextbox}>Loading Contacts...</Text>
                </View>
            </View>
        );
    }
    else{
        return (<Text>Empty</Text>)
    }
    // else {
    //     return (
    //         <View>
    //             <FlatList
    //                 data={props.contacts}
    //                 // renderItem={this.renderName.bind(this)}
    //                 extradata={props}
    //             />
    //         </View>
    //     );
    // }
};

export default HomeView;