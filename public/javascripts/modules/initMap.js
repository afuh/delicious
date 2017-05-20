/* eslint-disable no-undef */

function initMap(input) {
  if (!input) return;

  const coordinates = JSON.parse(input.dataset.coords);
  const myLatLng = {
    lat: coordinates[1],
    lng: coordinates[0]
  };

  // Create a map object and specify the DOM element for display.
  const map = new google.maps.Map(input, {
    center: myLatLng,
    zoom: 15,
    scrollwheel: false,
    streetViewControl: false,
    fullscreenControl: false
  });

  // Create a marker and set its position.
  const marker = new google.maps.Marker({
    map,
    position: myLatLng
  });

  // Resize stuff...
  google.maps.event.addDomListener(window, "resize", () => {
    const center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center);
  });
}

export default initMap;
