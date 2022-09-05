import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, SafeAreaView, Image, ImageBackground, TextInput } from "react-native";
import * as FileSystem from 'expo-file-system';
import type { NavigationProps, Societe } from "../types";
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import { API_URL, defaultGradientBackgroundColors, defaultTouchableColor } from "../constants";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getGradientBackgroundColors, getTouchableColor } from "../Utils";

type Props = NavigationProps<"Societes">;

export default function Societes({ navigation, route }: Props) {

    const [touchableColor, setTouchableColor] = useState<string>(defaultTouchableColor);
    const [societes, setSocietes] = useState<Societe[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(true);
    const [search, setSearch] = useState<string>("");
    const [filter, setFilter] = useState<string>("");
    const [gradientBgColors, setGradientBgColors] = useState<string[]>(defaultGradientBackgroundColors);

    const fetchData = () => {
        setIsRefreshing(true);
        setSearch("");
        SecureStore.getItemAsync("token").then(token => {
            if (!token) {
                navigation.replace("Login");
            }
            else
                fetch(`${API_URL}/api/societes?sort=name&page=${1}`, {
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
                            setCurrentPage(res.page);
                            setTotalPages(res.totalPages);
                            setIsRefreshing(false);
                        }
                    })
        })
        getGradientBackgroundColors().then(colors => setGradientBgColors(colors))
        getTouchableColor().then(color => setTouchableColor(color))
    }
    useEffect(() => {
        navigation.addListener('focus', () => fetchData());
    }, [navigation]);

    const loadMore = () => {
        SecureStore.getItemAsync("token").then(token => {
            if (!token) {
                navigation.replace("Login");
            }
            else
                fetch(`${API_URL}/api/societes?sort=name&page=${currentPage + 1}${filter}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `JWT ${token}`
                    }
                })
                    .then(res => res.json())
                    .then(res => {
                        if (res.docs) {
                            setSocietes(societes.concat(res.docs));
                            setCurrentPage(res.page);
                            setTotalPages(res.totalPages);
                        }
                    })
        })
    }

    const searchSocietes = (text: string) => {
        setCurrentPage(1);
        setFilter(`&where[name][contains]=${text}`);
        setSearch(text);
        SecureStore.getItemAsync("token").then(token => {
            if (!token) {
                navigation.replace("Login");
            }
            else
                fetch(`${API_URL}/api/societes?sort=name&page=${1}&where[name][contains]=${text}`, {
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
                            setCurrentPage(res.page);
                            setTotalPages(res.totalPages);
                            setIsRefreshing(false);
                        }
                    })
        })
    }


    return (
        <LinearGradient
            style={{ flex: 1 }}
            colors={gradientBgColors}
        >
            <SafeAreaView
                style={styles.container}
            >
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
                        onChangeText={text => searchSocietes(text)}
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
                    data={societes}
                    keyExtractor={(item: Societe) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => navigation.push("Emplacements", { idSociete: item.id })}
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
                                <Image source={{ uri: item.logo.url }} style={styles.logo} />
                            </View>

                        </TouchableOpacity>
                    )}
                    ListFooterComponent={() => (
                        currentPage < totalPages ?
                            <TouchableOpacity
                                onPress={() => loadMore()}
                                style={{...styles.load_more, backgroundColor: touchableColor}}
                            >
                                <Text style={styles.text} >Load more</Text>
                            </TouchableOpacity>
                            : null
                    )}
                />
            </SafeAreaView >
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
        marginTop: 10,
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
        color: '#f0f0f0',
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