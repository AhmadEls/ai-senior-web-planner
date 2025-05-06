// === Updated PlacesToVisit.jsx with Auto-Generated TimeSlots ===
import React, { useState, useEffect } from 'react';
import PlaceCardItem from './PlaceCardItem';
import { GetPlaceDetails } from '@/service/GlobalApi';

const GOOGLE_PHOTO_URL = (photoName) =>
  `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=1000&maxWidthPx=1000&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;

// Helper to add minutes and return a formatted time
const addMinutes = (timeStr, minsToAdd) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes + minsToAdd);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

function PlacesToVisit({ trip }) {
  const [placePhotos, setPlacePhotos] = useState({});
  const [itinerary, setItinerary] = useState([]);

  useEffect(() => {
    if (!trip?.tripData) return;

    let parsedData = {};
    try {
      parsedData = JSON.parse(trip.tripData);
    } catch (err) {
      console.error("❌ Failed to parse tripData:", err);
      return;
    }

    const parsedItinerary = parsedData?.Itinerary || [];
    setItinerary(parsedItinerary);

    const fetchPhotos = async () => {
      const photoMap = {};

      const tasks = parsedItinerary.flatMap((day) =>
        (day.Activities || []).map(async (activity) => {
          try {
            const resp = await GetPlaceDetails({ textQuery: activity.PlaceName });
            const photoName = resp?.data?.places?.[0]?.photos?.[0]?.name;
            if (photoName) {
              photoMap[activity.PlaceName] = GOOGLE_PHOTO_URL(photoName);
            }
          } catch (err) {
            console.error(`❌ Error fetching photo for ${activity.PlaceName}:`, err);
          }
        })
      );

      await Promise.all(tasks);
      setPlacePhotos(photoMap);
    };

    fetchPhotos();
  }, [trip]);

  if (!Array.isArray(itinerary)) {
    return (
      <div>
        <h2 className="font-bold text-lg">Places to Visit</h2>
        <p className="text-gray-500 mt-2">No itinerary data available.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-bold text-2xl mt-6 mb-4">Places to Visit</h2>

      <div className="flex flex-col gap-10">
        {itinerary.map((dayPlan, index) => (
          <div key={index}>
            <h3 className="text-xl font-semibold mb-6">Day {dayPlan.Day || index + 1}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {dayPlan?.Activities?.map((activity, idx) => {
                const startTime = addMinutes("9:00", idx * 120); // Every activity gets 2 hours slot
                const endTime = addMinutes("9:00", (idx + 1) * 120);
                const timeSlot = `${startTime} – ${endTime}`;

                return (
                  <div key={idx} className="space-y-3">
                    <p className="text-sm font-semibold text-orange-500 tracking-wide">
                      {activity.TimeSlot || timeSlot}
                    </p>
                    <PlaceCardItem
                      place={activity}
                      photoUrl={placePhotos[activity.PlaceName]}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlacesToVisit;