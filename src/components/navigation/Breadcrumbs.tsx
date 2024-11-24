import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const breadcrumbLabels: Record<string, string> = {
  products: 'Προϊόντα',
  producers: 'Παραγωγοί',
  cart: 'Καλάθι',
  auth: 'Σύνδεση',
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="hover:text-primary-600">
            Αρχική
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const label = breadcrumbLabels[value] || value;

          return (
            <React.Fragment key={to}>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4" />
              </li>
              <li>
                {last ? (
                  <span className="text-gray-900 font-medium">{label}</span>
                ) : (
                  <Link to={to} className="hover:text-primary-600">
                    {label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}