import React, {useState,useEffect} from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Home from './HomeScreen';
import Cart from './Cart';
import Payment from './Payment';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Axios from './Axios';
import Success from './Success';

 
const HomeStack = ({navigation,route}) => {
  const Stack = createStackNavigator(); 
  const [items,setItems] = useState([])
  const [loading,setLoading] = useState(true)
  const user = route.params.user
  const header = { headers: { Authorization: "Bearer " + user.token } };
  const [categories,setCategories] = useState([])

  useEffect(() => {
        Axios.get('/product/get',header).then((res) => {
            setItems(res.data)
            setLoading(false)
        }).catch((err) => {
            console.log(err);
            setLoading(false) 
        })
  },[])

    return (
        loading ? null :
        <Stack.Navigator 
            screenOptions={{
                headerStyle:{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 3,
                    },
                    shadowOpacity: 0.22,
                    shadowRadius: 2.22,
                    elevation: 2,
                },
            }}
        >
            <Stack.Screen name='Home' component={Home}
            options={{header: () => {return null}}}
              initialParams={{drawer: navigation,items,user,categoryProducts:[]}} />
            <Stack.Screen name='Cart' component={Cart} />
            <Stack.Screen name='Payment' component={Payment} initialParams={{user}}/>
            <Stack.Screen name='Success' component={Success} 
                options={{
                    header: (props) => null,
                }}
            />
        </Stack.Navigator>
    )
}

export default HomeStack