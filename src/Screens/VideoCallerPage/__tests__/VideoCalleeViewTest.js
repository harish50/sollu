import React from 'react';
import {shallow} from 'enzyme';
import VideoCalleeView from "../VideoCalleeView";

let component;
beforeEach(() => {
    component = shallow(<VideoCalleeView />);
});

describe('VideoCalleeComponent rendering', () => {
    it('VideoCalleeComponent rendering',()=>{
        expect(component).toMatchSnapshot();
    });
})