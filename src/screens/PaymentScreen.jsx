import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PaymentMethodCard = ({ method, isSelected, onSelect }) => (
  <TouchableOpacity
    style={[styles.paymentMethodCard, isSelected && styles.selectedPaymentMethod]}
    onPress={onSelect}
  >
    <View style={styles.paymentMethodInfo}>
      <View style={styles.paymentMethodIcon}>
        <Ionicons
          name={method.icon}
          size={24}
          color={isSelected ? '#6366f1' : '#64748b'}
        />
      </View>
      <View style={styles.paymentMethodDetails}>
        <Text style={[styles.paymentMethodName, isSelected && styles.selectedPaymentMethodText]}>
          {method.name}
        </Text>
        <Text style={[styles.paymentMethodDescription, isSelected && styles.selectedPaymentMethodText]}>
          {method.description}
        </Text>
      </View>
    </View>
    {isSelected && (
      <View style={styles.selectedIndicator}>
        <Ionicons name="checkmark-circle" size={24} color="#6366f1" />
      </View>
    )}
  </TouchableOpacity>
);

export default function PaymentScreen({ route, navigation }) {
  const { contest } = route.params;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: 'card-outline',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: 'logo-paypal',
    },
    {
      id: 'applepay',
      name: 'Apple Pay',
      description: 'Quick and secure payment',
      icon: 'logo-apple',
    },
  ];

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const match = cleaned.match(/(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?/);
    if (match) {
      const parts = [match[1], match[2], match[3], match[4]].filter(Boolean);
      return parts.join(' ');
    }
    return text;
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const validateForm = () => {
    if (selectedPaymentMethod === 'card') {
      if (!cardNumber.replace(/\s/g, '') || cardNumber.replace(/\s/g, '').length < 16) {
        Alert.alert('Error', 'Please enter a valid card number');
        return false;
      }
      if (!expiryDate || expiryDate.length < 5) {
        Alert.alert('Error', 'Please enter a valid expiry date');
        return false;
      }
      if (!cvv || cvv.length < 3) {
        Alert.alert('Error', 'Please enter a valid CVV');
        return false;
      }
      if (!cardholderName.trim()) {
        Alert.alert('Error', 'Please enter the cardholder name');
        return false;
      }
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Payment Successful!',
        'You have successfully joined the contest. Good luck!',
        [
          {
            text: 'Continue to Contest',
            onPress: () => navigation.navigate('ContestPlay', { contest }),
          },
        ]
      );
    }, 2000);
  };

  const renderPaymentForm = () => {
    if (selectedPaymentMethod === 'card') {
      return (
        <View style={styles.paymentForm}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Card Number</Text>
            <TextInput
              style={styles.textInput}
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              placeholder="1234 5678 9012 3456"
              keyboardType="numeric"
              maxLength={19}
            />
          </View>
          
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 12 }]}>
              <Text style={styles.formLabel}>Expiry Date</Text>
              <TextInput
                style={styles.textInput}
                value={expiryDate}
                onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                placeholder="MM/YY"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.formLabel}>CVV</Text>
              <TextInput
                style={styles.textInput}
                value={cvv}
                onChangeText={setCvv}
                placeholder="123"
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Cardholder Name</Text>
            <TextInput
              style={styles.textInput}
              value={cardholderName}
              onChangeText={setCardholderName}
              placeholder="John Doe"
              autoCapitalize="words"
            />
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Payment Details</Text>
            <Text style={styles.headerSubtitle}>
              Complete your payment to join "{contest.title}"
            </Text>
          </View>

          <View style={styles.contestSummary}>
            <View style={styles.contestInfo}>
              <Text style={styles.contestTitle}>{contest.title}</Text>
              <Text style={styles.contestCategory}>{contest.category}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Entry Fee</Text>
              <Text style={styles.priceAmount}>${contest.entryFee}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            {paymentMethods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                isSelected={selectedPaymentMethod === method.id}
                onSelect={() => setSelectedPaymentMethod(method.id)}
              />
            ))}
          </View>

          {renderPaymentForm()}

          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Entry Fee</Text>
              <Text style={styles.totalValue}>${contest.entryFee}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Processing Fee</Text>
              <Text style={styles.totalValue}>$0.50</Text>
            </View>
            <View style={[styles.totalRow, styles.finalTotalRow]}>
              <Text style={styles.finalTotalLabel}>Total</Text>
              <Text style={styles.finalTotalValue}>
                ${(contest.entryFee + 0.5).toFixed(2)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <View style={styles.processingContainer}>
                <Text style={styles.processingText}>Processing...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.payButtonText}>
                  Pay ${(contest.entryFee + 0.5).toFixed(2)}
                </Text>
                <Ionicons name="lock-closed" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.securityNote}>
            <Ionicons name="shield-checkmark" size={16} color="#10b981" />
            <Text style={styles.securityText}>
              Your payment information is secure and encrypted
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  contestSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  contestInfo: {
    flex: 1,
  },
  contestTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  contestCategory: {
    fontSize: 14,
    color: '#64748b',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  selectedPaymentMethod: {
    borderColor: '#6366f1',
    backgroundColor: '#f8fafc',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  paymentMethodDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  selectedPaymentMethodText: {
    color: '#6366f1',
  },
  selectedIndicator: {
    marginLeft: 16,
  },
  paymentForm: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  totalSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 24,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  totalValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  finalTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
    marginTop: 8,
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  finalTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 18,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonDisabled: {
    backgroundColor: '#a5b4fc',
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  processingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  securityText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
    textAlign: 'center',
  },
});
