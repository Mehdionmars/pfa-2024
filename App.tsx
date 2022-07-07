import React from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from "./types";
import Societes from "./screens/Societes";
import Login from "./screens/Login";
import Emplacement from "./screens/Emplacements";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {


    return (
        <NavigationContainer>
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
            <StatusBar style="auto" />
        </NavigationContainer>
    );
}