import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    videoIcon: {
        color: '#fff',
        fontSize: 25
    },
    textBox: {
        flex: 1,
        justifyContent: 'center',
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        marginLeft: 5,
        padding: 100,
        marginBottom: 50,
        textAlign: 'center',
        color: '#cc504e',
    },
    imageBox: {
        padding: 50,
        justifyContent: 'flex-end',
        width: 100,
        height: 100,
        marginLeft: 200,
        marginBottom: 100,
    },
    bottomBar: {
        justifyContent: "space-around",
        flexDirection: "row",
        paddingLeft: 10,
        marginBottom:30
    },
    callIcon: {
        color: '#cc504e',
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 25,
        marginTop: 50,
        backgroundColor: '#e20e30',
    },
    text: {
        textAlign: "center",
    },
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    videoContainer: {
        flex: 1,
        alignSelf: 'stretch'
    },
    video1: {
        flex: 1
    },
})