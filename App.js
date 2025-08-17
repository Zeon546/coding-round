import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import EventDetailsScreen from './src/screens/EventDetailsScreen';
import BookingScreen from './src/screens/BookingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EventsMapScreen from './src/screens/EventsMapScreen';
import SearchScreen from './src/screens/SearchScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack Navigator
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6366F1',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{title: 'Event Explorer'}} 
      />
      <Stack.Screen 
        name="EventDetails" 
        component={EventDetailsScreen}
        options={{title: 'Event Details'}}
      />
      <Stack.Screen 
        name="Booking" 
        component={BookingScreen}
        options={{title: 'Book Tickets'}}
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen}
        options={{title: 'Search Events'}}
      />
    </Stack.Navigator>
  );
}

// Map Stack Navigator
function MapStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6366F1',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen 
        name="MapMain" 
        component={EventsMapScreen} 
        options={{title: 'Events Near You'}} 
      />
      <Stack.Screen 
        name="EventDetails" 
        component={EventDetailsScreen}
        options={{title: 'Event Details'}}
      />
    </Stack.Navigator>
  );
}

// Profile Stack Navigator
function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6366F1',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{title: 'Profile'}} 
      />
      <Stack.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={{title: 'My Favorites'}}
      />
    </Stack.Navigator>
  );
}

// Main App Component
function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Map') {
              iconName = 'map';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6366F1',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
        })}>
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Map" component={MapStack} />
        <Tab.Screen name="Profile" component={ProfileStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
