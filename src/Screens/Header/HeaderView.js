import React, {Component} from 'react';


class HeaderView extends Component
{

    navigationOptions = ({navigation}) => {
        return (
            {
                headerTitle: "Sollu",
                headerBackTitle: "Back",
                headerTintColor: "white",
                headerStyle: {
                    fontFamily: 'Roboto-Bold',
                    backgroundColor: '#cc504e',
                },
                headerTitleStyle: {
                    textAlign: "left",
                    flex: 1
                }
            }
        );
    };
}
export default HeaderView