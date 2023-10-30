import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PromotionsScreen from '../screens/PromotionsScreen';
import ShowUserPromoHistory from '../screens/ShowUserPromoHistory';
import UserSubscriptionsScreen from '../screens/UserSubscriptionsScreen';


const Tab = createMaterialTopTabNavigator();

const UserPromotionsTopTaps = ()=> {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Referrals" component={PromotionsScreen} />
      <Tab.Screen name= "Subscription" component={UserSubscriptionsScreen} />
      <Tab.Screen name="History Redeems" component={ShowUserPromoHistory} />
    </Tab.Navigator>
  );
}
export default UserPromotionsTopTaps;