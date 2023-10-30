import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { View, Text,TextInput, Button, Platform, StyleSheet, ScrollView,
   KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { supabase } from '../supabase/supabase';
import { showToast } from '../utils/globalFunctions';
import LargeButton from '../components/LargeButton';
import { SelectList } from 'react-native-dropdown-select-list';
import { reportCategory } from '../utils/Constants';


const ReportForm = () => {
  const [report, setReport] = useState('');
  const [category, setCategory] = useState("")
  const [errors, setErrors] = useState("")
  const handleSubmit = async () => {

    if(report.length == 0 || category.length == 0){
      return setErrors("All fields are required.")
    }
    const {error} = await supabase.from("Reports")
    .insert({report, category})

    if(!error) {
      setReport("")
      setCategory("")
      setErrors("")
      return showToast("Successfully Submitted.", "green")
    }

    showToast("Failed, Internal Error occurred", "red")
  };

  return (
    
    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.innerContainer}>

          {errors.length > 0 && (<Text style={styles.errorText}>{errors}</Text>)}

          <Text style={styles.categoryText}>Select category of your report</Text>
      {
        Platform.OS == "android"
        ?
        <Picker
            selectedValue={category}
            style={styles.picker}
            onValueChange={value => setCategory(value)}
          >
              <Picker.Item  label="Select category" value="" />
              <Picker.Item  label="Report Account" value="Report Account" />
              <Picker.Item label="Report inappropriate activity" value="Report inappropriate activity" />
              <Picker.Item label="Complain about wePlugU" value="Complain about wePlugU" />
              <Picker.Item label="Others" value="Others" />
          </Picker>
        :
          <SelectList
            data={reportCategory}
            save="value"
            setSelected={ value => setCategory(value)}
          
          />
      }
          

          <TextInput
            style={styles.input}
            placeholder="Describe the concern or inappropriate activity..."
            multiline
            numberOfLines={5}
            value={report}
            onChangeText={(text) => setReport(text)}
          />
          <LargeButton color="blue" title="Submit Report" onPress={handleSubmit} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
export default ReportForm;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer:{
    padding: 10,
    marginTop:40,
    flexGrow:1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    height:120,
    marginTop:15,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  categoryText:{
    fontSize:17,
    fontWeight:'bold',
    marginBottom:2
  },
  picker:{
    backgroundColor: 'lightgrey',
  },
  errorText:{
    color: 'red',
    fontSize: 14,
    alignSelf:"center"
},
});


