import React, { useState, useEffect} from 'react';
import { Text, View,ScrollView, TouchableOpacity,
  Platform, StyleSheet, TouchableWithoutFeedback, Keyboard,
  KeyboardAvoidingView , TextInput, Alert,} from 'react-native';
import SmallButton from '../components/SmallButton';
import { SelectList,MultipleSelectList } from 'react-native-dropdown-select-list';
import { fetchInstitutions, handleUploadPostsData, pickImages } from '../utils/globalFunctions';
import SwiperComponent from '../components/SwiperComponent';
import { Formik } from 'formik';
import * as Yup from "yup";



export default function SellerScreen() {

  const [images, setImages] = useState([]);
  const [allInstitutions, setAllInstitutions] = useState([]);
  const [institutions, setInstitutions] = useState([]);

  const categories =[
    { key: '1', value: "Books" },
    { key: '2', value: "Food" },
    { key: '3', value: "Fashion" },
    { key: '4', value: "Salons" },
    { key: '5', value: "Tutors" },
    { key: '6', value: "Accessories" },
    { key: '7', value: "Services" },
    { key: '9', value: "Others" },
  ]

  useEffect(()=>{

    /** South African universities */
    const fecthData = async()=>{
      setAllInstitutions( fetchInstitutions())
    }
    fecthData()
  },[])
  
  
  const validationSchema = Yup.object({

    category: Yup.string().min(1,"Select atleast one category.").required("Please select category."),
    institutions: Yup.array().of(Yup.string()).min(1,"Select atleast one intitution.").required("required"), 
    title: Yup.string().trim().max(35, "Title should be less than 35 characters.").required("Title is required."),
    location: Yup.string().trim().required("Location is required"),
    price: Yup.string().trim().matches(/^[0-9]+$/,"Must be digits/numbers only").required("Price is required."),
    description: Yup.string().trim().required("Description is required."),
  });

const initialValues = { category: "", title: "", institutions: [], location: "", price: "", description: "" };
  return (
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          /**Submitting Data */
          await handleUploadPostsData(values, resetForm, images,"Posts" )
          setImages([])
      }}
    >
      {({ values, errors,touched, handleChange, setFieldTouched, isValid, setFieldValue, handleSubmit, isSubmitting}) => (
      <KeyboardAvoidingView   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  style ={styles.container}>
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()} >
          <ScrollView contentContainerStyle={styles.innerContainer}>

            <SwiperComponent images={images}/>
            { images.length == 0 && (
              <Text style={[styles.errorText,{alignSelf:'center'}]}>Please pick  image/images first.</Text>
            )}

            <View >
              <View style={{alignSelf:'center', marginTop:10}}>
                <SmallButton 
                  title="Pick Images" 
                  color="#1B9CFC" 
                  onPress={async()=>{
                    setImages(await pickImages())
                  }}
                />
              </View>
            
                <Text style={styles.label}>Category</Text>
                <SelectList
                  setSelected={handleChange('category')}
                  data={categories}
                  save="value"
                  onBlur={()=>setFieldTouched('category')}
                />
                {touched.category && errors.category && (<Text style={styles.errorText}>{errors.category}</Text>)}

              <Text style={styles.label}>Institutions you want to advertise for</Text>
              <MultipleSelectList
                setSelected={(val) => setInstitutions(val)}
                onSelect={()=>setFieldValue('institutions', institutions)}
                data={allInstitutions}
                save="value"
                label="Selected institution"
              />
             
              {errors.institutions && (<Text style={styles.errorText}>{errors.institutions}</Text>)}
              
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
            
              <Text style={styles.label}>Location</Text>
              <TextInput
                style ={styles.inputView}
                value = {values.location}
                autoCapitalize = 'words'
                placeholder = 'Province, town, city, street'
                onChangeText={ handleChange('location')}
                onBlur={()=>setFieldTouched('location')}
              />
              { touched.location && errors.location && (<Text style={styles.errorText}>{errors.location}</Text>)}
          
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
              
              {checkValid = images.length==0 || !isValid || isSubmitting}
              <TouchableOpacity
                style ={ [styles.submitButton, {backgroundColor:checkValid ? '#a5c9ac': '#05c46b'}]}
                disabled={ checkValid}
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
  btnsContainer:{
    flexDirection: 'row',
    justifyContent:'space-between',
    marginTop:15
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
  fontSize: 14,
},
  descriptionInput:{
    borderRadius: 5,
    borderWidth:0.3,
    fontSize:16,
    height:120,
    paddingHorizontal: 5,
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