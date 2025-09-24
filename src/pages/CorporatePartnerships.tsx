import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Building, Home, GraduationCap, Handshake, TrendingUp, Users } from "lucide-react";

const CorporatePartnerships = () => {
  const [partnershipType, setPartnershipType] = useState("");

  const partnershipTypes = [
    {
      id: "real-estate",
      title: "Real Estate Firms",
      icon: Building,
      description: "Property management companies and real estate agencies",
      benefits: [
        "20% commission on referred moves",
        "Branded moving packages for your properties",
        "Priority scheduling for tenant move-outs",
        "Dedicated account management"
      ],
      requirements: [
        "Minimum 50 units managed",
        "Active property portfolio",
        "Legal business registration"
      ]
    },
    {
      id: "hostels",
      title: "Student Hostels & Accommodations",
      icon: GraduationCap,
      description: "Student housing providers and hostel operators",
      benefits: [
        "Bulk pricing for student moves",
        "Semester-end move coordination",
        "24/7 emergency moving support",
        "Student-friendly payment plans"
      ],
      requirements: [
        "Licensed accommodation facility",
        "Minimum 100 bed capacity",
        "Student safety certifications"
      ]
    },
    {
      id: "residential",
      title: "Residential Estates",
      icon: Home,
      description: "Estate management and residential communities",
      benefits: [
        "Exclusive resident moving rates",
        "Coordinated move-in/out schedules",
        "Estate-wide moving events",
        "Monthly reporting dashboard"
      ],
      requirements: [
        "Minimum 200 residential units",
        "Estate management license",
        "Resident services program"
      ]
    },
    {
      id: "corporate",
      title: "Corporate HR Partners",
      icon: Users,
      description: "HR departments and employee relocation services",
      benefits: [
        "Employee self-service portal",
        "Corporate billing and reporting",
        "Relocation package integration",
        "Volume discount tiers"
      ],
      requirements: [
        "Registered corporation",
        "Employee headcount 100+",
        "Active relocation program"
      ]
    }
  ];

  const selectedPartnership = partnershipTypes.find(type => type.id === partnershipType);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Partnership Opportunities</h1>
            <p className="text-lg text-gray-300">
              Join our network of trusted partners and grow your business with Unboxd's moving solutions
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900/50">
            <TabsTrigger value="overview">Partnership Types</TabsTrigger>
            <TabsTrigger value="benefits">Benefits & Commission</TabsTrigger>
            <TabsTrigger value="application">Apply Now</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              {partnershipTypes.map((type) => (
                <Card key={type.id} className="hover:shadow-lg transition-shadow border-border/50 bg-gray-900">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <type.icon className="h-8 w-8 text-primary" />
                      <div>
                        <CardTitle className="text-white">{type.title}</CardTitle>
                        <CardDescription className="text-gray-300">{type.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Partner Benefits:</h4>
                      <ul className="space-y-1">
                        {type.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Requirements:</h4>
                      <ul className="space-y-1">
                        {type.requirements.map((req, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-300">
                            <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      className="w-full bg-primary text-white hover:bg-primary/90" 
                      onClick={() => setPartnershipType(type.id)}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="benefits">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-gray-900 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Commission Structure
                  </CardTitle>
                  <CardDescription className="text-gray-300">Earn competitive commissions on every referral</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-950/30 rounded-lg">
                      <span className="font-medium">Real Estate Partners</span>
                      <Badge className="bg-green-100 text-green-800">20% Commission</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-950/30 rounded-lg">
                      <span className="font-medium">Hostel Partners</span>
                      <Badge className="bg-blue-100 text-blue-800">15% Commission</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-950/30 rounded-lg">
                      <span className="font-medium">Estate Managers</span>
                      <Badge className="bg-purple-100 text-purple-800">12% Commission</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-950/30 rounded-lg">
                      <span className="font-medium">Corporate HR</span>
                      <Badge className="bg-orange-100 text-orange-800">Volume Based</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Handshake className="h-5 w-5 mr-2" />
                    Partnership Benefits
                  </CardTitle>
                  <CardDescription className="text-gray-300">Exclusive advantages for our partners</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Monthly commission payouts</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Dedicated partner dashboard</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Priority customer support</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Marketing materials provided</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Training and onboarding</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Performance bonuses</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6 bg-gray-900 border-border/50">
              <CardHeader>
                <CardTitle className="text-white">Revenue Calculator</CardTitle>
                <CardDescription className="text-gray-300">Estimate your potential monthly earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="monthly-referrals">Monthly Referrals</Label>
                    <Input id="monthly-referrals" type="number" placeholder="10" />
                  </div>
                  <div>
                    <Label htmlFor="avg-move-value">Average Move Value (₦)</Label>
                    <Input id="avg-move-value" type="number" placeholder="25000" />
                  </div>
                  <div className="flex items-end">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">₦50,000</p>
                      <p className="text-sm text-gray-400">Est. Monthly Commission</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="application">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-gray-900 border-border/50">
                <CardHeader>
                  <CardTitle className="text-white">Partnership Application</CardTitle>
                  <CardDescription className="text-gray-300">
                    Submit your application to join our partner network
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input id="company-name" placeholder="Your Company Ltd." />
                    </div>
                    <div>
                      <Label htmlFor="partnership-type">Partnership Type</Label>
                      <Select value={partnershipType} onValueChange={setPartnershipType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select partnership type" />
                        </SelectTrigger>
                        <SelectContent>
                          {partnershipTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-name">Contact Person</Label>
                      <Input id="contact-name" placeholder="John Doe" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="john@company.com" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="+234 XXX XXX XXXX" />
                    </div>
                    <div>
                      <Label htmlFor="business-size">Business Size</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small (1-50 units)</SelectItem>
                          <SelectItem value="medium">Medium (51-200 units)</SelectItem>
                          <SelectItem value="large">Large (201-500 units)</SelectItem>
                          <SelectItem value="enterprise">Enterprise (500+ units)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="experience">Business Experience</Label>
                    <Textarea 
                      id="experience"
                      placeholder="Tell us about your business, experience in the industry, and why you'd like to partner with us..."
                      className="resize-none"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="monthly-volume">Expected Monthly Volume</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Estimated moves per month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 moves</SelectItem>
                        <SelectItem value="11-25">11-25 moves</SelectItem>
                        <SelectItem value="26-50">26-50 moves</SelectItem>
                        <SelectItem value="51+">51+ moves</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedPartnership && (
                    <Card className="bg-blue-950/30 border-blue-900">
                      <CardContent className="pt-4">
                        <h4 className="font-medium mb-2">Partnership Benefits Summary:</h4>
                        <ul className="space-y-1 text-sm">
                          {selectedPartnership.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-blue-400 mr-2" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  <Button className="w-full bg-primary text-white hover:bg-primary/90" size="lg">
                    Submit Application
                  </Button>

                  <p className="text-xs text-gray-400 text-center">
                    Applications are typically reviewed within 3-5 business days. 
                    We'll contact you for next steps.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CorporatePartnerships;