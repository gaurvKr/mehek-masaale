import React, { useEffect, useState } from "react"
import HomeStack from "./Screens/HomeStackNav"
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback, BackHandler } from 'react-native'
import User from './Screens/user.jpg'
import Orders from "./Screens/Orders";
import Logout from "./Screens/Logout";
import Support from "./Screens/Support";
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddUser from "./Screens/AddUser";
import Admin from './Screens/Admin'


const Items = (props) => {
  const navProps = props.navProps
  const [selIndex,setSelIndex] = useState(0)
  const icons = ['home', 'shopping-cart', 'support', 'logout']

  return navProps.state.routes.map((x, index) => {
    return <TouchableWithoutFeedback 
    key={index}
    onPress={e => {
      navProps.navigation.navigate({
      name: x.name,
      params: {
        items: []
      }
    }) 
    setSelIndex(index)
  }
  }>
      <View style={{
      flexDirection: 'row',
      alignItems:'center',
      padding:5,
      backgroundColor: index === selIndex ? '#f89' : '#fff'
    }}>
      <Icon name={icons[index]} size={25} style={{ marginRight: 20 }} />
      <Text key={index} style={{ fontSize: 20, padding: 5 }}>
        {x.name}
      </Text>
      </View>
    </TouchableWithoutFeedback>
  })
}

function App() {
  const Drawer = createDrawerNavigator();

  BackHandler.addEventListener
    ('hardwareBackPress',
     function () { return true})

     const [loading,setLoading] = useState(true);
     const [user,setUser] = useState()
 
     useEffect(() => {
      AsyncStorage.getItem("@save_loginid").then((data) => {
        if (data) {
          setUser(JSON.parse(data))
        }
        setLoading(false);
      }); 
    }, []);
  return (
    loading ? <View /> :  
    user ? user._id === '60f81d3a242f304e6c49be66' ? <Admin user={user} /> :
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => {
          return <View style={{ padding: 10, backgroundColor: '#fff' }} >
            <View style={{
              flexDirection: 'row',
              marginBottom: 30
            }}>
              <Image source={User} style={styles.image} />
              <View style={{ alignSelf: 'center', flex: 1 }}>
                <Text style={{ fontSize: 18, fontFamily: 'sans-serif-medium' }}>{user.name}</Text>
                <Text style={{ fontSize: 16, fontFamily: 'sans-serif-medium' }}>{user.mobile_no}</Text>
              </View>
            </View>
            <View>
             <Items navProps={props}/>
            </View>
          </View>
        }}
      >
        <Drawer.Screen name='Home' component={HomeStack} initialParams={{user:user}}/>
        <Drawer.Screen name='Your Orders' component={Orders} initialParams={{user}}/>
        <Drawer.Screen name='Support' component={Support} initialParams={{user}}/>
        <Drawer.Screen name='Logout' component={Logout} initialParams={
          {setUser:(val) => setUser(val)}
        }/>
      </Drawer.Navigator>
    </NavigationContainer>
     : <AddUser setUser={(val) => setUser(val)} />
  )
} 

const styles = StyleSheet.create({
  image: {
    marginRight: 10,
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#d3d6db'
  }
})

export default App