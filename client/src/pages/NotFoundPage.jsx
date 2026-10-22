import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { ArrowLeft, Compass } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-forest-50 text-forest-800 flex items-center justify-center">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">404 Error</span>
          <h1 className="text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs text-charcoal-600 max-w-sm mx-auto leading-relaxed">
            The destination you are trying to navigate to does not exist or has been relocated in the PaisaPilot AI architecture.
          </p>
        </div>

        <div>
          <Link to="/dashboard">
            <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Return to Safe Harbor
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
