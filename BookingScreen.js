import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QRCode from 'react-native-qrcode-svg';
import {eventService} from '../services/EventService';

const BookingScreen = ({route, navigation}) => {
  const {event} = route.params;
  const [selectedTicketType, setSelectedTicketType] = useState('general');
  const [quantity, setQuantity] = useState(1);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const ticketTypes = [
    {
      id: 'general',
      name: 'General Admission',
      price: event.price.min,
      description: 'Standard access to the event',
    },
    {
      id: 'vip',
      name: 'VIP Pass',
      price: event.price.max,
      description: 'Premium access with exclusive benefits',
    },
  ];

  const paymentMethods = [
    {id: 'card', name: 'Credit Card', icon: 'credit-card'},
    {id: 'paypal', name: 'PayPal', icon: 'payment'},
    {id: 'apple', name: 'Apple Pay', icon: 'phone-iphone'},
    {id: 'google', name: 'Google Pay', icon: 'android'},
  ];

  const selectedTicket = ticketTypes.find(t => t.id === selectedTicketType);
  const totalAmount = selectedTicket.price * quantity;

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleQuantityChange = delta => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const validateForm = () => {
    if (!userInfo.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!userInfo.email.trim() || !userInfo.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!userInfo.phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }
    return true;
  };

  const handleBooking = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const booking = await eventService.bookEvent(
        event.id,
        quantity,
        selectedTicketType
      );

      setBookingDetails({
        ...booking,
        event,
        selectedTicket,
        quantity,
        totalAmount,
        userInfo,
      });
      setBookingComplete(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to book tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    navigation.navigate('HomeMain');
  };

  if (bookingComplete) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.successContainer}>
          <Icon name="check-circle" size={80} color="#10b981" />
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Your tickets have been booked successfully
          </Text>

          {/* QR Code */}
          <View style={styles.qrContainer}>
            <QRCode
              value={bookingDetails.qrCode}
              size={120}
              backgroundColor="white"
              color="black"
            />
            <Text style={styles.qrText}>Show this QR code at the event</Text>
          </View>

          {/* Booking Details */}
          <View style={styles.detailsCard}>
            <Text style={styles.cardTitle}>Booking Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Event:</Text>
              <Text style={styles.detailValue}>{event.name}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date & Time:</Text>
              <Text style={styles.detailValue}>
                {formatDate(event.startDateTime)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailValue}>{event.venue.name}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Ticket Type:</Text>
              <Text style={styles.detailValue}>{selectedTicket.name}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Quantity:</Text>
              <Text style={styles.detailValue}>{quantity} ticket(s)</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>${totalAmount}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Booking ID:</Text>
              <Text style={styles.detailValue}>{bookingDetails.id}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Event Summary */}
      <View style={styles.eventSummary}>
        <Text style={styles.eventName}>{event.name}</Text>
        <Text style={styles.eventDate}>{formatDate(event.startDateTime)}</Text>
        <Text style={styles.eventLocation}>{event.venue.name}</Text>
      </View>

      {/* Ticket Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Ticket Type</Text>
        {ticketTypes.map(ticket => (
          <TouchableOpacity
            key={ticket.id}
            style={[
              styles.ticketOption,
              selectedTicketType === ticket.id && styles.selectedTicketOption,
            ]}
            onPress={() => setSelectedTicketType(ticket.id)}>
            <View style={styles.ticketInfo}>
              <Text style={styles.ticketName}>{ticket.name}</Text>
              <Text style={styles.ticketDescription}>{ticket.description}</Text>
            </View>
            <View style={styles.ticketPrice}>
              <Text style={styles.priceText}>${ticket.price}</Text>
              {selectedTicketType === ticket.id && (
                <Icon name="check-circle" size={24} color="#6366f1" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quantity Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quantity</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(-1)}>
            <Icon name="remove" size={24} color="#6366f1" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(1)}>
            <Icon name="add" size={24} color="#6366f1" />
          </TouchableOpacity>
        </View>
      </View>

      {/* User Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Information</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={userInfo.name}
          onChangeText={text => setUserInfo({...userInfo, name: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={userInfo.email}
          onChangeText={text => setUserInfo({...userInfo, email: text})}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={userInfo.phone}
          onChangeText={text => setUserInfo({...userInfo, phone: text})}
          keyboardType="phone-pad"
        />
      </View>

      {/* Payment Method */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        {paymentMethods.map(method => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentOption,
              paymentMethod === method.id && styles.selectedPaymentOption,
            ]}
            onPress={() => setPaymentMethod(method.id)}>
            <View style={styles.paymentInfo}>
              <Icon name={method.icon} size={24} color="#6366f1" />
              <Text style={styles.paymentName}>{method.name}</Text>
            </View>
            {paymentMethod === method.id && (
              <Icon name="check-circle" size={24} color="#6366f1" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {selectedTicket.name} x {quantity}
            </Text>
            <Text style={styles.summaryValue}>
              ${selectedTicket.price * quantity}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Fee</Text>
            <Text style={styles.summaryValue}>$5</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${totalAmount + 5}</Text>
          </View>
        </View>
      </View>

      {/* Book Button */}
      <TouchableOpacity
        style={[styles.bookButton, loading && styles.disabledButton]}
        onPress={handleBooking}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.bookButtonText}>Book Tickets - ${totalAmount + 5}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  eventSummary: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  ticketOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedTicketOption: {
    borderColor: '#6366f1',
    backgroundColor: '#f0f9ff',
  },
  ticketInfo: {
    flex: 1,
  },
  ticketName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  ticketDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  ticketPrice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
    marginRight: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 8,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 32,
    color: '#1f2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedPaymentOption: {
    borderColor: '#6366f1',
    backgroundColor: '#f0f9ff',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentName: {
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 12,
  },
  summaryCard: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1f2937',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  bookButton: {
    backgroundColor: '#6366f1',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  successContainer: {
    padding: 24,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  qrText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 16,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    marginBottom: 24,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#1f2937',
    flex: 2,
    textAlign: 'right',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10b981',
    flex: 2,
    textAlign: 'right',
  },
  doneButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default BookingScreen;
