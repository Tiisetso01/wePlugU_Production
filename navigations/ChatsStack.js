import ChatsList from '../screens/ChatsList'
import SingleChat from '../screens/SingleChat'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SearchUsers from '../screens/SearchUsers'
import CheckOutScreen from '../screens/CheckOutScreen'

const Stack = createNativeStackNavigator();
const ChatsStack = () => {
    return (
        <Stack.Navigator
          screenOptions={{
            headerBackTitleVisible: false,
            headerStyle: { backgroundColor: "#61dafb"},
            //headerTitleAlign:"center",
          }}
        >
          <Stack.Screen
            name="ChatList"
            component={ChatsList}
            
          />
          <Stack.Screen name="SingleChat" component={SingleChat} />
          <Stack.Screen name="SearchUsers" component={SearchUsers} />
          <Stack.Screen name="CheckOut" component={CheckOutScreen} />
        </Stack.Navigator>
    )
}

export default ChatsStack
