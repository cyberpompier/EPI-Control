import { ReactNode } from 'react';
import Header from './Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  headerTitle?: string;
}

export function Layout({ children, headerTitle }: LayoutProps) {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        {headerTitle && (
          <div className="mb-6 flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold">{headerTitle}</h2>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}