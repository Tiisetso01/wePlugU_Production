import { StyleSheet,View, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase/supabase';
import SmallButton from '../components/SmallButton'
import DualBallLoading from '../components/DualBallLoading';
import { realTimeData } from '../utils/supabaseGlobalFunctions';
import { showToast } from '../utils/globalFunctions';
import PromoFieldsInfo from '../components/PromoFieldsInfo';

const ManagePromotions = () => {
    
    const [promoData, setPromoData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const getPromoData = async()=>{
        const {data, error} = await supabase.from("Payments")
        .select("*, Users(*)")
        .eq("status", "pending")
        .order("created_at", {ascending: false})
        if(!error){
            setPromoData(data)
            return setIsLoading(false)
        }
        setIsLoading(false)
        showToast("Internal Error occurred.")
    }
    const handleApprove = async(status, id, referral_code, amount)=>{
 
        const {data, error} = await supabase.from("Payments")
        .update({status})
        .eq("id", id)
        if(error) return 

        //set redemed to true to the users that signed up using referral code of the current user 
        // trying to redeem the money

        //TODO: then send them sms or email
        if(status == "approved"){
            const res = await supabase.from("Referrals")
            .update({isRedemed:true})
            .match({referredBy_code: referral_code, isRedemed:false})
            .order("created_at", {ascending: true})
            .limit(amount/10)
        }
        showToast("Record updated successfully!","green")

    }
    useEffect(()=>{
        realTimeData(getPromoData, "Payments")
    },[])

    useEffect(()=>{
        getPromoData()
    },[])
    if(isLoading) return <DualBallLoading/>
  return (
   
    <FlatList 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        data={promoData}
        keyExtractor={(item)=> item.id}
        renderItem={({item})=>(
            <View style={styles.cart}>
                <PromoFieldsInfo
                    fullName={`${item.Users.firstName} ${item.Users.lastName}`}
                    institution={item.Users.institution}
                    referral_code={item.Users.referral_code}
                    status={item.status}
                    amount={item.amount}
                    created_at={item.created_at}
                />

                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <SmallButton 
                        title="Reject"
                        color="red"
                        onPress={()=>{
                            Alert.alert(
                                'Confirm',
                                `Are you sure you want to reject this request ?`,
                                [
                                {
                                    text: 'Cancel',
                                    onPress: () => null,
                                    style: 'cancel',
                                },
                                {
                                    text: 'YES',
                                    onPress: async()=> await handleApprove("rejected", item.id, item.Users.referral_code, item.amount),
                                },
                                ],
                            );
                        }}

                    />
                    <SmallButton 
                        title="Approve"
                        color="green"
                        onPress={()=>{
                            Alert.alert(
                                'Confirm',
                                `Are you sure you want to approve this request ?`,
                                [
                                {
                                    text: 'Cancel',
                                    onPress: () => null,
                                    style: 'cancel',
                                },
                                {
                                    text: 'YES',
                                    onPress:async()=> await handleApprove("approved", item.id, item.Users.referral_code, item.amount),
                                },
                                ],
                            );
                        }}
                        

                    />
                </View>

            </View>
        )}
    />
  )
}

export default ManagePromotions

const styles = StyleSheet.create({
    container:{
        flexGrow:1,
        backgroundColor:"#DCDCDC",
        padding:5
    },
    cart:{
        marginBottom:5,
        padding: 5,
        width:"100%",
        backgroundColor:'#fff',
        borderRadius:10
    },
    
})