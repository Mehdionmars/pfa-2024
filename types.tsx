import type { NativeStackScreenProps } from '@react-navigation/native-stack'

export type RootStackParamList = {
    Societes: undefined;
    Login: undefined;
}

export type NavigationProps<RouteName extends keyof RootStackParamList > = NativeStackScreenProps<
    RootStackParamList,
    RouteName
>;



export type Media = {
    id: string;
    filename: string;
    mimetype: string;
    filesize: number;
    width: number;
    height: number;
    sizes: { thumnail: { url: string }};
    url: string;
}

export type User = {
    id: string;
    email: string;
    fullname: string;
    phone: string;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
}

export type Societe = {
    id: string;
    name: string;
    description: string;
    logo: Media;
    created_by: User;
    modified_by: User;
}