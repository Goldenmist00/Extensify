'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import {
    Chrome,
    Zap,
    Palette,
    Code,
    MousePointer,
    Bell,
    ArrowRight,
    Play,
    Sparkles,
    Shield,
    Users,
    Star,
    CheckCircle,
    Github,
    Twitter,
    Mail,
    Rocket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AuthForm from '@/components/AuthForm';

export default function LandingPage() {
    const [showAuthForm, setShowAuthForm] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const features = [
        {
            icon: Zap,
            title: 'Visual Builder',
            description: 'Drag and drop blocks to create powerful extensions without writing a single line of code.',
            color: 'from-yellow-100 to-yellow-200 text-yellow-700',
            darkColor: 'dark:from-yellow-900/40 dark:to-yellow-800/40 dark:text-yellow-300',
        },
        {
            icon: Palette,
            title: 'Style Modifications',
            description: 'Change colors, hide elements, inject custom CSS to transform any website.',
            color: 'from-purple-100 to-purple-200 text-purple-700',
            darkColor: 'dark:from-purple-900/40 dark:to-purple-800/40 dark:text-purple-300',
        },
        {
            icon: MousePointer,
            title: 'User Interactions',
            description: 'Respond to clicks, keyboard shortcuts, form submissions, and more.',
            color: 'from-blue-100 to-blue-200 text-blue-700',
            darkColor: 'dark:from-blue-900/40 dark:to-blue-800/40 dark:text-blue-300',
        },
        {
            icon: Bell,
            title: 'Smart Notifications',
            description: 'Show browser notifications, toast messages, and custom alerts.',
            color: 'from-pink-100 to-pink-200 text-pink-700',
            darkColor: 'dark:from-pink-900/40 dark:to-pink-800/40 dark:text-pink-300',
        },
        {
            icon: Code,
            title: 'Content Injection',
            description: 'Add text, images, HTML, and interactive elements to any webpage.',
            color: 'from-green-100 to-green-200 text-green-700',
            darkColor: 'dark:from-green-900/40 dark:to-green-800/40 dark:text-green-300',
        },
        {
            icon: Sparkles,
            title: 'AI & Automation',
            description: 'Integrate AI processing, webhooks, and data transformations.',
            color: 'from-indigo-100 to-indigo-200 text-indigo-700',
            darkColor: 'dark:from-indigo-900/40 dark:to-indigo-800/40 dark:text-indigo-300',
        },
    ];

    const templates = [
        {
            name: 'Ad Blocker',
            description: 'Hide ads and distractions on any website',
            icon: Shield,
            gradient: 'from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20',
        },
        {
            name: 'Focus Mode',
            description: 'Remove sidebars and comments for better reading',
            icon: Zap,
            gradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
        },
        {
            name: 'Dark Mode Toggle',
            description: 'Add dark mode to any website with a keyboard shortcut',
            icon: Palette,
            gradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
        },
        {
            name: 'Auto Form Fill',
            description: 'Automatically fill and submit forms with saved data',
            icon: MousePointer,
            gradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        },
    ];

    const stats = [
        { number: '10K+', label: 'Extensions Created' },
        { number: '5K+', label: 'Active Users' },
        { number: '50+', label: 'Templates Available' },
        { number: '99%', label: 'Uptime' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
            {/* Floating Background Icons */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 text-indigo-200 dark:text-indigo-900/30 animate-float">
                    <Chrome className="w-8 h-8 animate-spin-slow" />
                </div>
                <div className="absolute top-40 right-20 text-purple-200 dark:text-purple-900/30 animate-float-delayed">
                    <Zap className="w-6 h-6" />
                </div>
                <div className="absolute top-60 left-1/4 text-pink-200 dark:text-pink-900/30 animate-bounce-slow">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div className="absolute bottom-40 right-10 text-cyan-200 dark:text-cyan-900/30 animate-float">
                    <Code className="w-7 h-7" />
                </div>
                <div className="absolute bottom-60 left-16 text-green-200 dark:text-green-900/30 animate-float-delayed">
                    <Palette className="w-6 h-6" />
                </div>
                <div className="absolute top-1/3 right-1/4 text-yellow-200 dark:text-yellow-900/30 animate-bounce-slow">
                    <MousePointer className="w-5 h-5" />
                </div>
                <div className="absolute bottom-1/3 left-1/3 text-indigo-200 dark:text-indigo-900/30 animate-float">
                    <Bell className="w-4 h-4" />
                </div>
                <div className="absolute top-1/2 left-10 text-purple-200 dark:text-purple-900/30 animate-float-delayed">
                    <Rocket className="w-6 h-6" />
                </div>
            </div>
            {/* Header */}
            <header className={`border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300">
                                <Chrome className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                    Extensify
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Build Chrome Extensions Visually</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                onClick={() => setShowAuthForm(true)}
                                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                            >
                                Sign In
                            </Button>
                            <Button
                                onClick={() => setShowAuthForm(true)}
                                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white"
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`text-center transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <Badge className={`mb-6 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:scale-105 transition-all duration-300 ${isLoaded ? 'animate-pulse-gentle' : ''}`}>
                            <Sparkles className="w-3 h-3 mr-1 animate-spin-slow" />
                            No Code Required
                        </Badge>
                        <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-6 transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <span className="inline-block animate-fade-in-up">Build Powerful</span>
                            <br />
                            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent inline-block animate-fade-in-up animation-delay-200 hover:scale-105 transition-transform duration-300">
                                Chrome Extensions
                            </span>
                        </h1>
                        <p className={`text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            Create custom browser extensions without writing code. Use our visual drag-and-drop builder to enhance any website with powerful features.
                        </p>
                        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <Button
                                size="lg"
                                onClick={() => setShowAuthForm(true)}
                                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/25"
                            >
                                Start Building Free
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="px-8 py-4 text-lg border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-105 transition-all duration-300 hover:shadow-lg"
                            >
                                <Play className="w-5 h-5 mr-2" />
                                Watch Demo
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        {stats.map((stat, index) => (
                            <div key={index} className={`text-center group hover:scale-110 transition-all duration-300 cursor-default animate-fade-in-up`} style={{ animationDelay: `${index * 200}ms` }}>
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-2 group-hover:from-pink-500 group-hover:to-indigo-500 transition-all duration-500">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400 font-medium group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`text-center mb-16 transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4 hover:scale-105 transition-transform duration-300">
                            Everything You Need to Build Extensions
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Our visual builder includes all the blocks you need to create sophisticated browser extensions.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className={`group hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-500 border-slate-200 dark:border-slate-700 hover:scale-105 hover:-translate-y-2 animate-fade-in-up`} style={{ animationDelay: `${index * 150}ms` }}>
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} ${feature.darkColor} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                                        <feature.icon className="w-6 h-6 group-hover:animate-pulse" />
                                    </div>
                                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Templates Section */}
            <section className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`text-center mb-16 transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4 hover:scale-105 transition-transform duration-300">
                            Start with Ready-Made Templates
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Choose from our library of pre-built extensions or create your own from scratch.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {templates.map((template, index) => (
                            <Card key={index} className={`group hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-500 bg-gradient-to-br ${template.gradient} border-slate-200 dark:border-slate-700 hover:scale-105 hover:-translate-y-3 cursor-pointer animate-fade-in-up`} style={{ animationDelay: `${index * 100}ms` }}>
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 mx-auto bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-2xl">
                                        <template.icon className="w-8 h-8 text-indigo-500 group-hover:text-purple-500 transition-colors duration-300" />
                                    </div>
                                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                                        {template.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <CardDescription className="text-gray-600 dark:text-gray-300">
                                        {template.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div className={`text-center mt-12 transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <Button
                            onClick={() => setShowAuthForm(true)}
                            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-3 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/25"
                        >
                            Browse All Templates
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`text-center mb-16 transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4 hover:scale-105 transition-transform duration-300">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Build your extension in three simple steps.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '1',
                                title: 'Choose Triggers',
                                description: 'Select when your extension should activate - page load, clicks, keyboard shortcuts, and more.',
                                icon: Zap,
                            },
                            {
                                step: '2',
                                title: 'Add Actions',
                                description: 'Drag and drop actions like injecting content, changing styles, or showing notifications.',
                                icon: MousePointer,
                            },
                            {
                                step: '3',
                                title: 'Export & Install',
                                description: 'Download your extension and install it in Chrome. No coding knowledge required!',
                                icon: Chrome,
                            },
                        ].map((step, index) => (
                            <div key={index} className={`text-center group hover:scale-105 transition-all duration-500 animate-fade-in-up`} style={{ animationDelay: `${index * 200}ms` }}>
                                <div className="relative mb-8">
                                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                        <step.icon className="w-10 h-10 text-white group-hover:animate-pulse" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-sm font-bold text-indigo-500 shadow-lg border-2 border-indigo-100 dark:border-indigo-900 group-hover:scale-125 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                                        {step.step}
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
                    <div className="absolute top-20 right-20 w-16 h-16 bg-white/5 rounded-full animate-float-delayed"></div>
                    <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-bounce-slow"></div>
                    <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/5 rounded-full animate-float"></div>
                </div>
                <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 hover:scale-105 transition-transform duration-300">
                        Ready to Build Your First Extension?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto hover:text-white transition-colors duration-300">
                        Join thousands of creators who are building amazing Chrome extensions without writing code.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            size="lg"
                            onClick={() => setShowAuthForm(true)}
                            className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold hover:scale-110 transition-all duration-300 hover:shadow-2xl hover:shadow-white/25"
                        >
                            Start Building Now
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-white/20"
                        >
                            <Github className="w-5 h-5 mr-2" />
                            View on GitHub
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 dark:bg-slate-950 text-white py-16 relative">
                <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center hover:scale-110 hover:rotate-6 transition-all duration-300">
                                    <Chrome className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">Extensify</h3>
                                    <p className="text-sm text-gray-400">Build Chrome Extensions Visually</p>
                                </div>
                            </div>
                            <p className="text-gray-300 mb-6 max-w-md">
                                The easiest way to create powerful Chrome extensions without writing code. Build, customize, and deploy in minutes.
                            </p>
                            <div className="flex space-x-4">
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300">
                                    <Twitter className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300">
                                    <Github className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300">
                                    <Mail className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-gray-300">
                                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-gray-300">
                                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 mt-12 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 Extensify. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Auth Modal */}
            {showAuthForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full relative animate-fade-in-up transition-transform duration-300">
                        <button
                            onClick={() => setShowAuthForm(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:scale-110 transition-all duration-300 hover:rotate-90 z-10"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 animate-pulse-gentle">
                                    <Chrome className="w-8 h-8 text-white animate-spin-slow" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Welcome to Extensify
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Sign in to start building your Chrome extensions
                                </p>
                            </div>
                            <AuthForm />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}