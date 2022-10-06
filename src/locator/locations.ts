import {
  formatMiOrKm,
  formatNumber,
  formatPhone,
  getValueFromPath,
} from "./utils";
import {
  parseTimeZoneUtcOffset,
  formatOpenNowString,
} from "./time";
import { i18n } from "../i18n";
import {
  base_url,
  limit,
  locationInput,
  locationNoun,
  locationNounPlural,
  locationOption,
  locationOptions,
  radius,
  savedFilterId,
  entityTypes,
  liveAPIKey,
} from "./constants";

// import { multilangData, multilangData } from "./multilangData";
import { multilangData, Days } from "./MultiLangData";

import { getRequest, startLoading, stopLoading } from "./loader";
import RtfConverter from "@yext/rtf-converter";
import { highlightLocation } from "./map";
export let currentLatitude = 0;
export let currentLongitude = 0;
var ourURL = window.location.href;
export let offset = 0;
var langauage = "";
if (ourURL.includes("/fr")) {
  langauage = "fr";
}
else if (ourURL.includes("/ja")) {
  langauage = "ja";
}
else if(ourURL.includes("/en")){
  langauage = "en";
}
export function locationJSONtoHTML(entityProfile, index, locationOptions) {
  let APIlanguage = entityProfile.meta.language
  const getValue = (opt: locationOption) => {
    let val = opt.value;

    if (opt.contentSource === "FIELD") {
      val = getValueFromPath(entityProfile, opt.value);

    }
    return opt.isRtf && !!val ? RtfConverter.toHTML(val) : val;
  };


  // Locator page Static data

   let title = '';
   let Store = '';
   let FilterBtn = '';
   let StoreTitle = '';
   let ViewMore = '';
   let home = '';


  //  let getDirection = '';
  
    title += `<div>${multilangData[APIlanguage].allStore}</div>`;
    Store += `<li>${multilangData[APIlanguage].storeLocator}</li>`
    FilterBtn += `${multilangData[APIlanguage].filter}`;
    StoreTitle += `${multilangData[APIlanguage].storeLocator}`
    ViewMore += `${multilangData[APIlanguage].viewMore}`
    home += `${multilangData[APIlanguage].Home}`
    
   
    // getDirection += `${multilangData.getDirection[APIlanguage]}`
  
   $(".LocatorTitle").html(title);
   $(".Store-locator").html(Store);
   $(".Filter").html(FilterBtn);
   $(".StoreTitle").html(StoreTitle);
   $(".ViewMore").html(ViewMore);
   $(".home").html(home);


  //  $(".Getdirectionslug").html(getDirection);
  
  const cardTitleValue = getValue(locationOptions.cardTitle);
  const getDirectionsLabelValue = getValue(locationOptions.getDirectionsLabel);
  const viewDetailsLinkTextValue = getValue(
    locationOptions.viewDetailsLinkText
  );
  let cardTitleLinkUrlValue = getValue(locationOptions.cardTitleLinkUrl);
  const hoursValue = getValue(locationOptions.hours);
  const addressValue = getValue(locationOptions.address);
  const phone = getValue(locationOptions.phoneNumber);
  const phoneno = getValue(locationOptions.catringnumber);
  const Email = getValue(locationOptions.Email);
  const locale = getValue(locationOptions.locale);
  const cordinates = getValue(locationOptions.yextCoordinates);
  const photoGallery2 = getValue(locationOptions.photoGallery);
  const brandsname = getValue(locationOptions.status);
  const detailShop = getValue(locationOptions.detailShop);
  const phoneNumberValue = phone.toString();
  let viewDetailsLinkUrlValue = getValue(locationOptions.viewDetailsLinkUrl);
  let html =
    '<div class="lp-param-results lp-subparam-cardTitle lp-subparam-cardTitleLinkUrl">';
  
  if (cardTitleLinkUrlValue && cardTitleValue) {

    if (cardTitleLinkUrlValue["url"]) {
      cardTitleLinkUrlValue = cardTitleLinkUrlValue["url"];

    }

  }
  else if (cardTitleValue) {
    html += `<button id ="result1" class="name hover:underline hover:font-semibold text-ll-red " >
      ${cardTitleValue}
    </button>`;
  }
  let slugValue = '';
  if(cardTitleLinkUrlValue){slugValue=cardTitleLinkUrlValue}else{slugValue= cardTitleValue}
  html += "</div>";

  html += '<div class="result-img w-2/5 rounded-tl-2xl rounded-br-2xl relative overflow-hidden"><img src="'+photoGallery2[0].image.url+'" class="rounded-tl-2xl rounded-br-2xl w-full h-full absolute top-0 left-0 object-cover transition-all duration-500 transform hover:scale-105"/></div>';
  html += '<div class="result-content w-3/5 p-3 text-sm relative text-dark_grey"><h4 class="mb-2.5"><a href="javascript:void(0);" class="storelocation-name details text-base font-bold inline-block text-black hover:text-red">' + ucwords(cardTitleValue) + '</a> </h4>';

  html += '<div class="address mb-1.5 text-sm leading-6 relative pl-6"><svg class="bg-red rounded-full fill-white absolute top-0.5 left-0 w-5 h-5 p-1 mr-2" xmlns="http://www.w3.org/2000/svg"width="7.954" height="10.606" viewBox="0 0 7.954 10.606"> <path id="Icon_awesome-map-marker-alt" data-name="Icon awesome-map-marker-alt"d="M3.568,10.392C.559,6.029,0,5.581,0,3.977a3.977,3.977,0,0,1,7.954,0c0,1.6-.559,2.051-3.568,6.415a.5.5,0,0,1-.817,0Zm.409-4.758A1.657,1.657,0,1,0,2.32,3.977,1.657,1.657,0,0,0,3.977,5.634Z" /> </svg>';

  html += ucwords(addressValue.line1) + ', ' + ucwords(addressValue.city) + ', ' + ucwords(addressValue.postalCode) + ', ' + ucwords(addressValue.countryCode) + '<br>' + "</div>";
  //end
  
  //phone number start here
  html += '<a href=" tel:'+ phone+ '" class="phone mb-1.5 text-sm leading-6 relative pl-6"><svg class="bg-red rounded-full fill-white absolute top-0.5 left-0 w-5 h-5 p-1 mr-2" xmlns="http://www.w3.org/2000/svg"width="7.955" height="7.955" viewBox="0 0 7.955 7.955"> <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt"d="M7.728,5.621l-1.74-.746a.373.373,0,0,0-.435.107l-.771.942A5.759,5.759,0,0,1,2.029,3.172L2.971,2.4a.372.372,0,0,0,.107-.435L2.332.226A.375.375,0,0,0,1.9.01L.289.383A.373.373,0,0,0,0,.746,7.208,7.208,0,0,0,7.209,7.955a.373.373,0,0,0,.364-.289L7.945,6.05a.377.377,0,0,0-.218-.429Z"transform="translate(0 0)" /> </svg>' + phone + "</a>";
  if (phoneno) {
    html += '<a href="  tel:'+ phoneno+'" class="phone mb-1.5 text-sm leading-6 relative pl-6"><svg class="bg-red rounded-full fill-white absolute top-0.5 left-0 w-5 h-5 p-1 mr-2" xmlns="http://www.w3.org/2000/svg"width="7.955" height="7.955" viewBox="0 0 7.955 7.955"> <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt"d="M7.728,5.621l-1.74-.746a.373.373,0,0,0-.435.107l-.771.942A5.759,5.759,0,0,1,2.029,3.172L2.971,2.4a.372.372,0,0,0,.107-.435L2.332.226A.375.375,0,0,0,1.9.01L.289.383A.373.373,0,0,0,0,.746,7.208,7.208,0,0,0,7.209,7.955a.373.373,0,0,0,.364-.289L7.945,6.05a.377.377,0,0,0-.218-.429Z"transform="translate(0 0)" /> </svg>' + phoneno + "</a>";
  }
  html += '<div class="phone mb-1.5 text-sm leading-6 relative pl-6">' + Email + "</div>";

  //end


  function tConvert(time) {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      time = time.slice(1);

      time[5] = +time[0] < 12 ? multilangData[APIlanguage].Am : multilangData[APIlanguage].Pm;
      time[0] = +time[0] % 12 || 12;
    }
    return time.join('');
  
  
  
  
  
  }
  function convertDays(days) {
    const currentDate = new Date();
    const dayNumber = currentDate.getDay();
    const currentSelectedDay = days[dayNumber];
    const beforeSelected = days.slice(0, dayNumber);
    const afterSelected = days.slice(dayNumber, days.length);
    beforeSelected.forEach((element) => {
      afterSelected.push(element);
    });
    return {
      afterSelected: afterSelected
    };
  }

  if (hoursValue) {
    const offset = getValueFromPath(entityProfile, "timeZoneUtcOffset");
    const parsedOffset = parseTimeZoneUtcOffset(offset);
    html += '<div class="lp-param-results lp-subparam-hours relative">';
    html +=
      '<div class="open-now-string text-black" data-id="main-shop-' + index + '">' +
      formatOpenNowString(hoursValue, parsedOffset) +
      "</div>";

    html += '<div class="storelocation-openCloseTime" style="display:none;" >';
    html += '<ul id="time-row-main-shop-' + index + '">';
  
    let dayConvert = Days[APIlanguage];


    const days_string = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const convertedDays = convertDays(days_string);

    let sort_array = [];
    $.each(convertedDays.afterSelected, function (indexh, convertedDay) {
      let daya = [
        convertedDay, hoursValue[convertedDay]
      ];

      sort_array.push(daya);

    });

    console.log(sort_array);

    $.each(sort_array, function (indexh, hour) {

      html += '<li class="time-row [&:nth-child(odd)]:bg-black [&:nth-child(odd)]:bg-opacity-5 [&:first-child]:bg-red [&:first-child]:bg-opacity-100 [&:first-child]:text-white px-2 py-1">'
      html += '<div><strong class="daydiv days_values font-bold w-20 inline-block" >';
      html += dayConvert[hour[0].toString()] + ' ';
      html += '</strong>';
      if (hour[1].openIntervals) {
       
        $.each(hour[1].openIntervals, function (op, openInterval) {
         
          html += tConvert(openInterval.start) +  multilangData[APIlanguage].To + tConvert(openInterval.end);
          
     
        
        });
      } else {
        html += '<span class="text-red closed" >'+multilangData[APIlanguage].closed+'</span>';
        
      }
      html += '</div>';
      html += '</li>'

    });
    html += '</ul>';

    html += "</div></div>";
  }
  
  console.log(entityProfile.meta.language, 'check locale value')
  
  const singleLineAddress =
    entityProfile.name +
    " " +
    addressValue.line1 +
    " " +
    (addressValue.line2 ? addressValue.line2 + " " : "") +
    addressValue.city +
    " " +
    addressValue.region +
    " " +
    addressValue.postalCode;
  html += `<div class="flex flex-col text-center justify-between">
  <div class="mb-1.5">
      <a target="_blank" class="w-full text-sm leading-[22px] py-1.5 font-semibold text-red px-2.5 rounded-sm border border-red inline-flex items-center justify-center transition-all duration-300 group hover:text-white hover:bg-red capitalize" href="https://www.google.com/maps/dir/?api=1&destination=${cordinates.latitude},${cordinates.longitude}"><svg class="fill-red w-4 h-4 mr-2 group-hover:fill-white" xmlns="http://www.w3.org/2000/svg" width="7.954" height="10.606" viewBox="0 0 7.954 10.606"><path data-name="Icon awesome-map-marker-alt" d="M3.568,10.392C.559,6.029,0,5.581,0,3.977a3.977,3.977,0,0,1,7.954,0c0,1.6-.559,2.051-3.568,6.415a.5.5,0,0,1-.817,0Zm.409-4.758A1.657,1.657,0,1,0,2.32,3.977,1.657,1.657,0,0,0,3.977,5.634Z"></path></svg><span class="inline-block">${multilangData[APIlanguage].getDirection}</span></a></div>`;

    html += `<div class=""><a class="w-full text-sm leading-[22px] py-1.5 font-semibold text-white px-2.5 rounded-sm border bg-red border-red inline-flex items-center justify-center transition-all duration-300 group hover:text-red hover:bg-white capitalize" href="/${slugValue}">${multilangData[APIlanguage].detailPage} <svg class="ml-1.5 fill-white group-hover:fill-red" xmlns="http://www.w3.org/2000/svg" width="16.987" height="11.33" viewBox="0 0 16.987 11.33"><path data-name="Icon ionic-ios-arrow-round-forward" d="M18.708,11.469a.771.771,0,0,0-.006,1.086l3.587,3.593H8.636a.767.767,0,0,0,0,1.534H22.284L18.7,21.275a.777.777,0,0,0,.006,1.086.764.764,0,0,0,1.08-.006l4.862-4.9h0a.861.861,0,0,0,.159-.242.732.732,0,0,0,.059-.3.769.769,0,0,0-.218-.537l-4.862-4.9A.752.752,0,0,0,18.708,11.469Z" transform="translate(-7.875 -11.252)"></path></svg></a> </div></div>`
  

  
  html = `<div class="center-column relative bg-white rounded-tl-2xl rounded-br-2xl flex flex-wrap leading-6 shadow-[4px_8px_6px_rgba(0,0,0,0.10)]">${html}</div>`;

 
  return `<div id="result-${index}" class="result mb-5 lg:pr-5">${html}</div>`;
}




export function renderLocations(locations, append, viewMore) {
  if (!append) {
    [].slice
      .call(document.querySelectorAll(".result-list-inner") || [])
      .forEach(function (el) {
        el.innerHTML = "";
      });
  }

  
  locations.forEach((location, index) => {
    [].slice
      .call(document.querySelectorAll(".result-list-inner") || [])
      .forEach(function (el) {
        el.innerHTML += locationJSONtoHTML(location, index, locationOptions);
      });
  });

  locations.forEach((_, index) => {
    document
      .getElementById("result-" + index)
      .addEventListener("mouseover", () => {
        highlightLocation(false, true, true);
      });
    document.getElementById("result-" + index).addEventListener("click", () => {
      highlightLocation(false, false, true);
    });
  });

  if (viewMore) {
    [].slice
      .call(document.querySelectorAll(".result-list-inner") || [])
      .forEach(function (el) {
        el.innerHTML +=
          '<div><div class="btn btn-link btn-block">View More</div></div>';
      });
  }
}

function searchDetailMessageForCityAndRegion(total) {
  if (total === 0) {
    return '0 [locationType] found near <strong>"[city], [region]"</strong>';
  } else {
    return '[formattedVisible] of [formattedTotal] [locationType] near <strong>"[city], [region]"</strong>';
  }
}

function searchDetailMessageForArea(total) {
  if (total == 0) {
    return '0 [locationType] found near <strong>"[location]"</strong>';
  } else {
    return '[formattedVisible] of [formattedTotal] [locationType] near <strong>"[location]"</strong>';
  }
}

function searchDetailMessageNoGeo(total) {
  if (total === 0) {
    return "0 [locationType]";
  } else {
    return "[formattedVisible] of [formattedTotal] [locationType]";
  }
}
export function renderSearchDetail(geo, visible, total, queryString) {
  

  let locationType = locationNoun;
  if (total === 0 || total > 1) {
    locationType = locationNounPlural;
  }

  let formattedVisible = formatNumber(visible);
  let formattedTotal = formatNumber(total);

  let searchDetailMessage;
  if (geo) {
    if (geo.address.city !== "") {
      searchDetailMessage = searchDetailMessageForCityAndRegion(total);
      searchDetailMessage = searchDetailMessage.replace(
        "[city]",
        geo.address.city
      );
      searchDetailMessage = searchDetailMessage.replace(
        "[region]",
        geo.address.region
      );

    } else {
      let location = "";
      if (geo.address.region) {
        location = geo.address.region;
      } else if (geo.address.country && queryString) {
        location = queryString;
      } else if (geo.address.country) {
        location = geo.address.country;
      }
      if (location !== "") {
        searchDetailMessage = searchDetailMessageForArea(total);
        searchDetailMessage = searchDetailMessage.replace(
          "[location]",
          location
        );
      }
    }
  } else {
    searchDetailMessage = searchDetailMessageNoGeo(total);
  }
  searchDetailMessage = searchDetailMessage.replace(
    "[locationType]",
    locationType
  );
  searchDetailMessage = searchDetailMessage.replace(
    "[formattedVisible]",
    formattedVisible
  );
  searchDetailMessage = searchDetailMessage.replace(
    "[formattedTotal]",
    formattedTotal
  );

  [].slice
    .call(document.querySelectorAll(".search-center") || [])
    .forEach(function (el) {
      el.innerHTML = "";
    });
  [].slice
    .call(document.querySelectorAll(".search-center") || [])
    .forEach(function (el) {
      el.innerHTML = searchDetailMessage;
    });
}


export function getNearestLocationsByString() {
  const queryString = locationInput.value;
  if (queryString.trim() !== "") {

    let request_url =
      base_url +
      "entities" +
      "?limit=" +
      limit +
      "&offset=" +
      offset +
      '&sortBy=[{"name":"ASCENDING"}]';

    let filterParameters = {};
    let filterAnd = {};
    let filterOr = {};

    if (queryString) {

      filterOr = {
        "$or": [
          { "address.line1": { "$contains": queryString } },
          { "address.city": { "$contains": queryString } },
          { "address.region": { "$contains": queryString } },
          { "address.countryCode": { "$contains": queryString } },
          { "address.postalCode": { "$contains": queryString } },
          { "name": { "$contains": queryString } },
          { "mainPhone": { "$contains": queryString } }
        ]
      };

    }

    var ce_departments = [];
    $('.checkbox_departments').each(function () {
      if ($(this).is(":checked")) {
        ce_departments.push($(this).val());
      }
    });

    if (ce_departments.length > 0) {
      filterAnd = { "$and": [{ "c_departments": { "$in": ce_departments } }] };
    }

    filterParameters = { ...filterOr, ...filterAnd };
    var filterpar = JSON.stringify(filterParameters);
    var filter = encodeURI(filterpar);

    if (filter) {
      request_url += "&filter=" + filter;
    }



    getRequest(request_url, queryString);
  }
  var url = window.location.href;
  var myStorage = window.sessionStorage;
  sessionStorage.setItem('query', url);

}


function getNearestLatLng(position) {
  [].slice
    .call(document.querySelectorAll(".error-text") || [])
    .forEach(function (el) {
      el.textContent = "";
    });
  currentLatitude = position.coords.latitude;
  currentLongitude = position.coords.longitude;
  let request_url = base_url + "entities?entities/geosearch";
  request_url += "?radius=" + radius;
  request_url +=
    "&location=" + position.coords.latitude + ", " + position.coords.longitude;
  request_url += "&limit=" + limit;
  getRequest(request_url, null);
}



export function getLocations(offset) {
  let request_url =
    base_url +
    "entities" +
    "?limit=" +
    limit +
    "&offset=" +
     offset +
    "&languages=" +
    langauage +
    '&sortBy=[{"name":"ASCENDING"}]';

  let filterParameters = {};
  let filterAnd = {};
  let filterOr = {};

  const queryString = locationInput.value;
  // filterOr ={
  //   "$or":[
  //     {"closed" : {"$eq" : false}}
  //   ]
  // }
  if (queryString) {

    filterOr = {
      "$or": [
        { "address.line1": { "$contains": queryString } },
        { "address.city": { "$contains": queryString } },
        { "address.region": { "$contains": queryString } },
        { "address.countryCode": { "$contains": queryString } },
        { "address.postalCode": { "$contains": queryString } },
        { "name": { "$contains": queryString } }
      ]
    };
  }

  var ce_departments = [];
  $('.checkbox_departments').each(function () {
    if ($(this).is(":checked")) {
      ce_departments.push($(this).val());
    }
  });

  if (ce_departments.length > 0) {
    filterAnd = { "$and": [{ "c_company_services": { "$in": ce_departments } }] };

  }

  filterParameters = { ...filterOr, ...filterAnd };
  var filterpar = JSON.stringify(filterParameters);
  var filter = encodeURI(filterpar);

  if (filter) {
    request_url += "&filter=" + filter;
  }

  
  getRequest(request_url, null);

}
// getLocations(0);

document.getElementById("viewMoreBtn").addEventListener("click", function () {
  let newOffset = offset + limit;
  offset = newOffset;
  getLocations(offset);
});

// End Here
function ucwords(title) {
  let str = title.toLowerCase();
  str = str.replace(/-/g, ' ');
  str = str.replace(/_/g, ' ');
  return str.replace(/(^([a-zA-Z\p{M}]))|([ -_][a-zA-Z\p{M}])/g, function (s) { return s.toUpperCase(); });
}




export function getDepartments() {
  var baseURL = "https://liveapi-sandbox.yext.com/v2/accounts/me/entities?";
  var api_key = "b262ae7768eec3bfa53bfca6d48e4000";
  var vparam = "20161012";
  var entityTypes = "location";
  var savedFilterId = "982931142";
   var fullURL =
    baseURL +
    "api_key=" +
    api_key +
    "&v=" +
    vparam +
    "&resolvePlaceholders=true" +
    "&languages=" +
    langauage +
    "&entityTypes=" +
    entityTypes +
    "&savedFilterIds=" +
    savedFilterId +
    "&fields=address" + 
    "&limit=50";

  fetch(fullURL).then(response => response.json()).then(result => {

    if (!result.errors) {

      var url_string = window.location.href;
      var url = new URL(url_string);
      var country = url.searchParams.get("Country");
      var html = '';
      html += '<div class=" department-list flex justify-center">';
      html += '  <div class="select-box w-full md:w-auto">';
      html += `   <select id="mySelect" class="checkbox_departments appearance-none w-full bg-white py-2 px-3 border-8 border-white text-sm focus:outline-none" aria-label="Default select example">`
      let somecountry = '';
      if (url_string.includes('Country')) {
        somecountry = '<option selected>' + country + '</option>';
      }
      
    
      else {
        const regionNames = new Intl.DisplayNames(
          ['en', 'fr', 'ja'], { type: 'region' }
        );
        html += `<option value=""disabled selected>${multilangData[langauage].Country}`
        var newData = [];
        for (let index = 0; index < result.response.entities.length; index++) {
            const countryCode = result.response.entities[index]['address']['countryCode'];
            if(!newData.includes(countryCode)){ 
              newData.push(countryCode);
              html += '<option value="' + countryCode + '">' + regionNames.of(countryCode) + '</option>'; 
            }
        }
        
      }

      html += somecountry;
      html += '</select>';
      html += '</div>';
      html += '</div>';
      $(".filtering").html(html);

      $(".checkbox_departments").change(function () {
        var element = document.getElementById("mySelect") as HTMLSelectElement;
        var x = element !== null ? element.selectedIndex : '';
        let selectcity = document.getElementsByTagName("option")[x].value; 
        getcity(selectcity);
      });
    } else {

    }

  });
}

export function getCountry(entities) {
  

      var url_string = window.location.href;
      var url = new URL(url_string);
      var country = url.searchParams.get("Country");
      var html = '';
      html += '<div class=" department-list flex justify-center">';
      html += '  <div class="select-box w-full md:w-auto">';
      html += `   <select id="mySelect" class="checkbox_departments appearance-none w-full bg-white py-2 px-3 border-8 border-white text-sm focus:outline-none" aria-label="Default select example">`
      let somecountry = '';
      if (url_string.includes('Country')) {
        somecountry = '<option selected>' + country + '</option>';
      }else {
        const regionNames = new Intl.DisplayNames(
          ['en', 'fr', 'ja'], { type: 'region' }
        );
        html += `<option value=""disabled selected>${multilangData[langauage].Country}`
        var newData = [];
        for (let index = 0; index < entities.length; index++) {
            const countryCode = entities[index]['address']['countryCode'];
            if(!newData.includes(countryCode)){ 
              newData.push(countryCode);
              html += '<option value="' + countryCode + '">' + regionNames.of(countryCode) + '</option>'; 
            }
        }
        
      }

      html += somecountry;
      html += '</select>';
      html += '</div>';
      html += '</div>';
      $(".filtering").html(html);

      $(".checkbox_departments").change(function () {
        var element = document.getElementById("mySelect") as HTMLSelectElement;
        var x = element !== null ? element.selectedIndex : '';
        let selectcity = document.getElementsByTagName("option")[x].value; 
        getcity(selectcity);
      });
   

  });
}



export function getcity(selectcity) {

  let filterParameters = {};
  let filterAnd = {};
  let filterOr = {};

  const queryString = selectcity;


  var ce_departments = [];
  // $('.checkbox_departments').each(function () {
  //   if ($(this).is(":selected")) {
  ce_departments.push(queryString);
  //   }
  // });

  // if (ce_departments.length > 0) {
  filterAnd = { "$and": [{ "address.countryCode": { "$in": ce_departments } }] };

  // }

  filterParameters = { ...filterAnd };
  var filterpar = JSON.stringify(filterParameters);
  var filter = encodeURI(filterpar);
  var baseURL = "https://liveapi-sandbox.yext.com/v2/accounts/me/entities?";
  var api_key = "b262ae7768eec3bfa53bfca6d48e4000";
  var vparam = "20161012";
  var entityTypes = "location";
  var savedFilterId = "982931142";

  var requesturls = baseURL +
    "api_key=" + api_key +
    "&v=" + vparam +
    "&resolvePlaceholders=true" +
    "&filter=" + filter +
    "&entityTypes=" + entityTypes +
    "&languages=" + langauage +
    "&savedFilterIds=" + savedFilterId;

  fetch(requesturls).then(response => response.json()).then(result => {

    if (!result.errors) {
      var url_string = window.location.href;
      var url = new URL(url_string);
      var city = url.searchParams.get("city");
      var html = '';
      html += '<div class=" department-list1 flex justify-center">';
      html += '  <div class="select-box w-full md:w-auto">';
      html += `   <select id="mySelect1" class="checkbox_departments1 bg-white w-full appearance-none py-2 px-3 border-8 border-white text-sm focus:outline-none" aria-label="Default select example">`;
      let somechange = '';
      if (url_string.includes('city')) {
        // html += '<option value="" disabled selected>City'
        somechange = '<option value="' + city + '"selected>' + city + '</option>';
      }
      else {
       
        var newcity = [];
              html += `<option value=""disabled selected>${multilangData[langauage].City}`
              for (let index = 0; index < result.response.entities.length; index++) {
                const city = result.response.entities[index]['address']['city'];
                if(!newcity.includes(city)){ 
                  newcity.push(city);
                  html += '<option value="' + city + '">' + city + '</option>'; 
                }
            }
        
        // $.each(result.response.entities, function (index, entity) {
        //   //console.log(entity);
        //   somechange += '<option value="' + entity.address.city + '">' + entity.address.city + '</option>';
        // })
      }
      html += somechange;
      html += '</select>';
      html += '</div>';
      html += '</div>';

      $(".filtering2").html(html);
      $(".checkbox_departments1").change(function () {
        var element = document.getElementById("mySelect1") as HTMLSelectElement;
        var x = element !== null ? element.selectedIndex : '';
        let selectcity = document.getElementsByTagName("option")[x].value;
        getshop(selectcity);
      });
    }

  });
}



export function getshop(selectcity) {
  var baseURL = "https://liveapi-sandbox.yext.com/v2/accounts/me/entities?";
  var api_key = "b262ae7768eec3bfa53bfca6d48e4000";
   var vparam = "20161012";
  var entityTypes = "ce_christofleshop";
  var requesturl =
    baseURL +
    "api_key=" + api_key +
     "&v=" + vparam +
    "&resolvePlaceholders=true" +
    "&entityTypes=" + entityTypes +
    "&languages=" +langauage;
  //alert(requesturl)

  fetch(requesturl).then(response => response.json()).then(result => {

    if (!result.errors) {

      var html = '';
      html += '<div class=" department-list1 flex justify-center">';
      html += '  <div class="select-box w-full md:w-auto">';
      html += `   <select id="selectshop" class="checkbox_departments1 appearance-none w-full bg-white py-2 px-3 border-8 border-white text-sm focus:outline-none" aria-label="Default select example">`;
      html += `<option value=""disabled selected>${multilangData[langauage].Shop}`
   
      $.each(result.response.entities, function (index, entity) {
        html += '<option value="' + entity.name + '">' + entity.name + '</option>';
      });
      html += '</select>';
      html += '</div>';
      html += '</div>';

      $(".filtering3").html(html);

    }
  })
}

//end here

// To get the Location of the system
export function getUsersLocation() {
  if (navigator.geolocation) {
    startLoading();
    const error = (error) => {
      [].slice
        .call(document.querySelectorAll(".error-text") || [])
        .forEach(function (el) {
          el.textContent = "Unable to determine your location. Please try entering a location in the search bar.";
        });
      stopLoading();
    };
    navigator.geolocation.getCurrentPosition(getNearestLatLng, error, {
      timeout: 10000,
    });
  }
}

$("#result").click(function () {
  var $this = $("#result2");
  //  var location_name = $this.data('name');            
  var storelocationName = $this.find('.storelocation-name').html();
  var address = $this.find('.address').html();
  var phone = $this.find('.phone').html();
  var openCloseTime = $this.find('.storelocation-openCloseTime').html();


  var markerContent = '<div class="markerContent font-normal text-xs leading-5">';

  markerContent += '<div class="nameData">' + storelocationName + '</div>';
  markerContent += '<div class="addressData max-w-[260px]">' + address + '</div>';
  markerContent += '<div class="phone mb-2">' + phone + "</div>";
  if
    (openCloseTime) {
    markerContent += '<div class="openCloseTimeData capitalize">' + openCloseTime + '</div>';
  }

  markerContent += '</div>';
});


var url_string = window.location.href;
var url = new URL(url_string);
var country = url.searchParams.get("Country");
if (url_string.includes('Country')) {
  getnature("", country);
}


var url_string = window.location.href;
var city = url.searchParams.get("city");
var country2 = url.searchParams.get("Country");
if (url_string.includes('city')) {
  getnature(city, country2);
}

function getnature(newCity, newCountry) {
  let newfilterParameters = {};
  let newfilterAnd = {

  };
  if (newCountry && newCity) {
    newfilterAnd = {
      "$and":
        [
          {
            "address.countryCode": { "$contains": newCountry }
          },
          {
            "address.city": { "$contains": newCity }
          },
         
        ],
    };
  }
  else {
    newfilterAnd = {
      "$or": [
        {
          "address.countryCode": { "$contains": newCountry },
          "address.city": { "$contains": newCity }
        },
      ]
    };
  }

  newfilterParameters = { ...newfilterAnd };
  var filterpar = JSON.stringify(newfilterParameters);
  var filter = encodeURI(filterpar);


  var baseURL = "https://liveapi-sandbox.yext.com/v2/accounts/me/entities?";
  var api_key = "b262ae7768eec3bfa53bfca6d48e4000";
  var vparam = "20161012";
  var entityTypes = "location";
  var savedFilterId = "982931142";

  var request_url = baseURL +
    "api_key=" + api_key +
    "&filter=" + filter +
    "&entityTypes=" + entityTypes +
    "&savedFilterIds=" + savedFilterId +
    "&languages=" + langauage;
    
    getRequest(request_url, null);

}

document.getElementById("data").addEventListener("click", function () {
  var countryElement = document.getElementById("mySelect") as HTMLSelectElement;
  var cityElement = document.getElementById("mySelect1") as HTMLSelectElement;
  var shopElement = document.getElementById("selectshop") as HTMLSelectElement;

  var newCountry = '';
  var newCity = '';
  var newshop = '';

  if (countryElement !== null) {
    newCountry = countryElement.value;
  }

  if (cityElement !== null) {
    newCity = cityElement.value;
  }

  if (shopElement !== null) {
    newshop = shopElement.value;
  }

  let newfilterParameters = {};
  let newfilterAnd = {};
  if (newCountry && newCity && newshop) {
    newfilterAnd = {
      "$and":
        [
          {
            "address.countryCode": { "$contains": newCountry }
          },
          {
            "address.city": { "$contains": newCity }

          },
          {
            "c_christfleshop": { "$contains": newshop }
          }
        ],
    };
  }
  else {
    newfilterAnd = {
      "$or": [
        {
          "address.countryCode": { "$contains": newCountry },
          "address.city": { "$contains": newCity },
          "c_christfleshop": { "$contains": newshop }
        },
      ]
    };

  }

  newfilterParameters = { ...newfilterAnd };
  var filterpar = JSON.stringify(newfilterParameters);
  var filter = encodeURI(filterpar);

  var baseURL = "https://liveapi-sandbox.yext.com/v2/accounts/me/entities?";
  var api_key = "b262ae7768eec3bfa53bfca6d48e4000";
  var vparam = "20161012";
  var entityTypes = "location";
  var savedFilterId = "982931142";

  var request_url = baseURL + "api_key=" + api_key +
    "&filter=" + filter +
    "&entityTypes=" + entityTypes +
    "&savedFilterIds=" + savedFilterId +
    "&languages=" + langauage;

    getRequest(request_url, null);

})

//end here
