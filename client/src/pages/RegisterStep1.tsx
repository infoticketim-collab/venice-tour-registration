import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function RegisterStep1() {
  const params = useParams<{ tourId: string }>();
  const tourId = parseInt(params.tourId || "0");
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    firstNameHe: "",
    lastNameHe: "",
    phone: "",
    email: "",
  });

  // Get region from sessionStorage
  const selectedRegion = sessionStorage.getItem("selectedRegion") || "";
  
  // All regions go to the same tour date
  const assignedDate = "june_28_jul_1";

  const { data: tour } = trpc.tours.getById.useQuery({ id: tourId });

  const handleContinue = () => {
    // Store form data with region and assigned date in sessionStorage
    const dataToStore = {
      ...formData,
      region: selectedRegion,
      assignedDate,
    };
    sessionStorage.setItem("registrationStep1", JSON.stringify(dataToStore));
    setLocation(`/register/${tourId}/step2`);
  };

  const isFormValid = 
    formData.firstNameHe.trim() !== "" &&
    formData.lastNameHe.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.email.trim() !== "" &&
    selectedRegion !== "";

  return (
    <div className="min-h-screen bg-white py-6">
      <div className="w-full flex justify-center py-4 border-b border-gray-100 mb-6">
        <img src="/logo.png" alt="ההסתדרות" className="h-16 md:h-20 w-auto" />
      </div>
      <div className="container max-w-2xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => setLocation("/trip-details")}
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          חזרה
        </Button>

        <Card className="card-shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">פרטי הנוסע</CardTitle>
            <CardDescription className="text-lg mt-2">
              שלום! נשמח לקבל את פרטיך על מנת להשלים את ההרשמה לסיור לארמניה
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstNameHe">שם פרטי</Label>
                  <Input
                    id="firstNameHe"
                    value={formData.firstNameHe}
                    onChange={(e) => setFormData({ ...formData, firstNameHe: e.target.value })}
                    placeholder="הכנס שם פרטי"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastNameHe">שם משפחה</Label>
                  <Input
                    id="lastNameHe"
                    value={formData.lastNameHe}
                    onChange={(e) => setFormData({ ...formData, lastNameHe: e.target.value })}
                    placeholder="הכנס שם משפחה"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">מספר טלפון</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="050-1234567"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">דואר אלקטרוני</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@email.com"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Selected Region and Date Display */}
            <div className="space-y-4 pt-4 border-t">
              <div className="bg-red-50 rounded-lg p-6 text-center border border-red-100">
                <Label className="text-lg font-semibold block mb-2">המרחב שנבחר</Label>
                <p className="text-xl font-bold text-red-700 mb-4">{selectedRegion}</p>
                <Label className="text-lg font-semibold block mb-2">תאריך הסיור</Label>
                <p className="text-xl font-bold text-gray-800">
                  28.6.2026 – 1.7.2026
                </p>
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-center pt-6">
              <Button
                size="lg"
                className="text-lg px-12 py-6 h-auto"
                onClick={handleContinue}
                disabled={!isFormValid}
              >
                המשך להזנת פרטים
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
