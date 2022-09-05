import { API_URL, defaultBottomTabColors, defaultGradientBackgroundColors, defaultTouchableColor } from "../constants";
import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';
import { BottomTabColors } from "../types";

export const getToken = async () => {
    try {
        const token = await SecureStore.getItemAsync('token');
        return token;
    }
    catch (error) {
        return null;
    }
}

export const getGradientBackgroundColors = async (): Promise<string[]> => {
    return ['#000', '#000'];
    /*
    try {
        const colors = await SecureStore.getItemAsync('gradientBackgroundColors');
        if (!colors) {
            await SecureStore.setItemAsync('gradientBackgroundColors', JSON.stringify(defaultGradientBackgroundColors));
            return defaultGradientBackgroundColors;
        }
        return JSON.parse(colors);
    }
    catch (error) {
        return ['#949494', '#bdc3c7', '#445463'];
    }
    */
}


export const getBottomNavigationColors = async (): Promise<BottomTabColors> => {
    return {
        activeColor: "#fff",
        inactiveColor: "#666",
        backgroundColor: "#000"
    }
    /*
    const colors = await Promise.all([SecureStore.getItemAsync("activeColor"), SecureStore.getItemAsync("inactiveColor"), SecureStore.getItemAsync("backgroundColor")]);
    if (!colors[0] || !colors[1] || !colors[2]) {
        await Promise.all([SecureStore.setItemAsync("activeColor", "#00e6f6"), SecureStore.setItemAsync("inactiveColor", "#1F6CAB"), SecureStore.setItemAsync("backgroundColor", "#082A3A")]);
        return defaultBottomTabColors;
    }
    return {
        activeColor: colors[0],
        inactiveColor: colors[1],
        backgroundColor: colors[2]
    }
    */
}

export const getTouchableColor = async (): Promise<string> => {
    return "#202028";
    /*
    const color = await SecureStore.getItemAsync("touchableColor");
    if (!color) {
        await SecureStore.setItemAsync("touchableColor", defaultTouchableColor);
        return defaultTouchableColor;
    }
    return color;
    */
}