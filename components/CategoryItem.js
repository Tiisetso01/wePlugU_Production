import { StyleSheet, Text, View,TouchableOpacity, Image } from 'react-native'
import React, { memo } from 'react'


const CategoryItem = ({name, image,onPress, selected}) => {
   
  return (
    <TouchableOpacity onPress={onPress} style={styles.CategoryItem}>
        <View 
            style={[
                styles.imageContainer, 
                {
                 borderColor: selected ==name ? "orange": "#000",
                 borderWidth: selected ==name ? 3: 1,
                }
            ]}
        >     
             <Image source={image} style={styles.image}/>
        </View>
        <Text style={{fontWeight: selected ==name ? "bold": "600", }}>{name}</Text>
    </TouchableOpacity>
  )
}

export default memo(CategoryItem)

const styles = StyleSheet.create({
    CategoryItem:{
        alignItems:'center',
        marginLeft:10,
        
    },
    imageContainer:{
        borderRadius: 50,
        width: 65,
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth:2,
    },
    image:{
        width: 50,
        height:50,
        resizeMode:'contain',
    },
    categoryName:{

    }
    
})