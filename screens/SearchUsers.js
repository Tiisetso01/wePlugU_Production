import { ActivityIndicator,  Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SearchBar } from 'react-native-elements'
import { supabase } from '../supabase/supabase'
import { checkChat, fecthInfo, } from '../utils/supabaseGlobalFunctions'

const SearchUsers = ({navigation}) => {
    const [currentUserId, setCurrentUserId] = useState(null);
    const [searchText, setSearchText] = useState('')
    const [searchResults, setSearchResults] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const searchUser = async(searchText)=>{
        setIsLoading(true)
        const {data, error} = await supabase.from("Users")
        .select("firstName, lastName, user_id")
        .or(`firstName.ilike.%${searchText}%, lastName.ilike.%${searchText}%`)
        .neq("user_id", `${currentUserId}`)
        .limit(15)
        setIsLoading(false)
        if(error) return 
        setSearchResults(data)
        
    }
    const navigateToChat = async (otherUserId, currentUserId)=>{
        setIsLoading(true)
        let chat = await checkChat(otherUserId, currentUserId)
        
        if (chat){
            if(chat.chatlist_id !== null){
                const {error} = await supabase.from("Messages")
                .update({received: true})
                .match({received: false, chatlist_id: chat.chatlist_id, sender_id: otherUserId})
              }
            setIsLoading(false)
              navigation.navigate('SingleChat',chat)
        } 
    }
    const fecthUser = async ()=>{
        setCurrentUserId((await fecthInfo())?.id);
    }
    useEffect(()=>{
        navigation.setOptions({
            title:"", 
            headerRight: ()=>(
                <View style={styles.headerLeft}>
                    <SearchBar
                        containerStyle={styles.SearchBarContainer}
                        inputContainerStyle={{ borderWidth: 1, height:35,width: Dimensions.get('window').width * 0.75}}
                        placeholder="Search Users Here..."
                        lightTheme
                        round
                        value={searchText}
                        onChangeText={(text) => setSearchText(text)}
                        autoCorrect={false}
                    />      
            </View>
            )
        })
        
        
    },[searchText])
    useEffect(()=>{fecthUser()},[])
    useEffect(()=>{     
        if(searchText.length > 0){
            
            searchUser(searchText)
        }
    },[searchText])
// Initial Page 
  if(isLoading){
    return <ActivityIndicator  size={30}/>
  }
  if(searchResults.length == 0 && searchText.length > 0){
    return (
        <View style={styles.container}> 
            <Text style={styles.feedbackText}>Results not Found.</Text>
        </View>
    )
  }

  if(searchResults.length > 0 && searchText.length > 0){
    return (
    
        <FlatList
            refreshing={true}
            style={styles.flatListStyle}
            data={searchResults}
            renderItem={({item})=>(
                <TouchableOpacity onPress={async()=> await navigateToChat(item.user_id, currentUserId)}>
                    <View style={styles.namesContainer}>
                        <Text style={styles.namesText}>{`${item.firstName} ${item.lastName}`}</Text>
                    </View>
                    
                </TouchableOpacity>
            )}
            keyExtractor={(item) => item.user_id}
        />
        
    )
  }


  return (
    <View style={styles.container}>
    
        <Text style={styles.feedbackText}>Search for People or Business.</Text>
    </View>
)

    
  
} 

export default SearchUsers

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingTop:15
    },
    flatListStyle:{
        flex: 1,
        backgroundColor:'#fff',
        paddingTop: 15,
        paddingHorizontal: 5
    },
    namesContainer:{
        width: "100%",
        flexDirection:'row',
        alignItems: 'center',
        backgroundColor: "#eee",
        borderRadius: 5,
        marginTop:1,
    },
    namesText:{
        fontWeight: 'bold',
        fontSize: 18,
        height: 40,
        flex:1,
        paddingVertical: 6,
    },
    SearchBarContainer: {
        backgroundColor: '#00000000',
        borderTopWidth: 0, 
        borderBottomWidth: 0,

    },
    feedbackText:{
        alignSelf:'center',
        fontSize:22,
        fontWeight: 'bold',
        marginTop: 15
    }
})