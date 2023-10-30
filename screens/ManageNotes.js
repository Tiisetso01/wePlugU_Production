import { StyleSheet, View, Alert, FlatList, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import SmallButton from '../components/SmallButton';
import { supabase } from '../supabase/supabase';
import { CDNURL_PDF,  getPdfName, showToast } from '../utils/globalFunctions';
import SupabaseImageSwiper from '../components/SupabaseImageSwiper';
import DualBallLoading from '../components/DualBallLoading';
import { deleteDocumentPost, fecthInfo, realTimeData } from '../utils/supabaseGlobalFunctions';
import CoursesPostInfo from '../components/CoursesPostInfo';
import DownloadButton from '../components/DownloadButton';
import PDFName from '../components/PDFName';
import NoDataMessage from '../components/NoDataMessage';


const ManageNotes = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [isDownloading, setIsDownloading] = useState(false)

  const getPosts = async ()=>{

    let user_id = (await fecthInfo()).id
    const { data, error} = await supabase
    .from('Documents')
    .select("*")
    .match({user_id, category: "Notes"})
    .order("created_at", {ascending: false})
    
    if(!error){
      setPosts(data)
      setIsLoading(false)
      return
    }
      return Alert.alert("Error Message", "An error occurred while fecthing your posts.")
  }

    useEffect(()=>{
      realTimeData(getPosts, "Documents")
    },[])

    useEffect(()=>{
      getPosts();
    },[])


  if(isLoading) return (<DualBallLoading />)
  if(posts.length == 0) return <NoDataMessage message="Your Posts will appear here."/>

  return (
    <FlatList
      contentContainerStyle={{backgroundColor:'#DCDCDC', flexGrow:1}}
      data={posts}
      keyExtractor={(item)=> item.file_id}
      renderItem={({item:post})=>(
        <View style={styles.cart}>

          <SupabaseImageSwiper image_path={post.image_path} />
          <View style={styles.imageContent}>
            <PDFName
              label={"Open file:"} 
              pdfName={getPdfName(post.solutionsFileName[0])} 
              onPress={()=>navigation.navigate("PdfViewer",{pdf:post.solutionsFilePath[0]})}
            />
            <DownloadButton
              isDownloading={isDownloading}
              onPress={async ()=> Linking.openURL(CDNURL_PDF + post.solutionsFilePath[0])}
            />

            <CoursesPostInfo postObj={post} />

            <View style={styles.submitBtnContainer}>
              <SmallButton title="Delete" color="red" onPress={async()=> await deleteDocumentPost(post)}/>
            </View>
            
          </View>
        </View> 
      )}
    />
    
  )
}

export default ManageNotes

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
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
  openPdfButton:{
    flexDirection: 'row',
    alignSelf:'center',
    backgroundColor: '#46dff0',
    padding:10,
    borderRadius:5
    
  },
  downloadButton:{
    flexDirection: 'row',
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: "#e90c59",
    height:40,
    borderRadius:5,
    marginVertical:15,
    width: 150
  },
  openText:{
    fontWeight: 'bold',
    
  },
  downloadText:{
    fontWeight: 'bold',
    color:'#eee',
    fontSize:17
  },

  submitBtnContainer:{
    alignSelf:'flex-end',
    marginVertical: 20,
  }
})




