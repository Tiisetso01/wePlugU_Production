import { StyleSheet, Text, View, SafeAreaView,Platform, TouchableOpacity,
   TouchableNativeFeedback, Modal , FlatList, } from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useMemo, useState} from 'react';
import { SearchBar, Icon,Divider,Button, Badge} from 'react-native-elements';
import CategoryItem from '../components/CategoryItem';
import Post from '../components/Post';
import { supabase } from '../supabase/supabase';
import registerForPushNotificationsAsync from '../utils/registerForPushNotificationsAsync';
import { fetchInstitutions } from '../utils/globalFunctions';
import { fecthInfo, getUserPersonalInfo } from '../utils/supabaseGlobalFunctions';
import SmallButton from '../components/SmallButton'
import { SelectList } from 'react-native-dropdown-select-list';
import DualBallLoading from '../components/DualBallLoading';
import { categoriesList } from '../utils/Constants';
import { FlashList } from '@shopify/flash-list';



const HomeScreen = ({navigation}) => {
  const [searchText, setSearchText] = useState("");
  const [postList , setPostList ] = useState([]);
  const [modelVisible ,setModelVisible] = useState(false)
  const [allIntitutions, setAllInstitutions] = useState([]);
  const [institution, setInstitution] = useState("")
  const [userPersonalInfo, setUserPersonalInfo] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState("All")
  const [countedNotifi, setCountedNotifi] = useState(0)
  /**
   * get Products by categories for given institution
   */
  const getCategoryProducts = async(name)=>{
    if(name == "All") return fetchPosts()
    const {data, error} = await supabase.from("Posts")
    .select("*, Favorites(user_id, post_id), Users(firstName, lastName)")
    .or(`and(category.eq.${name}, institutions.cs.{${institution}})`)
    .order("created_at", {ascending: false})
      if(!error) setPostList(data)
  }

  /** Fecth Products */
  const fetchPosts = async ()=>{
    let user_id = (await fecthInfo()).id
    
    let userData = await getUserPersonalInfo(user_id)
  
    let defaultInstitution = userData?.institution
    let institutionPosts = institution ? institution : defaultInstitution;
    const { data, error} = await supabase
    .from('Posts')
    .select("*, Favorites(user_id, post_id), Users(firstName, lastName)")
    .or(`institutions.cs.{${institutionPosts}}`)
    .order("created_at", {ascending: false})
    if(error) return 
    setPostList(data)
    setIsLoading(false)
  }

  /** Get Current User Data */
  const getUserData = async()=>{
    let user_id = (await fecthInfo()).id
    let userData = await getUserPersonalInfo(user_id)
    setInstitution(userData?.institution)
    setUserPersonalInfo(userData)
  }

  /** Search products */
  const searchProducts = async(searchText)=>{
    setIsLoading(true)
    const {data, error} = await supabase.from("Posts")
    .select("*, Favorites(user_id, post_id), Users(firstName, lastName)")
    .or(`title.ilike.%${searchText}%, location.ilike.%${searchText}%, description.ilike.%${searchText}%`)
    .contains("institutions",[institution])
    .order("created_at", {ascending: false})
    //.limit(100)

    setIsLoading(false)
    if(!error) setPostList(data)   
}


  //useEffect(()=>{ realTimeData(fetchPosts, "Posts") },[])
   
  const getInstitutions = async()=>{
    setAllInstitutions(await fetchInstitutions())
  }

  /** SUBSCRIBE TO REAL TIME */
   useEffect(()=>{ 
    const subscribe = supabase.channel('custom-all-channel')
    .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: "Favorites" },
        (payload) => {
          
          fetchPosts();  
        }
    )
    .subscribe()
  
    return ()=>{ supabase.removeChannel(subscribe) }
   
   },[])
  
   /** FETCH DATA IF USER SEARCHES OR SELECT DIFFERENT INSTIUTION*/
  useEffect(()=>{  
   
    if(searchText.length > 0){
      searchProducts(searchText)
    }else{
      if(institution?.length > 0) fetchPosts()
    }
  },[searchText, institution])


useEffect(()=>{
  
  getUserData()
  getInstitutions()
},[])


/** REGISTER PHONE TOKEN FOR NOTIFICATIONS */
const stopLoading = ()=>{
  setIsLoading(false)
}
useEffect(()=>{ 

  registerForPushNotificationsAsync({stopLoading}).then( async(token) => {
  
    let user_id = (await fecthInfo()).id
    const {data, error} = await supabase.from("Notifications")
    .update({token, receiveNotification:true})
    .eq("user_id", user_id)
    .select("notification_id")

    if(!error){
      if(data.length == 0){
        await supabase.from("Notifications")
        .insert({token})
      }
    }
  });
 

},[])

/** COUNT NOTIFICATIONS */
/*const countNotifications = async()=>{
  const {data, error} = await supabase.from("Messages")
  .select("message_id")
  .match({received: false, receiver_id:userPersonalInfo?.user_id})
  if(!error) return setCountedNotifi(data.length)
  
}
*/
  useLayoutEffect(()=>{

    //countNotifications()
    navigation.setOptions({
      title:"",
      //'papayawhip' 
      headerStyle: { backgroundColor: "#61dafb"},
        
      
      headerLeft: ()=>(
          
        <View style={styles.headerContainer}>
            <TouchableNativeFeedback onPress={()=>navigation.openDrawer()}>
              <Icon name='menu' type='material-icons' size={30}/>
            </TouchableNativeFeedback>
      
            <SearchBar
              containerStyle={styles.SearchBarContainer}
              inputContainerStyle={{ borderWidth: 1, height: 35}}
              placeholder="Search Here..."
              lightTheme
              round
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
              autoCorrect={false}
            />
            {/*<TouchableOpacity onPress={()=> navigation.navigate("Notifications")}>
              <Icon name="notifications" type="material-icons" size={30} />
              {
                countedNotifi !== 0 &&
                <Badge containerStyle={{position:'absolute', top: -7, right: -3}} value={countedNotifi} status="error" />
                }
            </TouchableOpacity>*/}
             
        </View>
          
      ),
      
  })  
  },[searchText])

  const memoSetModal = useCallback(()=>{setModelVisible(true)},[])

  if(isLoading) return <DualBallLoading />

  if(postList.length == 0 && searchText.length > 0){
    return (
      <View style={{flex:1, alignItems: 'center', marginTop:40}}> 
          <Text style={styles.feedbackText}>Results not Found.</Text>
      </View>
    )
  }
  return (
   <SafeAreaView style ={styles.container}>

      { 
        searchText.length === 0 &&
          
        <View style={styles.Category}>
          <View style={styles.subHeader}>
            <Text style={styles.CategoriesHeader}>Categories</Text>
            <TouchableOpacity style={styles.openModal}
              onPress={()=> memoSetModal()}
            >
              <Text style={{fontWeight:"bold"}}>institutions</Text>
            </TouchableOpacity>
            
          </View>
          
          
             <FlatList 
                contentContainerStyle={{paddingRight: 10, marginVertical: 3}}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={categoriesList}
                keyExtractor={(item)=> item.categoryName}
                renderItem={({item})=>(
                  <CategoryItem 
                    name ={item.categoryName}
                    image = {item.img} 
                    selected={selected}
                    onPress={()=>{
                      setSelected(item.categoryName)
                      getCategoryProducts(item.categoryName)
                    }} 
                  /> 
                )}
              />

            <Divider size={2}/>
       </View>
        
      }
       
          
      <FlashList
        contentContainerStyle={styles.PostContainer}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={214}
        numColumns={2}
        data={postList}
        renderItem={({item:post})=>(
          <Post 
            screen="home"
            postObj={post} 
            navigation= {navigation} 
            currentUserId = {userPersonalInfo?.user_id}

          />)
        }
      />

      <Modal 
        visible={modelVisible}
        transparent={true}
        animationType='slide'
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
                onPress={()=>setModelVisible(false)}
              style={styles.closeView}
            >
              <Icon type="font-awosome" name='close'/>
            </TouchableOpacity>

            <Text style={styles.infoText}>
              Note : * By default you will see the posts of your current institution which is:
              {"\n"}{<Text style={{color:"green", fontWeight:"bold"}}>{userPersonalInfo?.institution}</Text>}
            </Text>
            
            <Text style={styles.label}>Select Institution you want to see posts for:</Text>
            <SelectList
              defaultOption={{key: userPersonalInfo?.institution, value: userPersonalInfo?.institution}}
              data={allIntitutions}
              save="value"
              setSelected={(val)=> setInstitution(val)} 
            />
          </View>
        </View>
        
    </Modal>
   </SafeAreaView>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  headerContainer:{
    //paddingTop: Platform.OS === 'android' ? 0 : 0,
    flexDirection: 'row',
    alignItems:'center',
    //backgroundColor :'#61dafb',
    flex:1,
    marginLeft:-5
    
  },
  SearchBarContainer: {
      backgroundColor: '#00000000',
      borderTopWidth: 0, 
      borderBottomWidth: 0,
      width:"80%",
      marginLeft:10,
  },
  subHeader:{
    flexDirection:'row',
    justifyContent:"space-between",
    paddingVertical:5,
    paddingHorizontal:10
  },
  openModal:{
    backgroundColor:"orange",
    justifyContent:"center",
    borderRadius:5,
    alignItems:"center",
    width:100
  },
  CategoriesHeader:{
    fontWeight:'700',
    fontSize:22,
 
  },
  seeAllView:{
    flexDirection:'row',
    justifyContent:'flex-end'
    
  },
  CategoryListContainer:{
    flexDirection:'row'
  },
  hr:{
    width: '50%',
    height: 0.5,
    backgroundColor: 'black',
    marginTop: 15,
    marginBottom: 4,
    marginLeft: 6,
    marginRight: 6
},
  PostContainer:{
    //marginTop: 10,
    //paddingBottom:15
  },
  centeredView:{
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  infoText:{
    marginBottom:20,
    color: 'orange',
    marginTop: 15,
  },
  label:{ 
    marginBottom:3,
    fontWeight: "500",
    color: '#3399ff',
    fontSize: 15,
    marginTop: 15,
  },
  modalView:{
    borderRadius:10,
    backgroundColor:"#fff",
    width: "90%",
    paddingTop:10,
    paddingBottom:40,
    paddingHorizontal: 10,
  },
  closeView:{
    borderRadius:50,
    justifyContent:'center',
    alignItems:"center",
    width:40, height:40,
    alignSelf:"flex-end"
  },
  feedbackText:{
  
    fontSize:22,
    fontWeight: 'bold',

}
})