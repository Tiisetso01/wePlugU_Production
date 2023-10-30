import { StyleSheet, Text, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import React from 'react';

const SearcheableDropDown = () => {
    const [selected, setSelected] = React.useState("");
    const data = [
        {key:'1', value:'UP'},
        {key:'2', value:'UCT'},
        {key:'3', value:'WITS'},
        {key:'4', value:'UL'},
        {key:'5', value:'SU'},
        {key:'6', value:'SMU'},
        {key:'7', value:'UKZN'},
    
    ]
  
    return(
      <SelectList 
          setSelected={(val) => setSelected(val)} 
          data={data} 
          save="value"
      />
    )
 
}

export default SearcheableDropDown;

const styles = StyleSheet.create({})


