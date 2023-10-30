import { StyleSheet,  View, Platform} from 'react-native'
import React from 'react';
import { WebView } from 'react-native-webview'; // for ios
import { CDNURL_PDF } from '../utils/globalFunctions';
//import PDFReader from 'rn-pdf-reader-js'; --- for android
//#ed1747
const PdfViewerScreen = ({route}) => {
    const {pdf} = route.params;

    const documentData = CDNURL_PDF + pdf;
   
  return (
    <View style={{flex:1}}>
        
      <WebView 
        source={{uri: Platform.OS == 'android' ? `https://docs.google.com/viewer?url=${documentData}` : documentData}}
        //source={{uri: Platform.OS === 'android' ? `https://drive.google.com/viewerng/viewer?embedded=true&url=${documentData}` : documentData}}
        onError={(e) => {
            return e
        }}
        allowFileAccess={Platform.select({android: true, ios: false})}
        allowFileAccessFromFileURLs={Platform.select({android: true, ios: false})}
        allowUniversalAccessFromFileURLs={Platform.select({android: true, ios: false})}
        //scalesPageToFit={Platform.select({android: false})}
        mixedContentMode={Platform.select({android: 'always', ios: undefined})}
        sharedCookiesEnabled={false}
    />
      {/**<WebView javaScriptEnabled={true}  source={{uri:  documentData}}/>*/}
  </View>
  )
}

export default PdfViewerScreen

const styles = StyleSheet.create({})