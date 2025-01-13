import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@material-tailwind/react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const ErrorPage = ({ 
  errorCode = 404, 
  errorMessage = "Page Not Found", 
  description = "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable." 
}) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-8"
    >
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Error Illustration */}
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ 
            rotate: [-10, 10, -10],
            transition: { 
              repeat: Infinity, 
              duration: 2 
            } 
          }}
          className="flex items-center justify-center"
        >
          <AlertTriangle 
            className="text-danger-500 w-24 h-24 mx-auto mb-6" 
            strokeWidth={1.5} 
          />
        </motion.div>

        {/* Error Details */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-neutral-900">
            {errorCode}
          </h1>
          <h2 className="text-2xl font-semibold text-neutral-800">
            {errorMessage}
          </h2>
          <p className="text-neutral-600 mt-4">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <Button 
            onClick={() => navigate('/')}
            variant="outlined"
            className="flex items-center justify-center gap-2 
            border-primary-500 text-primary-500 
            hover:bg-primary-50 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Button>

          <Button 
            onClick={() => navigate(-1)}
            variant="gradient"
            className="flex items-center justify-center gap-2
            bg-gradient-to-r from-primary-500 to-primary-600
            hover:from-primary-600 hover:to-primary-700 
            transition-all duration-300"
          >
            <RefreshCw className="w-5 h-5" />
            Previous Page
          </Button>
        </div>

        {/* Additional Support */}
        <div className="text-sm text-neutral-500 mt-8">
          Having trouble? 
          <Link 
            to="/contact" 
            className="text-primary-500 ml-1 hover:underline"
          >
            Contact Support
          </Link>
        </div>
      </div>

      {/* Background Decoration */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [0.9, 1, 0.9]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 5 
        }}
        className="absolute inset-0 bg-primary-50/20 -z-10"
      />
    </motion.div>
  );
};

// Predefined Error Variations
export const NotFoundError = () => (
  <ErrorPage 
    errorCode={404} 
    errorMessage="Page Not Found" 
    description="The page you are looking for might have been removed or doesn't exist."
  />
);

export const ServerError = () => (
  <ErrorPage 
    errorCode={500} 
    errorMessage="Internal Server Error" 
    description="Something went wrong on our end. Please try again later."
  />
);

export const UnauthorizedError = () => (
  <ErrorPage 
    errorCode={403} 
    errorMessage="Unauthorized Access" 
    description="You do not have permission to access this page."
  />
);

export default ErrorPage;