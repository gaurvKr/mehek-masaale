import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

const Success = ({navigation,route}) => {

     const backToHome = () => {
        navigation.navigate(
            {
                name: 'Home',
                params:{
                    orderCompleted: true
                }
            }
        )
    }

    return <View style={styles.model}>
        <View style={styles.modelContent}>
        <Feather name="check-circle" size={40} color="black"
        style={{ color: '#fff', alignSelf: 'center' }} />
            <Text style={{
                color: '#fff', fontSize: 18, textAlign: 'center',
                fontFamily: 'sans-serif-medium'
            }}>
                Your order completed successfully.
            </Text>
            <TouchableHighlight onPress={backToHome}
                style={{
                    ...styles.button, alignSelf: 'center',
                    backgroundColor: '#222', opacity: 0.7,
                    marginTop: 20, flexDirection: 'row',
                    alignItems:'center',
                }}>
                <>
                <AntDesign name="arrowleft"
                style={{ fontFamily: 'sans-serif-medium', fontSize: 18 }} />
                    <Text style={{ fontFamily: 'sans-serif-medium', fontSize: 18 }}>
                        BACK TO HOME </Text>
                </>
            </TouchableHighlight>
        </View>
    </View>
}

const styles = StyleSheet.create({
    model: {
        position: 'absolute',
        bottom: 0,
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modelContent: {
        padding: 20,
        backgroundColor: '#8bc34a',
        shadowColor: "#000",
        width: '70%',
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0.20,
        shadowRadius: 5,
        elevation: 5,
        padding: 30,
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

export default Success