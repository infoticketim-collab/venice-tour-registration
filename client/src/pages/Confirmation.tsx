import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Home } from "lucide-react";

export default function Confirmation() {
  const params = useParams<{ orderNumber: string }>();
  const [, setLocation] = useLocation();
  const orderNumber = params.orderNumber;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background flex items-center justify-center py-12">
      <div className="container max-w-2xl">
        <Card className="card-shadow-lg text-center">
          <CardHeader className="space-y-6 pb-8">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl mb-3">ההרשמה התקבלה בהצלחה!</CardTitle>
              <CardDescription className="text-lg">
                תודה שנרשמת לסיור בוונציה
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Number */}
            <div className="bg-accent/30 p-6 rounded-lg border-2 border-accent">
              <p className="text-sm text-muted-foreground mb-2">מספר הזמנה</p>
              <p className="text-4xl font-bold text-primary">{orderNumber}</p>
            </div>

            {/* Information */}
            <div className="space-y-4 text-right">
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-base leading-relaxed">
                  ההזמנה שלך נקלטה במערכת ותאושר בהקדם האפשרי.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm leading-relaxed text-blue-900">
                  <strong>שים לב:</strong> תקבל אישור סופי למייל שהזנת לאחר שההזמנה תאושר על ידי צוות ניצת הדובדבן.
                  אנא שמור את מספר ההזמנה לצורך מעקב.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
              <Button
                size="lg"
                onClick={() => setLocation("/")}
                className="text-lg px-8"
              >
                <Home className="w-5 h-5 ml-2" />
                חזרה לדף הבית
              </Button>
            </div>

            {/* Contact Information */}
            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                יש לך שאלות? צור קשר עם צוות ניצת הדובדבן
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
