export const limit = 3;
export const radius = 1000;
export const defaultQuery = "";

export const locationInput = <HTMLInputElement>(
  document.getElementById("location-input")
);
export const researchButton = document.getElementById("location-input");
export const searchButton = document.getElementById("search-location-button");
export const useMyLocation = document.getElementById("useLocation");
export const locationNoun = "Locations";
export const locationNounPlural = "Locations";

// Live Api query variables
var script_tag = document.getElementById('js-locator');
export const liveAPIKey = script_tag.getAttribute('data');
export const savedFilterId = "982931142";
export const entityTypes = "location";
export const loadLocationsOnLoad = false;
export const enableAutocomplete =false;
export const base_url = "https://liveapi-sandbox.yext.com/v2/accounts/me/";
export const useMiles = true;

export type locationOption = {
  // The value of the content, either a field name or a constant value
  value: string;
  // Determines where this value comes from. Generally either FIELD or text.
  contentSource: string;
  // Determines whether the content defined in value should be parsed as RTF.
  isRtf: boolean | undefined;
};

export const locationOptions = {
  cardTitle: {
    value: "name",
    contentSource: "FIELD",
    isRtf: true,
  },
  
  detailShop: {
    value: "c_detailShop",
    contentSource: "FIELD",
  },

  getDirect: {
    value: "c_getDirection",
    contentSource: "FIELD",
  },
  cardTitleLinkUrl: {
    value: "slug",
    contentSource: "FIELD",
  },
  hours: {
    value: "hours",
    contentSource: "FIELD",
  },
  address: {
    value: "address",
    contentSource: "FIELD",
  },
  phoneNumber: {
    value: "mainPhone",
    contentSource: "FIELD",
  },
  Email: {
    value: "emails",
    contentSource: "FIELD",
  },


  locale: {
    value: "locale",
    contentSource: "FIELD"
  },
  catringnumber:{
    value: "alternatePhone",
    contentSource: "FIELD",
  },
  status:{
    value:"brands",
    contentSource:"FIELD",
  },
  getDirectionsLabel: {
    value: "Directions to the store",
    contentSource: "text",
    isRtf: true,
  },
  coordinates: {
    value: "geocodedCoordinate",
    contentSource: "FIELD",
  },
  viewDetailsLinkText: {
    value: "View Details",
    contentSource: "text",
  },
  viewDetailsLinkUrl: {
    value: "/",
    contentSource: "text",
  },
  yextCoordinates:{
    value:"yextDisplayCoordinate",
    contentSource: "FIELD",
  },
  photoGallery:{
    value:"c_photoGallery2",
    contentSource: "FIELD",
  }
};
