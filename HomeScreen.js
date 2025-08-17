import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {eventService} from '../services/EventService';

const {width} = Dimensions.get('window');

const HomeScreen = ({navigation}) => {
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
    loadCategories();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await eventService.getAllEvents();
      setEvents(eventsData);
      setFeaturedEvents(eventsData.filter(event => event.isFeatured));
    } catch (error) {
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = () => {
    const eventCategories = [
      'All',
      'Music',
      'Sports',
      'Technology',
      'Arts & Culture',
      'Food & Drink',
      'Networking',
      'Family',
      'Health & Wellness',
    ];
    setCategories(eventCategories);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
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

  const renderEventCard = ({item}) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetails', {event: item})}>
      <Image source={{uri: item.image}} style={styles.eventImage} />

      {/* Category Badge */}
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>

      {/* Favorite Button */}
      <TouchableOpacity style={styles.favoriteButton}>
        <Icon name="favorite-border" size={20} color="#fff" />
      </TouchableOpacity>

      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {item.name}
        </Text>

        <View style={styles.eventMeta}>
          <Icon name="access-time" size={16} color="#666" />
          <Text style={styles.metaText}>{formatDate(item.startDateTime)}</Text>
        </View>

        <View style={styles.eventMeta}>
          <Icon name="location-on" size={16} color="#666" />
          <Text style={styles.metaText} numberOfLines={1}>
            {item.venue.city}
          </Text>
        </View>

        <View style={styles.eventFooter}>
          <Text style={styles.priceText}>{formatPrice(item.price)}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFeaturedEvent = ({item}) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => navigation.navigate('EventDetails', {event: item})}>
      <Image source={{uri: item.image}} style={styles.featuredImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.featuredGradient}>
        <View style={styles.featuredInfo}>
          <Text style={styles.featuredTitle} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.featuredDate}>{formatDate(item.startDateTime)}</Text>
          <Text style={styles.featuredPrice}>{formatPrice(item.price)}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCategoryChip = ({item}) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item && styles.selectedCategoryChip,
      ]}
      onPress={() => setSelectedCategory(item)}>
      <Text
        style={[
          styles.categoryChipText,
          selectedCategory === item && styles.selectedCategoryChipText,
        ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={24} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Icon name="tune" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Events</Text>
          <FlatList
            horizontal
            data={featuredEvents}
            renderItem={renderFeaturedEvent}
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          />
        </View>
      )}

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          horizontal
          data={categories}
          renderItem={renderCategoryChip}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* Events List */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'All Events' : selectedCategory}
          </Text>
          <Text style={styles.eventCount}>
            {filteredEvents.length} events
          </Text>
        </View>

        <FlatList
          data={filteredEvents}
          renderItem={renderEventCard}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.eventRow}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f4',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  eventCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  featuredList: {
    paddingLeft: 16,
  },
  featuredCard: {
    width: width * 0.8,
    height: 200,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  featuredInfo: {
    marginBottom: 8,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  featuredDate: {
    fontSize: 14,
    color: '#e5e7eb',
    marginBottom: 4,
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  categoryList: {
    paddingLeft: 16,
  },
  categoryChip: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  selectedCategoryChip: {
    backgroundColor: '#6366f1',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  selectedCategoryChipText: {
    color: '#fff',
  },
  eventRow: {
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  eventCard: {
    width: (width - 48) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eventImage: {
    width: '100%',
    height: 120,
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 6,
    borderRadius: 20,
  },
  eventInfo: {
    padding: 12,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 18,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
    flex: 1,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10b981',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 2,
  },
});

export default HomeScreen;
