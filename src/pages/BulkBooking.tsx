import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Plus, Trash2, Upload, Download } from "lucide-react";
import { format } from "date-fns";

const BulkBooking = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [moves, setMoves] = useState([
    { id: 1, employee: "", from: "", to: "", moveType: "", priority: "normal" }
  ]);

  const addMove = () => {
    setMoves([...moves, { 
      id: moves.length + 1, 
      employee: "", 
      from: "", 
      to: "", 
      moveType: "", 
      priority: "normal" 
    }]);
  };

  const removeMove = (id: number) => {
    setMoves(moves.filter(move => move.id !== id));
  };

  const updateMove = (id: number, field: string, value: string) => {
    setMoves(moves.map(move => 
      move.id === id ? { ...move, [field]: value } : move
    ));
  };

  const moveTypes = [
    { value: "staff-relocation", label: "Staff Relocation", price: "₦25,000" },
    { value: "office-equipment", label: "Office Equipment", price: "₦15,000" },
    { value: "complete-office", label: "Complete Office Move", price: "₦50,000" },
    { value: "inter-branch", label: "Inter-Branch Transfer", price: "₦35,000" }
  ];

  const calculateTotal = () => {
    return moves.reduce((total, move) => {
      const moveType = moveTypes.find(type => type.value === move.moveType);
      return total + (moveType ? parseInt(moveType.price.replace(/[₦,]/g, '')) : 0);
    }, 0);
  };

  const bulkDiscount = moves.length >= 5 ? 0.15 : moves.length >= 3 ? 0.10 : 0;
  const totalBeforeDiscount = calculateTotal();
  const discountAmount = totalBeforeDiscount * bulkDiscount;
  const finalTotal = totalBeforeDiscount - discountAmount;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Bulk Move Booking</h1>
              <p className="text-muted-foreground">Schedule multiple moves efficiently</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Template
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Basic details for this bulk booking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" placeholder="Your Company Ltd." />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" placeholder="Human Resources" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact-person">Contact Person</Label>
                    <Input id="contact-person" placeholder="John Doe" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@company.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Special Instructions</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Any special requirements or notes for these moves..."
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferred Date */}
            <Card>
              <CardHeader>
                <CardTitle>Preferred Move Date</CardTitle>
                <CardDescription>Select your preferred date range for all moves</CardDescription>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Select date range"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>

            {/* Individual Moves */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Individual Moves ({moves.length})
                  <Button onClick={addMove} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Move
                  </Button>
                </CardTitle>
                <CardDescription>Add details for each individual move</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {moves.map((move, index) => (
                  <div key={move.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">Move #{index + 1}</Badge>
                      {moves.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeMove(move.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`employee-${move.id}`}>Employee Name</Label>
                        <Input 
                          id={`employee-${move.id}`}
                          value={move.employee}
                          onChange={(e) => updateMove(move.id, 'employee', e.target.value)}
                          placeholder="Employee full name" 
                        />
                      </div>
                      <div>
                        <Label htmlFor={`move-type-${move.id}`}>Move Type</Label>
                        <Select 
                          value={move.moveType} 
                          onValueChange={(value) => updateMove(move.id, 'moveType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select move type" />
                          </SelectTrigger>
                          <SelectContent>
                            {moveTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex justify-between w-full">
                                  <span>{type.label}</span>
                                  <span className="text-muted-foreground ml-4">{type.price}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`from-${move.id}`}>From Location</Label>
                        <Input 
                          id={`from-${move.id}`}
                          value={move.from}
                          onChange={(e) => updateMove(move.id, 'from', e.target.value)}
                          placeholder="Current address/location" 
                        />
                      </div>
                      <div>
                        <Label htmlFor={`to-${move.id}`}>To Location</Label>
                        <Input 
                          id={`to-${move.id}`}
                          value={move.to}
                          onChange={(e) => updateMove(move.id, 'to', e.target.value)}
                          placeholder="Destination address" 
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`priority-${move.id}`}>Priority Level</Label>
                      <Select 
                        value={move.priority} 
                        onValueChange={(value) => updateMove(move.id, 'priority', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="normal">Normal Priority</SelectItem>
                          <SelectItem value="high">High Priority (+₦5,000)</SelectItem>
                          <SelectItem value="urgent">Urgent (+₦10,000)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
                <CardDescription>Review your bulk booking details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Moves:</span>
                    <span className="font-medium">{moves.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₦{totalBeforeDiscount.toLocaleString()}</span>
                  </div>
                  
                  {bulkDiscount > 0 && (
                    <>
                      <div className="flex justify-between text-green-600">
                        <span>Bulk Discount ({Math.round(bulkDiscount * 100)}%):</span>
                        <span>-₦{discountAmount.toLocaleString()}</span>
                      </div>
                      <Separator />
                    </>
                  )}
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>₦{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {bulkDiscount === 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                    <p className="text-blue-700">
                      💡 Add {3 - moves.length} more moves to get 10% bulk discount!
                    </p>
                  </div>
                )}

                <Button className="w-full" size="lg">
                  Submit Bulk Request
                </Button>

                <div className="text-xs text-muted-foreground">
                  <p>• All prices include basic insurance</p>
                  <p>• Moves scheduled within 48 hours</p>
                  <p>• Dedicated account manager assigned</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkBooking;