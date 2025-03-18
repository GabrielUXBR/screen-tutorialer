
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock } from 'lucide-react';
import { useRecording } from '@/context/RecordingContext';

const TutorialsList: React.FC = () => {
  const { tutorials } = useRecording();
  
  if (tutorials.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">My guides</h2>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">You haven't created any guides yet</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">My guides</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map(tutorial => (
          <Link 
            key={tutorial.id}
            to={`/tutorial/${tutorial.id}`}
            className="group"
          >
            <div className="rounded-xl overflow-hidden shadow-sm bg-white border border-gray-100 card-hover">
              <div className="aspect-video relative bg-gray-100">
                {tutorial.thumbnail ? (
                  <img 
                    src={tutorial.thumbnail} 
                    alt={tutorial.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <svg 
                      className="w-16 h-16 text-gray-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                  <div className="rounded-full bg-white/90 p-3 transform group-hover:scale-110 transition-transform duration-300">
                    <Play className="h-6 w-6 text-brand" fill="currentColor" />
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-gray-900 truncate">{tutorial.title}</h3>
                <div className="flex items-center gap-6 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{tutorial.duration}</span>
                  </div>
                  <div>{new Date(tutorial.date).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TutorialsList;
