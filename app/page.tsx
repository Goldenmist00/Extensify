'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  User,
  Download,
  Play,
  Eye,
  Code,
  Zap,
  MousePointer,
  Palette,
  Type,
  ImageIcon,
  Settings,
  Moon,
  Sun,
  Mail,
  Lock,
  Chrome,
  ArrowRight,
  
  Globe,
  MousePointer2,
  Send,
  Keyboard,
  Scroll,
  Clock,
  Timer,
  Paintbrush,
  EyeOff,
  FileText,
  ArrowDown,
  Bell,
  MessageSquare,
  ExternalLink,
  RefreshCw,
  ArrowLeft,
  Copy,
  Save,
  FolderOpen,
  Network,
  FileJson,
  ZoomIn,
  ZoomOut,
  Grid as GridIcon,
  Magnet,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Sparkles,
  Rocket,
  Puzzle,
  
  PlayCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import ClientProvider from '@/components/ClientProvider';
import ProjectManager from '@/components/ProjectManager';
import LandingPage from '@/components/LandingPage';

type View = 'dashboard' | 'templates' | 'builder' | 'preview' | 'export';

type Block = {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  category: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  darkColor: string;
  gradient: string;
  darkGradient: string;
  config?: BlockConfig;
};

type BlockConfig = {
  [key: string]: any;
};

type CanvasBlock = Block & {
  instanceId: string;
  config: BlockConfig;
  position: { x: number; y: number };
  connections: string[]; // Array of instanceIds this block connects to
};

type Project = {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  status: 'draft' | 'published';
};

type TemplateBlock = {
  key: string;
  id: string; // references availableBlocks id
  type: 'trigger' | 'action' | 'condition';
  config?: Record<string, any>;
  connectTo?: string[]; // keys of next blocks
};

type ExtensionTemplate = {
  key: string;
  name: string;
  description: string;
  blocks: TemplateBlock[];
};

const availableBlocks: Block[] = [
  // ===== TRIGGERS =====
  {
    id: 'page-load',
    type: 'trigger',
    category: 'Page Events',
    title: 'On Page Load',
    description: 'Trigger when a page loads',
    icon: Zap,
    color: 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-700',
    darkColor:
      'dark:from-yellow-900/40 dark:to-yellow-800/40 dark:text-yellow-300',
    gradient: 'bg-gradient-to-br from-yellow-50 to-orange-50',
    darkGradient: 'dark:from-yellow-900/20 dark:to-orange-900/20',
  },
  {
    id: 'url-change',
    type: 'trigger',
    category: 'Page Events',
    title: 'On URL Change',
    description: 'Trigger when URL changes',
    icon: Globe,
    color: 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-700',
    darkColor:
      'dark:from-yellow-900/40 dark:to-yellow-800/40 dark:text-yellow-300',
    gradient: 'bg-gradient-to-br from-yellow-50 to-orange-50',
    darkGradient: 'dark:from-yellow-900/20 dark:to-orange-900/20',
  },
  {
    id: 'click-element',
    type: 'trigger',
    category: 'User Interactions',
    title: 'On Element Click',
    description: 'Trigger when element is clicked',
    icon: MousePointer,
    color: 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700',
    darkColor: 'dark:from-blue-900/40 dark:to-blue-800/40 dark:text-blue-300',
    gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    darkGradient: 'dark:from-blue-900/20 dark:to-cyan-900/20',
  },
  {
    id: 'hover-element',
    type: 'trigger',
    category: 'User Interactions',
    title: 'On Element Hover',
    description: 'Trigger when hovering over element',
    icon: MousePointer2,
    color: 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700',
    darkColor: 'dark:from-blue-900/40 dark:to-blue-800/40 dark:text-blue-300',
    gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    darkGradient: 'dark:from-blue-900/20 dark:to-cyan-900/20',
  },
  {
    id: 'form-submit',
    type: 'trigger',
    category: 'User Interactions',
    title: 'On Form Submit',
    description: 'Trigger when form is submitted',
    icon: Send,
    color: 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700',
    darkColor: 'dark:from-blue-900/40 dark:to-blue-800/40 dark:text-blue-300',
    gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    darkGradient: 'dark:from-blue-900/20 dark:to-cyan-900/20',
  },
  {
    id: 'keyboard-shortcut',
    type: 'trigger',
    category: 'User Interactions',
    title: 'On Keyboard Shortcut',
    description: 'Trigger on specific key combination',
    icon: Keyboard,
    color: 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700',
    darkColor: 'dark:from-blue-900/40 dark:to-blue-800/40 dark:text-blue-300',
    gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    darkGradient: 'dark:from-blue-900/20 dark:to-cyan-900/20',
  },
  {
    id: 'scroll-event',
    type: 'trigger',
    category: 'User Interactions',
    title: 'On Scroll',
    description: 'Trigger when page is scrolled',
    icon: Scroll,
    color: 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700',
    darkColor: 'dark:from-blue-900/40 dark:to-blue-800/40 dark:text-blue-300',
    gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    darkGradient: 'dark:from-blue-900/20 dark:to-cyan-900/20',
  },
  {
    id: 'timer',
    type: 'trigger',
    category: 'Timers',
    title: 'Timer',
    description: 'Trigger after specified time',
    icon: Clock,
    color: 'bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700',
    darkColor:
      'dark:from-indigo-900/40 dark:to-indigo-800/40 dark:text-indigo-300',
    gradient: 'bg-gradient-to-br from-indigo-50 to-purple-50',
    darkGradient: 'dark:from-indigo-900/20 dark:to-purple-900/20',
  },
  {
    id: 'interval',
    type: 'trigger',
    category: 'Timers',
    title: 'Interval',
    description: 'Trigger repeatedly at intervals',
    icon: Timer,
    color: 'bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700',
    darkColor:
      'dark:from-indigo-900/40 dark:to-indigo-800/40 dark:text-indigo-300',
    gradient: 'bg-gradient-to-br from-indigo-50 to-purple-50',
    darkGradient: 'dark:from-indigo-900/20 dark:to-purple-900/20',
  },

  // ===== ACTIONS =====
  {
    id: 'inject-text',
    type: 'action',
    category: 'Content Injection',
    title: 'Inject Text',
    description: 'Add text to the page',
    icon: Type,
    color: 'bg-gradient-to-br from-green-100 to-green-200 text-green-700',
    darkColor:
      'dark:from-green-900/40 dark:to-green-800/40 dark:text-green-300',
    gradient: 'bg-gradient-to-br from-green-50 to-emerald-50',
    darkGradient: 'dark:from-green-900/20 dark:to-emerald-900/20',
  },
  {
    id: 'inject-image',
    type: 'action',
    category: 'Content Injection',
    title: 'Inject Image',
    description: 'Add image to the page',
    icon: ImageIcon,
    color: 'bg-gradient-to-br from-green-100 to-green-200 text-green-700',
    darkColor:
      'dark:from-green-900/40 dark:to-green-800/40 dark:text-green-300',
    gradient: 'bg-gradient-to-br from-green-50 to-emerald-50',
    darkGradient: 'dark:from-green-900/20 dark:to-emerald-900/20',
  },
  {
    id: 'inject-html',
    type: 'action',
    category: 'Content Injection',
    title: 'Inject HTML',
    description: 'Add custom HTML to the page',
    icon: Code,
    color: 'bg-gradient-to-br from-green-100 to-green-200 text-green-700',
    darkColor:
      'dark:from-green-900/40 dark:to-green-800/40 dark:text-green-300',
    gradient: 'bg-gradient-to-br from-green-50 to-emerald-50',
    darkGradient: 'dark:from-green-900/20 dark:to-emerald-900/20',
  },
  {
    id: 'inject-css',
    type: 'action',
    category: 'Content Injection',
    title: 'Inject CSS',
    description: 'Add custom styles to the page',
    icon: Paintbrush,
    color: 'bg-gradient-to-br from-green-100 to-green-200 text-green-700',
    darkColor:
      'dark:from-green-900/40 dark:to-green-800/40 dark:text-green-300',
    gradient: 'bg-gradient-to-br from-green-50 to-emerald-50',
    darkGradient: 'dark:from-green-900/20 dark:to-emerald-900/20',
  },
  {
    id: 'change-background',
    type: 'action',
    category: 'Style Modifications',
    title: 'Change Background',
    description: 'Modify background color',
    icon: Palette,
    color: 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700',
    darkColor:
      'dark:from-purple-900/40 dark:to-purple-800/40 dark:text-purple-300',
    gradient: 'bg-gradient-to-br from-purple-50 to-pink-50',
    darkGradient: 'dark:from-purple-900/20 dark:to-pink-900/20',
  },
  {
    id: 'change-text-color',
    type: 'action',
    category: 'Style Modifications',
    title: 'Change Text Color',
    description: 'Modify text color',
    icon: Type,
    color: 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700',
    darkColor:
      'dark:from-purple-900/40 dark:to-purple-800/40 dark:text-purple-300',
    gradient: 'bg-gradient-to-br from-purple-50 to-pink-50',
    darkGradient: 'dark:from-purple-900/20 dark:to-pink-900/20',
  },
  {
    id: 'hide-element',
    type: 'action',
    category: 'Style Modifications',
    title: 'Hide Element',
    description: 'Hide elements from the page',
    icon: EyeOff,
    color: 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700',
    darkColor:
      'dark:from-purple-900/40 dark:to-purple-800/40 dark:text-purple-300',
    gradient: 'bg-gradient-to-br from-purple-50 to-pink-50',
    darkGradient: 'dark:from-purple-900/20 dark:to-pink-900/20',
  },
  {
    id: 'show-element',
    type: 'action',
    category: 'Style Modifications',
    title: 'Show Element',
    description: 'Show hidden elements',
    icon: Eye,
    color: 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700',
    darkColor:
      'dark:from-purple-900/40 dark:to-purple-800/40 dark:text-purple-300',
    gradient: 'bg-gradient-to-br from-purple-50 to-pink-50',
    darkGradient: 'dark:from-purple-900/20 dark:to-pink-900/20',
  },
  {
    id: 'click-element',
    type: 'action',
    category: 'Element Actions',
    title: 'Click Element',
    description: 'Programmatically click an element',
    icon: MousePointer,
    color: 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700',
    darkColor:
      'dark:from-orange-900/40 dark:to-orange-800/40 dark:text-orange-300',
    gradient: 'bg-gradient-to-br from-orange-50 to-red-50',
    darkGradient: 'dark:from-orange-900/20 dark:to-red-900/20',
  },
  {
    id: 'fill-form',
    type: 'action',
    category: 'Element Actions',
    title: 'Fill Form',
    description: 'Automatically fill form fields',
    icon: FileText,
    color: 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700',
    darkColor:
      'dark:from-orange-900/40 dark:to-orange-800/40 dark:text-orange-300',
    gradient: 'bg-gradient-to-br from-orange-50 to-red-50',
    darkGradient: 'dark:from-orange-900/20 dark:to-red-900/20',
  },
  {
    id: 'submit-form',
    type: 'action',
    category: 'Element Actions',
    title: 'Submit Form',
    description: 'Automatically submit a form',
    icon: Send,
    color: 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700',
    darkColor:
      'dark:from-orange-900/40 dark:to-orange-800/40 dark:text-orange-300',
    gradient: 'bg-gradient-to-br from-orange-50 to-red-50',
    darkGradient: 'dark:from-orange-900/20 dark:to-red-900/20',
  },
  {
    id: 'scroll-to',
    type: 'action',
    category: 'Element Actions',
    title: 'Scroll To Element',
    description: 'Scroll to a specific element',
    icon: ArrowDown,
    color: 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700',
    darkColor:
      'dark:from-orange-900/40 dark:to-orange-800/40 dark:text-orange-300',
    gradient: 'bg-gradient-to-br from-orange-50 to-red-50',
    darkGradient: 'dark:from-orange-900/20 dark:to-red-900/20',
  },
  {
    id: 'show-notification',
    type: 'action',
    category: 'Notifications',
    title: 'Show Notification',
    description: 'Display a browser notification',
    icon: Bell,
    color: 'bg-gradient-to-br from-pink-100 to-pink-200 text-pink-700',
    darkColor: 'dark:from-pink-900/40 dark:to-pink-800/40 dark:text-pink-300',
    gradient: 'bg-gradient-to-br from-pink-50 to-rose-50',
    darkGradient: 'dark:from-pink-900/20 dark:to-rose-900/20',
  },
  {
    id: 'show-toast',
    type: 'action',
    category: 'Notifications',
    title: 'Show Toast',
    description: 'Display a toast message on page',
    icon: MessageSquare,
    color: 'bg-gradient-to-br from-pink-100 to-pink-200 text-pink-700',
    darkColor: 'dark:from-pink-900/40 dark:to-pink-800/40 dark:text-pink-300',
    gradient: 'bg-gradient-to-br from-pink-50 to-rose-50',
    darkGradient: 'dark:from-pink-900/20 dark:to-rose-900/20',
  },
  {
    id: 'open-url',
    type: 'action',
    category: 'Navigation',
    title: 'Open URL',
    description: 'Navigate to a new URL',
    icon: ExternalLink,
    color: 'bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-700',
    darkColor: 'dark:from-cyan-900/40 dark:to-cyan-800/40 dark:text-cyan-300',
    gradient: 'bg-gradient-to-br from-cyan-50 to-blue-50',
    darkGradient: 'dark:from-cyan-900/20 dark:to-blue-900/20',
  },
  {
    id: 'reload-page',
    type: 'action',
    category: 'Navigation',
    title: 'Reload Page',
    description: 'Refresh the current page',
    icon: RefreshCw,
    color: 'bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-700',
    darkColor: 'dark:from-cyan-900/40 dark:to-cyan-800/40 dark:text-cyan-300',
    gradient: 'bg-gradient-to-br from-cyan-50 to-blue-50',
    darkGradient: 'dark:from-cyan-900/20 dark:to-blue-900/20',
  },
  {
    id: 'go-back',
    type: 'action',
    category: 'Navigation',
    title: 'Go Back',
    description: 'Navigate to previous page',
    icon: ArrowLeft,
    color: 'bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-700',
    darkColor: 'dark:from-cyan-900/40 dark:to-cyan-800/40 dark:text-cyan-300',
    gradient: 'bg-gradient-to-br from-cyan-50 to-blue-50',
    darkGradient: 'dark:from-cyan-900/20 dark:to-blue-900/20',
  },
  {
    id: 'go-forward',
    type: 'action',
    category: 'Navigation',
    title: 'Go Forward',
    description: 'Navigate to next page',
    icon: ArrowRight,
    color: 'bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-700',
    darkColor: 'dark:from-cyan-900/40 dark:to-cyan-800/40 dark:text-cyan-300',
    gradient: 'bg-gradient-to-br from-cyan-50 to-blue-50',
    darkGradient: 'dark:from-cyan-900/20 dark:to-blue-900/20',
  },
  {
    id: 'copy-to-clipboard',
    type: 'action',
    category: 'Data Operations',
    title: 'Copy to Clipboard',
    description: 'Copy text to clipboard',
    icon: Copy,
    color: 'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700',
    darkColor:
      'dark:from-emerald-900/40 dark:to-emerald-800/40 dark:text-emerald-300',
    gradient: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    darkGradient: 'dark:from-emerald-900/20 dark:to-teal-900/20',
  },
  {
    id: 'save-data',
    type: 'action',
    category: 'Data Operations',
    title: 'Save Data',
    description: 'Save data to storage',
    icon: Save,
    color: 'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700',
    darkColor:
      'dark:from-emerald-900/40 dark:to-emerald-800/40 dark:text-emerald-300',
    gradient: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    darkGradient: 'dark:from-emerald-900/20 dark:to-teal-900/20',
  },
  {
    id: 'load-data',
    type: 'action',
    category: 'Data Operations',
    title: 'Load Data',
    description: 'Load data from storage',
    icon: FolderOpen,
    color: 'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700',
    darkColor:
      'dark:from-emerald-900/40 dark:to-emerald-800/40 dark:text-emerald-300',
    gradient: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    darkGradient: 'dark:from-emerald-900/20 dark:to-teal-900/20',
  },
  {
    id: 'make-request',
    type: 'action',
    category: 'API Operations',
    title: 'Make API Request',
    description: 'Send HTTP request to API',
    icon: Network,
    color: 'bg-gradient-to-br from-violet-100 to-violet-200 text-violet-700',
    darkColor:
      'dark:from-violet-900/40 dark:to-violet-800/40 dark:text-violet-300',
    gradient: 'bg-gradient-to-br from-violet-50 to-purple-50',
    darkGradient: 'dark:from-violet-900/20 dark:to-purple-900/20',
  },
  {
    id: 'parse-json',
    type: 'action',
    category: 'API Operations',
    title: 'Parse JSON',
    description: 'Parse JSON response data',
    icon: FileJson,
    color: 'bg-gradient-to-br from-violet-100 to-violet-200 text-violet-700',
    darkColor:
      'dark:from-violet-900/40 dark:to-violet-800/40 dark:text-violet-300',
    gradient: 'bg-gradient-to-br from-violet-50 to-purple-50',
    darkGradient: 'dark:from-violet-900/20 dark:to-purple-900/20',
  },

  // ===== CONDITION BLOCKS =====
  {
    id: 'if-condition',
    type: 'condition',
    category: 'Logic & Control',
    title: 'If Condition',
    description: 'Execute different paths based on condition',
    icon: Network,
    color: 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700',
    darkColor:
      'dark:from-amber-900/40 dark:to-amber-800/40 dark:text-amber-300',
    gradient: 'bg-gradient-to-br from-amber-50 to-orange-50',
    darkGradient: 'dark:from-amber-900/20 dark:to-orange-900/20',
  },
  {
    id: 'switch-case',
    type: 'condition',
    category: 'Logic & Control',
    title: 'Switch Case',
    description: 'Multiple conditional paths',
    icon: Network,
    color: 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700',
    darkColor:
      'dark:from-amber-900/40 dark:to-amber-800/40 dark:text-amber-300',
    gradient: 'bg-gradient-to-br from-amber-50 to-orange-50',
    darkGradient: 'dark:from-amber-900/20 dark:to-orange-900/20',
  },
  {
    id: 'loop',
    type: 'condition',
    category: 'Logic & Control',
    title: 'Loop',
    description: 'Repeat actions multiple times',
    icon: RefreshCw,
    color: 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700',
    darkColor:
      'dark:from-amber-900/40 dark:to-amber-800/40 dark:text-amber-300',
    gradient: 'bg-gradient-to-br from-amber-50 to-orange-50',
    darkGradient: 'dark:from-amber-900/20 dark:to-orange-900/20',
  },

  // ===== AI & AUTOMATION BLOCKS =====
  {
    id: 'ai-processor',
    type: 'action',
    category: 'AI & Automation',
    title: 'AI Processor',
    description: 'Process data with AI models',
    icon: Sparkles,
    color: 'bg-gradient-to-br from-pink-100 to-pink-200 text-pink-700',
    darkColor:
      'dark:from-pink-900/40 dark:to-pink-800/40 dark:text-pink-300',
    gradient: 'bg-gradient-to-br from-pink-50 to-rose-50',
    darkGradient: 'dark:from-pink-900/20 dark:to-rose-900/20',
  },
  {
    id: 'webhook',
    type: 'action',
    category: 'AI & Automation',
    title: 'Webhook',
    description: 'Send data to external services',
    icon: Network,
    color: 'bg-gradient-to-br from-pink-100 to-pink-200 text-pink-700',
    darkColor:
      'dark:from-pink-900/40 dark:to-pink-800/40 dark:text-pink-300',
    gradient: 'bg-gradient-to-br from-pink-50 to-rose-50',
    darkGradient: 'dark:from-pink-900/20 dark:to-rose-900/20',
  },
  {
    id: 'data-transformer',
    type: 'action',
    category: 'AI & Automation',
    title: 'Data Transformer',
    description: 'Transform data between formats',
    icon: Code,
    color: 'bg-gradient-to-br from-pink-100 to-pink-200 text-pink-700',
    darkColor:
      'dark:from-pink-900/40 dark:to-pink-800/40 dark:text-pink-300',
    gradient: 'bg-gradient-to-br from-pink-50 to-rose-50',
    darkGradient: 'dark:from-pink-900/20 dark:to-rose-900/20',
  },
];

const extensionTemplates: ExtensionTemplate[] = [
  {
    key: 'ad-blocker-basic',
    name: 'Ad Blocker (Basic)',
    description: 'Hide common ad containers on page load',
    blocks: [
      { key: 't1', id: 'page-load', type: 'trigger' },
      {
        key: 'a1',
        id: 'inject-css',
        type: 'action',
        config: {
          css: `/* Hide common ad containers */\n[aria-label*="ad" i], [class*="ad-" i], [id*="ad-" i], .ad, .ads, .adsbox, .ad-container, .advertisement{ display: none !important; }`,
        },
      },
      { key: 'a2', id: 'hide-element', type: 'action', config: { selector: '#ad, .ad, .ads, .sponsor' } },
    ],
  },
  {
    key: 'youtube-cleaner',
    name: 'YouTube Cleaner',
    description: 'Hide ads, endscreen cards, and distractions on YouTube',
    blocks: [
      { key: 't1', id: 'page-load', type: 'trigger' },
      {
        key: 'a1',
        id: 'inject-css',
        type: 'action',
        config: {
          css: `/* Hide ad containers and overlays */\n.ytp-ad-module, .ytp-ad-image-overlay, .ytp-ad-overlay-slot, .ytp-ad-player-overlay, .ytp-ad-skip-button, .ytp-ad-text, .video-ads, .yt-ad-skippable, #player-ads{ display:none !important; }\n/* Hide distractions */\n#comments, #secondary, ytd-merch-shelf-renderer, ytd-rich-shelf-renderer, ytd-guide-section-renderer:has([title="Shorts"]) { display:none !important; }`,
        },
      },
    ],
  },
  {
    key: 'focus-mode',
    name: 'Focus Mode (Generic)',
    description: 'Hide comments/sidebars and emphasize main content',
    blocks: [
      { key: 't1', id: 'page-load', type: 'trigger' },
      { key: 'a1', id: 'inject-css', type: 'action', config: { css: `aside, .sidebar, #sidebar, [role="complementary"], #comments, .comments{ display:none !important } main, article{ max-width: 900px; margin: 0 auto; }` } },
      { key: 'a2', id: 'change-background', type: 'action', config: { color: '#ffffff' } },
      { key: 'a3', id: 'change-text-color', type: 'action', config: { color: '#111827' } },
    ],
  },
  {
    key: 'reading-mode',
    name: 'Reading Mode',
    description: 'Soften colors and increase line-height for better reading',
    blocks: [
      { key: 't1', id: 'page-load', type: 'trigger' },
      { key: 'a1', id: 'inject-css', type: 'action', config: { css: `body{ background:#fffdfa; color:#1f2937; } p, li{ line-height:1.8 } article, main{ padding: 24px; max-width: 760px; margin: auto } a{ color:#2563eb }` } },
    ],
  },
  {
    key: 'twitter-minimal',
    name: 'X/Twitter Minimal',
    description: 'Hide trends, who-to-follow, and promoted content',
    blocks: [
      { key: 't1', id: 'page-load', type: 'trigger' },
      { key: 'a1', id: 'inject-css', type: 'action', config: { css: `/* Hide sidebar sections */\n[aria-label="Timeline: Trending now"], [data-testid="trend"], [aria-label="Who to follow"], [data-testid="sidebarColumn"] { display:none !important }\n/* Hide promoted */\n[aria-label="Timeline: Your Home Timeline"] article:has(svg[aria-label="Promoted"]) { display:none !important }` } },
    ],
  },
  {
    key: 'reddit-clean',
    name: 'Reddit Clean',
    description: 'Hide promoted posts and sidebars on Reddit',
    blocks: [
      { key: 't1', id: 'page-load', type: 'trigger' },
      { key: 'a1', id: 'inject-css', type: 'action', config: { css: `.promotedlink, [data-testid="post-container"]:has([data-testid="adpost_layout"]), .premium-banner-outer, .listing-chooser, .right-sidebar { display:none !important }` } },
    ],
  },
  {
    key: 'sticky-header-remover',
    name: 'Sticky Header Remover',
    description: 'Unstick fixed headers and reclaim vertical space',
    blocks: [
      { key: 't1', id: 'page-load', type: 'trigger' },
      { key: 'a1', id: 'inject-css', type: 'action', config: { css: `header, .header, #header, [class*="sticky" i], [style*="position: fixed" i]{ position: static !important; top:auto !important } body{ scroll-margin-top: 0 }` } },
    ],
  },
  {
    key: 'gmail-cleanup',
    name: 'Gmail Cleanup',
    description: 'Hide Meet/Spaces and right sidebar for a focused inbox',
    blocks: [
      { key: 't1', id: 'page-load', type: 'trigger' },
      {
        key: 'a1',
        id: 'inject-css',
        type: 'action',
        config: {
          css: `/* Hide Meet/Spaces and right sidebar */\n#\\:2l, #\\:2k, .aKh, .bAw, .brC-brG, .bq9, .aic .z0 + div, .wT[role="complementary"], .bAw, .brC-aT5-aOt-Jw .brC-aT5 { display:none !important }\n/* Tighten list */\n.aeF .ae4 .CP{ max-width: 980px; margin: auto }`,
        },
      },
    ],
  },
  {
    key: 'linkedin-cleaner',
    name: 'LinkedIn Cleaner',
    description: 'Hide ads, trends, and sidebars on LinkedIn',
    blocks: [
      { key: 't1', id: 'page-load', type: 'trigger' },
      {
        key: 'a1',
        id: 'inject-css',
        type: 'action',
        config: {
          css: `/* Remove right sidebar and promoted */\n.scaffold-layout__aside, .ad-banner-container, [data-test-recommended-entity], [data-test-recommendations], .ad-banner, div:has([aria-label="Promoted"]) { display:none !important }\n/* Center feed */\n.scaffold-layout__main{ max-width: 900px; margin: auto }`,
        },
      },
    ],
  },
  {
    key: 'auto-scroll-toggle',
    name: 'Auto-Scroll Toggle',
    description: 'Press Shift+S to toggle smooth auto-scrolling',
    blocks: [
      { key: 't1', id: 'keyboard-shortcut', type: 'trigger', config: { shortcut: 'Shift+s' } },
      {
        key: 'a1',
        id: 'inject-html',
        type: 'action',
        config: {
          html: `<script>(function(){\n  const key='__extensify_scroll__';\n  if((window as any)[key]){ clearInterval((window as any)[key]); (window as any)[key]=0; console.log('Auto-scroll OFF'); }\n  else { (window as any)[key]=setInterval(()=>window.scrollBy({top:2,behavior:'smooth'}), 16); console.log('Auto-scroll ON'); }\n})();</script>`
        },
      },
    ],
  },
  {
    key: 'dark-mode-toggle',
    name: 'Dark Mode Quick Toggle',
    description: 'Press Ctrl+D to toggle dark mode on any website',
    blocks: [
      {
        key: 't1',
        id: 'keyboard-shortcut',
        type: 'trigger',
        config: { shortcut: 'Control+Shift+d' },
      },
      {
        key: 'a1',
        id: 'inject-css',
        type: 'action',
        config: {
          css: `html{ filter: invert(0.93) hue-rotate(180deg); } img, video, picture, canvas{ filter: invert(1) hue-rotate(180deg); }`,
        },
      },
    ],
  },
  {
    key: 'snippet-saver',
    name: 'Snippet Saver',
    description: 'Press Ctrl+Shift+X to copy selected text to clipboard',
    blocks: [
      { key: 't1', id: 'keyboard-shortcut', type: 'trigger', config: { shortcut: 'Control+Shift+x' } },
      {
        key: 'a1',
        id: 'inject-html',
        type: 'action',
        config: {
          html: `<script>(async function(){\n  try{ const txt = (window.getSelection ? String(window.getSelection()) : '');\n    if(txt){ await navigator.clipboard.writeText(txt); console.log('Snippet copied'); }\n    else { console.log('No selection'); } } catch(e){ console.log('Copy failed', e);}\n})();</script>`
        },
      },
    ],
  },
  {
    key: 'smart-form-autofill',
    name: 'Smart Form Autofill',
    description: 'On URL match, auto-fill and submit a form using stored data',
    blocks: [
      { key: 't1', id: 'url-change', type: 'trigger', config: {} },
      { key: 'a1', id: 'load-data', type: 'action', config: { key: 'profile' } },
      { key: 'a2', id: 'fill-form', type: 'action', config: { selector: 'form', map: { 'input[name="email"]': '{{profile.email}}', 'input[name="name"]': '{{profile.name}}' } } },
      { key: 'a3', id: 'submit-form', type: 'action', config: { selector: 'form' } },
    ],
  },
  {
    key: 'api-to-page',
    name: 'API → Page Inject',
    description: 'Fetch a JSON API and inject a formatted snippet into the page',
    blocks: [
      { key: 't1', id: 'page-load', type: 'trigger' },
      { key: 'a1', id: 'make-request', type: 'action', config: { method: 'GET', url: 'https://api.github.com/repos/vercel/next.js' } },
      { key: 'a2', id: 'parse-json', type: 'action' },
      { key: 'a3', id: 'inject-html', type: 'action', config: { selector: 'body', html: '<div id="ext-api-block" style="padding:10px;border:1px solid #ddd;border-radius:8px"></div>' } },
      { key: 'a4', id: 'inject-text', type: 'action', config: { selector: '#ext-api-block', text: 'Repo: {{json.full_name}} | ⭐ {{json.stargazers_count}}' } },
    ],
  },
  {
    key: 'ai-summary-on-select',
    name: 'AI Summary on Select',
    description: 'Select text, press Ctrl+M to show a mini AI-style summary box',
    blocks: [
      { key: 't1', id: 'keyboard-shortcut', type: 'trigger', config: { shortcut: 'Control+m' } },
      { key: 'a1', id: 'inject-html', type: 'action', config: { html: `<div id="ai-mini" style="position:fixed;right:12px;bottom:12px;background:#111;color:#fff;padding:10px 12px;border-radius:8px;max-width:320px;font-size:12px;z-index:99999">Summarizing selection…</div>` } },
      { key: 'a2', id: 'inject-text', type: 'action', config: { selector: '#ai-mini', text: 'Summary: {{selection.text}}' } },
    ],
  },
  {
    key: 'auto-accept-cookies',
    name: 'Auto Accept Cookies',
    description: 'Click cookie consent buttons automatically',
    blocks: [
      { key: 't1', id: 'page-load', type: 'trigger' },
      {
        key: 'a1',
        id: 'inject-html',
        type: 'action',
        config: {
          html: `<!-- placeholder, logic runs in content script via actions below -->`,
        },
      },
      {
        key: 'a2',
        id: 'inject-css',
        type: 'action',
        config: { css: `.cookie, .cookie-banner, [id*="cookie" i]{ opacity: .4 }` },
      },
    ],
  },
  {
    key: 'page-watermark',
    name: 'Page Watermark',
    description: 'Append a small watermark to the page',
    blocks: [
      { key: 't1', id: 'page-load', type: 'trigger' },
      {
        key: 'a1',
        id: 'inject-text',
        type: 'action',
        config: { selector: 'body', text: 'Generated with Extensify' },
      },
      {
        key: 'a2',
        id: 'inject-css',
        type: 'action',
        config: { css: `span:contains('Generated with Extensify'){position:fixed;bottom:8px;right:8px;opacity:.6;font-size:12px}` },
      },
    ],
  },
];

// Block Configuration Form Component
// Enhanced Connection Line Component with better styling like n8n
const ConnectionLine = ({
  from,
  to,
  blocks,
  connectingFrom,
}: {
  from: string;
  to: string;
  blocks: CanvasBlock[];
  connectingFrom: string | null;
}) => {
  const fromBlock = blocks.find(b => b.instanceId === from);
  const toBlock = blocks.find(b => b.instanceId === to);

  if (!fromBlock || !toBlock) return null;

  // Calculate connection points with proper offsets
  const fromX = fromBlock.position.x + 200; // Block width
  const fromY = fromBlock.position.y + 40; // Block height / 2
  const toX = toBlock.position.x;
  const toY = toBlock.position.y + 40;

  const isConnecting = connectingFrom === from;
  const isActive = connectingFrom === from || connectingFrom === to;

  // Calculate control points for smooth curves
  const controlPoint1X = fromX + (toX - fromX) * 0.25;
  const controlPoint1Y = fromY;
  const controlPoint2X = fromX + (toX - fromX) * 0.75;
  const controlPoint2Y = toY;

  // Create smooth curve path
  const pathData = `M ${fromX} ${fromY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${toX} ${toY}`;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <defs>
        <marker
          id={`arrowhead-${from}-${to}`}
          markerWidth="12"
          markerHeight="8"
          refX="10"
          refY="4"
          orient="auto"
        >
          <polygon
            points="0 0, 12 4, 0 8"
            fill={isActive ? '#3b82f6' : '#6b7280'}
            stroke={isActive ? '#1d4ed8' : '#374151'}
            strokeWidth="1"
          />
        </marker>
        
        {/* Glow filter for active connections */}
        <filter id={`glow-${from}-${to}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Connection line with enhanced styling */}
      <path
        d={pathData}
        stroke={isActive ? '#3b82f6' : '#6b7280'}
        strokeWidth={isActive ? '3' : '2'}
        fill="none"
        markerEnd={`url(#arrowhead-${from}-${to})`}
        filter={isActive ? `url(#glow-${from}-${to})` : undefined}
        style={{
          transition: 'all 0.3s ease',
          strokeDasharray: isConnecting ? '5,5' : 'none',
          animation: isConnecting ? 'dash 1s linear infinite' : 'none',
        }}
      />
      
      {/* Add animation keyframes for dashed lines */}
      <style>
        {`
          @keyframes dash {
            to {
              stroke-dashoffset: -10;
            }
          }
        `}
      </style>
    </svg>
  );
};

const BlockConfigForm = ({
  block,
  onSave,
  onCancel,
}: {
  block: CanvasBlock;
  onSave: (config: BlockConfig) => void;
  onCancel: () => void;
}) => {
  const [config, setConfig] = useState<BlockConfig>(block.config || {});

  const getConfigFields = () => {
    switch (block.id) {
      case 'inject-text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text-content">Text Content</Label>
              <Textarea
                id="text-content"
                value={config.text || ''}
                onChange={e => setConfig({ ...config, text: e.target.value })}
                placeholder="Enter the text to inject"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="target-selector">
                Target Element (CSS Selector)
              </Label>
              <Input
                id="target-selector"
                value={config.selector || ''}
                onChange={e =>
                  setConfig({ ...config, selector: e.target.value })
                }
                placeholder="e.g., .header, #content, body"
              />
            </div>
            <div>
              <Label htmlFor="injection-method">Injection Method</Label>
              <select
                id="injection-method"
                value={config.method || 'append'}
                onChange={e => setConfig({ ...config, method: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="append">Append (add to end)</option>
                <option value="prepend">Prepend (add to beginning)</option>
                <option value="replace">Replace (overwrite content)</option>
                <option value="before">Insert Before</option>
                <option value="after">Insert After</option>
              </select>
            </div>
          </div>
        );

      case 'inject-image':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                value={config.url || ''}
                onChange={e => setConfig({ ...config, url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                value={config.alt || ''}
                onChange={e => setConfig({ ...config, alt: e.target.value })}
                placeholder="Description of the image"
              />
            </div>
            <div>
              <Label htmlFor="target-selector">
                Target Element (CSS Selector)
              </Label>
              <Input
                id="target-selector"
                value={config.selector || ''}
                onChange={e =>
                  setConfig({ ...config, selector: e.target.value })
                }
                placeholder="e.g., .header, #content, body"
              />
            </div>
          </div>
        );

      case 'change-background':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="background-color">Background Color</Label>
              <Input
                id="background-color"
                type="color"
                value={config.color || '#ffffff'}
                onChange={e => setConfig({ ...config, color: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="target-selector">
                Target Element (CSS Selector)
              </Label>
              <Input
                id="target-selector"
                value={config.selector || 'body'}
                onChange={e =>
                  setConfig({ ...config, selector: e.target.value })
                }
                placeholder="e.g., body, .container, #main"
              />
            </div>
          </div>
        );

      case 'show-notification':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="notification-title">Title</Label>
              <Input
                id="notification-title"
                value={config.title || ''}
                onChange={e => setConfig({ ...config, title: e.target.value })}
                placeholder="Notification title"
              />
            </div>
            <div>
              <Label htmlFor="notification-message">Message</Label>
              <Textarea
                id="notification-message"
                value={config.message || ''}
                onChange={e =>
                  setConfig({ ...config, message: e.target.value })
                }
                placeholder="Notification message"
                rows={3}
              />
            </div>
          </div>
        );

      case 'timer':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="delay-time">Delay (milliseconds)</Label>
              <Input
                id="delay-time"
                type="number"
                value={config.delay || 1000}
                onChange={e =>
                  setConfig({ ...config, delay: parseInt(e.target.value) })
                }
                placeholder="1000"
              />
            </div>
          </div>
        );

      case 'interval':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="interval-time">Interval (milliseconds)</Label>
              <Input
                id="interval-time"
                type="number"
                value={config.interval || 1000}
                onChange={e =>
                  setConfig({ ...config, interval: parseInt(e.target.value) })
                }
                placeholder="1000"
              />
            </div>
          </div>
        );

      case 'click-element':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="target-selector">
                Target Element (CSS Selector)
              </Label>
              <Input
                id="target-selector"
                value={config.selector || ''}
                onChange={e =>
                  setConfig({ ...config, selector: e.target.value })
                }
                placeholder="e.g., .button, #submit, input[type='submit']"
              />
            </div>
          </div>
        );

      case 'keyboard-shortcut':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="shortcut">Keyboard Shortcut</Label>
              <Input
                id="shortcut"
                value={config.shortcut || 'Control+k'}
                onChange={e =>
                  setConfig({ ...config, shortcut: e.target.value })
                }
                placeholder="e.g., Control+k, Shift+s, Control+Shift+d"
              />
              <p className="text-sm text-gray-500">
                Use: Control (or Cmd on Mac), Shift, Alt, and any key
              </p>
            </div>
          </div>
        );

      case 'fill-form':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="form-data">Form Data (JSON)</Label>
              <Textarea
                id="form-data"
                value={config.formData || ''}
                onChange={e =>
                  setConfig({ ...config, formData: e.target.value })
                }
                placeholder='{"username": "john", "email": "john@example.com"}'
                rows={4}
              />
            </div>
          </div>
        );

      case 'open-url':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={config.url || ''}
                onChange={e => setConfig({ ...config, url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="open-in">Open In</Label>
              <select
                id="open-in"
                value={config.target || 'same'}
                onChange={e => setConfig({ ...config, target: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="same">Same Tab</option>
                <option value="new">New Tab</option>
                <option value="window">New Window</option>
              </select>
            </div>
          </div>
        );

      case 'if-condition':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="condition-type">Condition Type</Label>
              <select
                id="condition-type"
                value={config.conditionType || 'equals'}
                onChange={e => setConfig({ ...config, conditionType: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="equals">Equals</option>
                <option value="not-equals">Not Equals</option>
                <option value="contains">Contains</option>
                <option value="greater-than">Greater Than</option>
                <option value="less-than">Less Than</option>
                <option value="regex">Regular Expression</option>
              </select>
            </div>
            <div>
              <Label htmlFor="left-value">Left Value</Label>
              <Input
                id="left-value"
                value={config.leftValue || ''}
                onChange={e => setConfig({ ...config, leftValue: e.target.value })}
                placeholder="Variable or value to compare"
              />
            </div>
            <div>
              <Label htmlFor="right-value">Right Value</Label>
              <Input
                id="right-value"
                value={config.rightValue || ''}
                onChange={e => setConfig({ ...config, rightValue: e.target.value })}
                placeholder="Value to compare against"
              />
            </div>
          </div>
        );

      case 'loop':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="loop-type">Loop Type</Label>
              <select
                id="loop-type"
                value={config.loopType || 'count'}
                onChange={e => setConfig({ ...config, loopType: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="count">Fixed Count</option>
                <option value="array">Array Items</option>
                <option value="condition">While Condition</option>
              </select>
            </div>
            <div>
              <Label htmlFor="loop-value">Loop Value</Label>
              <Input
                id="loop-value"
                value={config.loopValue || ''}
                onChange={e => setConfig({ ...config, loopValue: e.target.value })}
                placeholder="Count, array, or condition"
              />
            </div>
          </div>
        );

              case 'ai-processor':
          return (
            <div className="space-y-4">
              <div>
                <Label htmlFor="ai-model">AI Model</Label>
                <select
                  id="ai-model"
                  value={config.aiModel || 'gpt-3.5'}
                  onChange={e => setConfig({ ...config, aiModel: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="gpt-3.5">GPT-3.5</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="claude">Claude</option>
                  <option value="custom">Custom Model</option>
                </select>
              </div>
              <div>
                <Label htmlFor="ai-prompt">Prompt</Label>
                <Textarea
                  id="ai-prompt"
                  value={config.prompt || ''}
                  onChange={e => setConfig({ ...config, prompt: e.target.value })}
                  placeholder="Enter your AI prompt..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="ai-input">Input Data</Label>
                <Input
                  id="ai-input"
                  value={config.inputData || ''}
                  onChange={e => setConfig({ ...config, inputData: e.target.value })}
                  placeholder="Data to process with AI"
                />
              </div>
            </div>
          );

        case 'switch-case':
          return (
            <div className="space-y-4">
              <div>
                <Label htmlFor="switch-variable">Switch Variable</Label>
                <Input
                  id="switch-variable"
                  value={config.switchVariable || ''}
                  onChange={e => setConfig({ ...config, switchVariable: e.target.value })}
                  placeholder="Variable to switch on"
                />
              </div>
              <div>
                <Label htmlFor="case-1">Case 1</Label>
                <Input
                  id="case-1"
                  value={config.case1 || ''}
                  onChange={e => setConfig({ ...config, case1: e.target.value })}
                  placeholder="Value for case 1"
                />
              </div>
              <div>
                <Label htmlFor="case-2">Case 2</Label>
                <Input
                  id="case-2"
                  value={config.case2 || ''}
                  onChange={e => setConfig({ ...config, case2: e.target.value })}
                  placeholder="Value for case 2"
                />
              </div>
            </div>
          );

        case 'make-request':
          return (
            <div className="space-y-4">
              <div>
                <Label htmlFor="request-method">HTTP Method</Label>
                <select
                  id="request-method"
                  value={config.method || 'GET'}
                  onChange={e => setConfig({ ...config, method: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <div>
                <Label htmlFor="request-url">URL</Label>
                <Input
                  id="request-url"
                  value={config.url || ''}
                  onChange={e => setConfig({ ...config, url: e.target.value })}
                  placeholder="https://api.example.com/resource"
                />
              </div>
              <div>
                <Label htmlFor="request-headers">Headers (JSON)</Label>
                <Textarea
                  id="request-headers"
                  value={config.headers || ''}
                  onChange={e => setConfig({ ...config, headers: e.target.value })}
                  placeholder='{"Content-Type": "application/json"}'
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="request-body">Body</Label>
                <Textarea
                  id="request-body"
                  value={config.body || ''}
                  onChange={e => setConfig({ ...config, body: e.target.value })}
                  placeholder='{"name": "John"} or raw text'
                  rows={4}
                />
                <p className="text-xs text-gray-500">Ignored for GET by the generator.</p>
              </div>
            </div>
          );

        case 'webhook':
          return (
            <div className="space-y-4">
              <div>
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  value={config.webhookUrl || ''}
                  onChange={e => setConfig({ ...config, webhookUrl: e.target.value })}
                  placeholder="https://api.example.com/webhook"
                />
              </div>
              <div>
                <Label htmlFor="webhook-method">HTTP Method</Label>
                <select
                  id="webhook-method"
                  value={config.httpMethod || 'POST'}
                  onChange={e => setConfig({ ...config, httpMethod: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <div>
                <Label htmlFor="webhook-headers">Headers (JSON)</Label>
                <Textarea
                  id="webhook-headers"
                  value={config.headers || ''}
                  onChange={e => setConfig({ ...config, headers: e.target.value })}
                  placeholder='{"Content-Type": "application/json"}'
                  rows={3}
                />
              </div>
            </div>
          );

        case 'data-transformer':
          return (
            <div className="space-y-4">
              <div>
                <Label htmlFor="transform-type">Transform Type</Label>
                <select
                  id="transform-type"
                  value={config.transformType || 'json-to-csv'}
                  onChange={e => setConfig({ ...config, transformType: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="json-to-csv">JSON to CSV</option>
                  <option value="csv-to-json">CSV to JSON</option>
                  <option value="xml-to-json">XML to JSON</option>
                  <option value="text-processing">Text Processing</option>
                </select>
              </div>
              <div>
                <Label htmlFor="transform-rules">Transform Rules</Label>
                <Textarea
                  id="transform-rules"
                  value={config.transformRules || ''}
                  onChange={e => setConfig({ ...config, transformRules: e.target.value })}
                  placeholder="Enter transformation rules..."
                  rows={4}
                />
              </div>
            </div>
          );

        default:
        return (
          <div className="text-center py-4 text-gray-500">
            No configuration needed for this block.
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {getConfigFields()}
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => onSave(config)}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
        >
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Dark Mode Toggle',
    description: 'Add dark mode to any website',
    lastModified: '2 hours ago',
    status: 'published',
  },
  {
    id: '2',
    name: 'Price Tracker',
    description: 'Track product prices on e-commerce sites',
    lastModified: '1 day ago',
    status: 'draft',
  },
  {
    id: '3',
    name: 'Focus Helper',
    description: 'Block distracting elements on websites',
    lastModified: '3 days ago',
    status: 'published',
  },
];

export default function PageWrapper() {
  return (
    <ClientProvider>
      <ChromeExtensionBuilder />
    </ClientProvider>
  );
}

function ChromeExtensionBuilder() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null);
  const [canvasBlocks, setCanvasBlocks] = useState<CanvasBlock[]>([]);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportName, setExportName] = useState('My Extension');
  const [exportDescription, setExportDescription] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [configuringBlock, setConfiguringBlock] = useState<CanvasBlock | null>(
    null
  );
  const [draggingBlock, setDraggingBlock] = useState<CanvasBlock | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [zoomScale, setZoomScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [snappingEnabled, setSnappingEnabled] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCanvasHovered, setIsCanvasHovered] = useState(false);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const gridSize = 20;
  // Must match canvas container padding (p-6 = 24px)
  const canvasPaddingPx = 24;
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [popupPreviewSrc, setPopupPreviewSrc] = useState<string>('');
  const [contentPreviewSrc, setContentPreviewSrc] = useState<string>('');
  const previousObjectUrlsRef = useRef<string[]>([]);
  const popupIframeRef = useRef<HTMLIFrameElement | null>(null);
  const contentIframeRef = useRef<HTMLIFrameElement | null>(null);

  function generateManifest() {
    const manifest = {
      manifest_version: 3,
      name: exportName || 'Extensify Extension',
      description: exportDescription || 'Generated by Extensify',
      version: '1.0.0',
      icons: {
        '16': 'icons/icon16.png',
        '32': 'icons/icon32.png',
        '48': 'icons/icon48.png',
        '128': 'icons/icon128.png',
      },
      action: {
        default_popup: 'popup.html',
        default_icon: {
          '16': 'icons/icon16.png',
          '48': 'icons/icon48.png',
          '128': 'icons/icon128.png',
        },
      },
      commands: {
        'toggle-dark-mode': {
          suggested_key: {
            default: 'Ctrl+D',
            mac: 'Command+D',
          },
          description: 'Toggle dark mode',
        },
      },
      background: {
        service_worker: 'background.js',
        type: 'module',
      },
      permissions: ['storage', 'activeTab', 'scripting'],
      host_permissions: ['<all_urls>'],
      content_scripts: [
        {
          matches: ['<all_urls>'],
          js: ['content.js'],
          run_at: 'document_idle',
        },
      ],
    } as any;

    return JSON.stringify(manifest, null, 2);
  }

  function generateBackground() {
    const logic = `// Auto-generated by Extensify
// You can customize this file
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extensify extension installed');
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-dark-mode') {
    // Send message to active tab to toggle dark mode
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle-dark-mode' });
      }
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message from content:', message);
  sendResponse({ ok: true });
});`;
    return logic;
  }

  function generateContentWorkflowCode() {
    // Build a minimal workflow runner from canvas blocks
    const blocks = canvasBlocks;
    const byId = new Map(blocks.map(b => [b.instanceId, b]));

    function serialize(str?: string) {
      return (str ?? '').replace(/`/g, '\\`');
    }

    // Traverse actions downstream from a given start id
    function collectActions(startId: string) {
      const ordered: any[] = [];
      const visited = new Set<string>();
      const queue: string[] = [...(byId.get(startId)?.connections || [])];
      while (queue.length) {
        const id = queue.shift()!;
        if (visited.has(id)) continue;
        visited.add(id);
        const b = byId.get(id);
        if (!b) continue;
        if (b.type === 'action') ordered.push(b);
        // allow chaining actions
        (b.connections || []).forEach(n => queue.push(n));
      }
      return ordered;
    }

    const triggerHandlers: string[] = [];

    for (const trigger of blocks.filter(b => b.type === 'trigger')) {
      const actions = collectActions(trigger.instanceId);
      if (actions.length === 0) continue;

      const actionsCode = actions
        .map(a => {
          const cfg = a.config || {} as any;
          switch (a.id) {
            case 'inject-text':
              return `{
  try {
    const selector = \`${serialize((cfg as any).selector || 'body')}\`;
    const text = \`${serialize(cfg.text || 'Hello from Extensify')}\`;
    const method = \`${serialize((cfg as any).method || 'append')}\`;
    const element = document.querySelector(selector);
    
    if (!element) {
      console.warn('Target element not found with selector:', selector);
      return;
    }
    
    const textNode = document.createTextNode(text);
    
    switch (method) {
      case 'append':
        element.appendChild(textNode);
        break;
      case 'prepend':
        element.insertBefore(textNode, element.firstChild);
        break;
      case 'replace':
        element.textContent = text;
        break;
      case 'before':
        element.parentNode?.insertBefore(textNode, element);
        break;
      case 'after':
        element.parentNode?.insertBefore(textNode, element.nextSibling);
        break;
      default:
        element.appendChild(textNode);
    }
    
    console.log(\`Text injected using method: \${method} into: \${selector}\`);
  } catch (error) {
    console.error('Failed to inject text:', error);
  }
}`;

            case 'inject-image':
              return `{
  try {
    const selector = \`${serialize((cfg as any).selector || 'body')}\`;
    const imageUrl = \`${serialize(cfg.url || '')}\`;
    const altText = \`${serialize(cfg.alt || 'Injected image')}\`;
    const container = document.querySelector(selector);
    
    if (!container) {
      console.warn('Container element not found with selector:', selector);
      return;
    }
    
    if (!imageUrl) {
      console.warn('No image URL provided');
      return;
    }
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = altText;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    
    // Handle image load errors
    img.onerror = () => {
      console.error('Failed to load image:', imageUrl);
      img.remove();
    };
    
    img.onload = () => {
      console.log('Image loaded successfully:', imageUrl);
    };
    
    container.appendChild(img);
    console.log('Image injected successfully into:', selector);
  } catch (error) {
    console.error('Failed to inject image:', error);
  }
}`;

            case 'show-notification':
              return `{
  try {
    const title = \`${serialize(cfg.title || 'Notification')}\`;
    const message = \`${serialize(cfg.message || '')}\`;
    
    // Create notification container
    const notification = document.createElement('div');
    notification.id = 'extensify-notification-' + Date.now();
    notification.style.cssText = \`
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1f2937;
      color: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      max-width: 300px;
      font-family: system-ui, sans-serif;
    \`;
    
    // Add title
    if (title) {
      const titleEl = document.createElement('div');
      titleEl.style.cssText = 'font-weight: 600; margin-bottom: 4px; font-size: 14px;';
      titleEl.textContent = title;
      notification.appendChild(titleEl);
    }
    
    // Add message
    if (message) {
      const messageEl = document.createElement('div');
      messageEl.style.cssText = 'font-size: 13px; opacity: 0.9;';
      messageEl.textContent = message;
      notification.appendChild(messageEl);
    }
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = \`
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      opacity: 0.7;
    \`;
    closeBtn.onclick = () => notification.remove();
    notification.appendChild(closeBtn);
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
    
    console.log('Notification shown:', title);
  } catch (error) {
    console.error('Failed to show notification:', error);
  }
}`;
            case 'inject-html':
              return `{
  try {
    const selector = \`${serialize((cfg as any).selector || 'body')}\`;
    const html = \`${serialize(cfg.html || '<div>Custom HTML</div>')}\`;
    const container = document.querySelector(selector);
    
    if (!container) {
      console.warn('Container element not found with selector:', selector);
      return;
    }
    
    // Create a unique ID for this injection
    const injectionId = 'extensify-html-' + Date.now();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    tempDiv.id = injectionId;
    
    container.appendChild(tempDiv);
    console.log('HTML injected successfully into:', selector);
  } catch (error) {
    console.error('Failed to inject HTML:', error);
  }
}`;
            case 'inject-css':
              return `{
  try {
    const style = document.createElement('style');
    style.id = 'extensify-injected-style';
    style.textContent = \`${serialize(cfg.css || 'body{outline:2px dashed #22c55e8c;}')}\`;
    
    // Remove existing style if it exists
    const existingStyle = document.getElementById('extensify-injected-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);
    console.log('CSS injected successfully');
  } catch (error) {
    console.error('Failed to inject CSS:', error);
  }
}`;
            case 'change-background':
              return `{
  try {
    const selector = \`${serialize((cfg as any).selector || 'body')}\`;
    const color = \`${serialize(cfg.color || '#f0f9ff')}\`;
    const elements = document.querySelectorAll(selector);
    
    if (elements.length === 0) {
      console.warn('No elements found with selector:', selector);
      return;
    }
    
    elements.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        // Store original background for potential restoration
        if (!el.dataset.extensifyOriginalBackground) {
          el.dataset.extensifyOriginalBackground = el.style.background || getComputedStyle(el).background;
        }
        el.style.background = color;
        console.log(\`Changed background of element \${index + 1} to: \${color}\`);
      }
    });
  } catch (error) {
    console.error('Failed to change background:', error);
  }
}`;
            case 'change-text-color':
              return `{
  try {
    const selector = \`${serialize((cfg as any).selector || 'body')}\`;
    const color = \`${serialize(cfg.color || '#111827')}\`;
    const elements = document.querySelectorAll(selector);
    
    if (elements.length === 0) {
      console.warn('No elements found with selector:', selector);
      return;
    }
    
    elements.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        // Store original color for potential restoration
        if (!el.dataset.extensifyOriginalColor) {
          el.dataset.extensifyOriginalColor = el.style.color || getComputedStyle(el).color;
        }
        el.style.color = color;
        console.log(\`Changed text color of element \${index + 1} to: \${color}\`);
      }
    });
  } catch (error) {
    console.error('Failed to change text color:', error);
  }
}`;
            case 'hide-element':
              return `{
  try {
    const selector = \`${serialize((cfg as any).selector || 'body')}\`;
    const elements = document.querySelectorAll(selector);
    
    if (elements.length === 0) {
      console.warn('No elements found with selector:', selector);
      return;
    }
    
    elements.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        // Store original display value for potential restoration
        if (!el.dataset.extensifyOriginalDisplay) {
          el.dataset.extensifyOriginalDisplay = el.style.display || getComputedStyle(el).display;
        }
        el.style.display = 'none';
        console.log(\`Hidden element \${index + 1} with selector: \${selector}\`);
      }
    });
  } catch (error) {
    console.error('Failed to hide elements:', error);
  }
}`;
            case 'show-element':
              return `{
  try {
    const selector = \`${serialize((cfg as any).selector || 'body')}\`;
    const elements = document.querySelectorAll(selector);
    
    if (elements.length === 0) {
      console.warn('No elements found with selector:', selector);
      return;
    }
    
    elements.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        // Restore original display value if available
        if (el.dataset.extensifyOriginalDisplay) {
          el.style.display = el.dataset.extensifyOriginalDisplay;
          delete el.dataset.extensifyOriginalDisplay;
        } else {
          el.style.display = '';
        }
        console.log(\`Showed element \${index + 1} with selector: \${selector}\`);
      }
    });
  } catch (error) {
    console.error('Failed to show elements:', error);
  }
}`;

            case 'open-url':
              return `{
  try {
    const url = \`${serialize(cfg.url || '')}\`;
    const target = \`${serialize((cfg as any).target || 'same')}\`;
    
    if (!url) {
      console.warn('No URL provided for open-url action');
      return;
    }
    
    console.log(\`Opening URL: \${url} in target: \${target}\`);
    
    switch (target) {
      case 'new':
        window.open(url, '_blank');
        break;
      case 'window':
        window.open(url, '_blank', 'width=800,height=600');
        break;
      case 'same':
      default:
        window.location.href = url;
        break;
    }
    
    console.log('URL opened successfully');
  } catch (error) {
    console.error('Failed to open URL:', error);
  }
}`;

            case 'fill-form':
              return `{
  try {
    const formData = \`${serialize(cfg.formData || '{}')}\`;
    let data;
    
    try {
      data = JSON.parse(formData);
    } catch (parseError) {
      console.error('Invalid JSON in form data:', formData);
      return;
    }
    
    console.log('Filling form with data:', data);
    
    // Fill form fields based on data
    Object.entries(data).forEach(([key, value]) => {
      const input = document.querySelector(\`input[name="\${key}"], input[id="\${key}"], textarea[name="\${key}"], textarea[id="\${key}"]\`);
      if (input && input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
        input.value = String(value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        console.log(\`Filled field \${key} with value: \${value}\`);
      } else {
        console.warn(\`Field not found for key: \${key}\`);
      }
    });
    
    console.log('Form filling completed');
  } catch (error) {
    console.error('Failed to fill form:', error);
  }
}`;

            case 'submit-form':
              return `{
  try {
    const selector = \`${serialize((cfg as any).selector || 'form')}\`;
    const forms = document.querySelectorAll(selector);
    
    if (forms.length === 0) {
      console.warn('No forms found with selector:', selector);
      return;
    }
    
    forms.forEach((form, index) => {
      if (form instanceof HTMLFormElement) {
        console.log(\`Submitting form \${index + 1} with selector: \${selector}\`);
        
        // Trigger submit event
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        const submitted = form.dispatchEvent(submitEvent);
        
        if (submitted) {
          form.submit();
          console.log(\`Form \${index + 1} submitted successfully\`);
        } else {
          console.log(\`Form \${index + 1} submission was prevented\`);
        }
      }
    });
  } catch (error) {
    console.error('Failed to submit form:', error);
  }
}`;

            case 'make-request':
              return `{
  try {
    const method = \`${serialize((cfg as any).method || 'GET')}\`;
    const url = \`${serialize(cfg.url || '')}\`;
    const headers = \`${serialize((cfg as any).headers || '{}')}\`;
    const body = \`${serialize((cfg as any).body || '')}\`;
    
    if (!url) {
      console.warn('No URL provided for make-request action');
      return;
    }
    
    console.log(\`Making \${method} request to: \${url}\`);
    
    let parsedHeaders = {};
    try {
      parsedHeaders = JSON.parse(headers);
    } catch (parseError) {
      console.warn('Invalid headers JSON, using empty headers');
    }
    
    const options: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        ...parsedHeaders
      }
    };
    
    if (body && method.toUpperCase() !== 'GET') {
      try {
        options.body = body;
      } catch (parseError) {
        console.warn('Invalid body, using empty body');
      }
    }
    
    fetch(url, options)
      .then(response => {
        console.log(\`Request completed with status: \${response.status}\`);
        return response.text();
      })
      .then(data => {
        console.log('Response data:', data);
        // Store response for other blocks to use
        window.extensifyLastResponse = { data, timestamp: Date.now() };
      })
      .catch(error => {
        console.error('Request failed:', error);
      });
  } catch (error) {
    console.error('Failed to make request:', error);
  }
}`;

            case 'parse-json':
              return `{
  try {
    const input = \`${serialize((cfg as any).input || '')}\`;
    
    if (!input) {
      console.warn('No input provided for parse-json action');
      return;
    }
    
    console.log('Parsing JSON input:', input);
    
    let parsedData;
    try {
      parsedData = JSON.parse(input);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      return;
    }
    
    // Store parsed data for other blocks to use
    window.extensifyParsedData = {
      data: parsedData,
      timestamp: Date.now(),
      type: typeof parsedData,
      isArray: Array.isArray(parsedData),
      keys: typeof parsedData === 'object' ? Object.keys(parsedData) : []
    };
    
    console.log('JSON parsed successfully:', {
      type: typeof parsedData,
      isArray: Array.isArray(parsedData),
      keys: typeof parsedData === 'object' ? Object.keys(parsedData) : []
    });
  } catch (error) {
    console.error('Failed to parse JSON:', error);
  }
}`;

            case 'load-data':
              return `{
  try {
    const key = \`${serialize((cfg as any).key || '')}\`;
    
    if (!key) {
      console.warn('No key provided for load-data action');
      return;
    }
    
    console.log('Loading data with key:', key);
    
    // Try to load from localStorage first
    let data = localStorage.getItem(\`extensify_\${key}\`);
    
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        window.extensifyLoadedData = {
          key: key,
          data: parsedData,
          source: 'localStorage',
          timestamp: Date.now()
        };
        console.log('Data loaded from localStorage:', parsedData);
      } catch (parseError) {
        console.warn('Failed to parse localStorage data, using raw string');
        window.extensifyLoadedData = {
          key: key,
          data: data,
          source: 'localStorage',
          timestamp: Date.now()
        };
      }
    } else {
      // Try to load from sessionStorage
      data = sessionStorage.getItem(\`extensify_\${key}\`);
      if (data) {
        try {
          const parsedData = JSON.parse(data);
          window.extensifyLoadedData = {
            key: key,
            data: parsedData,
            source: 'sessionStorage',
            timestamp: Date.now()
          };
          console.log('Data loaded from sessionStorage:', parsedData);
        } catch (parseError) {
          console.warn('Failed to parse sessionStorage data, using raw string');
          window.extensifyLoadedData = {
            key: key,
            data: data,
            source: 'sessionStorage',
            timestamp: Date.now()
          };
        }
      } else {
        console.warn('No data found for key:', key);
        window.extensifyLoadedData = {
          key: key,
          data: null,
          source: 'none',
          timestamp: Date.now()
        };
      }
    }
  } catch (error) {
    console.error('Failed to load data:', error);
  }
}`;

            case 'webhook':
              return `{
  try {
    const url = \`${serialize(cfg.webhookUrl || '')}\`;
    const method = \`${serialize((cfg as any).httpMethod || 'POST')}\`;
    const headers = \`${serialize((cfg as any).headers || '{}')}\`;
    const payload = \`${serialize((cfg as any).payload || '{}')}\`;
    
    if (!url) {
      console.warn('No webhook URL provided');
      return;
    }
    
    console.log(\`Sending webhook \${method} to: \${url}\`);
    
    let parsedHeaders = {};
    let parsedPayload = {};
    
    try {
      parsedHeaders = JSON.parse(headers);
    } catch (parseError) {
      console.warn('Invalid headers JSON, using empty headers');
    }
    
    try {
      parsedPayload = JSON.parse(payload);
    } catch (parseError) {
      console.warn('Invalid payload JSON, using empty payload');
    }
    
    const options: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        ...parsedHeaders
      }
    };
    
    if (method.toUpperCase() !== 'GET') {
      options.body = JSON.stringify(parsedPayload);
    }
    
    fetch(url, options)
      .then(response => {
        console.log(\`Webhook sent with status: \${response.status}\`);
        return response.text();
      })
      .then(data => {
        console.log('Webhook response:', data);
        window.extensifyWebhookResponse = {
          url: url,
          method: method,
          status: 'success',
          response: data,
          timestamp: Date.now()
        };
      })
      .catch(error => {
        console.error('Webhook failed:', error);
        window.extensifyWebhookResponse = {
          url: url,
          method: method,
          status: 'error',
          error: error.message,
          timestamp: Date.now()
        };
      });
  } catch (error) {
    console.error('Failed to send webhook:', error);
  }
}`;

            case 'ai-processor':
              return `{
  try {
    const model = \`${serialize((cfg as any).aiModel || 'gpt-3.5')}\`;
    const prompt = \`${serialize(cfg.prompt || '')}\`;
    const inputData = \`${serialize((cfg as any).inputData || '')}\`;
    
    if (!prompt) {
      console.warn('No prompt provided for AI processor');
      return;
    }
    
    console.log(\`Processing with AI model: \${model}\`);
    console.log('Prompt:', prompt);
    console.log('Input data:', inputData);
    
    // Simulate AI processing (in real implementation, this would call an AI API)
    const processingResult = {
      model: model,
      prompt: prompt,
      input: inputData,
      output: \`AI processed result for: \${prompt}\`,
      timestamp: Date.now(),
      processingTime: Math.random() * 1000 + 500 // Simulate processing time
    };
    
    // Store result for other blocks to use
    window.extensifyAIResult = processingResult;
    
    console.log('AI processing completed:', processingResult);
    
    // In a real implementation, you would:
    // 1. Call the actual AI API (OpenAI, Claude, etc.)
    // 2. Handle rate limiting and errors
    // 3. Process the response
    // 4. Store the result
    
  } catch (error) {
    console.error('Failed to process with AI:', error);
  }
}`;

            case 'data-transformer':
              return `{
  try {
    const transformType = \`${serialize((cfg as any).transformType || 'json-to-csv')}\`;
    const transformRules = \`${serialize((cfg as any).transformRules || '')}\`;
    
    console.log(\`Transforming data using: \${transformType}\`);
    console.log('Transform rules:', transformRules);
    
    // Get input data from previous blocks
    let inputData = null;
    if (window.extensifyLastResponse) {
      inputData = window.extensifyLastResponse.data;
    } else if (window.extensifyParsedData) {
      inputData = window.extensifyParsedData.data;
    } else if (window.extensifyLoadedData) {
      inputData = window.extensifyLoadedData.data;
    }
    
    if (!inputData) {
      console.warn('No input data found for transformation');
      return;
    }
    
    console.log('Input data for transformation:', inputData);
    
    let transformedData = null;
    
    switch (transformType) {
      case 'json-to-csv':
        if (Array.isArray(inputData)) {
          if (inputData.length === 0) {
            transformedData = '';
          } else {
            const headers = Object.keys(inputData[0]);
            const csvRows = [headers.join(',')];
            
            inputData.forEach(row => {
              const values = headers.map(header => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',') ? \`"\${value}"\` : value;
              });
              csvRows.push(values.join(','));
            });
            
            transformedData = csvRows.join('\\n');
          }
        } else {
          console.warn('Input data is not an array for CSV conversion');
          return;
        }
        break;
        
      case 'csv-to-json':
        if (typeof inputData === 'string') {
          const lines = inputData.split('\\n').filter(line => line.trim());
          if (lines.length < 2) {
            console.warn('CSV must have at least header and one data row');
            return;
          }
          
          const headers = lines[0].split(',').map(h => h.trim());
          const jsonData = [];
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const row = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            jsonData.push(row);
          }
          
          transformedData = jsonData;
        } else {
          console.warn('Input data is not a string for CSV parsing');
          return;
        }
        break;
        
      case 'xml-to-json':
        if (typeof inputData === 'string') {
          try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(inputData, 'text/xml');
            transformedData = xmlToJson(xmlDoc);
          } catch (error) {
            console.error('Failed to parse XML:', error);
            return;
          }
        } else {
          console.warn('Input data is not a string for XML parsing');
          return;
        }
        break;
        
      case 'text-processing':
        if (typeof inputData === 'string') {
          // Apply text processing rules
          let processed = inputData;
          
          if (transformRules.includes('uppercase')) {
            processed = processed.toUpperCase();
          }
          if (transformRules.includes('lowercase')) {
            processed = processed.toLowerCase();
          }
          if (transformRules.includes('trim')) {
            processed = processed.trim();
          }
          if (transformRules.includes('remove-spaces')) {
            processed = processed.replace(/\\s+/g, '');
          }
          
          transformedData = processed;
        } else {
          console.warn('Input data is not a string for text processing');
          return;
        }
        break;
        
      default:
        console.warn('Unknown transform type:', transformType);
        return;
    }
    
    // Store transformed data for other blocks to use
    window.extensifyTransformedData = {
      type: transformType,
      input: inputData,
      output: transformedData,
      rules: transformRules,
      timestamp: Date.now()
    };
    
    console.log('Data transformation completed:', {
      type: transformType,
      inputLength: typeof inputData === 'string' ? inputData.length : (Array.isArray(inputData) ? inputData.length : 'object'),
      outputLength: typeof transformedData === 'string' ? transformedData.length : (Array.isArray(transformedData) ? transformedData.length : 'object')
    });
    
  } catch (error) {
    console.error('Failed to transform data:', error);
  }
  
  // Helper function for XML to JSON conversion
  function xmlToJson(xml) {
    let obj = {};
    
    if (xml.nodeType === 1) {
      if (xml.attributes.length > 0) {
        obj['@attributes'] = {};
        for (let j = 0; j < xml.attributes.length; j++) {
          const attribute = xml.attributes.item(j);
          obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType === 3) {
      obj = xml.nodeValue;
    }
    
    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes.item(i);
        const nodeName = item.nodeName;
        
        if (typeof obj[nodeName] === 'undefined') {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof obj[nodeName].push === 'undefined') {
            const old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    
    return obj;
  }
}`;

            case 'if-condition':
              return `{
  try {
    const conditionType = \`\${serialize((cfg as any).conditionType || 'equals')}\`;
    const leftValue = \`\${serialize((cfg as any).leftValue || '')}\`;
    const rightValue = \`\${serialize((cfg as any).rightValue || '')}\`;
    
    console.log('Evaluating condition:', { conditionType, leftValue, rightValue });
    
    let conditionMet = false;
    
    switch (conditionType) {
      case 'equals':
        conditionMet = leftValue === rightValue;
        break;
      case 'not-equals':
        conditionMet = leftValue !== rightValue;
        break;
      case 'contains':
        conditionMet = String(leftValue).includes(String(rightValue));
        break;
      case 'greater-than':
        conditionMet = Number(leftValue) > Number(rightValue);
        break;
      case 'less-than':
        conditionMet = Number(leftValue) < Number(rightValue);
        break;
      case 'regex':
        try {
          const regex = new RegExp(rightValue);
          conditionMet = regex.test(String(leftValue));
        } catch (error) {
          console.error('Invalid regex pattern:', error);
          return;
        }
        break;
      default:
        console.warn('Unknown condition type:', conditionType);
        return;
    }
    
    console.log('Condition result:', conditionMet);
    
    // Store condition result for other blocks to use
    window.extensifyConditionResult = {
      conditionType,
      leftValue,
      rightValue,
      result: conditionMet,
      timestamp: Date.now()
    };
    
    if (conditionMet) {
      // Execute connected actions
      \${actionsCode}
    }
  } catch (error) {
    console.error('Failed to evaluate condition:', error);
  }
}`;

            case 'loop':
              return `{
  try {
    const loopType = \`\${serialize((cfg as any).loopType || 'count')}\`;
    const loopValue = \`\${serialize((cfg as any).loopValue || '5')}\`;
    
    console.log('Starting loop:', { loopType, loopValue });
    
    switch (loopType) {
      case 'count':
        const count = parseInt(loopValue) || 5;
        console.log(\`Executing loop \${count} times\`);
        
        for (let i = 0; i < count; i++) {
          console.log(\`Loop iteration \${i + 1}\`);
          \${actionsCode}
        }
        break;
        
      case 'array':
        let arrayData = [];
        try {
          arrayData = JSON.parse(loopValue);
        } catch (error) {
          console.warn('Invalid array JSON, using empty array');
        }
        
        if (Array.isArray(arrayData)) {
          console.log(\`Executing loop for \${arrayData.length} array items\`);
          
          arrayData.forEach((item, index) => {
            console.log(\`Loop iteration \${index + 1} with item:\`, item);
            // Store current item for actions to use
            window.extensifyCurrentLoopItem = { item, index, total: arrayData.length };
            \${actionsCode}
          });
        } else {
          console.warn('Loop value is not an array');
        }
        break;
        
      case 'condition':
        let condition = true;
        let iteration = 0;
        const maxIterations = 1000; // Safety limit
        
        console.log('Executing while loop with condition:', loopValue);
        
        while (condition && iteration < maxIterations) {
          iteration++;
          console.log(\`Loop iteration \${iteration}\`);
          
          // Execute actions
          \${actionsCode}
          
          // Check if we should continue (this would need to be implemented by actions)
          if (window.extensifyBreakLoop) {
            console.log('Loop broken by action');
            break;
          }
        }
        
        if (iteration >= maxIterations) {
          console.warn('Loop reached maximum iterations limit');
        }
        break;
        
      default:
        console.warn('Unknown loop type:', loopType);
        return;
    }
    
    console.log('Loop completed');
  } catch (error) {
    console.error('Failed to execute loop:', error);
  }
}`;

            case 'switch-case':
              return `{
  try {
                const switchVariable = \`\${serialize((cfg as any).switchVariable || '')}\`;
                const case1 = \`\${serialize((cfg as any).case1 || '')}\`;
                const case2 = \`\${serialize((cfg as any).case2 || '')}\`;
                
                console.log('Executing switch-case:', { switchVariable, case1, case2 });
                
                // Get the value to switch on
                let valueToSwitch = switchVariable;
                
                // Try to get from previous blocks if it's a variable name
                if (window.extensifyLastResponse && window.extensifyLastResponse.data) {
                  valueToSwitch = window.extensifyLastResponse.data;
                } else if (window.extensifyParsedData && window.extensifyParsedData.data) {
                  valueToSwitch = window.extensifyParsedData.data;
                } else if (window.extensifyLoadedData && window.extensifyLoadedData.data) {
                  valueToSwitch = window.extensifyLoadedData.data;
                }
                
                console.log('Value to switch on:', valueToSwitch);
                
                // Execute actions based on the case
                if (valueToSwitch === case1) {
                  console.log('Case 1 matched, executing actions');
                  \${actionsCode}
                } else if (valueToSwitch === case2) {
                  console.log('Case 2 matched, executing actions');
                  \${actionsCode}
                } else {
                  console.log('No case matched, executing default actions');
                  \${actionsCode}
                }
                
                // Store switch result for other blocks to use
                window.extensifySwitchResult = {
                  variable: switchVariable,
                  value: valueToSwitch,
                  matchedCase: valueToSwitch === case1 ? 'case1' : (valueToSwitch === case2 ? 'case2' : 'default'),
                  timestamp: Date.now()
                };
                
              } catch (error) {
                console.error('Failed to execute switch-case:', error);
              }
            }`;
            default:
              return `console.log('Action not implemented in preview:', ${JSON.stringify(a.id)});`;
          }
        })
        .join('\n');

      // Trigger type mapping
      let triggerCode = '';
      const tcfg: any = trigger.config || {};
      switch (trigger.id) {
        case 'page-load':
          triggerCode = `{
  console.log('Page load trigger registered');
  
  if (document.readyState === 'loading') {
    // Page still loading, wait for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
      console.log('DOMContentLoaded event fired');
      ${actionsCode}
    });
  } else {
    // Page already loaded, execute immediately
    console.log('Page already loaded, executing immediately');
    ${actionsCode}
  }
}`;
          break;
        case 'url-change':
          triggerCode = `{
  console.log('URL change trigger registered');
  
  // Handle hash changes
  window.addEventListener('hashchange', () => {
    console.log('Hash changed to:', window.location.hash);
    ${actionsCode}
  });
  
  // Handle pushState/replaceState changes (SPA navigation)
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(...args) {
    originalPushState.apply(this, args);
    console.log('pushState called, new URL:', window.location.href);
    ${actionsCode}
  };
  
  history.replaceState = function(...args) {
    originalReplaceState.apply(this, args);
    console.log('replaceState called, new URL:', window.location.href);
    ${actionsCode}
  };
  
  // Handle popstate (browser back/forward)
  window.addEventListener('popstate', () => {
    console.log('popstate event, current URL:', window.location.href);
    ${actionsCode}
  });
}`;
          break;
        case 'click-element':
          triggerCode = `{
  const selector = \`${serialize(tcfg.selector || '')}\`;
  if (!selector) {
    console.warn('No selector provided for click-element trigger');
    return;
  }
  
  console.log('Click trigger registered for selector:', selector);
  
  document.addEventListener('click', (e) => {
    const target = e.target as Element;
    
    if (target && target.matches && target.matches(selector)) {
      console.log('Click trigger activated on element:', target);
      e.preventDefault();
      e.stopPropagation();
      ${actionsCode}
    }
  });
}`;
          break;
        case 'hover-element':
          triggerCode = `{
  const selector = \`${serialize(tcfg.selector || '')}\`;
  if (!selector) {
    console.warn('No selector provided for hover-element trigger');
    return;
  }
  
  console.log('Hover trigger registered for selector:', selector);
  
  document.addEventListener('mouseover', (e) => {
    const target = e.target as Element;
    if (target && target.matches && target.matches(selector)) {
      console.log('Hover trigger activated on element:', target);
      ${actionsCode}
    }
  }, { passive: true });
}`;
          break;
        case 'form-submit':
          triggerCode = `{
  const selector = \`${serialize(tcfg.selector || 'form')}\`;
  console.log('Form submit trigger registered for selector:', selector);
  
  document.addEventListener('submit', (e) => {
    const target = e.target as Element;
    if (target && target.matches && target.matches(selector)) {
      console.log('Form submit trigger activated on element:', target);
      // Allow user to prevent default via a flag later if needed
      ${actionsCode}
    }
  });
}`;
          break;
        case 'keyboard-shortcut': {
          const shortcut = tcfg.shortcut || 'Control+k';
          const parts = shortcut.toLowerCase().split('+');
          const key = parts[parts.length - 1];
          const hasCtrl = parts.includes('control') || parts.includes('ctrl');
          const hasShift = parts.includes('shift');
          const hasAlt = parts.includes('alt');
          
          triggerCode = `document.addEventListener('keydown', (e) => {
  // Check if the pressed key matches our shortcut
  const keyMatch = e.key.toLowerCase() === '${key}';
  const ctrlMatch = ${hasCtrl} ? e.ctrlKey : true;
  const shiftMatch = ${hasShift} ? e.shiftKey : true;
  const altMatch = ${hasAlt} ? e.altKey : true;
  
  if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
    console.log('Keyboard shortcut triggered: ${shortcut}');
    ${actionsCode}
  }
});`;
          break; }
        case 'scroll-event':
          triggerCode = `{
  console.log('Scroll trigger registered');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        ${actionsCode}
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}`;
          break;
        case 'timer':
          triggerCode = `{
  const delay = ${Number(tcfg.ms || 2000)};
  console.log(\`Timer started: \${delay}ms delay\`);
  
  setTimeout(() => {
    console.log('Timer triggered after', delay, 'ms');
    ${actionsCode}
  }, delay);
}`;
          break;
        case 'interval':
          triggerCode = `{
  const interval = ${Number(tcfg.ms || 5000)};
  console.log(\`Interval started: \${interval}ms interval\`);
  
  const intervalId = setInterval(() => {
    console.log('Interval triggered at', new Date().toISOString());
    ${actionsCode}
  }, interval);
  
  // Store interval ID for potential cleanup
  window.extensifyIntervals = window.extensifyIntervals || [];
  window.extensifyIntervals.push(intervalId);
}`;
          break;
        default:
          triggerCode = `console.log('Trigger not implemented in preview:', ${JSON.stringify(trigger.id)});`;
      }
      triggerHandlers.push(triggerCode);
    }

    return triggerHandlers.join('\n\n');
  }

  function generateContentScript() {
    const workflow = generateContentWorkflowCode();
    const script = `// Auto-generated by Extensify
console.log('Extensify content script loaded');

// Dark mode state
let isDarkMode = false;

// Toggle dark mode function
function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  if (isDarkMode) {
    document.documentElement.style.filter = 'invert(0.93) hue-rotate(180deg)';
    // Fix images and videos
    const mediaElements = document.querySelectorAll('img, video, picture, canvas');
    mediaElements.forEach(el => {
      (el as HTMLElement).style.filter = 'invert(1) hue-rotate(180deg)';
    });
  } else {
    document.documentElement.style.filter = '';
    const mediaElements = document.querySelectorAll('img, video, picture, canvas');
    mediaElements.forEach(el => {
      (el as HTMLElement).style.filter = '';
    });
  }
}

// Listen for messages from background script
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.action === 'toggle-dark-mode') {
      toggleDarkMode();
      sendResponse({ success: true });
    }
    
    // Handle preview PING and respond with PONG
    if (message && message.type === 'PING') {
      if (chrome.runtime.sendMessage) { 
        chrome.runtime.sendMessage({ type: 'PONG', at: Date.now() }); 
      }
    }
  });
}

// Workflow from builder
${workflow}`;
    return script;
  }

  function generatePopupHtml() {
    const html = `<!doctype html>\n<html>\n<head>\n  <meta charset=\"utf-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n  <title>${exportName || 'Extensify Extension'}</title>\n  <link rel=\"stylesheet\" href=\"styles.css\"/>\n</head>\n<body>\n  <div id=\"app\">${exportDescription || 'Your extension is ready.'}</div>\n  <script src=\"popup.js\"></script>\n</body>\n</html>`;
    return html;
  }

  function generatePopupJs() {
    return `// Auto-generated by Extensify\nconsole.log('Popup loaded');\nif (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {\n  // Simple demo to ping content\n  setTimeout(()=>{ try { chrome.runtime.sendMessage({ type: 'PING', from: 'popup' }); } catch(e){} }, 500);\n}\n`;
  }

  function generateStyles() {
    return `/* Auto-generated by Extensify */\nbody{font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:12px;min-width:280px}\n#app{font-size:14px}`;
  }

  // Generate a simple PNG icon for the extension
  function generateIconData(size: number): string {
    // Create a canvas to generate PNG data
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    // Draw rounded rectangle background
    const radius = size * 0.1;
    ctx.fillStyle = '#3B82F6';
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fill();
    
    // Draw "E" letter
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${size * 0.6}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('E', size / 2, size / 2);
    
    // Convert to base64 PNG
    return canvas.toDataURL('image/png').split(',')[1];
  }

  async function handleDownloadZip() {
    try {
      const { default: JSZip } = await import('jszip');
      const fsMod: any = await import('file-saver');
      const saveAs = fsMod.saveAs || fsMod.default;
      const zip = new JSZip();
      
      // Add extension files
      zip.file('manifest.json', generateManifest());
      zip.file('background.js', generateBackground());
      zip.file('content.js', generateContentScript());
      zip.file('popup.html', generatePopupHtml());
      zip.file('popup.js', generatePopupJs());
      zip.file('styles.css', generateStyles());
      
      // Add icon files (required by Chrome)
      zip.file('icons/icon16.png', generateIconData(16), { base64: true });
      zip.file('icons/icon32.png', generateIconData(32), { base64: true });
      zip.file('icons/icon48.png', generateIconData(48), { base64: true });
      zip.file('icons/icon128.png', generateIconData(128), { base64: true });

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `${(exportName || 'extensify').replace(/\s+/g, '-')}.zip`);
      toast.success('ZIP downloaded');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate ZIP');
    }
  }

  async function handleCopyCode() {
    const files = {
      'manifest.json': generateManifest(),
      'background.js': generateBackground(),
      'content.js': generateContentScript(),
      'popup.html': generatePopupHtml(),
      'popup.js': generatePopupJs(),
      'styles.css': generateStyles(),
    };
    const bundle = Object.entries(files)
      .map(([name, content]) => `// ${name}\n${content}`)
      .join('\n\n');
    try {
      await navigator.clipboard.writeText(bundle);
      toast.success('Code copied to clipboard');
    } catch (e) {
      console.error(e);
      toast.error('Copy failed');
    }
  }

  function rebuildPreviews() {
    // Revoke previous object URLs
    previousObjectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    previousObjectUrlsRef.current = [];

    // Popup Preview: inline CSS and JS with preview bridge
    const popupHtml = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${exportName || 'Extensify Extension'} — Preview</title>
  <style>${generateStyles()}</style>
  <style>html,body{background:#fff}</style>
  </head>
<body>
  <div id="app">${exportDescription || 'Your extension is ready.'}</div>
  <script>
    (function(){
      (window as any).chrome = (window as any).chrome || {};
      (window as any).chrome.runtime = (window as any).chrome.runtime || {};
      const listeners:any[] = [];
      (window as any).chrome.runtime.onMessage = { addListener:(fn:any)=>listeners.push(fn) };
      (window as any).chrome.runtime.sendMessage = (msg:any)=>{
        parent.postMessage({ __EXTENSIFY_BRIDGE__: true, from:'popup', msg }, '*');
      };
      window.addEventListener('message', (e)=>{
        const d:any = (e as any).data;
        if(d && d.__EXTENSIFY_TO==='iframe' && d.target==='popup'){
          listeners.forEach(fn=>{ try{ fn(d.msg, {}, ()=>{}); }catch(_){} });
        }
      });
    })();
  </script>
  <script>${generatePopupJs()}</script>
</body>
</html>`;
    const popupBlob = new Blob([popupHtml], { type: 'text/html' });
    const popupUrl = URL.createObjectURL(popupBlob);
    previousObjectUrlsRef.current.push(popupUrl);
    setPopupPreviewSrc(popupUrl);

    // Content Script Preview: simple page + inline content script and bridge
    const contentHtml = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Content Script Preview</title>
  <style>
    body{font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#fafafa;margin:0;padding:24px;color:#111}
    .line{height:12px;border-radius:6px;background:#e5e7eb;margin:10px 0}
    .w-75{width:75%}.w-50{width:50%}.w-85{width:85%}
    .card{background:#fff;border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,.07);padding:20px}
  </style>
</head>
<body>
  <div class="card">
    <h1 style="margin-top:0">Simulated Webpage</h1>
    <div class="line"></div>
    <div class="line w-75"></div>
    <div class="line w-50"></div>
    <div class="line w-85"></div>
  </div>
  <script>window.__EXTENSIFY_PREVIEW__=true;</script>
  <script>
    (function(){
      (window as any).chrome = (window as any).chrome || {};
      (window as any).chrome.runtime = (window as any).chrome.runtime || {};
      const listeners:any[] = [];
      (window as any).chrome.runtime.onMessage = { addListener:(fn:any)=>listeners.push(fn) };
      (window as any).chrome.runtime.sendMessage = (msg:any)=>{
        parent.postMessage({ __EXTENSIFY_BRIDGE__: true, from:'content', msg }, '*');
      };
      window.addEventListener('message', (e)=>{
        const d:any = (e as any).data;
        if(d && d.__EXTENSIFY_TO==='iframe' && d.target==='content'){
          listeners.forEach(fn=>{ try{ fn(d.msg, {}, ()=>{}); }catch(_){} });
        }
      });
    })();
  </script>
  <script>${generateContentScript()}</script>
</body>
</html>`;
    const contentBlob = new Blob([contentHtml], { type: 'text/html' });
    const contentUrl = URL.createObjectURL(contentBlob);
    previousObjectUrlsRef.current.push(contentUrl);
    setContentPreviewSrc(contentUrl);
  }

  useEffect(() => {
    rebuildPreviews();
    return () => {
      previousObjectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      previousObjectUrlsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exportName, exportDescription, canvasBlocks]);

  // Parent bridge to forward messages between preview iframes
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data: any = (e as any).data;
      if (!data || !data.__EXTENSIFY_BRIDGE__) return;
      if (data.from === 'popup' && contentIframeRef.current?.contentWindow) {
        contentIframeRef.current.contentWindow.postMessage({ __EXTENSIFY_TO: 'iframe', target: 'content', msg: data.msg }, '*');
      } else if (data.from === 'content' && popupIframeRef.current?.contentWindow) {
        popupIframeRef.current.contentWindow.postMessage({ __EXTENSIFY_TO: 'iframe', target: 'popup', msg: data.msg }, '*');
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleDragStart = (block: Block) => {
    setDraggedBlock(block);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const toCanvasCoords = (clientX: number, clientY: number, rect: DOMRect) => {
    const x = (clientX - rect.left - canvasOffset.x) / zoomScale;
    const y = (clientY - rect.top - canvasOffset.y) / zoomScale;
    return { x, y };
  };

  const snapValue = (value: number) => Math.round(value / gridSize) * gridSize;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedBlock) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      let { x, y } = toCanvasCoords(e.clientX, e.clientY, rect);

      // Offset new blocks so they don't stack on top of each other
      const offsetX = (canvasBlocks.length % 3) * 220; // 220px spacing
      const offsetY = Math.floor(canvasBlocks.length / 3) * 120; // 120px spacing

      if (snappingEnabled) {
        x = snapValue(x);
        y = snapValue(y);
      }

      const newBlock: CanvasBlock = {
        ...draggedBlock,
        instanceId: `${draggedBlock.id}-${Date.now()}`,
        config: draggedBlock.config || {},
        position: { x: x + offsetX, y: y + offsetY },
        connections: [],
      };
      const newBlocks = [...canvasBlocks, newBlock];
      setCanvasBlocks(newBlocks);
      setDraggedBlock(null);
      // Auto-save when blocks are added
      if (currentProject) {
        saveProject(newBlocks);
      }
    }
  };

  const removeFromCanvas = (blockId: string) => {
    const newBlocks = canvasBlocks.filter(
      block => block.instanceId !== blockId
    );
    setCanvasBlocks(newBlocks);
    // Auto-save when blocks are removed
    if (currentProject) {
      saveProject(newBlocks);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError(res.error);
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        await signIn('credentials', { email, password, redirect: false });
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Registration failed');
    }
    setLoading(false);
  };

  const handleSocialLogin = (provider: string) => {
    signIn(provider);
  };

  // Project management handlers
  // Function to restore icon components for blocks loaded from database
  const restoreBlockIcons = (blocks: any[]): CanvasBlock[] => {
    return blocks.map((block: any) => {
      // Find the original block definition to get the icon component
      const originalBlock = availableBlocks.find(b => b.id === block.id);
      return {
        ...block,
        icon: originalBlock?.icon || Settings, // Fallback to Settings icon
        config: block.config || {},
        instanceId: block.instanceId || `${block.id}-${Date.now()}`,
        connections: block.connections || [], // Ensure connections array exists
        position: block.position || { x: 0, y: 0 }, // Ensure position exists
      };
    });
  };

  const handleProjectSelect = (project: any) => {
    setCurrentProject(project);
    // Restore icon components and ensure proper config objects
    const blocksWithIcons = restoreBlockIcons(project.blocks || []);
    setCanvasBlocks(blocksWithIcons);
    setCurrentView('builder');
  };

  const handleNewProject = () => {
    setCurrentProject(null);
    setCanvasBlocks([]);
    setCurrentView('builder');
  };

  // Create new project from builder
  const handleCreateProject = async () => {
    if (!newProjectName.trim() || !session?.user) return;

    setCreating(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDescription,
          blocks: canvasBlocks,
          settings: {},
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newProject = data.project;
        setCurrentProject(newProject);
        setShowCreateDialog(false);
        setNewProjectName('');
        setNewProjectDescription('');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setCreating(false);
    }
  };

  // Open block configuration dialog
  const openBlockConfig = (block: CanvasBlock) => {
    console.log('=== openBlockConfig FUNCTION CALLED ===');
    console.log('Opening block config for:', block);
    console.log('Block type:', block.type);
    console.log('Block title:', block.title);
    setConfiguringBlock(block);
    setShowConfigDialog(true);
    console.log('showConfigDialog set to true, configuringBlock set to:', block);
    console.log('=== END openBlockConfig ===');
  };

  // Save block configuration
  const saveBlockConfig = (config: BlockConfig) => {
    if (!configuringBlock) return;

    const updatedBlocks = canvasBlocks.map(block =>
      block.instanceId === configuringBlock.instanceId
        ? { ...block, config: config || {} }
        : block
    );
    setCanvasBlocks(updatedBlocks);
    setShowConfigDialog(false);
    setConfiguringBlock(null);

    // Auto-save when configuration changes
    if (currentProject) {
      saveProject(updatedBlocks);
    }
  };

  // Canvas interaction functions
  // (moved into unified handler closer to pan/zoom section)

  const handleBlockDragStart = (e: React.MouseEvent, block: CanvasBlock) => {
    e.stopPropagation();
    const canvasElement = document.querySelector('.canvas-container');
    if (canvasElement) {
      const rect = canvasElement.getBoundingClientRect();
      // Adjust for canvas padding so the cursor lines up exactly with the block position
      const canvasX =
        (e.clientX - rect.left - canvasPaddingPx - canvasOffset.x) / zoomScale;
      const canvasY =
        (e.clientY - rect.top - canvasPaddingPx - canvasOffset.y) / zoomScale;
      const offsetX = canvasX - block.position.x;
      const offsetY = canvasY - block.position.y;
      setDragOffset({ x: offsetX, y: offsetY });
    }
    setDraggingBlock(block);
  };

  const handleBlockDrag = (e: React.MouseEvent, block: CanvasBlock) => {
    if (!draggingBlock || draggingBlock.instanceId !== block.instanceId) return;
    const rect = (
      e.currentTarget.closest('.canvas-container') as HTMLElement | null
    )?.getBoundingClientRect();
    if (!rect) return;
    const xAbs =
      (e.clientX - rect.left - canvasPaddingPx - canvasOffset.x) / zoomScale -
      dragOffset.x;
    const yAbs =
      (e.clientY - rect.top - canvasPaddingPx - canvasOffset.y) / zoomScale -
      dragOffset.y;
    const updatedBlocks = canvasBlocks.map(b =>
      b.instanceId === block.instanceId
        ? { ...b, position: { x: xAbs, y: yAbs } }
        : b
    );
    setCanvasBlocks(updatedBlocks);
  };

  const handleBlockDragEnd = () => {
    setDraggingBlock(null);
    if (currentProject) {
      saveProject(canvasBlocks);
    }
  };

  // Add global mouse event listeners for better drag handling
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (draggingBlock) {
        const canvasElement = document.querySelector('.canvas-container');
        if (canvasElement) {
          const rect = canvasElement.getBoundingClientRect();
          const xAbs =
            (e.clientX - rect.left - canvasPaddingPx - canvasOffset.x) /
              zoomScale -
            dragOffset.x;
          const yAbs =
            (e.clientY - rect.top - canvasPaddingPx - canvasOffset.y) /
              zoomScale -
            dragOffset.y;
          const current = canvasBlocks.find(
            b => b.instanceId === draggingBlock.instanceId
          );
          const deltaX = xAbs - (current?.position.x || 0);
          const deltaY = yAbs - (current?.position.y || 0);
          const blockElement = document.querySelector(
            `[data-block-id="${draggingBlock.instanceId}"]`
          );
          if (blockElement) {
            (blockElement as HTMLElement).style.transform =
              `translate(${deltaX}px, ${deltaY}px)`;
          }
        }
      }
      if (isPanning && panStart) {
        // Panning background with mouse
        setCanvasOffset({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
      }
      if (isPanning && panStart) {
        setCanvasOffset({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
      }
    };

    const handleGlobalMouseUp = () => {
      if (draggingBlock) {
        const canvasElement = document.querySelector('.canvas-container');
        if (canvasElement) {
          const blockElement = document.querySelector(
            `[data-block-id="${draggingBlock.instanceId}"]`
          );
          if (blockElement) {
            const transform = (blockElement as HTMLElement).style.transform;
            const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
            if (match) {
              let deltaX = parseFloat(match[1]);
              let deltaY = parseFloat(match[2]);
              const updatedBlocks = canvasBlocks.map(b => {
                if (b.instanceId !== draggingBlock.instanceId) return b;
                let newX = b.position.x + deltaX;
                let newY = b.position.y + deltaY;
                if (snappingEnabled) {
                  newX = snapValue(newX);
                  newY = snapValue(newY);
                }
                return { ...b, position: { x: newX, y: newY } };
              });
              setCanvasBlocks(updatedBlocks);
              (blockElement as HTMLElement).style.transform = '';
            }
          }
        }
        handleBlockDragEnd();
      }
      if (isPanning) {
        setIsPanning(false);
        setPanStart(null);
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [
    draggingBlock,
    canvasBlocks,
    dragOffset,
    isPanning,
    panStart,
    snappingEnabled,
  ]);

  const handleConnectStart = (blockId: string) => {
    setConnectingFrom(blockId);
  };

  const handleConnectEnd = (targetBlockId: string) => {
    if (!connectingFrom || connectingFrom === targetBlockId) {
      setConnectingFrom(null);
      return;
    }

    const updatedBlocks = canvasBlocks.map(block => {
      if (block.instanceId === connectingFrom) {
        return {
          ...block,
          connections: [...block.connections, targetBlockId],
        };
      }
      return block;
    });

    setCanvasBlocks(updatedBlocks);
    setConnectingFrom(null);

    if (currentProject) {
      saveProject(updatedBlocks);
    }
  };

  const removeConnection = (fromBlockId: string, toBlockId: string) => {
    const updatedBlocks = canvasBlocks.map(block => {
      if (block.instanceId === fromBlockId) {
        return {
          ...block,
          connections: block.connections.filter(id => id !== toBlockId),
        };
      }
      return block;
    });

    setCanvasBlocks(updatedBlocks);
    if (currentProject) {
      saveProject(updatedBlocks);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Start panning when clicking anywhere on the canvas that's not a block or controls
    const target = e.target as HTMLElement;
    const clickedBlock = target.closest('[data-block-id]');
    const clickedControls = target.closest('.canvas-controls');
    if (!clickedBlock && !clickedControls) {
      setIsPanning(true);
      setPanStart({
        x: e.clientX - canvasOffset.x,
        y: e.clientY - canvasOffset.y,
      });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning && panStart) {
      setCanvasOffset({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return; // avoid dragging blocks while panning
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left + canvasOffset.x;
    const y = e.clientY - rect.top + canvasOffset.y;
    setMousePosition({ x, y });
  };

  const handleCanvasMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      setPanStart(null);
    }
  };

  // Auto-save project when blocks change
  const saveProject = async (blocks: CanvasBlock[]) => {
    if (!currentProject || !session?.user) return;

    setSaving(true);
    try {
      await fetch(`/api/projects/${currentProject._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks: blocks,
          updatedAt: new Date(),
        }),
      });
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    signOut();
  };

  const renderNavbar = () => (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-700/50 dark:border-slate-800/50 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center shadow-lg group-hover:shadow-indigo-400/50 transition-all duration-300 group-hover:scale-110">
                  <Chrome className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-lg blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
              </div>
              <span className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:via-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                Extensify
              </span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {[
                { key: 'dashboard', label: 'Dashboard', icon: User },
                { key: 'templates', label: 'Templates', icon: Sparkles },
                { key: 'builder', label: 'Builder', icon: Code },
                { key: 'preview', label: 'Preview', icon: Eye },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setCurrentView(key as View)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 group ${
                    currentView === key
                      ? 'text-white bg-white/10 shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  {currentView === key && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 group"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 group-hover:text-amber-400 transition-colors duration-300" />
              ) : (
                <Moon className="w-5 h-5 group-hover:text-blue-400 transition-colors duration-300" />
              )}
            </button>

            {/* User Section */}
            {!session ? (
              <Button
                onClick={() => router.push('/login')}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105"
              >
                Sign In
              </Button>
            ) : (
              <div className="flex items-center space-x-3">
                {/* User Info */}
                <div className="hidden sm:flex items-center space-x-3 text-right">
                  <div>
                    <div className="text-sm font-medium text-white">
                      {session.user?.name?.split(' ')[0] || 'User'}
                    </div>
                    <div className="text-xs text-slate-400">
                      {session.user?.email}
                    </div>
                  </div>
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt="avatar"
                      className="w-9 h-9 rounded-full ring-2 ring-indigo-400/30 hover:ring-indigo-400/60 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center ring-2 ring-indigo-400/30">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-all duration-300 border border-slate-600 hover:border-red-400/50"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  // Enhanced renderDashboard with better visual appeal
  const renderDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-indigo-200 dark:text-indigo-900/30 animate-float">
          <Chrome className="w-12 h-12 animate-spin-slow" />
        </div>
        <div className="absolute top-40 right-20 text-purple-200 dark:text-purple-900/30 animate-float-delayed">
          <Zap className="w-8 h-8" />
        </div>
        <div className="absolute bottom-40 right-10 text-pink-200 dark:text-pink-900/30 animate-bounce-slow">
          <Sparkles className="w-10 h-10" />
        </div>
        <div className="absolute bottom-60 left-16 text-cyan-200 dark:text-cyan-900/30 animate-float">
          <Code className="w-9 h-9" />
        </div>
        <div className="absolute top-1/3 right-1/4 text-green-200 dark:text-green-900/30 animate-float-delayed">
          <Palette className="w-7 h-7" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {session ? (
          <div className="animate-fade-in-up">
            {/* Enhanced Welcome Section */}
            <div className="mb-12">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/95 to-indigo-50/80 dark:from-slate-900/95 dark:to-indigo-950/50 p-8 shadow-2xl border border-white/50 dark:border-slate-800/50 backdrop-blur-sm">
                {/* Animated Background Blobs */}
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl animate-pulse-gentle" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl animate-pulse-gentle animation-delay-200" />
                
                {/* Simplified Header */}
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg hover:scale-110 transition-transform duration-300">
                      <Chrome className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Welcome back, {session.user?.name?.split(' ')[0] || 'Creator'}!
                      </h1>
                      <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                        Ready to build something amazing?
                      </p>
                    </div>
                  </div>


                </div>
              </div>
            </div>

            {/* Projects Section */}
            <div className="animate-fade-in-up animation-delay-200">
              <ProjectManager
                onProjectSelect={handleProjectSelect}
                onNewProject={handleNewProject}
                onCreateAndEdit={project => {
                  setCurrentProject(project);
                  const blocksWithIcons = restoreBlockIcons(project.blocks || []);
                  setCanvasBlocks(blocksWithIcons);
                  setCurrentView('builder');
                }}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="max-w-2xl mx-auto">
              <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center animate-pulse-gentle">
                <Chrome className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-6">
                Welcome to Extensify
              </h1>
              <p className="text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
                Build Chrome extensions without writing code
              </p>
              <Button
                onClick={() => router.push('/login')}
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white px-12 py-4 text-xl font-semibold hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/25"
              >
                <Plus className="w-6 h-6 mr-3" />
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-indigo-950/40 dark:to-purple-950/40">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Templates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {extensionTemplates.map(t => (
            <div key={t.key} className="p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg border-0 shadow hover:shadow-lg transition">
              <div className="font-medium text-gray-900 dark:text-gray-100">{t.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t.description}</div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                  onClick={() => {
                    const idMap = new Map<string, string>();
                    const now = Date.now();
                    const templBlocks: CanvasBlock[] = t.blocks.map((tb, idx) => {
                      const def = availableBlocks.find(b => b.id === tb.id);
                      const instanceId = `${tb.id}-${now}-${idx}`;
                      idMap.set(tb.key, instanceId);
                      return {
                        ...(def as any),
                        instanceId,
                        config: tb.config || {},
                        position: { x: 120 + (idx % 3) * 240, y: 120 + Math.floor(idx / 3) * 140 },
                        connections: [],
                      } as CanvasBlock;
                    });
                    t.blocks.forEach(tb => {
                      const fromId = idMap.get(tb.key)!;
                      const toKeys = tb.connectTo || t.blocks
                        .filter(n => n.key !== tb.key && n.type === 'action')
                        .map(n => n.key);
                      const from = templBlocks.find(b => b.instanceId === fromId);
                      if (from) from.connections = toKeys.map(k => idMap.get(k)!).filter(Boolean);
                    });
                    setCanvasBlocks(templBlocks);
                    setExportName(t.name);
                    setExportDescription(t.description);
                    setCurrentView('builder');
                  }}
                >
                  Use Template
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Updated renderBuilder to use local state/handlers
  const renderBuilder = () => (
    <div className="flex h-[calc(100vh-4rem)] relative">
      {/* Side Panel */}
      <div
        className={`transition-all duration-300 ease-in-out h-full overflow-y-auto overflow-x-hidden bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-gray-900 dark:to-gray-800/50 border-r dark:border-gray-700 ${sidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 shadow">
                <Boxes className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="sr-only">Available Blocks</span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSidebarOpen(false)}
              title="Close blocks panel"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
          <Accordion
            type="multiple"
            className="space-y-2 transition-all duration-300 ease-in-out"
          >
            {[
              'Page Events',
              'User Interactions',
              'Timers',
              'Logic & Control',
              'Content Injection',
              'Style Modifications',
              'Element Actions',
              'Notifications',
              'Navigation',
              'Data Operations',
              'API Operations',
              'AI & Automation',
            ].map(category => {
              const categoryBlocks = availableBlocks.filter(
                block => block.category === category
              );
              if (categoryBlocks.length === 0) return null;
              return (
                <AccordionItem
                  key={category}
                  value={category}
                  className="border rounded-md dark:border-gray-700 bg-white/60 dark:bg-gray-800/40 transition-all duration-200"
                >
                  <AccordionTrigger className="px-3">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {category}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-1">
                    <div className="space-y-2">
                      {categoryBlocks.map(block => (
                        <div
                          key={block.id}
                          draggable
                          onDragStart={() => handleDragStart(block)}
                          className={`p-3 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-700/80 rounded-lg border-0 cursor-move hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 hover:scale-[1.02] ${block.gradient} ${block.darkGradient}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-lg shadow-sm ${block.color} ${block.darkColor}`}
                            >
                              <block.icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm dark:text-white truncate">
                                {block.title}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {block.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
      {!sidebarOpen && (
        <div className="absolute left-3 top-24 z-40">
          <Button
            variant="default"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full shadow hover:shadow-lg transition-shadow"
          >
            <Boxes className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="sr-only">Open blocks panel</span>
          </Button>
        </div>
      )}
      {/* Canvas */}
      <div
        className={`flex flex-col min-h-0 bg-gradient-to-br from-white via-gray-50/30 to-white dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900 ${sidebarOpen ? 'flex-1' : 'flex-[1_1_100%]'}`}
      >
        <div className="py-2 px-3 border-b dark:border-gray-700 bg-gradient-to-r from-transparent to-gray-50/50 dark:to-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm md:text-base font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {currentProject ? currentProject.name : (exportName || 'Extension Builder')}
              </h2>
              <p className="hidden md:block text-xs text-gray-600 dark:text-gray-400">
                {currentProject ? (
                  `Editing project: ${currentProject.description || 'No description'}`
                ) : (
                  <span className="flex items-center">
                    <span>
                      {exportDescription || 'Drag blocks from the sidebar to build your extension logic'}
                    </span>
                    {canvasBlocks.length > 0 && (
                      <span className="ml-2 text-orange-600 dark:text-orange-400 text-sm">
                        • Unsaved work
                      </span>
                    )}
                  </span>
                )}
              </p>
            </div>
            {currentProject ? (
              <div className="flex items-center space-x-2">
                {saving && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                    <span>Saving...</span>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView('dashboard')}
                  className="text-xs h-7 px-3"
                >
                  Back to Projects
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView('dashboard')}
                  className="text-xs h-7 px-3"
                >
                  Back to Projects
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowCreateDialog(true)}
                  className="text-xs h-7 px-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                >
                  Create New Project
                </Button>
              </div>
            )}
          </div>
        </div>
        <div
          ref={canvasRef}
          className="canvas-container relative flex-1 min-h-0 p-6 bg-gradient-to-br from-gray-50/30 via-transparent to-gray-50/30 dark:from-gray-800/30 dark:via-transparent dark:to-gray-800/30 overflow-hidden"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onMouseMove={handleCanvasMouseMove}
          onMouseDown={handleCanvasMouseDown}
          onMouseUp={handleCanvasMouseUp}
          onWheel={e => {
            // Mouse wheel should zoom; trackpad two-finger scroll pans; pinch zoom zooms
            if (!document.body.contains(e.currentTarget as Node)) return;
            e.preventDefault();
            const rect = (
              e.currentTarget as HTMLElement
            ).getBoundingClientRect();
            const cursorX = e.clientX - rect.left;
            const cursorY = e.clientY - rect.top;
            const deltaZ = Math.abs((e as any).deltaZ || 0);
            const isPinchZoom = e.ctrlKey || deltaZ > 0;
            const isMouseWheel =
              !isPinchZoom &&
              Math.abs(e.deltaY) >= 50 &&
              Math.abs(e.deltaX) < 1;

            if (isPinchZoom || isMouseWheel) {
              const factor = isPinchZoom
                ? Math.exp(-e.deltaY * 0.0015)
                : e.deltaY < 0
                  ? 1.1
                  : 0.9;
              setZoomScale(prev => {
                const newZoom = Math.min(2.5, Math.max(0.4, prev * factor));
                const worldX = (cursorX - canvasOffset.x) / prev;
                const worldY = (cursorY - canvasOffset.y) / prev;
                const newOffsetX = cursorX - worldX * newZoom;
                const newOffsetY = cursorY - worldY * newZoom;
                setCanvasOffset({ x: newOffsetX, y: newOffsetY });
                return parseFloat(newZoom.toFixed(4));
              });
            } else {
              // Two-finger scroll pans the canvas
              setCanvasOffset(prev => ({
                x: prev.x - e.deltaX,
                y: prev.y - e.deltaY,
              }));
            }
          }}
          style={{ cursor: isPanning ? 'grabbing' : 'default' }}
          onMouseEnter={() => setIsCanvasHovered(true)}
          onMouseLeave={() => setIsCanvasHovered(false)}
        >
          {/* Grid background overlay */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  `linear-gradient(to right, rgba(107,114,128,0.15) 1px, transparent 1px),` +
                  `linear-gradient(to bottom, rgba(107,114,128,0.15) 1px, transparent 1px)`,
                backgroundSize: `${gridSize * zoomScale}px ${gridSize * zoomScale}px`,
                backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`,
              }}
            />
          )}

          {/* Pan/zoom wrapper for blocks */}
          <div
            className="absolute inset-0"
            style={{
              transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoomScale})`,
              transformOrigin: '0 0',
              willChange: 'transform',
            }}
          >
            {/* Connection Lines */}
            {canvasBlocks.map(block =>
              (block.connections || []).map(connectionId => (
                <ConnectionLine
                  key={`${block.instanceId}-${connectionId}`}
                  from={block.instanceId}
                  to={connectionId}
                  blocks={canvasBlocks}
                  connectingFrom={connectingFrom}
                />
              ))
            )}

            {canvasBlocks.length === 0 ? (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-lg bg-gradient-to-br from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-700/50">
                <div className="text-center">
                  <Settings className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Drag blocks here to start building
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                {canvasBlocks.map((block, index) => (
                  <Card
                    key={block.instanceId}
                    data-block-id={block.instanceId}
                    className={`absolute group border-0 shadow-lg hover:shadow-xl transition-all duration-200 ${block.gradient} ${block.darkGradient} w-48 cursor-move select-none`}
                    style={{
                      left: block.position.x,
                      top: block.position.y,
                      zIndex:
                        draggingBlock?.instanceId === block.instanceId ? 10 : 2,
                      userSelect: 'none',
                      transition:
                        draggingBlock?.instanceId === block.instanceId
                          ? 'none'
                          : 'all 0.2s ease',
                    }}
                    onMouseDown={e => handleBlockDragStart(e, block)}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      (e as any).nativeEvent?.stopImmediatePropagation?.();
                      openBlockConfig(block);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg shadow-sm ${block.color} ${block.darkColor}`}
                        >
                          <block.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium dark:text-white text-sm">
                            {block.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {block.description}
                          </div>
                          {block.config &&
                            Object.keys(block.config).length > 0 && (
                              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                                ✓ Configured
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Connection Points */}
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              e.nativeEvent.stopImmediatePropagation();
                              openBlockConfig(block);
                            }}
                            style={{ zIndex: 1000, position: 'relative' }}
                            title="Configure block"
                          >
                            <Settings className="w-3 h-3" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              (e as any).nativeEvent?.stopImmediatePropagation?.();
                            }}
                            onMouseUp={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              (e as any).nativeEvent?.stopImmediatePropagation?.();
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              (e as any).nativeEvent?.stopImmediatePropagation?.();
                              removeFromCanvas(block.instanceId);
                            }}
                            style={{ zIndex: 1000, position: 'relative' }}
                            title="Remove block"
                          >
                            ×
                          </Button>
                        </div>

                        {/* Connection Buttons */}
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 w-6 p-0 rounded-full ${
                              connectingFrom === block.instanceId
                                ? 'bg-blue-500 text-white'
                                : 'hover:bg-green-100 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400'
                            }`}
                            onClick={() =>
                              connectingFrom === block.instanceId
                                ? setConnectingFrom(null)
                                : handleConnectStart(block.instanceId)
                            }
                            title={
                              connectingFrom === block.instanceId
                                ? 'Cancel connection'
                                : 'Start connection'
                            }
                          >
                            {connectingFrom === block.instanceId ? '✕' : '⚡'}
                          </Button>

                          {connectingFrom &&
                            connectingFrom !== block.instanceId && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 rounded-full bg-green-500 text-white hover:bg-green-600"
                                onClick={() =>
                                  handleConnectEnd(block.instanceId)
                                }
                                title="Connect to this block"
                              >
                                ✓
                              </Button>
                            )}
                        </div>
                      </div>

                      {/* Enhanced Visual Connection Ports - Now Clickable */}
                      <div className="absolute inset-0">
                        {/* Input Ports (Left side) */}
                        {(block.type === 'action' || block.type === 'condition') && (
                          <div 
                            className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer"
                            onClick={() => handleConnectEnd(block.instanceId)}
                            title="Connect to this block (input)"
                          >
                            <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg hover:scale-125 transition-transform duration-200 ${
                              connectingFrom && connectingFrom !== block.instanceId 
                                ? 'bg-green-500' 
                                : 'bg-blue-500'
                            }`} />
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-300 rounded-full" />
                          </div>
                        )}
                        
                        {/* Output Ports (Right side) */}
                        {(block.type === 'trigger' || block.type === 'condition') && (
                          <div 
                            className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer"
                            onClick={() => handleConnectStart(block.instanceId)}
                            title="Start connection from this block (output)"
                          >
                            <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg hover:scale-125 transition-transform duration-200 ${
                              connectingFrom === block.instanceId 
                                ? 'bg-orange-500' 
                                : 'bg-green-500'
                            }`} />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-300 rounded-full" />
                          </div>
                        )}
                      </div>

                      {/* Connection Status Indicator */}
                      {block.connections && block.connections.length > 0 && (
                        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                          {block.connections.length}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Canvas controls */}
          <div className="canvas-controls absolute right-4 bottom-4 flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg shadow p-2 border border-gray-200 dark:border-gray-700">
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                setZoomScale(s =>
                  Math.max(0.4, parseFloat((s * 0.9).toFixed(3)))
                )
              }
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <div className="px-2 text-sm text-gray-700 dark:text-gray-300 w-16 text-center">
              {Math.round(zoomScale * 100)}%
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                setZoomScale(s =>
                  Math.min(2.5, parseFloat((s * 1.1).toFixed(3)))
                )
              }
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
            <Button
              size="icon"
              variant={showGrid ? 'default' : 'ghost'}
              onClick={() => setShowGrid(v => !v)}
              title="Toggle grid"
            >
              <GridIcon className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant={snappingEnabled ? 'default' : 'ghost'}
              onClick={() => setSnappingEnabled(v => !v)}
              title="Toggle snap to grid"
            >
              <Magnet className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSidebarOpen(open => !open)}
              title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Preview Page
  const renderPreview = () => (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main Preview Area */}
      <div className="flex-1 bg-gradient-to-br from-white via-gray-50/30 to-white dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900">
        <div className="p-6 border-b dark:border-gray-700 bg-gradient-to-r from-transparent to-gray-50/50 dark:to-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {currentProject
                  ? `${currentProject.name} - Preview`
                  : 'Extension Preview'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {currentProject
                  ? `Previewing: ${currentProject.description || 'No description'}`
                  : 'Preview your extension before publishing'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('builder')}
                className="text-sm"
              >
                Back to Builder
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rebuildPreviews()}
                  className="text-sm"
                >
                  Refresh Preview
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowExportDialog(true)}
                  className="text-sm bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                >
                  Export Extension
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Extension Popup Preview */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200/50 dark:from-gray-800 dark:to-gray-700/50 rounded-lg p-6 shadow-inner">
              <div className="flex items-center space-x-2 mb-4">
                <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Extension Popup Preview
                </h3>
              </div>
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded border-0 shadow-lg p-3 min-h-[300px]">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Live Popup Preview</div>
                  <Button size="sm" variant="ghost" onClick={rebuildPreviews} className="h-7 px-2 text-xs">Refresh</Button>
                </div>
                <iframe
                  key={popupPreviewSrc}
                  src={popupPreviewSrc}
                  title="Popup Preview"
                  className="w-full h-[320px] rounded border"
                  ref={popupIframeRef}
                />
              </div>
            </div>

            {/* Content Script Preview */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200/50 dark:from-gray-800 dark:to-gray-700/50 rounded-lg p-6 shadow-inner">
              <div className="flex items-center space-x-2 mb-4">
                <Code className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Content Script Preview
                </h3>
              </div>
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded border-0 shadow-lg p-3 min-h-[300px]">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Live Content Script Preview</div>
                  <Button size="sm" variant="ghost" onClick={rebuildPreviews} className="h-7 px-2 text-xs">Refresh</Button>
                </div>
                <iframe
                  key={contentPreviewSrc}
                  src={contentPreviewSrc}
                  title="Content Preview"
                  className="w-full h-[320px] rounded border"
                  ref={contentIframeRef}
                />
              </div>
            </div>
          </div>

          {/* Extension Details */}
          <div className="mt-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Extension Details
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {canvasBlocks.length}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Total Blocks
                </div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {canvasBlocks.filter(b => b.type === 'trigger').length}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Triggers
                </div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {canvasBlocks.filter(b => b.type === 'action').length}
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400">
                  Actions
                </div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {
                    canvasBlocks.filter(
                      b => b.config && Object.keys(b.config).length > 0
                    ).length
                  }
                </div>
                <div className="text-sm text-orange-600 dark:text-orange-400">
                  Configured
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  if (!session) {
    return <LandingPage />;
  }

  // Main app content for authenticated users
  let content;

  if (currentView === 'dashboard') {
    content = renderDashboard();
  } else if (currentView === 'builder') {
    // Only allow builder for logged-in users
    if (!session) {
      content = renderDashboard();
    } else {
      content = renderBuilder();
    }
  } else if (currentView === 'templates') {
    content = renderTemplates();
  } else if (currentView === 'preview') {
    content = renderPreview();
  }

  function renderExportDialog() {
    return (
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Export Your Extension
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Download your extension files or copy the generated code
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label htmlFor="extension-name" className="dark:text-gray-300">
                Extension Name
              </Label>
              <Input
                id="extension-name"
                placeholder="My Awesome Extension"
                className="mt-1 bg-gradient-to-r from-white to-gray-50/50 dark:from-gray-700 dark:to-gray-600/50 border-0 shadow-sm dark:text-white dark:placeholder-gray-400"
                value={exportName}
                onChange={(e) => setExportName(e.target.value)}
              />
            </div>
            <div>
              <Label
                htmlFor="extension-description"
                className="dark:text-gray-300"
              >
                Description
              </Label>
              <Textarea
                id="extension-description"
                placeholder="Describe what your extension does..."
                className="mt-1 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-700 dark:to-gray-600/50 border-0 shadow-sm dark:text-white dark:placeholder-gray-400"
                value={exportDescription}
                onChange={(e) => setExportDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleDownloadZip} className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Download className="w-4 h-4 mr-2" />
                Download ZIP
              </Button>
              <Button onClick={handleCopyCode} className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-700 dark:text-gray-300 border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                <Code className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-700 dark:to-gray-800/50 rounded-lg p-4 shadow-inner">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Generated Files:
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• manifest.json</li>
                <li>• content.js</li>
                <li>• popup.html</li>
                <li>• popup.js</li>
                <li>• styles.css</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900/50 transition-all duration-500">
      {renderNavbar()}
      {content}
      {renderExportDialog()}

      {/* Create Project Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Your Project</DialogTitle>
            <DialogDescription>
              Give your project a name to save your current work
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                placeholder="My Awesome Extension"
                onKeyDown={e => {
                  if (e.key === 'Enter' && newProjectName.trim()) {
                    handleCreateProject();
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="project-description">
                Description (Optional)
              </Label>
              <Textarea
                id="project-description"
                value={newProjectDescription}
                onChange={e => setNewProjectDescription(e.target.value)}
                placeholder="What does your extension do?"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim() || creating}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
              >
                {creating ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Block Configuration Dialog */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Configure {configuringBlock?.title}</DialogTitle>
            <DialogDescription>
              Set up the parameters for this block
            </DialogDescription>
          </DialogHeader>
          {configuringBlock && (
            <BlockConfigForm
              block={configuringBlock}
              onSave={saveBlockConfig}
              onCancel={() => setShowConfigDialog(false)}
            />
          )}
          
        </DialogContent>
      </Dialog>

      
    </div>
  );
}
