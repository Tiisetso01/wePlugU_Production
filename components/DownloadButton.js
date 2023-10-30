import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Icon } from 'react-native-elements'

const DownloadButton = ({isDownloading, onPress}) => {
  return (
    <TouchableOpacity 
        style={styles.downloadButton}
        onPress={onPress}
    >
        <Icon type='material-icons' name="cloud-download" size={20} color={'#46dff0'} />
        <Text style={styles.downloadText}>  {isDownloading? "Downloading": "Download"}</Text>
    </TouchableOpacity>
  )
}

export default DownloadButton

const styles = StyleSheet.create({
    downloadButton:{
        flexDirection: 'row',
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: "#e90c59",
        height:40,
        borderRadius:5,
        marginVertical:15,
        width: 150
      },
      downloadText:{
        fontWeight: 'bold',
        color:'#eee',
        fontSize:17
      },
})