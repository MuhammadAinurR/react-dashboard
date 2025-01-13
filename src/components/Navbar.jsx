import { Bell, ChevronDown, Eye, EyeOff } from "lucide-react";
import LanguageToggler from "./LanguageToggler";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { Trans } from "@lingui/react/macro";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useState } from "react";
import { Input } from "./ui/input";

export function Navbar() {
  const { user, logout } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">DegenMax Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <DropdownMenu open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-full relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                  2
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[380px] max-h-[600px] overflow-y-auto">
              <div className="px-4 py-3 border-b">
                <h3 className="font-semibold"><Trans>Notifications</Trans></h3>
              </div>
              
              <div className="py-2">
                {/* Bind Request Notification */}
                <div className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Bell className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      <Trans>Pending Bind Requests</Trans>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      <Trans>You have 3 pending bind requests to review</Trans>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-blue-600 ml-auto mt-2" />
                </div>

                {/* Withdraw Request Notification */}
                <div className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Bell className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      <Trans>Pending Withdraw Requests</Trans>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      <Trans>You have 4 pending withdraw requests to review</Trans>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-blue-600 ml-auto mt-2" />
                </div>

                {/* Welcome Notification */}
                <div className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Bell className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm">
                      <Trans>Welcome to the platform</Trans>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      <Trans>Get started by exploring our features</Trans>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-2 border-t">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-center">
                  <Trans>See all notifications</Trans>
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <LanguageToggler /> */}
          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                  <AvatarFallback>{user?.username?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <span>{user?.username}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => setIsAccountOpen(true)}>
                <Trans>Account</Trans>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                <Trans>Settings</Trans>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <Trans>Sign out</Trans>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><Trans>Settings</Trans></DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <h3 className="mb-4 text-sm font-medium"><Trans>Language</Trans></h3>
            <LanguageToggler />
          </div>
        </DialogContent>
      </Dialog>

      {/* Account Dialog */}
      <Dialog open={isAccountOpen} onOpenChange={setIsAccountOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle><Trans>Account Settings</Trans></DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium"><Trans>Profile</Trans></h3>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                  <AvatarFallback>{user?.username?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user?.username}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium"><Trans>Security</Trans></h3>
              <button 
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsChangePasswordOpen(true)}
              >
                <Trans>Change Password</Trans>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium"><Trans>Account Management</Trans></h3>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                onClick={handleLogout}
              >
                <Trans>Delete Account</Trans>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle><Trans>Change Password</Trans></DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            // Add your password change logic here
            setIsChangePasswordOpen(false);
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="current-password" className="text-sm font-medium">
                  <Trans>Current Password</Trans>
                </label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="new-password" className="text-sm font-medium">
                  <Trans>New Password</Trans>
                </label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="confirm-password" className="text-sm font-medium">
                  <Trans>Confirm New Password</Trans>
                </label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-sm rounded-lg hover:bg-gray-100"
                onClick={() => setIsChangePasswordOpen(false)}
              >
                <Trans>Cancel</Trans>
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Trans>Save Changes</Trans>
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </nav>
  );
} 