
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Share2, Download, Edit } from 'lucide-react';

// Mock data - in a real app, you'd fetch this based on the ID
const mockTutorials = {
  '1': {
    id: '1',
    title: 'How to create a workspace in Notion',
    description: 'In this tutorial we will learn about creating workspaces in Notion!',
    duration: '10:23',
    date: '2023-05-15',
    videoUrl: '/path-to-video.mp4', // In a real app, this would be a valid URL
    thumbnail: '/lovable-uploads/abd9b1c6-68af-4383-a3e7-fec5c6c66d1e.png',
    steps: [
      { time: '00:12', title: 'Uploading Video', completed: true },
      { time: '01:45', title: 'Uploading audio', completed: true },
      { time: '03:28', title: 'Transcription', completed: true },
      { time: '05:10', title: 'Creating AI article', completed: true },
      { time: '08:34', title: 'Narrating your video', completed: true },
    ]
  },
  '2': {
    id: '2',
    title: 'How to remove clients from the list',
    description: 'Learn how to manage your client list by removing unwanted clients.',
    duration: '05:47',
    date: '2023-05-12',
    videoUrl: '/path-to-video.mp4',
    thumbnail: null,
    steps: [
      { time: '00:30', title: 'Accessing client panel', completed: true },
      { time: '01:15', title: 'Filtering clients', completed: true },
      { time: '02:45', title: 'Removing client', completed: true },
      { time: '04:20', title: 'Confirming action', completed: true },
    ]
  },
};

const ViewTutorial: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const tutorial = id ? mockTutorials[id as keyof typeof mockTutorials] : null;
  
  if (!tutorial) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Tutorial not found</h1>
            <Link to="/">
              <Button>Back to home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center text-gray-600 hover:text-brand transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>Back to tutorials</span>
            </Link>
          </div>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{tutorial.title}</h1>
            <p className="text-gray-600 mt-2">{tutorial.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="text-sm text-gray-500">
                {new Date(tutorial.date).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-500">
                {tutorial.duration}
              </div>
              
              <div className="flex-grow"></div>
              
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
              
              <Button
                size="sm"
                className="flex items-center gap-2 bg-brand hover:bg-brand-dark"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="rounded-xl overflow-hidden shadow-md bg-white border border-gray-100">
                {tutorial.thumbnail ? (
                  <div className="aspect-video bg-gray-100">
                    <img 
                      src={tutorial.thumbnail} 
                      alt={tutorial.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <svg 
                      className="w-24 h-24 text-gray-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                )}
                
                <div className="p-4">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Description</h3>
                    <p className="text-gray-600 text-sm">{tutorial.description}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="rounded-xl overflow-hidden shadow-md bg-white border border-gray-100 sticky top-24">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-medium text-gray-900">Tutorial steps</h3>
                </div>
                
                <div className="p-4">
                  <ul className="space-y-4">
                    {tutorial.steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                            <svg 
                              className="w-3 h-3 text-green-600" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{step.title}</p>
                          <span className="text-xs text-gray-500">{step.time}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewTutorial;
