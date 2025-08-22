import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import ContestHubScreen from './src/screens/ContestHubScreen.jsx';
import ContestDetailScreen from './src/screens/ContestDetailScreen.jsx';
import PaymentScreen from './src/screens/PaymentScreen.jsx';
import SubmissionScreen from './src/screens/SubmissionScreen.jsx';
import ContestPlayScreen from './src/screens/ContestPlayScreen.jsx';
import ResultsScreen from './src/screens/ResultsScreen.jsx';
import LeaderboardScreen from './src/screens/LeaderboardScreen.jsx';

// Import tab icons
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ContestStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6366f1',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="ContestHub" 
        component={ContestHubScreen} 
        options={{ title: 'Contest Hub' }}
      />
      <Stack.Screen 
        name="ContestDetail" 
        component={ContestDetailScreen} 
        options={{ title: 'Contest Details' }}
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen} 
        options={{ title: 'Join Contest' }}
      />
      <Stack.Screen 
        name="Submission" 
        component={SubmissionScreen} 
        options={{ title: 'Submit Entry' }}
      />
      <Stack.Screen 
        name="ContestPlay" 
        component={ContestPlayScreen} 
        options={{ title: 'Play Contest' }}
      />
      <Stack.Screen 
        name="Results" 
        component={ResultsScreen} 
        options={{ title: 'Results' }}
      />
      <Stack.Screen 
        name="Leaderboard" 
        component={LeaderboardScreen} 
        options={{ title: 'Leaderboard' }}
      />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Contests') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Leaderboard') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Contests" component={ContestStack} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ContestHubScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <TabNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
