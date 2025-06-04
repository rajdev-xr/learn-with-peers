
import React from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader } from '@/components/ui/loader';

const Register = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-2xl font-bold">S</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold">SkillSync</h1>
        <p className="text-muted-foreground">Peer-Powered Microlearning Platform</p>
      </div>
      
      <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-sm">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
