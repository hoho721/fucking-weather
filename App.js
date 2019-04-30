import React, {Component, Fragment} from 'react';
import {StyleSheet, Text, View, StatusBar, ActivityIndicator} from 'react-native';
import Weather from './Weather';

const API_KEY = "13189bf24978b5c1de0ca5a1c40dbd08";
const URL = "http://api.openweathermap.org/data/2.5/weather";

export default class App extends Component {
    state = {
        isLoaded: false,
        error: null,
        temperature: null,
        weatherName: null
    };

    componentDidMount() {
        this._getGeoLocationInfo()
    }

    _getGeoLocationInfo() {
        navigator.geolocation.getCurrentPosition(
            position => {
                this._getWeather(position.coords.latitude, position.coords.longitude);
            },
            error => {
                this.setState({
                    error: error
                })
            }
        );
    }

    _getWeather(lat, lon) {
        fetch(`${URL}?lat=${lat}&lon=${lon}&APPID=${API_KEY}`)
            .then(response => response.json())
            .then(json => {
                console.log(json);
                this.setState({
                    isLoaded: true,
                    temperature: json.main.temp,
                    weatherName: json.weather[0].main
                })
            })
            .catch(err => {
                this.setState({
                    error: err
                })
            })
    }

    render() {
        const {isLoaded, error, temperature, weatherName} = this.state;
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                {
                    isLoaded ? <Weather
                            temp={Math.floor(temperature - 273.15)}
                            weatherName={weatherName} /> :
                        <View style={styles.loading}>
                            <Text style={styles.loadingText}>Getting the fucking weather</Text>
                            {error ? <Text style={styles.errorText}>{error}</Text> : null}
                        </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    errorText: {
        color: "red",
        backgroundColor: "transparent",
        marginBottom: 40
    },
    loading: {
        flex: 1,
        backgroundColor: "#FDF6AA",
        justifyContent: "flex-end",
        paddingLeft: 25
    },
    loadingText: {
        fontSize: 38,
        marginBottom: 100
    },
});
