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
    loadingtextbox1:{
        textAlign:'center',
        fontSize:22,
        fontFamily:'Roboto-regular',
        color:'#cc504e',
        marginTop:10,
    },
    remoteVideoContainer: {
        flex: 1,
        width: "100%",
        height: "100%",
        alignSelf: 'stretch'
    },
    videoPreviewContainer: {
        flex: 1,
        zIndex:2,
        left: "65%",
        bottom:"75%",
        width:"30%",
        height:"20%",
        position:"absolute",
        borderRadius:10,
        overflow:'hidden',
    },
    loadbox:{
        flex: 1,
        justifyContent: 'center'
    },
    loadbox1:{
        justifyContent: 'space-around',
        marginBottom:20
    },
    bottomBar: {
        justifyContent: "space-around",
        flexDirection: "row",
        paddingLeft: 10,
        paddingTop: 4,
        marginBottom:30
    },
    callIcon2:{
        color: '#11cc8a',
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 25,
        marginTop: 100,
        backgroundColor: '#11cc8a'
    },
    callIcon1:{
        color: '#e20e30',
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 25,
        marginTop: 100,
        backgroundColor: '#e20e30'
    },
    bottomBar2:{
        justifyContent: "space-around",
        flexDirection: "row",
        paddingLeft: 10,
        paddingTop: 10,
        marginTop:250,
    },
    bottomBar3:{
        justifyContent: "space-around",
        flexDirection: "row",
        paddingLeft: 10,
    },
    callIcon: {
        color: '#cc504e',
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 25,
        marginTop: 50,
        backgroundColor: '#e20e30'
    },
    text: {
        textAlign: "center",
    },
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    container1: {
        flex:1,
        backgroundColor: '#fff'
    },
    container2: {
        backgroundColor: '#fff',
        marginTop:250,
    },
    videoContainer: {
        flex: 1,
        alignSelf: 'stretch'
    },
    video1: {
        flex: 1
    },
    callIcon3:{
        color: '#cc504e',
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 25,
        marginTop: 70,
        marginLeft:150,
        backgroundColor: '#e20e30'
    },
    callerName:{
        textAlign:'center',
        fontSize:22,
        fontFamily:'Roboto-regular',
        color:'#cc504e',
        marginTop:10,
    },
    callerStatus :{
        color: '#cc504e',
        textAlign:'center',
        justifyContent: 'space-around',
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        marginTop: 13
    }
})