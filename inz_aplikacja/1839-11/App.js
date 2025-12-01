import 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-gesture-handler';

import home_page from './src/home.js';
import categories_page from './src/categories.js';
import account_page from './src/account.js';
import game_page from './src/game.js';

const Tab = createBottomTabNavigator();

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
                iconName = 'bookmarks-outline';//list-outline //folder-outline
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
        <Tab.Screen name="Strona główna" component={home_page} />
        <Tab.Screen name="Kategorie" component={categories_page} />
        <Tab.Screen name="Konto" component={account_page} />
        <Tab.Screen name="Gry" component={game_page} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}