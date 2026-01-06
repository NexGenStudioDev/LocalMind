import React from 'react'
import { Link, useLocation } from 'react-router-dom'

interface BreadcrumbItem {
  label: string
  path: string
}

const Breadcrumb: React.FC = () => {
  const location = useLocation()
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathMap: Record<string, string> = {
      '/': 'Home',
      '/chat': 'Chat Interface',
      '/documents': 'Documents & RAG',
      '/settings': 'Model Settings',
      '/api': 'API Information'
    }

    const currentPath = location.pathname
    const breadcrumbs: BreadcrumbItem[] = []

    if (currentPath !== '/') {
      breadcrumbs.push({ label: 'Home', path: '/' })
    }

    if (pathMap[currentPath]) {
      breadcrumbs.push({ label: pathMap[currentPath], path: currentPath })
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  if (breadcrumbs.length <= 1) return null

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.path}>
          {index > 0 && <span className="text-gray-600">/</span>}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-white font-medium">{item.label}</span>
          ) : (
            <Link 
              to={item.path} 
              className="hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumb