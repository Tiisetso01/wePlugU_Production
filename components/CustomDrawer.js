import { StyleSheet, Text, TouchableOpacity, View,Image, Dimensions  } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import {Icon } from 'react-native-elements';
import { supabase } from '../supabase/supabase';
import { fecthInfo, getUserPersonalInfo, realTimeData, uploadImages } from '../utils/supabaseGlobalFunctions';
import { CDNURL_IMAGES, get_random_string, pickImages, showToast } from '../utils/globalFunctions';
import { Modal } from 'react-native';
import SmallButton from './SmallButton';
import * as Clipboard from 'expo-clipboard';

const CustomDrawer = (props) => {
  const [user, setUser] = useState(null)
  const [pickedImage, setPickedImage] = useState([])
  const [modelVisible ,setModelVisible] = useState(false)

  const fetchUserInfo = async()=>{

    const user_id = ((await fecthInfo()).id)

    setUser( await getUserPersonalInfo(user_id))
  }
  const changeProfile = async()=>{
    const image = await pickImages()
    if (image.length == 0 || image == undefined) return
    setPickedImage([image[0]])
    setModelVisible(true)
  }

  const handleSubmit = async()=>{
    let imgFolder = `${user.user_id}/${get_random_string(30)}/`
   const imagePath = await uploadImages(pickedImage, "posts_images", imgFolder)
    
    if(imagePath == undefined) return showToast("Internal Error Occurred", "red")

    const {error} = await supabase.from("Users")
    .update({profile_image: imagePath[0]})
    .eq("user_id", user.user_id)
    //const {error:err} =  await supabase.storage("posts_images").remove([user?.profile_image])

    
    if(!error) {
      setModelVisible(false)
      showToast("Uploaded Successfully", "green")
      return
    }
      return showToast("Internal Error Occurred", "red")
    
  }

  const copyToClipboard = async () => {
        
    await Clipboard.setStringAsync(user.referral_code);
    showToast("copied!!!", 'orange')
  };
  //
  useEffect(()=>{
    realTimeData(fetchUserInfo, "Users")
  },[])
  useLayoutEffect(()=>{
    fetchUserInfo()
  },[])


  return (
    
    <View style={styles.container}>

      <View style={styles.topVeiw}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={
              user?.profile_image !== null 
              ? {uri: CDNURL_IMAGES + user?.profile_image}
              : require("../assets/FlatIcons/user.png")
              
            }
          />
          <TouchableOpacity 
            style={styles.iconView}
            onPress={ async()=> await changeProfile()}
          >
            <Icon type='material-icons' name='add-a-photo' size={30}/>
          </TouchableOpacity>
        </View>
        {/**Use different font family */}
        {
          user != null &&
          
            <Text style={styles.userName}>{`${user?.firstName} ${user?.lastName}`}</Text>
        }
        {
          user != null &&
          <Text style={styles.university}>{`${user?.institution}`}</Text>
          
        }

        
      </View>


      <DrawerContentScrollView
         contentContainerStyle={{flexGrow: 1,marginTop:-26}}
        {...props}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.footer}>

        <View style={{flexDirection:'row',marginBottom:15 }}>
          <Text>referral code: </Text>
          <Text style={styles.referralCode}>
            {user?.referral_code}
          </Text>

          <TouchableOpacity style={{flexDirection:'row', alignItems:'center'}} onPress={()=> copyToClipboard()}>
              <Icon name="clipboard" type='font-awesome-5' size={16}/>
              <Text style={{marginLeft:4, fontWeight:'bold', fontSize:14}}>copy</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutContainer}
          onPress={async()=>{
            await supabase.from("Notifications")
            .update({receiveNotification:false})
            .eq("user_id", user.user_id)
            supabase.auth.signOut()
          }}
        >
          <Icon name="logout" type="font-awosome" size={25}/>
          <Text style={styles.logoutText}>Log Out</Text>
          
        </TouchableOpacity>
      </View>

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

             
              <Image style={styles.pickedImage} source={{uri: pickedImage.length > 0 ? pickedImage[0]?.uri: null}}/>
              <View style={{alignSelf: 'center'}}>
                 <SmallButton title="Save" color="green"
                  onPress={ async()=> await handleSubmit()}
                 />
              </View>
              
             
            </View>
          </View>
          
      </Modal>
      
    </View>
  )
}

export default CustomDrawer;

const styles = StyleSheet.create({
    container:{
      flex: 1,
    },
    topVeiw:{
      height: Dimensions.get('window').height * 0.30,
      backgroundColor:'#eee',
      paddingTop:40,
      alignItems:'center',
      borderRadius:10,
      borderBottomStartRadius: 20,
      borderBottomEndRadius: 20,
    },
    image:{
      width: 100,
      height:100,
      borderRadius:50,
      resizeMode:"contain",
      borderColor:"#03fce3",
      borderWidth:4
    },
    iconView:{
      position:'absolute',
      backgroundColor: "#fff",
      borderRadius: 50,
      padding: 5,
      bottom:-5,
      right: -5,
    },
    pickedImage:{
      width: 250,
      height: 250,
      borderRadius: 10,
      resizeMode:"contain",
      marginBottom: 20,
      alignSelf: 'center'
    },
    centeredView:{
      flex: 1,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor: "rgba(0, 0, 0, 0.5)"
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
      backgroundColor:"red", 
      alignSelf:"flex-end"
    },
    userName:{
      fontSize: 14,
      fontWeight: 'bold',
      marginVertical: 10,
      //color:""
    },
    university:{
      position: 'absolute',
      bottom:4,
      fontSize: 12,
      right: 4,
      color:"grey"
    },
    footer:{
      height: 100,
      padding:10,
      backgroundColor:'#eee',
      borderRadius:10

    },
    referralCode:{
      fontWeight:'bold',
      fontSize:16,
      marginRight:20,
      backgroundColor:'lightgrey',
      paddingHorizontal: 5,
      paddingVertical:2,
      borderRadius:4
  },
    logoutContainer:{
      flexDirection: 'row',
      alignItems: 'center'
    },
    logoutText:{
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 10
    }
})