import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, SafeAreaView, Image } from "react-native";
import * as FileSystem from 'expo-file-system';
import type { NavigationProps, Emplacement } from "../types";
import * as SecureStore from 'expo-secure-store';
import { API_URL } from "../constants";

type Props = NavigationProps<"Emplacements">;

export default function Emplacements({ navigation, route }: Props) {

    const [emplacements, setEmplacements] = useState<Emplacement[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(true);

    useEffect(() => {
        navigation.addListener('focus', () => fetchData());


    }, [navigation]);

    const fetchData = () => {
        setIsRefreshing(true);
        SecureStore.getItemAsync("token").then(token => {
            if (!token) {
                navigation.replace("Login");
            }
            else
                fetch(`${API_URL}/api/emplacements?depth=0&where[societe][equals]=${route.params.idSociete}&sort=+updatedAt`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `JWT ${token}`
                    }
                })
                    .then(res => res.json())
                    .then(res => {
                        if (res.docs) {
                            setEmplacements(res.docs);
                            setCurrentPage(res.page);
                            setTotalPages(res.totalPages);
                            setIsRefreshing(false);
                        }
                    })
        })
    }

    const loadMore = () => {
        SecureStore.getItemAsync("token").then(token => {
            if (!token) {
                navigation.replace("Login");
            }
            else
                fetch(`${API_URL}/api/emplacements?page=${currentPage + 1}&depth=0&where[societe][equals]=${route.params.idSociete}&sort=+updatedAt`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `JWT ${token}`
                    }
                })
                    .then(res => res.json())
                    .then(res => {
                        if (res.docs) {
                            setEmplacements(emplacements.concat(res.docs));
                            setCurrentPage(res.page);
                            setTotalPages(res.totalPages);
                        }
                    })
        })
    }


    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('../assets/images/logo.png')}
                style={{
                    width: 200,
                    height: 150,
                    marginBottom: 10,
                    borderRadius: 50,
                }}
            />
            <FlatList
                refreshing={isRefreshing}
                onRefresh={fetchData}
                style={styles.flatlist}
                data={emplacements}
                keyExtractor={(item: Emplacement) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.push("Commandes", { idEmplacement: item.id })}
                        style={styles.item}
                    >
                        <View style={styles.item_left}>
                            <Text
                                style={styles.text}
                                numberOfLines={5}
                            >
                                {item.name}
                            </Text>

                        </View>
                        <View style={styles.item_right}>

                        </View>

                    </TouchableOpacity>
                )}
                ListFooterComponent={() => (
                    currentPage < totalPages ?
                        <TouchableOpacity
                            onPress={() => loadMore()}
                            style={styles.load_more}
                        >
                            <Text>Load more</Text>
                        </TouchableOpacity>
                        : null
                )}
            />
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    flatlist: {
        backgroundColor: '#e0e0e0',
        Width: '100%',
        marginBottom: 0,
    },
    item: {
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        borderRadius: 10,
        height: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 6,
    },
    load_more: {
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        borderRadius: 10,
    },
    text: {
        color: '#000',
    },
    item_left: {
        width: '70%',
    },
    item_right: {
        width: '30%',
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50
    }
})