"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Bell, Shield, Palette } from "lucide-react";
import { ProfileSettings } from "./profile-settings";
import { NotificationSettings } from "./notification-settings";
import { SecuritySettings } from "./security-settings";
import { AppearanceSettings } from "./appearance-settings";

interface SettingsContainerProps {
  user: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
    role: string;
    department: string | null;
    jobTitle: string | null;
    phoneNumber: string | null;
    skills: string | null;
    isActive: boolean;
    createdAt: Date;
  };
}

export function SettingsContainer({ user }: SettingsContainerProps) {
  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Profile</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Notifications</span>
        </TabsTrigger>
        <TabsTrigger value="appearance" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Appearance</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Security</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <ProfileSettings user={user} />
      </TabsContent>

      <TabsContent value="notifications">
        <NotificationSettings userId={user.id} />
      </TabsContent>

      <TabsContent value="appearance">
        <AppearanceSettings />
      </TabsContent>

      <TabsContent value="security">
        <SecuritySettings userId={user.id} />
      </TabsContent>
    </Tabs>
  );
}
