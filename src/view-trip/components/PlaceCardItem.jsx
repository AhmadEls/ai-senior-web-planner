import React, { useState } from 'react';
import { FaMapLocationDot } from "react-icons/fa6";

function PlaceCardItem({ place, photoUrl }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=1200&auto=format&fit=crop";

  const mapsQuery = place.PlaceName
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.PlaceName)}`
    : "#";

  return (
    <a
      href={mapsQuery}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-4 items-start rounded-2xl border p-3 bg-white shadow-sm transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
    >
      <div className="relative w-[120px] h-[120px] rounded-xl bg-gray-200 overflow-hidden flex items-center justify-center">
        
        {!isLoaded && (
          <div className="text-xs text-gray-400 animate-pulse">
            Loading image...
          </div>
        )}

        <img
          src={photoUrl || fallbackImage}
          alt={place.PlaceName}
          className={`absolute top-0 left-0 w-full h-full object-cover rounded-xl transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
            setIsLoaded(true);
          }}
        />
      </div>

      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-black mb-1">
            {place.PlaceName}
          </h3>

          <p className="text-sm text-gray-500 mb-1">
            {place.PlaceDetails}
          </p>
        </div>

        {place.TimeTravel && (
          <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
            <span>🕓</span> {place.TimeTravel}
          </p>
        )}

        <div className="mt-2">
          <span className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm">
            <FaMapLocationDot /> View on Map
          </span>
        </div>
      </div>
    </a>
  );
}

export default PlaceCardItem;
