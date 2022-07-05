import React, { useEffect } from "react";
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity } from "react-native";
import { NavigationProps } from "../types";

type Props = NavigationProps<"Societes">;

export default function Societes({ navigation, route }: Props) {
    useEffect(() => {
        console.log("Societes");
    }, []);
    return <Text onPress={() => {navigation.replace("Login")}}>Societes</Text>;
}