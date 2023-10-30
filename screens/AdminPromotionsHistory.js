import { StyleSheet, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase/supabase';
import DualBallLoading from '../components/DualBallLoading';
import { realTimeData } from '../utils/supabaseGlobalFunctions';
import PromoFieldsInfo from '../components/PromoFieldsInfo';
import NoDataMessage from '../components/NoDataMessage';

const AdminPromotionsHistory = () => {
    
    const [promoData, setPromoData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const getPromoData = async()=>{
        const {data, error} = await supabase.from("Payments")
        .select("*, Users(*)")
        .neq("status", "pending")
        .order("created_at", {ascending: false})
        if(!error){
   
            setPromoData(data)
            return setIsLoading(false)
        }
        setIsLoading(false)
        showToast("Internal Error occurred.")
    }
   
    useEffect(()=>{
        realTimeData(getPromoData, "Payments")
    },[])

    useEffect(()=>{
        getPromoData()
    },[])

    
    if(isLoading) return <DualBallLoading/>
    if(promoData.length== 0) return <NoDataMessage message="Redeem Requests History will appear here."/>
    
  return (
   
    <FlatList 
        contentContainerStyle={styles.container}
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

            </View>
        )}
    />
  )
}

export default AdminPromotionsHistory

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