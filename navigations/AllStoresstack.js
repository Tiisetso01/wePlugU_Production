import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CheckOutScreen from '../screens/CheckOutScreen';
import SingleChat from '../screens/SingleChat';
import NotificarionsScreen from '../screens/NotificarionsScreen';
import AllStoresScreen from '../screens/AllStoresScreen';

const Stack = createNativeStackNavigator();

const AllStoresStack = () => {
  return (
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
          headerStyle: { backgroundColor: "#61dafb"},
          headerTitleAlign:"center",
        }}
      >
        <Stack.Screen
          name="AllStores"
          component={AllStoresScreen}
          //options={{headerShown: false,}}
        />
        <Stack.Screen name="CheckOut" component={CheckOutScreen} />
        <Stack.Screen name="SingleChat" component={SingleChat} />
        <Stack.Screen name="Notifications" component={NotificarionsScreen} />
      </Stack.Navigator>
  );
};

export default AllStoresStack;