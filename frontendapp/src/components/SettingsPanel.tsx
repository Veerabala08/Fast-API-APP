import React, { useEffect, useState } from "react";
import { getMySettings, updateSettings } from "../api/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { THEMES, type ThemeName } from "../themes";
import { toast, Toaster } from "sonner";

interface Settings {
  id: number;
  user_id: number;
  theme: ThemeName;
  layout: "list" | "grid";
  show_icons: boolean;
}

const SettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getMySettings();
      setSettings(data);
    } catch {
      toast.error("Failed to load settings");
    }
  };

  const handleThemeChange = async (theme: ThemeName) => {
    if (!settings) return;
    try {
      setLoading(true);
      const updated = await updateSettings({ theme });
      setSettings(updated);
      toast.success(`Theme updated to ${theme}`);
    } catch {
      toast.error("Failed to update theme");
    } finally {
      setLoading(false);
    }
  };

  const handleLayoutChange = async (layout: "list" | "grid") => {
    if (!settings) return;
    try {
      const updated = await updateSettings({ layout });
      setSettings(updated);
      toast.success(`Layout changed to ${layout}`);
    } catch {
      toast.error("Failed to update layout");
    }
  };

  const handleIconToggle = async (value: boolean) => {
    if (!settings) return;
    try {
      const updated = await updateSettings({ show_icons: value });
      setSettings(updated);
      toast.success(`Icons ${value ? "enabled" : "disabled"}`);
    } catch {
      toast.error("Failed to update icons");
    }
  };

  if (!settings) return <div className="text-gray-400">Loading settings...</div>;

  return (
    <Card className="bg-neutral-900 border-gray-800 text-gray-100">
      <Toaster richColors />
      <CardHeader>
        <CardTitle className="text-indigo-400">Profile Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        
        {/* Theme selection */}
        <div>
          <Label className="text-sm font-medium text-gray-300 mb-2 block">
            Theme
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(THEMES).map(([key, value]) => (
              <button
                key={key}
                disabled={loading}
                onClick={() => handleThemeChange(key as ThemeName)}
                className={`h-20 rounded-xl border-2 ${
                  settings.theme === key
                    ? "border-indigo-400 ring-2 ring-indigo-500"
                    : "border-gray-700 hover:border-indigo-400"
                } ${value.preview} transition`}
              >
                <div className="text-sm font-medium mt-6">{value.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Layout selection */}
        <div>
          <Label className="text-sm font-medium text-gray-300 mb-2 block">
            Layout
          </Label>
          <div className="flex gap-4">
            <Button
              variant={settings.layout === "list" ? "default" : "outline"}
              onClick={() => handleLayoutChange("list")}
              className="bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              List View
            </Button>
            <Button
              variant={settings.layout === "grid" ? "default" : "outline"}
              onClick={() => handleLayoutChange("grid")}
              className="bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              Grid View
            </Button>
          </div>
        </div>

        {/* Icon toggle */}
        <div className="flex items-center gap-3">
          <Switch
            checked={settings.show_icons}
            onCheckedChange={handleIconToggle}
            id="show-icons"
          />
          <Label htmlFor="show-icons" className="text-sm text-gray-300">
            Show Icons on Public Profile
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsPanel;
