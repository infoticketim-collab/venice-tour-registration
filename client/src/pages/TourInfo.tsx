import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Luggage, Hotel, MapPin, Calendar, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";

// Helper function to convert markdown bold to HTML
function renderMarkdown(text: string) {
  // Convert **text** to <strong>text</strong>
  const withBold = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Convert line breaks to <br/>
  return withBold.replace(/\n/g, '<br/>');
}

export default function TourInfo() {
  const [, setLocation] = useLocation();
  const { data: tours, isLoading } = trpc.tours.getAll.useQuery();

  // For now, we'll use the first available tour
  const tour = tours?.[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background">
        <div className="container py-12">
          <Skeleton className="h-12 w-3/4 mx-auto mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>אין סיורים זמינים</CardTitle>
            <CardDescription>אנא בדוק שוב מאוחר יותר</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background">
      {/* Hero Header with gradient and logo */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-8 md:py-16">
        <div className="container">
          {/* Nizat Logo - full width on mobile, left-aligned on desktop */}
          <div className="mb-6 md:mb-8">
            <img 
              src="/nizat-logo.jpg" 
              alt="ניצת הדובדבן" 
              className="w-full md:w-auto md:h-20 h-auto max-w-sm mx-auto md:mx-0 md:ml-auto" 
            />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-6">
            סיור לימודי לצפון איטליה - מאי 2026
          </h1>
          <div className="text-center space-y-2 text-lg">
            <div className="font-semibold">תאריכים:</div>
            <div>4.5.2026-6.5.2026</div>
            <div>25.5.2026-27.5.2026</div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Tour Description */}
          {tour.description && (
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">אודות הסיור</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="text-lg leading-relaxed text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(tour.description) }}
                />
              </CardContent>
            </Card>
          )}

          {/* Flight Details */}
          {tour.flightDetails && (
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="w-6 h-6 text-primary" />
                  פרטי טיסה
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(tour.flightDetails) }}
                />
              </CardContent>
            </Card>
          )}

          {/* Luggage Details */}
          {tour.luggageDetails && (
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Luggage className="w-6 h-6 text-primary" />
                  כבודה
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(tour.luggageDetails) }}
                />
              </CardContent>
            </Card>
          )}

          {/* Hotel Details */}
          {tour.hotelDetails && (
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="w-6 h-6 text-primary" />
                  מלון
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(tour.hotelDetails) }}
                />
              </CardContent>
            </Card>
          )}

          {/* Itinerary */}
          {tour.itinerary && (
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  תוכנית הסיור
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(tour.itinerary) }}
                />
              </CardContent>
            </Card>
          )}



          {/* Registration Button */}
          <div className="flex justify-center pt-6">
            <Button
              size="lg"
              className="text-lg px-12 py-6 h-auto"
              onClick={() => setLocation(`/register/${tour.id}`)}
            >
              אני מעוניין להירשם
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
