import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect } from 'react'
import { View, Text } from 'react-native'

const Logout = ({navigation,route}) => {
    const setUser = route.params.setUser
    useEffect(() => {
    setUser()
    },[])
    AsyncStorage.removeItem('@save_loginid')
    return <View>
    </View>
}

export default Logout