import {
  defaultQuery,
  enableAutocomplete,
  loadLocationsOnLoad,
  locationInput,
  searchButton,
  useMyLocation,
  researchButton
} from "./locator/constants";
import { getLocations, getNearestLocationsByString, getUsersLocation, getDepartments, getcity, getshop } from "./locator/locations";
import { getQueryParamsFromUrl } from "./locator/utils";
import { isLoading } from "./locator/loader";
// @ts-ignore
import google from "google";

researchButton.addEventListener("click", function () {
	 
	if(locationInput.value !== ''){  
    $('#offset').val(0); 
		getNearestLocationsByString();
	}

});


searchButton.addEventListener("click", function () {
   if(locationInput.value !== ''){   
		getNearestLocationsByString();
   }
});


useMyLocation.addEventListener("click", function () {
  $('#offset').val(0);
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
  // getNearestLocationsByString();
});


locationInput.addEventListener("keydown", function (e) { 
  if(locationInput.value.trim() != "" && ( e.key=="Enter" )){  
    $('#offset').val(0);  
    getLocations();
  }  
}, {passive: true} ); 

let keyup_loading = false;
locationInput.addEventListener("keyup", function (e) {  
		
	if(locationInput.value.trim() != "" ){
      keyup_loading=true; 
    }
	keyup_loading=true; 	
	if( locationInput.value.trim() == "" && (e.key === "Delete" || e.key === "Backspace" || e.key=="x") && keyup_loading ){	  
    $('#offset').val(0);
	  getLocations();	
	  keyup_loading=false;	
    }
});
locationInput.addEventListener("selected", function (e) {  
	
	if(locationInput.value.trim() != "" ){
      keyup_loading = true; 
    }
	if(locationInput.value.trim() == "" && keyup_loading){
    $('#offset').val(0);	    
	  getLocations();	
	  keyup_loading=false;	
    }
	
});


if (loadLocationsOnLoad) {
  $('#offset').val(0);
  getLocations();
  getDepartments();
  getcity("");
  getshop("");
}

document.getElementById("viewMoreBtn").addEventListener("click", function() {
  if(locationInput.value == ''){
      getLocations();
  }else{
      getNearestLocationsByString();
  }
});

if (enableAutocomplete) {
  const autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("location-input"),
    {
      options: {
        // types: ["(regions)"],
        // componentRestrictions: {'country': "us"}
      },
    }
  );
  autocomplete.addListener("place_changed", () => {
    if (!isLoading) {
        getLocations();
    }
  });
}

