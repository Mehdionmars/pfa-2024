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
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createMaterialBottomTabNavigator();

export default function App() {


    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Acceuil" component={MainStack} />
                <Tab.Screen name="Paramètres" component={Settings} />
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
        </Stack.Navigator>
    );
}