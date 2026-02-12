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
    datePreference: "" as "" | "may_4_6" | "may_25_27" | "no_preference",
  });

  const { data: tour } = trpc.tours.getById.useQuery({ id: tourId });

  const handleContinue = () => {
    // Store form data in sessionStorage to pass to next step
    sessionStorage.setItem("registrationStep1", JSON.stringify(formData));
    setLocation(`/register/${tourId}/step2`);
  };

  const isFormValid = 
    formData.firstNameHe.trim() !== "" &&
    formData.lastNameHe.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.datePreference !== "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background py-12">
      <div className="container max-w-2xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => setLocation("/")}
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          חזרה
        </Button>

        <Card className="card-shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">פרטי הנוסע</CardTitle>
            <CardDescription className="text-lg mt-2">
              שלום! נשמח לקבל את פרטיך על מנת להשלים את ההרשמה לסיור
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

            {/* Date Preference */}
            <div className="space-y-4 pt-4 border-t">
              <Label className="text-lg font-semibold">בחר את התאריך המועדף עליך</Label>
              <RadioGroup
                value={formData.datePreference}
                onValueChange={(value) => setFormData({ ...formData, datePreference: value as any })}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="may_4_6" id="may_4_6" />
                  <Label htmlFor="may_4_6" className="flex-1 cursor-pointer font-normal">
                    <div className="font-semibold">4-6 במאי</div>
                    <div className="text-sm text-muted-foreground">סוף שבוע ראשון</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="may_25_27" id="may_25_27" />
                  <Label htmlFor="may_25_27" className="flex-1 cursor-pointer font-normal">
                    <div className="font-semibold">25-27 במאי</div>
                    <div className="text-sm text-muted-foreground">סוף שבוע שני</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="no_preference" id="no_preference" />
                  <Label htmlFor="no_preference" className="flex-1 cursor-pointer font-normal">
                    <div className="font-semibold">אין לי העדפה</div>
                    <div className="text-sm text-muted-foreground">כל תאריך מתאים לי</div>
                  </Label>
                </div>
              </RadioGroup>
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
