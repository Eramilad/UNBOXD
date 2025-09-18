
import React, { useState } from 'react';
import { User, Phone, MapPin, Star, Award, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const WorkerProfile = ({ worker, onUpdate }) => {
  const [editing, setEditing] = useState(!worker);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    full_name: worker?.full_name || '',
    phone: worker?.phone || '',
    location: worker?.location || '',
    skills: worker?.skills?.join(', ') || '',
    photo_url: worker?.photo_url || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to update your profile",
          variant: "destructive",
        });
        return;
      }

      const skillsArray = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      const profileData = {
        user_id: user.id,
        full_name: formData.full_name,
        phone: formData.phone,
        location: formData.location,
        skills: skillsArray,
        photo_url: formData.photo_url
      };

      let result;
      if (worker) {
        result = await supabase
          .from('workers')
          .update(profileData)
          .eq('id', worker.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('workers')
          .insert([profileData])
          .select()
          .single();
      }

      if (result.error) {
        console.error('Error saving profile:', result.error);
        toast({
          title: "Error",
          description: "Failed to save profile",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Profile saved successfully",
        });
        onUpdate(result.data);
        setEditing(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (editing) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              {worker ? 'Edit Profile' : 'Create Worker Profile'}
            </CardTitle>
            <CardDescription>
              Complete your profile to start accepting jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Lagos, Nigeria"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Textarea
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g., Packing, Moving, Heavy Lifting, Delivery"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo_url">Profile Photo URL (optional)</Label>
                <Input
                  id="photo_url"
                  name="photo_url"
                  type="url"
                  value={formData.photo_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </Button>
                {worker && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setEditing(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              {worker.photo_url ? (
                <img 
                  src={worker.photo_url} 
                  alt={worker.full_name}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{worker.full_name}</h1>
                  <div className="flex items-center mt-1 text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{worker.location}</span>
                  </div>
                  <div className="flex items-center mt-1 text-gray-600">
                    <Phone className="h-4 w-4 mr-1" />
                    <span>{worker.phone}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setEditing(true)}
                  variant="outline"
                >
                  Edit Profile
                </Button>
              </div>
              
              <div className="flex items-center mt-4 space-x-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-1" />
                  <span className="font-semibold">{worker.rating || '0.0'}</span>
                  <span className="text-gray-500 ml-1">rating</span>
                </div>
                <div>
                  <span className="font-semibold">{worker.total_jobs || 0}</span>
                  <span className="text-gray-500 ml-1">jobs completed</span>
                </div>
                <div>
                  <span className="font-semibold">₦{(worker.total_earnings || 0).toLocaleString()}</span>
                  <span className="text-gray-500 ml-1">total earned</span>
                </div>
              </div>
              
              {worker.skills && worker.skills.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {worker.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {worker.is_verified ? 'Verified Worker' : 'Pending Verification'}
              </p>
              <p className="text-sm text-gray-600">
                {worker.is_verified 
                  ? 'Your profile has been verified by our team'
                  : 'Complete your profile and wait for verification to unlock more features'
                }
              </p>
            </div>
            <Badge variant={worker.is_verified ? "default" : "secondary"}>
              {worker.is_verified ? 'Verified' : 'Pending'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
