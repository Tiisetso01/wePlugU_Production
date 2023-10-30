import { StyleSheet, Text, View, Modal, TouchableOpacity, Image, } from 'react-native'
import React from 'react';
import { Icon } from 'react-native-elements';
import SmallButton from './SmallButton';
//const [modelVisible ,setModelVisible] = useState(true)


const FeedbackMessageModal = ({requireImagePath, message, isModalVisible, ButtonTitle, color, onPress}) => {
  
  return (
    <Modal 
        visible={isModalVisible}
        transparent={true}
        animationType='slide'
    >
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                
                <Image source={requireImagePath} style={styles.imageModal}/>

                <Text style={styles.messageText}>
                    {message}
                </Text>
                <SmallButton title={ButtonTitle} color={color} onPress={onPress}/>
            </View>
        </View>
        
    </Modal>
  )
}

export default FeedbackMessageModal

const styles = StyleSheet.create({
  centeredView:{
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modalView:{
    borderRadius:10,
    backgroundColor:"#fff",
    alignItems:'center',
    width: "90%",
    paddingTop:10,
    paddingBottom:40,
    paddingHorizontal: 10,
  },
  imageModal:{
    height:100,
    width:100,
  },
  
  messageText:{
    marginVertical: 30,
    fontSize: 16,
    textAlign: 'center'
  }
})


