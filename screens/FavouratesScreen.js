import { StyleSheet, Text, View, FlatList,} from 'react-native'
import React,{ useEffect, useState } from 'react'
import Post from '../components/Post'
import { supabase } from '../supabase/supabase'
import { fecthInfo, realTimeData } from '../utils/supabaseGlobalFunctions'
import { Icon } from 'react-native-elements'
import DualBallLoading from '../components/DualBallLoading'
import { useIsFocused } from '@react-navigation/native'
import NoDataMessage from '../components/NoDataMessage'
import { StatusBar } from 'react-native'



const FavouratesScreen = ({navigation}) => {

  const [postList, setPostList] = useState([]);
  const [currentUserId,  setCurrentUserId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  //const isFocused = useIsFocused;
  useEffect(()=>{
   
    realTimeData(fecthFavorites, "Favorites")
    
  },[])

  useEffect(()=>{
    fecthFavorites()
    
  },[])
  const fecthFavorites = async()=>{
    
    const user_id = (await fecthInfo())?.id
    setCurrentUserId(user_id)

    const { data, error } = await supabase
    .from('Favorites')
    .select(`user_id, post_id, Posts(*, Users(firstName, lastName))`)
    .eq("user_id", user_id)
    
    
    if(!error){
      let newArrData = data.map((item)=>{
        return {...item.Posts, Favorites:[{user_id:item.user_id, post_id:item.post_id}]}
      })
      setIsLoading(false)
      return setPostList(newArrData)
    }
    return 
    
  }
  
  if(isLoading) return <DualBallLoading />
  if(postList.length == 0 ) return <NoDataMessage message="Your saved posts will show here."/>
  return (
    
    <FlatList
      contentContainerStyle={styles.container}
      keyExtractor={(item)=> item.post_id}
      numColumns={2}
      data={postList}
      renderItem={({item:post})=><Post postObj={post} currentUserId={currentUserId} navigation={navigation} /> }
      ListHeaderComponent={
        <View style={styles.headerTop}>
          <Text style={styles.headingText}>Saved Posts</Text>
          <Icon name='favorite' type='material-icon' size={25} color='red' />
        </View>
      }
      
    />
   
  )
}

export default FavouratesScreen

const styles = StyleSheet.create({
  container:{
    flexGrow:1,
    marginTop: StatusBar.currentHeight,
    paddingBottom:8,
  },
  headerTop:{
    flexDirection:'row',
    marginBottom: 20,
    alignItems:'center',
    justifyContent:'center'
  },
  headingText:{
      marginRight:5,
      fontWeight:'bold',
      fontSize:25, 
      color:'green'
  }
})