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
import {
  i18n
} from "../i18n";
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
import {
  multilangData,
  Days
} from "./MultiLangData";
import {
  getRequest,
  startLoading,
  stopLoading
} from "./loader";
import RtfConverter from "@yext/rtf-converter";
import {
  highlightLocation,
  geoCorder
} from "./map";
export let currentLatitude = 0;
export let currentLongitude = 0;
var ourURL = window.location.href;
export let offset = 0;
// var langauage = `{{meta.language}}`;
// var langauage = ;?
let langauage = "en"
if (ourURL.includes("/fr")) {
  langauage = "fr"
}
if (ourURL.includes("/ja")) {
  langauage = "ja"
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
  Store += `${multilangData[APIlanguage].storeLocator}`
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
  const viewDetailsLinkTextValue = getValue(locationOptions.viewDetailsLinkText);
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
  let html = '';
  // '<div class="lp-param-results lp-subparam-cardTitle lp-subparam-cardTitleLinkUrl">';
  // if (cardTitleLinkUrlValue && cardTitleValue) {
  //   if (cardTitleLinkUrlValue["url"]) {
  //     cardTitleLinkUrlValue = cardTitleLinkUrlValue["url"];
  //   }
  // }
  // else if (cardTitleValue) {
  //   html += `<button id ="result1" class="name hover:underline hover:font-semibold text-ll-red " >
  //     ${cardTitleValue}
  //   </button>`;
  // }
  // html += "</div>";
  const regionNames = new Intl.DisplayNames(
      ['en', 'fr', 'ja'], {
          type: 'region'
      });
  html += '<h2 class="location-name"><a href="javascript:void(0);" class="storelocation-name details">' + ucwords(cardTitleValue) + '</a></h2><div class="shop-type"><span class="miles">0.5 Miles</span><img src="/images/green_pin.png" alt=""/></div><div class="result-img"><img src="' + photoGallery2[0].image.url + '"/></div>';
  html += '<div class="result-content">';
  html += '<div class="info-row address-info"><span class="icon font-chrisfo-icon">R</span><address class="info-row-content">';
  html += ucwords(addressValue.line1) + ', ' + '<br>' + ucwords(addressValue.city) + ', ' + ucwords(addressValue.postalCode) + ', ' + '<br>' + ucwords(regionNames.of(addressValue.countryCode)) + "</address></div>";
  //end
  //phone number start here
  html += '<div class="info-row"><span class="icon font-chrisfo-icon">Q</span><a class="info-row-content" href="tel:' + phone + '">' + phone + "</a></div>";
  if (phoneno) {
      html += '<div class="info-row"><span class="icon font-chrisfo-icon">Q</span><a class="info-row-content" href="tel:' + phoneno + '">' + phoneno + "</a></div>";
  }
  html += '<div class="info-row"><span class="icon font-chrisfo-icon">O</span><a href="mailto:' + Email + '" class="info-row-content">' + Email + "</a></div>";
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
      html += '<div class="info-row currentStatus" data-id="main-shop-' + index + '"><span class="icon font-chrisfo-icon">0</span><span class="info-row-content">' + formatOpenNowString(hoursValue, parsedOffset) + "</span></div>";
      html += '</div><div class="storelocation-openCloseTime"><div class="info-row"><span class="icon font-chrisfo-icon">0</span><span class="info-row-content">Horaires</span></div>';
      html += '<ul class="hours" id="time-row-main-shop-' + index + '">';
      let dayConvert = Days[APIlanguage];
      const days_string = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", ];
      const convertedDays = convertDays(days_string);
      let sort_array = [];
      $.each(convertedDays.afterSelected, function(indexh, convertedDay) {
          let daya = [
              convertedDay, hoursValue[convertedDay]
          ];
          sort_array.push(daya);
      });
      console.log(sort_array);
      let closedclass = "";
      $.each(sort_array, function(indexh, hour) {
          html += '<li class="time-row ' + closedclass + ' ">'
          html += '<strong class="daydiv days_values" >';
          html += dayConvert[hour[0].toString()] + ' ';
          html += '</strong>';
          if (hour[1].openIntervals) {
              html += '<span>'
              $.each(hour[1].openIntervals, function(op, openInterval) {
                  html += tConvert(openInterval.start) + ' &nbsp; ' + multilangData[APIlanguage].To + ' &nbsp; ' + tConvert(openInterval.end);
              });
              html += '</span>'
              closedclass = "";
          } else {
              html += '<span class="closed" >' + multilangData[APIlanguage].closed + '</span>';
              closedclass = "closed";
          }
          html += '</li>'
      });
      html += '</ul>';
      html += "</div>";
  }
  console.log(entityProfile.meta.language, 'check locale value')
  const singleLineAddress = entityProfile.name + " " + addressValue.line1 + " " + (addressValue.line2 ? addressValue.line2 + " " : "") + addressValue.city + " " + addressValue.region + " " + addressValue.postalCode;
  html += `<div class="location-action">
    <a target="_blank" class="ghost-btn" href="https://www.google.com/maps/dir/?api=1&destination=${cordinates.latitude},${cordinates.longitude}"><span class="icon font-chrisfo-icon">p</span> ${multilangData[APIlanguage].getDirection}</a>`;
  html += `<a class="ghost-btn" href="/${cardTitleLinkUrlValue}"><span class="icon font-chrisfo-icon">b</span> ${multilangData[APIlanguage].detailPage}</a> </div>`
  html = `<div class="center-column">${html}</div>`;
  return `<div id="result-${index}" class="result location">${html}</div>`;
}
export function renderLocations(locations, append, viewMore) {
  if (!append) {
      [].slice.call(document.querySelectorAll(".result-list-inner") || []).forEach(function(el) {
          el.innerHTML = "";
      });
  }
  locations.forEach((location, index) => {
      [].slice.call(document.querySelectorAll(".result-list-inner") || []).forEach(function(el) {
          el.innerHTML += locationJSONtoHTML(location, index, locationOptions);
      });
  });
  locations.forEach((_, index) => {
      document.getElementById("result-" + index).addEventListener("mouseover", () => {
          highlightLocation(false, true, true);
      });
      document.getElementById("result-" + index).addEventListener("click", () => {
          highlightLocation(false, false, true);
      });
  });
  if (viewMore) {
      [].slice.call(document.querySelectorAll(".result-list-inner") || []).forEach(function(el) {
          el.innerHTML += '<div><div class="btn btn-link btn-block">View More</div></div>';
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
  // let formattedVisible = formatNumber(visible);
  // let formattedTotal = formatNumber(total);

  let formattedVisible = visible;
  let formattedTotal = total;

  let searchDetailMessage;
  if (geo) {
      if (geo.address.city !== "") {
          searchDetailMessage = searchDetailMessageForCityAndRegion(total);
          searchDetailMessage = searchDetailMessage.replace("[city]", geo.address.city);
          searchDetailMessage = searchDetailMessage.replace("[region]", geo.address.region);
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
              searchDetailMessage = searchDetailMessage.replace("[location]", location);
          }
      }
  } else {
      searchDetailMessage = searchDetailMessageNoGeo(total);
  }
  searchDetailMessage = searchDetailMessage.replace("[locationType]", locationType);
  searchDetailMessage = searchDetailMessage.replace("[formattedVisible]", formattedVisible);
  searchDetailMessage = searchDetailMessage.replace("[formattedTotal]", formattedTotal);
  [].slice.call(document.querySelectorAll(".search-center") || []).forEach(function(el) {
      el.innerHTML = "";
  });
  [].slice.call(document.querySelectorAll(".search-center") || []).forEach(function(el) {
      el.innerHTML = searchDetailMessage;
  });
}
export function getNearestLocationsByString() {
  const queryString = locationInput.value;
  // let request_url =
  //   base_url +
  //   "entities" +
  //   "?limit=" +
  //   limit +
  //   "&offset=" +
  //   offset +
  //   '&sortBy=[{"name":"ASCENDING"}]';
  var request_url = base_url + "entities/geosearch";
  // var request_url = base_url + "entities?";	
  request_url += "?radius=" + radius;
  request_url += "&location=" + queryString;
  limit + "&offset=" + offset + '&sortBy=[{"name":"ASCENDING"}]';
  let filterParameters = {};
  let filterAnd = {};
  let filterOr = {};
  if (queryString) {
      /* filterOr = {
        "$or": [
          { "address.line1": { "$contains": queryString } },
          { "address.city": { "$contains": queryString } },
          { "address.region": { "$contains": queryString } },
          { "address.countryCode": { "$contains": queryString } },
          { "address.postalCode": { "$contains": queryString } },
          { "name": { "$contains": queryString } },
          { "mainPhone": { "$contains": queryString } }
        ]
      }; */
  }
  var ce_departments = [];
  $('.checkbox_departments').each(function() {
      if ($(this).is(":checked")) {
          ce_departments.push($(this).val());
      }
  });
  if (ce_departments.length > 0) {
      filterAnd = {
          "$and": [{
              "c_departments": {
                  "$in": ce_departments
              }
          }]
      };
  }
  filterParameters = {
      ...filterOr,
      ...filterAnd
  };
  var filterpar = JSON.stringify(filterParameters);
  var filter = encodeURI(filterpar);
  if (filter) {
      request_url += "&filter=" + filter;
  }
  getRequest(request_url, queryString);
}

function getNearestLatLng(position) {
  [].slice.call(document.querySelectorAll(".error-text") || []).forEach(function(el) {
      el.textContent = "";
  });
  $('#offset').val(0);
  currentLatitude = position.coords.latitude;
  currentLongitude = position.coords.longitude;
  // setCookie("user_latitude", currentLatitude, 1);
  // setCookie("user_longitude", currentLongitude, 1);
  geoCorder.geocode({
      location: {
          lat: currentLatitude,
          lng: currentLongitude
      }
  }).then((response) => {
      if (response.results[0]) {
          locationInput.value = response.results[0].formatted_address;
          let address_components = response.results[0].address_components;
          let addressParameters = [];
          let param = {};
          let addressLine = '';
          let filter = '';
          // console.log(address_components);
          for (let i = 0; i < address_components.length; i++) {
              let type = address_components[i].types[0];
              switch (type) {
                  case 'street_number': {
                      if (addressLine) {
                          addressLine += " " + address_components[i].long_name;
                      } else {
                          addressLine = address_components[i].long_name;
                      }
                      break;
                  }
                  case 'route': {
                      if (addressLine) {
                          addressLine += " " + address_components[i].long_name;
                      } else {
                          addressLine = address_components[i].long_name;
                      }
                      break;
                  }
                  case 'postal_town': {
                      addressParameters.push({
                          "address.region": {
                              "$eq": address_components[i].long_name
                          }
                      });
                      break;
                  }
                  case 'locality':
                  case 'administrative_area_level_2': {
                      addressParameters.push({
                          "address.city": {
                              "$eq": address_components[i].long_name
                          }
                      });
                      break;
                  }
                  case 'administrative_area_level_1': {
                      addressParameters.push({
                          "address.region": {
                              "$eq": address_components[i].long_name
                          }
                      });
                      break;
                  }
                  case 'country': {
                      addressParameters.push({
                          "address.countryCode": {
                              "$eq": address_components[i].short_name
                          }
                      });
                      break;
                  }
                  case 'postal_code': {
                      addressParameters.push({
                          "address.postalCode": {
                              "$eq": address_components[i].short_name
                          }
                      });
                      break;
                  }
                  default: {}
              }
          }
          let addressParametersString = JSON.stringify(address_components);
          $('#user_address_parameters').val(addressParametersString);
          let request_url = base_url + "entities/geosearch";
          request_url += "?radius=" + radius;
          request_url += "&location=" + currentLatitude + ", " + currentLongitude;
          let filterParameters = {};
          let filterAnd = {};
          let filterOr = {};
          const queryString = locationInput.value;
          if (queryString) {
              filterOr = {
                  "$or": addressParameters
              };
          }
          filterParameters = {
              ...filterOr,
              ...filterAnd
          };
          filter = JSON.stringify(filterParameters);
          if (filter) {
              request_url += "&filter=" + filter;
          }
          request_url += "&limit=" + limit;
          getRequest(request_url, null);
      }
  }).catch((e) => {});
}
export function getLocations(offset) {
  let request_url = base_url + "entities" + "?limit=" + limit + "&offset=" + offset + "&languages=" + langauage + '&sortBy=[{"name":"ASCENDING"}]';
  let filterParameters = {};
  let filterAnd = {};
  let filterOr = {};
  const queryString = locationInput.value;
  if (queryString) {
      filterOr = {
          "$or": [{
              "address.line1": {
                  "$eq": queryString
              }
          }, {
              "address.city": {
                  "$eq": queryString
              }
          }, {
              "address.region": {
                  "$eq": queryString
              }
          }, {
              "address.countryCode": {
                  "$eq": queryString
              }
          }, {
              "address.postalCode": {
                  "$eq": queryString
              }
          }, {
              "name": {
                  "$eq": queryString
              }
          }]
      };
  }
  var ce_departments = [];
  $('.checkbox_departments').each(function() {
      if ($(this).is(":checked")) {
          ce_departments.push($(this).val());
      }
  });
  if (ce_departments.length > 0) {
      filterAnd = {
          "$and": [{
              "c_company_services": {
                  "$in": ce_departments
              }
          }]
      };
  }
  filterParameters = {
      ...filterOr,
      ...filterAnd
  };
  var filterpar = JSON.stringify(filterParameters);
  var filter = encodeURI(filterpar);
  if (filter) {
      request_url += "&filter=" + filter;
  }
  getRequest(request_url, null);
}
// getLocations(0);
document.getElementById("viewMoreBtn").addEventListener("click", function() {
  let newOffset = offset + limit;
  offset = newOffset;
  getLocations(offset);
});
// End Here
function ucwords(title) {
  let str = title.toLowerCase();
  str = str.replace(/-/g, ' ');
  str = str.replace(/_/g, ' ');
  return str.replace(/(^([a-zA-Z\p{M}]))|([ -_][a-zA-Z\p{M}])/g, function(s) {
      return s.toUpperCase();
  });
}
export function getDepartments() {
  var baseURL = base_url+"entities?";
  var api_key = liveAPIKey;
  var vparam = "20161012";  
  var fullURL = baseURL + "api_key=" + api_key + "&v=" + vparam + "&resolvePlaceholders=true" + "&languages=" + langauage + "&entityTypes=" + entityTypes + "&savedFilterIds=" + savedFilterId + "&fields=address" + "&limit=50";
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
          } else {
              const regionNames = new Intl.DisplayNames(
                  ['en', 'fr', 'ja'], {
                      type: 'region'
                  });
              console.log(langauage, "languagehhhh")
              html += `<option value=""disabled selected>${multilangData[langauage].Country}`
              var newData = [];
              for (let index = 0; index < result.response.entities.length; index++) {
                  const countryCode = result.response.entities[index]['address']['countryCode'];
                  if (!newData.includes(countryCode)) {
                      newData.push(countryCode);
                      html += '<option value="' + countryCode + '">' + regionNames.of(countryCode) + '</option>';
                  }
              }
          }
          // //alert(regionNames.of(newBRCC));
          // somecountry += '<option value="' + newBRCC + '">' + regionNames.of(newBRCC) + '</option>';
          // somecountry += '<option value="' + newBECC + '">' + regionNames.of(newBECC) + '</option>';
          // somecountry += '<option value="' + newFRCC + '">' + regionNames.of(newFRCC) + '</option>';
          html += somecountry;
          html += '</select>';
          html += '</div>';
          html += '</div>';
          $(".filtering").html(html);
          $(".checkbox_departments").change(function() {
              var element = document.getElementById("mySelect") as HTMLSelectElement;
              var x = element !== null ? element.selectedIndex : '';
              let selectcity = document.getElementsByTagName("option")[x].value;
              getcity(selectcity);
          });
      } else {}
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
  } else {
      const regionNames = new Intl.DisplayNames(
          ['en', 'fr', 'ja'], {
              type: 'region'
          });
      html += `<option value=""disabled selected>${multilangData[langauage].Country}`
      var newData = [];
      for (let index = 0; index < entities.length; index++) {
          const countryCode = entities[index]['address']['countryCode'];
          if (!newData.includes(countryCode)) {
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
  $(".checkbox_departments").change(function() {
      var element = document.getElementById("mySelect") as HTMLSelectElement;
      var x = element !== null ? element.selectedIndex : '';
      let selectcity = document.getElementsByTagName("option")[x].value;
      getcity(selectcity);
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
  filterAnd = {
      "$and": [{
          "address.countryCode": {
              "$in": ce_departments
          }
      }]
  };
  // }
  filterParameters = {
      ...filterAnd
  };
  var filterpar = JSON.stringify(filterParameters);
  var filter = encodeURI(filterpar);
  var baseURL = base_url+"entities?";
  var api_key = liveAPIKey;
  var vparam = "20161012";
  var entityTypes = "location";
  var savedFilterId = "982931142";
  var requesturls = baseURL + "api_key=" + api_key + "&v=" + vparam + "&resolvePlaceholders=true" + "&filter=" + filter + "&entityTypes=" + entityTypes + "&languages=" + langauage + "&savedFilterIds=" + savedFilterId;
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
          } else {
              var newcity = [];
              html += `<option value=""disabled selected>${multilangData[langauage].City}`
              for (let index = 0; index < result.response.entities.length; index++) {
                  const city = result.response.entities[index]['address']['city'];
                  if (!newcity.includes(city)) {
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
          $(".checkbox_departments1").change(function() {
              var element = document.getElementById("mySelect1") as HTMLSelectElement;
              var x = element !== null ? element.selectedIndex : '';
              let selectcity = document.getElementsByTagName("option")[x].value;
              getshop(selectcity);
          });
      }
  });
}
// getcity("");
export function getshop(selectcity) {
  var baseURL = base_url+"entities?";
  var api_key = liveAPIKey;
  var vparam = "20161012";
  var entityTypes = "ce_christofleshop";
  var requesturl = baseURL + "api_key=" + api_key + "&v=" + vparam + "&resolvePlaceholders=true" + "&entityTypes=" + entityTypes + "&languages=" + langauage;
  //alert(requesturl)
  fetch(requesturl).then(response => response.json()).then(result => {
      if (!result.errors) {
          var html = '';
          html += '<div class=" department-list1 flex justify-center">';
          html += '  <div class="select-box w-full md:w-auto">';
          html += `   <select id="selectshop" class="checkbox_departments1 appearance-none w-full bg-white py-2 px-3 border-8 border-white text-sm focus:outline-none" aria-label="Default select example">`;
          html += `<option value=""disabled selected>${multilangData[langauage].Shop}`
          $.each(result.response.entities, function(index, entity) {
              html += '<option value="' + entity.name + '">' + entity.name + '</option>';
          });
          html += '</select>';
          html += '</div>';
          html += '</div>';
          $(".filtering3").html(html);
      }
  })
}
// getshop("");
//end here
// To get the Location of the system
export function getUsersLocation() {
  if (navigator.geolocation) {
      startLoading();
      const error = (error) => {
          [].slice.call(document.querySelectorAll(".error-text") || []).forEach(function(el) {
              el.textContent = "Unable to determine your location. Please try entering a location in the search bar.";
          });
          stopLoading();
      };
      navigator.geolocation.getCurrentPosition(getNearestLatLng, error, {
          timeout: 10000,
      });
  }
}
$("#result").click(function() {
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
  if (openCloseTime) {
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
  let newfilterAnd = {};
  if (newCountry && newCity) {
      newfilterAnd = {
          "$and": [{
              "address.countryCode": {
                  "$contains": newCountry
              }
          }, {
              "address.city": {
                  "$contains": newCity
              }
          }],
      };
  } else {
      newfilterAnd = {
          "$or": [{
              "address.countryCode": {
                  "$contains": newCountry
              },
              "address.city": {
                  "$contains": newCity
              }
          }, ]
      };
  }
  newfilterParameters = {
      ...newfilterAnd
  };
  var filterpar = JSON.stringify(newfilterParameters);
  var filter = encodeURI(filterpar);
  var baseURL = base_url+"me/entities?";
  var api_key = liveAPIKey;
  var vparam = "20161012";   
  var request_url = baseURL + "api_key=" + api_key + "&filter=" + filter + "&entityTypes=" + entityTypes + "&languages=" + langauage;
  "&savedFilterIds=" + savedFilterId + getRequest(request_url, null);
}
document.getElementById("data").addEventListener("click", function() {
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
          "$and": [{
              "address.countryCode": {
                  "$contains": newCountry
              }
          }, {
              "address.city": {
                  "$contains": newCity
              }
          }, {
              "c_christfleshop": {
                  "$contains": newshop
              }
          }],
      };
  } else {
      newfilterAnd = {
          "$or": [{
              "address.countryCode": {
                  "$contains": newCountry
              },
              "address.city": {
                  "$contains": newCity
              },
              "c_christfleshop": {
                  "$contains": newshop
              }
          }, ]
      };
  }
  newfilterParameters = {
      ...newfilterAnd
  };
  var filterpar = JSON.stringify(newfilterParameters);
  var filter = encodeURI(filterpar);
  var baseURL = base_url+"entities?";
  var api_key = liveAPIKey;
  var vparam = "20161012"; 
  var request_url = baseURL + "api_key=" + api_key + "&filter=" + filter + "&entityTypes=" + entityTypes + "&languages=" + langauage;
  "&savedFilterIds=" + savedFilterId + getRequest(request_url, null);
})
//end here