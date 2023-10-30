import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AboutScreen from '../screens/AboutScreen';
import ReportForm from '../screens/ReportForm';


const Tab = createMaterialTopTabNavigator();

const AboutTopTabs = ()=> {
  return (
    <Tab.Navigator>
      <Tab.Screen name="About us" component={AboutScreen} />
      <Tab.Screen name="Reports" component={ReportForm} />
    </Tab.Navigator>
  );
}
export default AboutTopTabs;