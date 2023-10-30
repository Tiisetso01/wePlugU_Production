import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

const InChatFileTransfer = ({pdfName}) => {
    
    return (
     
      <View style={styles.frame} >
          <Image
              source={require('../assets/images/pdf-placeholder.png')}
              style={{height: 60, width: 60}}
          />
          <View>
          <Text style={styles.text}> 
              {pdfName?.length > 20 ? pdfName?.slice(0, 15)+".pdf" : pdfName}
          </Text>
          <Text style={styles.textType}>{"PDF"}</Text>
          </View>
      </View>
      
    );
};
export default InChatFileTransfer;

const styles = StyleSheet.create({

  text: {
    color: 'black',
    marginTop: 10,
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 5,
    marginRight: 5,
  },
  textType: {
    color: 'black',
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  frame: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 10,
    padding: 5,
    marginTop: -4,
  },
});