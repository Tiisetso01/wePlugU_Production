import { StyleSheet, Text, View, FlatList} from 'react-native';
import React, { useEffect, useState } from 'react';
import SmallButton from '../components/SmallButton';
import DualBallLoading from '../components/DualBallLoading';
import NoDataMessage from '../components/NoDataMessage';
import { supabase } from '../supabase/supabase';
import { showToast } from '../utils/globalFunctions';
import ReportsFieldsInfo from '../components/ReportsFieldsInfo';
import { realTimeData } from '../utils/supabaseGlobalFunctions';


const ManageReports = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [reportsData, setReportsData] = useState([]);
  const [showMore, setShowMore] = useState(false)

  const fecthData = async()=>{
    const {data, error} = await supabase.from("Reports")
    .select("*, Users(*)")
    .match({isSolved: false})
    .order("created_at", {ascending: false})

    if(!error){
        setReportsData(data)
        return setIsLoading(false)
    }
    setIsLoading(false)
    showToast("Internal Error occurred.")
  }
  const handleMatter = async(id)=>{
    const {error} = await supabase.from("Reports")
    .update({isSolved: true})
    .eq("id", id)

    if(!error) return showToast("Updated Successfully.", "green")
    showToast("Failed, Internal Error occurred","red")
  }
  useEffect(()=>{realTimeData("Reports", fecthData)},[])
  useEffect(()=>{fecthData() },[])


  if(isLoading) return <DualBallLoading />
  if(reportsData.length == 0) return <NoDataMessage message="Available Reports will appear here."/>


  return (

    <FlatList 
      contentContainerStyle={{backgroundColor:"#DCDCDC", flexGrow:1}}
      showsVerticalScrollIndicator={false}
      data={reportsData}
      keyExtractor={(item)=> item.id}
      renderItem={({item})=>(
        <View style={styles.cartContainer}>

            <ReportsFieldsInfo
                fullName={`${item.Users.firstName} ${item.Users.lastName}`}
                institution={item.Users.institution}
                category={item.category}
                reportMessage={item.report}
                created_at={item.created_at}
                showMore={showMore}
                onPress={()=>setShowMore(!showMore)}
            />
            <View style={styles.submitBtnContainer}>
                <Text style={{fontSize:16,marginBottom:5, fontWeight:'bold'}}>Is the matter solved? </Text>
                <SmallButton 
                    title="Yes"
                    color="green"
                    onPress={async()=> await handleMatter(item.id)}
                />
            </View>

        </View> 
      )}
    />
  )
}

export default ManageReports

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