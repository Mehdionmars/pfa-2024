import React from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from "./types";
import Societes from "./screens/Societes";
import Login from "./screens/Login";
import Emplacement from "./screens/Emplacements";
import Settings from "./screens/Settings";
import Commandes from "./screens/Commandes";
import Tableaux from "./screens/Tableaus";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createMaterialBottomTabNavigator();

export default function App() {


    return (
        <NavigationContainer>
            <Tab.Navigator
                activeColor='#ffc03d'
                inactiveColor='#e7eefb'
                barStyle={{
                    backgroundColor: '#432344',
                    borderTopWidth: 1,
                }}
            >
                <Tab.Screen
                    name="Stack"
                    component={MainStack}
                    options={{
                        title: 'Accueil',
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name="home" color={color} size={20} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={Settings}
                    options={{
                        title: 'Paramètres',
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name="settings" color={color} size={20} />
                        ),
                    }}
                />
            </Tab.Navigator>
            <StatusBar style="auto" />
        </NavigationContainer>
    );
}

function MainStack() {
    return (
        <Stack.Navigator initialRouteName='Societes'>
            <Stack.Screen
                name="Societes"
                component={Societes}
                options={{
                    title: 'Societés',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    title: 'Login',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Emplacements"
                component={Emplacement}
                options={{
                    title: 'Emplacements',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Commandes"
                component={Commandes}
                options={{
                    title: 'Commandes',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Tableaus"
                component={Tableaux}
                options={{
                    title: 'Tableaux',
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}