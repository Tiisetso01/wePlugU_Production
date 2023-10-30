import { Text, TouchableOpacity, View } from "react-native";
import { Bubble } from "react-native-gifted-chat";


const renderBubble = (props) => {
    const {currentMessage} = props;
    const currentUserId = currentMessage.user._id
    
    if (currentMessage.file && currentMessage.file.uri) {

        let messageSender = props.currentMessage.user._id
        return (
        <View
            style={{
              width:"80%",padding:10,
              alignSelf: messageSender === currentUserId ? 'flex-end': 'flex-start',
              borderWidth:0.5,
              backgroundColor: messageSender === currentUserId ? '#0223f5' : '#f50290',
              borderRadius:10,
              borderTopRightRadius: messageSender === currentUserId ? 0: 10,
              borderTopLeftRadius: messageSender === currentUserId ? 10: 0,
            }}
        > 
          <TouchableOpacity
            onPress={() => {
              downloadFiles(currentMessage.file.uri, currentMessage.file.name)
            }}
           >
            <InChatFileTransfer
                  style={{marginTop: -10}}
                  pdfName={currentMessage.file.name}
              />
          </TouchableOpacity>
            
            <View style={{flexDirection: 'column'}}>
              <Text style={{fontSize:15,color:"#eee",}} >
                  {currentMessage.text}
              </Text>
              <View style={{
                flexDirection: 'row',
                alignSelf: messageSender === currentUserId
                ?"flex-end":"flex-start"
                ,alignItems:"center"
                  
                }}>
                <Text style={{ fontSize: 10, color:messageSender === currentUserId?"#fff":"grey",marginRight:10}}>
                  {getTime(currentMessage.createdAt)}
                </Text>
                {
                  messageSender === currentUserId &&
                  <Icon type="material-icon" name={currentMessage.received ? "done-all" : "done"} color="#fff" size={16}/>
                }
              </View>
            </View>
        </View>
        );
    }
    
    return (
        <Bubble
        {...props}
        wrapperStyle={{
            right: {
            backgroundColor: '#0223f5',
            },
            left: {
              backgroundColor: '#f50290',
              borderWidth:0.5
            },
        }}
        textStyle={{
            right: {
            color: '#fff',
            },
            left:{
              color:"#fff"
            }
        }}
        />
    );
};