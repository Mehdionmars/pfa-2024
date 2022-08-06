import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image, ToastAndroid, FlatList } from 'react-native';
import { NavigationProps, User, BottomTabColors, DefaultBottomTabAvailableColors } from '../types';
import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';
import * as Updates from 'expo-updates';
import * as Linking from 'expo-linking';
import { API_URL, defaultAvailableBottomTabColors, defaultBottomTabColors, defaultGradientBackgroundColors } from '../constants';
import { Dialog, Portal, Button, RadioButton } from 'react-native-paper';
// @ts-ignore
import ColorPalette from 'react-native-color-palette';
import { LinearGradient } from "expo-linear-gradient";
import { getBottomNavigationColors, getGradientBackgroundColors } from '../Utils';

type Props = NavigationProps<"Settings">;

export default function Settings({ navigation, route }: Props) {

    const [user, setUser] = useState<User | null>(null);


    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [defaultColors, setDefaultColors] = useState<BottomTabColors>(defaultBottomTabColors);
    const [colors, setColors] = useState<BottomTabColors>(defaultBottomTabColors);
    const [availableColors, setAvailableColors] = useState<DefaultBottomTabAvailableColors>(defaultAvailableBottomTabColors);

    const [isBackgroundDialogVisible, setIsBackgroundDialogVisible] = useState<boolean>(false);
    const [defGradientBackgroundColors, setDefGradientBackgroundColors] = useState<string[]>(defaultGradientBackgroundColors);
    const [gradientBackgroundColors, setGradientBackgroundColors] = useState<string[]>(defaultGradientBackgroundColors);
    const [availableGradientBackgroundColors, setAvailableGradientBackgroundColors] = useState<string[][]>([defaultGradientBackgroundColors]);

    const fetchData = () => {
        SecureStore.getItemAsync("token").then(token => {
            if (!token) {
                navigation.navigate("Login");
            }
            else {
                fetch(`${API_URL}/api/users/me`, {
                    method: 'GET',
                    headers: {
                        Authorization: `JWT ${token}`
                    }
                })
                    .then(res => res.json())
                    .then(res => setUser(res.user))
                    .catch(err => console.log(err))
            }
        })

        getBottomNavigationColors().then(colors => setDefaultColors(colors))

        fetch(`${API_URL}/api/globals/colors`).then(res => res.json())
            .then(res => {
                setAvailableColors({
                    activeColors: res.activeColors.map((color: any) => color.code),
                    inactiveColors: res.inactiveColors.map((color: any) => color.code),
                    backgroundColors: res.barBackgroundColors.map((color: any) => color.code),
                })
                setAvailableGradientBackgroundColors(res.appBackgroundColors.map((gradient: any) => gradient.gradient.map((color: any) => color.color)))
            })
            .catch(err => console.log(err))

        getGradientBackgroundColors().then(colors => {
            setGradientBackgroundColors(colors);
            setDefGradientBackgroundColors(colors);
        })

    }

    const updateColors = () => {
        SecureStore.setItemAsync("activeColor", colors.activeColor);
        SecureStore.setItemAsync("inactiveColor", colors.inactiveColor);
        SecureStore.setItemAsync("backgroundColor", colors.backgroundColor);
        ToastAndroid.show("Colors updated", ToastAndroid.SHORT);
        toggleDialog();
    }

    const updateBackgroundColors = () => {
        SecureStore.setItemAsync("gradientBackgroundColors", JSON.stringify(gradientBackgroundColors));
        ToastAndroid.show("Background colors updated", ToastAndroid.SHORT);
        toggleBackgroundDialog();
    }

    const cancelColorUpdate = () => {
        setColors(defaultColors);
        route.params.setActiveColor(defaultColors.activeColor);
        route.params.setInactiveColor(defaultColors.inactiveColor);
        route.params.setBackgroundColor(defaultColors.backgroundColor);
        toggleDialog();
    }

    const cancelBackgroundColorUpdate = () => {
        setGradientBackgroundColors(defGradientBackgroundColors);
        toggleBackgroundDialog();
    }

    const toggleDialog = () => setIsVisible(!isVisible);
    const toggleBackgroundDialog = () => setIsBackgroundDialogVisible(!isBackgroundDialogVisible);

    useEffect(() => {
        navigation.addListener('focus', () => fetchData());
    }, [])

    const showToast = (message: string) => {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            25,
            50
        );
    }

    return (

        <LinearGradient
            style={{ flex: 1 }}
            colors={gradientBackgroundColors}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Settings</Text>
                </View>
                <View style={styles.body}>
                    <TouchableOpacity
                        style={styles.sectionContent}
                        onPress={() => {
                            user?.isAdmin ? Linking.openURL(`${API_URL}/admin/collections/users?page=1`) : showToast("You are not an admin")
                        }}
                    >
                        <View
                            style={{
                                width: '30%',
                                height: '100%',
                            }}
                        >
                            <Image
                                source={user?.image ? { uri: user.image.url } : require('../assets/images/no_profile.png')}
                                style={styles.sectionIcon}
                            />
                        </View>
                        <View style={{
                            width: '70%',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            paddingRight: 10,

                        }}>
                            <View>
                                <Text style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                }}
                                    numberOfLines={2}
                                >
                                    {user?.fullname}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 15
                                    }}
                                >
                                    {user?.email}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 15
                                    }}
                                >
                                    {user?.phone}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 15
                                    }}
                                >
                                    {user?.isAdmin ? "Admin" : "Non Admin"}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            ...styles.sectionContent,
                            height: 50,
                        }}
                        onPress={toggleDialog}
                    >
                        <Text>Customize Bar colors</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            ...styles.sectionContent,
                            height: 50,
                        }}
                        onPress={toggleBackgroundDialog}
                    >
                        <Text>Change background gradient</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            ...styles.sectionContent,
                            height: 50
                        }}
                        onPress={() => {
                            SecureStore.getItemAsync("token").then(token => {
                                fetch(`${API_URL}/api/users/logout`, {
                                    method: 'POST',
                                    headers: {
                                        Authorization: `JWT ${token}`
                                    }
                                })
                                    .then(res => res.json())
                                    .then(res => SecureStore.deleteItemAsync("token").then(() => Updates.reloadAsync()))
                            })
                        }}
                    >
                        <Text>Logout</Text>
                    </TouchableOpacity>
                    <Portal>
                        <Dialog visible={isVisible} onDismiss={cancelColorUpdate}>
                            <Dialog.Title>Set bottom bar color</Dialog.Title>
                            <Dialog.Content>
                                <ColorPalette
                                    title="Active color: "
                                    onChange={(color: any) => {
                                        setColors({ ...colors, activeColor: color });
                                        route.params.setActiveColor(color);
                                    }}
                                    colors={availableColors.activeColors}

                                />
                                <ColorPalette
                                    title="Inactive color: "
                                    onChange={(color: any) => {
                                        setColors({ ...colors, inactiveColor: color });
                                        route.params.setInactiveColor(color);
                                    }}
                                    colors={availableColors.inactiveColors}
                                />
                                <ColorPalette
                                    title="Background bar color: "
                                    onChange={(color: any) => {
                                        setColors({ ...colors, backgroundColor: color });
                                        route.params.setBackgroundColor(color);
                                    }}
                                    colors={availableColors.backgroundColors}
                                />
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button color='grey' onPress={cancelColorUpdate}> Cancel </Button>
                                <Button color='blue' onPress={updateColors}> Ok </Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                    <Portal>
                        <Dialog visible={isBackgroundDialogVisible} onDismiss={cancelBackgroundColorUpdate}>
                            <Dialog.Title>Set background</Dialog.Title>
                            <Dialog.Content
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    alignContent: 'space-around',
                                    flexWrap: 'wrap',
                                }}
                            >
                                {
                                    availableGradientBackgroundColors.map((color: string[], index: number) => {
                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => setGradientBackgroundColors(color)}
                                                style={{marginTop: 10}}
                                                >
                                                <View>
                                                    <LinearGradient
                                                        colors={color}
                                                        style={{
                                                            width: 70,
                                                            height: 70,
                                                        }}
                                                    />
                                                </View>
                                            </TouchableOpacity>

                                        )
                                    })
                                }
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button color='grey' onPress={cancelBackgroundColorUpdate}> Cancel </Button>
                                <Button color='blue' onPress={updateBackgroundColors}> Ok </Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </View>
            </SafeAreaView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: '#e0e0e0',
        flexDirection: 'column',
        marginTop: 50,
    },
    header: {
        width: '100%',
        height: 50,
        //borderBottomWidth: 1,
        //borderBottomColor: '#ddd',
        alignItems: 'flex-start',
        marginTop: 30,
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        marginLeft: 50,
    },
    body: {
        width: '100%',
        height: '80%',
        marginTop: 50,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',

    },
    sectionContent: {
        padding: 10,
        marginVertical: 8,
        width: '95%',
        backgroundColor: '#d9d9d9',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 6,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
    }



})