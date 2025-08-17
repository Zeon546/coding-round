/**
 * Event Explorer - React Native Mobile App
 * Entry point for the application
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Register the main App component
AppRegistry.registerComponent(appName, () => App);
