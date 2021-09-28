import React, { useEffect, useState } from 'react'
import {
    View, Text, VirtualizedList, StyleSheet, StatusBar, Image, TouchableOpacity, BackHandler
} from 'react-native';
import { Picker } from 'react-native-picker-dropdown'
import Icon from 'react-native-vector-icons/Ionicons';

const Cart = ({navigation, route}) => {
    const [items,setItems] = useState(route.params.items)
    const qtyArr = ['50g', '100g', '250g', '500g', '1kg', '2kg', '3kg','5kg']
    const qtyValArr = [50,100,250,500,1000,2000,3000,5000]
    const [err,setErr] = useState()

    useEffect(()=>{
        if(items.length === 0) {
            navigation.navigate({
                name:'Home'
            })
        }
    },[items])

    const Items = ({x,index}) => {
    const [qty, setQyt] = useState(x.qty)
    
    let basePrice = x.price/x.priceBaseVal
        return (
        <View key={index} style={styles.card}>
            <View style={{flex: 0.62,flexDirection: 'row',marginRight:10}}>
                <Image source={{ uri: `https://mehek-masale.herokuapp.com/image/get?name=${x.image}` }}
                    style={{ width: 60,height: 60 }} />
                    <View style={{flex: 1,borderWidth: 0,marginLeft: 5}}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{x.name}</Text>
                <Text style={{ fontSize: 13 }}>Price: {'\u20B9'}{x.price} per {x.priceBaseVal === 1000 ? 'kg' : `${x.priceBaseVal}g`}</Text>
                </View>
            </View>
            <View style={{flex: 0.38,flexDirection:'row'}}>
            <Picker
                selectedValue={x.qty}
                style={{
                    borderColor: "#a2a2a2",
                    borderWidth: 1,
                    borderRadius: 5,
                    height: 50,
                    flex: 1
                }}
                onValueChange={(itemValue, itemIndex) => {
                    setItems(items.map((x,i) => {
                        if(index === i) {
                        return {...x,qty: itemValue} }
                        else { return x  }
                    }))
                    setQyt(itemValue);
                }}>
                <Picker.Item label="Qty" value={null} />
                {qtyArr.map((x, index) => {
                    return <Picker.Item key={index} label={x} value={qtyValArr[index]} />
                })}
            </Picker>
            </View>
            <View style={{alignItems: 'flex-end'}}>
            <Icon name="trash-outline"
            style={{color: '#000',marginLeft: 5}}
            onPress={e => {
                setItems(items.filter((x,i) => {
                    return index!==i
                }))
            }} size={30} color="black" />
            </View>
        </View>
   )
    }

    const proceedToPay = () => {
        let err
        for(const element of items) {
            if(!element.qty) 
            {
                setErr('Please select qty for all items or delete extra items.')
                err = true
                break
            }
        }
        if(!err)
        {
            navigation.navigate({
                name: 'Payment',
                params: {
                    products: items
                }
            })
            setErr(false)
        }
    }

    return (
        <View style={styles.main_div}>
            <StatusBar backgroundColor="#0481eb" />
            {err ? <Text 
            style={{
                color: '#dc143c',
                padding: 10,
                fontSize: 16,
                textAlign: 'center',
                alignSelf: 'center',
                fontWeight: '600'
            }}>{err}</Text> : null}
            <VirtualizedList
                style={{ paddingBottom: 10 }}
                data={items}
                renderItem={({item}) => <Items key={item.index.toString()} x={item.x} index={item.index} />}
                keyExtractor={item => item.index.toString()}
                getItemCount={(data) => data.length}
                getItem={(data,index) => ({
                    x: data[index],
                    index
                })}
            />
            <TouchableOpacity style={{height: 50}} onPress={proceedToPay}>
                    <Text style={{...styles.button,borderRadius: 0,
                        backgroundColor: '#ff1877',margin: 0}}> Proceed To Pay </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    main_div: {
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
    },
    input: {
        borderBottomWidth: 1,
        borderColor: "#a2a2a2",
        fontSize: 20,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
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
        backgroundColor:'#f8f8f8'
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

export default Cart