import { StyleSheet, Text, View,Image, Keyboard, TouchableOpacity, Alert, Dimensions, TouchableWithoutFeedback, Platform} from 'react-native'
import React,{useState, useCallback, useEffect, useLayoutEffect} from 'react'
import { Icon } from 'react-native-elements';
import { supabase } from '../supabase/supabase';
import createNotification from '../utils/createNotification';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat'
import {  CDNURL_IMAGES, CDNURL_PDF,  getTime, pickDocuments, pickImages } from '../utils/globalFunctions';
import InChatFileTransfer from '../components/InChatFileTranfer';
import DualBallLoading from '../components/DualBallLoading';
import { realTimeData } from '../utils/supabaseGlobalFunctions';
import WebViewFileDownload from '../components/WebViewFileDownload';
import * as Linking from 'expo-linking'

const SingleChat = ({route, navigation}) => {

    let {chatlist_id, otherUserId: receiver_id, currentUserId, fullName, profile_image } = route.params;
    const [imagePath, setImagePath] = useState("");
    const [filePath, setFilePath] = useState('');
    const [modalVisible, setModalVisible] = useState(false)
    const [pdfToView, setPdfToView] = useState(""); // when i click on pdf set pdf path so that i can download it using webview modal

    const [messages, setMessages] = useState([])


  useLayoutEffect(()=>{ 
    navigation.setOptions({
      title:"",
      headerLeft: ()=>(
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.letfItems} onPress={()=> navigation.goBack()}>
            <Icon name='angle-left' type='font-awesome' size={30}/>
            <Image
              style={styles.profileImage}
              source={
                profile_image !== null 
                ? {uri: CDNURL_IMAGES +  profile_image}
                :require("../assets/FlatIcons/user.png")
              }
            />
          </TouchableOpacity>
          <Text style={styles.userNameText}>{fullName}</Text>
        </View>
      )
    })  
      
  },[])


  useLayoutEffect(() => {
    if(chatlist_id != null) fecthMessages()
    
  }, [])

  useEffect(()=>{
    realTimeData(fecthMessages, "Messages")
  },[])

/** Fecth messages from database */
  const fecthMessages = async()=>{

    const {data, error} = await supabase.from("Messages")
    .select('*')
    .or(`and(chatlist_id.eq.${chatlist_id}, and(receiverDeleted.neq.${currentUserId}, senderDeleted.neq.${currentUserId}))`)
    .or(`receiverDeleted.neq.${currentUserId}, senderDeleted.neq.${currentUserId}`)
    .order("createdAt", {ascending: false})
    if(!error && data){
      
      let messagesToDisplay = data.map((item)=>{
          
        return {
          _id: item.message_id,
          text:item.message,
          createdAt: item.createdAt,
          user:{
              _id: item.sender_id,
          },
          image: item.image  ? CDNURL_IMAGES + item.image : "",
          file:{uri: item.file ? item.file : "", name: item.file? item.fileName:""},
          sent: true,
          received: item.received,
        }
      })
      setMessages(messagesToDisplay)
      return 
    }
  }

  /**delete messages */
  const deleteMessage = async(currentMessage)=>{
    if(currentMessage.user._id == currentUserId ){
      /*if(currentMessage.image.length > 0){
        const {error} = await supabase.from("posts_images")
        .remove([currentMessage.image])
      }
      if(currentMessage.file && currentMessage.file.uri){
        const {error} = await supabase.from("pdf")
        .remove([currentMessage.file.uri])
      }*/
      const {error} = await supabase.from("Messages")
      .update({senderDeleted: currentUserId})
      .eq("message_id", currentMessage._id)
      
    }
    else{
      const {error} = await supabase.from("Messages")
      .update({receiverDeleted: currentUserId})
      .eq("message_id", currentMessage._id)
    }
    
    
    
  }
  
  /** Send Messages */
  const sendMessage = async(giftedChatObj, imagePath, filePath ) =>{

      let sender_id = currentUserId

      if (chatlist_id == null) { //start new chat
          
      //create new chatid in the chat table
      const {data, error} = await supabase.from("ChatsList") 
      .insert({sender_id: currentUserId, receiver_id})
      .select("chatlist_id")
      .maybeSingle()
          
      
      //then insert the new message with chat id from chatsList table
      if(!error && data){
          chatlist_id = data.chatlist_id// convert the data into an object
          
          // Send the message and send notification
          const finalValues = {...giftedChatObj, sender_id, receiver_id, chatlist_id }
          await createNotification(finalValues, imagePath, filePath)
      }
      }else{
      //else we have messages 
     
      if(chatlist_id != null && messages.length == 0){ //if these two users had a chat before
        
        // Make the chat list visible for both users if one of them previously deleted the chat
         await supabase.from("ChatsList")
        .update({senderDeletedChat:"", receiverDeletedChat:""})
        .eq("chatlist_id",chatlist_id)
        
    
      }
      const finalValues = {...giftedChatObj, sender_id, receiver_id, chatlist_id }
      
       //Send the message and send notification
      await createNotification(finalValues, imagePath, filePath)
    }
      
  }

  // Scroll to bottom icon
  const scrollToBottomComponent = () => {
    return <Icon type="font-awesome" name="angle-double-down" size={22} color="#333" />;
  };

  /**Render the Bottom send icons and InputBox */
  const renderSend = (props) => {
      return (
        <View style={{flexDirection: 'row', alignItems:'center'}}>
          <TouchableOpacity onPress={async()=>{
            
              setFilePath(await pickDocuments())
              if(filePath) setImagePath("")
            }}
          >
              <Icon
                type="font-awesome"
                name="paperclip"
                style={styles.paperClip}
                size={28}
                color='blue'
              />
          </TouchableOpacity>
          <TouchableOpacity onPress={async()=>{
          
            setImagePath(await pickImages())
            if(imagePath) setFilePath('')

          }}>
              <Icon
                type="material-icon"
                name="image"
                style={{marginRight: 5}}
                size={28}
                color='blue'
              />
          </TouchableOpacity>
          
          <Send {...props}>
            <View style={styles.sendContainer}>
              <Icon
                  type="font-awesome"
                  name="send"
                  style={styles.sendButton}
                  size={25}
                  color='orange'
              />
            </View>
          </Send>
        </View>
      );
  };

  /** Render(Display) Messages*/
  const renderBubble = (props) => {
    const {currentMessage} = props;
    
    if (currentMessage.file && currentMessage.file.uri) {

        let messageSender = props.currentMessage.user._id
        return (
        <View
          style={{ 
            width:"80%",padding:10,
            alignSelf: messageSender === currentUserId ? 'flex-end': 'flex-start',
            borderWidth:0.5,
            backgroundColor: messageSender === currentUserId ? '#0223f5' : '#f50290',
            borderRadius:10,
            borderTopRightRadius: messageSender === currentUserId ? 0: 10,
            borderTopLeftRadius: messageSender === currentUserId ? 10: 0,
          }}
        > 
          <TouchableOpacity
            onPress={() => {
              
              if(Platform.OS == "android"){
                setPdfToView(currentMessage.file.uri)
                setModalVisible(true)
              }else{
                Linking.openURL(CDNURL_PDF + currentMessage.file.uri)
              }
              
            }}
            >
            <InChatFileTransfer
                  style={{marginTop: -10}}
                  pdfName={currentMessage.file.name}
              />
          </TouchableOpacity>
            
            <View style={{flexDirection: 'column'}}>
              <Text style={{fontSize:15,color:"#eee",}} >
                  {currentMessage.text}
              </Text>
              <View style={{
                flexDirection: 'row',
                alignSelf: messageSender === currentUserId
                ?"flex-end":"flex-start"
                ,alignItems:"center"
                  
                }}>
                <Text style={{ fontSize: 10, color:messageSender === currentUserId?"#fff":"grey",marginRight:10}}>
                  {getTime(currentMessage.createdAt)}
                </Text>
                {
                  messageSender === currentUserId &&
                  <Icon type="material-icon" name={currentMessage.received ? "done-all" : "done"} color="#fff" size={16}/>
                }
              </View>
            </View>
        </View>
        );
    }
    
    return (
        <Bubble
        {...props}
        wrapperStyle={{
            right: {
            backgroundColor: '#0223f5',
            },
            left: {
              backgroundColor: '#f50290',
              borderWidth:0.5
            },
        }}
        textStyle={{
            right: {
            color: '#fff',
            },
            left:{
              color:"#fff"
            }
        }}
        />
    );
  };
      
  const renderChatFooter = useCallback(() => {
    
    if (imagePath != "" && imagePath != undefined) {
        let imageUri = imagePath[0].uri
        
      return (
        <View style={styles.chatFooter}>
            <View style={{width:90, height:80}}>
                <Image source={{uri: imageUri}} style={{height: 75, width: 80}} />
                <TouchableOpacity
                    onPress={() => setImagePath('')}
                    style={styles.buttonFooterChat}
                >
                <Text style={{fontWeight:'bold'}}>X</Text>
                </TouchableOpacity>
            </View>
        </View>
      );
    }
    
    if (filePath) {
      
      return (
        <View style={styles.chatFooter}>
          <InChatFileTransfer
            pdfName={ filePath.pdfName}
          />
          <TouchableOpacity
            onPress={() => setFilePath('')}
            style={styles.buttonFooterChat}
          >
            <Text style={styles.textFooterChat}>X</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }, [filePath, imagePath]);

   
  const onSend = useCallback((messages = []) => {
  
    const messageObj = messages[0]
    let {createdAt, text:message, _id:message_id} = messages[0]
    const messageValues = {createdAt, message, message_id}
    
    if (imagePath != "" && imagePath != undefined) {
      const newMessage = {
        ...messageObj,
        image: imagePath[0].uri,
        file: { uri: ''}
      };
      
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, newMessage),
      );
      sendMessage(messageValues, imagePath, null)
      setImagePath('');
      
    }else if (filePath) {
      const newMessage = {
        ...messageObj,
        image: '',
        file: {
          uri: filePath.pdfUri
        }
      };
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, newMessage),
      );
      
      sendMessage(messageValues, null, filePath)
      setFilePath('');
      
    }else {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      );
      sendMessage(messageValues, null , null)
      
    }
    
  }, [imagePath, filePath])
     
  function renderLoading() {
    return (
      <DualBallLoading />
    );
  }
  return (
  <TouchableWithoutFeedback
    style={{flex:1}}
    onPress={()=>Keyboard.dismiss()}
  >
    <View style={{flex:1}}>
      <GiftedChat
          messages={messages}
          renderAvatar={null}
          renderBubble={renderBubble}
          scrollToBottom
          scrollToBottomComponent={scrollToBottomComponent}
          alwaysShowSend
          renderLoading={renderLoading}
          messagesContainerStyle={{backgroundColor:"#fff"}}
          onLongPress={(context,currentMessage)=>{
            Alert.alert(
              "Delete Message",
              "You want to delete this message?",
              [
                {
                  text: 'Cancel',
                  onPress: () => null,
                },
                {
                  text: 'Yes',
                  onPress: async() => { await deleteMessage(currentMessage)},
                },
              ],
              
            )
          }}
          renderSend={renderSend}
          onSend={onSend}
          renderChatFooter={renderChatFooter}
          user={{
              _id: currentUserId,
          }}
      />
      {/** Modal to download file */}
      {modalVisible && <WebViewFileDownload pdfPath={pdfToView} modalVisible={modalVisible} onPress={()=> setModalVisible(false)}/>}
    </View>
   

  </TouchableWithoutFeedback>
    
    
  )
}

export default SingleChat

const styles = StyleSheet.create({
    headerLeft:{
        flexDirection:'row',
        alignItems: 'center',

    },
    letfItems:{
        flexDirection:'row',
        alignItems:'center'
    },
    profileImage:{
        width:40,
        height:40,
        borderRadius: 50,
        marginLeft:10,
        marginRight:15,
        
    },
    userNameText:{
        fontWeight: 'bold'
    },
  
    paperClip:{
        marginHorizontal: 10,
        transform: [{rotateY: '180deg'}],
    },
    sendButton:{
        marginBottom: 10, 
        marginRight: 10
    },
    chatFooter:{
        width: Dimensions.get('window').width * 0.95,
        borderRadius: 10,
        alignSelf: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor:'grey',
        marginBottom:8
    },
    buttonFooterChat:{
        position:'absolute',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:100,
        width: 30, height:30,
        backgroundColor:'orange',
        top:-2, right:0
    },
    

})