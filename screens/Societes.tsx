import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import * as FileSystem from 'expo-file-system';
import type { NavigationProps, Societe } from "../types";
import * as SecureStore from 'expo-secure-store';
import { API_URL } from "../constants";

type Props = NavigationProps<"Societes">;

export default function Societes({ navigation, route }: Props) {

    const [societes, setSocietes] = useState<Societe[]>([]);

    useEffect(() => {
        SecureStore.getItemAsync("token").then(token => {
            if (!token) {
                navigation.replace("Login");
            }
            else 
            fetch(`${API_URL}/api/societes`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `JWT ${token}`
                }
            })
            .then(res => res.json())
            .then(res => {
                if (res.docs) {
                    setSocietes(res.docs);
                }
            })
        })
    }, []);


    return (
        <SafeAreaView>
            <FlatList
                data={societes}
                keyExtractor={(item: Societe) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => null}
                    >
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}