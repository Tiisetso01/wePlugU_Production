import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Personalnfo from '../screens/PesonalInfo';
import EmailPassword from '../screens/EmailPassword';

const Tab = createMaterialTopTabNavigator();

const SettingsTabs = ()=> {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Personal Info" component={Personalnfo} />
      <Tab.Screen name="Security" component={EmailPassword} />
    </Tab.Navigator>
  );
}
export default SettingsTabs;