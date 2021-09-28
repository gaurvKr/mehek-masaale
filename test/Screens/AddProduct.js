import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, Image,
     StyleSheet, Animated,ScrollView, TouchableOpacity, BackHandler } from 'react-native'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Axios from './Axios'

const AddProducts = ({navigation,route}) => {
   const header = { headers: { Authorization: "Bearer " + route.params.user.token } };
    const [height,setHeight] = useState(new Animated.Value(-500)) 
    let height0 = true
    const [name,setName] = useState('');
    const [price,setPrice] = useState('');
    const [priceBaseVal,setPriceBaseVal] = useState('');
    const [image,setImage] = useState();
    const [loading,setLoading] = useState(false)
    const [category,setCategory] = useState('')
    const _id = route.params.id

    BackHandler.addEventListener
    ('hardwareBackPress',
     function () { return true})

    const checkStates = () => {
        if(name.length!==0 && price.length!==0 && category.length!==0
             && priceBaseVal.length!==0 && image) return false
            alert('Please fill all fields')
        return true
    }

    if(route.params.product){
        const product = route.params.product
        setName(product.name)
        setImage(product.image)
        setCategory(product.category)
        setPrice(product.price)
        setPriceBaseVal(product.priceBaseVal)
        route.params.product = null
    }

    const AnimateView = () => {
        Animated.timing(height,{
            toValue: height0 ? 0 : -500,
            duration: 500,
            useNativeDriver: false
        }).start()
        height0 = !height0  
    }
    
    const onButtonPress = React.useCallback((type, options) => {
        if (type === 'capture') { 
          launchCamera(options, (res) => {
              setImage(res.assets)
          })
        } else {
          launchImageLibrary(options, (res) => {
            setImage(res.assets)
        });
        }
      }, [])

    const addItem = async() => {
        if(!checkStates()) {
            setLoading(true)
            if(typeof image[0] === 'string') {
                Axios.post('/product/add',{
                    name,price,priceBaseVal,category,_id
                },header).then(() => {
                    route.params.id = false
                    setPrice('');
                    setImage()
                    setPriceBaseVal('');
                    setName('');
                    setCategory('')
                    setLoading(false)
                }).catch((err) => {
                    console.log(err);
                    setLoading(false)
                })
            }
            else 
            {
                let localUri = image[0].uri
              let filename = image[0].uri.split('/').pop()
            
              // Infer the type of the image
              let type = image[0].type
            
              // Upload the image using the fetch and FormData APIs
              let formData = new FormData();
              // Assume "photo" is the name of the form field the server expects
              formData.append('file', { uri: localUri, name: filename, type });
            Axios.post('/image/upload',formData,header)
            .then((res) => {
                Axios.post('/product/add',{
                    image:res.data.filename,name,price,priceBaseVal,category,_id
                },header).then(() => {
                    setPrice('');
                    setImage()
                    setPriceBaseVal('');
                    setName('');
                    setCategory('')
                    route.params.id = false
                    setLoading(false)
                }).catch((err) => {
                    console.log(err);
                    setLoading(false)
                })
            }).catch((err) => {
                console.log(err);
                setLoading(false)
            })
        }
            }
    }

    return <>
    <View style={{width:'100%',height:'100%',opacity: loading ? 0.5 : 1}}>
        <ScrollView> 
            <>
            <TouchableOpacity activeOpacity={1} onPress={AnimateView}
            style={{height:300,backgroundColor: '#000',
            alignItems:"center",justifyContent:'center'}}>
                {image ? 
                <Image source={{
                    uri:typeof image[0] === 'string' ? `https://mehek-masale.herokuapp.com/image/get?name=${image}`
                    : image[0].uri}} style={{width:'100%',height:300}} /> : 
                <View style={{padding:20,borderWidth:2,borderColor:'#fff',
            alignItems:"center",justifyContent:'center'}}>
                <Icon name="camera-plus-outline" size={35} color="#fff" />  
                <Text style={{color:'#fff',fontSize:20}}>Upload Image</Text>             
                </View>}
            </TouchableOpacity>
            <View style={{marginTop:10,padding:10}}>
                <TextInput placeholder='Item name' value={name}
                 onChangeText={e => setName(e)}
                 style={styles.input} />
                 <TextInput placeholder='Base price' keyboardType='numeric' value={price}
                 onChangeText={e => setPrice(e)}
                 style={styles.input} />
                 <TextInput keyboardType='numeric' placeholder='Base quantity' value={priceBaseVal}
                 onChangeText={e => setPriceBaseVal(e)}
                 style={styles.input} />
                 <TextInput placeholder='Category' value={category}
                 onChangeText={e => setCategory(e)}
                 style={styles.input} />
                 <TouchableOpacity activeOpacity={1} onPress={addItem}>
                 <Text style={{...styles.button,margin:0}}>
                     {_id ? "Update item" : "Add item"}
                </Text>
                 </TouchableOpacity>
                 {_id? <TouchableOpacity activeOpacity={1} onPress={e => {
                     route.params.id = false
                     setPrice('');
                    setImage()
                    setPriceBaseVal('');
                    setName('');
                    setCategory('')
                 }}>
                 <Text style={{...styles.button,margin:0,backgroundColor:'crimson'}}>
                     Cancel
                </Text>
                 </TouchableOpacity>:  null}
            </View>
            </>
        </ScrollView>
        <Animated.View
            style={[{bottom:height,position:'absolute',width:'100%',backgroundColor:'#fff'}]}
        >
            <View style={styles.ButtonSheet}>
                <Text style={styles.header}>Upload Photo</Text>
            <Text style={styles.button} 
            onPress={() => {
                AnimateView()
                onButtonPress('capture', {
                saveToPhotos: true,
                mediaType: 'photo',
                includeBase64: false,
                })}
                } > TakePhoto </Text>
            <Text style={styles.button} 
            onPress={() =>{
                AnimateView()
                 onButtonPress('library', {
                saveToPhotos: true,
                mediaType: 'photo',
                includeBase64: false,
                })}
                } > Choose From Library </Text>
            <Text style={styles.button} onPress={AnimateView}> Cancel </Text>
            </View>
        </Animated.View>
    </View>
    {
            loading ? <View style={{position:'absolute',
            bottom: 0,width:'100%',height:'100%',zIndex:1}} /> : null
        }
    </>
}

const styles = StyleSheet.create({
    button: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        backgroundColor: "#4a3680",
        textAlign: "center",
        padding: 10,
        borderRadius: 10,
        marginBottom:10
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
        padding:15,
        borderTopRightRadius:10,
        borderTopLeftRadius: 10
    },
    header: {
        fontSize:22,
        fontFamily:'sans-serif-medium',
        color: '#000',
        alignSelf:'center',
        marginBottom:10
    },
    input: {
        marginBottom: 25,
        borderWidth: 1,
        borderColor: "#999999",
        fontSize: 20,
        padding: 10,
      },
})
export default AddProducts