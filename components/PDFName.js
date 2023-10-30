import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Icon } from 'react-native-elements'

const PDFName = ({label, pdfName, onPress}) => {
  return (
    <TouchableOpacity
        style={styles.openPdfButton}
        onPress={onPress}
    >  
        <Icon type='material-icons' name="attachment" size={20} color={"#e90c59"}/>
        <Text> {label} <Text style={styles.openText} >{pdfName}</Text></Text>
    </TouchableOpacity>
  )
}

export default PDFName

const styles = StyleSheet.create({
    openPdfButton:{
        flexDirection: 'row',
        alignSelf:'center',
        backgroundColor: '#46dff0',
        padding:10,
        borderRadius:5
      },
      
      openText:{
        fontWeight: 'bold',
        textDecorationLine:'underline'
      },
})