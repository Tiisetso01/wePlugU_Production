import React, { useState, useEffect } from 'react';
import { Text, View,ScrollView, 
  Platform, StyleSheet, TouchableWithoutFeedback, Keyboard,
  KeyboardAvoidingView , TextInput, TouchableOpacity} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import SmallButton from '../components/SmallButton';
import { SelectList} from 'react-native-dropdown-select-list';
import { fetchInstitutions,handleSubmitDocuments,get_random_string, pickImages, showToast} from "../utils/globalFunctions"
import SwiperComponent from '../components/SwiperComponent';
import { Formik } from 'formik';
import * as Yup from "yup";
import { fecthCoursesCodes, fecthDepartments, fecthInfo } from '../utils/supabaseGlobalFunctions';



export default function UploadNotesScreen({navigation}) {

  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [allInstitutions, setAllInstitutions] = useState([]);
  const [pdf, setPdf] = useState([]);
  const [pdfPath, setPdfPath] = useState([]);
  const [pdfName, setPdfName] = useState([])
  const [departmentsData, setDepartmentsData] = useState([])
  const [courseCodes, setCoursesCodes] = useState([]);
  
  
  
  const pickDocuments = async()=>{
    let user_id = (await fecthInfo()).id
    try {
      let resultObj = await DocumentPicker.getDocumentAsync({type:"application/pdf"})
      if (resultObj != null && !resultObj.canceled) {
        
        let resultData = resultObj.assets[0];
        let fileName = resultData.uri.split("/").pop()
        let pdf = {
          uri: resultData.uri,
          type: "application/pdf",
          name: fileName,
        }
        setPdf([pdf])
        setPdfName([resultData.name])
        
        setPdfPath([`${user_id}/${get_random_string(30)}/${fileName}`])
        return
      }
    showToast(" Canceled! ", 'red')
    } catch (error) {
      showToast(" Canceled! ", 'red') // internal error not really canceled
    }
    
  }

  const selectImages = async()=>{
    setImages(await pickImages())
  }

  
  const resetState = () => {
    setPdf([]);
    setPdfName([]);
    setPdfPath([])
    setImages([])
}
 
  
  useEffect(()=>{
    const fecthData = async()=>{
      //setUser(await fecthInfo())
      setCoursesCodes( await fecthCoursesCodes())
      setDepartmentsData(await fecthDepartments())
      setAllInstitutions(fetchInstitutions())
    }
    fecthData()

  },[]) 

  
  
  const initialValues = { 
    title:"",
    description:"",
    price:"",
    department:"",
    course_code:"",
    institution:"",
  };

  const validationSchema = Yup.object({

    department: Yup.string().required("Please select atleast one department."),
    institution: Yup.string().required("Please select atleast one intitution."),
    course_code: Yup.string().required("Please select atleast one course."),
    title: Yup.string().trim().max(40, "Title should be less than 40 characters.").required("Title is required."),
    price: Yup.string().trim().matches(/^[0-9]+$/,"Must be digits/numbers only").required("Price is required."),
    description: Yup.string().trim().required("Description is required."),
  });
  return (
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          /**Submitting Data */
          let finalValues = {...values,solutionsFileName: pdfName, solutionsFilePath: pdfPath}
          
          await handleSubmitDocuments(finalValues, resetForm, images, pdfPath, pdf)
         resetState()
      }}
    >
    {({ values, errors,touched, handleChange, setFieldTouched, isValid, handleSubmit, isSubmitting}) => (
      <KeyboardAvoidingView   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  style ={styles.container}>
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()} >
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.innerContainer}>
            <Text style={styles.sampleText}>Pictures of Your Sample Notes</Text>
            <SwiperComponent images={images}/>
      
            <View>

             {pdf.length > 0 && <Text style={{color:'green'}}>{pdfName}</Text>}

              <View style={styles.btnsContainer}>
                <View>
                  <SmallButton title="Pick Document" color="#0690f5" onPress={pickDocuments}/>
                  { pdf.length == 0 && (
                    <Text style={[styles.errorText,{alignSelf:'center'}]}>Pick PDF file. *</Text>
                  )}
                </View>
                <View>
                  <SmallButton title="Pick Images" color="#0690f5" onPress={selectImages}/>
                  { images.length == 0 && (
                    <Text style={[styles.errorText,{alignSelf:'center'}]}>Pick images. *</Text>
                  )}
                </View>
      
              </View>
              
              <Text style={styles.label}>Institutions you want to advertise for</Text>
              <SelectList
                  setSelected={handleChange("institution")} 
                  data={allInstitutions}
                  save="value"
              />
               {errors.institution && (<Text style={styles.errorText}>{errors.institution}</Text>)}

              <Text style={styles.label}>Department</Text>
              <SelectList
                setSelected={handleChange('department')} 
                data={departmentsData}
                save="value"
              />
               {errors.department && (<Text style={styles.errorText}>{errors.department}</Text>)}

              <Text style={styles.label}>Course Code</Text>
              <SelectList
                  setSelected={handleChange("course_code")} 
                  data={courseCodes}
                  save="value"
              />
               {errors.course_code && (<Text style={styles.errorText}>{errors.course_code}</Text>)}

              <Text style={styles.label}>Product or Service Title</Text>
              <TextInput
                style ={styles.inputView}
                value = {values.title}
                autoCapitalize = 'words'
                placeholder = 'Product or Service Title'
                onChangeText={handleChange('title')}
                onBlur={()=>setFieldTouched('title')}
              />
              {touched.title && errors.title && (<Text style={styles.errorText}>{errors.title}</Text>)}
            
              
              <Text style={styles.label}>Price</Text>
              <TextInput 
                style ={styles.inputView}
                value = {values.price}
                keyboardType='number-pad'
                placeholder = 'e.g 250'
                onChangeText={handleChange('price')}
                onBlur={()=>setFieldTouched('price')}
              />
              { touched.price && errors.price && (<Text style={styles.errorText}>{errors.price}</Text>)}

              <Text style={styles.label}>Description</Text>          
              <TextInput
                style={styles.descriptionInput}
                value={values.description}
                multiline
                placeholder='Product Description'
                onChangeText={handleChange('description')}
                onBlur={()=>setFieldTouched('description')}
              />
              { touched.description && errors.description && (<Text style={styles.errorText}>{errors.description}</Text>)}
                    
              {isDisabled = images.length == 0 || !isValid || isSubmitting || !pdf}
              <TouchableOpacity
                style ={ [styles.submitButton, {backgroundColor:isDisabled ? '#a5c9ac': '#05c46b'}]}
                disabled={isDisabled}
                onPress={handleSubmit}
              >
                <Text style ={ styles.buttonText }>Submit</Text>
              </TouchableOpacity>
            </View>
          
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    )}
  </Formik>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  innerContainer:{
    flexGrow:1,
    paddingHorizontal:10,
    paddingBottom:100
  },
  sampleText:{
    fontWeight: 'bold',
    fontSize:18,
    textAlign:'center',
    marginVertical:5,
  },
  btnsContainer:{
    flexDirection: 'row',
    justifyContent:'space-between',
    marginTop:15,
  },
  pickWarning:{
    flexDirection: 'row',
    justifyContent:'space-between',
    marginBottom:15,
    marginTop: 2
  },
  dropdown: {
    borderColor: "#B7B7B7",
    height: 10,
  },
  label:{ 
    marginBottom:3,
    fontWeight: "500",
    color: '#3399ff',
    fontSize: 18,
    marginTop: 15,
  },
  inputView:{
    width: '100%',
    height: 40,
    backgroundColor: '#D1D1D1',
    borderRadius: 8,
    paddingHorizontal: 5, 
  },
  errorText:{
    color: 'red',
    fontSize: 15,
  },
descriptionInput:{
  borderRadius: 5,
  borderWidth:0.3,
  paddingHorizontal: 5,
  fontSize:16,
  height:120,
  textAlignVertical: 'top',
},
submitButton:{
 alignSelf:'flex-end',
 marginVertical: 20,
 width:150,
 height:40,
 borderRadius:10,
 justifyContent:'center',
 alignItems:'center'
},
buttonText:{
  color: 'white',
  fontSize: 18,
  fontWeight: 'bold'
},
})