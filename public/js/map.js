let token = mapToken;
mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

// To display the pin icon for marker
const marker1 = new mapboxgl.Marker({ color: "#ff385c" })
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25, className: "my-class" })
      .setHTML("<h6>Exact location provided after booking.</h6>")
      .setMaxWidth("300px")
      .addTo(map)
  )
  .addTo(map);
