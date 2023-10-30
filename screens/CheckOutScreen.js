import { StyleSheet, Text, TouchableOpacity, View, ScrollView, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Icon } from 'react-native-elements';
import {supabase} from '../supabase/supabase'
import SupabaseImageSwiper from '../components/SupabaseImageSwiper';
import { showToast } from '../utils/globalFunctions';
import { checkChat,} from '../utils/supabaseGlobalFunctions';

const CheckOutScreen = ({route,navigation}) => {
  const { title, price, image_path, description ,location,post_id, user_id, Favorites, Users} = route.params.postObj;
  const {currentUserId}  = route.params
  const [color, setColor] = useState("")
  
  const saveFavorites = async()=>{

    const {data, error} = await supabase.from("Favorites")
      .select()
      .match({
        user_id: currentUserId,
        post_id
      }) 

      
    if(error) return
    if (data.length > 0 ){
       setColor("#fff")
       const {error} = await supabase.from("Favorites")
        .delete()
        .match({
          user_id: currentUserId,
          post_id
        })
        return 
    }
   
   setColor("red")
  await supabase.from("Favorites")
       .insert({
         user_id: currentUserId,
         post_id
       })
        return 
  }


  const getHeartColor = ()=>{

    if (Favorites.length > 0 ){
      if(Favorites[0].user_id == currentUserId){
        return setColor("red")
      }
    }
    return setColor("#fff")        
  }

  const navigateToChat = async (otherUserId, currentUserId)=>{

    let chat = await checkChat(otherUserId, currentUserId)
    
    if (chat){
      
      if(chat.chatlist_id !== null){
        const {error} = await supabase.from("Messages")
        .update({received: true})
        .match({received: false, chatlist_id: chat.chatlist_id, sender_id: otherUserId})
      }
      navigation.navigate('SingleChat',chat)
    }
 }
  useEffect(()=>{
    
    getHeartColor()
  },[])
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <SupabaseImageSwiper image_path={image_path} />

        <View style={styles.productDetailsView}>


          <View style={styles.productTitleView}>
            <View style={{ width:"90%"}}>
             <Text style={styles.productTitleText}>{title}</Text>
            </View>
            <TouchableOpacity 
               style={styles.heartView}
               onPress={()=> saveFavorites()}
              >
                
              <Icon
                name='favorite'
                type='material-icon'
                size={25} 
                color={color}
                />
            </TouchableOpacity>
            
          </View>


          <View style={styles.productInfo}> 
              <Text style={styles.lable}>Price: </Text>
              <Text style={styles.valueText}>{price == "Free"? "Free": `R${price}`}</Text>
          </View>

          <View style={styles.productInfo}> 
              <Text style={styles.lable}>Location: </Text>
              <Text style={styles.valueText}>{location}</Text>
          </View>

          <View style={styles.contactConatainer}>
              <Text style={styles.InstructionMsg}>message seller: </Text>
              <TouchableOpacity onPress={()=>{
                currentUserId != user_id 
                  ? navigateToChat(user_id, currentUserId)
                  : showToast("You can't message yourself", "orange")
              }}>
                <Text style={styles.username}>{`${Users.firstName} ${Users.lastName}`}</Text>
              </TouchableOpacity>
          </View>
  
          
          <Text style={styles.discriptionText}>Description</Text>
          <View style={{padding:10, borderWidth:0.5, borderRadius:5, backgroundColor: '#eee', marginBottom:20}}>
            <Text style={{fontSize:16}}>{description}</Text>
          </View>         
        </View>
      </ScrollView>
     
    </View>
  )
}

export default CheckOutScreen

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  swiperContainer:{
    marginVertical:10,
    
  },
  imageSwiper:{

    height: 350,
   },
   images:{
     width: 350,
     height: 350,
     resizeMode: 'stretch',
   },
   productDetailsView:{
    paddingHorizontal:10,
   },
  productTitleView:{
    flexDirection:'row',
    alignItems:"center",
    justifyContent: 'space-between',
  },
  productTitleText:{
    fontWeight:'800',
    fontSize: 19,
    
  },
  heartView:{
    height:30,
    width:30,
    borderRadius:50,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor:"orange",
  },
  productInfo:{
    flexDirection: 'row',
    flexWrap:"wrap"
  },
  lable:{
    fontSize: 18,
    fontWeight:'600',
    color: '#3399ff',
  },
  valueText:{
    fontSize: 16,
    fontWeight:'bold'

  },
  contactConatainer:{
    marginVertical: 25,
    flexDirection: 'row',
    flexWrap:'wrap',
    alignSelf:'center',
    padding: 8,
    backgroundColor: "#03fce3",
    borderRadius: 5,
  },
  InstructionMsg:{
    fontSize:16,
  },
  username:{
    textDecorationLine:'underline',
    fontSize:17,
    fontWeight:'bold'
  },
  discriptionText:{
    fontSize: 22,
    fontWeight:'800',
    color: '#3399ff',
  },
  
})