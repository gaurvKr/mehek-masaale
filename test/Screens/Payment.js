import React, { useState } from 'react'
import {
    View, Text, TextInput, StyleSheet, TouchableOpacity,
    ScrollView, Image, TouchableHighlight
} from 'react-native';

import Axios from './Axios';


const Payment = ({ navigation, route }) => {
    const items = route.params.products
    const user = route.params.user
    const [loading,setLoading] = useState(false)
    const header = { headers: { Authorization: "Bearer " + route.params.user.token } };


    let total = 0
    items.map(x => {
        let basePrice = x.price / x.priceBaseVal
        total = (total + parseFloat((basePrice * x.qty).toFixed(2)))
        total = parseFloat(total.toFixed(2))
    })
    const [name,setName] = useState(user.name)
    const [mobile_no,setMobile_no] = useState(user.mobile_no)
    const [address,setAddress] = useState(user.address)
     /*
    const orderApi = async () => {
        const { data } = await axios.post('http://192.168.0.106:5000/order/payment', { amount: 100 })
        console.log(data);
        var options = {
            description: 'Credits towards consultation',
            image: 'https://i.imgur.com/3g7nmJC.png',
            currency: 'INR',
            key: 'rzp_live_k7g0rC2SWPpJ8O',
            amount: '100',
            name: 'Mehek',
            order_id: `${data.id}`,//Replace this with an order_id created using Orders API.    
            prefill: {
                email: 'gaurav.kumar@example.com',
                contact: '9191919191',
                name: 'Gaurav Kumar'
            },
            theme: { color: '#53a20e' }
        }
        RazorpayCheckout.open(options).then((e) => {    // handle success 
            console.log('yes');
        }).
            catch((error) => {    // handle failure   
               console.log(error);
                
            });
    }
    */
   
    const [editable,setEditable] = useState(false)

    const completeOrder = () => {
        setLoading(true)
           Axios.post('/order/add',{name,address,mobile_no,
            items,delivered:'NO',total},header).then((res) => {
                setLoading(false)
                navigation.navigate('Success')
           }).catch((err) => {
               setLoading(false)
               console.log(err);
           })
    }

    return (
        <>
        <View style={{...styles.main_div,opacity: loading ? 0.5 : 1}}>
            <ScrollView>
                <View style={styles.card}>
                    <Text style={styles.text}>Personal Details</Text>
                    <View>
                        <Text style={{fontSize:17}}>Name</Text>
                        <TextInput style={styles.input} placeholder='Name'
                        onChangeText={e => setName(e)} value={name} editable={editable} />
                    </View>
                    <View>
                        <Text style={{fontSize:17}}>Mobile no.</Text>
                        <TextInput style={styles.input} placeholder='Mobile no.'
                        onChangeText={e => setMobile_no(e)} value={mobile_no}
                         editable={editable} />
                    </View>
                    <View>
                        <Text style={{fontSize:17}}>Address</Text>
                        <TextInput style={styles.input} placeholder='Address'
                         value={address} onChangeText={e => setAddress(e)}
                            editable={editable} multiline />
                    </View>
                    <TouchableHighlight underlayColor='#fff' onPress={e => setEditable(!editable)}
                        style={{ alignItems: 'center', marginTop: 10 }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: "#ff0099", fontSize: 18,
                            letterSpacing: 0.5 , textDecorationLine: 'underline' }}>
                                {!editable? 'Edit' : 'Save'}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={{ ...styles.card, flex: 1 }}>
                    <Text style={styles.text}>Products Details</Text>
                    {
                        items.map((x,index) => {
                            let basePrice = x.price / x.priceBaseVal
                            return (
                                <View key={index} style={{
                                    flex: 1, borderColor: '#a2a2a2', borderBottomWidth: 1,
                                    padding: 5, marginTop: 15
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Text style={{ flex: 1, fontSize: 16, fontWeight: 'bold' }}>
                                            {x.name}
                                        </Text>
                                        <Text style={{ flex: 1, fontSize: 16 }}>
                                            Qty: {x.qty < 1000 ? `${x.qty}g` : `${x.qty / 1000}kg`}
                                        </Text>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Text style={{ flex: 1, fontSize: 15 }}>
                                            Price: {'\u20B9'}
                                            {x.price} per {x.priceBaseVal === 1000 ?
                                             'kg' : `${x.priceBaseVal} g`}
                                        </Text>
                                        <Text style={{ flex: 1, fontSize: 15 }}>Product Total: {'\u20B9'}{(basePrice * x.qty).toFixed(2)}</Text>
                                    </View>
                                </View>
                            )
                        })
                    }
                    <View style={{
                        marginTop: 10,
                        padding: 10,
                        backgroundColor: '#f7b3ab',
                        borderTopColor: 'red',
                        borderTopWidth: 1,
                        marginBottom: 10
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 15 }}> Item total </Text>
                            <Text style={{ fontSize: 15 }}> {'\u20B9'} {total}  </Text>
                        </View>
                        <View style={{
                            borderBottomWidth: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingBottom: 5,
                            borderBottomColor: '#ff8077'
                        }}>
                            <Text style={{ fontSize: 15 }}> Delivery Charges </Text>
                            <Text style={{ fontSize: 15, }}> {'\u20B9'} 20 </Text>
                        </View>
                        <View style={{ paddingTop: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 17 }}> Grand Total </Text>
                            <Text style={{ fontSize: 17 }}> {'\u20B9'} {total + 20} </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
                <TouchableOpacity onPress={completeOrder}>
                    <Text style={styles.button}>Complete Your Order</Text>
                </TouchableOpacity>
        </View>
        {
            loading ? <View style={{position:'absolute',zIndex:1,
            bottom: 0,width:'100%',height:'100%'}} /> : null
        }
        </>
    )
}

const styles = StyleSheet.create({
    main_div: {
        backgroundColor: '#eee',
        height: '100%',
        width: '100%',
    },
    text: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    input: {
        borderBottomWidth: 1,
        borderColor: "#a2a2a2",
        fontSize: 17,
        borderRadius: 5,
        padding: 2,
        marginBottom: 10,

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
        elevation: 2,
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
        backgroundColor: "#ff1877",
        textAlign: "center",
        padding: 10,
    },

})

export default Payment