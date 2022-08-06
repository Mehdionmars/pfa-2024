import React, { useState, useEffect } from 'react';
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
import { Provider as PaperProvider, Portal, Dialog, Text, Button } from 'react-native-paper';
import { getBottomNavigationColors } from './Utils';


const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createMaterialBottomTabNavigator();

export default function App() {

    const [activeColor, setActiveColor] = useState('#00e6f6');
    const [inactiveColor, setInactiveColor] = useState('#1F6CAB');
    const [backgroundColor, setBackgroundColor] = useState('#082A3A');
    const [isVisible, setIsVisible] = useState(false);
    const [isUpdateDownloading, setIsUpdateDownloading] = useState(false);

    useEffect(() => {
        Updates.checkForUpdateAsync().then(update => {
            if (update.isAvailable) {
                setIsUpdateDownloading(true);
                setIsVisible(true);
                Updates.fetchUpdateAsync().then((update) => {
                    if (update.isNew) {
                        Updates.reloadAsync();
                    }
                });
            }
        });

        getBottomNavigationColors().then(colors => {
            setActiveColor(colors.activeColor);
            setInactiveColor(colors.inactiveColor);
            setBackgroundColor(colors.backgroundColor);
        });

    }, [])

    return (
        <PaperProvider>
            <Portal>
                <Dialog visible={isVisible} onDismiss={() => { }}>
                    <Dialog.Title>Mise à jour disponible</Dialog.Title>
                    <Dialog.Content>
                        <Text>
                            {isUpdateDownloading ? "Téléchargement de la mise à jour..." : "Téléchargement terminé\nCliquez sur le bouton pour installer la mise à jour."}
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button disabled={isUpdateDownloading} onPress={() => Updates.reloadAsync()}>Mettre à jour</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <NavigationContainer>
                <Tab.Navigator
                    activeColor={activeColor}
                    inactiveColor={inactiveColor}
                    barStyle={{
                        backgroundColor: backgroundColor,
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
                        initialParams={{
                            setActiveColor: setActiveColor,
                            setInactiveColor: setInactiveColor,
                            setBackgroundColor: setBackgroundColor,
                        }}
                    />
                </Tab.Navigator>
                <StatusBar style="auto" />
            </NavigationContainer>
        </PaperProvider>
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