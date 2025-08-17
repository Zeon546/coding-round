import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock API URL - In production, this would be your actual API endpoint
const API_BASE_URL = 'https://api.eventexplorer.com/v1';

// Sample event data for demonstration
const SAMPLE_EVENTS = [
  {
    id: 1,
    name: 'Summer Music Festival 2025',
    category: 'Music',
    subcategory: 'Festival',
    description: 'Join us for the biggest summer music festival featuring top artists from around the world. Experience amazing performances, food trucks, and unforgettable memories under the stars.',
    startDateTime: '2025-08-15T18:00:00.000Z',
    endDateTime: '2025-08-17T23:00:00.000Z',
    venue: {
      name: 'Central Park Amphitheater',
      address: '1234 Park Avenue, New York, NY 10001',
      city: 'New York',
      capacity: 5000,
      coordinates: {
        latitude: 40.7589,
        longitude: -73.9851,
      },
    },
    price: {
      min: 75,
      max: 250,
      currency: 'USD',
    },
    organizer: 'NYC Events Group',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
    tags: ['Music', 'Festival', 'Outdoor', 'Summer'],
    attendees: 2500,
    rating: 4.8,
    isFeatured: true,
    isOnline: false,
    ageRestriction: '18+',
    contactInfo: {
      email: 'info@nyceevents.com',
      phone: '(555) 123-4567',
    },
  },
  {
    id: 2,
    name: 'Tech Innovation Summit',
    category: 'Technology',
    subcategory: 'Conference',
    description: 'Discover the latest trends in AI, blockchain, and emerging technologies. Network with industry leaders and startup founders.',
    startDateTime: '2025-09-10T09:00:00.000Z',
    endDateTime: '2025-09-10T17:00:00.000Z',
    venue: {
      name: 'Convention Center',
      address: '5678 Tech Boulevard, San Francisco, CA 94105',
      city: 'San Francisco',
      capacity: 1000,
      coordinates: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
    },
    price: {
      min: 150,
      max: 300,
      currency: 'USD',
    },
    organizer: 'TechCorp Events',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    tags: ['Technology', 'Conference', 'AI', 'Networking'],
    attendees: 850,
    rating: 4.6,
    isFeatured: true,
    isOnline: true,
    ageRestriction: null,
    contactInfo: {
      email: 'contact@techcorp.com',
      phone: '(555) 987-6543',
    },
  },
  {
    id: 3,
    name: 'Food & Wine Festival',
    category: 'Food & Drink',
    subcategory: 'Festival',
    description: 'Taste exquisite dishes from renowned chefs and sample premium wines from around the world.',
    startDateTime: '2025-10-05T12:00:00.000Z',
    endDateTime: '2025-10-05T20:00:00.000Z',
    venue: {
      name: 'Waterfront Plaza',
      address: '9876 Harbor Drive, Miami, FL 33101',
      city: 'Miami',
      capacity: 2000,
      coordinates: {
        latitude: 25.7617,
        longitude: -80.1918,
      },
    },
    price: {
      min: 45,
      max: 125,
      currency: 'USD',
    },
    organizer: 'Culinary Arts Society',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    tags: ['Food', 'Wine', 'Festival', 'Gourmet'],
    attendees: 1200,
    rating: 4.7,
    isFeatured: false,
    isOnline: false,
    ageRestriction: '21+',
    contactInfo: {
      email: 'events@culinaryarts.org',
      phone: '(555) 456-7890',
    },
  },
  {
    id: 4,
    name: 'Art Gallery Opening',
    category: 'Arts & Culture',
    subcategory: 'Exhibition',
    description: 'Experience contemporary art from emerging local artists in an intimate gallery setting.',
    startDateTime: '2025-09-20T19:00:00.000Z',
    endDateTime: '2025-09-20T22:00:00.000Z',
    venue: {
      name: 'Modern Art Gallery',
      address: '456 Arts District, Los Angeles, CA 90013',
      city: 'Los Angeles',
      capacity: 150,
      coordinates: {
        latitude: 34.0522,
        longitude: -118.2437,
      },
    },
    price: {
      min: 0,
      max: 0,
      currency: 'USD',
    },
    organizer: 'LA Arts Collective',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    tags: ['Art', 'Gallery', 'Culture', 'Free'],
    attendees: 120,
    rating: 4.5,
    isFeatured: false,
    isOnline: false,
    ageRestriction: 'All Ages',
    contactInfo: {
      email: 'info@laartscollective.com',
      phone: '(555) 234-5678',
    },
  },
];

class EventService {
  constructor() {
    this.events = SAMPLE_EVENTS;
    this.favorites = [];
    this.loadFavorites();
  }

  // Load favorites from AsyncStorage
  async loadFavorites() {
    try {
      const favoritesJson = await AsyncStorage.getItem('favorites');
      if (favoritesJson) {
        this.favorites = JSON.parse(favoritesJson);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }

  // Save favorites to AsyncStorage
  async saveFavorites() {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(this.favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  // Simulate API call with delay
  async simulateApiCall(data, delay = 1000) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(data);
      }, delay);
    });
  }

  // Get all events
  async getAllEvents() {
    try {
      // In production, this would be:
      // const response = await fetch(`${API_BASE_URL}/events`);
      // const data = await response.json();
      // return data;

      return await this.simulateApiCall(this.events);
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch events');
    }
  }

  // Get event by ID
  async getEventById(eventId) {
    try {
      const event = this.events.find(e => e.id === eventId);
      if (!event) {
        throw new Error('Event not found');
      }
      return await this.simulateApiCall(event, 500);
    } catch (error) {
      console.error('Error fetching event:', error);
      throw new Error('Failed to fetch event');
    }
  }

  // Search events
  async searchEvents(query, filters = {}) {
    try {
      let filteredEvents = [...this.events];

      // Apply text search
      if (query) {
        filteredEvents = filteredEvents.filter(event =>
          event.name.toLowerCase().includes(query.toLowerCase()) ||
          event.description.toLowerCase().includes(query.toLowerCase()) ||
          event.category.toLowerCase().includes(query.toLowerCase())
        );
      }

      // Apply category filter
      if (filters.category && filters.category !== 'All') {
        filteredEvents = filteredEvents.filter(
          event => event.category === filters.category
        );
      }

      // Apply location filter
      if (filters.city) {
        filteredEvents = filteredEvents.filter(
          event => event.venue.city.toLowerCase().includes(filters.city.toLowerCase())
        );
      }

      // Apply date range filter
      if (filters.startDate) {
        filteredEvents = filteredEvents.filter(
          event => new Date(event.startDateTime) >= new Date(filters.startDate)
        );
      }

      if (filters.endDate) {
        filteredEvents = filteredEvents.filter(
          event => new Date(event.startDateTime) <= new Date(filters.endDate)
        );
      }

      // Apply price range filter
      if (filters.minPrice !== undefined) {
        filteredEvents = filteredEvents.filter(
          event => event.price.min >= filters.minPrice
        );
      }

      if (filters.maxPrice !== undefined) {
        filteredEvents = filteredEvents.filter(
          event => event.price.max <= filters.maxPrice
        );
      }

      // Apply rating filter
      if (filters.minRating) {
        filteredEvents = filteredEvents.filter(
          event => event.rating >= filters.minRating
        );
      }

      // Apply event type filter (online/offline)
      if (filters.eventType === 'online') {
        filteredEvents = filteredEvents.filter(event => event.isOnline);
      } else if (filters.eventType === 'offline') {
        filteredEvents = filteredEvents.filter(event => !event.isOnline);
      }

      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'date':
            filteredEvents.sort((a, b) => 
              new Date(a.startDateTime) - new Date(b.startDateTime)
            );
            break;
          case 'price':
            filteredEvents.sort((a, b) => a.price.min - b.price.min);
            break;
          case 'rating':
            filteredEvents.sort((a, b) => b.rating - a.rating);
            break;
          case 'name':
            filteredEvents.sort((a, b) => a.name.localeCompare(b.name));
            break;
        }
      }

      return await this.simulateApiCall(filteredEvents, 800);
    } catch (error) {
      console.error('Error searching events:', error);
      throw new Error('Failed to search events');
    }
  }

  // Get featured events
  async getFeaturedEvents() {
    try {
      const featured = this.events.filter(event => event.isFeatured);
      return await this.simulateApiCall(featured, 500);
    } catch (error) {
      console.error('Error fetching featured events:', error);
      throw new Error('Failed to fetch featured events');
    }
  }

  // Get events by category
  async getEventsByCategory(category) {
    try {
      const categoryEvents = this.events.filter(
        event => event.category === category
      );
      return await this.simulateApiCall(categoryEvents, 600);
    } catch (error) {
      console.error('Error fetching events by category:', error);
      throw new Error('Failed to fetch events by category');
    }
  }

  // Get nearby events (using geolocation)
  async getNearbyEvents(latitude, longitude, radius = 50) {
    try {
      // In production, this would calculate actual distance
      // For demo, return all events
      return await this.simulateApiCall(this.events, 700);
    } catch (error) {
      console.error('Error fetching nearby events:', error);
      throw new Error('Failed to fetch nearby events');
    }
  }

  // Add to favorites
  async addToFavorites(eventId) {
    try {
      if (!this.favorites.includes(eventId)) {
        this.favorites.push(eventId);
        await this.saveFavorites();
      }
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw new Error('Failed to add to favorites');
    }
  }

  // Remove from favorites
  async removeFromFavorites(eventId) {
    try {
      this.favorites = this.favorites.filter(id => id !== eventId);
      await this.saveFavorites();
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw new Error('Failed to remove from favorites');
    }
  }

  // Get favorite events
  async getFavoriteEvents() {
    try {
      const favoriteEvents = this.events.filter(event =>
        this.favorites.includes(event.id)
      );
      return await this.simulateApiCall(favoriteEvents, 500);
    } catch (error) {
      console.error('Error fetching favorite events:', error);
      throw new Error('Failed to fetch favorite events');
    }
  }

  // Check if event is favorited
  isFavorite(eventId) {
    return this.favorites.includes(eventId);
  }

  // Book event (simulation)
  async bookEvent(eventId, ticketQuantity, ticketType) {
    try {
      // In production, this would handle actual booking
      const booking = {
        id: Date.now(),
        eventId,
        ticketQuantity,
        ticketType,
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
        qrCode: `QR-${Date.now()}`,
      };

      return await this.simulateApiCall(booking, 1500);
    } catch (error) {
      console.error('Error booking event:', error);
      throw new Error('Failed to book event');
    }
  }

  // Get categories
  getCategories() {
    return [
      'All',
      'Music',
      'Sports',
      'Arts & Culture',
      'Technology',
      'Food & Drink',
      'Networking',
      'Family',
      'Health & Wellness',
    ];
  }

  // Get popular searches
  getPopularSearches() {
    return [
      'Music festivals',
      'Tech conferences',
      'Art exhibitions',
      'Food events',
      'Sports games',
      'Networking events',
    ];
  }
}

// Export singleton instance
export const eventService = new EventService();
