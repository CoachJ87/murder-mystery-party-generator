
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const { isAuthenticated, user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="py-4 px-4 md:px-8 border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2 mr-8">
            <span className="text-2xl font-bold gradient-text">Murder Mystery Generator</span>
          </Link>

          {/* Desktop Navigation - Now aligned left */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/showcase" className="text-foreground/80 hover:text-foreground transition-colors duration-200">
              Showcase
            </Link>
          </nav>
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user?.avatar && (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="font-medium">{user?.name}</span>
              </div>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
              <Button asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            </div>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b p-4 flex flex-col space-y-4 z-50">
          <Link to="/showcase" className="text-foreground hover:text-foreground/80 py-2" onClick={toggleMenu}>
            Showcase
          </Link>
          
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-2 py-2">
                {user?.avatar && (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="font-medium">{user?.name}</span>
              </div>
              <Button asChild className="w-full" onClick={toggleMenu}>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" className="w-full" onClick={() => {
                signOut();
                toggleMenu();
              }}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" className="w-full" onClick={toggleMenu}>
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button asChild className="w-full" onClick={toggleMenu}>
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
