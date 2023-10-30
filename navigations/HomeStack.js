import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CheckOutScreen from '../screens/CheckOutScreen';
import HomeScreen from '../screens/HomeScreen';
import SingleChat from '../screens/SingleChat';
import NotificarionsScreen from '../screens/NotificarionsScreen';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
          headerStyle: { backgroundColor: "#61dafb"},
          headerTitleAlign:"center",
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          //options={{headerShown: false,}}
        />
        <Stack.Screen name="CheckOut" component={CheckOutScreen} />
        <Stack.Screen name="SingleChat" component={SingleChat} />
        <Stack.Screen name="Notifications" component={NotificarionsScreen} />
      </Stack.Navigator>
  );
};

export default HomeStack;