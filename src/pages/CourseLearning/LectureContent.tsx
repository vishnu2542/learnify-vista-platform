
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface LectureContentProps {
  lectureId: string;
}

const LectureContent: React.FC<LectureContentProps> = ({ lectureId }) => {
  const [content, setContent] = useState<string>("");
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLectureContent = async () => {
      setLoading(true);
      try {
        // Fetch lecture content
        const { data: lectureData, error: lectureError } = await supabase
          .from('course_lectures')
          .select('content')
          .eq('id', lectureId)
          .single();
        
        if (lectureError) throw lectureError;
        
        if (lectureData) {
          setContent(lectureData.content || '');
        }
        
        // Fetch lecture materials
        const { data: materialsData, error: materialsError } = await supabase
          .from('course_materials')
          .select('*')
          .eq('lecture_id', lectureId);
        
        if (materialsError) throw materialsError;
        
        if (materialsData) {
          setMaterials(materialsData);
        }
      } catch (error) {
        console.error("Error fetching lecture content:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (lectureId) {
      fetchLectureContent();
    }
  }, [lectureId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading lecture content...</p>
      </div>
    );
  }

  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert">
      {content ? (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <p className="text-muted-foreground">No content available for this lecture.</p>
      )}

      {materials.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Downloadable Materials</h3>
          <ul className="space-y-2">
            {materials.map((material) => (
              <li key={material.id} className="bg-muted/40 p-3 rounded-md flex items-center justify-between">
                <div>
                  <p className="font-medium">{material.title}</p>
                  <p className="text-sm text-muted-foreground">{material.file_type} · {material.file_size}</p>
                </div>
                <a 
                  href={material.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm"
                  download
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LectureContent;
