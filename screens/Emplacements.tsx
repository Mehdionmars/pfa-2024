import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, SafeAreaView, Image, TextInput } from "react-native";
import * as FileSystem from 'expo-file-system';
import type { NavigationProps, Emplacement } from "../types";
import * as SecureStore from 'expo-secure-store';
import { API_URL, defaultGradientBackgroundColors, defaultTouchableColor } from "../constants";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { getGradientBackgroundColors, getTouchableColor } from "../Utils";

type Props = NavigationProps<"Emplacements">;

export default function Emplacements({ navigation, route }: Props) {

    const [touchableColor, setTouchableColor] = useState<string>(defaultTouchableColor);
    const [emplacements, setEmplacements] = useState<Emplacement[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(true);
    const [search, setSearch] = useState<string>("");
    const [filter, setFilter] = useState<string>("");

    const [gradientBgColors, setGradientBgColors] = useState<string[]>(defaultGradientBackgroundColors);

    useEffect(() => {
        navigation.addListener('focus', () => fetchData());
    }, [navigation]);

    const fetchData = () => {
        setSearch("");
        setIsRefreshing(true);
        SecureStore.getItemAsync("token").then(token => {
            if (!token) {
                navigation.replace("Login");
            }
            else
                fetch(`${API_URL}/api/emplacements?sort=name&page=1&depth=0&where[societe][equals]=${route.params.idSociete}`, {
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
        getGradientBackgroundColors().then(colors => setGradientBgColors(colors));
        getTouchableColor().then(color => setTouchableColor(color))
    }

    const loadMore = () => {
        SecureStore.getItemAsync("token").then(token => {
            if (!token) {
                navigation.replace("Login");
            }
            else
                fetch(`${API_URL}/api/emplacements?sort=name&page=${currentPage + 1}&depth=0&where[societe][equals]=${route.params.idSociete}${filter}`, {
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

    const searchEmplacements = (text: string) => {
        setFilter(`&where[name][contains]=${text}`);
        setSearch(text);
        setCurrentPage(1);
        SecureStore.getItemAsync("token").then(token => {
            if (!token) {
                navigation.replace("Login");
            }
            else
                fetch(`${API_URL}/api/emplacements?sort=name&page=${1}&depth=0&where[societe][equals]=${route.params.idSociete}&where[name][contains]=${text}`, {
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
                        }
                    })
        })
    }


    return (
        <LinearGradient
            style={{ flex: 1 }}
            colors={gradientBgColors}
        >
            <SafeAreaView style={styles.container}>
                <View
                    style={{
                        width: "80%",
                        flexDirection: "row",
                        //justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#d9d9d9",
                        borderRadius: 10,
                    }}
                >
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Search"
                        placeholderTextColor="#000"
                        onChangeText={text => searchEmplacements(text)}
                        value={search}
                        editable={true}
                        keyboardType="default"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <MaterialIcons
                        name="search"
                        size={30}
                        color="#000"
                    />
                </View>
                <FlatList
                    refreshing={isRefreshing}
                    onRefresh={fetchData}
                    style={styles.flatlist}
                    data={emplacements}
                    keyExtractor={(item: Emplacement) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => navigation.push("Commandes", { idEmplacement: item.id })}
                            style={{...styles.item, backgroundColor: touchableColor}}
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
                                style={{...styles.load_more, backgroundColor: touchableColor}}
                            >
                                <Text>Load more</Text>
                            </TouchableOpacity>
                            : null
                    )}
                />
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: '#e0e0e0',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    flatlist: {
        //backgroundColor: '#e0e0e0',
        Width: '100%',
        marginBottom: 0,
    },
    item: {
        //backgroundColor: '#d9d9d9',
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
        //backgroundColor: '#d9d9d9',
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
        color: '#fff',
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
    },
    TextInput: {
        color: 'black',
        backgroundColor: '#d9d9d9',
        borderRadius: 10,
        padding: 10,
        width: '90%',
    },
})