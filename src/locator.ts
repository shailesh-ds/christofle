import {
  defaultQuery,
  enableAutocomplete,
  loadLocationsOnLoad,
  locationInput,
  searchButton,
  useMyLocation,
  researchButton
} from "./locator/constants";
import { getLocations, getNearestLocationsByString, getUsersLocation } from "./locator/locations";
import { getQueryParamsFromUrl } from "./locator/utils";
import { isLoading } from "./locator/loader";
// @ts-ignore
import google from "google";

researchButton.addEventListener("click", function () {
  // $('#offset').val(0);	
 getLocations(0);
});
searchButton.addEventListener("click", function () {
   // $('#offset').val(0);	
  getNearestLocationsByString();
});

useMyLocation.addEventListener("click", function () {
  getUsersLocation();
});

window.addEventListener("popstate", function (e) {
  if (e.state && e.state.queryString) {
    locationInput.value = e.state.queryString;
    getNearestLocationsByString();
  }
});

window.addEventListener("load", function () {
  const params = getQueryParamsFromUrl();
  const queryString = params["q"] || defaultQuery;
  locationInput.value = decodeURI(queryString);
  getNearestLocationsByString();
});


locationInput.addEventListener("keyup", function (e) {
  if (e.key === "Enter"&&locationInput.value!="") {
   getNearestLocationsByString();
  }
});

if (loadLocationsOnLoad) {
  getLocations(0);
}

if (enableAutocomplete) {
  const autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("location-input"),
    {
      options: {
        //types: ["(regions)"],
        componentRestrictions: {'country': "us"}
      },
    }
  );
  autocomplete.addListener("place_changed", () => {
    if (!isLoading) {
        getNearestLocationsByString();
    }
  });
}

//for backspace data reload:-
// locationInput.addEventListener("keyup", function (e) {

//   if(locationInput.value.trim() ==""){
//     getLocations(0);
//   }
  
// });
// qurey suggestion starts here

let locationInp = locationInput;


let querySearch = document.getElementById("query-search");

//var matchList = document.getElementById('result');

var searchStates = async searchText => {
  var res = await fetch('https://liveapi.yext.com/v2/accounts/me/entities?&sortBy=[{%22name%22:%22ASCENDING%22}]&filter={}&api_key=308d4d3f6ae747ccda5a5c0bbb8249a6&v=20181201&resolvePlaceholders=true&entityTypes=location&savedFilterIds=1160385474&limit=50');

  var states = await res.json();
  const searchres = states.response.entities;

  let matches = searchres.filter(state => {
    const regex = new RegExp(`^${searchText}`, 'gi');
    //const city=state.address.city;

    const res = state.name.match(regex);


    return res;

  });

  if (searchText.length === 0) {
    matches = [];

    querySearch.innerHTML = '';

  }

  outputHtml(matches);
}

const outputHtml = matches => {
  let html = '';
  if (matches.length > 0) {
    html += '<div class="px-3 py-2 max-h-[400px] overflow-x-hidden overflow-y-auto bg-[#f2f2f2] shadow-xl">';
     matches.map(match =>
      html += `<div  class="query inline-block w-full leading-6" id="${match.name}">
      <h6>${match.name}</h6>
      </div>
      `).join('');
      html += '</div>';
    querySearch.innerHTML = html;
    
  }
};
$(document).on('click', '.query', function () {
  let res=$(this).attr('id');
  $('#location-input').val(res);
  getNearestLocationsByString();
  })

locationInp.addEventListener('input', () => searchStates(locationInp.value));


$('#query-search').click(function () {
  $("#query-search").empty();
});