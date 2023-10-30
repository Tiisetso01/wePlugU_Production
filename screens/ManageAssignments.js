import { StyleSheet,  View,  Alert, FlatList, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import SmallButton from '../components/SmallButton';
import { supabase } from '../supabase/supabase';
import { CDNURL_PDF,   getPdfName,  openPdfFile } from '../utils/globalFunctions';
import SupabaseImageSwiper from '../components/SupabaseImageSwiper';
import DualBallLoading from '../components/DualBallLoading';
import CoursesPostInfo from '../components/CoursesPostInfo';
import { deleteDocumentPost, fecthInfo, realTimeData } from '../utils/supabaseGlobalFunctions';
import DownloadButton from '../components/DownloadButton';
import PDFName from '../components/PDFName';
import NoDataMessage from '../components/NoDataMessage'
import GifButton from '../components/GifButton';

const ManageAssignments = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [isDownloading, setIsDownloading] = useState(false)
 
  const getPosts = async ()=>{

    let user_id = (await fecthInfo()).id
    const { data, error} = await supabase
    .from('Documents')
    .select("*")
    .match({user_id, category: "Assignments"})
    .order("created_at", {ascending: false})
    
    if(!error){
      setPosts(data)
      setIsLoading(false)
      return
    }
    
    Alert.alert("Error Message", "An error occurred while fecthing your posts.")
    return  []
    }

    useEffect(()=>{
      realTimeData(getPosts, "Documents")
    },[])

    useEffect(()=>{
      getPosts();
    },[])

    
  if(isLoading) return <DualBallLoading />
  if(posts.length == 0) return <NoDataMessage message="Your posts will appear here." />
  return (
    
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{backgroundColor:'#DCDCDC'}}
        data={posts}
        keyExtractor={(item)=> item.file_id}
        renderItem={({item:post})=>(
          <View style={styles.cart}>
            <SupabaseImageSwiper image_path={post.image_path} />

            <View style={styles.imageContent}>
              <PDFName
                label={"Open:"} 
                pdfName={getPdfName(post.questionsFileName)} 
                onPress={()=> openPdfFile(post.questionsFilePath, navigation)}
              />
              <DownloadButton 
                isDownloading={isDownloading}
                onPress={async ()=> Linking.openURL(CDNURL_PDF + post.questionsFilePath)}
              />
              {
                post.solutionsFileName.map((solution, index)=>(
                  
                  <GifButton
                    key={index}
                    title={getPdfName(solution)}
                    onPress={()=>openPdfFile(post.solutionsFilePath[index], navigation) }
                  />
                  
                ))    
              }
              <CoursesPostInfo postObj={post}/>
              <View style={styles.submitBtnContainer}>
                <SmallButton title="Delete" color="red" onPress={async()=> await deleteDocumentPost(post)}/>
              </View>
            </View>
         </View> 

        )}
      />
    
    
  )
}

export default ManageAssignments

const styles = StyleSheet.create({

  imageContent:{
    paddingHorizontal:10,
  },
  cart:{
    margin:5,
    padding: 5,
    width:"97%",
    backgroundColor:'#fff',
    borderRadius:10
  },
  label:{ 
    marginBottom:3,
    fontWeight: "500",
    color: '#3399ff',
    fontSize: 18,
  },
  info:{
    width: '100%',
    backgroundColor: '#D1D1D1',
    borderRadius: 8,
    padding: 5,
    marginBottom: 10,
    fontWeight: '700'
  },

  submitBtnContainer:{
    alignSelf:'flex-end',
    marginVertical: 20,
  }
})




