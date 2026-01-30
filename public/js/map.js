const apiKey = "80206fde58e7421187146bacc35e34c6";

const map = L.map('map').setView([21.1458, 79.0882], 13);

L.tileLayer(`https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?apiKey=${apiKey}`,{ attribution: "© Geoapify © OpenStreetMap" }).addTo(map);

// Get the listing data passed from the EJS template
if (typeof listingData !== 'undefined' && listingData.geometry && listingData.geometry.coordinates) {
    const lat = listingData.geometry.coordinates[1];
    const lon = listingData.geometry.coordinates[0];
    console.log(`Centering map on listing at [${lat}, ${lon}]`);
    
    const marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup(`<b>${listingData.title}</b><br>${listingData.location}<br>Price: ₹${listingData.price}`).openPopup();
    
    map.setView([lat, lon], 13);
} else {
    console.log("Listing data not available or geometry not found");
}

