import { useState, useEffect } from 'react';

import { sortPlacesByDistance } from '../loc.js';
import fetchAvailablePlaces from '../http.js';

import Places from './Places.jsx';
import CustomError from './Error.jsx';

import useFetch from '../useFetch.jsx'


async function fetchAndSortAvailablePlaces() {
  const places = await fetchAvailablePlaces();
  
  const geoPromise = new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        places, 
        position.coords.latitude, 
        position.coords.longitude
      );

      resolve(sortedPlaces)
    },
    (err) => {
      console.log(`Geolocation error (${err.code}): ${err.message}`)
      resolve(places)
    }, 
    { enableHighAccuracy: false, timeout: 5000})
  })

  const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(places), 5000));

  return Promise.race([geoPromise, timeoutPromise])
}

export default function AvailablePlaces({ onSelectPlace }) {

  const {isLoading, fetchedData: availablePlaces, setFetchedData: setAvailablePlaces, isError} = useFetch(fetchAndSortAvailablePlaces, [])
    
  if(isError) {
    return <Error title="Data Fetching Error" message={isError.message} /> 
  }



  return (
    <Places
      title="Available Places"
      isLoading={isLoading}
      loadingText="Fetching available places..."
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
