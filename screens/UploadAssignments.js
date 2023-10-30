import React, { useState, useEffect } from 'react';
import { Text, View,ScrollView, 
  Platform, StyleSheet, TouchableWithoutFeedback, Keyboard,
  KeyboardAvoidingView , TextInput, TouchableOpacity} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import SmallButton from '../components/SmallButton';
import { SelectList} from 'react-native-dropdown-select-list';
import {fecthInfo, fetchInstitutions, get_random_string, handleSubmitDocuments, pickImages, showToast} from "../utils/globalFunctions";
import { fecthCoursesCodes, fecthDepartments } from '../utils/supabaseGlobalFunctions';
import SwiperComponent from '../components/SwiperComponent';
import { Formik } from 'formik';
import * as Yup from "yup";


const UploadSolutionsPdf = ({navigation})=>{
  
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [allInstitutions, setAllInstitutions] = useState([]);
  const [departmentsData, setDepartmentsData] = useState([])
  const [courseCodes, setCoursesCodes] = useState([]);
  const [questionsPdf, setQuestionsPdf] = useState("")
  const [solutionsPdf, setSolutionsPdf] = useState([])
  const [questionsFilePath, setQuestionsFilePath] = useState("")
  const [solutionsFilePath, setSolutionsFilePath] = useState([])
  const [questionsFileName, setQuestionFileName] = useState("")
  const [solutionsFileName, setSolutionsFileName] = useState([])

  const pickDocuments = async(content)=>{
    try {
      let resultObj = await DocumentPicker.getDocumentAsync({type:"application/pdf" })
      if (resultObj != null && !resultObj.canceled) {
        let resultData = resultObj.assets[0];

        const fileName = resultData.uri.split("/").pop()
        const pdfObj = {
          uri: resultData.uri,
          type: "application/pdf",
          name: fileName,
        }
        let filePathStorage = `${user.id}/${get_random_string(30)}/${fileName}`
        if(content == "solutions"){
          setSolutionsFileName(pre =>[ ...pre, resultData.name])
          setSolutionsPdf(pre =>[ ...pre, pdfObj])
          return setSolutionsFilePath(pre =>[ ...pre, filePathStorage])
        }else{
          setQuestionFileName(resultData.name)
          setQuestionsPdf(pdfObj)
          return  setQuestionsFilePath(filePathStorage)
        }
      }

      showToast(" Canceled! ", 'red')
    
    } catch (error) {
      showToast(" Canceled! ", 'red') // internal error not really canceled
    }
    
  }
  
  useEffect(()=>{
    const fecthData = async()=>{
      setUser(await fecthInfo())
      setAllInstitutions(fetchInstitutions())
      setCoursesCodes( await fecthCoursesCodes())
      setDepartmentsData(await fecthDepartments())
    }
    fecthData()

  },[]) 

  
  const resetState = () => {
    setQuestionsPdf("");
    setQuestionFileName("");
    setQuestionsFilePath("")
    setSolutionsPdf([])
    setSolutionsFileName([])
    setSolutionsFilePath([])
    setImages([])
}
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
          let finalValues = {
            ...values, 
            solutionsFileName,
            solutionsFilePath,
            questionsFileName,
            questionsFilePath,
            category:"Assignments"
          }
          let pdfsFilePath = [questionsFilePath, ...solutionsFilePath ]
          let pdfsFileData = [questionsPdf, ...solutionsPdf] 
          await handleSubmitDocuments(finalValues, resetForm,images,pdfsFilePath , pdfsFileData)
          resetState()
      }}
    >
    {({ values, errors,touched, handleChange, setFieldTouched, isValid, handleSubmit, isSubmitting}) => (
      <KeyboardAvoidingView   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  style ={styles.container}>
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()} >
          <ScrollView contentContainerStyle={styles.innerContainer}>
          <Text style={styles.sampleText}>Pictures of Your Sample Solutions</Text>
            <SwiperComponent images={images}/>
      
            <View>

              <View style={styles.btnsPickDocuments}>
                <View style={styles.btnsView}>
                  <SmallButton title="Pick Images" color="#0690f5" 
                    onPress={async ()=> setImages( await pickImages()) }/>                 
                  <Text style={[styles.pickWarning,{color: images.length == 0 ? 'red': 'green' }]}>
                    { images.length == 0 ? "Pick images. *": `${images.length} image(s) selected.`}
                  </Text>                
              </View>

              <View style={styles.btnsView}>
                <SmallButton title="Assignment Questions" color="#0690f5" onPress={async()=> await pickDocuments("questions")}/>               
                  <Text style={[styles.pickWarning,{color: questionsPdf ? 'green' : 'red'}]}>
                    { questionsPdf ?` 1 document selected.`:  "Pick PDF file. *"}
                  </Text>      
              </View>
              <View style={{borderWidth: 1,paddingVertical: 10,paddingHorizontal:3 }}>

                <View style={{flexDirection: 'row', marginBottom:4,flexWrap:'wrap' }}>
                  <Text style={{color:'#ed1747'}}>Note *: </Text>
                  <Text>you can select multiple files but one at the time.</Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <SmallButton title="Assignment Solutions" color="#0690f5" onPress={async()=> await pickDocuments("solutions")}/>
                  <Text style={[styles.pickWarning,{color: solutionsPdf.length > 0? 'green' : 'red'}]}>
                    { solutionsPdf.length > 0 ?`${solutionsPdf.length} document(s) selected`:  "Pick PDF file. *"}
                  </Text>
                </View>
            </View>
      
              </View>
              
              <Text style={styles.label}>Select institution</Text>
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
                    
              {isDisabled = images.length == 0 || !isValid || isSubmitting || !questionsPdf || !(solutionsPdf.length > 0)}
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

export default UploadSolutionsPdf;
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
  btnsView:{
    flexDirection: 'row',
    marginBottom: 10
  },
  pickWarning:{
   marginLeft: 5,
   
    
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
    paddingHorizontal: 5,
    borderRadius: 8,
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
  height:100,
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