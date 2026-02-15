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
              </div>
            </TableCell>
          </TableRow>
        </CollapsibleContent>
      </Collapsible>
    );
  };
