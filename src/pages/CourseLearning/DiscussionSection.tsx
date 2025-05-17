
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { MessageSquare, ThumbsUp, Flag } from "lucide-react";

interface DiscussionSectionProps {
  lectureId: string;
}

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  likes: number;
  user: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
}

const DiscussionSection: React.FC<DiscussionSectionProps> = ({ lectureId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [likedComments, setLikedComments] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        // Fetch comments for this lecture
        const { data, error } = await supabase
          .from('lecture_comments')
          .select(`
            *,
            user:user_id (
              first_name,
              last_name,
              avatar_url
            )
          `)
          .eq('lecture_id', lectureId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          setComments(data);
          
          // Fetch user's liked comments
          if (user) {
            const { data: likes, error: likesError } = await supabase
              .from('comment_likes')
              .select('comment_id')
              .eq('user_id', user.id);
            
            if (!likesError && likes) {
              const likeMap: {[key: string]: boolean} = {};
              likes.forEach(like => {
                likeMap[like.comment_id] = true;
              });
              setLikedComments(likeMap);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (lectureId) {
      fetchComments();
      
      // Set up realtime subscription for comments
      const commentSubscription = supabase
        .channel('lecture_comments')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'lecture_comments',
          filter: `lecture_id=eq.${lectureId}`
        }, () => {
          fetchComments();
        })
        .subscribe();
        
      return () => {
        commentSubscription.unsubscribe();
      };
    }
  }, [lectureId, user]);

  const handleSubmitComment = async () => {
    if (!user) {
      toast.error("Please sign in to leave a comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('lecture_comments')
        .insert({
          lecture_id: lectureId,
          user_id: user.id,
          content: newComment.trim(),
          created_at: new Date().toISOString(),
          likes: 0
        });
      
      if (error) throw error;
      
      setNewComment("");
      toast.success("Comment posted successfully");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      toast.error("Please sign in to like comments");
      return;
    }

    try {
      if (likedComments[commentId]) {
        // Unlike comment
        const { error: unlikeError } = await supabase
          .from('comment_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('comment_id', commentId);
        
        if (unlikeError) throw unlikeError;
        
        // Decrease like count
        const { error: updateError } = await supabase.rpc('decrement_comment_like', {
          comment_id: commentId
        });
        
        if (updateError) throw updateError;
        
        setLikedComments(prev => ({
          ...prev,
          [commentId]: false
        }));
        
        // Update local state
        setComments(prev => prev.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, likes: Math.max(0, comment.likes - 1) };
          }
          return comment;
        }));
      } else {
        // Like comment
        const { error: likeError } = await supabase
          .from('comment_likes')
          .insert({
            user_id: user.id,
            comment_id: commentId,
            created_at: new Date().toISOString()
          });
        
        if (likeError) throw likeError;
        
        // Increase like count
        const { error: updateError } = await supabase.rpc('increment_comment_like', {
          comment_id: commentId
        });
        
        if (updateError) throw updateError;
        
        setLikedComments(prev => ({
          ...prev,
          [commentId]: true
        }));
        
        // Update local state
        setComments(prev => prev.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, likes: comment.likes + 1 };
          }
          return comment;
        }));
      }
    } catch (error) {
      console.error("Error liking/unliking comment:", error);
      toast.error("Failed to update like");
    }
  };

  const handleReportComment = async (commentId: string) => {
    if (!user) {
      toast.error("Please sign in to report comments");
      return;
    }

    try {
      const { error } = await supabase
        .from('comment_reports')
        .insert({
          comment_id: commentId,
          user_id: user.id,
          reason: 'inappropriate_content',
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success("Comment reported to moderators");
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error("You've already reported this comment");
      } else {
        console.error("Error reporting comment:", error);
        toast.error("Failed to report comment");
      }
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, { 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading discussion...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Discussion</h3>
      
      {user && (
        <div className="space-y-4">
          <Textarea
            placeholder="Add to the discussion..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            rows={3}
            className="w-full resize-none"
          />
          <Button 
            onClick={handleSubmitComment} 
            disabled={!newComment.trim() || submitting}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Post Comment
          </Button>
        </div>
      )}
      
      {!user && (
        <div className="bg-muted/30 p-4 rounded-md text-center">
          <p className="text-muted-foreground">
            Please sign in to participate in the discussion
          </p>
        </div>
      )}
      
      {comments.length === 0 ? (
        <div className="text-center py-6">
          <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">
            No comments yet. Be the first to start the discussion!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b pb-4 last:border-0">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.user?.avatar_url || undefined} />
                  <AvatarFallback>
                    {comment.user?.first_name?.charAt(0) || ''}
                    {comment.user?.last_name?.charAt(0) || ''}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {comment.user?.first_name} {comment.user?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(comment.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <p className="mt-2">{comment.content}</p>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleLikeComment(comment.id)}
                      className="flex items-center gap-1 text-xs"
                    >
                      <ThumbsUp 
                        className={`h-3.5 w-3.5 ${likedComments[comment.id] ? 'fill-primary text-primary' : ''}`} 
                      />
                      <span>{comment.likes}</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleReportComment(comment.id)}
                      className="text-xs flex items-center gap-1 text-muted-foreground"
                    >
                      <Flag className="h-3.5 w-3.5" />
                      Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionSection;
