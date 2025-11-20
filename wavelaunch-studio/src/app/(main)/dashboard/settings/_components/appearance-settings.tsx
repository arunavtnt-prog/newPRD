"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Moon, Sun, Monitor } from "lucide-react";

export function AppearanceSettings() {
  const handleThemeChange = (theme: string) => {
    toast.success(`Theme set to ${theme}`);
    // Theme switching logic would go here
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize how the application looks and feels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Theme</Label>
          <RadioGroup defaultValue="light" onValueChange={handleThemeChange}>
            <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light" className="flex items-center gap-3 cursor-pointer flex-1">
                <Sun className="h-5 w-5" />
                <div>
                  <div className="font-medium">Light</div>
                  <div className="text-sm text-muted-foreground">
                    Bright and clean interface
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark" className="flex items-center gap-3 cursor-pointer flex-1">
                <Moon className="h-5 w-5" />
                <div>
                  <div className="font-medium">Dark</div>
                  <div className="text-sm text-muted-foreground">
                    Easy on the eyes in low light
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system" className="flex items-center gap-3 cursor-pointer flex-1">
                <Monitor className="h-5 w-5" />
                <div>
                  <div className="font-medium">System</div>
                  <div className="text-sm text-muted-foreground">
                    Adapts to your system settings
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
