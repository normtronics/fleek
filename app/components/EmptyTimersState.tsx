import { Link } from 'react-router';
import { Button } from './Button';

export default function EmptyTimersState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Odoo Logo Container */}
        <div className="mx-auto w-64 h-64 border-2 border-border-secondary rounded-2xl flex items-center justify-center bg-surface-primary backdrop-blur-sm">
          <div className="text-6xl font-bold text-white tracking-wider">
            odoo
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-headline-large font-inter font-medium text-text-primary">
            You don't have any odoo timesheets
          </h1>
          <p className="text-body-large text-text-secondary">
            Synchronize with odoo to get started
          </p>
        </div>

        {/* Get Started Button */}
        <div className="pt-8">
          <Link to="/create-timer" className="block">
            <Button 
              variant="primary" 
              size="lg" 
              className="w-full text-body-large py-4"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 