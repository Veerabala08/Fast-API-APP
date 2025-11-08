import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react"; // ✅ using lucide-react
import { THEMES, type ThemeName } from "../themes";

interface Link {
  id: number;
  title: string;
  url: string;
}

interface ProfileData {
  full_name: string;
  links: Link[];
}

interface PublicSettings {
  theme: ThemeName;
  layout: "list" | "grid";
  show_icons: boolean;
}

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [settings, setSettings] = useState<PublicSettings>({
    theme: "ocean",
    layout: "list",
    show_icons: true,
  });

  useEffect(() => {
    if (username) {
      fetchProfile(username);
      fetchSettings(username);
    }
  }, [username]);

  /** 🔹 Fetch public user data */
  async function fetchProfile(username: string) {
    try {
      const res = await api.get(`/profile/${username}`);
      setProfile(res.data);
    } catch {
      setProfile(null);
    }
  }

  /** 🔹 Fetch user's public settings */
  async function fetchSettings(username: string) {
    try {
      const res = await api.get(`/setting/${username}`);
      setSettings(res.data);
    } catch {
      // fallback defaults if user has no settings
      setSettings({ theme: "ocean", layout: "list", show_icons: true });
    }
  }

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-gray-400 text-lg">
        Loading profile...
      </div>
    );

  const currentTheme = THEMES[settings.theme] || THEMES.ocean;

  return (
    <div
      className={`min-h-screen bg-linear-to-b ${currentTheme.bg} ${currentTheme.text} flex flex-col items-center px-4`}
    >
      {/* Profile Header */}
      <header className="text-center mt-16 w-full max-w-lg px-2">
        <img
          src={`https://api.dicebear.com/8.x/identicon/svg?seed=${username}`}
          alt="avatar"
          className="w-24 h-24 rounded-full border-2 border-white mb-4 mx-auto shadow-lg"
        />
        <h1 className="text-3xl font-bold">{profile.full_name}</h1>
        <p className="text-sm opacity-75">@{username}</p>
      </header>

      {/* Links Section */}
      <main
        className={`mt-10 w-full max-w-2xl gap-4 px-4 ${
          settings.layout === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
            : "flex flex-col"
        }`}
      >
        {profile.links.map((link) => (
          <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            className={`flex items-center justify-center gap-2 rounded-xl font-medium text-center py-3 border transition-all backdrop-blur-sm ${currentTheme.accent}`}
          >
            {settings.show_icons && (
              <ExternalLink className="w-4 h-4 opacity-80" />
            )}
            <span className="truncate">{link.title}</span>
          </motion.a>
        ))}
      </main>

      {/* Footer */}
      <footer className="mt-16 text-xs opacity-70 text-center px-4 mb-6">
        <p>
          Powered by{" "}
          <span className="font-semibold">Veerabala Linktree ✨</span>
        </p>
      </footer>
    </div>
  );
};

export default Profile;
