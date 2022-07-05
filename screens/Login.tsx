import React, { useEffect } from "react";
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity } from "react-native";
import { NavigationProps } from "../types";

type Props = NavigationProps<"Login">;

export default function Login({ navigation, route }: Props) {
    useEffect(() => {
        console.log("Login");
    }, []);
    return <Text>Login</Text>;
}