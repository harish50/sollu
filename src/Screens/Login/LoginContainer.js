import React from 'react';
import LoginView from './LoginView'
import {registerUser} from '../../Utilities/Firebase'
import {setToLocalStorage} from '../../Utilities/LocalStorage'
import {isValid} from "../../Utilities/PhoneNumber";
import {STRINGS} from "../../Utilities/StringsStore";

const Container = () => {

    const onLogin = (phoneNumber) => {
        if (isValid(phoneNumber)) {
            registerUser(phoneNumber);
            setToLocalStorage(STRINGS.PHONENUMBER, phoneNumber);
        }
        else {
            alert(STRINGS.INVALID)
        }

    };
    return (
        <LoginView onLogin={onLogin}/>
    );
};
export default Container;