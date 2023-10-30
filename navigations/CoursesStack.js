import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CourseCategoryScreen from '../screens/CourseCategoryScreen';
import CoursesList from '../screens/CoursesList';
import CourseContent from '../screens/CourseContent';
import NotesScreen from '../screens/NotesScreen';
import AssignmentsScreen from '../screens/AssignmentsScreen';
import PastPapersScreen from '../screens/PastPapersScreen';
import PdfViewerScreen from '../screens/PdfViewerScreen';
import SingleChat from '../screens/SingleChat';
import CourseMaterialPaywall from '../screens/CourseMaterialPaywall';
import TutoringRequest from '../screens/TutoringRequest';
import GeneralTutoringRequest from '../screens/GeneralTutoringRequest';
import SubscriptionTermsScreen from '../screens/SubscriptionTermsScreen';


const Stack = createNativeStackNavigator();
const CoursesStack = () => {
    return (
        <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
          headerStyle: { backgroundColor: "#61dafb"},
          headerTitleAlign:"center",
        }}>
          <Stack.Screen
            options={{title:"Departments"}}
            name="CourseCategoryScreen"
            component={CourseCategoryScreen}         
          />
          <Stack.Screen
            options={{title:"Courses"}}
            name="CoursesList" 
            component={CoursesList} 
          />
          <Stack.Screen 
            options={{title:"Course Content"}}
            name="CourseContent" 
            component={CourseContent} 
          />
          <Stack.Screen name="Notes" component={NotesScreen} />
          <Stack.Screen name="Assignments" component={AssignmentsScreen} />
          <Stack.Screen 
            options={{title:"Past Papers"}}
            name="PastPapers"
            component={PastPapersScreen} 
          />
          <Stack.Screen
           options={{title:"PDF Viewer"}}
           name="PdfViewer"
           component={PdfViewerScreen}
          />
           <Stack.Screen
            options={{title:"Tutoring Request", presentation:"modal"}}
            name="TutoringRequest"
            component={TutoringRequest}
          />
          <Stack.Screen
            options={{title:"Tutoring Request", presentation:"modal"}}
            name="GeneralTutoringRequest"
            component={GeneralTutoringRequest}
          />
          <Stack.Screen
           options={{title:"Pay Wall"}}
           name="coursesPaywall"
           component={CourseMaterialPaywall}
          />
          <Stack.Screen
           options={{title:"Subscription Terms"}}
           name="subscriptionTerms"
           component={SubscriptionTermsScreen}
          />
          <Stack.Screen name="SingleChat" component={SingleChat} />
        </Stack.Navigator>
    )
}

export default CoursesStack
