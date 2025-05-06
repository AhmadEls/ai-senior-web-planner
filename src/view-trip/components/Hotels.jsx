import React, { useEffect, useState } from 'react';
import { GetPlaceDetails } from '@/service/GlobalApi';

const GOOGLE_PHOTO_URL = (photoName) =>
  `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=800&maxWidthPx=800&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;

function Hotels({ trip }) {
  const [hotelPhotos, setHotelPhotos] = useState({});

  let parsedData = {};
  try {
    parsedData = JSON.parse(trip.tripData);
  } catch (err) {
    console.error("❌ Failed to parse tripData:", err);
  }

  const hotels = parsedData?.Hotels || [];

  while (hotels.length < 4) {
    hotels.push({
      HotelName: "Coming Soon...",
      HotelAddress: "New Lebanese destination!",
      PricePerNight: "--",
      Rating: null,
      ImageURL: "/placeholder.jpg"
    });
  }

  const getPriceRange = (price) => {
    if (!price || isNaN(price)) return "Price unavailable";
    const base = parseInt(price);
    const min = Math.max(base - 25, 30);
    const max = base + 50;
    return `$${min}–$${max} per night`;
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      const photoMap = {};
      for (let hotel of hotels) {
        try {
          const query = hotel.HotelName;
          const resp = await GetPlaceDetails({ textQuery: query });
          const photoName = resp?.data?.places?.[0]?.photos?.[0]?.name;
          if (photoName) {
            photoMap[hotel.HotelName] = GOOGLE_PHOTO_URL(photoName);
          }
        } catch (error) {
          console.error(`Error fetching photo for ${hotel.HotelName}:`, error);
        }
      }
      setHotelPhotos(photoMap);
    };
    fetchPhotos();
  }, [trip]);

  return (
    <div>
      <h2 className="font-bold text-2xl mt-6 mb-4">Hotel Recommendations</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {hotels.map((hotel, index) => {
          const fallback = "/placeholder.jpg";
          const cleanImage = hotelPhotos[hotel.HotelName] || fallback;

          const price = hotel.PricePerNight || hotel.Price || hotel.price || null;
          const priceDisplay = price !== null ? getPriceRange(price) : "Price unavailable";

          let ratingRaw = parseFloat(hotel.Rating || hotel.rating);
          let rating = null;
          if (!isNaN(ratingRaw)) {
            if (ratingRaw >= 5 && ratingRaw <= 10) {
              rating = (ratingRaw / 2).toFixed(1);
            } else if (ratingRaw >= 1 && ratingRaw <= 5) {
              rating = ratingRaw.toFixed(1);
            }
          }

          const ratingDisplay = rating !== null
            ? `${rating} ${rating === "1.0" ? "star" : "stars"}`
            : "Rating unavailable";

          const address = hotel.HotelAddress || hotel.Address || hotel.address || "No address provided";

          const mapsQuery = hotel.HotelName
            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.HotelName)}`
            : "#";

          return (
            <a
              href={mapsQuery}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
              className="rounded-2xl overflow-hidden shadow-md border bg-white transition-transform duration-300 hover:scale-105 cursor-pointer block"
            >
              <img
                src={cleanImage}
                alt="Hotel"
                className="w-full h-[240px] object-cover transition-transform duration-300 cursor-pointer"
                onError={(e) => (e.target.src = fallback)}
                style={{ filter: 'contrast(1.05) saturate(1.05)' }}
              />
              <div className="px-4 py-3">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  <span className="text-red-500 mr-1">📍</span>
                  {hotel.HotelName}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{address}</p>
                <p className="text-sm font-medium text-black mb-1">
                  💰 {priceDisplay}
                </p>
                <p className="text-sm text-gray-700">
                  ⭐ {ratingDisplay}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default Hotels;
