import {
  entityTypes,
  liveAPIKey,
  locationInput,
  savedFilterId,
  limit,
} from "./constants";
import { scrollToRow  } from "./utils";
import { renderLocations, renderSearchDetail,getLocations,offset, getCountry } from "./locations";
import { addMarkersToMap, centerOnGeo } from "./map";
console.log(liveAPIKey);

export let isLoading = false;
let locations = [];
export function startLoading() {
 
  isLoading = true;

  [].slice
    .call(document.querySelectorAll(".spinner") || [])
    .forEach(function (el) {
      el.style.visibility = "visible";
    });
  [].slice
  .call(document.querySelectorAll(".search-center") || [])
  .forEach(function (el) {
   el.innerHTML = "";
  });
  [].slice
    .call(document.getElementsByClassName("result") || [])
    .forEach(function (el) {
   
      el.innerHTML = '<div class="skeleton h-6 flex-grow mx-4 my-10"></div>';
    });
  locationInput.disabled = true;
  [].slice
    .call(document.querySelectorAll(".search") || [])
    .forEach(function (el) {
      el.classList.add("disabled");
    });
}

export function stopLoading() {
  isLoading = false;

  [].slice
    .call(document.querySelectorAll(".spinner") || [])
    .forEach(function (el) {
      el.style.visibility = "hidden";
    });
  [].slice
    .call(document.querySelectorAll(".result-list") || [])
    .forEach(function (el) {
      el.style.visibility = "visible";
    });
  locationInput.disabled = false;
  [].slice
    .call(document.querySelectorAll(".search") || [])
    .forEach(function (el) {
      el.classList.remove("disabled");
    });
}

export function getRequest(request_url, queryString) {
  if (queryString !== null) {
    const newUrl = window.location.href.replace(
      /(\?.*)?$/,
      "?q=queryString".replace("queryString", queryString)
    );
    if (
      window.history.state &&
      window.history.state.queryString !== queryString
    ) {
      window.history.pushState({ queryString: queryString }, "", newUrl);
    } else {
      window.history.replaceState({ queryString: queryString }, "", newUrl);
    }
  }

  startLoading();
  request_url += "&api_key=" + liveAPIKey;
  request_url += "&v=" + "20200308";
  request_url += "&resolvePlaceholders=true";


  if (entityTypes) {
    request_url += "&entityTypes=" + entityTypes;
  }

  if (savedFilterId) {
    request_url += "&savedFilterIds=" + savedFilterId;
  }


  
  let totalCount = Number($('#totalCount').val());
  if(offset==0){
    locations=[];
   }
  
  fetch(request_url, { method: "GET" })
    .then((res) => res.json())
    .then(function (data) {
     
      if (data.meta.errors && data.meta.errors.length == 0) {
		  
		  // alert(data.meta.errors[0]["message"]);
      	  
		  for (let i = 0; i < data.response.entities.length; i++) {
			const location = data.response.entities[i];

			if (data.response.distances) {
			  location.__distance = data.response.distances[i];
			}
			locations.push(location);
		  }
	  
	  }
	  
      renderLocations(locations, false, false);
      renderSearchDetail(
        data.response.geo,
        locations.length,
        data.response.count,
        queryString
      );
      $('#totalCount').val(data.response.count);
	  
      let rowCount = offset + limit;
          
      
      if (rowCount >= data.response.count) {
		$('.viewMoreBtnDiv').css("display", "none");
      } else {
		$('.viewMoreBtnDiv').css("display", "block");		 
      }
          
      $('#offset').val(offset);
		
      // scrollToRow(offset);
      addMarkersToMap(locations);
	  
	  
	  if(typeof locations !== 'undefined'){
		 // getCountry(locations); 
	  }

      if (locations.length == 0) {
        centerOnGeo(data.response.geo);
		$(".result-list-inner").html(`<div id="result-0" class="result !pl-4 text-center"><div class="center-column">Data not found.</div></div>`);
		
      }
	  
      [].slice
        .call(document.querySelectorAll(".error-text") || [])
        .forEach(function (el) {
          el.textContent = "";
        });
      stopLoading();

    $(".open-now-string").click(function () { 
      var closeThis = $(this);
      closeThis.parents('.lp-param-results').find(".storelocation-openCloseTime").slideToggle();
    });
	
  }).catch((err) => { 
	  console.log(err);
      $(".viewMoreBtnDiv").hide();
      $(".custom-pagination-links").html("");
      $(".result-list-inner").html(`<div id="result-0" class="result !pl-4 text-center"><div class="center-column">Something went wrong. Re-try after some time.</div></div>`);
    });
}
