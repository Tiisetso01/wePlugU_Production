import { StyleSheet, Text, View,TouchableOpacity, Image ,Alert, Modal } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import { supabase } from '../supabase/supabase'
import { Icon } from 'react-native-elements'
import { getUserPersonalInfo } from '../utils/supabaseGlobalFunctions';
import { CDNURL_IMAGES, getTime } from '../utils/globalFunctions';
import LoadingIndicator from './LoadingIndicator';


const Chat = ({currentUserId,chat, navigation}) => {

    const otherUserId = chat.sender_id  == currentUserId ? chat.receiver_id : chat.sender_id
    const chatlist_id  = chat.chatlist_id
    const [user, setUser] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)

    // Get last message inside message Array
    const lastMessage = chat.Messages.length > 0 ? chat.Messages[0] : {}
    
    //This object is used in Single chat screen
    const chatInfo = {
        currentUserId,
        otherUserId,
        chatlist_id,
        fullName: `${user?.firstName} ${user?.lastName}`,
        profile_image: user?.profile_image,
       
    }

    const getFullName = async(otherUserId )=>{
        let data = (await getUserPersonalInfo(otherUserId))
        setUser(data)
    }
    
    useEffect(()=>{
        
        const fecthData = async()=>{
            await getFullName(otherUserId)
        }
        fecthData()
    },[otherUserId])


    // Mark the chat and messages deleted
    const deleteChat = async(chatlist_id)=>{
        // Mark chat as deleted

        setModalVisible(true)
        
        // hide the chat for the person deleting this chart
        let toUpdate =  chat.sender_id  == currentUserId 
                        ? {senderDeletedChat: currentUserId}
                        :{receiverDeletedChat: currentUserId}
        
        
        // Mark each message as deleted where i am the receiver
         await supabase.from("Messages")
        .update({receiverDeleted: currentUserId})
        .match({chatlist_id,receiver_id: currentUserId })

        // Mark each message as deleted where i am the sender
        await supabase.from("Messages")
        .update({senderDeleted: currentUserId})
        .match({chatlist_id, sender_id: currentUserId })

        // Mark chatList deleted last for incase something goes wrong
        const {error} = await supabase.from("ChatsList")
        .update(toUpdate)
        .eq("chatlist_id", chatlist_id)

        setModalVisible(false)
        
        
    }

    const navigationToChat = async(chatInfo)=>{
        if(lastMessage.received == false && lastMessage.receiver_id == currentUserId){
            const {error} = await supabase.from("Messages")
            .update({received: true})
            .match({received: false, chatlist_id}) // when opening the a chat mark rows not read to read
        }
        navigation.navigate('SingleChat',chatInfo)
    }

  return (
    
    
    <TouchableOpacity
        style={styles.chatContainer}
      
        onPress={async()=> await navigationToChat(chatInfo)}
        onLongPress={()=>{
            Alert.alert(
                'Delete Chat?',
                `Do you want to delete ${user?.firstName} ${user?.lastName}'s chats?`,
                [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: async() => { await deleteChat(chatlist_id)},
                },
                ],
            );
        }}
    >  
        <View >
            <Image
                style={styles.profilePic}
                source={
                    user?.profile_image !== null 
                    ? {uri: CDNURL_IMAGES + user?.profile_image}
                    : require("../assets/FlatIcons/user.png")
                    
                }
            />
            
            {   
                (!lastMessage?.received) && lastMessage?.receiver_id == currentUserId 
                 && <View style={styles.dot}></View>
            }
        </View>
        
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between',}} >   
                {
                    user &&
                    <Text style={styles.userName}>{`${user?.firstName} ${user?.lastName}`}</Text>
                }
           
                <Text style={{ fontSize: 14 }}>
                    {getTime(lastMessage?.createdAt)}
                </Text>
            </View>
            <View style={styles.bottomChatView}>
                <Text
                style={{
                    fontWeight: 'normal',
                    fontSize: 16,
                }}
                >
                 {
                    lastMessage?.message?.length > 25
                        ? lastMessage?.message?.slice(0, 25) + "..."
                        : lastMessage?.message
                 }
                </Text>
                
                <Icon 
                    name={
                        lastMessage?.received 
                        ? 'done-all': 'done'
                    }
                    type='material-icons' 
                    size={16} 
                    color='#3c40c6' 
                />
            </View>
        </View>
        <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
        >
            <LoadingIndicator message="Deleting the chat please wait..."/>

        </Modal>
        
    </TouchableOpacity>
   
        
    
    
  )
}

export default memo(Chat)

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    chatContainer:{
        marginTop: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fafafa',
        borderBottomWidth: 1,
        borderBottomColor: '#dfe4ea',        
    },
    profilePic:{
        width: 60,
        height: 60,
        resizeMode:"contain",
        borderRadius: 100,
        borderWidth:1,
        borderColor: '#3c40c6'
    },
    dot:{
        padding:6,
        borderRadius:7,
        position:"absolute",
         top:2,left:2,
         backgroundColor: "red"
    },
    userName:{
        fontWeight: 'bold',
        fontSize: 18,
    },
    bottomChatView:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
})