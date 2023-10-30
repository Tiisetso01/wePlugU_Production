import { ScrollView, StyleSheet, Alert,Image, Text, View, TouchableOpacity,Button, Platform, Linking  } from 'react-native';
import React, { useEffect, useState } from 'react'
import Purchases from 'react-native-purchases';
import useRevenueCat from '../hooks/useRevenueCat';
import DualBallLoading from '../components/DualBallLoading';
import Policies from '../components/Policies';
import { CDNURL_PDF, showToast } from '../utils/globalFunctions';
import { supabase } from '../supabase/supabase';
import { updatePurchased } from '../utils/supabaseGlobalFunctions';
import { successImage } from '../utils/Constants';
import FeedbackMessageModal from '../components/FeedbackMessageModal';
import WebViewFileDownload from '../components/WebViewFileDownload';
import LoadingIndicator from '../components/LoadingIndicator';
import FlexibleButton from '../components/FlexibleButton';

const CourseMaterialPaywall = ({route, navigation}) => {
    const { pdfPath } = route.params;
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisibleDay, setModalVisibleDay] = useState(false);
    const [modalVisibleMonth, setModalVisibleMonth] = useState(false);
    const messageDay = `If you can't find your file in your folders for some reasons please feel free to email us we will sent it to you: weplugu.help@gmail.com`;
    const messageMonth = `Thank you for your purchase, Now you have access to premium content.`;


   
    const {offerings, customerInfo} = useRevenueCat()
    
    const month = offerings?.all?.course_material.availablePackages;
    const oneTimeDownLoad = offerings?.all?.download_material.availablePackages;
    const downloadPackages = offerings ? [...oneTimeDownLoad, ...month] : [];

    const handlePurchase = async (Package) => {
        // Using Offerings/Packages
        try {
          const {customerInfo, productIdentifier} = await Purchases.purchasePackage(Package);
          setIsLoading(true)
          if(customerInfo && productIdentifier == "wpucm_40_1d"){
            await supabase.from("Subscriptions")
              .insert({
                 expirationDate: new Date(),
                 type:"Course Material",
                 store: Platform.OS == "android" ? "PLAY_STORE" : "APP_STORE",
                 price: Package.product.priceString,
            })

            // make update purchased to true in referrals for referra to earn R10
            await updatePurchased()

            //Done inserting Info
            setIsLoading(false)
            
            //Download Material
            if(Platform.OS == "android"){
              return setModalVisibleDay(true)
            }else{
              Alert.alert(
                'Please Note',
                `Press "Continue" to download your document in a browser.
                If the document does not show for some reasons feel free to email us: weplugu.help@gmail.com`,
                [
                  {
                      text: 'Continue',
                      onPress: () => Linking.openURL(CDNURL_PDF + pdfPath ),
                  },
                ],
              );
            }
            
          }


           if (typeof customerInfo.entitlements.active.course_material !== "undefined") {
              let intiInfo = customerInfo.entitlements.active.course_material;
  
              //TODO: Show loading inticator here
           //Store purchase in database
              await supabase.from("Subscriptions")
              .insert({
                 expirationDate: intiInfo.expirationDate,
                 type:"Course Material",
                 store: intiInfo.store,
                 price: Package.product.priceString,
              })
  
           // make update purchased to true in referrals for referra to earn R10
           await updatePurchased()

           //Done inserting Info
           setIsLoading(false)

           // Unlock that great "pro" content
            setModalVisibleMonth(true)
           
            return
           }

          //Done
            setIsLoading(false)
        } catch (e) {
           if (!e.userCancelled) {
            
              Alert.alert("Error Message" , JSON.stringify(e.message))
              return
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
  if(!offerings) return <DualBallLoading />

  if(isLoading) return <LoadingIndicator message="Please wait..."/>


  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.headerText}>Premium Access</Text>

      <Image 
        source={require("../assets/FlatIcons/documentation.png")} 
        style={styles.image}
      />
      <Text style={styles.description}>
        Pay to download this material {"\n"}
          or {"\n"}
        Subscribe to Unlock all Courses Material offered by wePlugU
      </Text>
      <View style={styles.subscriptionContainer}>
        { 
            downloadPackages.map((item, index)=>(
              <View style={styles.subscriptionCard} key={index}>
                  <Text style={styles.subscriptionTitle}>{item.product.description}</Text>
                  <Text style={styles.subscriptionPrice}>{item.product.priceString}</Text>
                  <FlexibleButton
                      color={ item.packageType != "LIFETIME"? "#E5962D" :"blue"}
                      title={item.packageType == "LIFETIME" ? "BUY NOW" : "Subscribe Now"}
                      onPress={() => handlePurchase(item)}
                  />
              </View>
            ))
        }
      </View>
      <TouchableOpacity style={{margin:5, alignSelf:"center"}} onPress={restorePurchases}>
        <Text style={styles.restoreText}>Restore Purchases</Text>
      </TouchableOpacity>
      <Policies />


      {/** Show this modal after course material purchase*/}
      {
          modalVisibleDay && 
          <WebViewFileDownload
            modalVisible={modalVisibleDay}
            pdfPath={pdfPath}
            onPress={()=>{
              setModalVisibleDay(false)
              //navigation.replace("Assignments")
            }}
            message={messageDay}
          />
      }


      {/** Show this modal after paid subscription for a Month*/}
      <FeedbackMessageModal
        requireImagePath={successImage}
        isModalVisible={modalVisibleMonth}
        onPress={()=>{
          setModalVisibleMonth(false)
          //navigation.replace("Assignments")
        }}
        message={messageMonth}
        ButtonTitle="Okay"
        color="green"
      />
    </ScrollView>
  )
}

export default CourseMaterialPaywall

const styles = StyleSheet.create({
    container:{
        flexGrow: 1,
        backgroundColor:"#fff",
        alignItems:"center",
        paddingHorizontal:5,
        paddingBottom:10
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
      },
      image:{
        resizeMode:"contain",
        width:100,
        height:100
     },
      description: {
        fontSize: 16,
        fontWeight:"bold",
        marginTop: 20,
        marginBottom:50,
        textAlign: 'center',
      },
      subscriptionContainer: {
        marginBottom: 20,
      },
      subscriptionCard: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding:5,
        marginBottom: 10,
        alignItems: 'center',
        elevation: 3,
      },
      subscriptionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      subscriptionPrice: {
        fontSize: 16,
        marginBottom: 10,
      },
      restoreText:{
        fontSize:17,
        color:"blue",
        alignItems:'center',
        fontWeight:"bold",
        textDecorationLine:"underline"
     },
})