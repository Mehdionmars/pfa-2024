import React from 'react'
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, SafeAreaView, Image } from 'react-native'
import { NavigationProps } from '../types';

type Props = NavigationProps<"Settings">;

export default function Settings({ navigation, route }: Props) {
  return (
    <SafeAreaView style={styles.container}>
        <Text>Settings</Text>
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