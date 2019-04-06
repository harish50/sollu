import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        height: 24,
    },
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
    message: {
        fontSize: 18,
    },
    sender: {
        fontWeight: 'bold',
        paddingRight: 10,
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
    iconContainer: {
        width: 60,
        height: 60
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