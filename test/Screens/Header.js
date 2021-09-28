import React from 'react';
import {View, Text} from 'react-native'
import Icon from 'react-native-vector-icons/Entypo';

const Header = (props) => {
    const drawer = props.navigation
    const name = props.route.name
        return <View style={{
            backgroundColor: '#fff',
            flexDirection: 'row',
            padding:10,
            alignItems: 'center',
            shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 10,
            }}>
            <Icon name='menu' 
                style={{fontSize:25,
                marginRight:10,
                fontFamily: 'sans-serif-medium'}}
                onPress = {e => drawer.openDrawer()}
            />
        <Text style={{fontFamily: 'sans-serif-medium', fontSize: 20}}>{name}</Text>
         </View>
}

export default Header