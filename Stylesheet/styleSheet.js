import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    mainContainer1: {
        flex: 1,
        backgroundColor: '#cc504e',
        height: 1,
    },
    headerContainer: {
        height: 80,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#cc504e",
        alignItems: "center",
        paddingRight: 10
    },
    leftHeaderContainer: {
        alignItems: "flex-start",
        flexDirection: "row"
    },
    logoText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        alignItems: "flex-start",
        marginLeft: 20,
        marginTop: 30
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    message: {
        fontSize: 18,
    },
    sender: {
        fontWeight: 'bold',
        paddingRight: 10,
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
    avatar: {
        borderRadius: 20,
        width: 40,
        height: 40,
        marginRight: 10,
    },
    rowText: {
        flex: 1,
        alignItems: "flex-end",
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        height: 24,
    },
    item: {
        fontSize: 18,
        fontFamily: 'Roboto-medium'
    },
    contactContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",
        height: 60,
        borderBottomColor: "rgba(92,94,94,0.5)",
        borderBottomWidth: 0.30
    },
    text: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 20,
    },
    senderMessageContainer: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row-reverse",
        borderBottomColor: "rgba(92,94,94,0.5)",
        borderBottomWidth: 0.5,
    },
    receiverMessageContainer: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        borderBottomColor: "rgba(92,94,94,0.5)",
        borderBottomWidth: 0.5,
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
    iconContainer: {
        width: 60,
        height: 60
    },
    senderMessage: {
        alignItems: 'center',
        paddingRight: 10,
        marginLeft: 60,
        fontFamily: 'Roboto-Regular',
        flexDirection: 'row'
    },
    receiverMessage: {
        alignItems: 'center',
        paddingLeft: 10,
        marginRight: 60,
        fontFamily: 'Roboto-Regular',
        flexDirection: 'row'
    },
    safeAreaView: {
        flex: 1,
        backgroundColor: '#f1f1f1',
    },
    selfMessageContainer: {
        alignItems: "center",
        flexDirection: "row",
        borderBottomColor: "rgba(92,94,94,0.5)",
        borderBottomWidth: 0.5,
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
    selfTextContainer: {
        alignItems: 'center',
        fontSize: 24,
        color: 'black',
        fontFamily: 'Roboto-Regular',
        marginLeft:10,
        flexDirection: 'row'
    },
    button: {
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 5,
        marginBottom: 20,
        width: 125,
        height: 45
    },
    chatIcon: {
        width: 55,
        height: 55,
        borderRadius: 60,
    },
    dayAlignment: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5
    },
    DayTextStyle: {
        fontWeight: 'bold',
        fontFamily: 'Roboto-Regular'
    },
    loadingIcon: {
        flex: 1,
        justifyContent: 'center',
    },
    loadShape: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20
    },
    loadingText:{
        justifyContent: 'space-around',
        padding: 100,
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
    },
    loadingtextbox:{
        textAlign:'center',
        fontSize:22,
        fontFamily:'Roboto-regular',
        color:'#000000',
        marginTop:10
    }
});