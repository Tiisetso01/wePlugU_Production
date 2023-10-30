import {View,Text, Modal, Dimensions } from 'react-native'
import React from 'react';
import { WebView } from 'react-native-webview'; // for ios
import { CDNURL_PDF } from '../utils/globalFunctions';
import SmallButton from './SmallButton';

const WebViewFileDownload = ({pdfPath, modalVisible, message, onPress}) => {

    const documentData = CDNURL_PDF + pdfPath;
  

  return (
    <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        >
        <View style={{flex:1,justifyContent:"center", alignItems:"center",  backgroundColor:"rgba(0,0,0,0.2)"}}>
                <View style={{backgroundColor:"#fff", width:"90%", padding:8, marginTop: Dimensions.get("window").height * 0.3, borderRadius:10}}>
                    

                <Text style={{fontSize: 16, fontWeight:"700",alignSelf:"center", marginTop:20 }}>File has been downloaded!...</Text>
                {message != undefined && <Text style={{marginTop:10, fontSize:18,}}>{message}</Text>}

                <View style={{alignSelf:'center', marginBottom:10, marginTop: 20}}>

                    <SmallButton
                        title="Okay"
                        color="green"
                        onPress={onPress}
                    /> 
                </View>
                
            </View>
                
            
            <WebView style={{width:0, height:0 }} javaScriptEnabled={true}  source={{uri:  CDNURL_PDF + pdfPath}}/>
        </View>

    </Modal>

  )
}

export default WebViewFileDownload 