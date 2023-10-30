import { StyleSheet, TouchableOpacity,TouchableNativeFeedback , Text, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { Icon } from 'react-native-elements'

const DonationMenu = ({navigation}) => {
    useLayoutEffect(()=>{
        navigation.setOptions({
            title:"Donations Menu",
            headerLeft: ()=>(
                <TouchableNativeFeedback onPress={()=>navigation.openDrawer()}>
                    <Icon name='menu' type='material-icons' size={30}/>
                </TouchableNativeFeedback>
            )
        })
},[])
  return (
    <View style = {styles.container}>

        <View style={styles.category}>
            <TouchableOpacity onPress={()=>navigation.navigate("Donations")} style={styles.cartContainer}>
                <Text style={styles.Text}>Donate Items</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>navigation.navigate("ManageDonations")} style={styles.cartContainer}>
                <Text style={styles.Text}>Manage Donated Items</Text>
            </TouchableOpacity>
        </View>
      
    </View>
  )
}

export default DonationMenu

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#DCDCDC',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent:'center'
},
category:{
    width: "99%",
    height: 110,
    borderWidth: 1,
    borderTopEndRadius: 15,
    borderBottomStartRadius:15,
    marginVertical: 5,
    padding: 5,
},
cartContainer:{
    width: "99%",
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginVertical: 5,
    borderRadius: 5,
},
Text:{
    fontWeight: 'bold'
}
})