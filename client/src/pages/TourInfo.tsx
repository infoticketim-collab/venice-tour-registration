import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Luggage, Hotel, MapPin, Calendar, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";

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
      {/* Hero Header with gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            {tour.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{new Date(tour.startDate).toLocaleDateString('he-IL')} - {new Date(tour.endDate).toLocaleDateString('he-IL')}</span>
            </div>
            {tour.price && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">₪{tour.price}</span>
              </div>
            )}
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
                <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {tour.description}
                </p>
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
                <p className="text-muted-foreground whitespace-pre-wrap">{tour.flightDetails}</p>
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
                <p className="text-muted-foreground whitespace-pre-wrap">{tour.luggageDetails}</p>
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
                <p className="text-muted-foreground whitespace-pre-wrap">{tour.hotelDetails}</p>
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
                <p className="text-muted-foreground whitespace-pre-wrap">{tour.itinerary}</p>
              </CardContent>
            </Card>
          )}

          {/* Available Spots */}
          <Card className="card-shadow bg-accent/20 border-accent">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-lg font-semibold mb-2">
                  מקומות פנויים: <span className="text-2xl text-primary">{tour.availableSpots}</span> מתוך {tour.capacity}
                </p>
                {tour.availableSpots < 10 && tour.availableSpots > 0 && (
                  <p className="text-sm text-destructive font-medium">מקומות אחרונים!</p>
                )}
                {tour.availableSpots === 0 && (
                  <p className="text-sm text-destructive font-medium">הסיור מלא - רישום למתנה</p>
                )}
              </div>
            </CardContent>
          </Card>

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
