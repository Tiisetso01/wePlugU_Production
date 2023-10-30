import { StyleSheet, Text, View, SafeAreaView, ScrollView, FlatList } from 'react-native';
 import React, {useEffect, useLayoutEffect, useState} from 'react';
 import { SearchBar, Icon,Divider} from 'react-native-elements';
 import CategoryItem from '../components/CategoryItem';
 import Post from '../components/Post';
 import { supabase } from '../supabase/supabase';
 import { fecthInfo, getCurrentUserId, realTimeData } from '../utils/supabaseGlobalFunctions';
 import DualBallLoading from '../components/DualBallLoading';
 import NoDataMessage from '../components/NoDataMessage'
import { categoriesList } from '../utils/Constants';
import { FlashList } from '@shopify/flash-list';
 
 const AllStoresScreen = ({navigation}) => {
   const [searchText, setSearchText] = useState("");
   const [postList , setPostList ] = useState([]);
   const [currentUserId, setCurrentUserId] = useState("")
   const [isLoading, setIsLoading] = useState(true)
   const [selected, setSelected] = useState("All")
   /**
    * get Products by categories for given institution
    */
   const getCategoryProducts = async(name)=>{
     if(name == "All") return fetchPosts()
     const {data, error} = await supabase.from("Posts")
     .select("*, Favorites(user_id, post_id), Users(firstName, lastName)")
     .eq("category", name)
     .order("created_at", {ascending: false})
       setPostList(data)
   }
 
   /** Fecth Products */
   const fetchPosts = async ()=>{
    
    let user_id = (await fecthInfo()).id
    setCurrentUserId(user_id)
     const { data, error} = await supabase
     .from('Posts')
     .select("*, Favorites(user_id, post_id), Users(firstName, lastName)")
     .order("created_at", {ascending: false})
     setPostList(data)
     setIsLoading(false)
   }
 
   
 
   /** Search products */
   const searchProducts = async(searchText)=>{
     setIsLoading(true)
     const {data, error} = await supabase.from("Posts")
     .select("*, Favorites(user_id, post_id), Users(firstName, lastName)")
     .or(`title.ilike.%${searchText}%, location.ilike.%${searchText}%, description.ilike.%${searchText}%`)
     .order("created_at", {ascending: false})
     .limit(50)
     setIsLoading(false)
     setPostList(data)   
 }


 /** FETCH DATA IF USER SEARCHES OR SELECT DIFFERENT INSTIUTION*/
   useEffect(()=>{  
    
     if(searchText.length > 0){
       searchProducts(searchText)
     }else{
        fetchPosts()
     }
   },[searchText])

 
    /** HEARDER */
   useLayoutEffect(()=>{

     navigation.setOptions({
       title:"",
       //'papayawhip' 
       headerStyle: { backgroundColor: "#61dafb"},
       headerLeft: ()=>(
        <View style={styles.headerContainer}>
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
        </View>
       ),
    })  
  },[searchText])

 
 
   if(isLoading) return <DualBallLoading />
 
   if(postList.length == 0 && searchText.length > 0){
     return <NoDataMessage message="No Posts Data Found"/>
   }

   
   return (
    <SafeAreaView style ={styles.container}>
 
      { 
        searchText.length === 0 &&
        <View style={styles.Category}>
          <View style={styles.subHeader}>

            <Text style={styles.CategoriesHeader}>Categories</Text>
            <View style={styles.openModal}>
              <Text style={{fontSize:10, color:"grey"}}>All institution's Products & Services</Text>
            </View>
            
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
        numColumns={2}
        data={postList}
        estimatedItemSize={214}
        renderItem={({item:post})=>(
          <Post 
            screen="allStores"
            postObj={post} 
            navigation= {navigation} 
            currentUserId = {currentUserId}
          />)
        }
      />
    </SafeAreaView>
   )
 }
 
 export default AllStoresScreen;
 
 const styles = StyleSheet.create({
   container:{
     flex:1,
   },
   headerContainer:{
     flexDirection: 'row',
     alignItems:'center',
     flex:1,
     marginLeft:-5
   },
   SearchBarContainer: {
      backgroundColor: '#00000000',
      borderTopWidth: 0, 
      borderBottomWidth: 0,
      width:"90%",
      
   },
   subHeader:{
     flexDirection:'row',
     justifyContent:"space-between",
     paddingVertical:5,
     paddingHorizontal:10
   },
   openModal:{
     justifyContent:"center",
     alignItems:"center",
    
   },
   CategoriesHeader:{
     fontWeight:'700',
     fontSize:22,
  
   },
 
   CategoryListContainer:{
     flexDirection:'row'
   },
 
   PostContainer:{
     marginTop: 10,
     paddingBottom:15
   },
  
  
 })