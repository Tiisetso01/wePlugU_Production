import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const SubscriptionTermsScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Subscription Terms and Conditions</Text>
      <Text style={styles.subHeader}>Last Updated: September 09, 2023</Text>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>1. Acceptance of Terms</Text>
        <Text style={styles.sectionText}>
            These Subscription Terms and Conditions ("Terms") outline the agreement between you ("Subscriber" or "you") and wePlugU ("us") regarding your subscription to and use of our mobile application ("App").
            By subscribing to our App, you acknowledge that you have read, understood, and agree to abide by these Terms. 
            If you do not agree with these Terms, please refrain from using the App.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>2. Subscription Plans</Text>
        <Text style={styles.sectionText}>
          The subscription grants you access to premium features of our app for a specified period, as outlined in the app.
          We offer various subscription plans ("Plans") with different features and durations.
          The details of each Plan, including the subscription fees and features, will be provided within the App.
          {"\n"}
          Your subscription will be effective for the duration specified in the Plan you choose.
           The subscription period may be monthly, annually, or as otherwise indicated.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>3. Payment and Billing</Text>
        <Text style={styles.sectionText}>
        You agree to pay the subscription fee associated with the Plan you select.
         Payment will be charged to your chosen payment method upon confirmation of your subscription and subscriptions are not automatically renewed on an android at the end of each subscription period, you need to manually resubscribe to gain access to premium features or content.
         But on Iphone subscriptions are automatically renewed at the end of billing period unless canceled. 
        </Text>
        <Text style={styles.sectionText}></Text>
      </View>


      <View style={styles.section}>
        <Text style={styles.sectionHeader}>4. Refunds and Cancellation</Text>
        <Text style={styles.sectionText}>
            Refunds: Subscription fees are non-refundable except where required by applicable laws.
        </Text>
        <Text style={styles.sectionText}>
          <Text style={{fontWeight:"bold"}}>Cancellation Policy:</Text> You can cancel your subscription at any time. The cancellation will take effect at the end of the current billing period.
        </Text>
        <Text style={styles.sectionText}>
          <Text style={{fontWeight:"bold"}}>No Refund for Mid-Cycle Cancellation:</Text> If you cancel your subscription before the end of the current billing cycle, you will not receive a refund for the remaining days of that cycle.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>5. Changes to Terms and App</Text>
        <Text style={styles.sectionText}>
            Changes to Terms: We reserve the right to modify these Terms at any time. 
            Changes will be effective upon posting within the App. It is your responsibility to review these Terms regularly.
        </Text>
        <Text style={styles.sectionText}>
            Changes to App: We reserve the right to modify, suspend, or discontinue any part of the App or its features at any time without notice.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>6. Contacts</Text>
        <Text style={styles.sectionText}>
          For any questions, concerns, or inquiries regarding these Subscription Terms and Conditions, please contact us at:
            <Text style={styles.contacts}> weplugu.help@gmail.com</Text>
        </Text>
      </View>

      {/* Add more sections for different terms as needed */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical:20,
    paddingHorizontal:10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    marginBottom:3
  },
  contacts:{
    fontWeight:"bold",
    color:"blue"
  }
});

export default SubscriptionTermsScreen;
