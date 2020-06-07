import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Image, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps'
import * as Geolocation from 'expo-location';

import api from '../../services/api';

import styles from './styles';
import { Feather as Icon } from '@expo/vector-icons';
import { SvgUri } from 'react-native-svg';

interface Item {
    id: number,
    name: string,
    image_url: string
}

interface Location {
    id: number,
    name: string,
    image_url: string,
    lat: number,
    long: number
}

const Locations = () => {
    const navigation = useNavigation();
    const [mapPosition, setMapPosition] = useState<[number, number]>([0, 0]);

    const [items, setItems] = useState<Item[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        async function getUserPosition() {
            const { status } = await Geolocation.requestPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Uh oh...', 'Precisamos da sua permissão para obter sua localização. \n\nTente novamente!');
                navigation.goBack();
                return;
            }

            try {
                const location = await Geolocation.getCurrentPositionAsync();
                const { latitude, longitude } = location.coords;

                setMapPosition([
                    latitude,
                    longitude
                ]);
            } catch (error) {
                Alert.alert('Uh oh...', 'Não conseguimos acessar sua localização. \n\nTente habilitar o GPS do seu celular!');
                navigation.goBack();
                return;
            }
        }

        getUserPosition();
    }, []);

    useEffect(() => {
        api.get('items').then((response) => {
            setItems(response.data);
        });
    }, []);

    useEffect(() => {
        console.log('buscando localizações...');
        api.get('locations', {
            params: {
                city: 'Taquarituba',
                state: 'SP',
                items: [1, 2]
            }
        }).then((response) => {
            setLocations(response.data);
            console.log('achou localizações...');
        });
    }, []);

    function handleNavigateBack() {
        navigation.goBack();
    }

    function handleNavigateToDetails(location_id: number) {
        navigation.navigate('Details', { location_id });
    }

    function handleItemSelection(item_id: number) {
        const alreadySelected = selectedItems.findIndex((item) => item_id === item);

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter((item) => {
                return item !== item_id
            });
            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([...selectedItems, item_id]);
        }

    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container} >
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79" />
                </TouchableOpacity>

                <Text style={styles.title}>Bem vindo.</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

                <View style={styles.mapContainer}>
                    {
                        mapPosition[0] !== 0 ? (
                            <MapView
                                style={styles.map}
                                loadingIndicatorColor="#34CB79"
                                initialRegion={{
                                    latitude: mapPosition[0],
                                    longitude: mapPosition[1],
                                    latitudeDelta: 0.014,
                                    longitudeDelta: 0.014
                                }}
                            >
                                {
                                    locations.map((location) => {
                                        console.log('exibindo localizações...');
                                        return (
                                            <Marker
                                                key={String(location.id)}
                                                style={styles.mapMarker}
                                                onPress={() => handleNavigateToDetails(location.id)}
                                                coordinate={{
                                                    latitude: location.lat,
                                                    longitude: location.long
                                                }}
                                            >
                                                <View style={styles.mapMarkerInfoContainer}>
                                                    <Image
                                                        style={styles.mapMarkerImage}
                                                        source={{
                                                            uri: location.image_url
                                                        }}
                                                    />
                                                    <Text style={styles.mapMarkerTitle}>{location.name}</Text>
                                                </View>
                                                <View style={styles.mapMarkerTip}></View>
                                            </Marker>
                                        );
                                    })
                                }
                            </MapView>
                        ) : (
                                <ActivityIndicator size="large" color="#34CB79" />
                            )
                    }
                </View>
            </View>

            <View style={styles.itemsContainer} >
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 25 }}
                >
                    {
                        items.map((item) => {
                            return (
                                <TouchableOpacity
                                    key={String(item.id)}
                                    style={[
                                        styles.item,
                                        selectedItems.includes(item.id) ? styles.selectedItem : {}
                                    ]}
                                    onPress={() => handleItemSelection(item.id)}
                                    activeOpacity={0.6}
                                >
                                    <SvgUri width={42} height={42} uri={item.image_url} />
                                    <Text style={styles.itemName}>{item.name}</Text>
                                </TouchableOpacity>
                            );
                        })
                    }
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default Locations;
