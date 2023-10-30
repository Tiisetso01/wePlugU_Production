import { StyleSheet, View, FlatList, Alert} from 'react-native';
import React, { useEffect, useState } from 'react';
import DualBallLoading from '../components/DualBallLoading';
import NoDataMessage from '../components/NoDataMessage';
import { supabase } from '../supabase/supabase';
import { showToast } from '../utils/globalFunctions';
import ReportsFieldsInfo from '../components/ReportsFieldsInfo';
import { realTimeData } from '../utils/supabaseGlobalFunctions';
import SmallButton from '../components/SmallButton';


const ManageHistotryReports = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [reportsData, setReportsData] = useState([]);
  const [showMore, setShowMore] = useState(false)
  
  const fecthData = async()=>{
    const {data, error} = await supabase.from("Reports")
    .select("*, Users(*)")
    .match({isSolved: true, isDeleted: false})
    .order("created_at", {ascending: false})
    if(!error){
        setReportsData(data)
        return setIsLoading(false)
    }
    setIsLoading(false)
    showToast("Internal Error occurred.")
}

const handleDelete = async(id)=>{
  const {error} = await supabase.from("Reports")
  .update({isDeleted: true})
  .eq("id", id)

  if(!error) return showToast("Deleted Successfully.", "green")
  showToast("Failed, Internal Error occurred","red")
}

useEffect(()=>{realTimeData("Reports", fecthData)},[])
useEffect(()=>{fecthData()},[])


  if(isLoading) return <DualBallLoading />
  if(reportsData.length == 0) return <NoDataMessage message="History Reports will appear here."/>


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
              <SmallButton
                  title="Delete"
                  color="red"
                  onPress={()=>{
                    Alert.alert(
                      'Delete Report',
                      `Are you sure you want to delete this reports?`,
                      [
                      {
                          text: 'Cancel',
                          onPress: () => null,
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

export default ManageHistotryReports

const styles = StyleSheet.create({
  cartContainer:{
    margin:8,
    padding: 5,
    backgroundColor:'#fff',
    borderRadius:10
  },
  submitBtnContainer:{
    alignSelf:'flex-end',
    marginVertical: 10,
  }
})