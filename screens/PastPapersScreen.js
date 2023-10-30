import { StyleSheet, Text, View, FlatList,} from 'react-native';
import React, { useEffect, useState } from 'react';
import PDFName from '../components/PDFName';
import { getPdfName } from '../utils/globalFunctions';
import {checkChat,  fecthInfo} from '../utils/supabaseGlobalFunctions'
import SmallButton from '../components/SmallButton';
import NoDataMessage from '../components/NoDataMessage';

const PastPapersScreen = ({navigation, route}) => {
 
  const {categoryMaterial:posts} = route.params;
  const [currentUserId, setCurrentUserId] = useState(null);


  const navigateToChat = async (otherUserId, currentUserId)=>{

    let chat = await checkChat(otherUserId, currentUserId)
    
    if (chat &&  otherUserId != currentUserId ) navigation.navigate('SingleChat',chat)
 }
  useEffect(()=>{
    const fecthData = async()=>{
      let user_id = (await fecthInfo()).id
      setCurrentUserId(user_id)
      
    }
    fecthData()
 
  },[])

  const openSolutions = async(solutionsFilePath)=>{
    navigation.navigate("PdfViewer",{pdf: solutionsFilePath})
  }


  const downloadSolutions = async(solutionsFilePath, solutionsFileName)=>{

    await downloadFiles(solutionsFilePath,solutionsFileName)
  }

  
  if(posts.length == 0) return <NoDataMessage message="No Notes Posts For This Course Yet."/>
  return (
    
      <FlatList
        style={{backgroundColor: "#DCDCDC",}}
        data={posts}
        keyExtractor={(item)=> item.file_id}
        renderItem={({item:post})=>(
          <View style={styles.container}>
            {/*<Text style={styles.sampleText}>Pictures of Sample Solutions</Text>
            <SupabaseImageSwiper image_path={post.image_path} />*/}
            
            <View style={styles.imageContent}>
              
              <Text style = {styles.titleText}>{post.title}</Text>

              {/**Each university, department should have some one responding to messages and managing */}
              {/*<View style={styles.contactConatainer}>
                  <Text style={styles.InstructionMsg}>message seller: </Text>
                  <TouchableOpacity onPress={()=> navigateToChat(post.user_id, currentUserId)}>
                    <Text style={styles.username}>{`${post.Users.firstName} ${post.Users.lastName}`}</Text>
                  </TouchableOpacity>
              </View>*/}

              
              <Text style={styles.label}>Questions Paper: </Text>
              <PDFName
                label={"Open file:"} 
                pdfName={getPdfName(post.questionsFileName)} 
                onPress={()=>navigation.navigate("PdfViewer",{pdf:post.questionsFilePath})}
              />
              
              <Text style={[styles.label,{marginTop:10}]}>Solutions: </Text>
              {
                post.solutionsFileName.map((solution, index)=>(
                  
                  <View style={{marginBottom:7}} key={index}>
                    <PDFName 
                      label={"Open file:"}  
                      pdfName={getPdfName(solution)} 
                      onPress={()=>{
                        navigation.navigate("PdfViewer",{pdf:post.solutionsFilePath[index]})
                      }}
                    />
                    
                  </View>
                ))    
              }

              <View style={styles.priceView}>
                <Text style={styles.label}>Price: </Text>
                <Text style={{fontWeight:'bold', fontSize: 18}}>R{post.price}</Text>
              </View>
          
              <Text style={styles.label}>Description</Text>
              <View style = {styles.infoView}><Text style = {styles.info}>{post.description}</Text></View>
              
              <View style={{alignSelf:'center', marginBottom:10}}>

                <SmallButton
                 title="Request for help"
                 color="blue"
                 onPress={()=> navigation.navigate("TutoringRequest", {fileInfo: post})}
                /> 
              </View>
              
            </View>
         </View> 
        )}
      />
   
  )
}

export default PastPapersScreen

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