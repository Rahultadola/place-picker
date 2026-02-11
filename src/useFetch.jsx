import { useState, useEffect} from 'react';

export default function useFetch(fetchFunction, initialValue) {
  const [fetchedData, setFetchedData] = useState(initialValue);

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(null)

  useEffect(() => {
    async function fetchPlaces() {
      setIsLoading(true)
      setIsError(null)
      // console.log("Fetching User places..")
      try {
        const places = await fetchFunction();
        setFetchedData(places)
        setIsLoading(false)
        // console.log("success : Fetching User places ..")

      } catch(err) {
        setIsError({message: err.message || 'Could not load places, try again later.'})
        setIsLoading(false)

        // console.log(err)
        // console.log("error : Fetching User places..")
      }
    }

    fetchPlaces()
  }, [])

  return {
  	isLoading,
  	fetchedData,
  	isError,
  	setFetchedData
  }
}