import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from '@/constants/options';
import { chatSession } from '@/service/AIModal';
import { db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { toast } from 'sonner';
import { AiOutlineLoading } from 'react-icons/ai';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Createtrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    if (name === 'noOfDays' && value > 7) {
      toast.error("Please enter less than 7 days.");
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const SaveAiTrip = async (TripData) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.email || !user.name) {
      toast.error("User not authenticated. Please log in.");
      return;
    }
    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: TripData,
      userName: user.name,
      userEmail: user.email,
      id: docId,
    });
    navigate(`/view-trip/${docId}`);
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userProfile = res.data;
        localStorage.setItem('user', JSON.stringify({
          name: userProfile.name,
          email: userProfile.email,
          picture: userProfile.picture
        }));
        toast.success("Signed in successfully!");
        setOpenLoginDialog(false);
      } catch (err) {
        console.error("Failed to fetch Google profile:", err);
        toast.error("Login failed");
      }
    },
    onError: (error) => {
      console.error("Login Error:", error);
      toast.error("Login failed");
    }
  });

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      setOpenLoginDialog(true);
      return;
    }
    if (formData?.noOfDays > 7 || !formData.location || !formData.budget || !formData.traveler) {
      toast.error("Please fill all details correctly.");
      return;
    }

    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData?.location?.label)
      .replace('{totalDays}', formData?.noOfDays)
      .replace('{traveler}', formData?.traveler)
      .replace('{budget}', formData?.budget)
      .replace('{totalDays}', formData?.noOfDays);

    console.log("📤 Prompt Sent to AI:", FINAL_PROMPT);

    setLoading(true);
    try {
      const { response } = await chatSession.sendMessage(FINAL_PROMPT);
      const text = response.candidates[0].content.parts[0].text;
      console.log("📝 AI Response:", text);

      if (text.includes('"error"') || !text.includes('"Itinerary"')) {
        toast.error("AI could not complete the itinerary. Please try again.");
        setLoading(false);
        return;
      }

      await SaveAiTrip(text);
      toast.success("Trip saved successfully!");
    } catch (err) {
      console.error("Failed to save trip:", err);
      toast.error("Failed to save trip");
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#fef7f1] to-[#f3f9fe] relative">
      <div className='w-full max-w-6xl mx-auto px-5 pt-16'>
        <h2 className='font-bold text-3xl text-center text-gray-800'>Tell Us Your Travel Preferences 🌴🏔️</h2>
        <p className='mt-2 text-gray-600 text-center text-lg'>Let us tailor a Lebanese journey that fits your vibe and interests perfectly.</p>

        <div className='mt-14 flex flex-col gap-12'>
          {/* Place input */}
          <div>
            <h2 className='text-lg mb-2 font-semibold text-gray-800'>What is your destination in Lebanon?</h2>
            <GooglePlacesAutocomplete
              apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
              selectProps={{
                value: place,
                onChange: (v) => {
                  setPlace(v);
                  handleInputChange('location', v);
                },
                placeholder: "Search cities or places in Lebanon...",
                styles: {
                  control: (provided) => ({
                    ...provided,
                    padding: '0.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                  }),
                },
              }}
              autocompletionRequest={{
                componentRestrictions: { country: 'lb' },
              }}
            />
            <p className='text-sm text-gray-500 mt-1'>Note: We only support locations within Lebanon</p>
          </div>

          {/* Days input */}
          <div>
            <h2 className='text-lg mb-2 font-semibold text-gray-800'>How many days are you planning your trip?</h2>
            <Input placeholder={'Ex. 3'} type="number" onChange={(e) => handleInputChange('noOfDays', e.target.value)} />
          </div>

          {/* Budget selection */}
          <div>
            <h2 className='text-lg mb-2 font-semibold text-gray-800'>What is Your Budget?</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
              {SelectBudgetOptions.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleInputChange('budget', item.title)}
                  className={`p-5 border rounded-xl cursor-pointer hover:shadow-xl transition duration-300 bg-white ${formData?.budget === item.title ? 'shadow-lg border-blue-400' : ''}`}
                >
                  <h2 className='text-3xl mb-2'>{item.icon}</h2>
                  <h2 className='font-bold text-md text-gray-700'>{item.title}</h2>
                  <p className='text-sm text-gray-500'>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Traveler type selection */}
          <div>
            <h2 className='text-lg mb-2 font-semibold text-gray-800'>Who are you traveling with?</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
              {SelectTravelesList.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleInputChange('traveler', item.people)}
                  className={`p-5 border rounded-xl cursor-pointer hover:shadow-xl transition duration-300 bg-white ${formData?.traveler === item.people ? 'shadow-lg border-blue-400' : ''}`}
                >
                  <h2 className='text-3xl mb-2'>{item.icon}</h2>
                  <h2 className='font-bold text-md text-gray-700'>{item.title}</h2>
                  <p className='text-sm text-gray-500'>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className='my-10 flex justify-center'>
            <button
              onClick={OnGenerateTrip}
              disabled={loading}
              className='px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-[#f56551] to-[#3b82f6] text-white hover:opacity-90 transition-all duration-200 flex items-center gap-2'
            >
              {loading && <AiOutlineLoading className='animate-spin text-xl' />}
              Generate Trip
            </button>
          </div>
        </div>
      </div>

      {/* Login Dialog */}
      <Dialog open={openLoginDialog} onOpenChange={setOpenLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="sr-only">Sign In Required</DialogTitle>
            <div className="flex flex-col items-center text-center">
              <img src="/logo.svg" className="h-12 mb-3" alt="App logo" />
              <h2 className='font-bold text-lg mb-1'>Sign In With Google</h2>
              <p className="text-sm text-gray-600 mb-4">Sign in to the App with Google authentication securely</p>
              <button
                onClick={login}
                className="w-full flex gap-3 items-center justify-center border border-gray-300 rounded px-4 py-2 text-sm font-semibold text-white bg-black hover:opacity-80 transition duration-200 focus:outline-none"
              >
                <FcGoogle className='h-6 w-6' />
                Sign In With Google
              </button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Createtrip;
