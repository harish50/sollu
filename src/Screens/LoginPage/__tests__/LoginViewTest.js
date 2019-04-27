import React from 'react';
import {shallow} from 'enzyme';
import LoginView from "../LoginView";
import {TouchableOpacity,TextInput} from 'react-native';
import renderer from "react-test-renderer"


describe('LoginComponent rendering', () =>{

    test('should have LoginComponent',()=>{
        expect(component).toMatchSnapshot();
    });

    test("should check if phone number is entered", () => {
        const instanceOf = renderer.create(<LoginView/>).getInstance();
        instanceOf.setNumber('9505517958');
        expect(instanceOf.state.phoneNumber).toEqual('9505517958')
    });

    test("should call on login with given phone number",() => {
        const fn = jest.fn();
        const component = shallow(<LoginView onLogin={fn} />);
        component.find(TextInput).at(0).simulate('changeText','9505517958')
        component.update()
        component.find(TouchableOpacity).at(0).simulate('press')
        expect(fn).toBeCalledWith('9505517958')
    });
});
