import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Modal, 
  Alert, // <-- Kept for the new helper
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Platform // <-- 1. Import Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { supabase } from "./lib/supabaseClient"; 

// --- 2. New Cross-Platform Alert Function ---
const showAppAlert = (title, message) => {
  if (Platform.OS === 'web') {
    alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message); // Use native Alert for mobile
  }
};

// --- Helper function to get future date as YYYY-MM-DD ---
const getFutureDate = (daysToAdd) => {
  const today = new Date();
  today.setDate(today.getDate() + daysToAdd);
  
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const dd = String(today.getDate()).padStart(2, '0');
  
  return `${yyyy}-${mm}-${dd}`;
};

const CreateLoanScreen = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [loanName, setLoanName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(getFutureDate(21)); // <-- Set default 21 days from now
  const [repayments, setRepayments] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  // Fetch subscription type from database
  useEffect(() => {
    const fetchSubscriptionType = async () => {
      try {
        // TODO: Replace with your actual API endpoint or Supabase call
        const response = await fetch('https://your-api.com/user-subscription');
        const data = await response.json();
        setSubscriptionType(data.subscriptionType); // Expecting 'basic' or 'premium'
      } catch (error) {
        console.error('Error fetching subscription:', error);
        setSubscriptionType('basic'); // Default to basic if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionType();
  }, []);

  const maxAmount = subscriptionType === 'premium' ? 2000 : 500;

  const handleImageUpload = async () => {
    // --- 3. Bypassed Auth Check for Testing ---
    // const { data: { user } } = await supabase.auth.getUser();
    // if (!user) {
    //   showAppAlert("Login Required", "You must be logged in to upload an image.");
    //   return;
    // }

    // Request camera roll permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showAppAlert('Sorry, we need camera roll permissions to make this work!'); // <-- Use new alert
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, // Lower quality for faster uploads
    });

    if (!result.canceled) {
      setProfilePic({ uri: result.assets[0].uri });
    }
  };

  const handleAmountChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue === '') {
        setAmount('');
        return;
    }
    
    let num = parseInt(numericValue, 10);

    if (num > maxAmount) {
      showAppAlert("Amount Limit Exceeded", `Your subscription plan allows a maximum of $${maxAmount}.`); // <-- Use new alert
      setAmount(maxAmount.toString());
    } else {
      setAmount(num.toString());
    }
  };
  
  const validateAmountOnBlur = () => {
      if (amount && parseInt(amount, 10) < 100) {
          showAppAlert("Invalid Amount", "The minimum loan amount is $100."); // <-- Use new alert
          setAmount('100');
      }
  };

  // --- New function to post data to Supabase ---
  const handlePostLoan = async () => {
    if (isSubmitting) return; // Prevent double-submit
    setIsSubmitting(true);

    try {
      // --- 1. Bypassed Get current user for Testing ---
      // const { data: { user } } = await supabase.auth.getUser();
      // if (!user) {
      //   // This was the silent error!
      //   throw new Error("You must be logged in to create a loan.");
      // }
      
      // TODO: Image Upload Logic
      // 1. Convert profilePic.uri to a blob
      // 2. Upload blob to Supabase Storage: `supabase.storage.from('avatars').upload(...)`
      // 3. Get the public URL: `supabase.storage.from('avatars').getPublicUrl(...)`
      // For now, we'll set it to null.
      const imageUrl = null; 

      // 2. Prepare the data for insertion
      const newLoan = {
        loan_name: loanName,
        category: category,
        loan_amount: parseFloat(amount),
        loan_description: description,
        deadline: new Date(deadline).toISOString(), // Format for Supabase timestamp
        repayment_term: parseInt(repayments, 10),
        amount_raised: 0, // Default for a new loan
        amount_left: parseFloat(amount), // Default for a new loan
        user_id: null, // <-- Set to null for testing (ensure your DB column allows this)
        profile_pic_url: imageUrl, 
        // We don't have customer_name, assuming it's in a separate 'profiles' table linked by user_id
      };
      
      // 3. Insert into the 'Loans' table
      const { error } = await supabase.from('Loans').insert(newLoan);

      if (error) {
        throw error;
      }

      // 4. Success!
      showAppAlert('Success!', 'Your loan has been posted successfully.'); // <-- Use new alert
      setModalVisible(false);
      clearForm();

    } catch (error) {
      console.error('Error posting loan:', error.message);
      showAppAlert('Error', `Failed to post loan: ${error.message}`); // <-- Use new alert
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Helper to clear the form ---
  const clearForm = () => {
    setProfilePic(null);
    setLoanName('');
    setCategory('');
    setAmount('');
    setDescription('');
    setDeadline(getFutureDate(21)); // <-- Also reset to default when clearing
    setRepayments('1');
  };

  // --- Validation before showing modal ---
  const handlePreview = () => {
    if (!loanName || !category || !amount || !description || !deadline) {
      showAppAlert('Missing Fields', 'Please fill out all fields to preview your loan.'); // <-- Use new alert
      return;
    }
    if (parseInt(amount, 10) < 100) {
        showAppAlert("Invalid Amount", "The minimum loan amount is $100."); // <-- Use new alert
        return;
    }
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00B300" />
        <Text style={{ color: 'white', marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create Loan</Text>
      
      {/* --- Added Requested Text --- */}
      <Text style={styles.subHeader}>
        Complete this form to request a P2P loan from our global community.
      </Text>

      <TouchableOpacity onPress={handleImageUpload} style={styles.imageUploader}>
        <Image 
          // Assuming blank-profile.jpg is in an 'assets' folder at the root
          // Path fixed from '/assets/' to './assets/'
          source={profilePic || require('./assets/blank-profile.jpg')}
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <Text style={styles.label}>Loan Name</Text>
      <TextInput 
        style={styles.input}
        placeholder="e.g., My Short Film Project"
        placeholderTextColor="#888"
        value={loanName}
        onChangeText={setLoanName}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerContainer}>
        <Picker 
          selectedValue={category} 
          onValueChange={(itemValue) => setCategory(itemValue)} 
          style={styles.picker}
          dropdownIconColor="#FFFFFF"
        >
          <Picker.Item label="Select a category..." value="" color="#888" />
          {['Medical', 'Career', 'Business', 'Holiday', 'Home', 'Wedding', 'Family', 'Car', 'Bills', 'Other'].map(cat => (
            <Picker.Item key={cat} label={cat} value={cat} color="#FFFFFF" />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Amount ($100 - ${maxAmount})</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="e.g., 500"
        placeholderTextColor="#888"
        value={amount}
        onChangeText={handleAmountChange}
        onBlur={validateAmountOnBlur}
      />

      <Text style={styles.label}>Description (Max 300)</Text>
      <TextInput 
        style={[styles.input, styles.textArea]}
        placeholder="Describe why you need this loan..."
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
        multiline
        maxLength={300}
      />

      <Text style={styles.label}>Deadline (e.g., 2024-12-31)</Text>
      <TextInput 
        style={styles.input}
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#888"
        value={deadline}
        onChangeText={setDeadline}
      />

      <Text style={styles.label}>Repayments</Text>
      <View style={styles.pickerContainer}>
        <Picker 
          selectedValue={repayments} 
          onValueChange={setRepayments} 
          style={styles.picker}
          dropdownIconColor="#FFFFFF"
        >
          {['1', '3', '6', '9'].map(month => (
            <Picker.Item key={month} label={`${month} months`} value={month} color="#FFFFFF" />
          ))}
        </Picker>
      </View>

      {/* --- Main Submit button just opens the modal --- */}
      <TouchableOpacity onPress={handlePreview} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Preview Loan</Text>
      </TouchableOpacity>

      {/* --- Confirmation Modal --- */}
      <Modal visible={modalVisible} transparent animationType='slide'>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Your Loan</Text>
            
            <Text style={styles.modalText}><Text style={styles.modalLabel}>Name:</Text> {loanName}</Text>
            <Text style={styles.modalText}><Text style={styles.modalLabel}>Category:</Text> {category}</Text>
            <Text style={styles.modalText}><Text style={styles.modalLabel}>Amount:</Text> ${amount}</Text>
            <Text style={styles.modalText}><Text style={styles.modalLabel}>Description:</Text> {description}</Text>
            <Text style={styles.modalText}><Text style={styles.modalLabel}>Deadline:</Text> {deadline}</Text>
            <Text style={styles.modalText}><Text style={styles.modalLabel}>Repayments:</Text> {repayments} months</Text>
            
            <View style={styles.modalButtonRow}>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)} 
                style={[styles.modalButton, styles.cancelButton]}
                disabled={isSubmitting}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={handlePostLoan} 
                style={[styles.modalButton, styles.confirmButton]}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalButtonText}>Confirm & Post</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// --- Added StyleSheet for cleaner code ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20
  },
  header: {
    color: '#00B300',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  subHeader: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10
  },
  imageUploader: {
    alignItems: 'center',
    marginBottom: 20
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: '#333'
  },
  label: {
    color: '#00B300',
    fontSize: 16,
    marginBottom: 5
  },
  input: {
    color: 'white',
    backgroundColor: '#333333',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  pickerContainer: {
    // --- 4. Style changes ---
    // Removed: backgroundColor, borderRadius, marginBottom
    justifyContent: 'center',
    marginBottom: 20, // Keep margin on the container
    borderRadius: 8, // Keep borderRadius on container
    backgroundColor: '#333333', // Keep backgroundColor on container
  },
  picker: {
    color: 'white',
    // --- 4. Style changes ---
    // Moved styles from pickerContainer here for web
    // backgroundColor: '#333333',
    // borderRadius: 8,
    // marginBottom: 20,
    paddingHorizontal: 15, // Match input
    paddingVertical: 12, // Match input
    fontSize: 16, // Match input
    borderWidth: 0, // Remove web default border
    height: 50, // Keep explicit height for picker
  },
  submitButton: {
    backgroundColor: '#00B300',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40 // Extra space at bottom
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  // --- Modal Styles ---
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContainer: {
    backgroundColor: '#282828',
    padding: 20,
    borderRadius: 10,
    width: '100%'
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  modalText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22
  },
  modalLabel: {
    color: '#00B300',
    fontWeight: 'bold'
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#555',
    marginRight: 10
  },
  confirmButton: {
    backgroundColor: '#00B300',
    marginLeft: 10
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default CreateLoanScreen;

