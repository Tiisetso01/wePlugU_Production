import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ManageTutoringRequests from '../screens/ManageTutoringRequests';
import AttendedTutoringRequests from '../screens/AttendedTutoringRequests';


const Tab = createMaterialTopTabNavigator();

const TutoringRequestsTopTabs = ()=> {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Current Requests" component={ManageTutoringRequests} />
      <Tab.Screen name="Attended Requests" component={AttendedTutoringRequests} />
    </Tab.Navigator>
  );
}
export default TutoringRequestsTopTabs;