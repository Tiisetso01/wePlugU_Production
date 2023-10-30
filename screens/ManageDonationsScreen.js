import { StyleSheet, View, FlatList} from 'react-native';
import React, { useEffect, useState } from 'react';
import SmallButton from '../components/SmallButton';
import { deletePost, getPosts, realTimeDataParam } from '../utils/supabaseGlobalFunctions';
import SupabaseImageSwiper from '../components/SupabaseImageSwiper';
import DualBallLoading from '../components/DualBallLoading';
import PostInfo from '../components/PostInfo';
import NoDataMessage from '../components/NoDataMessage';

const ManageDonationsScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);


    useEffect(()=>{   
      const fecthData = async()=>{
        setPosts(await getPosts("donate"))
        setIsLoading(false)
      }
      fecthData()
    },[])


  if(isLoading) return <DualBallLoading />
  if(posts.length == 0) return <NoDataMessage message="Your Posts will appear here."/>

  return (
    <FlatList
      contentContainerStyle={{backgroundColor:"#DCDCDC", flexGrow:1}}
      data={posts}
      keyExtractor={(item)=> item.post_id}
      renderItem={({item:post})=>(
        <View style={styles.cartContainer}>

          <SupabaseImageSwiper image_path={post.image_path} />

          <View style={styles.imageContent}>
            <PostInfo postObj={post} />

            <View style={styles.submitBtnContainer}>
              <SmallButton title="Delete" color="red" onPress={async()=> setPosts(await deletePost(post))}/>
            </View> 
            
          </View> 
        </View> 
      )}
    />
    
  )
}

export default ManageDonationsScreen

const styles = StyleSheet.create({
  imageContent:{
    paddingHorizontal:10,
  },
  submitBtnContainer:{
    alignSelf:'flex-end',
    marginVertical: 20,
  },
  cartContainer:{
    margin:5,
    padding: 5,
    width:"97%",
    backgroundColor:'#fff',
    borderRadius:10
  },
})