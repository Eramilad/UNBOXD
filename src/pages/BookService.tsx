import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Clock, User, Mail, Phone, Users, Truck, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const BookService = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: '',
    moveType: '',
    moveOption: '',
    presentLocation: '',
    destination: '',
    date: '',
    time: '',
    roomSize: '',
    email: '',
    phoneNumber: '',
    referralCode: '',
    additionalServices: [],
    specialRequests: ''
  });

  const services = [
    { id: 'Moving Services', name: 'Moving Services', price: 'Price varies by distance and load size' },
    { id: 'Cleaning Services', name: 'Cleaning Services', price: 'Price varies by room size and cleaning depth' },
    { id: 'Handyman Services', name: 'Handyman Services', price: 'Coming Soon' },
    { id: 'Storage Solutions', name: 'Storage Solutions', price: 'Coming Soon' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('service_requests')
        .insert([
          {
            service_type: formData.serviceType,
            move_type: formData.moveType,
            move_option: formData.moveOption,
            present_location: formData.presentLocation,
            destination: formData.destination,
            preferred_date: formData.date,
            preferred_time: formData.time,
            room_size: formData.roomSize,
            email: formData.email,
            phone: formData.phoneNumber,
            referral_code: formData.referralCode
          }
        ]);

      if (error) {
        throw error;
      }

      // Navigate to congratulations page instead of showing toast
      navigate('/booking-confirmation');

    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Book a Service</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Service Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div 
                  key={service.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    formData.serviceType === service.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData({...formData, serviceType: service.id})}
                >
                  <h3 className="font-medium text-gray-900">{service.name}</h3>
                  <p className="text-sm text-blue-600 font-semibold">{service.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Move Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Move Type
            </label>
            <div className="flex space-x-4">
              {['Move-In', 'Move-Out'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({...formData, moveType: type})}
                  className={`px-4 py-2 rounded-md border ${
                    formData.moveType === type
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Move Option */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Move Option
            </label>
            <RadioGroup
              value={formData.moveOption}
              onValueChange={(value) => setFormData({...formData, moveOption: value})}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.moveOption === 'Group Move' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setFormData({...formData, moveOption: 'Group Move'})}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="Group Move" id="group-move" />
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">Group Move</h3>
                    <p className="text-sm text-gray-600">Share moving costs with other students</p>
                    <p className="text-sm text-blue-600 font-semibold mt-1">More Affordable</p>
                  </div>
                </div>
              </div>
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.moveOption === 'Door-to-Door' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setFormData({...formData, moveOption: 'Door-to-Door'})}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="Door-to-Door" id="door-to-door" />
                  <Truck className="h-5 w-5 text-blue-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">Door-to-Door</h3>
                    <p className="text-sm text-gray-600">Dedicated service just for you</p>
                    <p className="text-sm text-blue-600 font-semibold mt-1">Premium Service</p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline h-4 w-4 mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              />
            </div>
          </div>

          {/* Referral Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Gift className="inline h-4 w-4 mr-1" />
              Referral Code (Optional)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter referral code for discounts"
              value={formData.referralCode}
              onChange={(e) => setFormData({...formData, referralCode: e.target.value})}
            />
            <p className="text-sm text-gray-500 mt-1">Have a friend's referral code? Enter it here to save on your move!</p>
          </div>

          {/* Present Location and Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Present Location
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your specific address (also add your state and city)"
                value={formData.presentLocation}
                onChange={(e) => setFormData({...formData, presentLocation: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Destination
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter destination address (also add state and city)"
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Preferred Date
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Preferred Time
              </label>
              <input
                type="time"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>

          {/* Room Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Size
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.roomSize}
              onChange={(e) => setFormData({...formData, roomSize: e.target.value})}
            >
              <option value="">Select size</option>
              <option value="studio">Studio</option>
              <option value="1bedroom">1 Bedroom</option>
              <option value="2bedroom">2 Bedroom</option>
              <option value="3bedroom">3+ Bedroom</option>
            </select>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any special requirements or requests..."
              value={formData.specialRequests}
              onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookService;
