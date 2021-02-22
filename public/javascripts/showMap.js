
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
    // style: 'mapbox://styles/mapbox/ṣtreet-v11', // stylesheet location
    center: place.geometry.coordinates, // starting position [lng, lat]
    zoom: 8// starting zoom
});



new mapboxgl.Marker()
    .setLngLat(place.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${place.title}</h3><p>${place.location}</p>`
            )
    )
    .addTo(map)
