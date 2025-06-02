import { useLocation } from "wouter";
import { Home, BookOpen, User } from "lucide-react";

export default function BottomNavigation() {
  const [location, navigate] = useLocation();

  return (
    <nav className="bg-white border-t border-neutral-200 w-full py-3 px-4 grid grid-cols-3 gap-1 shadow-lg">
      <button 
        className={`flex flex-col items-center justify-center py-1 transition-all ${
          location === '/home' 
            ? 'text-primary scale-105 font-semibold' 
            : 'text-neutral-500 hover:text-neutral-700'
        }`}
        onClick={() => navigate('/home')}
      >
        <div className={`p-2 rounded-full mb-1 ${
          location === '/home' ? 'bg-primary/10' : ''
        }`}>
          <Home className="h-5 w-5" />
        </div>
        <span className="text-xs">Home</span>
      </button>
      
      <button 
        className={`flex flex-col items-center justify-center py-1 transition-all ${
          location === '/education' 
            ? 'text-primary scale-105 font-semibold' 
            : 'text-neutral-500 hover:text-neutral-700'
        }`}
        onClick={() => navigate('/education')}
      >
        <div className={`p-2 rounded-full mb-1 ${
          location === '/education' ? 'bg-primary/10' : ''
        }`}>
          <BookOpen className="h-5 w-5" />
        </div>
        <span className="text-xs">Education</span>
      </button>
      
      <button 
        className={`flex flex-col items-center justify-center py-1 transition-all ${
          location === '/profile' 
            ? 'text-primary scale-105 font-semibold' 
            : 'text-neutral-500 hover:text-neutral-700'
        }`}
        onClick={() => navigate('/profile')}
      >
        <div className={`p-2 rounded-full mb-1 ${
          location === '/profile' ? 'bg-primary/10' : ''
        }`}>
          <User className="h-5 w-5" />
        </div>
        <span className="text-xs">Profile</span>
      </button>
    </nav>
  );
}
