import { StyleSheet, Text, View, FlatList, Alert} from 'react-native';
import React, { useEffect, useState } from 'react';
import SmallButton from '../components/SmallButton';
import DualBallLoading from '../components/DualBallLoading';
import NoDataMessage from '../components/NoDataMessage';
import { supabase } from '../supabase/supabase';
import { showToast } from '../utils/globalFunctions';
import { realTimeData, updatePurchased } from '../utils/supabaseGlobalFunctions';
import TutoringRequestInfoFields from '../components/TutoringRequestInfoFields';


const ManageTutoringRequests = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [requestsData, setRequestsData] = useState([]);
  

  const fecthData = async()=>{
    const {data, error} = await supabase.from("TutoringRequests")
    .select("*, Users(firstName, lastName,institution, email, phone), Documents(questionsFileName)")
    .match({isDeleted: false, attended: false})
    .order("created_at", {ascending: false})
    if(!error){ 
        setRequestsData(data)
        return setIsLoading(false)
    }
    setIsLoading(false)
    showToast("Internal Error occurred.")
  }


  const handleMatter = async(id, needUpdate)=>{

    // make update purchased to true in referrals for referra to earn R10
    if(needUpdate == "YES")  await updatePurchased()
    
   
    const {error} = await supabase.from("TutoringRequests")
    .update({attended: true})
    .eq("id", id)

    if(!error) return showToast("Updated Successfully.", "green")
    showToast("Failed, Internal Error occurred","red")
  }
  useEffect(()=>{realTimeData(fecthData, "TutoringRequests")},[])
  useEffect(()=>{fecthData() },[])


  if(isLoading) return <DualBallLoading />
  if(requestsData.length == 0) return <NoDataMessage message="Available Tutoring Requests will appear here."/>

  return (

    <FlatList 
      contentContainerStyle={{backgroundColor:"#DCDCDC", flexGrow:1}}
      showsVerticalScrollIndicator={false}
      data={requestsData}
      keyExtractor={(item)=> item.id}
      renderItem={({item})=>(
        <View style={styles.cartContainer}>

            <TutoringRequestInfoFields
                fileObj={item.Documents}
                fullName={`${item.Users.firstName} ${item.Users.lastName}`}
                institution={item.Users.institution}
                email={item.Users.email}
                phone={item.Users.phone}
                courseCode={item.courseCode}
                price={item.price_plan}
                message={item.message}
                created_at={item.created_at}
            />
            <View style={styles.submitBtnContainer}>
                <Text style={{fontSize:16,marginBottom:5, fontWeight:'700'}}>You attended this request? </Text>
                <SmallButton 
                    title="Yes"
                    color="green"
                    onPress={()=>{
                      Alert.alert(
                        'Confirm',
                        `The customer paid for this tutoring sessions ?`,
                        [
                        {
                            text: 'NO',
                            onPress: async() => { await handleMatter(item.id ,"NO")},
                            style: 'cancel',
                        },
                        {
                            text: 'YES',
                            onPress: async() => { await handleMatter(item.id, "YES")},
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

export default ManageTutoringRequests

const styles = StyleSheet.create({
  cartContainer:{
    margin:8,
    padding: 5,
    backgroundColor:'#fff',
    borderRadius:10
  },
  submitBtnContainer:{
    alignSelf:'center',
    marginVertical:10,
  }
})