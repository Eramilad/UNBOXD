import React from 'react';
import { TrendingUp, Users, Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const UrgencySection = () => {
  const urgencyItems = [
    {
      icon: Users,
      text: "This week: 7/10 move slots already taken",
      progress: 70,
      type: "slots"
    },
    {
      icon: TrendingUp,
      text: "Grand Opening: Only 4 out of 10 discounted slots left",
      progress: 60,
      type: "discount"
    },
    {
      icon: Calendar,
      text: "Next moving batch starts Monday morning — miss it, wait a week",
      progress: 80,
      type: "batch"
    },
    {
      icon: AlertCircle,
      text: "🎓 Student Deadline Alert: Management requires move-outs before Sept 15th",
      progress: 85,
      type: "deadline"
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-red-50 to-orange-50 border-t-2 border-red-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-red-800 mb-2 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 mr-2 animate-pulse" />
            Live Availability Updates
          </h2>
          <p className="text-red-600">Don't miss out — slots are filling fast!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {urgencyItems.map((item, index) => (
            <Card key={index} className="border-2 border-red-200 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      item.progress >= 80 ? 'bg-red-100' : item.progress >= 60 ? 'bg-orange-100' : 'bg-yellow-100'
                    }`}>
                      <item.icon className={`h-5 w-5 ${
                        item.progress >= 80 ? 'text-red-600' : item.progress >= 60 ? 'text-orange-600' : 'text-yellow-600'
                      }`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 mb-2">
                      {item.text}
                    </p>
                    <div className="space-y-1">
                      <Progress 
                        value={item.progress} 
                        className={`h-2 ${
                          item.progress >= 80 ? '[&>div]:bg-red-500' : 
                          item.progress >= 60 ? '[&>div]:bg-orange-500' : '[&>div]:bg-yellow-500'
                        }`}
                      />
                      <p className="text-xs text-gray-600">
                        {item.progress}% {item.type === 'slots' ? 'booked' : item.type === 'discount' ? 'claimed' : 'filled'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center">
          <div className="bg-white/90 rounded-lg p-4 inline-block border-2 border-red-200">
            <p className="text-red-800 font-semibold text-sm">
              ⚡ Booking momentum: <span className="text-red-600">3 bookings in the last hour</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UrgencySection;