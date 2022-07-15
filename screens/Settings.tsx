import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, Button, FlatList, TouchableOpacity, SafeAreaView, Image, ToastAndroid } from 'react-native'
import { NavigationProps, User } from '../types';
import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';
import * as Linking from 'expo-linking';
import { API_URL } from '../constants';

type Props = NavigationProps<"Settings">;

export default function Settings({ navigation, route }: Props) {

    const [user, setUser] = useState<User | null>(null);

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
    }

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
                                {user?.fullname }
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
                        height: 50
                    }}
                    onPress={() => {
                        SecureStore.deleteItemAsync("token").then(() => {
                            navigation.navigate("Login");
                        })
                    }}
                >
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e0e0e0',
        flexDirection: 'column',
        marginTop: 50,
    },
    header: {
        width: '100%',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
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
        backgroundColor: '#f5f5f5',
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