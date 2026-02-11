const hostURL = "http://localhost:3000/place-picker/";

export default async function fetchAvailablePlaces() {
	const res = await fetch(hostURL + 'places');
    const response = await res.json()

    if(!res.ok) {
		throw new Error('Server Error!')
    }

    return response.places
}


export async function fetchUserPlaces() {
	const res = await fetch(hostURL + 'user-places');
    const response = await res.json()

    if(!res.ok) {
		throw new Error('Server Error!')
    }

    return response.places
}


export async function updateUserData(places) {
	const response = await fetch(hostURL + 'user-places', {
		method: 'PUT',
		body: JSON.stringify({places}),
		headers: {
			'Content-Type': 'application/json'
		}
	})

	const res = response.json();

	if(!response.ok) {
		throw new Error('Failed to update user data.')
	}

	return res.message;
}