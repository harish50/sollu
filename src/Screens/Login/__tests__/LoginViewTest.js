import React from 'react';
import LoginView from '../LoginView';
import renderer from 'react-test-renderer';

test('renders correctly', () => {
    const tree = renderer.create(<LoginView />).toJSON();
    expect(tree).toMatchSnapshot();
});