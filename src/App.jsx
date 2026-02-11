import { useRef, useState, useEffect, useCallback } from 'react';

import { updateUserData, fetchUserPlaces } from './http.js';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';

import CustomError from './components/Error.jsx'

import useFetch from './useFetch.jsx';

function App() {
  const selectedPlace = useRef();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isDeleteError, setIsDeleteError] = useState(null)

  const {isLoading, fetchedData: userPlaces, setFetchedData: setUserPlaces, isError} = useFetch(fetchUserPlaces, [])



  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
      await updateUserData([selectedPlace, ...userPlaces])
    } catch (error) {
      setUserPlaces(userPlaces)
      setIsError({message: error.message || 'Error section update.'})
    }

  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    try {
      await updateUserData(userPlaces.filter((place) => place.id !== selectedPlace.current.id))
    } catch (err) {
      isDeleteError({ message: err.message || "Error removing place."})
      setUserPlaces(userPlaces)
    }

    setModalIsOpen(false);
  }, [userPlaces]);


  function handleError() {
    isDeleteError(null)
  }

  return (
    <>
      <Modal open={isDeleteError} onClose={handleError}>
        {isDeleteError && <CustomError title="Data Fetching Error" message={isError.message} onConfirm={handleError}/>}
      </Modal>

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
