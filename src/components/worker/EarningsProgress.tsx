
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Target, TrendingUp } from 'lucide-react';

interface EarningsProgressProps {
  earnings: {
    thisMonth: number;
    goal: number;
    total: number;
    jobsCompleted: number;
  };
}

export const EarningsProgress = ({ earnings }: EarningsProgressProps) => {
  const progressPercentage = Math.min((earnings.thisMonth / earnings.goal) * 100, 100);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-500" />
            <span>Monthly Goal Progress</span>
          </CardTitle>
          <CardDescription>
            ₦{earnings.thisMonth.toLocaleString()} of ₦{earnings.goal.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="w-full h-3" />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{Math.round(progressPercentage)}% Complete</span>
            <span>₦{(earnings.goal - earnings.thisMonth).toLocaleString()} remaining</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold">₦{earnings.total.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Jobs Done</p>
                <p className="text-2xl font-bold">{earnings.jobsCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
