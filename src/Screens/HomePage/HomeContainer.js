import React, {Component} from 'react';
import HomeView from './HomeView'
import {getSolluContacts, requestContactsPermission} from "./Contacts";
import {setToLocalStorage} from "../../Utilities/LocalStorage";

export default class HomeContainer extends Component {
    state = {
        contacts: []
    };

    componentDidMount() {
        this.getPermissionToLocalContacts().then((permission)=>{
            if(!permission){
                alert(permission);
                return;
            }
            console.log("Permision granted")
                this.getSolluLocalContacts()
        })
    }

    async getPermissionToLocalContacts() {
        return await requestContactsPermission();
    }

     async getSolluLocalContacts() {
         // setToLocalStorage("SolluContacts", this.state.contacts)
         // let localSolluContacts = getFromLocalStorage('SolluContacts');
         // console.log(localSolluContacts);
         // if (localSolluContacts) {
         //     this.setState({
         //         contacts: await JSON.parse(localSolluContacts) || []
         //     });
         // }
         // else {
         //     getSolluContacts();
         // }
         getSolluContacts().then((solluContacts)=>{
             console.log("Go there");
             console.log(solluContacts);
             setToLocalStorage("solluContacts", JSON.stringify(solluContacts));
             this.setState({
                 contacts : solluContacts
             })
         })
     }

    render() {

        return (
            <HomeView contacts={this.state.contacts}/>
        )
    }
}