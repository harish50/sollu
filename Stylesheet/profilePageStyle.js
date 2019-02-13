import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    header: {
        backgroundColor: "#cc504e",
        height: 80,
    },
    avatar: {
        borderRadius: 40,
        width: 130,
        height: 130,
        alignSelf: 'center'
    },
    name: {
        fontSize: 22,
        color: "#FFFFFF",
        fontWeight: '600',
    },
    body: {
        marginTop: 40,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding: 30,
    },
    logoText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 20,
        alignItems: "flex-start",
        marginLeft: 20,
        marginTop: 30
    },
    leftHeaderContainer: {
        alignItems: "flex-start",
        flexDirection: "row"
    },
    imageContainer: {
        alignItems: "center"
    },
    textStyle: {
        fontWeight: "bold",
        fontSize: 30,
        textAlign: "center",
        color: "red",
        marginTop: 10
    },
    iconPlaceholder: {
        alignSelf: 'center',
        borderColor: "black",
        backgroundColor: "#eee",
        borderRadius: 100,
        width: 200,
        height: 200,
        marginTop: 50,
    },
    loadingPosition:{
        marginTop:80
    },
    button: {
        width: "80%",
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-around"
    },
    previewImage: {
        alignSelf: 'center',
        borderColor: "black",
        backgroundColor: "#eee",
        borderRadius: 100,
        width: 200,
        height: 200,
        marginTop: 10,
    },
    dropdowncontainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    picker: {
        alignSelf: 'stretch',
        backgroundColor: "#cc504e",
        margin: 20,
        height: 40,
        borderRadius: 10,
    },
    pickerText: {
        color: 'white',
    }
})