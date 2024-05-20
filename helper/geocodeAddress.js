const axios = require("axios");

const geocodeAddress = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;
  const response = await axios.get(url);
  if (response?.data?.length > 0) {
    const data = response?.data;
    const { lat, lon } = data[0];
    return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
  } else {
    throw new Error(
      "Cant find the longitude and latitude for the address provided"
    );
  }
};

module.exports = geocodeAddress;
