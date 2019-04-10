import React from 'react';
import {mount, shallow} from 'enzyme';
import LoginView from "../LoginView";
import {Image, Text, TextInput, TouchableOpacity, View, Button} from 'react-native';

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
});