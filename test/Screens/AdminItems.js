import React, { useEffect, useState,memo } from 'react'
import {
    View, Text, VirtualizedList, StyleSheet, StatusBar, Image, TouchableOpacity, BackHandler, TextInput
} from 'react-native';
import { Picker } from 'react-native-picker-dropdown'
import Icon from 'react-native-vector-icons/Ionicons';
import Axios from './Axios';
import FontAwesome from 'react-native-vector-icons/Feather'
import { useFocusEffect } from '@react-navigation/native';

const AdminItems = ({navigation, route}) => {

    const [items,setItems] = useState([]);
  const [loading,setLoading] = useState(true);
   const header = { headers: { Authorization: "Bearer " + route.params.user.token } };
   const [s,setS] = useState('')

   BackHandler.addEventListener
    ('hardwareBackPress',
     function () {return false})


  const deleteItem = (_id,index) => {
      setLoading(true)
    Axios.post('/product/delete',{_id},header).then((res) => {
        route.params.i = route.params.i.filter((x,i) => {
            return i!=index
        })
        setItems(items.filter((x,i) => {
            return i!=index
        }))
        setLoading(false)
    }).catch(err => 
        {
            console.log(err);
            setLoading(false)
        })
  }

  const filter = (search) => {
      setS(search)
    if(route.params.i){
    const regx = new RegExp(search, "gi")
    setItems(route.params.i.filter((x, index) => x.name.match(regx)))
    if(search.length === 0) setItems(route.params.i)}
  }

  useFocusEffect(
    React.useCallback(() => {
        Axios.get('/product/get',header).then((res) => {
            setItems(res.data)
            route.params.i = res.data
            setLoading(false)
        }).catch((err) => {
            console.log(err);
        })

      return () => setS('')
    }, [])
  );

    const Items = ({x,index}) => {
        return (
        <View key={index} style={styles.card}>
            <View style={{flex: 1,flexDirection: 'row',marginRight:10}}>
                <Image source={{ uri: `https://mehek-masale.herokuapp.com/image/get?name=${x.image}` }}
                    style={{ width: 60,height: 60 }} />
                    <View style={{flex: 1,borderWidth: 0,marginLeft: 5,justifyContent:'center'}}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{x.name}</Text>
                <Text style={{ fontSize:  16}}>Price: {'\u20B9'}{x.price} per {x.priceBaseVal === 1000 ? 'kg' : `${x.priceBaseVal}g`}</Text>
                </View>
            </View>
            <Icon name="trash-outline"
            style={{color: '#000',marginLeft: 5}}
            onPress={e => deleteItem(x,index)} size={30} color="black" />
            <FontAwesome name='edit' size={30}
             style={{color: '#000',marginLeft: 10}} 
             onPress={e => {
                 navigation.navigate({
                    name: 'Add',
                    params: {
                        product: x,
                        id: x._id
                    }
                })
             }}
            />
        </View>
   )
    }

    const PureList = memo(Items)

    return (<>
        <View style={{...styles.main_div,opacity: loading ? 0.5 : 1}}>
            <StatusBar backgroundColor="#0481eb" />
            <View style={{borderBottomWidth:1}} >
            <TextInput style={styles.input} value={s} 
             onChangeText={ e => filter(e)} placeholder='Search'/>
             </View>
            <VirtualizedList
                style={{ paddingBottom: 10 }}
                data={items}
                renderItem={({item}) => <PureList key={item.index.toString()} x={item.x} index={item.index} />}
                keyExtractor={item => item.index.toString()}
                getItemCount={(data) => data.length}
                getItem={(data,index) => ({
                    x: data[index],
                    index
                })}
            />
        </View>
        {
            loading ? <View style={{position:'absolute',
            bottom: 0,width:'100%',height:'100%',zIndex:1}} /> : null
        }
        </>
    )
}

const styles = StyleSheet.create({
    main_div: {
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
    },
    input: {
        borderWidth: 1,
        borderColor: "#a2a2a2",
        fontSize: 20,
        borderRadius: 5,
        padding: 5,
        margin:10
    },
    card: {
        flexDirection: 'row',
        shadowColor: "#000",
        shadowOffset: 
        {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 5,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        margin: 10,
        justifyContent: 'space-between',
        backgroundColor:'#F8F8F8',
    },
    button: {
        flex: 1,
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        backgroundColor: "green",
        borderRadius: 3,
        textAlign: "center",
        padding: 10,
        margin: 10,
      }
})

export default AdminItems