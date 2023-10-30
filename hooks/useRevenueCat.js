import { useEffect, useState } from "react"
import { Alert } from "react-native"
import { Platform } from "react-native"
import Purchases from "react-native-purchases"


const useRevenueCat = () => {
   const [offerings, setOfferings] = useState(null) 
   const [customerInfo, setCustomerInfo] = useState(null) 


   useEffect(()=>{
      const fetchData = async () =>{

         /* Enable debug logs before calling `setup`. */
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

         setOfferings(offerings)
         setCustomerInfo(customerInfo)
         }catch (e) {
            Alert.alert("Error", "Failed, Internal Error occurred while fetching subscriptions options for you, try again.")
         }
      }
      fetchData()
   },[])

   /*useEffect(() => {
      const customerInfoUpdated = async (purchaserInfo) =>{
         setCustomerInfo(purchaserInfo)
      }
      Purchases.addCustomerInfoUpdateListener(customerInfoUpdated)
   }, [])*/

   return {
      offerings,
      customerInfo,
   }
}
export default useRevenueCat