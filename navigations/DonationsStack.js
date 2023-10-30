import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ManageDonationsScreen from '../screens/ManageDonationsScreen';
import DonateScreen from '../screens/DonateScreen';
import DonationMenu from '../screens/DonationMenu';

const Stack = createNativeStackNavigator();
const DonationsStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: "#61dafb"},
      }}
    >
        
        <Stack.Screen name="DonationsMenu" component={DonationMenu}/>
        <Stack.Screen name="Donations" component={DonateScreen}/>
        <Stack.Screen 
          options={{title:"Manage Donations"}}
          name="ManageDonations"
          component={ManageDonationsScreen}/>

    </Stack.Navigator>
  )
}

export default DonationsStack




