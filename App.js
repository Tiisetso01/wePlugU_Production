import 'react-native-gesture-handler';
import React, { useState, useEffect, useRef, } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, createNavigationContainerRef} from '@react-navigation/native';
import AuthStackScreens from './navigations/AuthStackScreens';
import DrawerScreens from './navigations/DrawerScreens';
import { supabase } from './supabase/supabase';
import * as Notifications from 'expo-notifications';
import { RootSiblingParent } from 'react-native-root-siblings';
import UpdatePassword from './screens/AuthScreens/UpdatePassword';
import * as Linking from "expo-linking";
import { createStackNavigator } from '@react-navigation/stack';
import { Text, Alert } from 'react-native';
import DualBallLoading from './components/DualBallLoading';
import { errorImage } from './utils/Constants';
import FeedbackMessageModal from './components/FeedbackMessageModal';
import * as Updates from 'expo-updates';
import 'expo-dev-client';


const prefix = Linking.createURL("");

export default function App() {
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [auth, setAuth] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false)
  const Stack = createStackNavigator()
  const navigationRef = createNavigationContainerRef();
 
  function navigate(name, param) {
    if (navigationRef.isReady()) {
      // Perform navigation if the react navigation is ready to handle actions
      navigationRef.navigate(name, param);
      
    }  
  }
  
  const url = Linking.useURL();

  const handleURL = (url) => {
   
    const { hostname, path, queryParams } = Linking.parse(url);
    
    if (path === 'UpdatePassword' || url.includes("UpdatePassword")) {
      if(!url.includes("error")){
        
        return navigate('UpdatePassword', queryParams)
      }
      //return navigate("LoginScreen", {params:"error"})
    }
    //TODO: session expired or in valid url PAGE
    //return navigate("LoginScreen")
  
  }
  useEffect(()=>{
    if (url) {
      let parsedUrl = parseSupabaseUrl(url)
      
      handleURL(parsedUrl);
    } 
  },[url])
 
  const parseSupabaseUrl = (url) => {
    let parsedUrl = url;
    if (url.includes("#")) {
      parsedUrl = url.replace("#", "?");
      
    }
    return parsedUrl;
  };
  
  
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        UpdatePassword: "UpdatePassword",
      },
    },
  };
 
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });  

  const fecthSession = ()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setAuth(session)
    })
   
    supabase.auth.onAuthStateChange((event, session) => {
      setAuth(session);
    })
  }

  const checkAppUpdateEventListener = (event) => {
    
    if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
      // Handle update available
      Alert.alert(
        "New Updates Available",
        `New updates available for  wePlugU App, Restart the app for this updates to take effect.`,
        [
          {
            text: 'Not now',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'Restart',
            onPress: async() => { await Updates.reloadAsync()},
          },
        ]
      );
    }
  };
  Updates.useUpdateEvents(checkAppUpdateEventListener);
  
  
  useEffect(() => {

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {

      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      //const url = response.notification.request.content.data.url;
      let appUrl= Linking.createURL("");
      Linking.openURL(appUrl);
    });
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  
  useEffect(()=>{ fecthSession() },[]);
  /*if(url?.includes("expired")){
    return(
      
      <FeedbackMessageModal
        requireImagePath={errorImage}
        isModalVisible={isModalVisible}
        onPress={()=> {
          setIsModalVisible(false)
          
        }}
        message="Email link has expired, Please request to reset password again."
        ButtonTitle="Okay"
        color="orange"
      />
    )
  }*/
  
  return (
    
    <RootSiblingParent>
      <NavigationContainer ref={navigationRef} linking={linking} fallback={<DualBallLoading/>}>
       <StatusBar  backgroundColor="#61dafb" />
        <Stack.Navigator >
          { auth
            ?<Stack.Screen name = "MainHomeScreen" component={DrawerScreens} options={{ headerShown: false }}/>
            :<Stack.Screen name = "AuthStackScreens" component={AuthStackScreens} options={{ headerShown: false }}/>
          }
          <Stack.Screen name = "UpdatePassword" component={UpdatePassword} />
        </Stack.Navigator>
      </NavigationContainer>
    </RootSiblingParent>
      
  );
}