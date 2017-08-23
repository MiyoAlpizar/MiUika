import React, { Component } from 'react';

const LATITUDE_DELTA = 0.0922;

export function CGetLocation() {
    return new Promise((resolve, reject) => {
        GetLocation((region, error) => {
            if (error !== null) {
                reject(error);
            } else {
                resolve(region);
            }
        });
    });
}

function GetLocation(callback) {
    const { geolocation } = navigator;

    geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const accuracy = position.coords.accuracy;
            CalcDelta(lat, lon, accuracy, (region) => callback(region, null));
        },
        (error) => callback(null, error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
}

function CalcDelta(lat, lon, accuracy, callback) {
    const oneDegreeOfLongitudeMeters = 111.32;
    const circumference = (40075 / 360);
    const latDelta = accuracy * (1 / (Math.cos(lat) * circumference));
    const lonDelta = (accuracy / oneDegreeOfLongitudeMeters);

    const region =
        {
            latitude: lat,
            longitude: lon,
            latitudeDelta: latDelta,
            longitudeDelta: lonDelta
        };

    return callback(region);
}
