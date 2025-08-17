import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
  Linking,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import MapView, {Marker} from 'react-native-maps';

const {width, height} = Dimensions.get('window');

const EventDetailsScreen = ({route, navigation}) => {
  const {event} = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = dateString => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = price => {
    if (price.min === 0 && price.max === 0) {
      return 'Free';
    }
    if (price.min === price.max) {
      return `$${price.min}`;
    }
    return `$${price.min} - $${price.max}`;
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this event: ${event.name} on ${formatDate(event.startDateTime)}`,
        title: event.name,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share event');
    }
  };

  const handleBooking = () => {
    navigation.navigate('Booking', {event});
  };

  const handleCall = () => {
    Linking.openURL(`tel:${event.contactInfo.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${event.contactInfo.email}`);
  };

  const handleAddToCalendar = () => {
    Alert.alert(
      'Add to Calendar',
      'This feature would integrate with the device calendar',
      [{text: 'OK'}]
    );
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Here you would typically save to AsyncStorage or API
  };

  const renderStars = rating => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={i} name="star" size={16} color="#FFD700" />);
    }

    if (hasHalfStar) {
      stars.push(<Icon key="half" name="star-half" size={16} color="#FFD700" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="star-border" size={16} color="#FFD700" />
      );
    }

    return stars;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hero Image */}
      <View style={styles.heroContainer}>
        <Image source={{uri: event.image}} style={styles.heroImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.heroGradient}>
          <View style={styles.heroActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={toggleFavorite}>
              <Icon
                name={isFavorite ? 'favorite' : 'favorite-border'}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Icon name="share" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Event Info */}
      <View style={styles.content}>
        {/* Category and Status */}
        <View style={styles.headerRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
          {event.isFeatured && (
            <View style={styles.featuredBadge}>
              <Icon name="star" size={16} color="#fff" />
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
        </View>

        {/* Title and Rating */}
        <Text style={styles.title}>{event.name}</Text>
        <View style={styles.ratingRow}>
          <View style={styles.stars}>{renderStars(event.rating)}</View>
          <Text style={styles.ratingText}>{event.rating} ({event.attendees} attending)</Text>
        </View>

        {/* Price */}
        <Text style={styles.price}>{formatPrice(event.price)}</Text>

        {/* Date and Time */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Icon name="event" size={24} color="#6366f1" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Date & Time</Text>
              <Text style={styles.infoText}>{formatDate(event.startDateTime)}</Text>
              <Text style={styles.infoSubtext}>
                {formatTime(event.startDateTime)} - {formatTime(event.endDateTime)}
              </Text>
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Icon name="location-on" size={24} color="#6366f1" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Location</Text>
              <Text style={styles.infoText}>{event.venue.name}</Text>
              <Text style={styles.infoSubtext}>{event.venue.address}</Text>
              <Text style={styles.capacityText}>
                Capacity: {event.venue.capacity} people
              </Text>
            </View>
          </View>
        </View>

        {/* Map */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Map</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 43.0389, // Milwaukee coordinates as example
                longitude: -87.9065,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
              <Marker
                coordinate={{
                  latitude: 43.0389,
                  longitude: -87.9065,
                }}
                title={event.venue.name}
                description={event.venue.address}
              />
            </MapView>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        {/* Organizer */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Icon name="business" size={24} color="#6366f1" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Organizer</Text>
              <Text style={styles.infoText}>{event.organizer}</Text>
              <View style={styles.contactRow}>
                <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
                  <Icon name="phone" size={16} color="#6366f1" />
                  <Text style={styles.contactText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactButton} onPress={handleEmail}>
                  <Icon name="email" size={16} color="#6366f1" />
                  <Text style={styles.contactText}>Email</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Event Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagsContainer}>
            {event.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Age Restriction */}
        {event.ageRestriction && (
          <View style={styles.section}>
            <View style={styles.warningContainer}>
              <Icon name="warning" size={20} color="#f59e0b" />
              <Text style={styles.warningText}>Age Restriction: {event.ageRestriction}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.calendarButton} onPress={handleAddToCalendar}>
          <Icon name="event-available" size={20} color="#6366f1" />
          <Text style={styles.calendarButtonText}>Add to Calendar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
          <Text style={styles.bookButtonText}>Book Tickets</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroContainer: {
    height: height * 0.4,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  heroActions: {
    position: 'absolute',
    top: -height * 0.25,
    right: 16,
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  featuredBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#6b7280',
  },
  capacityText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  contactRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  contactText: {
    fontSize: 12,
    color: '#6366f1',
    marginLeft: 4,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#374151',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#92400e',
    marginLeft: 8,
    fontWeight: '500',
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  calendarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  calendarButtonText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
    marginLeft: 8,
  },
  bookButton: {
    flex: 2,
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  bookButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default EventDetailsScreen;
