import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectBudgetOptions, SelectTravelesList } from '@/constants/options';
import React, { useState } from 'react'
import { useEffect } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'

function Createtrip() {

  const[place,setPlace]=useState();

  const [formData,setFormData]=useState([]);
  const handleInputChange=(name,value)=>{
    if(name=='noOfDays'&&value>7)
    {
      console.log("Please enter Trip days less that 7")
      return;
    }
    setFormData({
      ...formData,
      [name]:value
    })
  }
    useEffect(()=>{
      console.log(formData);
    },[formData])

    const OnGenerateTrip=()=>{
      if(formData?.noOfDays>7)
      {
        return;
      }
      console.log(formData);
    }
  
  return (
    <div>
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>Tell Us your travel preferences 🌴🏕️</h2>
      <p className='mt-3 text-gray-500 text-xl'>Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences</p>
      <div className='mt-20 flex flex-col gap-10'>
      <div>
        <h2 className='text-xl my-3 font-medium'>What is the destination of choice</h2>
        <GooglePlacesAutocomplete
        apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
        selectProps={{
          place,
          onChange:(v)=>{setPlace(v);handleInputChange('location',v)}

        }}
        />
      </div>
      </div>
      <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip?</h2>
      <Input placeholder={'Ex.3'}  type="number"
      onChange={(e)=>handleInputChange('noOfDays',e.target.value)}
      />

      <div>
      <h2 className='text-xl my-3 font-medium'>What is Your Budget</h2>
      <div className='grid grid-cols-3 gap-5 mt-5'>
        {SelectBudgetOptions.map((item,index)=>(
          <div key={index}
          onClick={()=>handleInputChange('budget',item.title)}
           className={`p-4 border rounded-lg cursor-pointer
            hover:shadow-lg
            ${formData?.budget==item.title&&'shadow-lg border-black'}
            `}>
            <h2 className='text-4xl'>{item.icon}</h2>
            <h2 className='font-bold text-lg'>{item.title}</h2>
            <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
        ))
        }
      </div>
      </div>

      <div>
      <h2 className='text-xl my-3 font-medium'>Who do you plan on traveling with on your next adventure?</h2>
      <div className='grid grid-cols-3 gap-5 mt-5'>
        {SelectTravelesList.map((item,index)=>(
          <div key={index}
          onClick={()=>handleInputChange('traveler',item.people)}
           className={`p-4 border rounded-lg cursor-pointer hover:shadow-lg
            ${formData?.traveler==item.people&&'shadow-lg border-black'}
           `}>
            <h2 className='text-4xl'>{item.icon}</h2>
            <h2 className='font-bold text-lg'>{item.title}</h2>
            <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
        ))}
      </div>
      </div>
<div className='my-10 justify-end flex text-white'>
  <button onClick={OnGenerateTrip}>Generate Trip</button>
</div>
     </div>
     </div>

    
    
  )
}


export default Createtrip