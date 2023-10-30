import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

const TutoringTopTabs = ({onPress, selected}) => {
    const screens = ["1 Day Tutoring","30 Days Tutoring"]
    //const [selected, setSelected] = useState(0)
  return (
    
    <View style={styles.container}>
        {
            screens.map((screen, index)=>(
                <TouchableOpacity
                    key={index}
                    onPress={()=>{
                        onPress()
                    }}
                    style={[styles.btnContainer,{backgroundColor: selected == index ?  "#000" : "#fff"}]}
                >
                    <Text style={[styles.labelText,{color: selected == index ? "#fff": "#000"}]}>{screen}</Text>
                </TouchableOpacity>
            ))
        }
        
      
    </View>
  )
}

export default TutoringTopTabs

const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        justifyContent:"center",
        marginTop:10,
        marginBottom:30
    },
    btnContainer:{
        borderRadius:20,
        padding:8,
        margin:3
    },
    labelText:{
        fontWeight:'bold'
    }
})