import { StyleSheet, Text,TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const CategoryCourses = ({itemArr}) => {
    const navigation = useNavigation()
  return (
    <View style={styles.category} >
        <TouchableOpacity onPress={()=>navigation.navigate(itemArr[0].screen)} style={styles.item}>
            <Text style={styles.Text}>{itemArr[0].text}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>navigation.navigate(itemArr[1].screen)} style={styles.item}>
            <Text style={styles.Text}>{itemArr[1].text}</Text>
        </TouchableOpacity>
    </View>
  )
}

export default CategoryCourses

const styles = StyleSheet.create({
    category:{
        width: "99%",
        height: 110,
        borderWidth: 1,
        borderTopEndRadius: 15,
        borderBottomStartRadius:15,
        marginVertical: 5,
        padding: 5,
    },
    item:{
        width: "99%",
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginVertical: 5,
        borderRadius: 5,
    },
    Text:{
        fontWeight: 'bold'
    }
})