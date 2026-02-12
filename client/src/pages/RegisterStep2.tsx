import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function RegisterStep2() {
  const params = useParams<{ tourId: string }>();
  const tourId = parseInt(params.tourId || "0");
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    firstNameEn: "",
    lastNameEn: "",
    birthDate: "",
    passportConfirmed: false,
  });

  const [step1Data, setStep1Data] = useState<any>(null);

  useEffect(() => {
    // Retrieve step 1 data from sessionStorage
    const savedData = sessionStorage.getItem("registrationStep1");
    if (savedData) {
      setStep1Data(JSON.parse(savedData));
    } else {
      // If no step 1 data, redirect back
      setLocation(`/register/${tourId}`);
    }
  }, [tourId, setLocation]);

  const createRegistration = trpc.registrations.create.useMutation({
    onSuccess: (data) => {
      // Clear session storage
      sessionStorage.removeItem("registrationStep1");
      // Navigate to confirmation page
      setLocation(`/register/confirmation/${data.orderNumber}`);
    },
    onError: (error) => {
      toast.error("שגיאה בהרשמה", {
        description: error.message || "אנא נסה שוב מאוחר יותר",
      });
    },
  });

  const handleSubmit = () => {
    if (!step1Data) return;

    createRegistration.mutate({
      tourId,
      datePreference: step1Data.datePreference,
      participant: {
        firstNameHe: step1Data.firstNameHe,
        lastNameHe: step1Data.lastNameHe,
        phone: step1Data.phone,
        email: step1Data.email,
        firstNameEn: formData.firstNameEn,
        lastNameEn: formData.lastNameEn,
        birthDate: formData.birthDate,
        passportConfirmed: formData.passportConfirmed,
      },
    });
  };

  const isFormValid = 
    formData.firstNameEn.trim() !== "" &&
    formData.lastNameEn.trim() !== "" &&
    formData.birthDate !== "" &&
    formData.passportConfirmed;

  if (!step1Data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background py-12">
      <div className="container max-w-2xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => setLocation(`/register/${tourId}`)}
          disabled={createRegistration.isPending}
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          חזרה
        </Button>

        <Card className="card-shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">פרטי דרכון</CardTitle>
            <CardDescription className="text-lg mt-2">
              אנא הזן את הפרטים הבאים על פי נתוני הדרכון
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Passport Information */}
            <div className="space-y-4">
              <div className="bg-accent/30 p-4 rounded-lg border border-accent">
                <p className="text-sm font-medium text-center">
                  שים לב: יש להזין את השמות באנגלית בדיוק כפי שהם מופיעים בדרכון
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstNameEn">First Name (English)</Label>
                  <Input
                    id="firstNameEn"
                    value={formData.firstNameEn}
                    onChange={(e) => setFormData({ ...formData, firstNameEn: e.target.value })}
                    placeholder="First Name"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastNameEn">Last Name (English)</Label>
                  <Input
                    id="lastNameEn"
                    value={formData.lastNameEn}
                    onChange={(e) => setFormData({ ...formData, lastNameEn: e.target.value })}
                    placeholder="Last Name"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">תאריך לידה</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  dir="ltr"
                />
              </div>
            </div>

            {/* Passport Confirmation */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-start space-x-3 space-x-reverse p-4 border rounded-lg bg-muted/30">
                <Checkbox
                  id="passportConfirmed"
                  checked={formData.passportConfirmed}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, passportConfirmed: checked as boolean })
                  }
                />
                <Label 
                  htmlFor="passportConfirmed" 
                  className="text-sm font-medium leading-relaxed cursor-pointer"
                >
                  אני מאשר/ת שאני מצויד/ה בדרכון בתוקף למשך 6 חודשים לפחות מיום הנסיעה
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                size="lg"
                className="text-lg px-12 py-6 h-auto"
                onClick={handleSubmit}
                disabled={!isFormValid || createRegistration.isPending}
              >
                {createRegistration.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                    מבצע רישום...
                  </>
                ) : (
                  <>
                    בצע רישום
                    <ArrowLeft className="w-5 h-5 mr-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
