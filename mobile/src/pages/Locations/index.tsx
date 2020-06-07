import React from 'react';
import { View, TouchableOpacity, Text, ScrollView, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps'

import styles from './styles';
import { Feather as Icon } from '@expo/vector-icons';
import { SvgUri } from 'react-native-svg';

const Locations = () => {
    const navigation = useNavigation();

    function handleNavigateBack() {
        navigation.goBack();
    }

    function handleNavigateToDetails() {
        navigation.navigate('Details');
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
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: -23.5277964,
                            longitude: -49.2334694,
                            latitudeDelta: 0.014,
                            longitudeDelta: 0.014
                        }}
                    >
                        <Marker
                            style={styles.mapMarker}
                            onPress={handleNavigateToDetails}
                            coordinate={{
                                latitude: -23.5277964,
                                longitude: -49.2334694
                            }}
                        >
                            <View style={styles.mapMarkerInfoContainer}>
                                <Image
                                    style={styles.mapMarkerImage}
                                    source={{
                                        uri: 'https://images.unsplash.com/photo-1549986584-6d9e49fd6495?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60'
                                    }}
                                />
                                <Text style={styles.mapMarkerTitle}>Título</Text>
                            </View>
                            <View style={styles.mapMarkerTip}></View>
                        </Marker>
                    </MapView>
                </View>
            </View>

            <View style={styles.itemsContainer} >
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 25 }}
                >
                    <TouchableOpacity style={styles.item} onPress={() => { }}>
                        {/* <SvgUri width={42} height={42} uri="http://localhost:3333/uploads/lampadas.svg" /> */}
                        <Text style={styles.itemTitle}>Título</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item} onPress={() => { }}>
                        {/* <SvgUri width={42} height={42} uri="http://localhost:3333/uploads/lampadas.svg" /> */}
                        <Text style={styles.itemTitle}>Título</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item} onPress={() => { }}>
                        {/* <SvgUri width={42} height={42} uri="http://localhost:3333/uploads/lampadas.svg" /> */}
                        <Text style={styles.itemTitle}>Título</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item} onPress={() => { }}>
                        {/* <SvgUri width={42} height={42} uri="http://localhost:3333/uploads/lampadas.svg" /> */}
                        <Text style={styles.itemTitle}>Título</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item} onPress={() => { }}>
                        {/* <SvgUri width={42} height={42} uri="http://localhost:3333/uploads/lampadas.svg" /> */}
                        <Text style={styles.itemTitle}>Título</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item} onPress={() => { }}>
                        {/* <SvgUri width={42} height={42} uri="http://localhost:3333/uploads/lampadas.svg" /> */}
                        <Text style={styles.itemTitle}>Título</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default Locations;
