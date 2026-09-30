import React, { useEffect } from 'react';

export const WelcomeBackPage: React.FC = () => {
  useEffect(() => {
    window.location.href = 'http://localhost:5173/?view=role-select';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500">Redirecting to role selection...</p>
    </div>
  );
};
