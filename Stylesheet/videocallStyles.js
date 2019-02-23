import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    videoIcon:{
        color:'#fff',
        fontSize:25
    },
    textBox:{
        flex:1,
        justifyContent:'center',
        fontFamily:'Roboto-Regular',
        fontSize:16,
        marginLeft:5,
        padding:100,
        marginBottom:50,
        textAlign:'center',
        color:'#cc504e',
    },
    imageBox:{
        padding:50,
        justifyContent:'flex-end',
        width: 100,
        height: 100,
        marginLeft:200,
        marginBottom:100,
    },
    callIcon:{
        justifyContent:"space-between",
        flexDirection: "row",
    },
    phoneCallBox:{
        fontSize:40,
        color:'#cc504e',
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