import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, SafeAreaView, Image } from 'react-native'
import { NavigationProps, User } from '../types';
import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants'

type Props = NavigationProps<"Settings">;

export default function Settings({ navigation, route }: Props) {

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
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
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            {
                !user ? null :
                    <Text> {user.email} </Text>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
})