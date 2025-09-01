# React Frontend Boilerplate

A modern, production-ready React frontend boilerplate built to work seamlessly with the Node.js MSSQL Backend API. This boilerplate includes authentication, role-based access control, user management, and a complete UI component library.

## 🚀 Features

### Core Technologies
- **React 18** - Latest React with hooks and concurrent features
- **TypeScript** - Type-safe development with strict configuration
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **React Router** - Client-side routing with protected routes
- **React Query** - Powerful data synchronization for React
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

### Authentication & Security
- **JWT Authentication** - Secure token-based authentication with automatic refresh
- **Role-Based Access Control** - Granular permission system
- **Protected Routes** - Route-level authentication and authorization
- **Permission Guards** - Component-level permission checking
- **Secure API Client** - Axios with interceptors for token management

### UI Components & UX
- **Modern Component Library** - Reusable, accessible components
- **Responsive Design** - Mobile-first responsive layouts
- **Dark/Light Theme Support** - CSS custom properties for theming
- **Toast Notifications** - User feedback system
- **Loading States** - Comprehensive loading and error states
- **Error Boundaries** - Graceful error handling and recovery

### Developer Experience
- **Hot Module Replacement** - Instant feedback during development
- **Path Aliases** - Clean import statements
- **ESLint & Prettier** - Code quality and formatting
- **TypeScript Strict Mode** - Maximum type safety
- **Custom Hooks** - Reusable logic patterns

## 📋 Prerequisites

- Node.js 18+ and npm 8+
- Backend API running (see backend documentation)
- Modern web browser

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repository-url>
cd react-boilerplate
npm install
```

### 2. Environment Setup

Copy the environment file and configure:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Environment
VITE_NODE_ENV=development

# App Configuration
VITE_APP_NAME=React Boilerplate
VITE_APP_VERSION=1.0.0

# Authentication
VITE_JWT_STORAGE_KEY=auth_token
VITE_REFRESH_TOKEN_KEY=refresh_token

# Features (optional feature flags)
VITE_ENABLE_DEBUG=true
VITE_ENABLE_LOGGING=true
```

### 3. Start Development Server

```bash
npm run dev
```

Your app will be available at `http://localhost:5173`

### 4. Backend Integration

Make sure your backend API is running at the configured URL. The frontend expects these endpoints:

- Authentication: `/api/auth/*`
- Users: `/api/users/*`
- Roles: `/api/roles/*`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Shared UI components
│   ├── layout/         # Layout components
│   ├── users/          # User management components
│   └── roles/          # Role management components
├── contexts/           # React contexts
│   └── auth.context.tsx # Authentication context
├── hooks/              # Custom React hooks
│   ├── api.hooks.ts    # API-related hooks
│   └── common.hooks.ts # General utility hooks
├── lib/                # Third-party configurations
│   └── api-client.ts   # Axios configuration
├── pages/              # Page components
│   ├── Dashboard.tsx
│   └── Profile.tsx
├── services/           # API service layer
│   ├── auth.service.ts
│   ├── user.service.ts
│   └── role.service.ts
├── types/              # TypeScript type definitions
│   ├── auth.types.ts
│   ├── common.types.ts
│   ├── user.types.ts
│   └── index.ts
├── utils/              # Utility functions
│   └── helpers.ts
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## 🔐 Authentication System

### Login Flow

1. User enters credentials
2. Frontend calls `/api/auth/login`
3. Backend returns access token + refresh token
4. Tokens stored in localStorage
5. User redirected to dashboard

### Automatic Token Refresh

- Access tokens expire in 15 minutes
- Axios interceptor automatically refreshes tokens
- If refresh fails, user is redirected to login

### Protected Routes

```tsx
// Basic authentication
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// With specific permissions
<RoleGuard requiredPermissions={['user:read']}>
  <UserList />
</RoleGuard>

// Component-level permission checking
<HasPermission permission="user:write">
  <Button>Edit User</Button>
</HasPermission>
```

## 🎨 Component Library

### Core Components

```tsx
// Button with variants and states
<Button variant="primary" size="lg" loading={isLoading}>
  Save Changes
</Button>

// Input with validation
<Input 
  label="Email" 
  error={errors.email} 
  leftIcon={<EmailIcon />}
/>

// Card layout
<Card>
  <CardHeader>
    <CardTitle>User Profile</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Modals and Dialogs

```tsx
// Confirmation modal
<ConfirmModal
  isOpen={showDelete}
  onConfirm={handleDelete}
  title="Delete User"
  message="Are you sure?"
  variant="destructive"
/>
```

## 📊 State Management

### React Query for Server State

```tsx
// Fetch users with caching and synchronization
const { data: users, isLoading, error } = useUsers({
  search: searchTerm,
  page,
  limit: 10
});

// Mutations with optimistic updates
const deleteUser = useDeleteUser({
  onSuccess: () => {
    toast.success('User deleted');
    queryClient.invalidateQueries(['users']);
  }
});
```

### Custom Hooks for Common Patterns

```tsx
// Search with debouncing
const { searchTerm, debouncedSearchTerm, setSearchTerm } = useSearch();

// Pagination
const { page, limit, nextPage, prevPage } = usePagination();

// Form state management
const { values, errors, handleChange } = useForm(initialValues);
```

## 🔧 API Integration

### Service Layer

```tsx
// Centralized API calls
export class UserService {
  static async getUsers(params: UserFilterParams) {
    const response = await apiClient.get('/users', { params });
    return response.data;
  }
  
  static async createUser(data: CreateUserRequest) {
    const response = await apiClient.post('/users', data);
    return response.data;
  }
}
```

### Type-Safe API Calls

```tsx
// All API responses are typed
const user: User = await UserService.getUserById(id);
const roles: Role[] = await RoleService.getAllRoles();
```

## 🎯 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking

# Testing (when added)
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## 🌐 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000/api` | Yes |
| `VITE_NODE_ENV` | Environment | `development` | No |
| `VITE_APP_NAME` | Application name | `React Boilerplate` | No |
| `VITE_APP_VERSION` | Application version | `1.0.0` | No |
| `VITE_JWT_STORAGE_KEY` | LocalStorage key for JWT | `auth_token` | No |
| `VITE_REFRESH_TOKEN_KEY` | LocalStorage key for refresh token | `refresh_token` | No |

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoints**: Follows Tailwind's responsive system
- **Touch Friendly**: Optimized for touch interfaces
- **Accessible**: WCAG 2.1 compliant components

## 🚀 Production Deployment

### Build for Production

```bash
npm run build
```

The `dist` folder contains the production build.

### Environment Setup

For production, update your environment variables:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_NODE_ENV=production
VITE_ENABLE_DEBUG=false
```

### Deploy Options

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **AWS S3 + CloudFront**: Static hosting with CDN
- **Docker**: Use the provided Dockerfile

## 🔒 Security Features

- **XSS Protection**: Input sanitization and validation
- **CSRF Protection**: Axios CSRF token handling
- **Secure Headers**: Security headers in production
- **Input Validation**: Client-side validation with Zod
- **Token Management**: Secure JWT storage and refresh

## 🎨 Customization

### Theming

Customize the design system in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6', // Your brand color
        900: '#1e3a8a',
      }
    }
  }
}
```

### Adding New Components

1. Create in appropriate folder under `src/components/`
2. Export from `index.ts` file
3. Add TypeScript interfaces in `src/types/`
4. Add API services if needed

## 🧪 Testing (Future Enhancement)

Planned testing setup:

- **Vitest**: Fast unit testing
- **React Testing Library**: Component testing
- **MSW**: API mocking
- **Playwright**: E2E testing

## 🐛 Troubleshooting

### Common Issues

**API Connection Failed**
- Check `VITE_API_BASE_URL` in `.env`
- Ensure backend server is running
- Check CORS configuration

**Authentication Issues**
- Clear localStorage and refresh
- Check JWT token expiration
- Verify API endpoints

**Build Issues**
- Clear `node_modules` and reinstall
- Check TypeScript errors
- Verify environment variables

### Development Tips

1. **Hot Reload Issues**: Restart dev server
2. **Type Errors**: Run `npm run type-check`
3. **Styling Issues**: Check Tailwind classes and CSS imports
4. **State Issues**: Use React DevTools and React Query DevTools

## 🤝 Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Update documentation
4. Test your changes
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🎯 Next Steps

After setting up the boilerplate:

1. **Customize the design** to match your brand
2. **Add your business logic** and domain-specific components
3. **Implement additional features** as needed
4. **Set up testing** for your components
5. **Configure CI/CD** for your deployment

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [React Router Docs](https://reactrouter.com/)
