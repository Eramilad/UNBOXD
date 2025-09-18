import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, CreditCard, Calendar, MapPin, User, Phone, Mail, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CSVRow {
  id: string;
  data: Record<string, string>;
  errors: string[];
  isValid: boolean;
}

interface PreviewConfirmProps {
  rows: CSVRow[];
  onConfirm: () => void;
  onBack: () => void;
}

const PreviewConfirm: React.FC<PreviewConfirmProps> = ({ rows, onConfirm, onBack }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const validRows = rows.filter(row => row.isValid);
  const errorRows = rows.filter(row => !row.isValid);

  const totalCost = validRows.length * 150; // $150 per move
  const discount = validRows.length >= 10 ? totalCost * 0.1 : 0; // 10% discount for 10+ moves
  const finalCost = totalCost - discount;

  const handleRowToggle = (rowId: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === validRows.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(validRows.map(row => row.id)));
    }
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    
    // Emit analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'bulk_booking_confirmed', {
        event_category: 'booking',
        event_label: 'bulk_booking',
        value: finalCost,
        custom_parameters: {
          row_count: validRows.length,
          total_cost: finalCost
        }
      });
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onConfirm();
    } catch (error) {
      console.error('Confirmation failed:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            Review & Confirm Your Bulk Booking
          </CardTitle>
          <CardDescription>
            Review the details below and confirm your bulk booking request
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{validRows.length}</div>
            <div className="text-sm text-gray-600">Valid Bookings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{errorRows.length}</div>
            <div className="text-sm text-gray-600">Errors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {discount > 0 ? '10%' : '0%'}
            </div>
            <div className="text-sm text-gray-600">Discount</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              ${finalCost.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Cost</div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Base cost ({validRows.length} moves × $150)</span>
            <span>${totalCost.toLocaleString()}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Bulk discount (10% off)</span>
              <span>-${discount.toLocaleString()}</span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${finalCost.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Error Warnings */}
      {errorRows.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{errorRows.length} rows have errors</strong> and will be excluded from this booking. 
            Please fix these errors in the editor before proceeding.
          </AlertDescription>
        </Alert>
      )}

      {/* Booking Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Booking Preview</CardTitle>
              <CardDescription>
                {validRows.length} valid bookings ready for confirmation
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSelectAll}>
                {selectedRows.size === validRows.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Select</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Pickup</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {validRows.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row.id)}
                        onChange={() => handleRowToggle(row.id)}
                        className="rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{row.data.name}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {row.data.email}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {row.data.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <div className="text-sm">
                          {row.data.pickup_address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <div className="text-sm">
                          {row.data.delivery_address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <div className="text-sm">
                          {row.data.pickup_date}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">$150</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <input type="radio" name="payment" id="corporate-account" defaultChecked />
              <label htmlFor="corporate-account" className="flex-1">
                <div className="font-medium">Corporate Account</div>
                <div className="text-sm text-gray-600">Invoice will be sent to your billing email</div>
              </label>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <input type="radio" name="payment" id="credit-card" />
              <label htmlFor="credit-card" className="flex-1">
                <div className="font-medium">Credit Card</div>
                <div className="text-sm text-gray-600">Pay immediately with your corporate card</div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back to Editor
        </Button>
        <Button 
          onClick={handleConfirm}
          disabled={isConfirming || validRows.length === 0}
          className="flex-1"
        >
          {isConfirming ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Confirming...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Booking (${finalCost.toLocaleString()})
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PreviewConfirm;
