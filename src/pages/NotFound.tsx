import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import Button from '../components/common/Button';
import './NotFound.css';

const NotFound: React.FC = () => (
  <div className="not-found">
    <FileQuestion size={56} strokeWidth={1} className="not-found__icon" aria-hidden />
    <h1 className="not-found__title">Page Not Found</h1>
    <p className="not-found__text">
      The page you&apos;re looking for doesn&apos;t exist or has been moved.
    </p>
    <div className="not-found__actions">
      <Link to="/">
        <Button size="large">Go Home</Button>
      </Link>
      <Link to="/shop">
        <Button size="large" variant="outline">Browse Shop</Button>
      </Link>
    </div>
  </div>
);

export default NotFound;
