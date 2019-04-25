import React from 'react';
import 'jsdom-global/register';
import {shallow,mount} from 'enzyme';
import {Loading} from "../Loading";

let component;
beforeEach(() => {
    component = mount(<Loading />);
});

describe('Loading Component rendering', () => {

    test('should have Activity Indicator', () => {
        expect(component).toMatchSnapshot();
    });
})