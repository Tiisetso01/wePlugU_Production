import { StyleSheet, ScrollView,TouchableNativeFeedback, Platform, Alert} from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Icon } from 'react-native-elements'
import Purchases from 'react-native-purchases';
import SellerMenuItem from '../components/SellerMenuItem';
import DualBallLoading from '../components/DualBallLoading';
import SubscriptionButton from '../components/SubscriptionButton';
//import useRevenueCat from '../hooks/useRevenueCat'
import { supabase } from '../supabase/supabase';
import { fecthInfo } from '../utils/supabaseGlobalFunctions'
const SellerMenu = ({navigation}) => {

    const [sellerOfferings, setSellerOfferings] = useState(null) 
   const [isLoading, setIsLoading] = useState(true)
   const [subscribed, setSubscribed] = useState(false) 
   const [isSuperAdmin, setIsSuperAdmin] = useState(false)
    //const {offerings, customerInfo} = useRevenueCat();

    useLayoutEffect(()=>{
        navigation.setOptions({
            title:"Seller Menu",
            headerTitleAlign: 'center',
            headerStyle: { backgroundColor: "#61dafb", justifyContent:'center'},
            headerLeft: ()=>(
                <TouchableNativeFeedback onPress={()=>navigation.openDrawer()}>
                    <Icon name='menu' type='material-icons' size={30}/>
                </TouchableNativeFeedback>
            )
        })
    },[])
 
    
    const fetchSubcriptionInfo = async () =>{
         
      //setIsLoading(true)
      ///* Enable debug logs before calling `setup`.
      Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

      try {

         if(Platform.OS === "android"){  
           await Purchases.configure({
              apiKey: process.env.googleApiKey
           })
        }else{
           await Purchases.configure({
              apiKey: process.env.appleApiKey
           })
        }

        const offerings = await Purchases.getOfferings()
        const customerInfo = await Purchases.getCustomerInfo()

        if(typeof customerInfo.entitlements.active.Advertising !== "undefined"){
            setSubscribed(true)
        }
        
        /** 
         * I have done this because i im only getting "Advertising Monthly" 
         * When i use offerings.current i can't get "Advertising 6 Month" package
         * */
        
        const adv6Months = offerings.all["Advertising 6 Month"].availablePackages; // array of details about this offering
        const adv1Month = offerings.all["Advertising Monthly"].availablePackages; // array of details about this offering

        if(offerings !== null && adv6Months.length !== 0 && adv1Month.length !== 0 ){

            setSellerOfferings([...adv1Month, ...adv6Months])
        }
        setIsLoading(false)
        } catch (e) {
         Alert.alert("Error", "Failed, Internal Error occurred while fetching subscriptions options for you, try again.")
         setIsLoading(false)
        }
   }

   const checkSuperAdmin = async()=>{
        const email = (await fecthInfo()).email
        const {data, error} = await supabase.from("Admins")
        .select("email")
        .match({ email, isSuperAdmin: true})
     
        if(!error){
            if(data.length > 0){
                return setIsSuperAdmin(true)
            }
        }
   }

   useEffect(()=>{ 
        checkSuperAdmin()
        fetchSubcriptionInfo()
    },[])
   const categories = [
    [
        {text:"Advertise Products/Services", screen: "SellProducts" },
        {text:"Manage Your Posted Products/Services", screen: "ManageProducts" }
    ],
    [
        {text:"Advertise Notes", screen: "UploadNotes" },
        {text:"Manage Notes", screen: "ManageNotes" }
    ],

]
   
 if(isLoading) return <DualBallLoading /> 
  return (
    <ScrollView contentContainerStyle={styles.container}>
         
         <SubscriptionButton
             title="See Subscriptions Plans"
             onPress={()=>navigation.navigate("SellerPayWall", {sellerOfferings})}
         />

        {
            categories.map((itemArr, index)=>(
                
                <SellerMenuItem
                  isSuperAdmin={isSuperAdmin}
                  itemArr={itemArr}
                  isSubscribed ={ subscribed ? true : false}
                  sellerOfferings={sellerOfferings}
                  key={index}
               />
                
            ))
        }
     
    </ScrollView>
  )
}

export default SellerMenu

const styles = StyleSheet.create({
  container:{
    flexGrow: 1,
    backgroundColor: '#DCDCDC',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent:'center'
},
})