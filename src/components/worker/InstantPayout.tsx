
import React, { useState } from 'react';
import { Zap, DollarSign, CreditCard, Smartphone, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface InstantPayoutProps {
  worker: any;
}

export const InstantPayout = ({ worker }: InstantPayoutProps) => {
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('');
  const [accountDetails, setAccountDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const availableBalance = worker.total_earnings || 0;
  const minimumPayout = 1000; // ₦1,000 minimum

  const handleInstantPayout = async () => {
    if (!payoutAmount || !payoutMethod || !accountDetails) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(payoutAmount);
    if (amount < minimumPayout) {
      toast({
        title: "Amount Too Low",
        description: `Minimum payout is ₦${minimumPayout.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    if (amount > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: "Payout amount exceeds available balance",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate payout processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, this would integrate with payment processors
      // like Paystack, Flutterwave, or bank APIs
      
      toast({
        title: "Payout Initiated!",
        description: `₦${amount.toLocaleString()} will be sent to your ${payoutMethod} within 5 minutes`,
      });

      // Reset form
      setPayoutAmount('');
      setPayoutMethod('');
      setAccountDetails('');
    } catch (error) {
      toast({
        title: "Payout Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const payoutMethods = [
    { value: 'bank', label: 'Bank Transfer', icon: CreditCard, fee: '₦50', time: '5 minutes' },
    { value: 'mobile_money', label: 'Mobile Money', icon: Smartphone, fee: '₦25', time: '2 minutes' },
    { value: 'crypto', label: 'Cryptocurrency', icon: Zap, fee: '₦10', time: '1 minute' }
  ];

  return (
    <div className="space-y-6">
      {/* Balance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Available Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600 mb-2">
            ₦{availableBalance.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">
            Ready for instant withdrawal
          </p>
        </CardContent>
      </Card>

      {/* Instant Payout Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Instant Payout
          </CardTitle>
          <CardDescription>
            Get your earnings in minutes, not days
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Payout Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder={`Minimum ₦${minimumPayout.toLocaleString()}`}
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
              max={availableBalance}
            />
            <p className="text-xs text-gray-500">
              Available: ₦{availableBalance.toLocaleString()}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Payout Method</Label>
            <Select value={payoutMethod} onValueChange={setPayoutMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Choose payout method" />
              </SelectTrigger>
              <SelectContent>
                {payoutMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <SelectItem key={method.value} value={method.value}>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{method.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {method.fee}
                        </Badge>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {payoutMethod && (
            <div className="space-y-2">
              <Label htmlFor="account">
                {payoutMethod === 'bank' ? 'Account Number' :
                 payoutMethod === 'mobile_money' ? 'Phone Number' :
                 'Wallet Address'}
              </Label>
              <Input
                id="account"
                placeholder={
                  payoutMethod === 'bank' ? '1234567890' :
                  payoutMethod === 'mobile_money' ? '+234 801 234 5678' :
                  '0x...'
                }
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
              />
            </div>
          )}

          {payoutMethod && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span>Processing Fee:</span>
                <span className="font-medium">
                  {payoutMethods.find(m => m.value === payoutMethod)?.fee}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span>Processing Time:</span>
                <span className="font-medium flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {payoutMethods.find(m => m.value === payoutMethod)?.time}
                </span>
              </div>
            </div>
          )}

          <Button
            onClick={handleInstantPayout}
            disabled={loading || !payoutAmount || !payoutMethod || !accountDetails}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              'Processing...'
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Instant Payout
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: 1, amount: 15000, method: 'Bank Transfer', status: 'completed', date: '2024-01-15' },
              { id: 2, amount: 8500, method: 'Mobile Money', status: 'completed', date: '2024-01-12' },
              { id: 3, amount: 12000, method: 'Cryptocurrency', status: 'processing', date: '2024-01-10' }
            ].map((payout) => (
              <div key={payout.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">₦{payout.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{payout.method}</p>
                </div>
                <div className="text-right">
                  <Badge variant={payout.status === 'completed' ? 'default' : 'secondary'}>
                    {payout.status === 'completed' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <Clock className="h-3 w-3 mr-1" />
                    )}
                    {payout.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{payout.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
