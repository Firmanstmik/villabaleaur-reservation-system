import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LayoutDashboard, Heart, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export default function UserDropdown() {
  const { user, userType, signOut } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userInitial = userName.charAt(0).toUpperCase();
  const userEmail = user?.email || '';

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate(`/${language}/`);
    } catch (error: any) {
      toast.error('Failed to log out. Please try again.');
    }
  };

  // For buyers: Show dropdown on hover, navigate on click
  if (userType === 'buyer') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${language}/account`);
            }}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            className="relative h-10 w-10 rounded-full hover:bg-secondary transition-colors cursor-pointer p-0"
            title="My Account"
          >
            <Avatar className="h-10 w-10 border-2 border-ukon-navy">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt={userName} />
              <AvatarFallback className="bg-ukon-navy text-white font-semibold text-sm">
                {userInitial}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-56"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
            {/* User Info Header */}
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {/* My Account */}
              <DropdownMenuItem
                onClick={() => {
                  setIsOpen(false);
                  navigate(`/${language}/account`);
                }}
                className="cursor-pointer transition-colors"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>My Account</span>
              </DropdownMenuItem>

              {/* Settings */}
              <DropdownMenuItem
                onClick={() => {
                  setIsOpen(false);
                  navigate(`/${language}/account`);
                }}
                className="cursor-pointer transition-colors"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="cursor-pointer text-ukon-red focus:text-ukon-red focus:bg-ukon-red/10 transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // For agents: Show dropdown with multiple options
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-10 w-10 rounded-full hover:bg-secondary transition-colors cursor-pointer p-0">
          <Avatar className="h-10 w-10 border-2 border-ukon-navy">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt={userName} />
            <AvatarFallback className="bg-ukon-navy text-white font-semibold text-sm">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* User Info Header */}
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold text-foreground">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {/* Agent Dashboard */}
          <DropdownMenuItem
            onClick={() => navigate(`/${language}/dashboard`)}
            className="cursor-pointer transition-colors"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Agent Dashboard</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => navigate(`/${language}/dashboard`)}
            className="cursor-pointer transition-colors"
          >
            <Heart className="mr-2 h-4 w-4" />
            <span>My Listings</span>
          </DropdownMenuItem>

          {/* Settings - goes to account page */}
          <DropdownMenuItem
            onClick={() => navigate(`/${language}/account`)}
            className="cursor-pointer transition-colors"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-ukon-red focus:text-ukon-red focus:bg-ukon-red/10 transition-colors"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
