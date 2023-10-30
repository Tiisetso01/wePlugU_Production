import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddDepartments from "../screens/AddDepartments";
import AddCourses from "../screens/AddCourses";
import AdminMenuScreen from "../screens/AdminMenuScreen";
import UploadAssignments from "../screens/UploadAssignments";
import ManageAssignments from "../screens/ManageAssignments";
import UploadPastPapers from "../screens/UploadPastPapers";
import ManagePastPapers from "../screens/ManagePastPapers";
import PdfViewerScreen from "../screens/PdfViewerScreen";
import ManageDepartments from "../screens/ManageDepartments";
import ManageCourses from "../screens/ManageCourses";
import AdminPromotionsTopTaps from "./AdminPromotionsTopTaps";
import ManageReportsTopTabs from "./ManageReportsTopTabs";
import TutoringRequestsTopTabs from "./TutoringRequestsTopTabs";

const Stack = createNativeStackNavigator();
const AdminStack = ()=>{
    return (
        <Stack.Navigator
          screenOptions={{
            headerBackTitleVisible: false,
            headerStyle: { backgroundColor: "#61dafb"},
            headerTitleAlign:"center",
         }}
        >
          <Stack.Screen name="AdminMenu" component={AdminMenuScreen}/>
          <Stack.Screen name="ManagePromotions" component={AdminPromotionsTopTaps} 
            options={{title:"Manage Promotions"}}
          />

          <Stack.Screen name="ManageReports" component={ManageReportsTopTabs}
            options={{title:"Manage Reports"}}
          />
          <Stack.Screen name="ManageTutoringRequestsTopTabs" component={TutoringRequestsTopTabs}
            options={{title:"Tutoring Requests"}}
          />
          
          <Stack.Screen name="AddDepartments" component={AddDepartments} 
            options={{title:"Add Departments"}}
          />
          <Stack.Screen name="ManageDepartments" component={ManageDepartments}
            options={{title:"Manage Departments"}}
          />

          <Stack.Screen name="AddCourses" component={AddCourses} 
            options={{title:"Add Courses"}}
          />
          <Stack.Screen name="ManageCourses" component={ManageCourses}
            options={{title:"Manage Courses"}}
          />

          <Stack.Screen name="UploadAssignments" component={UploadAssignments}
            options={{title:"Upload Assignments"}}
          />
          <Stack.Screen name="ManageAssignments" component={ManageAssignments}
            options={{title:"Manage Assignments"}}
          />

          <Stack.Screen name="UploadPastPapers" component={UploadPastPapers}
            options={{title:"Upload Past Papers"}}
          />
          <Stack.Screen name="ManagePastPapers" component={ManagePastPapers}
            options={{title:"Manage Past Papers"}}
          />
          <Stack.Screen name="PdfViewer" component={PdfViewerScreen} />
        </Stack.Navigator>
    )
}
export default AdminStack