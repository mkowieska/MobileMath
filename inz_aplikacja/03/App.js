import 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import 'react-native-gesture-handler';

import LogInPage from './src/log_in.js';
import { auth } from './firebaseConfig';

import HomePage from './src/home/home.js';
import DailyTaskPage from './src/home/daily_task.js';
import StatisticsPage from './src/home/statistics.js';

import CategoriesPage from './src/categories/categories.js';
import CategoriesAddLevelsPage from './src/categories/add/add_levels.js';
import Add1VeryEasyPage from './src/categories/add/add_1_very_easy.js';
import Add2EasyPage from './src/categories/add/add_2_easy.js';
import Add3MediumPage from './src/categories/add/add_3_medium.js';
import Add1ExplanationPage from './src/categories/add/explanation/add_1_explanation.js';
import Add2ExplanationPage from './src/categories/add/explanation/add_2_explanation.js';
import Add3ExplanationPage from './src/categories/add/explanation/add_3_explanation.js';
import Add1ExercisePage from './src/categories/add/exercise/add_1_exercise.js';
import Add2ExercisePage from './src/categories/add/exercise/add_2_exercise.js';
import Add3ExercisePage from './src/categories/add/exercise/add_3_exercise.js';
import Add1TestPage from './src/categories/add/test/add_1_test.js';
import Add2TestPage from './src/categories/add/test/add_2_test.js';
import Add3TestPage from './src/categories/add/test/add_3_test.js';

import AccountPage from './src/account/account.js';
import NotificationsPage from './src/account/notifications.js';
import NewNotificationsPage from './src/account/notifications_new.js';
import DifficultyLevelPage from './src/account/difficulty_level.js';
// import LogOutPage from './src/log_out.js';

import GamePage from './src/game/game.js';
import GameMemoryPage from './src/game/game_memory.js';
import Game10Page from './src/game/game_10.js';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();

function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeList" component={HomePage} />
      <Stack.Screen name="DailyTask" component={DailyTaskPage} />
      <Stack.Screen name="Statistics" component={StatisticsPage} />
    </Stack.Navigator>
  );
}

function CategoriesStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CategoriesList" component={CategoriesPage} />
      <Stack.Screen name="CategoriesAddLevels" component={CategoriesAddLevelsPage} />
      <Stack.Screen name="Add1VeryEasy" component={Add1VeryEasyPage} />
      <Stack.Screen name="Add2Easy" component={Add2EasyPage} />
      <Stack.Screen name="Add3Medium" component={Add3MediumPage} />
      <Stack.Screen name="Add1Explanation" component={Add1ExplanationPage} />
      <Stack.Screen name="Add2Explanation" component={Add2ExplanationPage} />
      <Stack.Screen name="Add3Explanation" component={Add3ExplanationPage} />
      <Stack.Screen name="Add1Exercise" component={Add1ExercisePage} />
      <Stack.Screen name="Add2Exercise" component={Add2ExercisePage} />
      <Stack.Screen name="Add3Exercise" component={Add3ExercisePage} />
      <Stack.Screen name="Add1Test" component={Add1TestPage} />
      <Stack.Screen name="Add2Test" component={Add2TestPage} />
      <Stack.Screen name="Add3Test" component={Add3TestPage} />
    </Stack.Navigator>
  );
}

function AccountStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AccountList" component={AccountPage} />
      <Stack.Screen name="DifficultyLevel" component={DifficultyLevelPage} />
      <Stack.Screen name="Notifications" component={NotificationsPage} />
      <Stack.Screen name="NewNotifications" component={NewNotificationsPage} />
      {/* <Stack.Screen name="LogOut" component={LogOutPage} /> */}
    </Stack.Navigator>
  );
}

function GamesStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GamesList" component={GamePage} />
      <Stack.Screen name="GameMemory" component={GameMemoryPage} />
      <Stack.Screen name="Game10" component={Game10Page} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
    screenOptions={
      ({route}) => ({
        headerShown: false,//ukrywa górny pasek
        tabBarIcon: ({color, size}) => {
          let iconName;
          switch(route.name){
            case 'Strona główna':
              iconName = 'home-outline';
              break;
            case 'Kategorie':
              iconName = 'bookmarks-outline';
              break;
            case 'Konto':
              iconName = 'person-outline';
              break;
            case 'Gry':
              iconName = 'game-controller-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E918E',
        tabBarLabelStyle: {fontSize: 12},
        tabBarIconStyle: {marginBottom: 2},
        tabBarInactiveTintColor: '#000000', //'grey'
        tabBarStyle: {paddingBottom: 5, height: 60, backgroundColor: '#F4F4F4'},
      })}
    >
      <Tab.Screen name="Strona główna" component={HomeStackNavigator} />
      <Tab.Screen name="Kategorie" component={CategoriesStackNavigator} />
      <Tab.Screen name="Konto" component={AccountStackNavigator} />
      <Tab.Screen name="Gry" component={GamesStackNavigator} />
    </Tab.Navigator>
  );
}

export default function App() {
  // const [user, setUser] = useState(null);
  // const [authLoading, setAuthLoading] = useState(true);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
  //     setUser(firebaseUser);
  //     setAuthLoading(false);
  //   });

  //   return unsubscribe;
  // }, []);

  // if (authLoading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#1E918E" />
  //     </View>
  //   );
  // }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {/* TODO: Odkomentować logowanie Firebase */}
        {/* {user ? (
          <RootStack.Screen name="MainTabs" component={MainTabs} />
        ) : (
          <RootStack.Screen name="LogIn" component={LogInPage} />
        )} */}
        
        {/* Na razie zawsze wyświetlaj MainTabs */}
        <RootStack.Screen name="MainTabs" component={MainTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FAFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
