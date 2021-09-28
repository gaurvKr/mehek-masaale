import React from 'react'
import { createBottomTabNavigator, } from '@react-navigation/bottom-tabs'
import AddProducts from './AddProduct'
import AdminOrders from './AdminOrders'
import Icon from 'react-native-vector-icons/Ionicons'
import { BackHandler, Text, View } from 'react-native'
import AdminItems from './AdminItems'
import { NavigationContainer } from '@react-navigation/native'

const Admin = ({user}) => {
    const Tab = createBottomTabNavigator()
    const icon = {Add:'add-circle',Orders:'cart','Item List': 'list-circle'}

    BackHandler.addEventListener
    ('hardwareBackPress',
     function () { return true})

    return <NavigationContainer>
        <Tab.Navigator
    screenOptions={(props) => ({
        tabBarLabel: ({color}) => {
            return <View style={{alignItems:'center',width:'100%',
            borderBottomWidth:4,borderColor:color === 'tomato' ? color : '#fff'}}>
                <Icon name={icon[props.route.name]} size={25} color={color}
                style={{fontWeight: 'bold',
                fontFamily:'sans-serif-medium'}} />
                <Text style={{color:color,
                    fontFamily:'sans-serif-medium',fontSize:16}}>
                    {props.route.name}
                </Text>
                </View>
        },
      })}

      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
        style: {
            height: 60,
            padding:5
        }
      }}
    >
        <Tab.Screen name='Add' component={AddProducts} initialParams={{user}} />
        <Tab.Screen name='Orders' component={AdminOrders} initialParams={{user}} />
        <Tab.Screen name='Item List' component={AdminItems} initialParams={{user}} />

    </Tab.Navigator>
    </NavigationContainer>
}

export default Admin