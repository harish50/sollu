import React from 'react';

export const Header = (title, headerLeft, headerRight) =>{
    return (
        {
            headerTitle: title,
            headerBackTitle: "Back",
            headerTintColor: "white",
            headerStyle: {
                fontFamily: 'Roboto-Bold',
                backgroundColor: '#cc504e',
            },
            headerTitleStyle: {
                textAlign: "left",
                flex: 1
            },
            headerLeft: headerLeft,
            headerRight: headerRight
        }
    );
};