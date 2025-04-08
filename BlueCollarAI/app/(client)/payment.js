import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

export default function Payment({ route }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  // Mock job details that would come from route params
  const jobDetails = {
    title: 'Fix Leaking Bathroom Pipe',
    worker: 'John Smith',
    hours: 3,
    rate: 75,
    serviceFee: 15,
  };

  const subtotal = jobDetails.hours * jobDetails.rate;
  const total = subtotal + jobDetails.serviceFee;

  const handlePayment = () => {
    console.log('Processing payment...');
    // Implement payment processing logic
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Summary</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.jobTitle}>{jobDetails.title}</Text>
          <Text style={styles.workerName}>Worker: {jobDetails.worker}</Text>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Hours worked</Text>
            <Text style={styles.value}>{jobDetails.hours} hrs</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Hourly rate</Text>
            <Text style={styles.value}>${jobDetails.rate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>${subtotal}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Service fee</Text>
            <Text style={styles.value}>${jobDetails.serviceFee}</Text>
          </View>
          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${total}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={styles.input}
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              placeholder="1234 5678 9012 3456"
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                value={expiryDate}
                onChangeText={setExpiryDate}
                placeholder="MM/YY"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={styles.input}
                value={cvv}
                onChangeText={setCvv}
                placeholder="123"
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
            />
          </View>

          <TouchableOpacity
            style={styles.saveCardRow}
            onPress={() => setSaveCard(!saveCard)}
          >
            <MaterialIcons
              name={saveCard ? 'check-box' : 'check-box-outline-blank'}
              size={24}
              color="#1A2A44"
            />
            <Text style={styles.saveCardText}>Save card for future payments</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Pay ${total}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A2A44',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A2A44',
    marginBottom: 4,
  },
  workerName: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#4A5568',
  },
  value: {
    fontSize: 16,
    color: '#2D3748',
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A2A44',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A2A44',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5568',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  saveCardText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4A5568',
  },
  payButton: {
    backgroundColor: '#1A2A44',
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
