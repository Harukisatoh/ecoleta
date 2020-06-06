import React, { useEffect, useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { LeafletMouseEvent } from 'leaflet';
import { Map, TileLayer, Marker } from 'react-leaflet';

import './styles.css';

import api from '../../services/api';
import axios from 'axios';

import logo from '../../assets/logo.svg';
import { FiArrowLeft } from 'react-icons/fi';

interface Item {
    id: number;
    name: string;
    image_url: string;
}

interface State {
    abbreviation: string,
    name: string
}

interface IBGEStatesResponse {
    sigla: string,
    nome: string
}

interface IBGECitiesResponse {
    nome: string
}

const CreateLocation = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState(['']);
    const [formInputsValue, setFormInputsValue] = useState({
        name: '',
        email: '',
        whatsapp: '',
        address_number: 0
    });

    const [selectedState, setSelectedState] = useState<State>({ abbreviation: '', name: '' });
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const [mapPosition, setMapPosition] = useState<[number, number]>([-16.9928531, -48.1845555]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([-16.9928531, -48.1845555]);

    const getItemsFromAPI = useCallback(() => {
        console.log('PEGANDO ITEMS DA API');
        api.get('items').then((response) => {
            setItems(response.data);
        });
    }, []);

    const getCitiesFromIBGE_API = useCallback(() => {
        if (selectedState.abbreviation === '0') {
            // Returns if the default option is selected
            return;
        }

        axios.get<IBGECitiesResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState.abbreviation}/municipios`)
            .then((response) => {
                const cities = response.data.map((city) => city.nome);

                setCities(cities);
            });
    }, [selectedState]);

    // Called when component mounts, just once
    useEffect(() => {
        getUserGeolocation();
        getItemsFromAPI();
        getStatesFromIBGE_API();
    }, [getItemsFromAPI]);

    // Called when selectedState changes
    useEffect(() => {
        getCitiesFromIBGE_API();
    }, [getCitiesFromIBGE_API]);

    function getStatesFromIBGE_API() {
        axios.get<IBGEStatesResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then((response) => {
            const states = response.data.map((state) => {
                return {
                    abbreviation: state.sigla,
                    name: state.nome
                };
            });

            setStates(states);
        });
    }

    function getUserGeolocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;

            setMapPosition([latitude, longitude]);
        }, () => {
            console.log("Browser's geolocation access has been blocked by the user");

            api.get('https://ipapi.co/json/').then((response) => {
                const { latitude, longitude } = response.data;

                setMapPosition([latitude, longitude]);
            });
        });
    }

    function handleFormInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name: input, value } = event.target;

        setFormInputsValue({ ...formInputsValue, [input]: value });
    }

    function handleMapClick(event: LeafletMouseEvent) {
        // possible improvement = https://stackoverflow.com/questions/55059844/leaflet-reverse-geocode

        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ]);
    }

    function handleStateChange(event: ChangeEvent<HTMLSelectElement>) {
        const selectedState = {
            abbreviation: event.target.value,
            name: event.target.selectedOptions[0].innerText
        }

        setSelectedState(selectedState);
        setSelectedCity('');
    }

    function handleCityChange(event: ChangeEvent<HTMLSelectElement>) {
        const selectedCity = event.target.value;

        setSelectedCity(selectedCity);
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

    function handleFormSubmit(event: FormEvent) {
        event.preventDefault();
        console.log('inputs: ', formInputsValue);
        console.log('selected position: ', selectedPosition);
        console.log('state:', selectedState);
        console.log('city:', selectedCity);
        console.log('selected items:', selectedItems);

        const newLocation = {
            name: formInputsValue.name,
            email: formInputsValue.email,
            whatsapp: formInputsValue.whatsapp,
            address_number: formInputsValue.address_number,
            lat: selectedPosition[0],
            long: selectedPosition[1],
            city: selectedCity,
            state: selectedState.abbreviation,
            items: selectedItems
        }

        api.post('/locations', newLocation).then((response) => {
            console.log(response);
        });
    }

    return (
        <div id="page-create-location">
            <header>
                <img src={logo} alt="Ecoleta" />

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleFormSubmit} >
                <h1>Cadastro do <br /> pontos de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados da entidade</h2>
                    </legend>

                    <div className='field'>
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Ex.: Ecoleta"
                            onChange={handleFormInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Ex.: seumelhoremail@email.com"
                                onChange={handleFormInputChange}
                            />
                        </div>
                        <div className="field whatsapp-field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                placeholder="Ex.: 15996733242"
                                onChange={handleFormInputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço da entidade</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>


                    <div id="mapid">
                        <Map center={mapPosition} zoom={15} onClick={handleMapClick} >
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <Marker position={selectedPosition} />
                        </Map>
                    </div>

                    <div className="field-group">
                        <div className="field number-field">
                            <label htmlFor="address_number">Número</label>
                            <input
                                type="number"
                                name="address_number"
                                placeholder="Ex.: 132"
                                onChange={handleFormInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="state">Estado</label>
                            <select
                                name="state"
                                id="state"
                                value={selectedState.abbreviation}
                                onChange={handleStateChange}
                            >
                                <option value="0">Selecione um estado</option>
                                {
                                    states.map((state, index) => {
                                        return (
                                            <option value={state.abbreviation} key={index} >{state.name}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="city">Cidade</label>
                        <select
                            name="city"
                            id="city"
                            value={selectedCity}
                            onChange={handleCityChange}
                        >
                            <option value="0">Selecione uma cidade</option>
                            {
                                cities.map((city, index) => {
                                    return (
                                        <option value={city} key={index}>{city}</option>
                                    );
                                })
                            }
                        </select>
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>

                    <ul className="items-grid">

                        {
                            items.map((item) => {
                                return (
                                    <li
                                        key={item.id}
                                        onClick={() => handleItemSelection(item.id)}
                                        className={selectedItems.includes(item.id) ? 'selected' : ''}
                                    >
                                        <img src={item.image_url} alt={item.name} />
                                        <span>{item.name}</span>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    );
};

export default CreateLocation;
