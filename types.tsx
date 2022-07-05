import type { NativeStackScreenProps } from '@react-navigation/native-stack'

export type RootStackParamList = {
    Societes: undefined;
    Login: undefined;
}

export type NavigationProps<RouteName extends keyof RootStackParamList > = NativeStackScreenProps<
    RootStackParamList,
    RouteName
>;