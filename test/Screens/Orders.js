import { ScrollView, StyleSheet, Text, TouchableWithoutFeedback,
     View, VirtualizedList } from "react-native"
import React, { memo, useEffect, useState } from 'react'
import Header from "./Header"
import Axios from "./Axios"

const Orders = ({navigation,route}) => {
    const [orders,setOrders] = useState([])
    const [loading,setLoading] = useState(false)
    const user = route.params.user

   const header = { headers: { Authorization: "Bearer " + route.params.user.token } };

     
    const cancelOrder = (_id,index) => {
        setLoading(true)
        Axios.post('/order/cancel',{_id},header).then((res) => {
            setOrders(orders.filter((x,i)=> {return i!=index}))
            setLoading(false)
        }).catch((err) =>{
            console.log(err);
            setLoading(false)
        })
    }

    useEffect(() => {
        setLoading(false)
        const unsubscribe = navigation.addListener("focus", () => {
            Axios.get(`/order/get?mobile_no=${user.mobile_no}`,header).then((res) => {
                setOrders(res.data)
                setLoading(false)
            }).catch((err) => {
                console.log('err');  
                setLoading(false)
            })
          })
          console.log('hgj');
          return unsubscribe
    }
    ,[navigation])

    const List = ({y,index}) => {
        return <View style={{ ...styles.card}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={{fontSize: 16, flex:0.4,color:'#000'}}>Order Id:</Text>
                    <Text style={{fontSize: 16,flex:0.55,color:'#000'}}>{y._id}</Text>
                    </View>
                    {
                        y.items.map((x,ind) => {
                            let basePrice = x.price / x.priceBaseVal
                            return (
                                <View key={ind}
                                 style={{
                                     borderColor: '#a2a2a2', borderBottomWidth: 1,
                                    padding: 5,
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Text style={{ flex: 0.4,color:'#000',
                                         fontSize: 16, fontWeight: 'bold' }}>
                                            {x.name}
                                        </Text>
                                        <Text style={{ flex: 0.55 ,color:'#000'
                                        , fontSize: 16 }}>
                                            Qty: {x.qty < 1000 ? `${x.qty}g` : `${x.qty / 1000}kg`}
                                        </Text>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Text style={{ flex: 0.4 ,color:'#000', fontSize: 15 }}>
                                            Price: {'\u20B9'}{x.price} per
                                            {x.priceBaseVal === 1000 ? 'kg' : `${x.priceBaseVal} g`}
                                        </Text>
                                        <Text style={{ flex: 0.55 ,color:'#000', fontSize: 15 }}>Product Total: {'\u20B9'}{(basePrice * x.qty).toFixed(2)}</Text>
                                    </View>
                                </View>
                            )
                        })
                    }
                    <View style={{
                        borderColor: '#a2a2a2', borderBottomWidth: 1,
                        padding: 5
                    }}>
                        <View style={{justifyContent:'space-between',flexDirection:'row'}}>
                    <Text style={{ flex: 0.4,color:'#000',
                        fontSize: 16, fontWeight: 'bold' }}>
                            Total
                        </Text>
                        <Text style={{ flex: 0.55 ,color:'#000'
                        , fontSize: 16 }}>
                            {y.total}
                        </Text>
                        </View>
                        <View style={{justifyContent:'space-between',flexDirection:'row'}}>
                    <Text style={{ flex: 0.4,color:'#000',
                        fontSize: 16, fontWeight: 'bold' }}>
                            Delivery Charges
                        </Text>
                        <Text style={{ flex: 0.55 ,color:'#000'
                        , fontSize: 16 }}>
                            20
                        </Text>
                        </View>
                        </View>
                        <View style={{borderBottomWidth:1,padding:5,
                            justifyContent:'space-between',flexDirection:'row'}}>
                    <Text style={{ flex: 0.4,color:'#000',
                        fontSize: 16, fontWeight: 'bold' }}>
                            Order Status
                        </Text>
                        <Text style={{ flex: 0.55 ,color:'#000'
                        , fontSize: 16 }}>
                            {y.msg ? y.msg : 'Pending'}
                        </Text>
                        </View>
                    <TouchableWithoutFeedback onPress={e => cancelOrder(y._id,index)} >
                    <Text style={styles.button}> Cancel order </Text>
                </TouchableWithoutFeedback>
                </View>
        
    } 

    const PureList = memo(List)

    return <><View style={{...styles.main_div,opacity: loading ? 0.5 : 1}}>
        <Header navigation={navigation} route={route}  />
        <VirtualizedList
                style={{ paddingBottom: 10 }}
                data={orders}
                renderItem={({item}) => <PureList key={item.index.toString()} y={item.x} index={item.index} />}
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
}

const styles = StyleSheet.create({
    main_div: {
        backgroundColor: '#eee',
        height: '100%',
        width: '100%',
    },
    card: {
        shadowColor: "#000",
        marginTop: 10,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 5,
        padding: 5,
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: 'white',
        margin: 5,
    },
    button: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        backgroundColor: "#DC143C",
        textAlign: "center",
        padding: 8,
        marginTop: 10,
        borderRadius: 10
    }
})

export default Orders 