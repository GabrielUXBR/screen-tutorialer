
import React from 'react';

interface GeneratedArticleProps {
  articleText: string | null;
}

const GeneratedArticle: React.FC<GeneratedArticleProps> = ({ articleText }) => {
  if (!articleText) return null;
  
  return (
    <div className="p-4 mt-2 border-t border-gray-100">
      <h4 className="text-lg font-medium mb-2">Generated Article</h4>
      <div className="bg-gray-50 p-4 rounded-md whitespace-pre-line">
        {articleText}
      </div>
    </div>
  );
};

export default GeneratedArticle;
