import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";
import { getMyLinks, addLink, updateLink, deleteLink } from "../api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import SettingsPanel from "@/components/SettingsPanel";

interface User {
  username?: string;
  full_name?: string;
  email?: string;
}

interface Link {
  id: number;
  title: string;
  url: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [form, setForm] = useState({ title: "", url: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadUser();
    loadLinks();
  }, []);

  async function loadUser() {
    try {
      const u = await getCurrentUser();
      setUser(u);
    } catch {
      setUser(null);
    }
  }

  async function loadLinks() {
    const data = await getMyLinks();
    setLinks(data);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.url) return;

    try {
      if (editingId) {
        await updateLink(editingId, form.title, form.url);
        toast.success("Link updated successfully!");
      } else {
        await addLink(form.title, form.url);
        toast.success("Link added successfully!");
      }
      setEditingId(null);
      setForm({ title: "", url: "" });
      await loadLinks();
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const handleEdit = (link: Link) => {
    setForm({ title: link.title, url: link.url });
    setEditingId(link.id);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this link?")) {
      await deleteLink(id);
      toast.success("Link deleted successfully!");
      await loadLinks();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 text-gray-100 flex flex-col">
      <Toaster richColors />

      {/* Header */}
      <header className="border-b border-gray-800 px-4 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-indigo-400">Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{user?.username || "Guest"}</span>
          <Button
            variant="secondary"
            onClick={handleLogout}
            className="bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add/Edit Link Form */}
          <Card className="bg-neutral-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg text-indigo-300">
                {editingId ? "Edit Link" : "Add New Link"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 flex-wrap"
              >
                <Input
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="bg-neutral-800 text-white flex-1"
                />
                <Input
                  placeholder="URL (https://example.com)"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="bg-neutral-800 text-white flex-1"
                />
                <Button
                  type="submit"
                  className="bg-indigo-500 hover:bg-indigo-600 transition w-full sm:w-auto"
                >
                  {editingId ? "Update" : "Add"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Links Table */}
          <Card className="bg-neutral-900 border-gray-800">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="text-lg text-indigo-300">Your Links</CardTitle>
              <Button
                onClick={() =>
                  window.open(`/profile/${user?.username}`, "_blank")
                }
                className="bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                View Public Page
              </Button>
            </CardHeader>
            <CardContent>
              {links.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No links added yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="border-b border-gray-800 text-gray-400">
                      <tr>
                        <th className="py-2 px-3">Actions</th>
                        <th className="py-2 px-3">Title</th>
                        <th className="py-2 px-3">URL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {links.map((link) => (
                        <tr
                          key={link.id}
                          className="border-b border-gray-800 hover:bg-neutral-800 transition"
                        >
                          <td className="py-2 px-3 flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-indigo-400 text-indigo-400 hover:bg-indigo-500 hover:text-white"
                              onClick={() => handleEdit(link)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(link.id)}
                            >
                              Delete
                            </Button>
                          </td>
                          <td className="py-2 px-3 text-white">{link.title}</td>
                          <td className="py-2 px-3 text-indigo-400 truncate">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="break-all"
                            >
                              {link.url}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings Panel */}
          <div className="lg:col-span-2">
            <SettingsPanel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 text-center text-sm text-white py-4 bg-gradient-to-r from-transparent via-purple-400 to-transparent">
        © {new Date().getFullYear()} Veerabala — Crafted with 💜 in Black & Indigo
      </footer>
    </div>
  );
};

export default Dashboard;
