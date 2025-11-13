import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Switch,
} from 'react-native';

const RestaurantInfo = () => {
  const [ownerName, setOwnerName] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [hasSameTimings, setHasSameTimings] = useState(true);
  const [openingTime, setOpeningTime] = useState('10:00 AM');
  const [closingTime, setClosingTime] = useState('11:00 PM');
  const [selectedDays, setSelectedDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  });
  const [panNumber, setPanNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [fssaiNumber, setFssaiNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const toggleDay = (day) => {
    setSelectedDays({
      ...selectedDays,
      [day]: !selectedDays[day],
    });
  };

  const toggleAllDays = (value) => {
    setSelectedDays({
      monday: value,
      tuesday: value,
      wednesday: value,
      thursday: value,
      friday: value,
      saturday: value,
      sunday: value,
    });
  };

  const handleProceed = () => {
    // Handle form submission
    console.log({
      ownerName,
      restaurantName,
      location,
      email,
      phone,
      whatsapp,
      hasSameTimings,
      openingTime,
      closingTime,
      selectedDays,
      panNumber,
      gstNumber,
      fssaiNumber,
      accountNumber,
      accountHolderName,
      ifscCode,
      acceptTerms,
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Basic Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Restaurant Information</Text>
        <View style={styles.sectionContent}>
          <Text style={styles.subsectionTitle}>Basic Details</Text>
          
          <Text style={styles.label}>Owner Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Full Name"
            value={ownerName}
            onChangeText={setOwnerName}
          />

          <Text style={styles.label}>Restaurant Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your restaurant name"
            value={restaurantName}
            onChangeText={setRestaurantName}
          />

          <Text style={styles.label}>Restaurant Location</Text>
          <View style={styles.locationInputContainer}>
            <TextInput
              style={[styles.input, styles.locationInput]}
              placeholder="Enter your restaurant location"
              value={location}
              onChangeText={setLocation}
            />
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Owner Contact Details Section */}
      <View style={styles.section}>
        <View style={styles.sectionContent}>
          <Text style={styles.subsectionTitle}>Owner contact detail</Text>
          
          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email id"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Mobile number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your mobile number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.label}>WhatsApp Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your WhatsApp number"
            keyboardType="phone-pad"
            value={whatsapp}
            onChangeText={setWhatsapp}
          />
        </View>
      </View>

      {/* Working Days Section */}
      <View style={styles.section}>
        <View style={styles.sectionContent}>
          <View style={styles.workingDaysHeader}>
            <Text style={styles.subsectionTitle}>Working Day</Text>
            <TouchableOpacity onPress={() => toggleAllDays(true)}>
              <Text style={styles.selectAllText}>Select all</Text>
            </TouchableOpacity>
          </View>
          
          {Object.entries(selectedDays).map(([day, isSelected]) => (
            <View key={day} style={styles.dayRow}>
              <TouchableOpacity 
                style={[styles.checkbox, isSelected && styles.checkboxSelected]}
                onPress={() => toggleDay(day)}
              >
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <Text style={styles.dayText}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Opening & Closing Time Section */}
      <View style={styles.section}>
        <View style={styles.sectionContent}>
          <Text style={styles.subsectionTitle}>Opening & Closing time</Text>
          
          <View style={styles.timeOptionRow}>
            <TouchableOpacity 
              style={[styles.radioButton, hasSameTimings && styles.radioButtonSelected]}
              onPress={() => setHasSameTimings(true)}
            >
              {hasSameTimings && <View style={styles.radioButtonInner} />}
            </TouchableOpacity>
            <Text style={styles.radioLabel}>
              I open and close my restaurant at the same time on all working days.
            </Text>
          </View>

          <View style={styles.timeOptionRow}>
            <TouchableOpacity 
              style={[styles.radioButton, !hasSameTimings && styles.radioButtonSelected]}
              onPress={() => setHasSameTimings(false)}
            >
              {!hasSameTimings && <View style={styles.radioButtonInner} />}
            </TouchableOpacity>
            <Text style={styles.radioLabel}>
              I have separate day-wise timings.
            </Text>
          </View>

          {!hasSameTimings ? (
            <View style={styles.dayTimeContainer}>
              {Object.entries(selectedDays).map(([day, isSelected]) => (
                isSelected && (
                  <View key={`${day}-time`} style={styles.dayTimeRow}>
                    <Text style={styles.dayTimeLabel}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </Text>
                    <View style={styles.timeInputsContainer}>
                      <TouchableOpacity style={styles.timeInput}>
                        <Text>{openingTime}</Text>
                      </TouchableOpacity>
                      <Text>to</Text>
                      <TouchableOpacity style={styles.timeInput}>
                        <Text>{closingTime}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              ))}
            </View>
          ) : (
            <View style={styles.sameTimeContainer}>
              <View style={styles.timeDisplay}>
                <Text>{openingTime}</Text>
              </View>
              <Text>to</Text>
              <View style={styles.timeDisplay}>
                <Text>{closingTime}</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Documents Section */}
      <View style={styles.section}>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Restaurant Documents</Text>
          
          <Text style={styles.subsectionTitle}>Enter PAN & GSTIN details</Text>
          
          <Text style={styles.label}>PAN Holder Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter PAN Holder Name"
            value={accountHolderName}
            onChangeText={setAccountHolderName}
          />
          
          <Text style={styles.label}>Business/Owner PAN</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter PAN Number"
            value={panNumber}
            onChangeText={setPanNumber}
            maxLength={10}
            autoCapitalize="characters"
          />
          
          <Text style={styles.label}>GST Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter GST Number"
            value={gstNumber}
            onChangeText={setGstNumber}
          />
          
          <View style={styles.checkboxRow}>
            <TouchableOpacity 
              style={[styles.checkbox, !gstNumber && styles.checkboxSelected]}
              onPress={() => setGstNumber('')}
            >
              {!gstNumber && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>I don't have a GST Number.</Text>
          </View>
        </View>
      </View>

      {/* Bank Details Section */}
      <View style={styles.section}>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Official Bank Details</Text>
          <Text style={styles.bankInfoText}>
            Payments from Taste And Trial will be credited here.
          </Text>
          
          <Text style={styles.label}>Bank Account Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Bank Account Number"
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="numeric"
          />
          
          <Text style={styles.label}>Account Holder Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Account Holder Name"
            value={accountHolderName}
            onChangeText={setAccountHolderName}
          />
          
          <Text style={styles.label}>IFSC Code</Text>
          <TextInput
            style={styles.input}
            placeholder="IFSC code"
            value={ifscCode}
            onChangeText={setIfscCode}
            autoCapitalize="characters"
          />
        </View>
      </View>

      {/* FSSAI Section */}
      <View style={styles.section}>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>FSSAI Certificate</Text>
          
          <Text style={styles.label}>FSSAI Certificate Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your FSSAI Number"
            value={fssaiNumber}
            onChangeText={setFssaiNumber}
          />
          
          <View style={styles.fssaiHelpRow}>
            <Text style={styles.fssaiHelpText}>FSSAI certificate unavailable/expired?</Text>
            <TouchableOpacity>
              <Text style={styles.clickHereText}>Click Here</Text>
              <View style={styles.underline} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Terms & Conditions */}
      <View style={styles.termsSection}>
        <Text style={styles.termsTitle}>If your FSSAI certificate unavailable/expired?</Text>
        <Text style={styles.termsText}>
          If you don't have any FSSAI Number. Then you'll have to upload it within 30 days. 
          Or the registration for the restaurant might get cancelled.
        </Text>
        
        <View style={styles.termsCheckboxRow}>
          <TouchableOpacity 
            style={[styles.checkbox, acceptTerms && styles.checkboxSelected]}
            onPress={() => setAcceptTerms(!acceptTerms)}
          >
            {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.termsCheckboxLabel}>I accept the term & conditions</Text>
        </View>
      </View>

      {/* Proceed Button */}
      <TouchableOpacity 
        style={[styles.proceedButton, !acceptTerms && styles.proceedButtonDisabled]}
        onPress={handleProceed}
        disabled={!acceptTerms}
      >
        <Text style={styles.proceedButtonText}>Proceed</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionContent: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#444',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInput: {
    flex: 1,
    marginRight: 8,
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  workingDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectAllText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  timeOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#007AFF',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  radioLabel: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  sameTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  timeDisplay: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  dayTimeContainer: {
    marginTop: 16,
  },
  dayTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayTimeLabel: {
    fontSize: 14,
    color: '#333',
    minWidth: 100,
  },
  timeInputsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 16,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  bankInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  fssaiHelpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  fssaiHelpText: {
    fontSize: 14,
    color: '#666',
  },
  clickHereText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  underline: {
    height: 1,
    backgroundColor: '#007AFF',
  },
  termsSection: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  termsCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  termsCheckboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  proceedButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  proceedButtonDisabled: {
    backgroundColor: '#a0c4ff',
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RestaurantInfo;
