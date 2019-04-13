import React from 'react';
import {shallow} from 'enzyme';
import LoginView from "../LoginView";
import {Image,TouchableOpacity, View, Button} from 'react-native';
import renderer from "react-test-renderer"

let component;
beforeEach(() => {
     component = shallow(<LoginView />);
});

describe('LoginComponent rendering', () =>{

  it('should have LoginComponent',()=>{
      expect(component).toMatchSnapshot();
  });

    it("should have image", ()=>{
        expect(component.find(Image)).toHaveLength(1);
    });

    it("should not have button", ()=>{
        expect(component.find(Button)).toHaveLength(0);
    });

    it("should have one view", ()=>{
       expect(component.find(View)).toHaveLength(3);
    });

    it("should have one touchablreOpacity",() =>{
        expect(component.find(TouchableOpacity)).toHaveLength(1);
    })
    it("should state if phone number is entered", () => {
        const instanceOf = renderer.create(<LoginView/>).getInstance();
        instanceOf.setNumber('9505517958');
        expect(instanceOf.state.phoneNumber).toEqual('9505517958')
    })
    test("onPress function is called only once",() => {
        const fn = jest.fn();
        const component = renderer.create(<LoginView onPress={fn} />);
        const instance = component.getInstance();
        instance.props.onPress();
        expect(fn.mock.calls.length).toBe(1);
    })
});

