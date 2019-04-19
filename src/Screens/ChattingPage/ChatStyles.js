import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    loadingIcon: {
        flex: 1,
        justifyContent: 'center',
    },
    selfMessageContainer: {
        alignItems: "center",
        flexDirection: "row",
        borderBottomColor: "rgba(92,94,94,0.5)",
        borderBottomWidth: 0.5,
    },
    selfTextContainer: {
        alignItems: 'center',
        fontSize: 24,
        color: 'black',
        fontFamily: 'Roboto-Regular',
        marginLeft:10,
        flexDirection: 'row'
    },
    senderMessageContainer: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row-reverse",
        borderBottomColor: "rgba(92,94,94,0.5)",
        borderBottomWidth: 0.5,
    },
    senderMessage: {
        alignItems: 'center',
        paddingRight: 10,
        marginLeft: 60,
        fontFamily: 'Roboto-Regular',
        flexDirection: 'row'
    },
    receiverMessageContainer: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        borderBottomColor: "rgba(92,94,94,0.5)",
        borderBottomWidth: 0.5,
    },
    receiverMessage: {
        alignItems: 'center',
        paddingLeft: 10,
        marginRight: 60,
        fontFamily: 'Roboto-Regular',
        flexDirection: 'row'
    },
    chatBox: {
        flex: 1,
        borderBottomColor: "rgba(92,94,94,0.5)",
        borderBottomWidth: 0.5,
        marginRight: 60,
        padding: 1,
        textAlign: "justify",
        alignItems: "center",
    },
    footer: {
        flexDirection: 'row',
        backgroundColor: '#eee',
    },
    input: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        fontSize: 18,
        fontFamily: 'Roboto-Regular',
        flex: 1,
    },
    send: {
        alignSelf: 'center',
        fontFamily: 'Roboto-Bold',
        color: '#cc504e',
        fontSize: 16,
        fontWeight: 'bold',
        padding: 20,
    },
    chatIcon: {
        width: 55,
        height: 55,
        borderRadius: 60,
    },
    messageStyle: {
        textAlign: 'left',
        color: 'black'
    },
    timeStyle:{
        textAlign:'right',
        fontSize: 10,
        padding:6,
        paddingTop: 10
    },
    safeAreaView: {
        flex: 1,
        backgroundColor: '#f1f1f1',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

})