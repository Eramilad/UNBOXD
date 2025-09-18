
import React from 'react';
import { Users, CheckCircle, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TrackRecord = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Track Record of Success
          </h2>
          <p className="text-lg text-muted-foreground">
            Trusted by over 50 students and families for smooth move-ins and move-outs in the past year.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Statistics Cards */}
          <Card className="text-center p-8 border-border">
            <CardContent className="p-0">
              <div className="flex items-center justify-center mb-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">50+</h3>
              <p className="text-muted-foreground">Students & Families Served</p>
            </CardContent>
          </Card>

          <Card className="text-center p-8 border-border">
            <CardContent className="p-0">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">35</h3>
              <p className="text-muted-foreground">Moves Successfully Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Testimonial */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-muted/30 border-border">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-lg md:text-xl text-foreground mb-6 italic">
                  "They made moving into my new apartment stress-free and quick. Everything arrived safe and on time!"
                </blockquote>
                <div className="flex items-center justify-center">
                  <div>
                    <p className="font-semibold text-foreground">Aji</p>
                    <p className="text-sm text-muted-foreground">OAU Student</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TrackRecord;
