import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SellerScreen from '../screens/SellerScreen';
import ManageProductsScreen from '../screens/ManageProductsScreen';
import SellerMenu from '../screens/SellerMenu';
import ManageNotes from '../screens/ManageNotes';
import UploadNotesScreen from '../screens/UploadNotesScreen';
import PdfViewerScreen from '../screens/PdfViewerScreen';
import SellerPayWall from '../screens/SellerPayWall';
import SubscriptionTermsScreen from '../screens/SubscriptionTermsScreen';

const Stack = createNativeStackNavigator();
const SellerStackScreens = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: { backgroundColor: "#61dafb"},
        headerTitleAlign:"center"
      }}
    >
          <Stack.Screen
            name="SellerMenu"
            component={SellerMenu}
            
          />
          <Stack.Screen name="SellProducts" component={SellerScreen}
            options={{
              title:"Advertise Products/Services"
            }}
          />
          <Stack.Screen name="ManageProducts" component={ManageProductsScreen}
            options={{
              title:"Manage Products/Services"
            }}
          />

          <Stack.Screen name="UploadNotes" component={UploadNotesScreen}
            options={{
              title:"Upload Notes"
            }}
          />
          <Stack.Screen name="ManageNotes" component={ManageNotes}
            options={{
              title:"Manage Notes"
            }}
          />
          <Stack.Screen
           options={{title:"Subscription Terms"}}
           name="subscriptionTerms"
           component={SubscriptionTermsScreen}
          />

          <Stack.Screen name="PdfViewer" component={PdfViewerScreen}/>
          <Stack.Screen name="SellerPayWall" component={SellerPayWall}
            options={{
              title:"Pay Wall"
            }}
          />
        </Stack.Navigator>
  )
}

export default SellerStackScreens




