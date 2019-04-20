import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    contactContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",
        height: 60,
        borderBottomColor: "rgba(92,94,94,0.5)",
        borderBottomWidth: 0.30
    },
    item: {
        fontSize: 18,
        fontFamily: 'Roboto-medium'
    },
    loadingIcon: {
        flex: 1,
        justifyContent: 'center',
    },
    loadingText:{
        textAlign:'center',
        fontSize:22,
        fontFamily:'Roboto-regular',
        color:'#000000',
        marginTop:10
    }
});