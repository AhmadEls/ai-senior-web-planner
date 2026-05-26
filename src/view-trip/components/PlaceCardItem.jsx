import React, { useState } from "react";
import { FaMapLocationDot } from "react-icons/fa6";

function PlaceCardItem({ place }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const fallbackImages = [
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
  ];

  const randomImage =
    fallbackImages[
      Math.abs(
        (place?.PlaceName || "default")
          .split("")
          .reduce((a, b) => a + b.charCodeAt(0), 0)
      ) % fallbackImages.length
    ];

  const mapsQuery = place?.PlaceName
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        place.PlaceName
      )}`
    : "#";

  return (
    <a
      href={mapsQuery}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-4 items-start rounded-2xl border border-gray-200 p-3 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.01] cursor-pointer"
    >
      <div className="relative w-[120px] h-[120px] rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 animate-pulse">
            Loading...
          </div>
        )}

        <img
          src={randomImage}
          alt={place?.PlaceName || "Destination"}
          className={`w-full h-full object-cover rounded-xl transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop";
            setIsLoaded(true);
          }}
        />
      </div>

      <div className="flex flex-col justify-between min-h-[120px]">
        <div>
          <h3 className="text-lg font-bold text-black mb-1">
            {place?.PlaceName}
          </h3>

          <p className="text-sm text-gray-500 mb-2">
            {place?.PlaceDetails}
          </p>
        </div>

        {place?.TimeTravel && (
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <span>🕓</span>
            {place.TimeTravel}
          </p>
        )}

        <div className="mt-2">
          <span className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium">
            <FaMapLocationDot />
            View on Map
          </span>
        </div>
      </div>
    </a>
  );
}

export default PlaceCardItem;
