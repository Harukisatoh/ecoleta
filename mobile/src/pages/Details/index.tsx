import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, Text, SafeAreaView, ActivityIndicator, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer';

import styles from './styles';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';

import api from '../../services/api';

interface Params {
    location_id: number
}

interface LocationDetails {
    location: {
        name: string,
        email: string,
        whatsapp: string,
        address_number: number,
        city: string,
        state: string,
        image_url: string
    },
    acceptedItems: {
        name: string,
    }[]
}

const Details = () => {
    const [locationDetails, setLocationDetails] = useState<LocationDetails>({} as LocationDetails);
    const navigation = useNavigation();

    const route = useRoute();
    const routeParams = route.params as Params;

    // Gets details from selected location
    useEffect(() => {
        api.get(`locations/${routeParams.location_id}`).then((response) => {
            setLocationDetails(response.data);
        });
    }, []);

    function handleNavigateBack() {
        navigation.goBack();
    }

    function handleEmailButtonPress() {
        MailComposer.composeAsync({
            subject: 'Interesse na coleta de resíduos',
            recipients: [locationDetails.location.email]
        });
    }

    function handleWhatsappButtonPress() {
        Linking.openURL(`whatsapp://send?phone=+55${locationDetails.location.whatsapp}&text=Tenho interesse sobre a coleta de resíduos`);
    }

    // Loading screen
    if (!locationDetails.location) {
        return (
            <SafeAreaView style={styles.loadingIndicatorContainer}>
                <ActivityIndicator style={{ scaleX: 1.5, scaleY: 1.5 }} size="large" color="#34CB79" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79" />
                </TouchableOpacity>

                <Image style={styles.locationImage} source={{ uri: locationDetails.location.image_url }} />

                <Text style={styles.locationName}>{locationDetails.location.name}</Text>
                <Text style={styles.locationItems}>
                    {
                        locationDetails.acceptedItems.map((item) => item.name).join(', ')
                    }
                </Text>

                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereço</Text>
                    <Text style={styles.addressContent}>{`${locationDetails.location.city}, ${locationDetails.location.state}`}</Text>
                </View>
            </View>
            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleWhatsappButtonPress}>
                    <FontAwesome name="whatsapp" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>Whatsapp</Text>
                </RectButton>

                <RectButton style={styles.button} onPress={handleEmailButtonPress}>
                    <Icon name="mail" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>E-mail</Text>
                </RectButton>
            </View>
        </SafeAreaView >
    );
};

export default Details;
