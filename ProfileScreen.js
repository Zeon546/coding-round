import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';

const ProfileScreen = ({navigation}) => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    profileImage: null,
    preferences: {
      notifications: true,
      locationServices: true,
      emailUpdates: false,
      darkMode: false,
    },
  });

  const [stats, setStats] = useState({
    eventsAttended: 12,
    upcomingEvents: 3,
    favoriteEvents: 8,
    totalSpent: 850,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserData = async (updatedUser) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.error) {
        return;
      }

      if (response.assets && response.assets[0]) {
        const updatedUser = {
          ...user,
          profileImage: response.assets[0].uri,
        };
        saveUserData(updatedUser);
      }
    });
  };

  const togglePreference = (preference) => {
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        [preference]: !user.preferences[preference],
      },
    };
    saveUserData(updatedUser);
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              // In a real app, you would navigate to login screen
              Alert.alert('Success', 'Signed out successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const MenuOption = ({icon, title, subtitle, onPress, showArrow = true}) => (
    <TouchableOpacity style={styles.menuOption} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Icon name={icon} size={24} color="#6366f1" />
        <View style={styles.menuText}>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && <Icon name="chevron-right" size={24} color="#9ca3af" />}
    </TouchableOpacity>
  );

  const StatCard = ({title, value, icon, color}) => (
    <View style={[styles.statCard, {borderTopColor: color}]}>
      <Icon name={icon} size={32} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileImageContainer} onPress={handleImagePicker}>
          {user.profileImage ? (
            <Image source={{uri: user.profileImage}} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Icon name="person" size={40} color="#9ca3af" />
            </View>
          )}
          <View style={styles.editImageButton}>
            <Icon name="camera-alt" size={16} color="#fff" />
          </View>
        </TouchableOpacity>

        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <StatCard
          title="Events Attended"
          value={stats.eventsAttended}
          icon="event-available"
          color="#10b981"
        />
        <StatCard
          title="Upcoming"
          value={stats.upcomingEvents}
          icon="schedule"
          color="#f59e0b"
        />
        <StatCard
          title="Favorites"
          value={stats.favoriteEvents}
          icon="favorite"
          color="#ef4444"
        />
        <StatCard
          title="Total Spent"
          value={`$${stats.totalSpent}`}
          icon="payment"
          color="#6366f1"
        />
      </View>

      {/* My Events */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Events</Text>

        <MenuOption
          icon="event"
          title="My Bookings"
          subtitle="View your upcoming and past events"
          onPress={() => Alert.alert('Info', 'My Bookings feature coming soon')}
        />

        <MenuOption
          icon="favorite"
          title="Favorites"
          subtitle="Events you've saved"
          onPress={() => navigation.navigate('Favorites')}
        />

        <MenuOption
          icon="history"
          title="Event History"
          subtitle="Your past event attendance"
          onPress={() => Alert.alert('Info', 'Event History feature coming soon')}
        />
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.preferenceOption}>
          <View style={styles.menuLeft}>
            <Icon name="notifications" size={24} color="#6366f1" />
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>Push Notifications</Text>
              <Text style={styles.menuSubtitle}>Get notified about new events</Text>
            </View>
          </View>
          <Switch
            value={user.preferences.notifications}
            onValueChange={() => togglePreference('notifications')}
            trackColor={{false: '#d1d5db', true: '#6366f1'}}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.preferenceOption}>
          <View style={styles.menuLeft}>
            <Icon name="location-on" size={24} color="#6366f1" />
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>Location Services</Text>
              <Text style={styles.menuSubtitle}>Find events near you</Text>
            </View>
          </View>
          <Switch
            value={user.preferences.locationServices}
            onValueChange={() => togglePreference('locationServices')}
            trackColor={{false: '#d1d5db', true: '#6366f1'}}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.preferenceOption}>
          <View style={styles.menuLeft}>
            <Icon name="email" size={24} color="#6366f1" />
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>Email Updates</Text>
              <Text style={styles.menuSubtitle}>Receive event recommendations</Text>
            </View>
          </View>
          <Switch
            value={user.preferences.emailUpdates}
            onValueChange={() => togglePreference('emailUpdates')}
            trackColor={{false: '#d1d5db', true: '#6366f1'}}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <MenuOption
          icon="person"
          title="Edit Profile"
          subtitle="Update your personal information"
          onPress={() => Alert.alert('Info', 'Edit Profile feature coming soon')}
        />

        <MenuOption
          icon="payment"
          title="Payment Methods"
          subtitle="Manage your cards and payment options"
          onPress={() => Alert.alert('Info', 'Payment Methods feature coming soon')}
        />

        <MenuOption
          icon="security"
          title="Privacy & Security"
          subtitle="Manage your privacy settings"
          onPress={() => Alert.alert('Info', 'Privacy Settings feature coming soon')}
        />
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>

        <MenuOption
          icon="help"
          title="Help Center"
          subtitle="Get answers to common questions"
          onPress={() => Alert.alert('Help', 'Help Center feature coming soon')}
        />

        <MenuOption
          icon="feedback"
          title="Send Feedback"
          subtitle="Help us improve the app"
          onPress={() => Alert.alert('Feedback', 'Feedback feature coming soon')}
        />

        <MenuOption
          icon="info"
          title="About"
          subtitle="App version and information"
          onPress={() => Alert.alert('About', 'Event Explorer v1.0.0\n\nBuilt with React Native')}
        />
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Icon name="logout" size={20} color="#ef4444" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6366f1',
    padding: 6,
    borderRadius: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    borderTopWidth: 3,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  preferenceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuText: {
    marginLeft: 16,
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 32,
  },
});

export default ProfileScreen;
