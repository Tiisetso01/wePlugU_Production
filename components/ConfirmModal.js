import { StyleSheet, Text, View, Modal, TouchableOpacity, Image, } from 'react-native'
import React from 'react';
import { Icon } from 'react-native-elements';
import SmallButton from './SmallButton';
//const [modelVisible ,setModelVisible] = useState(true)

const ConfirmModal = ({requireImagePath, message, isModalVisible, ButtonTitle, color, onPress}) => {
  return (
    <Modal 
      visible={isModalVisible}
      transparent={true}
      animationType='slide'
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity
            onPress={()=>null}
            style={styles.closeView}
          >
            <Icon type="font-awosome" name='close'/>
          </TouchableOpacity>
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

export default ConfirmModal

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
  closeView:{
    position:"absolute",
    top:4,
    right:4,
    borderRadius:50,
    justifyContent:'center',
    alignItems:"center",
    width:40, height:40,
    backgroundColor:"red", 
    
  },
  messageText:{
    marginVertical: 30,
    fontSize: 16,
    textAlign: 'center'
  }
})


