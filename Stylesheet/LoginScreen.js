import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    Container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#000',
        height: 50,
        width: 300,
        borderRadius: 5,
        margin: 10,
    },
    phoneIconContainer: {
        padding: 1,
        margin: 5,
        height: 35,
        width: 35,
        resizeMode: 'stretch',
        alignItems: 'center',
    },
    phoneNumberContainer: {
        flex: 1,
        fontSize: 20,
    },
    loginButton: {
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 5,
        marginBottom: 20,
        width: 125,
        height: 45
    },
    loginText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 20,
    },
})