import React, { useEffect, useState, memo } from 'react'
import {
    View, Text, TextInput, StyleSheet, StatusBar, TouchableHighlight, VirtualizedList,
    Animated, Image, TouchableOpacity, TouchableWithoutFeedback, ToastAndroid, SafeAreaView, BackHandler
} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Home = ({ navigation, route }) => {
    const items = route.params.items
    const [filterItems, setFilterItems] = useState(items)
    const [selIndex, setSelIndexState] = useState([])
    const [show, setShow] = useState(false)
    const [search, setSearch] = useState('')
    const [category,setCategory] = useState()
    const categoryProducts = route.params.categoryProducts
    const categories = items.reduce((acc,obj) => {
        const key = obj['category']
        if(!acc[key]) acc[key] = []
        acc[key].push(obj)
        return acc
    },{})
    const [height,setHeight] = useState(new Animated.Value(-250)) 
    let height0 = true

    useEffect(() => {
        categoryProducts.push(...items)
    },[])

    if (route.params.orderCompleted) {
        setSelIndexState([])
        route.params.orderCompleted = false
        setShow(false)
    } 

    const filterByCategory = (data) => {
        setFilterItems(data)
    }

    const AnimateView = () => {
        Animated.timing(height,{
            toValue: height0 ? 0 : -250,
            duration: 800,
            useNativeDriver: false
        }).start()
        height0 = !height0
    }

    BackHandler.addEventListener
        ('hardwareBackPress',
            function () { 
            if (search && search.length !== 0) { 
                setSearch(''); searchItems('') 
            }
        })

    const List = ({ x, index }) => {
        const [selected, setSelected] = useState(selIndex.includes(x))
        return (
            <TouchableHighlight underlayColor={selected ? '#f7b3ab' : '#fff'} onPress={e => {
                height0 = false
                AnimateView()
                if (selected) {
                    let ind
                    selIndex.map((p, i) => { if (p._id === x._id) ind = i })
                    selIndex.splice(ind, 1)
                }
                else selIndex.push(x)
                setSelected(!selected)
                if (!show && selIndex.length !== 0) setShow(true)
                if (show && selIndex.length === 0) setShow(false)
            }}
                style={{
                    ...styles.card,
                    backgroundColor: selected ? '#f7b3ab' : '#fff'
                }}>
                <>
                    <Image source={{ uri: `https://mehek-masale.herokuapp.com/image/get?name=${x.image}` }}
                        style={{ height: 300, width: '100%', borderRadius: 20 }} />
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontSize: 20 }}> {x.name} </Text>
                            <Text style={{ fontSize: 20 }}>
                                Price: {x.price} per {x.priceBaseVal >= 1000 ?
                                    `${x.priceBaseVal / 1000}kg` : `${x.priceBaseVal}g`} </Text>
                        </View>
                    </View>
                </>
            </TouchableHighlight>
        )
    }
    const PureList = memo(List)

    const proceedToBuy = () => {
        navigation.navigate({
            name: 'Cart',
            params: {
                items: selIndex
            }
        })
    }

    const searchItems = (val) => {
        if (val && val.length !== 0) {
            const regx = new RegExp(val, "gi")
            setFilterItems(categoryProducts.filter((x, index) => x.name.match(regx)))
        }
        else { setFilterItems(categoryProducts) }
    }

    return (
        <View style={styles.main_div}>
            <StatusBar backgroundColor="#0481eb" />
                <View style={styles.myHeader}>
                    <Icon name='menu'
                        style={{
                            fontSize: 25,
                            marginRight: 10,
                            fontFamily: 'sans-serif-medium'
                        }}
                        onPress={e => {
                            height0 = false
                            AnimateView()
                            route.params.drawer.openDrawer()}}
                    />
                    <TextInput
                    onFocus={e => {
                        height0 = false
                        AnimateView()
                    }}
                        style={{
                            ...styles.input, flex: 1,
                        }}
                        placeholder='Search'
                        placeholderTextColor='#a2a2a2'
                        value={search}
                        onChangeText={e => { setSearch(e); searchItems(e) }}
                    />
                    </View>
                    <View style={{width:'100%',flexDirection:'row',
                    justifyContent:'space-between',padding:8}}>
                    {
                        category ?
                        <View style={{flexDirection:'row',backgroundColor:'#e6a75f',
                        alignItems:'center',padding:2,
                        paddingLeft:10,paddingRight:10,borderRadius:5}}>
                            <Text style={{fontSize:18,marginRight:6}}>
                                {category}
                            </Text>
                            <AntDesign onPress={e => {
                                height0 = false
                                AnimateView()
                                setCategory()
                                setSearch()
                                categoryProducts.splice(0,categoryProducts.length)
                                categoryProducts.push(...items)
                                setFilterItems(items)
                            }} size={20} name='closecircleo' />
                        </View>  : <View />
                    }
                    <Text onPress={AnimateView}
                    style={{textDecorationLine:'underline',fontSize:18}}>
                        Filter
                    </Text>
                    </View>
            <VirtualizedList
                style={{ paddingBottom: 10 }}
                data={filterItems}
                renderItem={({ item }) => <PureList key={item.index.toString()} x={item.x} index={item.index} />}
                keyExtractor={item => item.index.toString()}
                getItemCount={(data) => data.length}
                getItem={(data, index) => ({
                    x: data[index],
                    index
                })}
            />
            {show ?
                <TouchableOpacity activeOpacity={0.6} onPress={proceedToBuy}>
                    <Text style={styles.button}> Buy </Text>
                </TouchableOpacity> : null
            }
            <Animated.View
            style={[{bottom:height,position:'absolute',width:'100%',backgroundColor:'#fff'}]}
        >
            <View style={styles.ButtonSheet}>
                <Text style={styles.header}>Select Category</Text>
                <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                {
                    Object.entries(categories).map(cat => {
                        return (
                            <View key={cat[0]}
                             style={{flexDirection:'row',
                             marginRight:15,
                            marginBottom:10,
                        alignItems:'center'}}>
                            <Text onPress={e => {
                                AnimateView()
                                setCategory(cat[0])
                                setSearch()
                                categoryProducts.splice(0,categoryProducts.length)
                                categoryProducts.push(...cat[1])
                                filterByCategory(cat[1])
                            }}
                             style={{fontSize:16,padding:5,
                             borderRadius:5,backgroundColor:'#e6a75f',}}>
                               {cat[0]}
                            </Text>
                        </View> 
                        )
                    })
                }
                </View>
            </View>
        </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    main_div: {
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
    },
    myHeader: {
        backgroundColor: '#fff',
        flexDirection:'row',
        padding: 10,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#a2a2a2",
        fontSize: 20,
        borderRadius: 5,
        padding: 5
    },
    searchBar: {
        fontSize: 20,
        borderRadius: 5,
        marginBottom: 20,

        flexDirection: 'row',
        alignItems: 'center'
    },
    card: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 3,
        borderRadius: 20,
        marginBottom: 20
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
    button: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        backgroundColor: "green",
        textAlign: "center",
        padding: 10,
        marginTop: 10
    }
})

export default Home
