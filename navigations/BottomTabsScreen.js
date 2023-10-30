import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import FavouratesScreen from '../screens/FavouratesScreen';
import {Icon} from 'react-native-elements';
import HomeStack from './HomeStack'
import ChatsStack from './ChatsStack';
import CoursesStack from './CoursesStack';
import AllStoresStack from './AllStoresstack';
const Tab = createBottomTabNavigator();
const BottomTabsScreen = () => {
   const getTabBarVisibility = (route)=>{
    const routeName = getFocusedRouteNameFromRoute(route)
    if(routeName == "SingleChat") return { display: "none" }
    return
   
    
   }
  return (
 
    <Tab.Navigator
        screenOptions={{
            headerShown: false,
            //tabBarActiveBackgroundColor: 'blue',
            tabBarActiveColor:"#f0edf6",
            tabBarInactiveColor:"#3e2465",
            
        }}
    >   
        <Tab.Screen name='HomeStack' component={HomeStack}
            options={{
                title:"My home",
                tabBarIcon:({color})=>(<Icon name='home' color={color} type='material-icons' size={25} />)
            }}
        />
        <Tab.Screen name='AllStoresStack' component={AllStoresStack}
            options={{
                title:"All Stores",
                tabBarIcon:({color})=>(<Icon name='add-shopping-cart' color={color} type='material-icons' size={25} />)
            }}
        />
        <Tab.Screen name='Chats' component={ChatsStack}
            options={({route})=>({
                tabBarStyle: getTabBarVisibility(route),
                tabBarIcon:({color})=>(<Icon name='comment' color={color} type='font-awesome-5' size={25} />)
                
            })}
            
        />
        <Tab.Screen name='Saved' component={FavouratesScreen}
            options={{
                tabBarIcon:()=>(<Icon name='favorite' type='material-icons' color='red' size={25} />)
            }}
        />
        <Tab.Screen name='Courses' component={CoursesStack}
            options={{
                tabBarIcon:({color})=>(<Icon name='assignment' color={color} type='material-icons' size={25} />)
            }}
        />
    </Tab.Navigator>
  )
}

export default BottomTabsScreen;
