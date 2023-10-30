import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Alert, Linking } from 'react-native';

const registerForPushNotificationsAsync =async ({stopLoading})=>{
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {

        Alert.alert(
          'Enable Notifications',
          'Sorry, we need your permission to enable Push Notifications. Please enable it in your settings.',
          [
            {
              text: 'Deny',
              onPress:() => stopLoading(),
            },
            {
              text: 'Open Settings',
              onPress: async () =>{
                stopLoading()
                 Linking.openSettings()
                },
            },
          ]
        );
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync({projectId:"0900a5ec-6e5b-4e3c-9615-b0ecdc1c93fe"})).data;
     
    } else {
      Alert.alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }
  
export default registerForPushNotificationsAsync