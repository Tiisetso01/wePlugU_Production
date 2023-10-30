// AboutScreen.js

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import * as Linking from 'expo-linking';
const AboutScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>About Us</Text>
      <Button
        title="Click for Privacy Policy"
        onPress={() => Linking.openURL('https://tiisetso01.github.io/weplugu/')}
        style={styles.button}
      />
      <Text style={styles.description}>
        {/* Replace this with your app/company description */}
        
        Our foremost objective is to create centralized platform, for students across South Africa, 
        from both universities and colleges, where they can easily advertise their products and services to other fellow students or 
        find products and services they need, such as textbooks, stationery, housing/accomodations, or even academic assistance and so many more.
        Additionally, we extend this opportunity to small businesses located in proximity/near to universities, allowing them to advertise their products and services to the student community.
        {"\n"}{'\n'}
        Our envisioned platform seeks to streamline the process of locating desired products 
        and services for students in their respective areas or cities of study, easing the burden of search and enhancing convenience. 
        {"\n"}{'\n'}
        Moreover, we are committed to promoting a culture of altruism and sustainability. To achieve this, we afford students the opportunity to donate items they no longer require,
        such as books, clothes and toiletries , to fellow students in need.
        {"\n"}{'\n'}
        By centralizing these interactions, we aim to nurture a strong sense of community and support among students throughout the nation. Our platform is designed with user-friendliness in mind, ensuring that it is intuitive 
        and accessible to all users. We prioritize the safety and privacy of our users, implementing robust security measures to safeguard their personal information and ensure secure transactions.
        {"\n"}{'\n'}
        To maintain the credibility and reliability of our platform, we have established a thorough verification process for donations and specific services. Additionally,
         we exercise vigilant content moderation and offer a reporting system to promptly address any concerns or inappropriate activities that may arise.
        {"\n"}{'\n'}
        We are looking forward to request collaboration with educational institutions and local businesses, to spread awareness about our platform,
        creating a widespread network that benefits the entire student community.
        Constructive feedback from our users is highly valued, as it enables us to continuously enhance the functionality and user experience of the platform.
        {"\n"}{'\n'}.................................................................
        Ultimately, our aspiration is to create a profound social impact by fostering a supportive and collaborative environment, enriching the lives of students and promoting a sense of unity among peers. 
        Through our commitment to professionalism and excellence, we strive to be a reliable and invaluable resource for students across South Africa.
        {"\n"}{'\n'}

      </Text>
      <View style={styles.benefitsContainer}>
        <Text style={styles.benefitsHeader}>wePlugU Platform can be beneficial in several ways:</Text>
        <View style={styles.benefitsView}>
          <Text style={styles.benefitsSubHeader}>Convenience for Students: </Text>
          <Text style={styles.benefitsText}>centralized platform, where students can easily advertise or find products and services they need. It saves them time and effort in searching for these resources.</Text>
        </View>
        <View style={styles.benefitsView}>
          <Text style={styles.benefitsSubHeader}>Supporting Local Businesses: </Text>
          <Text style={styles.benefitsText}>Allowing small businesses near universities to advertise their products and
           services on our platform can help them reach their target audience more effectively. This can foster a mutually beneficial relationship between students and local businesses.</Text>
        </View>

        <View style={styles.benefitsView}>
          <Text style={styles.benefitsSubHeader}>Promoting Sustainability and Giving Back: </Text>
          <Text style={styles.benefitsText}>The option for students to donate items they no longer need fosters a culture of sustainability and altruism within the student community.
             It can help reduce waste and support students who might be in difficult financial situations.</Text>
        </View>

        <View style={styles.benefitsView}>
          <Text style={styles.benefitsSubHeader}>Community Building: </Text>
          <Text style={styles.benefitsText}>our platform can contribute to creating a strong sense of community among students. 
            It enables them to interact, collaborate, and help each other, fostering a positive and supportive environment.</Text>
        </View>

        <View style={styles.benefitsView}>
          <Text style={styles.benefitsSubHeader}>Social Impact: </Text>
          <Text style={styles.benefitsText}>
          By facilitating donations and
           connecting students in need with those willing to help, your platform can have a significant social impact, making a difference in the lives of those facing challenges.
          </Text>
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
  },
  header: {
    fontSize: 24,
    alignSelf:'center',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  description: {
    fontSize:16,
    marginTop:15
  },
  benefitsContainer:{

  },
  benefitsView:{
    marginBottom:5,
    //flexDirection:'row',

  },
  benefitsText:{
    fontSize:16
  },
  benefitsSubHeader:{
    fontWeight:'bold',
    fontSize:16
  },
  benefitsHeader:{
    fontWeight:'bold',
    fontSize:18,
    marginBottom:10
  }
});

export default AboutScreen;
