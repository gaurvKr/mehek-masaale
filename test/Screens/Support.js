import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Header from './Header';

const Support = ({navigation,route}) => {
    return <View style={styles.main_div}>
        <Header navigation={navigation} route={route}  />
        <View style={styles.midDiv}>
            <Text style={styles.text}>If you have any questions, please
                call us or message your questions on whatsapp.
            </Text>
            <Text style={styles.text}>Contact timing: 8:00 AM - 10:00 PM. </Text>
            <Text style={styles.text}>
                Phone no. : 9318484300
            </Text>
                 
        </View>
    </View>
}

const styles = StyleSheet.create({
    main_div: {
        backgroundColor: '#eee',
        height: '100%',
        width: '100%',
    },
    midDiv: {
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 3,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 2,
        flex: 1
    },
    heading: {
        fontSize:25,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginTop: 10
    },
    text: {
        fontSize: 18,
        fontFamily: 'sans-serif-medium',
        padding: 10,
    }
})

export default Support