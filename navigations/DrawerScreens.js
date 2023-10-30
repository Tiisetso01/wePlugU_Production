import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabsScreen from './BottomTabsScreen';
import CustomDrawer from '../components/CustomDrawer'
import {Icon} from 'react-native-elements';
import SellerStackScreens from './SellerStackScreens';
import AdminStack from './AdminStack';
import DonationsStack from './DonationsStack';
import SettingsTabs from './SettingsTabs';
import UserPromotionsTopTaps from './UserPromotionTopTaps';
import AboutTopTabs from './AboutTopTabs';
import { fecthInfo } from '../utils/supabaseGlobalFunctions';
import { supabase } from '../supabase/supabase';
import {useLayoutEffect, useState } from 'react';


const Drawer = createDrawerNavigator();
const DrawerScreens = () => {
  const [email, setEmail] = useState(null);
  useLayoutEffect(()=>{
    const getAdmin = async()=>{
      let email = (await fecthInfo()).email
       const {data, error} = await supabase.from("Admins")
       .select("email")
       .eq("email", email)
       .limit(1)
       .maybeSingle()
       if(!error && data)return setEmail(data)
       
   }
   getAdmin()
  },[])
  
  return (
      <Drawer.Navigator initialRouteName='Drawer_Home'
        drawerContent={props => <CustomDrawer {...props} />}
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: "#61dafb"},
          //headerTintColor: "#fff",
          headerTitleAlign:"center",
          drawerActiveTintColor: 'white',
          drawerActiveBackgroundColor: '#3e2465',
          drawerLabelStyle: {
            marginLeft: -20,
            marginVertical:-10
          },
        }}
      >
        <Drawer.Screen name='Drawer_Home'  component={BottomTabsScreen}
          options={{
            title:"Home",
            drawerIcon:({color})=>(<Icon name="home" color={color} type="material-icons" size={25}/>),
            headerShown: false,
          }}
        />
        <Drawer.Screen  name='Seller' component={SellerStackScreens}
          options={{
            headerShown: false,
            drawerIcon:({color})=>(<Icon name='store' color={color} type='material-icons' size={25} />)
          }}
        />
       
        <Drawer.Screen  name='Donate' component={DonationsStack}
          options={{
            headerShown:false,
            drawerIcon:({color})=>(<Icon name='volunteer-activism' color={color} type='material-icons' size={25} />)
          }}
        />
        <Drawer.Screen  name='Promotions' component={UserPromotionsTopTaps}
          options={{
            title:'Referrals & Payments',
            drawerIcon:({color})=>(<Icon name='payments' color={color} type='material-icons' size={25} />)
          }}
        />

        <Drawer.Screen  name='Settings' component={SettingsTabs}
          options={{
            drawerIcon:({color})=>(<Icon name='settings' color={color} type='material-icons' size={25} />)
          }}
        />
       
        { email && <Drawer.Screen  name='Admins' component={AdminStack}
           options={{ 
            headerShown:false,
            drawerIcon:({color})=>(<Icon name='admin-panel-settings' color={color} type='material-icons'  size={25} />)
          }}
        />}
        <Drawer.Screen  name='About' component={AboutTopTabs}
           options={{ 
            //headerShown:false,
            drawerIcon:({color})=>(<Icon name='info' color={color} type='material-icons'  size={25} />)
          }}
        />
      </Drawer.Navigator>
  )
}

export default DrawerScreens;



