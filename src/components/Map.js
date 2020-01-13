import React, { useContext } from 'react'
import { StyleSheet, ActivityIndicator } from 'react-native'
import MapView, { Polyline, Circle } from 'react-native-maps'
import { Context as LocationContext } from '../context/LocationContext'

const Map = () => {

    const { state: { currentLocation, locations } } = useContext(LocationContext)

    if (!currentLocation) {
        return <ActivityIndicator size="large"
            style={{ marginTop: 200 }} />
    }

    // adb shell pm reset-permissions
    return (
        <MapView style={styles.map}
            initialRegion={{
                ...currentLocation.coords,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }}>
            <Circle center={currentLocation.coords}
                radius={50}
                strokeColor="rgba(158,158, 155, 1.0)"
                fillColor="rgba(158,158, 155, 0.3)"
            />
            <Polyline coordinates={locations.map(loc => loc.coords)} />
        </MapView>
    )
}

const styles = StyleSheet.create({
    map: {
        height: '65%'
    }
})

export default Map