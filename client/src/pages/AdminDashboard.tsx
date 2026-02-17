import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Check, X, Loader2, Calendar, Users, ChevronDown, ChevronLeft, LogOut } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";

type DateOption = "may_4_6" | "may_25_27";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Check password authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    const authTime = localStorage.getItem("adminAuthTime");
    
    if (!isAuthenticated) {
      setLocation("/admin/login");
      return;
    }
    
    // Check if session is expired (24 hours)
    if (authTime) {
      const elapsed = Date.now() - parseInt(authTime);
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (elapsed > twentyFourHours) {
        localStorage.removeItem("adminAuthenticated");
        localStorage.removeItem("adminAuthTime");
        toast.error("פג תוקף ההתחברות");
        setLocation("/admin/login");
      }
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminAuthTime");
    toast.success("התנתקת בהצלחה");
    setLocation("/admin/login");
  };
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<number | null>(null);
  const [selectedDates, setSelectedDates] = useState<Record<number, DateOption>>({});
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const { data: registrations, isLoading, refetch } = trpc.admin.getAllRegistrations.useQuery(
    undefined,
    { enabled: user?.role === "admin" }
  );

  const utils = trpc.useUtils();

  const approveMutation = trpc.admin.approveRegistration.useMutation({
    onSuccess: () => {
      toast.success("ההרשמה אושרה בהצלחה");
      refetch();
      utils.admin.getInventoryStats.invalidate();
    },
    onError: (error: any) => {
      toast.error("שגיאה באישור ההרשמה", { description: error.message });
    },
  });

  const assignAndApproveMutation = trpc.admin.assignDateAndApprove.useMutation({
    onSuccess: () => {
      toast.success("התאריך הוקצה וההרשמה אושרה");
      refetch();
      utils.admin.getInventoryStats.invalidate();
    },
    onError: (error: any) => {
      toast.error("שגיאה באישור ההרשמה", { description: error.message });
    },
  });

  const rejectMutation = trpc.admin.rejectRegistration.useMutation({
    onSuccess: () => {
      toast.success("ההרשמה נדחתה");
      refetch();
      utils.admin.getInventoryStats.invalidate();
    },
    onError: (error: any) => {
      toast.error("שגיאה בדחיית ההרשמה", { description: error.message });
    },
  });

  const cancelMutation = trpc.admin.cancelRegistration.useMutation({
    onSuccess: () => {
      toast.success("ההרשמה בוטלה");
      setCancelDialogOpen(false);
      setSelectedRegistrationId(null);
      refetch();
      utils.admin.getInventoryStats.invalidate();
    },
    onError: (error: any) => {
      toast.error("שגיאה בביטול ההרשמה", { description: error.message });
    },
  });

  const handleApprove = (registrationId: number, datePreference: string | null, assignedDate: string | null) => {
    if (datePreference === "no_preference" && !assignedDate) {
      const selectedDate = selectedDates[registrationId];
      if (!selectedDate) {
        toast.error("יש לבחור תאריך לפני אישור");
        return;
      }
      assignAndApproveMutation.mutate({ registrationId, assignedDate: selectedDate });
    } else {
      approveMutation.mutate({ registrationId });
    }
  };

  const handleCancelClick = (registrationId: number) => {
    setSelectedRegistrationId(registrationId);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    if (selectedRegistrationId) {
      cancelMutation.mutate({ registrationId: selectedRegistrationId });
    }
  };

  const toggleRow = (id: number) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>נדרשת התחברות</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = getLoginUrl()} className="w-full">
              התחבר
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>אין הרשאה</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Separate registrations by date
  const getEffectiveDate = (reg: any) => {
    if (reg.assignedDate) return reg.assignedDate;
    if (reg.datePreference === "no_preference") return null;
    return reg.datePreference;
  };

  const may4_6Registrations = registrations?.filter(r => getEffectiveDate(r) === "may_4_6") || [];
  const may25_27Registrations = registrations?.filter(r => getEffectiveDate(r) === "may_25_27") || [];
  const noPreferenceRegistrations = registrations?.filter(r => getEffectiveDate(r) === null) || [];

  const renderRegistrationRow = (reg: any, showDateSelector: boolean = false, showStatus: boolean = true) => {
    const isPending = reg.status === "pending";
    const isApproved = reg.status === "approved";
    const isRejected = reg.status === "rejected";
    const isExpanded = expandedRows[reg.id];

    return (
      <Collapsible key={reg.id} open={isExpanded} onOpenChange={() => toggleRow(reg.id)}>
        <TableRow className={`${isApproved ? 'bg-green-50/30' : isRejected ? 'bg-red-50/30' : ''}`}>
          {/* Column 1: Order number (rightmost) */}
          <TableCell className="w-20 font-medium p-2 text-right text-sm">#{reg.orderNumber}</TableCell>

          {/* Column 2: Name */}
          <TableCell className="p-2 text-right text-sm">
            {reg.participants[0]?.firstNameHe} {reg.participants[0]?.lastNameHe}
          </TableCell>

          {/* Column 3: Status (if shown) */}
          {showStatus && (
            <TableCell className="w-24 p-2 text-right">
              {isPending && !showDateSelector && <Badge variant="outline" className="text-xs bg-yellow-50">ממתין</Badge>}
              {isPending && showDateSelector && <Badge variant="outline" className="text-xs">אין העדפה</Badge>}
            </TableCell>
          )}

          {/* Column 4: Date selector (if shown) */}
          {showDateSelector && (
            <TableCell className="w-32 p-2 text-right">
              <Select
                value={selectedDates[reg.id] || ""}
                onValueChange={(value) => setSelectedDates({ ...selectedDates, [reg.id]: value as DateOption })}
              >
                <SelectTrigger className="w-full h-7 text-xs">
                  <SelectValue placeholder="בחר תאריך" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="may_4_6">4-6 במאי</SelectItem>
                  <SelectItem value="may_25_27">25-27 במאי</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          )}

          {/* Column 5: Actions */}
          <TableCell className="w-32 text-right p-2">
            <div className="flex gap-1 justify-end">
              {isPending && (
                <>
                  <Button
                    size="sm"
                    className="h-6 px-2 bg-green-600 hover:bg-green-700 text-xs"
                    onClick={() => handleApprove(reg.id, reg.datePreference, reg.assignedDate)}
                    disabled={approveMutation.isPending || assignAndApproveMutation.isPending}
                  >
                    <Check className="w-3 h-3 ml-1" />
                    אשר
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-6 px-2 text-xs"
                    onClick={() => rejectMutation.mutate({ registrationId: reg.id })}
                    disabled={rejectMutation.isPending}
                  >
                    <X className="w-3 h-3 ml-1" />
                    דחה
                  </Button>
                </>
              )}
              
              {isApproved && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => handleCancelClick(reg.id)}
                  disabled={cancelMutation.isPending}
                >
                  <X className="w-3 h-3 ml-1" />
                  בטל
                </Button>
              )}
              
              {isRejected && (
                <Button
                  size="sm"
                  className="h-6 px-2 bg-green-600 hover:bg-green-700 text-xs"
                  onClick={() => approveMutation.mutate({ registrationId: reg.id })}
                  disabled={approveMutation.isPending}
                >
                  <Check className="w-3 h-3 ml-1" />
                  אשר
                </Button>
              )}
            </div>
          </TableCell>

          {/* Column 6: Expand button (leftmost) */}
          <TableCell className="w-8 p-2 text-right">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-5 w-5">
                {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
              </Button>
            </CollapsibleTrigger>
          </TableCell>
        </TableRow>
        <CollapsibleContent asChild>
          <TableRow className="bg-muted/20">
            <TableCell colSpan={showStatus ? (showDateSelector ? 6 : 5) : 4} className="py-2">
              <div className="text-xs space-y-1 pr-6">
                <div><span className="font-medium">מייל:</span> {reg.participants[0]?.email}</div>
                <div><span className="font-medium">טלפון:</span> {reg.participants[0]?.phone}</div>
                <div><span className="font-medium">תאריך לידה:</span> {new Date(reg.participants[0]?.birthDate).toLocaleDateString('he-IL')}</div>
                <div><span className="font-medium">שם באנגלית:</span> {reg.participants[0]?.firstNameEn} {reg.participants[0]?.lastNameEn}</div>
                <div><span className="font-medium">תוספת מזוודה:</span> {reg.participants[0]?.additionalLuggage ? <span className="text-green-600 font-semibold">כן</span> : <span className="text-muted-foreground">לא</span>}</div>
                <div><span className="font-medium">שדרוג חדר יחיד:</span> {reg.participants[0]?.singleRoomUpgrade ? <span className="text-green-600 font-semibold">כן</span> : <span className="text-muted-foreground">לא</span>}</div>
              </div>
            </TableCell>
          </TableRow>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  const renderDateSection = (title: string, dateKey: DateOption, registrations: any[]) => {
    const pending = registrations.filter(r => r.status === "pending");
    const approved = registrations.filter(r => r.status === "approved");
    const rejected = registrations.filter(r => r.status === "rejected");

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">{title}</h2>
          <Badge variant="outline" className="text-sm">
            32 איש בקבוצה / {approved.length} רשומים / {32 - approved.length} מקומות פנויים
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Pending */}
          <Card>
            <CardHeader className="bg-yellow-50 border-b py-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                ממתינים ({pending.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {pending.length === 0 ? (
                <p className="text-center text-muted-foreground py-6 text-xs">אין הרשמות ממתינות</p>
              ) : (
                <Table dir="rtl" style={{ tableLayout: 'fixed', width: '100%' }}>
                  <TableHeader>
                    <TableRow className="text-xs">
                      <TableHead className="text-right" style={{ width: '15%' }}>#</TableHead>
                      <TableHead className="text-right" style={{ width: '35%' }}>שם</TableHead>
                      <TableHead className="text-right" style={{ width: '15%' }}>סטטוס</TableHead>
                      <TableHead className="text-right" style={{ width: '30%' }}><div className="flex justify-start">פעולות</div></TableHead>
                      <TableHead className="text-right" style={{ width: '5%' }}></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pending.map(reg => renderRegistrationRow(reg, false, true))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Approved */}
          <Card>
            <CardHeader className="bg-green-50 border-b py-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                מאושרים ({approved.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {approved.length === 0 ? (
                <p className="text-center text-muted-foreground py-6 text-xs">אין הרשמות מאושרות</p>
              ) : (
                <Table dir="rtl" style={{ tableLayout: 'fixed', width: '100%' }}>
                  <TableHeader>
                    <TableRow className="text-xs">
                      <TableHead style={{ width: '15%', textAlign: 'right' }}>#</TableHead>
                      <TableHead style={{ width: '50%', textAlign: 'right' }}>שם</TableHead>
                      <TableHead style={{ width: '30%', textAlign: 'right' }}><div className="flex justify-start">פעולות</div></TableHead>
                      <TableHead style={{ width: '5%', textAlign: 'right' }}></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approved.map(reg => renderRegistrationRow(reg, false, false))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Rejected */}
          <Card>
            <CardHeader className="bg-red-50 border-b py-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                נדחו ({rejected.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {rejected.length === 0 ? (
                <p className="text-center text-muted-foreground py-6 text-xs">אין הרשמות נדחות</p>
              ) : (
                <Table dir="rtl" style={{ tableLayout: 'fixed', width: '100%' }}>
                  <TableHeader>
                    <TableRow className="text-xs">
                      <TableHead style={{ width: '15%', textAlign: 'right' }}>#</TableHead>
                      <TableHead style={{ width: '50%', textAlign: 'right' }}>שם</TableHead>
                      <TableHead style={{ width: '30%', textAlign: 'right' }}><div className="flex justify-start">פעולות</div></TableHead>
                      <TableHead style={{ width: '5%', textAlign: 'right' }}></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rejected.map(reg => renderRegistrationRow(reg, false, false))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-6">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">ממשק ניהול - סיורים בוונציה</h1>
              <p className="text-blue-100 mt-1 text-sm">ניהול הרשמות לפי תאריכים</p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              <LogOut className="h-4 w-4 ml-2" />
              התנתקות
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* No Preference Section */}
            {noPreferenceRegistrations.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-orange-500" />
                  <h2 className="text-2xl font-bold">ללא העדפת תאריך</h2>
                  <Badge variant="outline" className="text-sm bg-orange-50">
                    דורש הקצאת תאריך ({noPreferenceRegistrations.length})
                  </Badge>
                </div>
                <Card>
                  <CardHeader className="bg-orange-50 border-b py-2">
                    <CardTitle className="text-sm">נרשמים שלא ציינו העדפת תאריך</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table dir="rtl" style={{ tableLayout: 'fixed', width: '100%' }}>
                      <TableHeader>
                        <TableRow className="text-xs">
                          <TableHead className="text-right" style={{ width: '12%' }}>#</TableHead>
                          <TableHead className="text-right" style={{ width: '25%' }}>שם</TableHead>
                          <TableHead className="text-right" style={{ width: '12%' }}>סטטוס</TableHead>
                          <TableHead className="text-right" style={{ width: '20%' }}>בחר תאריך</TableHead>
                          <TableHead className="text-right" style={{ width: '26%' }}><div className="flex justify-start">פעולות</div></TableHead>
                          <TableHead className="text-right" style={{ width: '5%' }}></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {noPreferenceRegistrations.map(reg => renderRegistrationRow(reg, true, true))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* May 4-6 Section */}
            {renderDateSection("4-6 במאי 2026", "may_4_6", may4_6Registrations)}

            {/* May 25-27 Section */}
            {renderDateSection("25-27 במאי 2026", "may_25_27", may25_27Registrations)}
          </>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו תבטל את ההרשמה ותעביר אותה לרשימת הנדחים. המקום ישוחרר בחזרה למלאי.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              אישור ביטול
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
