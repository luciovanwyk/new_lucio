// app/(editor)/editor/page.tsx
"use client";

import React, { useState } from 'react';
import { Edit3, File, Folder, Save, Settings, Moon, Sun, Coffee, Download, Upload, User, Bell, Menu, X } from 'lucide-react';

export default function EditorHomepage() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const recentProjects = [
    { name: "Marketing Blog", date: "30 min ago", progress: 85 },
    { name: "Annual Report", date: "Yesterday", progress: 62 },
    { name: "Project Proposal", date: "2 days ago", progress: 100 },
    { name: "Website Copy", date: "Last week", progress: 45 }
  ];
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center space-x-2">
            <Edit3 className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold">WordCraft</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <File className="w-5 h-5" />
            </button>
            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <Folder className="w-5 h-5" />
            </button>
            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <Save className="w-5 h-5" />
            </button>
            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={toggleDarkMode} 
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 overflow-hidden rounded-full bg-blue-500">
                <User className="w-full h-full p-1 text-white" />
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="p-2 md:hidden"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {menuOpen && (
          <div className={`px-4 py-3 md:hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex flex-col space-y-3">
              <button className="flex items-center space-x-2 py-2">
                <File className="w-5 h-5" />
                <span>New Document</span>
              </button>
              <button className="flex items-center space-x-2 py-2">
                <Folder className="w-5 h-5" />
                <span>Open Project</span>
              </button>
              <button className="flex items-center space-x-2 py-2">
                <Save className="w-5 h-5" />
                <span>Save</span>
              </button>
              <button className="flex items-center space-x-2 py-2">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button 
                onClick={toggleDarkMode} 
                className="flex items-center space-x-2 py-2"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>
        )}
      </header>
      
      {/* Main content */}
      <main className="px-4 py-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Welcome back, Editor!</h1>
          <div className="flex items-center space-x-2">
            <Coffee className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium">Coffee break in 20 min</span>
          </div>
        </div>
        
        {/* Dashboard grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent projects */}
          <div className={`p-6 rounded-lg shadow-md col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Projects</h2>
              <button className={`px-3 py-1 text-sm font-medium rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentProjects.map((project, index) => (
                <div key={index} className={`p-4 rounded-lg cursor-pointer transition-all hover:scale-[1.01] ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{project.name}</h3>
                    <span className="text-sm text-gray-500">{project.date}</span>
                  </div>
                  <div className="relative w-full h-2 mb-2 rounded-full bg-gray-300">
                    <div 
                      className="absolute top-0 left-0 h-2 rounded-full bg-blue-500" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{project.progress}% complete</span>
                    <button className={`px-3 py-1 text-xs font-medium rounded-md ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}>
                      Continue
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick actions */}
          <div className="space-y-6">
            <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="mb-4 text-xl font-bold">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all hover:scale-105 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}>
                  <File className="w-8 h-8 mb-2 text-blue-500" />
                  <span className="text-sm font-medium">New Document</span>
                </button>
                <button className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all hover:scale-105 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}>
                  <Upload className="w-8 h-8 mb-2 text-green-500" />
                  <span className="text-sm font-medium">Upload File</span>
                </button>
                <button className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all hover:scale-105 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}>
                  <Download className="w-8 h-8 mb-2 text-purple-500" />
                  <span className="text-sm font-medium">Export</span>
                </button>
                <button className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all hover:scale-105 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}>
                  <Settings className="w-8 h-8 mb-2 text-gray-500" />
                  <span className="text-sm font-medium">Settings</span>
                </button>
              </div>
            </div>
            
            {/* Daily quote */}
            <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="mb-4 text-xl font-bold">Daily Inspiration</h2>
              <div className={`p-4 italic border-l-4 border-blue-500 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <p>"The first draft of anything is garbage."</p>
                <p className="mt-2 text-sm text-right">— Ernest Hemingway</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Writing Stats */}
        <div className={`mt-6 p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="mb-4 text-xl font-bold">Your Writing Stats</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className="text-sm text-gray-500">Words Written Today</p>
              <p className="text-2xl font-bold">2,487</p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className="text-sm text-gray-500">Weekly Goal</p>
              <p className="text-2xl font-bold">65% <span className="text-sm text-green-500">+12%</span></p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className="text-sm text-gray-500">Reading Time</p>
              <p className="text-2xl font-bold">47 min</p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className="text-sm text-gray-500">Projects Completed</p>
              <p className="text-2xl font-bold">7 <span className="text-sm text-green-500">+2 this month</span></p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className={`py-4 mt-12 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
        <div className="px-4 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex items-center space-x-2">
              <Edit3 className="w-5 h-5 text-blue-500" />
              <span className="font-medium">WordCraft Editor</span>
            </div>
            <p className="text-sm">© 2025 WordCraft. Happy writing!</p>
          </div>
        </div>
      </footer>
    </div>
  );
}