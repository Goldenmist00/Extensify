'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Plus,
  Folder,
  Edit,
  Trash2,
  Play,
  Download,
  Clock,
  CheckCircle,
  Search,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  version: number;
  blocks: any[];
  settings: any;
}

interface ProjectManagerProps {
  onProjectSelect: (project: Project) => void;
  onNewProject: () => void;
  onCreateAndEdit: (project: Project) => void;
}

export default function ProjectManager({
  onProjectSelect,
  onNewProject,
  onCreateAndEdit,
}: ProjectManagerProps) {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingProjectName, setEditingProjectName] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Fetch user's projects
  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        const projectsData = data.projects || [];
        setProjects(projectsData);
        setFilteredProjects(projectsData);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter projects based on search query
  const filterProjects = (query: string) => {
    if (!query.trim()) {
      setFilteredProjects(projects);
      return;
    }

    const filtered = projects.filter(project =>
      project.name.toLowerCase().includes(query.toLowerCase()) ||
      project.description.toLowerCase().includes(query.toLowerCase()) ||
      project.status.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterProjects(query);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredProjects(projects);
  };

  useEffect(() => {
    if (session?.user) {
      fetchProjects();
    }
  }, [session]);

  // Create new project
  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    setCreating(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDescription,
          blocks: [],
          settings: {},
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newProject = data.project;
        const updatedProjects = [newProject, ...projects];
        setProjects(updatedProjects);
        setFilteredProjects(updatedProjects);
        setShowCreateDialog(false);
        setNewProjectName('');
        setNewProjectDescription('');
        onCreateAndEdit(newProject);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setCreating(false);
    }
  };

  // Show delete confirmation dialog
  const showDeleteConfirmation = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteDialog(true);
  };

  // Delete project
  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      const response = await fetch(`/api/projects/${projectToDelete._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedProjects = projects.filter(p => p._id !== projectToDelete._id);
        setProjects(updatedProjects);
        setFilteredProjects(updatedProjects);
        setShowDeleteDialog(false);
        setProjectToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setProjectToDelete(null);
  };

  // Handle keyboard events for delete dialog
  const handleDeleteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleDeleteProject();
    } else if (e.key === 'Escape') {
      cancelDelete();
    }
  };

  // Start editing project name
  const startEditingName = (project: Project) => {
    setEditingProjectId(project._id);
    setEditingProjectName(project.name);
  };

  // Save project name
  const saveProjectName = async (projectId: string) => {
    if (!editingProjectName.trim()) return;

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingProjectName.trim(),
        }),
      });

      if (response.ok) {
        const updatedProjects = projects.map(p =>
          p._id === projectId ? { ...p, name: editingProjectName.trim() } : p
        );
        setProjects(updatedProjects);
        setFilteredProjects(updatedProjects);
      }
    } catch (error) {
      console.error('Error updating project name:', error);
    } finally {
      setEditingProjectId(null);
      setEditingProjectName('');
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingProjectId(null);
    setEditingProjectName('');
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-pulse-gentle">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading your projects</h3>
          <p className="text-gray-500 dark:text-gray-400">This won't take long...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="mb-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
              My Projects
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Create and manage your Chrome extensions
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white px-6 py-3 text-lg font-semibold hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/25 animate-fade-in-up animation-delay-200">
                <Plus className="w-5 h-5 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Create New Project
                </DialogTitle>
                <DialogDescription className="text-base text-gray-600 dark:text-gray-400">
                  Start building your next amazing Chrome extension
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="project-name" className="text-base font-medium">Project Name</Label>
                  <Input
                    id="project-name"
                    value={newProjectName}
                    onChange={e => setNewProjectName(e.target.value)}
                    placeholder="My Awesome Extension"
                    className="py-3 text-base border-2 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-description" className="text-base font-medium">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="project-description"
                    value={newProjectDescription}
                    onChange={e => setNewProjectDescription(e.target.value)}
                    placeholder="What does your extension do?"
                    rows={3}
                    className="text-base border-2 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-300"
                  />
                </div>
                <Button
                  onClick={handleCreateProject}
                  disabled={!newProjectName.trim() || creating}
                  className="w-full py-3 text-base font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white hover:scale-105 transition-all duration-300 hover:shadow-lg"
                >
                  {creating ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Project...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Plus className="w-5 h-5" />
                      <span>Create Project</span>
                    </div>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Search Bar */}
        {projects.length > 0 && (
          <div className="animate-fade-in-up animation-delay-300">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-10 py-3 text-base border-2 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform duration-200"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Found {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} matching "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-20 animate-fade-in-up">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl flex items-center justify-center animate-pulse-gentle">
              <Folder className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No projects yet
            </h3>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              Create your first Chrome extension to get started on your journey
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg font-semibold hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/25"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Project
            </Button>
          </div>
        </div>
      ) : filteredProjects.length === 0 && searchQuery ? (
        <div className="text-center py-20 animate-fade-in-up">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl flex items-center justify-center animate-pulse-gentle">
              <Search className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No projects found
            </h3>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              No projects match your search for "{searchQuery}"
            </p>
            <Button
              onClick={clearSearch}
              variant="outline"
              className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300"
            >
              Clear Search
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <Card
              key={project._id}
              className={`group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 border-slate-200 dark:border-slate-700 hover:scale-105 hover:-translate-y-2 animate-fade-in-up backdrop-blur-sm bg-white/80 dark:bg-slate-900/80`}
              style={{animationDelay: `${index * 100}ms`}}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {editingProjectId === project._id ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          value={editingProjectName}
                          onChange={e => setEditingProjectName(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              saveProjectName(project._id);
                            } else if (e.key === 'Escape') {
                              cancelEditing();
                            }
                          }}
                          className="text-xl font-bold h-10 px-3 border-2 border-indigo-300 focus:border-indigo-500"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => saveProjectName(project._id)}
                          className="h-10 px-3 bg-green-500 hover:bg-green-600 text-white"
                        >
                          ✓
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEditing}
                          className="h-10 px-3 border-gray-300 hover:bg-gray-50"
                        >
                          ✕
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <CardTitle
                          className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer hover:scale-105 transition-transform duration-200"
                          onClick={() => startEditingName(project)}
                          title="Click to edit name"
                        >
                          {project.name}
                        </CardTitle>
                        <CardDescription className="mt-2 text-base text-gray-600 dark:text-gray-400">
                          {project.description || 'No description provided'}
                        </CardDescription>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onProjectSelect(project)}
                      className="h-10 w-10 p-0 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:scale-110 transition-all duration-200"
                      title="Edit project"
                    >
                      <Edit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => showDeleteConfirmation(project)}
                      className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 hover:scale-110 transition-all duration-200"
                      title="Delete project"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Status and Version */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {project.status === 'published' ? (
                      <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-300 capitalize">Published</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                        <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300 capitalize">Draft</span>
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">v{project.version}</span>
                  </div>
                </div>

                {/* Project Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{project.blocks?.length || 0}</div>
                    <div className="text-xs text-blue-600/70 dark:text-blue-400/70 font-medium">Blocks</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatDate(project.updatedAt)}</div>
                    <div className="text-xs text-purple-600/70 dark:text-purple-400/70 font-medium">Updated</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onProjectSelect(project)}
                    className="flex-1 py-2 border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300 group"
                  >
                    <Edit className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 py-2 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300 group"
                    disabled
                  >
                    <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Enhanced Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md" onKeyDown={handleDeleteKeyDown}>
          <DialogHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
              Delete Project
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 dark:text-gray-400">
              Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">"{projectToDelete?.name}"</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={cancelDelete}
              className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteProject}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white hover:scale-105 transition-all duration-300 hover:shadow-lg"
            >
              Delete Project
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}