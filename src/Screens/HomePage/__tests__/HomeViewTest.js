import React from 'react';
import {shallow} from 'enzyme';
import HomeView from "../../Home/HomeView";
import {TextInput, TouchableOpacity} from "react-native";

let component;
beforeEach(() => {
    component = shallow(<HomeView />);
});

describe('HomeView Component rendering', () => {

    test('should have HomeView Component', () => {
        expect(component).toMatchSnapshot();
    });

    test('should render a flat list',() => {
        const fn = jest.fn();
        const component = shallow(<HomeView renderItem={fn} />)
        component.find(FlatList).at(0).simulate('changeText','9505517958')
        component.update()
    })
})

test("should call on login with given phone number",() => {
    const fn = jest.fn();
    const component = shallow(<LoginView onLogin={fn} />);
    component.find(TextInput).at(0).simulate('changeText','9505517958')
    component.update()
    component.find(TouchableOpacity).at(0).simulate('press')
    expect(fn).toBeCalledWith('9505517958')
});