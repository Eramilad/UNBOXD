import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertTriangle, Lock, Eye, Upload, Download, User, Car, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { KYCVerification, EscrowSystem, SecurityMonitoring } from '@/utils/trustSecurity';

interface TrustSecurityProps {
  userId: string;
  userType: 'customer' | 'driver';
  onVerificationComplete: (verified: boolean) => void;
  onEscrowStatusChange: (status: string) => void;
}

const TrustSecurity: React.FC<TrustSecurityProps> = ({ 
  userId, 
  userType, 
  onVerificationComplete, 
  onEscrowStatusChange 
}) => {
  const [verification, setVerification] = useState<any>(null);
  const [escrowTransactions, setEscrowTransactions] = useState<any[]>([]);
  const [securityDashboard, setSecurityDashboard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingDocument, setUploadingDocument] = useState<string | null>(null);

  useEffect(() => {
    loadSecurityData();
  }, [userId, userType]);

  const loadSecurityData = async () => {
    setIsLoading(true);
    try {
      // Load verification status
      const verificationStatus = await KYCVerification.getVerificationStatus(userId);
      setVerification(verificationStatus);
      onVerificationComplete(verificationStatus?.status === 'verified');

      // Load security dashboard
      const dashboard = await SecurityMonitoring.getSecurityDashboard();
      setSecurityDashboard(dashboard);

      // Load escrow transactions
      const transactions = await loadEscrowTransactions();
      setEscrowTransactions(transactions);
    } catch (error) {
      console.error('Error loading security data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEscrowTransactions = async () => {
    // Mock data - in real app, this would fetch from API
    return [
      {
        id: 'escrow-1',
        bookingId: 'booking-123',
        amount: 5000,
        status: 'secured',
        createdAt: new Date(),
        securedAt: new Date()
      },
      {
        id: 'escrow-2',
        bookingId: 'booking-456',
        amount: 7500,
        status: 'released',
        createdAt: new Date(),
        securedAt: new Date(),
        releasedAt: new Date()
      }
    ];
  };

  const handleDocumentUpload = async (documentType: string, file: File) => {
    setUploadingDocument(documentType);
    try {
      const result = await KYCVerification.uploadDocument(userId, documentType, file);
      if (result.success) {
        await loadSecurityData();
      } else {
        console.error('Upload failed:', result.error);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setUploadingDocument(null);
    }
  };

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'rejected': return 'text-red-600';
      case 'expired': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'rejected': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'expired': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEscrowStatusColor = (status: string) => {
    switch (status) {
      case 'secured': return 'text-blue-600';
      case 'released': return 'text-green-600';
      case 'disputed': return 'text-red-600';
      case 'refunded': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getEscrowStatusIcon = (status: string) => {
    switch (status) {
      case 'secured': return <Lock className="w-4 h-4 text-blue-600" />;
      case 'released': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'disputed': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'refunded': return <CheckCircle className="w-4 h-4 text-purple-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Loading Security Data</h3>
          <p className="text-gray-600">
            Verifying your account security status...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Security Overview */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Shield className="w-5 h-5" />
            Security Overview
          </CardTitle>
          <CardDescription className="text-blue-700">
            Your account security and verification status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {verification?.status === 'verified' ? '100%' : '0%'}
              </div>
              <div className="text-sm text-gray-600">Verification</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {escrowTransactions.filter(t => t.status === 'secured').length}
              </div>
              <div className="text-sm text-gray-600">Secured Funds</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {securityDashboard?.verifiedDrivers || 0}
              </div>
              <div className="text-sm text-gray-600">Verified Drivers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KYC Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Identity Verification
            {getVerificationStatusIcon(verification?.status || 'pending')}
          </CardTitle>
          <CardDescription>
            Verify your identity to access all features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* National ID */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">National ID</h4>
                  <Badge variant={verification?.documents?.nationalId?.verified ? 'default' : 'secondary'}>
                    {verification?.documents?.nationalId?.verified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Upload a clear photo of your national ID
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDocumentUpload('nationalId', file);
                    }}
                    className="w-full"
                    disabled={uploadingDocument === 'nationalId'}
                  />
                  {uploadingDocument === 'nationalId' && (
                    <div className="text-sm text-blue-600">Uploading...</div>
                  )}
                </div>
              </div>

              {/* Driver License */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Driver License</h4>
                  <Badge variant={verification?.documents?.driverLicense?.verified ? 'default' : 'secondary'}>
                    {verification?.documents?.driverLicense?.verified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Upload your valid driver license
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDocumentUpload('driverLicense', file);
                    }}
                    className="w-full"
                    disabled={uploadingDocument === 'driverLicense'}
                  />
                  {uploadingDocument === 'driverLicense' && (
                    <div className="text-sm text-blue-600">Uploading...</div>
                  )}
                </div>
              </div>

              {/* Vehicle Registration */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Vehicle Registration</h4>
                  <Badge variant={verification?.documents?.vehicleRegistration?.verified ? 'default' : 'secondary'}>
                    {verification?.documents?.vehicleRegistration?.verified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Upload vehicle registration document
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDocumentUpload('vehicleRegistration', file);
                    }}
                    className="w-full"
                    disabled={uploadingDocument === 'vehicleRegistration'}
                  />
                  {uploadingDocument === 'vehicleRegistration' && (
                    <div className="text-sm text-blue-600">Uploading...</div>
                  )}
                </div>
              </div>

              {/* Insurance */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Insurance</h4>
                  <Badge variant={verification?.documents?.insurance?.verified ? 'default' : 'secondary'}>
                    {verification?.documents?.insurance?.verified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Upload valid insurance certificate
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDocumentUpload('insurance', file);
                    }}
                    className="w-full"
                    disabled={uploadingDocument === 'insurance'}
                  />
                  {uploadingDocument === 'insurance' && (
                    <div className="text-sm text-blue-600">Uploading...</div>
                  )}
                </div>
              </div>
            </div>

            {/* Verification Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Verification Progress</span>
                <span>
                  {verification ? Math.round(verification.verificationScore * 100) : 0}%
                </span>
              </div>
              <Progress 
                value={verification ? verification.verificationScore * 100 : 0} 
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Escrow System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Escrow System
          </CardTitle>
          <CardDescription>
            Secure payment protection for all transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  ₦{securityDashboard?.securedFunds?.toLocaleString() || '0'}
                </div>
                <div className="text-sm text-gray-600">Total Secured</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {escrowTransactions.filter(t => t.status === 'released').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {escrowTransactions.filter(t => t.status === 'disputed').length}
                </div>
                <div className="text-sm text-gray-600">Disputed</div>
              </div>
            </div>

            {/* Escrow Transactions */}
            <div>
              <h4 className="font-semibold mb-2">Recent Transactions</h4>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {escrowTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.bookingId}</TableCell>
                        <TableCell>₦{transaction.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getEscrowStatusIcon(transaction.status)}
                            <span className={getEscrowStatusColor(transaction.status)}>
                              {transaction.status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {transaction.createdAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Security Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {verification?.status !== 'verified' && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Complete your identity verification to access all features and ensure secure transactions.
                </AlertDescription>
              </Alert>
            )}
            
            {escrowTransactions.some(t => t.status === 'disputed') && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You have disputed transactions. Please resolve them to maintain your account status.
                </AlertDescription>
              </Alert>
            )}
            
            {verification?.status === 'verified' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Your account is fully verified and secure. All transactions are protected by our escrow system.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrustSecurity;
