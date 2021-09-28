import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState } from 'react'
import { View, TextInput, Text, TouchableOpacity, StyleSheet, StatusBar, BackHandler } from 'react-native'
import Axios from './Axios'

const AddUser = (props) => {
    const [name,setName] = useState('')
    const [mobile_no,setMobile_no] = useState('')
    const [address,setAddress] = useState('')
    const [loading,setLoading] = useState(false)
    const setUser = props.setUser

    const checkStates = () => {
        if(name.length!==0  && mobile_no.length!==0 && address.length!==0) {
            if(mobile_no.length ===10 && mobile_no.charAt(0) > 5) return false
            alert('Invalid Mobile no')
            return true
        }
        alert('Please fill all fields')
        return true
    }

    const signin = () => {
        setLoading(true)
        if(checkStates()) {
            setLoading(false)
            return true
        }
        Axios.post('/user/signin',{name,mobile_no,address}).then((res) => {
            setUser(res.data)
            AsyncStorage.setItem("@save_loginid",JSON.stringify(res.data))
            setLoading(false)
        }).catch((err) => {
            console.log(err);
            setLoading(false)
        })
    }
    BackHandler.addEventListener
    ('hardwareBackPress',
     function () { return true})

    return (<>
        <View style={{...styles.main_div,opacity: loading ? 0.5 : 1}}>
            <StatusBar backgroundColor='#467' />
            <TextInput
             value = {name}
             placeholder='Name'
             onChangeText={e => setName(e)}
             style={styles.input}
            />
            <TextInput
             value = {mobile_no}
             placeholder='Mobile no.'
             style={styles.input}
             onChangeText={e => setMobile_no(e)}
            />
            <TextInput
             value = {address}
             placeholder='Address'
             style={styles.input}
             onChangeText={e => setAddress(e)} 
            />
            <TouchableOpacity style={{marginTop: 20}} onPress={signin}>
                <Text style={styles.submit_button}> Submit </Text>
            </TouchableOpacity>
        </View>
        {
            loading ? <View style={{position:'absolute',left:0,zIndex:1,
            width:'100%',height:'100%'}} /> : null
        }
        </>
    )
}

const styles = StyleSheet.create({
    main_div: {
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
        padding: 10,
        alignContent: 'center',
        justifyContent: 'center'
    },
    input: {
        borderBottomWidth: 1,
        borderColor: "#a2a2a2",
        fontSize: 20,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    submit_button: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        backgroundColor: "#000",
        borderRadius: 3,
        textAlign: "center",
        padding: 10,
      }
})

export default AddUser