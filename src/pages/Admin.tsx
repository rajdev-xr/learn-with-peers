import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  FileText, 
  Database, 
  AlertCircle 
} from 'lucide-react';

interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface Module {
  id: string;
  skill_id: string;
  title: string;
  resource_link: string;
  order_index: number;
  xp_reward: number;
  skill?: {
    title: string;
  };
}

const Admin = () => {
  // Skills state
  const [skills, setSkills] = useState<Skill[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [loadingModules, setLoadingModules] = useState(true);
  
  // Dialog states
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Form states
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [deletingItem, setDeletingItem] = useState<{id: string, type: 'skill' | 'module'} | null>(null);
  
  // Form fields
  const [skillTitle, setSkillTitle] = useState('');
  const [skillDescription, setSkillDescription] = useState('');
  const [skillCategory, setSkillCategory] = useState('');
  
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleSkillId, setModuleSkillId] = useState('');
  const [moduleResourceLink, setModuleResourceLink] = useState('');
  const [moduleOrderIndex, setModuleOrderIndex] = useState(1);
  const [moduleXpReward, setModuleXpReward] = useState(10);

  // Load data
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .order('title');
          
        if (error) throw error;
        setSkills(data || []);
      } catch (error) {
        console.error('Error fetching skills:', error);
        toast.error('Failed to load skills');
      } finally {
        setLoadingSkills(false);
      }
    };
    
    const fetchModules = async () => {
      try {
        const { data, error } = await supabase
          .from('modules')
          .select(`
            *,
            skill:skills(title)
          `)
          .order('title');
          
        if (error) throw error;
        setModules(data || []);
      } catch (error) {
        console.error('Error fetching modules:', error);
        toast.error('Failed to load modules');
      } finally {
        setLoadingModules(false);
      }
    };
    
    fetchSkills();
    fetchModules();
  }, []);
  
  // Handlers for skill dialog
  const openAddSkillDialog = () => {
    setEditingSkill(null);
    setSkillTitle('');
    setSkillDescription('');
    setSkillCategory('');
    setIsSkillDialogOpen(true);
  };
  
  const openEditSkillDialog = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillTitle(skill.title);
    setSkillDescription(skill.description);
    setSkillCategory(skill.category);
    setIsSkillDialogOpen(true);
  };
  
  const handleSaveSkill = async () => {
    try {
      if (!skillTitle || !skillDescription || !skillCategory) {
        toast.error('All fields are required');
        return;
      }
      
      if (editingSkill) {
        // Update existing skill
        const { error } = await supabase
          .from('skills')
          .update({
            title: skillTitle,
            description: skillDescription,
            category: skillCategory
          })
          .eq('id', editingSkill.id);
          
        if (error) throw error;
        toast.success('Skill updated successfully');
        
        // Update local state
        setSkills(skills.map(s => 
          s.id === editingSkill.id 
            ? { ...s, title: skillTitle, description: skillDescription, category: skillCategory } 
            : s
        ));
      } else {
        // Add new skill
        const { data, error } = await supabase
          .from('skills')
          .insert({
            title: skillTitle,
            description: skillDescription,
            category: skillCategory
          })
          .select();
          
        if (error) throw error;
        toast.success('Skill added successfully');
        
        // Update local state
        if (data) {
          setSkills([...skills, data[0]]);
        }
      }
      
      setIsSkillDialogOpen(false);
    } catch (error) {
      console.error('Error saving skill:', error);
      toast.error('Failed to save skill');
    }
  };
  
  // Handlers for module dialog
  const openAddModuleDialog = () => {
    setEditingModule(null);
    setModuleTitle('');
    setModuleSkillId(skills.length > 0 ? skills[0].id : '');
    setModuleResourceLink('');
    setModuleOrderIndex(1);
    setModuleXpReward(10);
    setIsModuleDialogOpen(true);
  };
  
  const openEditModuleDialog = (module: Module) => {
    setEditingModule(module);
    setModuleTitle(module.title);
    setModuleSkillId(module.skill_id);
    setModuleResourceLink(module.resource_link);
    setModuleOrderIndex(module.order_index);
    setModuleXpReward(module.xp_reward);
    setIsModuleDialogOpen(true);
  };
  
  const handleSaveModule = async () => {
    try {
      if (!moduleTitle || !moduleSkillId || !moduleResourceLink) {
        toast.error('Required fields are missing');
        return;
      }
      
      if (editingModule) {
        // Update existing module
        const { error } = await supabase
          .from('modules')
          .update({
            title: moduleTitle,
            skill_id: moduleSkillId,
            resource_link: moduleResourceLink,
            order_index: moduleOrderIndex,
            xp_reward: moduleXpReward
          })
          .eq('id', editingModule.id);
          
        if (error) throw error;
        toast.success('Module updated successfully');
        
        // Refetch modules to get updated data with skill title
        const { data, error: fetchError } = await supabase
          .from('modules')
          .select(`
            *,
            skill:skills(title)
          `)
          .order('title');
          
        if (fetchError) throw fetchError;
        setModules(data || []);
      } else {
        // Add new module
        const { data, error } = await supabase
          .from('modules')
          .insert({
            title: moduleTitle,
            skill_id: moduleSkillId,
            resource_link: moduleResourceLink,
            order_index: moduleOrderIndex,
            xp_reward: moduleXpReward
          })
          .select();
          
        if (error) throw error;
        toast.success('Module added successfully');
        
        // Refetch modules to get updated data with skill title
        const { data: updatedModules, error: fetchError } = await supabase
          .from('modules')
          .select(`
            *,
            skill:skills(title)
          `)
          .order('title');
          
        if (fetchError) throw fetchError;
        setModules(updatedModules || []);
      }
      
      setIsModuleDialogOpen(false);
    } catch (error) {
      console.error('Error saving module:', error);
      toast.error('Failed to save module');
    }
  };
  
  // Delete handlers
  const openDeleteDialog = (id: string, type: 'skill' | 'module') => {
    setDeletingItem({ id, type });
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    try {
      if (!deletingItem) return;
      
      if (deletingItem.type === 'skill') {
        const { error } = await supabase
          .from('skills')
          .delete()
          .eq('id', deletingItem.id);
          
        if (error) throw error;
        toast.success('Skill deleted successfully');
        
        // Update local state
        setSkills(skills.filter(s => s.id !== deletingItem.id));
        
        // Also filter out modules associated with this skill
        setModules(modules.filter(m => m.skill_id !== deletingItem.id));
      } else {
        const { error } = await supabase
          .from('modules')
          .delete()
          .eq('id', deletingItem.id);
          
        if (error) throw error;
        toast.success('Module deleted successfully');
        
        // Update local state
        setModules(modules.filter(m => m.id !== deletingItem.id));
      }
      
      setIsDeleteDialogOpen(false);
      setDeletingItem(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  return (
    <AppLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage skills and learning modules
          </p>
        </div>
        
        <Tabs defaultValue="skills" className="mb-8">
          <TabsList>
            <TabsTrigger value="skills" className="flex items-center">
              <Database className="mr-2 h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="modules" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Modules
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="skills" className="pt-4">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Skills Management</h2>
              <Button onClick={openAddSkillDialog}>
                <Plus className="mr-2 h-4 w-4" /> Add Skill
              </Button>
            </div>
            
            {loadingSkills ? (
              <div className="flex justify-center items-center h-40">
                <Loader className="w-8 h-8" />
              </div>
            ) : skills.length === 0 ? (
              <div className="text-center py-10 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground mb-2">No skills found.</p>
                <Button onClick={openAddSkillDialog} variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Skill
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {skills.map((skill) => (
                      <TableRow key={skill.id}>
                        <TableCell className="font-medium">{skill.title}</TableCell>
                        <TableCell>{skill.category}</TableCell>
                        <TableCell className="max-w-xs truncate">{skill.description}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditSkillDialog(skill)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive/90"
                              onClick={() => openDeleteDialog(skill.id, 'skill')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="modules" className="pt-4">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Modules Management</h2>
              <Button onClick={openAddModuleDialog} disabled={skills.length === 0}>
                <Plus className="mr-2 h-4 w-4" /> Add Module
              </Button>
            </div>
            
            {loadingModules ? (
              <div className="flex justify-center items-center h-40">
                <Loader className="w-8 h-8" />
              </div>
            ) : skills.length === 0 ? (
              <div className="text-center py-10 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground mb-2">You need to create skills first before adding modules.</p>
                <Button 
                  onClick={() => {
                    const skillsTab = document.querySelector('[value="skills"]') as HTMLElement;
                    skillsTab?.click();
                  }} 
                  variant="outline"
                >
                  Go to Skills Tab
                </Button>
              </div>
            ) : modules.length === 0 ? (
              <div className="text-center py-10 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground mb-2">No modules found.</p>
                <Button onClick={openAddModuleDialog} variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Module
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Skill</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>XP</TableHead>
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modules.map((module) => (
                      <TableRow key={module.id}>
                        <TableCell className="font-medium">{module.title}</TableCell>
                        <TableCell>{module.skill?.title}</TableCell>
                        <TableCell>{module.order_index}</TableCell>
                        <TableCell>{module.xp_reward}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModuleDialog(module)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive/90"
                              onClick={() => openDeleteDialog(module.id, 'module')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Skill Dialog */}
        <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
              <DialogDescription>
                {editingSkill 
                  ? 'Update the details for this skill.' 
                  : 'Fill in the details to create a new skill.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input 
                  id="title" 
                  value={skillTitle} 
                  onChange={(e) => setSkillTitle(e.target.value)} 
                  className="col-span-3" 
                  placeholder="e.g. JavaScript Fundamentals"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Input 
                  id="category" 
                  value={skillCategory} 
                  onChange={(e) => setSkillCategory(e.target.value)} 
                  className="col-span-3"
                  placeholder="e.g. Programming, Design, etc."
                />
              </div>
              
              <div className="grid grid-cols-4 items-top gap-4">
                <Label htmlFor="description" className="text-right pt-2">Description</Label>
                <textarea 
                  id="description" 
                  value={skillDescription} 
                  onChange={(e) => setSkillDescription(e.target.value)} 
                  className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Describe what learners will gain from this skill"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSkillDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSkill}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Module Dialog */}
        <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingModule ? 'Edit Module' : 'Add New Module'}</DialogTitle>
              <DialogDescription>
                {editingModule 
                  ? 'Update the details for this module.' 
                  : 'Fill in the details to create a new learning module.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="module-title" className="text-right">Title</Label>
                <Input 
                  id="module-title" 
                  value={moduleTitle} 
                  onChange={(e) => setModuleTitle(e.target.value)} 
                  className="col-span-3" 
                  placeholder="e.g. Introduction to Variables"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="skill-id" className="text-right">Skill</Label>
                <select
                  id="skill-id"
                  value={moduleSkillId}
                  onChange={(e) => setModuleSkillId(e.target.value)}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {skills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="resource-link" className="text-right">Resource URL</Label>
                <Input 
                  id="resource-link" 
                  value={moduleResourceLink} 
                  onChange={(e) => setModuleResourceLink(e.target.value)} 
                  className="col-span-3" 
                  placeholder="https://..."
                  type="url"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="order-index" className="text-right">Order</Label>
                <Input 
                  id="order-index" 
                  value={moduleOrderIndex} 
                  onChange={(e) => setModuleOrderIndex(parseInt(e.target.value) || 1)} 
                  className="col-span-3" 
                  type="number"
                  min="1"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="xp-reward" className="text-right">XP Reward</Label>
                <Input 
                  id="xp-reward" 
                  value={moduleXpReward} 
                  onChange={(e) => setModuleXpReward(parseInt(e.target.value) || 10)} 
                  className="col-span-3" 
                  type="number"
                  min="5"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModuleDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveModule}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Confirm Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Confirm Deletion
              </DialogTitle>
              <DialogDescription>
                {deletingItem?.type === 'skill'
                  ? 'Are you sure you want to delete this skill? This will also delete all modules associated with this skill and all learner progress data. This action cannot be undone.'
                  : 'Are you sure you want to delete this module? This will also delete all learner progress data for this module. This action cannot be undone.'}
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Admin;
