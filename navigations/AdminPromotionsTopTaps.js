import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ManagePromotions from '../screens/ManagePromotions';
import AdminPromotionsHistory from '../screens/AdminPromotionsHistory';


const Tab = createMaterialTopTabNavigator();

const AdminPromotionsTopTaps = ()=> {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Redeems Requests" component={ManagePromotions} />
      <Tab.Screen name="History Redeems" component={AdminPromotionsHistory} />
    </Tab.Navigator>
  );
}
export default AdminPromotionsTopTaps;