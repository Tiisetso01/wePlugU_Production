import { StyleSheet, Text, View, ScrollView, Alert, FlatList} from 'react-native';
import React, { useEffect, useState } from 'react';
import SmallButton from '../components/SmallButton';
import SupabaseImageSwiper from '../components/SupabaseImageSwiper';
import DualBallLoading from '../components/DualBallLoading';
import { deletePost, getPosts } from '../utils/supabaseGlobalFunctions';
import PostInfo from '../components/PostInfo';
import NoDataMessage from '../components/NoDataMessage';


const ManageProductsScreen = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([]);

    useEffect(()=>{
      const fecthData = async()=>{
        setPosts(await getPosts("sell"))
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
              <SmallButton title="Delete" color="red"
                onPress={()=>{
                    Alert.alert(
                      'Delete Post',
                      `Are you sure you want to delete this post.`,
                      [
                      {
                          text: 'Cancel',
                          onPress: () => null,
                          style:"cancel"
                      },
                      {
                          text: 'Yes',
                          onPress: async() => { setPosts(await deletePost(post))},
                      },
                      ],
                    );
                }}
            
              />
            </View> 
          </View> 
        </View> 
      )}
    />
  )
}

export default ManageProductsScreen

const styles = StyleSheet.create({
  cartContainer:{
    backgroundColor: '#fff',
    margin:5,
    borderRadius:10
  },
  imageContent:{
    paddingHorizontal:10,
  },
  submitBtnContainer:{
    alignSelf:'flex-end',
    marginVertical: 20,
  }
})