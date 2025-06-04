
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="w-full border-b bg-background px-4 py-3 sm:px-6 lg:px-8">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="font-bold">S</span>
            </div>
            <span className="font-bold text-xl">SkillSync</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-24 text-center">
        <div className="container max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Learn New Skills with <span className="text-primary">Peer-Powered</span> Microlearning
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Break down complex topics into bite-sized modules, track your progress,
            and learn alongside a community of peers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="font-medium">
                Start Learning <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-card p-6 border shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Microlearning Modules</h3>
              <p className="text-muted-foreground">
                Learn at your own pace with bite-sized modules that fit into your schedule
              </p>
            </div>
            
            <div className="rounded-lg bg-card p-6 border shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Community-Driven</h3>
              <p className="text-muted-foreground">
                Learn from peers and contribute your own knowledge to help others
              </p>
            </div>
            
            <div className="rounded-lg bg-card p-6 border shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Earn XP, level up, and compete on leaderboards as you master new skills
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t bg-muted py-6 px-4">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; 2025 SkillSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

import { BookOpen, Users, Trophy } from 'lucide-react';
