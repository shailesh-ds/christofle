// @ts-ignore
import google from "google";
import { getValueFromPath, scrollToRow } from "./utils";
import { currentLatitude, currentLongitude, } from "./locations";
import { locationOptions, limit, locationInput } from "./constants";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
let zoom = 6;
let pinStyles;
let marker_icon;
let selected_marker_icon;
let openMapCenter = '';
let openMapZoom = '';
let markers = [];
let bounds;
var mapMarkerClusterer = null;
let selectedLocationIndex = -1;
let openInfoWindow = false;

export const map = new google.maps.Map(document.getElementById("map"), {
  center: { lat: 40.693807, lng: 73.9917 },
  zoom: zoom,
  styles: [
    {
      "featureType": "all",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "weight": "2.00"
        }
      ]
    },
    {
      "featureType": "all",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#9c9c9c"
        }
      ]
    },
    {
      "featureType": "all",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
        {
          "color": "#f2f2f2"
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [
        {
          "saturation": -100
        },
        {
          "lightness": 45
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#7b7b7b"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
        {
          "color": "#46bcec"
        },
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#c8d7d4"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#070707"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    }


  ],
  mapTypeControl: false,
});

export function centerOnGeo(geo) {
  let lat, lng;
  if (geo && geo.coordinate) {
    lat = geo.coordinate.latitude;
    lng = geo.coordinate.longitude;
  } else {
    lat = currentLatitude;
    lng = currentLongitude;
  }
  [].slice
    .call(document.querySelectorAll(".error-text") || [])
    .forEach(function (el) {
      el.textContent = "";
    });
  map.setCenter({ lat: lat, lng: lng });
  map.setZoom(zoom);
}

function hexToRgb(hex) {
  const m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}


function changeColor(hex, amt) {
  const rgb = hexToRgb(hex);

  Object.keys(rgb).forEach(function (key) {
    let c = rgb[key];
    c += amt;
    if (c > 255) c = 255;
    else if (c < 0) c = 0;

    rgb[key] =
      c.toString(16).length == 1 ? "0" + c.toString(16) : c.toString(16);
  });

  return "#" + rgb.r + rgb.g + rgb.b;
}

export function addMarkersToMap(locations) {
  let marker;
  bounds = new google.maps.LatLngBounds();
  for (let index = 0; index < markers.length; index++) {
    marker = markers[index];
    marker.setMap(null);
  }
  markers = [];

  const coordinates = {
    value: { latitude: 0, longitude: 0 },
    contentSource: "FIELD",
  };
  pinStyles = {
    fill: "#000",
    stroke: "#000",
    text: "white",
    fill_selected: "#ac4639",
    stroke_selected: "#ac4639",
    text_selected: "white",
  };



  let offset = Number($('#offset').val());

  try {
    if
      (mapMarkerClusterer) {
        mapMarkerClusterer.clearMarkers();
    }
  } catch (e) { }
  for (let index = 0; index < locations.length; index++) {
    const location = locations[index];
    let coordinatesValue = coordinates["value"];


    coordinatesValue = getValueFromPath(
      location,
      locationOptions.coordinates.value
    );

    coordinatesValue = coordinatesValue || getValueFromPath(
      location,
      locationOptions.coordinates.value
    );
    let markerLabel = Number(index + 1);
    if (location.c_christoflecountry == "all-shopes,seller-shopes") {

      marker_icon = "/images/map-pin.png";
      selected_marker_icon = "/images/map-pin.png";

    } else if (location.c_christoflecountry == "all-shopes,reseller-shop") {

      marker_icon = "/images/green_pin.png";
      selected_marker_icon = "/images/green_pin.png";

    }

    var html = '';

    if (coordinatesValue) {
      marker = new google.maps.Marker({
        title: location.name.toString(),
        position: {
          lat: coordinatesValue.latitude,
          lng: coordinatesValue.longitude,
        },
        map: map,
        icon: marker_icon,
        optimized: false,
      });
      const selected_marker = new google.maps.Marker({
        position: {
          lat: coordinatesValue.latitude,
          lng: coordinatesValue.longitude,
        },
        map: map,
        icon: selected_marker_icon,
        optimized: false,
      });

      selected_marker.setVisible(false);

      bounds.extend(marker.position);
      var infoWindow = new google.maps.InfoWindow();
      google.maps.event.addListener(selected_marker, "click", function () {
        highlightLocation(index, true, true, selected_marker, bounds);
      });

      google.maps.event.addListener(marker, "click", function () {
        highlightLocation(index, false, false, marker, bounds);
      });


      markers.push(marker);
    }
  }
  if (markers.length > 0) {
    mapMarkerClusterer = new MarkerClusterer({ markers, map });
  }
  map.fitBounds(bounds);

}

export function highlightLocation(
  index,
  shouldScrollToRow,
  shouldCenterMap,
  marker = null,
  infoWindow = null,
  bounds = null
) {
  if (!marker) {
    marker = markers[index];
  }
  if (selectedLocationIndex == index) {

    if (infoWindow) {

      var fullcontent = $('#result-' + index).html();
      $('#full-details').empty();
      $('#full-details').append(fullcontent).prepend('<a href="javascript:void(0);" class="back"><span class="icon font-chrisfo-icon">i</span></a><span class="space"></span>');
      $('#full-details').addClass('active-detail');
      $('#full-details *').removeAttr('id');

      // console.log(markerContent);

      var mapZoom = map.getZoom();
      var mapCenter = map.getCenter();

      marker.addListener("click", () => {
        if (!openInfoWindow) {
          openMapZoom = map.getZoom(5);
          openMapCenter = map.getCenter();
        }
        document.querySelectorAll(".full-details")[index].classList.add("active");

        map.setZoom(12);
        map.setCenter(marker.getPosition());
        infoWindow.setContent(fullcontent);
        infoWindow.open(map, marker);
        openInfoWindow = true;
      });


    }

  } else {

    const prevIndex = selectedLocationIndex;
    selectedLocationIndex = index;

    [].slice
      .call(document.querySelectorAll(".result") || [])
      .forEach(function (el) {
        el.classList.remove("selected");
      });

    if (prevIndex !== -1) {
      const prevMarker = markers[prevIndex];
      if (prevMarker) {

        let offset = Number($('#offset').val());
        let markerLabel = Number(prevIndex + 1);
        prevMarker.setClickable(false);

        prevMarker.setZIndex(null);

        setTimeout(function () {
          prevMarker.setClickable(true);
        }, 50);

      }
    }


    const selectedMarker = markers[selectedLocationIndex];


    let offset = Number($('#offset').val());
    if (typeof offset === 'undefined') {
      offset = 0;
    }
    let markerLabel = Number(selectedLocationIndex + 1);

	if(selectedMarker){
		  selectedMarker.setZIndex(999);
	}
	if(typeof marker !== 'undefined'){
		if (shouldCenterMap) {
			map.setCenter(marker.position);
		}
	}


    if (infoWindow) {

      var fullcontent = $('#result-' + index).find('.center-column').html();
      $('#full-details').empty();
      $('#full-details').append(fullcontent).prepend('<a href="javascript:void(0);" class="back"><span class="icon font-chrisfo-icon">i</span></a><span class="space"></span>');
      $('#full-details').addClass('active-detail');
      $('#full-details *').removeAttr('id');

    }
  }
}
export const geoCorder = new google.maps.Geocoder();

function getCustomPinColor(hex) {
  const rgb = hexToRgb(hex);

  const lightness = (rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722) / 255;
  const isDark = lightness < 0.5;

  if (isDark) {
    return {
      fill: hex,
      stroke: "#fff",
      text: "#fff",
      fill_selected: changeColor(hex, 150),
      stroke_selected: hex,
      text_selected: "#000",
    };
  } else {
    const darker = changeColor(hex, -150);
    return {
      fill: hex,
      stroke: darker,
      text: "#000",
      fill_selected: darker,
      stroke_selected: "#fff",
      text_selected: "#fff",
    };
  }
}