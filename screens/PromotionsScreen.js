import { StyleSheet, Text, ScrollView, View, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fecthInfo, realTimeData } from '../utils/supabaseGlobalFunctions'
import SmallButton from '../components/SmallButton'
import { TextInput } from 'react-native'
import { supabase } from '../supabase/supabase';
import * as Clipboard from 'expo-clipboard';
import { Divider, Icon } from 'react-native-elements'
import {showToast } from '../utils/globalFunctions'
import DualBallLoading from '../components/DualBallLoading';
import FeedbackMessageModal from '../components/FeedbackMessageModal'
import { successImage } from '../utils/Constants'
import { useIsFocused } from '@react-navigation/native'

const PromotionsScreen = () => {
    const [user, setUser] = useState([])
    const [redeemAmount, setRedeemAmount] = useState("");
    const [isLoading, setIsLoading] = useState(true)
    const [isModalVisible, setIsModalVisible] = useState(false);
 
    const getUserPersonalInfo = async()=>{

        let user_id = (await fecthInfo()).id
        const {data, error} = await supabase.from("Users")
        .select("*, Referrals(id, isRedemed, purchased)")
        .eq("user_id", user_id)
        .single()

        if(!error && data){
            setUser(data)
            return
        } 
    }
    
   
    const handleRedeem = async()=>{
        
        if(redeemAmount == 0 || redeemAmount == "") return showToast("Please enter amount to redeem.", "orange")
        if(!(/^\d+$/).test(redeemAmount)) return showToast("Please enter valid amount.", "orange")
        if(redeemAmount < 50) return showToast("Please redeem R50 or more.", "orange")
        if(calculateAvailableAmount() < redeemAmount) return showToast("Insuficient amount.", "orange")

        const {data, error} = await supabase.from("Payments")
        .insert({amount: redeemAmount})
        if(!error){
            setIsModalVisible(true)
            //Alert.alert("Success Message", "Your request was received, we will contact you via email or through our platform DMs once your request is processed.")
            return setRedeemAmount("")
        } 
        
    }

    const copyToClipboard = async () => {
        
        await Clipboard.setStringAsync(user.referral_code);
        showToast(" Copied!!! ", 'orange')
    };

  const calculateAmountEarned =()=>{
    let referredUsers = user.Referrals
    if( referredUsers.length > 0){
        let purchased =  referredUsers.filter((item)=>{return item.purchased })
        return purchased.length * 10
    }
    return 0
  }

  /** Available amount that user can withdraw */
  const calculateAvailableAmount=()=>{
    let referredUsers = user.Referrals
    if( referredUsers.length > 0){
        let usersNotRedemed =  referredUsers.filter((item)=>{return !item.isRedemed && item.purchased })
        return usersNotRedemed.length * 10
    }
    return 0
  }
  let isFocused = useIsFocused()

  useEffect(()=>{
   
    realTimeData(getUserPersonalInfo, "Referrals")
    
},[])
    useEffect(()=>{
        const fecthData = async()=>{
            await getUserPersonalInfo()
            setIsLoading(false)
        }
        fecthData()
    },[])

  if(isLoading) return <DualBallLoading />
  
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
    
      <View style={styles.cartView}>
        <Text style={styles.header}>Referrals</Text>

        <Divider color='#000' style={{marginVertical:10}}/>

        <View style={styles.info}>
            <Text style={{color: 'red', fontSize:18}}>Important Information !!!</Text>
            <Text style={{fontSize:18}}>
                You earn R10 for each person signing up to our platform using your referral code and buy
                any of our offerings such as (subscribing to advertise their products/services, courses material access Subscription
                buying notes and e.t.c).{"\n"}
                Share your referral code with your friends to earn R10 for each friend you refer and they buy any of our offerings.
                {"\n"}{"\n"}
                <Text style={styles.label}>Here is Your referral code: </Text>
            </Text>
            <View style={{flexDirection:'row', marginTop:5 }}>
                <Text style={styles.referralCode}>
                    {user?.referral_code}
                </Text>

                <TouchableOpacity style={{flexDirection:'row', alignItems:'center'}} onPress={copyToClipboard}>
                    <Icon name="clipboard" type='font-awesome-5' size={16}/>
                    <Text style={{marginLeft:4, fontWeight:'bold', fontSize:14}}>copy</Text>
                </TouchableOpacity>
            </View>
            <FeedbackMessageModal
                requireImagePath={successImage}
                isModalVisible={isModalVisible}
                onPress={()=>setIsModalVisible(false)}
                message="Request was sent successfully, We will contact you via email or through our platform DMs once your request is processed."
                ButtonTitle="Okay"
                color="green"
              />
        </View>


        <Divider color='#000' style={{marginVertical:10}}/>

        
        <View style={styles.info}>
            <Text style={styles.label}>Number of people you referred: </Text>
            <Text style={styles.value}>{(user?.Referrals)?.length}</Text>
        </View>

        <Divider color='#000' style={{marginVertical:10}}/>
        <View style={styles.info}>
            <Text style={styles.label}>Total amount you earned for referrals so far: </Text>
            <Text style={styles.value}>
                {`${(calculateAmountEarned())/10} people purchaced * R10 = R${calculateAmountEarned()}`}
            </Text>
        </View>

        <Divider color='#000' style={{marginVertical:10}}/>

        <Text style={styles.warningText}>* Please note you can redeem minimum of R50 or more *</Text>
        <View style={styles.info}>
            <Text style={styles.label}>Available money to redeem: </Text>
            <Text style={styles.value}>R{calculateAvailableAmount()}</Text>
        </View>

        <Text style={styles.label}>Enter amount you want to redeem: </Text>
        <TextInput style = {styles.inputView}
            value = {redeemAmount}
            keyboardType ='numeric'
            placeholder = 'amount e.g R 120'
            onChangeText={ value => setRedeemAmount(value)}
        />
        <View style={{alignSelf: 'flex-end'}}>
            <SmallButton title='Submit' color='green' onPress={()=> handleRedeem()}/>
        </View>
        
      </View>

    </ScrollView>
  )
}

export default PromotionsScreen

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
        marginBottom:5,
        fontSize:30,
    },
    referralCode:{
        fontWeight:'bold',
        marginRight:40,
        backgroundColor:'lightgrey',
        paddingHorizontal: 20,
        paddingVertical:5,
        borderRadius:4
    },
    label:{
        fontWeight:'800',
        fontSize:16
    },
    value:{
        fontSize:20
    },
    info:{
        marginBottom:10
    },
    warningText:{
        color:'yellow',
        backgroundColor:'grey',
        padding:4,
        marginTop:20,
        marginBottom:10,
        borderRadius:5
    },
    inputView:{
        width: '100%',
        height: 40,
        backgroundColor: '#f1f3f6',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom:10,
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