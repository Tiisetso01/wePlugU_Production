import { StyleSheet, View, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase/supabase';
import DualBallLoading from '../components/DualBallLoading';
import { fecthInfo, realTimeData } from '../utils/supabaseGlobalFunctions';
import PromoFieldsInfo from '../components/PromoFieldsInfo';
import NoDataMessage from '../components/NoDataMessage';
import SmallButton from '../components/SmallButton';

const ShowUserPromoHistory = () => {
    
    const [promoData, setPromoData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const getPromoData = async()=>{
        const user_id = (await fecthInfo()).id;

        const {data, error} = await supabase.from("Payments")
        .select("*")
        .match({user_id, userDeleted:false})
        .order("created_at", {ascending: false})
        if(!error){

            setPromoData(data)
            return setIsLoading(false)
        }
    }

    const handleDelete = async(id)=>{
        const {data, error} = await supabase.from("Payments")
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
        realTimeData(getPromoData, "Payments")
    },[])

    useEffect(()=>{
        getPromoData()
    },[])

    if(isLoading) return <DualBallLoading/>

    if(promoData.length == 0) return <NoDataMessage message="Redeems & Payments History will appear here."/>

  return (
   
    <FlatList 
        contentContainerStyle={styles.container}
        data={promoData}
        keyExtractor={(item)=> item.id}
        renderItem={({item})=>(
            <View style={styles.cart}>
                <PromoFieldsInfo
                    status={item.status}
                    amount={item.amount}
                    created_at={item.created_at}
                />
                <View style={styles.submitBtnContainer}>
                    <SmallButton
                        title="Delete"
                        color="red"
                        onPress={()=>{
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
                                    onPress: async() => { await handleDelete(item.id)},
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

export default ShowUserPromoHistory

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
    submitBtnContainer:{
        alignSelf:'flex-end',
        marginVertical:10,
      }
    
})