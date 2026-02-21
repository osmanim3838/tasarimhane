import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import EntryScreen from '../screens/EntryScreen';
import VerificationScreen from '../screens/VerificationScreen';
import NameInputScreen from '../screens/NameInputScreen';
import HomeScreen from '../screens/HomeScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PersonnelListScreen from '../screens/PersonnelListScreen';
import PersonnelDetailScreen from '../screens/PersonnelDetailScreen';
import SalonLoginScreen from '../screens/SalonLoginScreen';
import SalonVerificationScreen from '../screens/SalonVerificationScreen';
import OwnerDashboardScreen from '../screens/OwnerDashboardScreen';
import EmployeeDashboardScreen from '../screens/EmployeeDashboardScreen';
import CustomTabBar from '../components/CustomTabBar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
      <Tab.Screen name="Contact" component={ContactScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Entry" component={EntryScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="NameInput" component={NameInputScreen} />
        <Stack.Screen name="SalonLogin" component={SalonLoginScreen} />
        <Stack.Screen name="SalonVerification" component={SalonVerificationScreen} />
        <Stack.Screen name="OwnerDashboard" component={OwnerDashboardScreen} />
        <Stack.Screen name="EmployeeDashboard" component={EmployeeDashboardScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="PersonnelList" component={PersonnelListScreen} />
        <Stack.Screen name="PersonnelDetail" component={PersonnelDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
