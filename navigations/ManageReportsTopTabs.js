import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ManageReports from '../screens/ManageReports';
import ManageHistotryReports from '../screens/ManageHistoryReports';



const Tab = createMaterialTopTabNavigator();

const ManageReportsTopTabs = ()=> {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Current Reports" component={ManageReports} />
      <Tab.Screen name="History Reports" component={ManageHistotryReports} />
    </Tab.Navigator>
  );
}
export default ManageReportsTopTabs;