import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import SignupScreen from '../screens/AuthScreens/SignupScreen';
import ForgotPassword from '../screens/AuthScreens/ForgotPassword';

const Stack = createStackNavigator();
const screenOptions ={headerShown:false}
export default function AuthStackScreens() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false
      }}
     >
      <Stack.Screen name = "Login" options={screenOptions} component={LoginScreen} /> 
      <Stack.Screen name = "Signup" options={screenOptions} component={SignupScreen} />
      <Stack.Screen name = "ForgotPassword" options={{headerShown:true}} component={ForgotPassword} />
    </Stack.Navigator>
  );
}