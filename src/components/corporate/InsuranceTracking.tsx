import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  MapPin, 
  Clock, 
  Truck, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Phone,
  FileText
} from "lucide-react";

interface InsuranceTrackingProps {
  moveId: string;
  status: "scheduled" | "in-progress" | "completed" | "delayed";
}

const InsuranceTracking = ({ moveId, status }: InsuranceTrackingProps) => {
  const [activeTab, setActiveTab] = useState("tracking");

  const trackingData = {
    currentLocation: "Mile 12, Lagos",
    destination: "Victoria Island, Lagos",
    progress: 65,
    estimatedArrival: "2:30 PM",
    driver: "Adebayo Ola",
    truckId: "UBX-247",
    phone: "+234 803 XXX XXXX"
  };

  const insuranceDetails = {
    coverage: "₦5,000,000",
    policyNumber: "UBX-INS-2024-001",
    provider: "Leadway Assurance",
    expiryDate: "Dec 31, 2024",
    claimable: ["Theft", "Damage", "Loss", "Delay Compensation"]
  };

  const statusConfig = {
    scheduled: { color: "bg-blue-100 text-blue-800", icon: Clock },
    "in-progress": { color: "bg-green-100 text-green-800", icon: Truck },
    completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
    delayed: { color: "bg-red-100 text-red-800", icon: AlertTriangle }
  };

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <StatusIcon className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Move #{moveId}</CardTitle>
                <CardDescription>Enterprise relocation tracking & insurance</CardDescription>
              </div>
            </div>
            <Badge className={currentStatus.color}>
              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
          <TabsTrigger value="insurance">Insurance Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="tracking" className="space-y-6">
          {status === "in-progress" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Live Location Tracking
                </CardTitle>
                <CardDescription>Real-time GPS tracking of your move</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to destination</span>
                    <span>{trackingData.progress}%</span>
                  </div>
                  <Progress value={trackingData.progress} className="w-full" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Current Location</p>
                    <p className="text-sm text-muted-foreground">{trackingData.currentLocation}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Estimated Arrival</p>
                    <p className="text-sm text-muted-foreground">{trackingData.estimatedArrival}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Driver & Vehicle Details</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Driver</p>
                      <p className="text-muted-foreground">{trackingData.driver}</p>
                    </div>
                    <div>
                      <p className="font-medium">Vehicle ID</p>
                      <p className="text-muted-foreground">{trackingData.truckId}</p>
                    </div>
                    <div>
                      <p className="font-medium">Contact</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">{trackingData.phone}</span>
                        <Button size="sm" variant="outline">
                          <Phone className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    🚚 Your items are being transported with full GPS tracking and real-time monitoring.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {status === "scheduled" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Move Scheduled
                </CardTitle>
                <CardDescription>Your move is confirmed and will begin tracking once started</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">Move starts in 2 hours</p>
                  <p className="text-muted-foreground">Live tracking will activate once the driver arrives</p>
                </div>
              </CardContent>
            </Card>
          )}

          {status === "completed" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Move Completed Successfully
                </CardTitle>
                <CardDescription>All items delivered safely</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <p className="text-lg font-medium">Delivery Confirmed</p>
                  <p className="text-muted-foreground">All items accounted for and delivered</p>
                  <Button className="mt-4" variant="outline">
                    Download Completion Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="insurance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Insurance Coverage
              </CardTitle>
              <CardDescription>Comprehensive protection for your corporate move</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Coverage Amount</p>
                    <p className="text-2xl font-bold text-primary">{insuranceDetails.coverage}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Policy Number</p>
                    <p className="text-sm text-muted-foreground">{insuranceDetails.policyNumber}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Insurance Provider</p>
                    <p className="text-sm text-muted-foreground">{insuranceDetails.provider}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Valid Until</p>
                    <p className="text-sm text-muted-foreground">{insuranceDetails.expiryDate}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Coverage Includes</p>
                  <div className="space-y-2">
                    {insuranceDetails.claimable.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Need to file a claim?</p>
                    <p className="text-xs text-muted-foreground">24/7 claims support available</p>
                  </div>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    File Claim
                  </Button>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">
                  ✅ Your move is fully insured with no additional premium for corporate clients.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Move Documentation
              </CardTitle>
              <CardDescription>All relevant documents for this move</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Move Agreement", type: "PDF", size: "234 KB", status: "Available" },
                  { name: "Insurance Certificate", type: "PDF", size: "156 KB", status: "Available" },
                  { name: "Inventory List", type: "PDF", size: "89 KB", status: "Available" },
                  { name: "Completion Report", type: "PDF", size: "201 KB", status: status === "completed" ? "Available" : "Pending" }
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.type} • {doc.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={doc.status === "Available" ? "default" : "secondary"}>
                        {doc.status}
                      </Badge>
                      {doc.status === "Available" && (
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InsuranceTracking;