import React, { useState, useEffect} from 'react';
import { Text, View,ScrollView, TouchableOpacity,
  Platform, StyleSheet, TouchableWithoutFeedback, Keyboard,
  KeyboardAvoidingView , TextInput, Image,} from 'react-native';
import SmallButton from '../components/SmallButton';
import { SelectList,MultipleSelectList } from 'react-native-dropdown-select-list';
import { fetchInstitutions, handleUploadPostsData, pickImages} from '../utils/globalFunctions';
import SwiperComponent from '../components/SwiperComponent';
import { Formik } from 'formik';
import * as Yup from "yup";


export default function DonateScreen() {
  
  const [images, setImages] = useState([]);
  const [allInstitutions, setAllInstitutions] = useState([]);
  const [institutions, setInstitutions] = useState([]);

  const categoriesArr =[ "Books", "Food" ,"Salons" ,
     "Accessories" , "Services" , "Fashion" , "Others"
  ]
  const categories =[
    { key: '1', value: "Books" },
    { key: '2', value: "Food" },
    { key: '3', value: "Fashion" },
    { key: '4', value: "Salons" },
    { key: '6', value: "Accessories" },
    { key: '7', value: "Services" },
    { key: '9', value: "Others" },
  ]


  const getInstitutions = async()=>{
    setAllInstitutions(await fetchInstitutions())
  }
  
  useEffect(()=>{

    /** South African universities */
    getInstitutions()
  },[])
  /*const pickImages = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      selectionLimit:10,
      allowsMultipleSelection:true,
      aspect: [4, 3],
      quality: 1.0,
    });
    if (!result.canceled) {
      const returnedImages = result.assets;
      return setImages(returnedImages)
    }
    return []
};*/
  
  const validationSchema = Yup.object({

    category: Yup.string().required("Please select category.").oneOf(categoriesArr),
    institutions: Yup.array().of(Yup.string()).min(1,"Select atleast one intitution.").required("required"), 
    title: Yup.string().max(35, "Title should be less than 35 characters.").trim().required("Title is required."),
    location: Yup.string().trim(),
    price: Yup.string().trim(),
    description: Yup.string().trim().required("Description is required."),
  });

const initialValues = { category: "", title: "", institutions: [], location: "", price: "Free", description: "" };
  return (
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          /**Submitting Data */
          let finalValues = {...values, type: 'donate'}
          await handleUploadPostsData(finalValues, resetForm, images,"Posts" )
          setImages([])
      }}
    >
      {({ values, errors,touched, handleChange, setFieldTouched, isValid, setFieldValue, handleSubmit, isSubmitting}) => (
      <KeyboardAvoidingView   behavior={Platform.OS === 'ios' ? 'padding' : 50}  style ={styles.container}>
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()} >
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.innerContainer}>

            <SwiperComponent images={images}/>
            { images.length == 0 && (
              <Text style={[styles.errorText,{alignSelf:'center'}]}>Please pick  image/images first.</Text>
            )}
            
            <View>
              <View style={{alignSelf:'center', marginTop:10}}>
                <SmallButton 
                  title="Pick Images" 
                  color="#1B9CFC" 
                  onPress={async()=>{
                    setImages(await pickImages())
                  }}
                />
              </View>
              <View style={{flexDirection:'row',justifyContent:"center"}}>
                <Image source={require('../assets/FlatIcons/donate.gif')} style={{height: 100, width:100, resizeMode:"contain"}}/>
                <Image source={require('../assets/FlatIcons/heart.gif')} style={{height: 100, width:100, resizeMode:"contain"}}/>
              </View>
              
              <Text style={styles.instructionText}>
                <Text style={{color:"#f54248"}}>Spread Love and Kindness</Text> {'\n'}
                You can donate to the public by posting the image(s) of an item(s) or Service
                you want to donate to your fellow human begin, or you can emails or message us
                at the following contacts
                <Text style={{color:"blue", fontWeight:"bold"}}> weplugu.help@gmail.com </Text> or
                <Text style={{color:"blue", fontWeight:"bold"}}> @weplugu support </Text>
                So that we can fetch the Items(s) and to donate them on your behalf.
              </Text>
            
            
                <Text style={styles.label}>Category</Text>
                <SelectList
                  setSelected={handleChange('category')}
                  data={categories}
                  save="value"
                  onBlur={()=>setFieldTouched('category')}
                />
                {touched.category && errors.category && (<Text style={styles.errorText}>{errors.category}</Text>)}

              <Text style={styles.label}>Institutions you want to donate for</Text>
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
            
              <Text style={styles.label}>Location (if required)</Text>
              <TextInput
                style ={styles.inputView}
                value = {values.location}
                autoCapitalize = 'words'
                placeholder = 'Province, town, city, street'
                onChangeText={ handleChange('location')}
                onBlur={()=>setFieldTouched('location')}
              />
              { touched.location && errors.location && (<Text style={styles.errorText}>{errors.location}</Text>)}
          
              <Text style={styles.label}>Price (Free)</Text>
              <TextInput 
                style ={[styles.inputView, {fontWeight:'bold', fontSize:18, color:"#483"}]}
                value = {values.price}
                placeholder='Free (R0)'
                editable={false}
              />

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
                  
              {isCorrect = images.length == 0 || !isValid || isSubmitting }
              <TouchableOpacity
                style ={ [styles.submitButton, {backgroundColor: isCorrect ? '#a5c9ac': '#05c46b'}]}
                disabled={isCorrect}
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
    backgroundColor:"#fff"
  },
  innerContainer:{
    flexGrow:1,
    paddingHorizontal:10,
    paddingBottom:100
  },
  btnsContainer:{
    flexDirection: 'row',
    justifyContent:'space-between',
    marginVertical:15
  },
  instructionText:{
    marginVertical: 8,
    fontSize:16,
    backgroundColor: "#03fce3",
    borderRadius: 5,
    padding:3,
  
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