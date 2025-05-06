// UserTripCardItem.jsx - Only CSS changes
import React from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';

// eslint-disable-next-line no-unused-vars
function UserTripCardItem({ trip, onViewDetails, onDelete }) {
  const location = trip?.userSelection?.location?.label || 'Unknown Destination';
  const startDate = trip?.createdAt 
    ? format(new Date(trip.createdAt), 'MMM d, yyyy') 
    : 'No date set';
  const duration = trip?.userSelection?.noOfDays 
    ? `${trip.userSelection.noOfDays} ${trip.userSelection?.noOfDays === 1 ? 'day' : 'days'}` 
    : 'N/A days';
  const budget = trip?.userSelection?.budget || 'Not specified';
  const travelers = trip?.userSelection?.traveler || 'Not specified';

  return (
    <div className="relative bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300 h-full flex flex-col">
      {/* Image */}
      <div className="relative h-56 w-full">
        <img 
          src="lebanon-default.jpg" 
          alt={location}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 flex flex-col justify-end">
          <h3 className="text-xl font-semibold text-white">{location}</h3>
          <p className="text-white/90 text-sm mt-1">{startDate}</p>
        </div>
      </div>
      
      {/* Details */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">📅</span>
            <span className="text-sm text-gray-700">{duration}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">👥</span>
            <span className="text-sm text-gray-700">{travelers}</span>
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">💰</span>
            <span className="text-sm text-gray-700">{budget}</span>
          </div>
          <button
            onClick={onViewDetails}
            className="usertrip-viewdetails-btn px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserTripCardItem;