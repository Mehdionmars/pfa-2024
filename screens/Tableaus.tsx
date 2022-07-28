import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, SafeAreaView, Image } from "react-native";
import { DataTable } from "react-native-paper";
import Checkbox from 'expo-checkbox';
import * as FileSystem from 'expo-file-system';
import type { NavigationProps, Tableau } from "../types";
import * as SecureStore from 'expo-secure-store';
import { API_URL } from "../constants";

type Props = NavigationProps<"Tableaus">;

export default function Tableaus({ navigation, route }: Props) {

    const [tableaus, setTableaus] = useState<Tableau[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [updating, setUpdating] = useState<string[]>([]);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(true);

    const fetchData = () => {
        setIsRefreshing(true);
        setCurrentPage(0)
        SecureStore.getItemAsync("token").then(token => {
            if (!token) {
                navigation.replace("Login");
            }
            else
                fetch(`${API_URL}/api/tableaus?sort=des&page=${1}&depth=0&where[commande][equals]=${route.params.idCommande}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `JWT ${token}`
                    }
                })
                    .then(res => res.json())
                    .then(res => {
                        if (res.docs) {
                            setTableaus(res.docs);
                            setTotalPages(res.totalPages);
                            setIsRefreshing(false);
                        }
                    })
        })
    }
    useEffect(() => {
        navigation.addListener('focus', () => fetchData());

    }, [navigation]);

    const loadMore = (pageToLoad: number) => {
        SecureStore.getItemAsync("token").then(token => {
            if (!token) {
                navigation.replace("Login");
            }
            else
                fetch(`${API_URL}/api/tableaus?sort=des&page=${pageToLoad + 1}&depth=0&where[commande][equals]=${route.params.idCommande}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `JWT ${token}`
                    }
                })
                    .then(res => res.json())
                    .then(res => {
                        if (res.docs) {
                            setTableaus(res.docs);
                        }
                    })
        })
    }


    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={require('../assets/images/logo.png')}
                style={{
                    width: 200,
                    height: 150,
                    marginBottom: 10,
                    borderRadius: 50,
                }}
            />
            {
                updating.length !== 0 ?
                    <View style={styles.loading}>
                        <Image source={require("../assets/images/updating.gif")} style={{ width: 100, height: 100 }} width={200} height={200} />
                    </View> : null
            }


            <DataTable>
                <DataTable.Pagination
                    page={currentPage}
                    numberOfPages={totalPages}
                    numberOfItemsPerPage={10}
                    onPageChange={page => {
                        setCurrentPage(page);
                        loadMore(page);
                    }}
                    label={`Page ${currentPage + 1} sur ${totalPages}`}
                />
                <DataTable.Header>
                    <DataTable.Title>D</DataTable.Title>
                    <DataTable.Title>Désignation</DataTable.Title>
                    <DataTable.Title>Unité</DataTable.Title>
                    <DataTable.Title>Quantité</DataTable.Title>
                    <DataTable.Title>Avance</DataTable.Title>
                </DataTable.Header>

                <FlatList
                    refreshing={isRefreshing}
                    onRefresh={fetchData}
                    style={styles.flatlist}
                    data={tableaus}
                    keyExtractor={(item: Tableau) => item.id}
                    renderItem={({ item }) => (
                        <DataTable.Row>
                            <DataTable.Cell>{item.des}</DataTable.Cell>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <Text numberOfLines={5} style={{fontSize: 10}}>
                                    {item.designation}
                                </Text>
                            </View>
                            <DataTable.Cell>{item.unite}</DataTable.Cell>
                            <DataTable.Cell>{item.quantite}</DataTable.Cell>
                            <DataTable.Cell>
                                <Checkbox
                                    value={item.avance}
                                    disabled={false}
                                    onValueChange={() => {
                                        SecureStore.getItemAsync("token").then(token => {
                                            if (!token) {
                                                navigation.replace("Login");
                                            }
                                            else {
                                                setUpdating([...updating, item.id]);
                                                fetch(`${API_URL}/api/tableaus/${item.id}?depth=0`, {
                                                    method: "PUT",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                        "Authorization": `JWT ${token}`
                                                    },
                                                    body: JSON.stringify({ avance: !item.avance })
                                                })
                                                    .then(res => res.json())
                                                    .then(res => {
                                                        if (res.message && res.message === "Updated successfully.") {
                                                            setUpdating(updating.filter(id => id !== item.id));
                                                            setTableaus(prevState => {  // update the entire state with the new value
                                                                const newState = [...prevState];
                                                                newState[prevState.indexOf(item)] = { ...item, avance: !item.avance };
                                                                return newState;
                                                            })
                                                        }
                                                    })
                                            }
                                        })

                                    }}
                                    style={{ width: 30, height: 30, marginHorizontal: 10 }}
                                />
                            </DataTable.Cell>
                        </DataTable.Row>
                    )}
                />
            </DataTable>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        justifyContent: 'flex-start',
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
    },
    loading: {
        position: "absolute",
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: "100%",
        height: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})