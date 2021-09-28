import { useFocusEffect } from '@react-navigation/native'
import React, { memo, useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback, VirtualizedList,
    Animated, Dimensions, TextInput, BackHandler, Modal } from 'react-native'
import { baseProps } from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlers'
import Axios from './Axios'

const AdminOrders = ({navigation,route}) => {
    const [orders,setOrders] = useState([])
    const [loading,setLoading] = useState(false)
   const header = { headers: { Authorization: "Bearer " + route.params.user.token } };
    const [show,setShow] = useState(false)
    const [search,setSearch] = useState('')
    const [wait,setWait] = useState(false)

   BackHandler.addEventListener
    ('hardwareBackPress',
     function () {return false })

     useFocusEffect(
        React.useCallback(() => {
            Axios.get('/order/get',header).then((res) => {
                setOrders(res.data)
                route.params.i = res.data
            }).catch((err) => {
                console.log(err);
            })
          return () => {
              setSearch('')
              setWait(false)
          }
        }, [])
      );

    const AnimateView = (id) => {
        console.log('dgj');
        route.params.id = id
        setShow(true)
    }

    const submitMessage = (msg) => {
        if(msg.length !== 0){setLoading(true)
        Axios.post('/order/sendMsg',{msg,id:route.params.id},header).then((res) => {
            setLoading(false)
        }).catch((err) => {
            console.log(err);
            setLoading(false)
        })
        setShow(false)}
        else alert("Please type something")
    }

    const ModelView = () => {
        const [msg,setMsg] = useState('')
        return (
            <Modal
                animationType="slide"
                visible={show}
                transparent={true}
            >
                <View style={{width:'100%',height:'100%',
                alignItems:'center',justifyContent:'center'}}>
                    <View style={{...styles.card,padding:20,width:'80%'}}>
                        <TextInput style={styles.input} value={msg}
                         placeholder='Message' onChangeText={e => setMsg(e)} />
                        <View style={{flexDirection:'row'}}>
                            <Text onPress={e => submitMessage(msg)}
                            style={{...styles.button,flex:1,
                                backgroundColor:'#048e56'}}>Submit</Text>
                            <Text style={{...styles.button,flex:1,
                            backgroundColor:'crimson',marginLeft:10}}
                            onPress={e => setShow(false)}>Cancel</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    const orderCompleted  =(id,index) => {
        setLoading(true)
        Axios.post('/order/complete',{id},header).then((res) => {
            setOrders(orders.filter((x,i)=> {return i!=index}))
            route.params.i = route.params.i.filter((x,i)=> {return i!=index})
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setLoading(false)
        })
    }

    const List = ({y,index}) => {
        return <View style={{ ...styles.card,backgroundColor:
             y.delivered === 'wait'? '#fff34f' : '#fff'}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={{fontSize: 16, flex:0.4,color:'#000'}}>Name:</Text>
                    <Text style={{fontSize: 16,flex:0.6,color:'#000'}}>{y.name}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={{fontSize: 16, flex:0.4,color:'#000'}}>Address:</Text>
                    <Text style={{fontSize: 16,flex:0.6,color:'#000'}}>{y.address}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',
                    borderBottomWidth: 1,borderColor:'#a2a2a2'
                }}>
                    <Text style={{fontSize: 16, flex:0.4,color:'#000'}}>Mobile no:</Text>
                    <Text style={{fontSize: 16,flex:0.6,color:'#000'}}>{y.mobile_no}</Text>
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
                    <TouchableWithoutFeedback onPress={e => AnimateView(y._id)} >
                    <Text style={{...styles.button,backgroundColor:'#0c75ff'}}> Send Message </Text>
                </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={e => orderCompleted(y._id,index)} >
                    <Text style={styles.button}> Order Completed </Text>
                </TouchableWithoutFeedback>
                </View>
        
    } 

    const filter = (search) => {
        const match = (x) => {
            if(wait) {
                if(x.delivered === 'wait') return true
                 else return false
            }
            else return true
        }
        if(route.params.i){
            console.log('h');
            const regx = new RegExp(search, "gi")
            setOrders(route.params.i.filter((x, index) => 
            x.address.match(regx) && match(x)))
            if(search.length === 0) setOrders(wait ?
                 route.params.i.filter((x, index) => x.delivered === 'wait') : route.params.i)}
            setSearch(search)
    }
 
    const PureList = memo(List)

    const filterByWait = () => {
        const regx = new RegExp(search, "gi")
        if(!wait){
            setOrders(orders.filter((x, index) => x.delivered === 'wait'))
        }
        else {
            const val = search.length === 0 ? route.params.i :
            route.params.i.filter((x, index) => x.address.match(regx))
            setOrders(val)
        }
        setWait(!wait)
    }

    return <>
    <View style={{...styles.main_div,opacity : loading ? 0.5 : 1}}>
    <View style={{borderBottomWidth:1,flexDirection:'row'}} >
            <TextInput style={{...styles.input,flex:1}} value={search}
             onChangeText={ e => filter(e)} placeholder='Search'/>
             <Text style={{color:'#000',margin:10,padding:5,flex:0.2,
             fontSize:20,textAlignVertical:'center',borderColor:'#a9a',
             borderRadius:10,borderWidth:1,textAlign:'center'}}
              onPress={filterByWait} > {wait ? 'All' : 'Wait'} </Text>
             </View>
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
            <ModelView />
    </View>
    {
        loading ? <View style={{position:'absolute',
        bottom: 0,width:'100%',height:'100%',zIndex:1}} /> : null
    }
    </>
}

const styles = StyleSheet.create({
    main_div: {
        backgroundColor: '#fff',
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
        padding: 10,
        borderRadius:10,
        backgroundColor: '#f8f8f8',
        margin: 5,
    },
    ButtonSheet: {
        shadowColor: "#000",
        shadowOffset: 
        {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 2,
        padding:20,
        backgroundColor:'#f8f8f8',
        borderRadius:10
    },
    input: {
        borderWidth: 1,
        borderColor: "#a2a2a2",
        fontSize: 20,
        borderRadius: 5,
        padding: 5,
        margin:10
    },
    button: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        backgroundColor: "#20274a",
        textAlign: "center",
        padding: 8,
        marginTop: 10,
        borderRadius: 10
    }
})

export default AdminOrders
