import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Plane, Luggage, Hotel, MapPin, ArrowRight } from "lucide-react";

function renderMarkdown(text: string) {
  const withBold = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return withBold.replace(/; /g, '<br/>');
}

function getHotelForRegion(region: string) {
  if (region === "\u05de\u05e8\u05d7\u05d1 \u05d7\u05d9\u05e4\u05d4, \u05e6\u05e4\u05d5\u05df \u05d5\u05e9\u05e4\u05dc\u05d4" || region === "\u05de\u05e8\u05d7\u05d1 \u05d3\u05e8\u05d5\u05dd") {
    return {
      name: "Ani Grand Hotel Yerevan",
      stars: "\u2605\u2605\u2605\u2605",
      address: "65 Hanrapetutyan St, Yerevan 0010, \u05d0\u05e8\u05de\u05e0\u05d9\u05d4",
      mapQuery: "Ani+Grand+Hotel+Yerevan+65+Hanrapetutyan+St",
      mapLink: "https://maps.google.com/?q=Ani+Grand+Hotel+Yerevan,65+Hanrapetutyan+St+Yerevan",
    };
  }
  return {
    name: "Ani Plaza Hotel Yerevan",
    stars: "\u2605\u2605\u2605\u2605",
    address: "19 Sayat-Nova Ave, Yerevan 0001, \u05d0\u05e8\u05de\u05e0\u05d9\u05d4",
    mapQuery: "Ani+Plaza+Hotel+Yerevan+19+Sayat-Nova+Ave",
    mapLink: "https://maps.google.com/?q=Ani+Plaza+Hotel+Yerevan,19+Sayat-Nova+Ave+Yerevan",
  };
}

const tourImages = Array.from({ length: 32 }, (_, i) => `/images/armenia-${i + 1}.png`);

export default function TripDetails() {
  const [, setLocation] = useLocation();
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  useEffect(() => {
    const region = sessionStorage.getItem("selectedRegion");
    if (!region) {
      setLocation("/region-select");
      return;
    }
    setSelectedRegion(region);
  }, [setLocation]);

  const hotel = getHotelForRegion(selectedRegion);

  const description =
    "\u05e1\u05d9\u05d5\u05e8 \u05de\u05d0\u05d5\u05e8\u05d2\u05df \u05e9\u05dc 4 \u05d9\u05de\u05d9\u05dd \u05dc\u05d0\u05e8\u05de\u05e0\u05d9\u05d4 \u2013 \u05de\u05e1\u05e2 \u05d9\u05d9\u05d7\u05d5\u05d3\u05d9 \u05e9\u05de\u05e9\u05dc\u05d1 \u05d4\u05d9\u05e1\u05d8\u05d5\u05e8\u05d9\u05d4 \u05e2\u05ea\u05d9\u05e7\u05d4, \u05ea\u05e8\u05d1\u05d5\u05ea \u05e2\u05e9\u05d9\u05e8\u05d4, \u05e0\u05d5\u05e4\u05d9\u05dd \u05de\u05e8\u05d4\u05d9\u05d1\u05d9\u05dd \u05d5\u05d0\u05d9\u05e8\u05d5\u05d7 \u05d7\u05dd. \u05d4\u05e1\u05d9\u05d5\u05e8 \u05d9\u05ea\u05d7\u05d9\u05dc \u05d5\u05d9\u05e1\u05ea\u05d9\u05d9\u05dd \u05d1\u05d9\u05e8\u05d5\u05d5\u05d0\u05df, \u05d4\u05d1\u05d9\u05e8\u05d4 \u05d4\u05d5\u05d5\u05e8\u05d5\u05d3\u05d4, \u05e9\u05dd \u05e0\u05d7\u05d5\u05d5\u05d4 \u05d0\u05ea \u05d4\u05e7\u05e1\u05dd \u05d4\u05d0\u05e8\u05de\u05e0\u05d9 \u05d4\u05d0\u05d5\u05ea\u05e0\u05d8\u05d9.";

  const flightDetails =
    "**\u05d8\u05d9\u05e1\u05d5\u05ea \u05e4\u05e8\u05d8\u05d9\u05d5\u05ea \u05d9\u05e9\u05d9\u05e8\u05d5\u05ea \u05dc\u05d9\u05e8\u05d5\u05d5\u05d0\u05df \u05d1\u05de\u05d8\u05d5\u05e1 \u05d4\u05d4\u05e1\u05ea\u05d3\u05e8\u05d5\u05ea**; \u05d4\u05dc\u05d5\u05da (28.6.2026): \u05d4\u05de\u05e8\u05d0\u05d4 \u05d1\u05e9\u05e2\u05d5\u05ea \u05d4\u05d1\u05d5\u05e7\u05e8 \u05d4\u05de\u05d5\u05e7\u05d3\u05de\u05d5\u05ea \u05dc\u05d9\u05e8\u05d5\u05d5\u05d0\u05df; \u05d7\u05d6\u05d5\u05e8 (1.7.2026): \u05d4\u05de\u05e8\u05d0\u05d4 \u05d1\u05e9\u05e2\u05d5\u05ea \u05d4\u05e2\u05e8\u05d1 \u05dc\u05ea\u05dc \u05d0\u05d1\u05d9\u05d1";

  const luggageDetails =
    "\u05db\u05dc \u05e0\u05d5\u05e1\u05e2 \u05d6\u05db\u05d0\u05d9 \u05dc\u05ea\u05d9\u05e7 \u05d9\u05d3 \u05d0\u05d9\u05e9\u05d9; \u05de\u05d6\u05d5\u05d5\u05d3\u05d4 \u05d0\u05d7\u05ea \u05dc\u05e0\u05d5\u05e1\u05e2 (\u05e2\u05d3 23 \u05e7\"\u05d2); \u05e0\u05d9\u05ea\u05df \u05dc\u05d4\u05d5\u05e1\u05d9\u05e3 \u05de\u05d6\u05d5\u05d5\u05d3\u05d4 \u05e0\u05d5\u05e1\u05e4\u05ea \u05d1\u05ea\u05e9\u05dc\u05d5\u05dd \u05e0\u05e4\u05e8\u05d3";

  const hotelDetails = `\u05e9\u05d4\u05d9\u05d9\u05d4 \u05e9\u05dc 3 \u05dc\u05d9\u05dc\u05d5\u05ea \u05d1\u05de\u05dc\u05d5\u05df ${hotel.name} ${hotel.stars} \u05d1\u05d9\u05e8\u05d5\u05d5\u05d0\u05df; \u05d1\u05e1\u05d9\u05e1 \u05dc\u05d9\u05e0\u05d4 \u05d5\u05d0\u05e8\u05d5\u05d7\u05ea \u05d1\u05d5\u05e7\u05e8; \u05d7\u05d3\u05e8\u05d9\u05dd \u05d6\u05d5\u05d2\u05d9\u05d9\u05dd (\u05e9\u05d9\u05ea\u05d5\u05e3); \u05ea\u05d5\u05e1\u05e4\u05ea \u05dc\u05d7\u05d3\u05e8 \u05d9\u05d7\u05d9\u05d3 \u05d1\u05ea\u05e9\u05dc\u05d5\u05dd \u05e0\u05e4\u05e8\u05d3`;

  const itinerary =
    "**\u05d9\u05d5\u05dd 1 (28.6): \u05d4\u05d2\u05e2\u05d4 \u05dc\u05d9\u05e8\u05d5\u05d5\u05d0\u05df**; \u05e0\u05d7\u05d9\u05ea\u05d4 \u05d1\u05e0\u05de\u05dc \u05d4\u05ea\u05e2\u05d5\u05e4\u05d4 \u05d9\u05e8\u05d5\u05d5\u05d0\u05df, \u05e7\u05d1\u05dc\u05ea \u05e4\u05e0\u05d9\u05dd \u05d7\u05de\u05d4 \u05de\u05de\u05d3\u05e8\u05d9\u05db\u05d9\u05e0\u05d5. \u05d0\u05e8\u05d5\u05d7\u05ea \u05e6\u05d4\u05e8\u05d9\u05d9\u05dd \u05d1-Agape Refectory \u2013 \u05de\u05d1\u05e0\u05d4 \u05d4\u05d9\u05e1\u05d8\u05d5\u05e8\u05d9 \u05de\u05e8\u05e9\u05d9\u05dd \u05de\u05e9\u05e0\u05ea 1655. \u05e1\u05d9\u05d5\u05e8 \u05d1\u05d9\u05e8\u05d5\u05d5\u05d0\u05df: \u05de\u05ea\u05d7\u05dd \u05d4\u05e7\u05e1\u05e7\u05d3, \u05d1\u05d9\u05ea \u05d4\u05d0\u05d5\u05e4\u05e8\u05d4, \u05e8\u05d7\u05d5\u05d1 \u05d4\u05e6\u05e4\u05d5\u05df. \u05d0\u05e8\u05d5\u05d7\u05ea \u05e2\u05e8\u05d1 \u05d7\u05d2\u05d9\u05d2\u05d9\u05ea \u05d1\u05de\u05e8\u05db\u05d6 \u05d4\u05ea\u05e8\u05d1\u05d5\u05ea \"\u05e9\u05d8\u05d9\u05d7\u05d9 \u05de\u05d2\u05e8\u05d9\u05d0\u05df\" \u2013 \u05db\u05d5\u05dc\u05dc \u05e1\u05d3\u05e0\u05ea \u05d1\u05d9\u05e9\u05d5\u05dc \u05e2\u05dd \u05d4\u05e9\u05e3 \u05d4\u05de\u05e4\u05d5\u05e8\u05e1\u05dd \u05de\u05e8 \u05e1\u05e8\u05e7 \u05de\u05d5\u05de\u05d5\u05dc\u05d5\u05de\u05d9.; **\u05d9\u05d5\u05dd 2 (29.6): \u05d2\u05d4\u05e8\u05d4\u05d2\u05d3, \u05e1\u05d9\u05de\u05e4\u05d5\u05e0\u05d9\u05d9\u05ea \u05d4\u05d0\u05d1\u05e0\u05d9\u05dd, \u05e9\u05d0\u05d1\u05d0\u05dc \u05d5\u05d9\u05e7\u05d1**; \u05d0\u05e8\u05d5\u05d7\u05ea \u05d1\u05d5\u05e7\u05e8 \u05d1\u05de\u05dc\u05d5\u05df. \u05e0\u05e1\u05d9\u05e2\u05d4 \u05e0\u05d5\u05e4\u05d9\u05ea \u05dc\u05db\u05e4\u05e8\u05d9\u05dd \u05d9\u05d2\u05d5\u05d8\u05d9 \u05d5\u05d2\u05e8\u05e0\u05d9. \u05d1\u05d9\u05e7\u05d5\u05e8 \u05d1\u05de\u05e0\u05d6\u05e8 \u05d2\u05d4\u05e8\u05d4\u05d2\u05d3 \u2013 \u05d0\u05ea\u05e8 \u05de\u05d5\u05e8\u05e9\u05ea \u05e2\u05d5\u05dc\u05de\u05d9 \u05e9\u05dc \u05d9\u05d5\u05e0\u05e1\u05e7\"\u05d5. \u05d4\u05d5\u05e4\u05e2\u05ea \u05de\u05e7\u05d4\u05dc\u05d4 \u05d1\u05d7\u05d3\u05e8\u05d9 \u05d4\u05de\u05e0\u05d6\u05e8. \u05e1\u05d9\u05de\u05e4\u05d5\u05e0\u05d9\u05d9\u05ea \u05d4\u05d0\u05d1\u05e0\u05d9\u05dd \u2013 \u05e2\u05de\u05d5\u05d3\u05d9 \u05d4\u05d1\u05d6\u05dc\u05ea \u05d4\u05de\u05d3\u05d4\u05d9\u05de\u05d9\u05dd. \u05e1\u05d3\u05e0\u05ea \u05d0\u05e4\u05d9\u05d9\u05ea \u05dc\u05d7\u05dd \u05e9\u05d0\u05d1\u05d0\u05dc \u05de\u05e1\u05d5\u05e8\u05ea\u05d9 \u05d1\u05ea\u05e0\u05d5\u05e8 \u05d8\u05d5\u05e0\u05d9\u05e8. \u05d1\u05d9\u05e7\u05d5\u05e8 \u05d1\u05de\u05e7\u05d3\u05e9 \u05d4\u05e4\u05d2\u05d0\u05e0\u05d9 \u05d2\u05e8\u05e0\u05d9. \u05d4\u05d5\u05e4\u05e2\u05ea \u05d3\u05d5\u05d3\u05d5\u05e7 \u05d7\u05d9. \u05d1\u05d9\u05e7\u05d5\u05e8 \u05d1\u05d9\u05e7\u05d1 \"\u05d5\u05d5\u05e1\u05e7\u05d1\u05d0\u05d6\" \u2013 \u05d8\u05e2\u05d9\u05de\u05ea \u05d9\u05d9\u05e0\u05d5\u05ea \u05d0\u05e8\u05de\u05e0\u05d9\u05d9\u05dd.; **\u05d9\u05d5\u05dd 3 (30.6): \u05e7\u05e0\u05d9\u05d5\u05ea \u05d5\u05d0\u05e0\u05d3\u05e8\u05d8\u05d0\u05d5\u05ea**; \u05d0\u05e8\u05d5\u05d7\u05ea \u05d1\u05d5\u05e7\u05e8 \u05d1\u05de\u05dc\u05d5\u05df. \u05e7\u05e0\u05d9\u05d5\u05ea \u05d1\u05e9\u05d5\u05e7 \u05d4\u05e4\u05e9\u05e4\u05e9\u05d9\u05dd \"\u05d5\u05e8\u05e0\u05d9\u05e1\u05d0\u05d6'\" \u05d5\u05d1\u05e9\u05d5\u05e7 GUM. \u05d1\u05d9\u05e7\u05d5\u05e8 \u05d1\u05d0\u05e0\u05d3\u05e8\u05d8\u05ea \"\u05d0\u05de\u05d0 \u05d0\u05e8\u05de\u05e0\u05d9\u05d4\". \u05d6\u05de\u05df \u05d7\u05d5\u05e4\u05e9\u05d9 \u05d5\u05de\u05e0\u05d5\u05d7\u05d4. \u05d0\u05e8\u05d5\u05d7\u05ea \u05e2\u05e8\u05d1 \u05e4\u05e8\u05d9\u05d3\u05d4 \u05d1-Tavern Yerevan Riverside \u2013 \u05de\u05d5\u05d6\u05d9\u05e7\u05d4 \u05d7\u05d9\u05d4 \u05d5\u05e4\u05d5\u05dc\u05e7\u05dc\u05d5\u05e8.; **\u05d9\u05d5\u05dd 4 (1.7): \u05d9\u05d5\u05dd \u05d0\u05d7\u05e8\u05d5\u05df \u05d5\u05d7\u05d6\u05e8\u05d4**; \u05d0\u05e8\u05d5\u05d7\u05ea \u05d1\u05d5\u05e7\u05e8 \u05d1\u05de\u05dc\u05d5\u05df. \u05d1\u05d9\u05e7\u05d5\u05e8 \u05d1\u05e4\u05d0\u05e8\u05e7 \u05d4\u05d9\u05d4\u05d5\u05d3\u05d9 \u05d5\u05d1\u05d9\u05ea \u05d4\u05db\u05e0\u05e1\u05ea \u05d4\u05de\u05e7\u05d5\u05de\u05d9. \u05d7\u05e0\u05d5\u05ea \u05e9\u05d5\u05e7\u05d5\u05dc\u05d3 Grand Candy. \u05e7\u05e0\u05d9\u05d5\u05ea \u05d0\u05d7\u05e8\u05d5\u05e0\u05d5\u05ea \u05d1\u05e7\u05e0\u05d9\u05d5\u05df Dalma Garden Mall. \u05d4\u05e2\u05d1\u05e8\u05d4 \u05dc\u05e0\u05de\u05dc \u05d4\u05ea\u05e2\u05d5\u05e4\u05d4 \u05dc\u05e7\u05e8\u05d0\u05ea \u05d4\u05d8\u05d9\u05e1\u05d4 \u05d7\u05d6\u05e8\u05d4.";

  const handleContinue = () => {
    setLocation("/register/1");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-red-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="\u05d4\u05d4\u05e1\u05ea\u05d3\u05e8\u05d5\u05ea" className="h-20 md:h-24 w-auto" />
        </div>

        <Card className="p-8 md:p-12 bg-white">
          <Button variant="ghost" className="mb-6" onClick={() => setLocation("/region-select")}>
            <ArrowRight className="w-4 h-4 ml-2" />
            \u05d7\u05d6\u05e8\u05d4 \u05dc\u05d1\u05d7\u05d9\u05e8\u05ea \u05de\u05e8\u05d7\u05d1
          </Button>

          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            \u05e4\u05e8\u05d8\u05d9 \u05d4\u05e0\u05e1\u05d9\u05e2\u05d4 \u05dc\u05d0\u05e8\u05de\u05e0\u05d9\u05d4
          </h1>

          <div className="text-center mb-8">
            <p className="text-xl text-red-700 font-semibold">
              {selectedRegion} &bull; 28.6.2026 &ndash; 1.7.2026
            </p>
          </div>

          <div className="mb-8">
            <Card className="p-6 bg-red-50 border border-red-100">
              <p className="text-lg text-gray-700 leading-relaxed text-center">{description}</p>
            </Card>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">\u05d2\u05dc\u05e8\u05d9\u05d9\u05ea \u05ea\u05de\u05d5\u05e0\u05d5\u05ea</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {tourImages.map((img, idx) => (
                <div key={idx} className="aspect-video overflow-hidden rounded-lg shadow">
                  <img
                    src={img}
                    alt={`\u05d0\u05e8\u05de\u05e0\u05d9\u05d4 ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).parentElement!.style.display = "none";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Plane className="w-6 h-6 text-red-700" />
                \u05e4\u05e8\u05d8\u05d9 \u05d8\u05d9\u05e1\u05d4
              </h3>
              <div className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdown(flightDetails) }} />
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Luggage className="w-6 h-6 text-red-700" />
                \u05db\u05d1\u05d5\u05d3\u05d4
              </h3>
              <div className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdown(luggageDetails) }} />
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Hotel className="w-6 h-6 text-red-700" />
                \u05de\u05dc\u05d5\u05df
              </h3>
              <div className="text-gray-600 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: renderMarkdown(hotelDetails) }} />
              <div className="bg-red-50 rounded-lg p-4 border border-red-100 mb-4">
                <p className="font-bold text-gray-800 text-lg">{hotel.name} {hotel.stars}</p>
                <p className="text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  {hotel.address}
                </p>
                <a href={hotel.mapLink} target="_blank" rel="noopener noreferrer" className="text-red-700 hover:underline text-sm mt-2 inline-block">
                  \u05e4\u05ea\u05d7 \u05d1\u05de\u05e4\u05d5\u05ea Google \u2197
                </a>
              </div>
              <div className="rounded-lg overflow-hidden border border-gray-200 h-64">
                <iframe
                  title="\u05de\u05d9\u05e7\u05d5\u05dd \u05d4\u05de\u05dc\u05d5\u05df"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${hotel.mapQuery}&output=embed&z=15`}
                />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-red-700" />
                \u05ea\u05d5\u05db\u05e0\u05d9\u05ea \u05d4\u05e1\u05d9\u05d5\u05e8
              </h3>
              <div className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdown(itinerary) }} />
            </Card>
          </div>

          <div className="flex justify-center pt-8">
            <Button size="lg" className="text-lg px-12 py-6 h-auto bg-red-700 hover:bg-red-800" onClick={handleContinue}>
              \u05d0\u05e0\u05d9 \u05de\u05e2\u05d5\u05e0\u05d9\u05d9\u05df \u05dc\u05d4\u05d9\u05e8\u05e9\u05dd
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
