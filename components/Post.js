import { StyleSheet, Text, View, Image,TouchableOpacity, Dimensions } from 'react-native'
import React, { memo, useCallback } from 'react'
import { Icon } from 'react-native-elements'
import {supabase} from '../supabase/supabase'
import { CDNURL_IMAGES } from '../utils/globalFunctions'



const Post = ({postObj, navigation, currentUserId, screen}) => {
 
  const saveFavorites = async()=>{

    if (postObj.Favorites.length > 0 ){
      const checkLiked = postObj.Favorites.filter((item)=> item.user_id == currentUserId)
      if(checkLiked.length > 0 ){
        //
       
        const {error} = await supabase.from("Favorites")
        .delete()
        .match({
          user_id: currentUserId,
          post_id: postObj.post_id
        })
        return 
      }
    }
   
    const {error} = await supabase.from("Favorites")
       .insert({
         user_id: currentUserId,
         post_id: postObj.post_id
       })
       return 
  }

  const getHeartColor = useCallback(()=>{

    if (postObj.Favorites.length > 0 ){
      const checkLiked = postObj.Favorites.filter((item)=> item.user_id == currentUserId)
      if(checkLiked.length > 0){
        
        return  "red"
      }
    }
    return "#fff"           
  },[postObj.Favorites])
 
  return (
    <View style={styles.postContainer}>

      <TouchableOpacity activeOpacity={0.9} style={styles.imageContainer}
        onPress={()=>navigation.navigate('CheckOut',{postObj, currentUserId})}
      >
        <Image source={{uri: CDNURL_IMAGES + postObj.image_path[0]}} style={styles.imagePost}/>
      </TouchableOpacity>

      <Text style={styles.postName}>
       {
          postObj.title.length > 20 
              ? postObj.title.slice(0, 20) + "..."
              : postObj.title
       }
      </Text>
     
      <View style={styles.postHeadFlex}>
      {screen !== "allStores" && 
        <TouchableOpacity 
            style={styles.heartView}
            onPress={()=>saveFavorites()}
          >
            <Icon
              name='favorite'
              type='material-icon'
              size={25} 
              color={getHeartColor()}
              />
          </TouchableOpacity>
        }
        <View style={styles.priceView}>
          <Text style={[styles.price,{color: postObj.price == "Free" ? "#483" : "#000"}]}>
            {postObj.price == "Free"? "Free" : `R${postObj.price}`}
          </Text>
        </View>
        
      </View>
      
    </View>
  )
}

export default memo(Post)

const styles = StyleSheet.create({
  postContainer:{
    width: Dimensions.get("window").width * 0.49,
    height:240,
    borderWidth:1,
    borderRadius:3,
    marginHorizontal:1,
    marginVertical:2,
  },
  imageContainer:{
    height: '90%',
  },
  priceView:{
    backgroundColor:"#fff",
    paddingHorizontal:2,
    height:20,
    borderRadius:5
  },
  price:{
    fontWeight:"bold",
    fontSize: 16,
  },
  imagePost:{
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
    
  },
  postHeadFlex:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    paddingHorizontal:3,
    width:'100%',
    paddingTop:2
    
  },
  heartView:{
    height:30,
    width:30,
    borderRadius:50,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor:"orange",
    
  },
  postName:{
    marginTop: -0,
    paddingHorizontal: 4,
    fontWeight: '700'
   }
})