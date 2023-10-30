import { StyleSheet, Text, TouchableOpacity,ScrollView, View, Alert, Image } from 'react-native'
import React from 'react'
import { Icon } from 'react-native-elements'
import Purchases from 'react-native-purchases';
import { showToast} from '../utils/globalFunctions';
import { supabase } from '../supabase/supabase';
import Policies from '../components/Policies';
import { updatePurchased } from '../utils/supabaseGlobalFunctions';
import NoDataMessage from '../components/NoDataMessage';

const SellerPayWall = ({route, navigation}) => {

   const {sellerOfferings} = route.params;

   const handlePurchase = async (Package) => {
      // Using Offerings/Packages
      try {
         const {customerInfo, productIdentifier} = await Purchases.purchasePackage(Package);
         if (typeof customerInfo.entitlements.active.Advertising !== "undefined") {
            let intiInfo = customerInfo.entitlements.active.Advertising;

            //TODO: Show loading inticator here
         //Store pachase in database
            await supabase.from("Subscriptions")
            .insert({
               expirationDate: intiInfo.expirationDate,
               type:"Advertising",
               store: intiInfo.store,
               price: Package.product.priceString,
            })

         // make update purchased to true in referrals for referra to earn R10
         await updatePurchased()

         // Unlock that great "pro" content
         navigation.replace("SellerMenu")
         }
      } catch (e) {
         if (!e.userCancelled) {
            showToast("Internal error occurred", "orange")
            return;
         }
         
         showToast("Purchase was cancelled", "orange")
      }

}

   // Restore Purchases
   const restorePurchases = async () => {
      const purchaseInfo = await Purchases.restorePurchases()

      if(purchaseInfo.activeSubscriptions.length > 0){
         Alert.alert("Success", "Your purchase has been restored")
      }else{
         Alert.alert("Subscription Error", "You don't have purchases to restore")
      }
   }
   
   if(!sellerOfferings) return <NoDataMessage message="No Subscription data found, please try again later." />
   
    return (
        <ScrollView contentContainerStyle={styles.container}>

           <View style={{margin:10}}>    
              <Text style={{ alignItems:'center', fontWeight:"bold", fontSize:18, alignSelf:"center"}}>
                 Advertise to your target audience at affordable price
              </Text>
           </View>
           
            <Image 
               source={require("../assets/FlatIcons/social-ad-reach.png")} 
               style={styles.image}
            />
           
            <Text style={styles.benefitsText}>Subscription Benefits: </Text>
           <View style={{padding:5}}>

            <View style={styles.benefitsView}>
               <Icon
                  type='material-icons'
                  name="check-circle"
                  size={32}
                  color='#46dff0'
               />
               <View style={styles.benefitsDetails}>
                  <Text style={styles.bnfSubText}>Wider Reach & Targeted Audience: </Text>
                  <Text style={styles.bnfDescription}>
                  Your Products/Services are Accessible to all students across South Africa.
                  </Text>
               </View>
            </View>
            <View style={styles.benefitsView}>
               <Icon
                  type='material-icons'
                  name="check-circle"
                  size={32}
                  color='#46dff0'
               />
               <View style={styles.benefitsDetails}>
                  <Text style={styles.bnfSubText}>24/7 Availability:</Text>
                  <Text style={styles.bnfDescription}>
                     Your Products/Services can be seen by thousands of students at anytime, increasing exposure.
                  </Text>
               </View>
            </View>
  
            <View style={styles.benefitsView}>
               <Icon
                  type='material-icons'
                  name="check-circle"
                  size={32}
                  color='#46dff0'
               />
               <View style={styles.benefitsDetails}>
                  <Text style={styles.bnfSubText}>Cost-Effective: </Text>
                  <Text style={styles.bnfDescription}>
                     More affordable than traditional advertising methods.
                  </Text>
               </View>
            </View>
           </View>
          {sellerOfferings.map((item, index)=>(
            <TouchableOpacity
               key={index}
               style={styles.offersView}
               onPress={()=>handlePurchase(item)}
            >
               <Text style={{alignItems:'center', fontWeight:'bold', marginBottom:2}}>
                  {item.product.description} 
               </Text>
               <Text>{item.product.priceString}</Text>
               {
                  
                  item.packageType !== "MONTHLY" &&
                  <View style={styles.discountView}>
                     <Text style={styles.discountText}>
                     SAVE {
                              (
                                 (1 -
                                    item.product.price /   
                                    (sellerOfferings[0].product.price * 6)
                                 ) * 100
                              ).toPrecision(2)
                           }% 
                     </Text>
                  </View>
                 
               }
            </TouchableOpacity>
          ))}
           
           <TouchableOpacity style={{margin:5, alignSelf:"center"}} onPress={restorePurchases}>
              <Text style={styles.restoreText}>Restore Purchases</Text>
           </TouchableOpacity>


           <Policies />
        </ScrollView>
     )
}

export default SellerPayWall

const styles = StyleSheet.create({
   container:{
      backgroundColor:'#fff',
      flexGrow:1, 
      paddingHorizontal:5,
      paddingBottom:15,
      paddingTop:8
   },
   benefitsText:{
      margin:10,
      color:"green",
      alignItems:"center",
      fontWeight:'bold',
      fontSize:18
   },
   image:{
      alignSelf:"center",
      resizeMode:"contain",
      width:100,
      height:100
   },
   bnfSubText:{
      fontWeight:"bold",
      fontSize:16,
   },
   bnfDescription:{
      fontSize:16,
   },
   benefitsView:{
      flexDirection:'row',
      alignItems:'center',
      marginBottom:10,
   },
   benefitsDetails:{
      width:"90%",
      marginLeft:4,
   },
   discountView:{
      position:"absolute",
      right:20, top:-18,
      borderRadius:15,
      borderWidth:1,
      backgroundColor:"#e90c59",
      color:"#fff",
      fontWeight:"bold",
      padding:4
   },
   discountText:{
      color:"#fff",
      fontWeight:"bold",
   },
   offersView:{
      borderColor:"#46dff0",
      borderWidth:2,
      alignItems:'center',
      paddingTop:8,
      paddingBottom:4,
      borderRadius:10,
      marginBottom:30,
      elevation:3
   },
   restoreText:{
      marginTop:-15,
      fontSize:17,
      color:"blue",
      alignItems:'center',
      fontWeight:"bold",
      textDecorationLine:"underline"
   },
  
})