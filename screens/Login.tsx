import React, { useState, useEffect } from "react";
import { StyleSheet, Text, SafeAreaView, Image, TextInput, TouchableOpacity, ImageBackground, View } from "react-native";

import { NavigationProps } from "../types";
import { API_URL } from "../constants";
import * as SecureStore from 'expo-secure-store';

type Props = NavigationProps<"Login">;

export default function Login({ navigation, route }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    useEffect(() => {
        SecureStore.getItemAsync("token").then(token => {
            if (token) {
                navigation.replace("Societes");
            }
        })
    })
    
    const Login = () => {
        fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        .then(res => res.json())
        .then(res => {
            if (res.token) {
                SecureStore.setItemAsync("token", res.token);
                SecureStore.setItemAsync("user", JSON.stringify(res.user));
                navigation.replace("Societes");
            }
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../assets/images/background.png')}
                style={styles.bg_image}
                blurRadius={3}
            >
                <Image source={require('../assets/images/logo.png')}
                    style={{
                        width: 200,
                        height: 150,
                        marginBottom: 50,
                        borderRadius: 50,
                    }}>


                </Image>
                <View style={styles.inputView}>

                    <TextInput
                        style={styles.TextInput}
                        placeholder="Identifiant"
                        placeholderTextColor="#CCCCCC"
                        onChangeText={(email) => setEmail(email)}
                        value={email}
                    />
                </View>

                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Mot de Passe"
                        placeholderTextColor="#BBBBBB"
                        secureTextEntry={true}
                        onChangeText={(password) => setPassword(password)}
                        value={password}
                    />
                </View>

                <TouchableOpacity style={styles.loginBtn} onPress={Login}>
                    <Text style={styles.loginText}>Connect</Text>
                </TouchableOpacity>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",

    },

    image: {
        marginBottom: 30,
    },

    inputView: {
        backgroundColor: "#000000",
        flex: 0,
        borderRadius: 20,
        width: "70%",
        height: 45,
        marginBottom: 20,

        alignItems: "center",
    },

    TextInput: {
        height: 15,
        flex: 1,
        padding: 10,
        marginLeft: 20,
        width: '100%',
        color: 'white'

    },

    loginBtn: {
        width: "40%",
        borderRadius: 30,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 0,
        backgroundColor: "#BBBBBB",
    },

    loginText: {

    },
    bg_image: {
        resizeMode: 'cover',
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",


    }


});