import { StyleSheet, Text, View, TouchableOpacity,  FlatList } from 'react-native'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {Icon} from 'react-native-elements';
import { supabase } from '../supabase/supabase';
import Chat from '../components/Chat';
import { fecthInfo, realTimeData } from '../utils/supabaseGlobalFunctions';
import DualBallLoading from '../components/DualBallLoading';
import NoDataMessage from '../components/NoDataMessage';

const ChatsList = ({navigation}) => {
    
    const [currentUserId, setcurrentUserId] = useState(null);
    const [chatsListData, setChatsListData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    
    const fecthUser = async ()=>{
        setcurrentUserId((await fecthInfo()).id);  
    }
  
  const checkChatsList = async()=>{
    
    let user_id = (await fecthInfo()).id
    const {data, error} = await supabase.from('ChatsList')
    .select(`
      *, Messages(message, createdAt, received, message_id, receiver_id)
    `)
    .or(`sender_id.eq.${user_id}, receiver_id.eq.${user_id}`) // check chat 
    .or(`and(receiverDeletedChat.neq.${user_id}, senderDeletedChat.neq.${user_id})`) //filter more --> user did not delete the chat
    .or(`and(receiverDeleted.neq.${user_id}, senderDeleted.neq.${user_id})`,{foreignTable : "Messages"}) // last message not deleted
    .order('created_at', { ascending: false, })
    .limit(1, {foreignTable: 'Messages'})
    .order("createdAt", {foreignTable: 'Messages', ascending: false})
    

    if(!error){

      setIsLoading(false)
      setChatsListData(data)
      return
    }
    return  
  }


  useEffect(()=>{
    const subscribe = supabase.channel('custom-all-channel')
    .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Messages' },
        (payload) => {
        
          checkChatsList();  
        }
    )
    .subscribe()
  
    return ()=>{ supabase.removeChannel(subscribe) }
   
  },[])

  useLayoutEffect(()=>{
      
    navigation.setOptions({
      
      title:"",
      headerLeft:()=>(
          <Text style={{fontWeight:"bold", fontSize:20}}>Chats</Text>
      ),
      headerRight: ()=>(
          
        <TouchableOpacity style={styles.headerRight} onPress={()=> navigation.navigate("SearchUsers")}>
          <Icon name='users' type='font-awesome' size={20}/>
          <Text> find People </Text>
          <Icon name='search' type='font-awesome' size={20}/>
        </TouchableOpacity>
          
      )
    })
  },[])


  useEffect(() => { 
    checkChatsList();
    fecthUser();
  }, [])
  
  if(isLoading){
    return <DualBallLoading />
  }

  if(chatsListData.length == 0){
    return <NoDataMessage message="No chats yet, search for businesses or people."/>
  } 

  return (
    <View style={styles.container}>
            
      <FlatList
        data={chatsListData}
        renderItem={({item:chatList})=>(
          <Chat 
            chat={chatList}
            currentUserId={currentUserId} 
            navigation={navigation}
            keyExtractor={(item)=> item.chatlist_id}
          />
        )}
        
    />

    </View>
  
  )
}

export default ChatsList

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  headerRight:{
    flexDirection:'row',
    justifyContent: 'center',
    alignItems:'center'
  }
})