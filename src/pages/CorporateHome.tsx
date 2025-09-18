import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Building2, Users, Shield, BarChart3, Clock, Truck, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CorporateHome = () => {
  const navigate = useNavigate();

  const corporateServices = [
    {
      icon: Building2,
      title: "Staff Relocation Services",
      description: "Seamless employee relocations with bulk booking discounts and dedicated support.",
      features: ["Bulk booking discounts", "Dedicated account manager", "Employee self-service portal"]
    },
    {
      icon: Users,
      title: "Estate & Hostel Partnerships",
      description: "Complete moving solutions for residential complexes and student accommodations.",
      features: ["Volume pricing", "Scheduled move-outs", "Inventory management"]
    },
    {
      icon: Shield,
      title: "Enterprise Insurance & Tracking",
      description: "Comprehensive coverage and real-time tracking for high-value corporate moves.",
      features: ["Full insurance coverage", "Real-time GPS tracking", "Damage protection"]
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Detailed insights and reporting for corporate budgeting and compliance.",
      features: ["Cost analytics", "Move completion reports", "Budget forecasting"]
    }
  ];

  const benefits = [
    { icon: Clock, text: "50% faster processing time" },
    { icon: Truck, text: "Dedicated fleet allocation" },
    { icon: CheckCircle, text: "99.8% on-time delivery rate" },
    { icon: BarChart3, text: "Real-time reporting dashboard" }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg"></div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Unboxd Corporate</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200" onClick={() => navigate("/corporate/partnerships")}>Partnerships</Button>
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200" onClick={() => navigate("/corporate/dashboard")}>Dashboard</Button>
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200" onClick={() => navigate("/")}>Personal Moves</Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105" onClick={() => navigate("/corporate/partnerships")}>Get Started</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto text-center max-w-5xl">
          <Badge className="mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 text-blue-300 px-4 py-2 text-sm font-medium">
            Enterprise Moving Solutions
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
            Corporate Relocation Made Simple
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Streamline your business relocations with our enterprise-grade platform. From staff moves to estate partnerships, we handle it all.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Button size="lg" onClick={() => navigate("/corporate/bulk-booking")} className="text-lg px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105">
              Start Bulk Booking <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/corporate/partnerships")} className="text-lg px-10 py-4 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl transition-all duration-300">
              Become a Partner
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Corporate Moving Solutions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {corporateServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-border/50">
                <CardHeader>
                  <service.icon className="h-10 w-10 text-primary mb-4" />
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Unboxd Corporate</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <p className="font-semibold">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Corporate Moves?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join hundreds of companies that trust Unboxd for their relocation needs.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {/* Updated to existing routes so buttons work on click */}
            <Button size="lg" onClick={() => navigate("/corporate/partnerships")}>
              Schedule Consultation
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/corporate/dashboard")}>
              Request Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CorporateHome;