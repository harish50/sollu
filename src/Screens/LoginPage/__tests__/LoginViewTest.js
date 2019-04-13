import React from 'react';
import {mount, shallow} from 'enzyme';
import View from "../View";
import {Image, Text, TextInput, TouchableOpacity, View, Button} from 'react-native';

let component;
beforeEach(() => {
     component = shallow(<View />);
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

// describe('interaction',()=>{
//    let wrapper;
//    let props;
//    beforeEach(()=>{
//        props = {onPress:jest.fn()};
//        wrapper = shallow(<View {...props}/>);
//    })
//
//     describe('clicking the button',()=>{
//         beforeEach(()=>{
//             wrapper.find(TouchableOpacity).prop('onPress');
//         });
//
//         it('should call onclick callback',()=>{
//             expect(props.onPress).toHaveBeenCalledTimes(1);
//         })
//     })
// });

describe('should create an entry in component state ',()=>{
    const component = shallow(<View/>);

    const textInput = component.find('TextInput');

    textInput.props().onChangeText({target:{
            value:'myValue'
        }});
    it('should define the TextInput',()=>{
        expect(component.state('phoneNumber')).toBeDefined();
    });

    it('should create entry in comonent state with TextInput event value',()=>{
        expect(component.state('phoneNumber')).toEqual('myValue');
    });


});

