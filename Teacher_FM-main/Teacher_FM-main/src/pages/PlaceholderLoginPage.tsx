import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  role: string;
  color: string;
}

export const PlaceholderLoginPage: React.FC<Props> = ({ role, color }) => {
  return (
    <div className="min-h-screen bg-[#faf8fd] flex flex-col justify-between antialiased">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">
        <div className="bg-white rounded-2xl p-8 border border-[#f0ebf8] shadow-lg shadow-purple-900/5 w-full text-center">
          <Link
            to="/"
            className="inline-flex items-center text-xs font-semibold text-[#7032e3] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Role Selection
          </Link>
          <h1 className={`text-2xl font-bold ${color} mb-2`}>{role} Login</h1>
          <p className="text-xs text-gray-500 mb-6">
            Sign in to access your {role.toLowerCase()} portal.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};
