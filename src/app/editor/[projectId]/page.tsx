'use client';
import { Button } from '@/components/ui/button';
import { Editor } from '@/features/editor/components/editor';
import { useGetProject } from '@/features/projects/api/use-get-project';
import { Loader, TriangleAlert } from 'lucide-react';
import Link from 'next/link';

interface EditorProjectIdPageProps {
  params: {
    projectId: string;
  };
}

const EditorProjectIdPage = ({ params }: EditorProjectIdPageProps) => {
  const { projectId } = params;  // Destructure projectId from params
  
  // Fetch project data using your custom hook
  const { data, isLoading, isError } = useGetProject(projectId);

  if (isLoading || !data) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 animate-pulse shadow-lg">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        </div>

        <p className="mt-6 text-gray-600 font-medium text-lg tracking-wide animate-bounce">
          Loading, please wait...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-y-5 px-4 text-center">
        <div className="bg-red-100 p-4 rounded-full shadow-md">
          <TriangleAlert className="w-12 h-12 text-red-600" />
        </div>

        <div>
          <h2 className="text-red-600 font-bold text-xl">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            We couldn’t fetch the project. Please try again later or contact
            support if the issue persists.
          </p>
        </div>

        <div className="flex gap-4">
          <Button asChild variant="secondary">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <Editor initialData={data} />;
};

export default EditorProjectIdPage;
