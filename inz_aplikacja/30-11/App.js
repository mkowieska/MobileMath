import 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-gesture-handler';

import HomePage from './src/home.js';
import DailyTaskPage from './src/daily_task.js';
import StatisticsPage from './src/statistics.js';
import LogInPage from './src/new/log_in.js';

import CategoriesPage from './src/categories.js';
import CategoriesAddLevelsPage from './src/add_levels.js';
import Add1VeryEasyPage from './src/add_1_very_easy.js';
import Add2EasyPage from './src/add_2_easy.js';
import Add3MediumPage from './src/add_3_medium.js';
import Add1ExplanationPage from './src/explanation/add_1_explanation.js';
import Add2ExplanationPage from './src/explanation/add_2_explanation.js';
import Add3ExplanationPage from './src/explanation/add_3_explanation.js';
import Add1ExercisePage from './src/exercise/add_1_exercise.js';
import Add2ExercisePage from './src/exercise/add_2_exercise.js';
import Add3ExercisePage from './src/exercise/add_3_exercise.js';
import Add1TestPage from './src/test/add_1_test.js';
import Add2TestPage from './src/test/add_2_test.js';
import Add3TestPage from './src/test/add_3_test.js';

import AccountPage from './src/account.js';
import NotificationsPage from './src/notifications.js';
// import LogOutPage from './src/log_out.js';

import GamePage from './src/game.js';
import GameMemory from './src/game_memory.js';

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
      <Stack.Screen name="Notifications" component={NotificationsPage} />
      {/* <Stack.Screen name="LogOut" component={LogOutPage} /> */}
    </Stack.Navigator>
  );
}

function GamesStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GamesList" component={GamePage} />
      <Stack.Screen name="GameMemory" component={GameMemory} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
}
