import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabase';
import PDFName from '../components/PDFName';
import { getPdfName, showToast } from '../utils/globalFunctions';
import SupabaseImageSwiper from '../components/SupabaseImageSwiper';
import {checkChat, fecthInfo} from '../utils/supabaseGlobalFunctions'
import NoDataMessage from '../components/NoDataMessage';

const NotesScreen = ({navigation, route}) => {
 
  const {categoryMaterial:posts} = route.params;
  const [currentUserId, setCurrentUserId] = useState(null);


  const navigateToChat = async (otherUserId, currentUserId)=>{

    if (otherUserId == currentUserId ) return showToast("You can't message yourself.", "orange")
    let chat = await checkChat(otherUserId, currentUserId)
    
    if (chat) navigation.navigate('SingleChat',chat)
 }
  useEffect(()=>{
    const fecthData = async()=>{
      let user_id = (await fecthInfo()).id
      setCurrentUserId(user_id)
      
    }
    fecthData()
 
  },[])
  if(posts.length == 0) return <NoDataMessage message="No Notes Posts For This Course Yet."/>
  return (
   
      <FlatList
        style={{backgroundColor: "#DCDCDC",}}
        data={posts}
        keyExtractor={(item)=> item.file_id}
        renderItem={({item:post})=>(
          <View style={styles.container}>
            <Text style={styles.sampleText}>Pictures of Sample Notes</Text>
            <SupabaseImageSwiper image_path={post.image_path} />
            <View style={styles.imageContent}>
              
              <Text style = {styles.titleText}>{post.title}</Text>

              {/*<PDFName
                  label={"Open file:"} 
                  pdfName={getPdfName(post.solutionsFileName[0])} 
                  onPress={()=>navigation.navigate("PdfViewer",{pdf:post.solutionsFilePath[0]})}
                />*/}
                <View style={styles.contactConatainer}>
                  <Text style={styles.InstructionMsg}>message seller: </Text>
                  <TouchableOpacity onPress={()=> navigateToChat(post.user_id, currentUserId)}>
                    <Text style={styles.username}>{`${post.Users.firstName} ${post.Users.lastName}`}</Text>
                  </TouchableOpacity>
              </View>

              <View style={styles.priceView}>
                <Text style={styles.label}>File Name: </Text>
                <Text style={{fontWeight:'bold', fontSize: 15}}>{getPdfName(post.solutionsFileName[0])}</Text>
              </View>

              <View style={styles.priceView}>
                <Text style={styles.label}>Price: </Text>
                <Text style={{fontWeight:'bold', fontSize: 18}}>R{post.price}</Text>
              </View>
          
              <Text style={styles.label}>Description</Text>
              <View style = {styles.infoView}><Text style = {styles.info}>{post.description}</Text></View>

            </View>
         </View> 
        )}
      />
   
    
  )
}

export default NotesScreen

const styles = StyleSheet.create({
  container:{
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 5,
    shadowColor:'#000',
    shadowOffset:{
      width: 0,
      height:2
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4

  },
  imageContent:{
    paddingHorizontal:10,
  },
  sampleText:{
    fontWeight: 'bold',
    textAlign:'center',
    marginVertical:5,
  },
Text:{
  fontWeight: 'bold',
  color: '#fff'
},
titleText:{
  fontWeight: 'bold',
  alignSelf: 'center',
  marginBottom: 3
},
contactConatainer:{
    marginVertical: 10,
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
  noPostContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPostText:{
    fontSize: 20,
    fontWeight:'bold'
  },
  label:{ 
    marginBottom:3,
    fontWeight: "500",
    color: '#3399ff',
    fontSize: 18,
  },
  infoView:{
    width: '100%',
    backgroundColor: '#D1D1D1',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical:3,
    marginBottom: 10,
  },
  info:{
    fontSize:16,
  },
  priceView:{
    flexDirection: "row",
    alignItems: 'center'
  }

 
})