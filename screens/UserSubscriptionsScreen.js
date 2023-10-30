import { StyleSheet, Text, ScrollView, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fecthInfo, realTimeData } from '../utils/supabaseGlobalFunctions'
import SmallButton from '../components/SmallButton'
import { supabase } from '../supabase/supabase';
import {showToast } from '../utils/globalFunctions'
import DualBallLoading from '../components/DualBallLoading';
import SubscriptionFieldsInfo from '../components/SubscriptionFieldsInfo';
import NoDataMessage from '../components/NoDataMessage';

const UserSubscriptionsScreen = () => {
  
    const [promoData, setPromoData] = useState([]);
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [isLoading, setIsLoading] = useState(true)

    /** Get user subscription data */
    const getSubscriptions= async()=>{
        
        let user_id = (await fecthInfo()).id
        const {data, error} = await supabase.from("Subscriptions")
        .select("id, purchaseDate, expirationDate, price, type")
        .match({user_id, userDeleted:false})
        .order("purchaseDate", {ascending: false})

        if(!error) return setSubscriptionData(data)
        
        showToast("Internal Error occurred.")
    }
    const handleDeleteSubscription = async(id)=>{
        const {data, error} = await supabase.from("Subscriptions")
        .update({userDeleted:true})
        .eq("id", id)
        //.select("user_id")

        if(!error){
            //setSubscriptionData(data)
            //getSubscriptions(data[0].user_id)
            return showToast("Deleted Successfully", "green")
        } 
        //
    }

  
   
  useEffect(()=>{
   
    realTimeData(getSubscriptions, "Subscriptions")
    
},[])
    useEffect(()=>{
        const fecthData =()=>{
            
            getSubscriptions()
            setIsLoading(false)
        }
        fecthData()
    },[])

  if(isLoading) return <DualBallLoading />
  if(subscriptionData.length == 0) return <NoDataMessage message="Your subscriptions info will show here."  />
  
  
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>


        {/** SUBSCRIPTIONS */}
        <View style={styles.cartView}>
            <Text style={styles.header}>Subscriptions</Text>
            {
                (subscriptionData.length > 0) &&
                
                    subscriptionData.map((item, index)=>(
                        <View style={styles.subCartView} key={index}>
                            <SubscriptionFieldsInfo
                                purchaseDate={item.purchaseDate}
                                expirationDate={item.expirationDate}
                                price={item.price}
                                type={item.type}
                            />
                            <View style={styles.submitBtnContainer}>
                                <SmallButton 
                                    title="Delete"
                                    color="red"
                                    onPress={async()=>{
                                        Alert.alert(
                                            'Delete',
                                            `Are you sure you want to delete this items.`,
                                            [
                                            {
                                                text: 'Cancel',
                                                onPress: () => null,
                                                style: 'cancel',
                                            },
                                            {
                                                text: 'Yes',
                                                onPress: async() => { await handleDeleteSubscription(item.id)},
                                            },
                                            ],
                                        );
                                    }}
                                />
                            </View>

                        </View>
                    ))
                  
            }
            

        </View>
       
     

    </ScrollView>
  )
}

export default UserSubscriptionsScreen 

const styles = StyleSheet.create({
    container:{
        flexGrow:1,
        backgroundColor:"#DCDCDC",
        padding:5,
    },
    cartView:{
        padding:5,
        backgroundColor:"#fff",
        borderRadius:20,
        marginBottom:30
    },
    header:{
        fontWeight:'bold',
        fontSize:30,
        alignSelf:"center",
        marginTop:5,
        marginBottom:15
    },
    subCartView:{
        borderWidth:0.5,
        //borderColor:"#ccc",
        backgroundColor:'#fff',
        marginBottom:5,
        padding:2,
        borderRadius:10
    },
    noDataText:{
        fontSize:16,
        fontWeight:"bold",
        alignSelf:"center"
    },
    submitBtnContainer:{
        alignSelf:'flex-end',
        marginVertical:10,
      }
})