import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // ✅ More stable
});


const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [],
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
    generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "Generate Travel Plan for Location: Beirut, Lebanon, for 3 Days for Couple with a Cheap budget. Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, Time travel each of the location for 3 days with each day plan with best time to visit in JSON format."},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Sure! Here's a budget-friendly 3-day travel itinerary for Beirut, Lebanon tailored for a couple on a cheap budget. The plan includes hotel options and a daily itinerary in JSON format.\n\n```json\n{\n  \"Location\": \"Beirut, Lebanon\",\n  \"Duration\": \"3 Days\",\n  \"Travelers\": \"Couple\",\n  \"Budget\": \"Cheap\",\n  \"Hotels\": [\n    {\n      \"HotelName\": \"Hamra Urban Gardens\",\n      \"HotelAddress\": \"Abdel Aziz Street, Hamra, Beirut\",\n      \"Price\": 40,\n      \"HotelImageUrl\": \"https://example.com/hamra-hotel.jpg\",\n      \"GeoCoordinates\": {\"Latitude\": 33.8938, \"Longitude\": 35.4785},\n      \"Rating\": 8.2,\n      \"Description\": \"Affordable hotel in the heart of Hamra with a rooftop pool and vibrant surroundings.\"\n    }\n  ],\n  \"Itinerary\": [\n    {\n      \"Day\": 1,\n      \"Theme\": \"Cultural Exploration\",\n      \"BestTimeToVisit\": \"Morning to Evening\",\n      \"Activities\": [\n        {\n          \"PlaceName\": \"National Museum of Beirut\",\n          \"PlaceDetails\": \"Main archaeological museum of Lebanon.\",\n          \"PlaceImageUrl\": \"https://example.com/national-museum.jpg\",\n          \"GeoCoordinates\": {\"Latitude\": 33.872, \"Longitude\": 35.519},\n          \"TicketPricing\": \"$5\",\n          \"Rating\": 4.7,\n          \"TimeTravel\": \"2-3 hours\"\n        },\n        {\n          \"PlaceName\": \"Pigeon Rocks in Raouche\",\n          \"PlaceDetails\": \"Natural landmark offering scenic coastal views.\",\n          \"PlaceImageUrl\": \"https://example.com/pigeon-rocks.jpg\",\n          \"GeoCoordinates\": {\"Latitude\": 33.879, \"Longitude\": 35.474},\n          \"TicketPricing\": \"Free\",\n          \"Rating\": 4.6,\n          \"TimeTravel\": \"1 hour\"\n        }\n      ]\n    },\n    {\n      \"Day\": 2,\n      \"Theme\": \"Local Experience\",\n      \"BestTimeToVisit\": \"Morning to Night\",\n      \"Activities\": [\n        {\n          \"PlaceName\": \"Beirut Souks\",\n          \"PlaceDetails\": \"Shopping and dining area with both luxury and budget options.\",\n          \"PlaceImageUrl\": \"https://example.com/souks.jpg\",\n          \"GeoCoordinates\": {\"Latitude\": 33.895, \"Longitude\": 35.514},\n          \"TicketPricing\": \"Free (unless you shop)\",\n          \"Rating\": 4.3,\n          \"TimeTravel\": \"2-3 hours\"\n        }\n      ]\n    },\n    {\n      \"Day\": 3,\n      \"Theme\": \"Relaxation & Food\",\n      \"BestTimeToVisit\": \"Morning to Afternoon\",\n      \"Activities\": [\n        {\n          \"PlaceName\": \"Zaitunay Bay\",\n          \"PlaceDetails\": \"Seaside promenade with restaurants, cafes, and yachts.\",\n          \"PlaceImageUrl\": \"https://example.com/zaitunay-bay.jpg\",\n          \"GeoCoordinates\": {\"Latitude\": 33.900, \"Longitude\": 35.513},\n          \"TicketPricing\": \"Free (meals not included)\",\n          \"Rating\": 4.5,\n          \"TimeTravel\": \"3 hours\"\n        }\n      ]\n    }\n  ]\n}\n```"},
          ],
        },
      ],
    });

export async function runGeminiResponse() {
    const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    const candidates = result.response.candidates;
  
    for (let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
      for (
        let part_index = 0;
        part_index < candidates[candidate_index].content.parts.length;
        part_index++
      ) {
        const part = candidates[candidate_index].content.parts[part_index];
        if (part.inlineData) {
          try {
            const blob = new Blob(
              [Uint8Array.from(atob(part.inlineData.data), (c) => c.charCodeAt(0))],
              { type: part.inlineData.mimeType }
            );
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            const extension = part.inlineData.mimeType.split("/")[1];
            const filename = `output_${candidate_index}_${part_index}.${extension}`;
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log(`File saved: ${filename}`);
          } catch (err) {
            console.error("Error saving file:", err);
          }
        }
      }
    }
  
    console.log(result.response.text());
  }