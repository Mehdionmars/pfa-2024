import type { NativeStackScreenProps } from '@react-navigation/native-stack'

export type RootStackParamList = {
    Societes: undefined;
    Login: undefined;
    Emplacements: { idSociete: string };
    Commandes: { idEmplacement: string };
    Tableaus: { idCommande: string };
    Settings: undefined;
}

export type NavigationProps<RouteName extends keyof RootStackParamList> = NativeStackScreenProps<
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
    sizes: { thumnail: { url: string } };
    url: string;
}

export type User = {
    id: string;
    email: string;
    fullname: string;
    phone: string;
    image: Media | undefined;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
}

export type Societe = {
    id: string;
    name: string;
    description: string;
    logo: Media;
    created_by: User | string;
    modified_by: User | string;
    createdAt: string;
    updatedAt: string;
}

export type Emplacement = {
    id: string;
    name: string;
    description: string | undefined;
    societe: Societe | string;
    created_by: User | string;
    modified_by: User | string;
    createdAt: string;
    updatedAt: string;
}

export type Commande = {
    id: string;
    name: string;
    price: number;
    emplacement: Emplacement | string;
    completed: boolean;
    rate: string;
    created_by: User | string;
    modified_by: User | string;
    createdAt: string;
    updatedAt: string;

}

export type Tableau = {
    id: string;
    des: string;
    designation: string;
    unite: string;
    quantite: number;
    avance: boolean;
    commande: Commande | string;
    created_by: User | string;
    modified_by: User | string;
    createdAt: string;
    updatedAt: string;
}