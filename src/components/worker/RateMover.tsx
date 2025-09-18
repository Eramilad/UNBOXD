
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RateMoverProps {
  moverId: string;
  jobId: string;
  onRatingSubmitted?: () => void;
}

export const RateMover = ({ moverId, jobId, onRatingSubmitted }: RateMoverProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submitRating = async () => {
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('ratings')
        .insert({
          mover_id: moverId,
          job_id: jobId,
          rating: rating,
          comment: comment
        });

      if (error) {
        toast({
          title: "Error submitting rating",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Rating submitted successfully",
        });
        onRatingSubmitted?.();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Rate the Mover</h3>
      
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
          >
            <Star className={`h-6 w-6 ${star <= rating ? 'fill-current' : ''}`} />
          </button>
        ))}
      </div>

      <Textarea
        placeholder="Leave a comment (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full"
      />

      <Button 
        onClick={submitRating}
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Submitting...' : 'Submit Rating'}
      </Button>
    </div>
  );
};
