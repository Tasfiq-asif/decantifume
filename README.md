# 🛍️ Decant E-commerce Platform

A modern, full-stack e-commerce platform built with **Next.js 15**, **Node.js**, **MongoDB**, and **NextAuth.js**. This codebase serves as a robust foundation for any e-commerce website with advanced authentication, beautiful UI, and smooth animations.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-20-green?style=for-the-badge&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-7-green?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan?style=for-the-badge&logo=tailwind-css)

## Live Demo

Visit the live application: [Decantifume](https://decantifume.vercel.app/)


## 🌟 Features

### 🔐 **Authentication & Authorization**

- **NextAuth.js** integration with JWT tokens
- **Refresh token** auto-rotation
- **Role-based access control** (User, Admin)
- **Password validation** with security requirements
- **Session management** with Redux integration

### 🎨 **Modern UI/UX**

- **Responsive design** with Tailwind CSS
- **Dark theme** with custom lavender/purple palette
- **Framer Motion animations** (loading screens, transitions)
- **Beautiful loading animations** with perfume bottle theme
- **Glass morphism effects** and gradient backgrounds

### 🛒 **E-commerce Features**

- **Product management** system
- **Shopping cart** with Redux state management
- **User wishlist** functionality
- **Order management** system
- **Collection/category** organization

### 🔧 **Technical Features**

- **TypeScript** for type safety
- **Zod validation** for API endpoints
- **Global error handling**
- **API middleware** with authentication
- **MongoDB** with Mongoose ODM
- **Docker support** for backend
- **Environment configuration** management

### 🚀 **Performance & Developer Experience**

- **Server-side rendering** with Next.js 15
- **Global loading states** with custom animations
- **Redux Toolkit** for state management
- **Custom hooks** for reusable logic
- **Component-based architecture**
- **ESLint & TypeScript** configuration

## 📁 Project Structure

```
decantifume/
├── frontend/ (decantifume/)          # Next.js frontend application
│   ├── src/
│   │   ├── app/                      # Next.js 15 app router
│   │   │   ├── api/auth/             # NextAuth.js API routes
│   │   │   ├── login/                # Authentication pages
│   │   │   ├── register/
│   │   │   └── ...                   # Other pages
│   │   ├── components/               # Reusable components
│   │   │   ├── ui/                   # Base UI components
│   │   │   ├── layout/               # Layout components
│   │   │   ├── home/                 # Page-specific components
│   │   │   └── product/
│   │   ├── lib/                      # Utilities and configurations
│   │   │   ├── hooks/                # Custom React hooks
│   │   │   ├── providers/            # Context providers
│   │   │   ├── api/                  # API integration
│   │   │   └── auth/                 # Authentication config
│   │   ├── redux/                    # Redux store and slices
│   │   └── types/                    # TypeScript type definitions
│   ├── public/                       # Static assets
│   └── package.json
│
└── backend/ (decant-server/)         # Node.js/Express backend
    ├── src/
    │   ├── app/
    │   │   ├── modules/              # Feature modules
    │   │   │   ├── auth/             # Authentication module
    │   │   │   └── user/             # User management module
    │   │   ├── constants/            # Application constants
    │   │   ├── errors/               # Error handling
    │   │   └── utils/                # Utility functions
    │   ├── configs/                  # Configuration files
    │   ├── middlewares/              # Express middlewares
    │   └── routes/                   # API route definitions
    ├── Dockerfile                    # Docker configuration
    └── package.json
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ and npm/pnpm
- **MongoDB** (local or cloud instance)
- **Git** for version control

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd decantifume
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd decant-server

# Install dependencies
npm install
# or
pnpm install

# Create environment file
cp .env.example .env
```

**Configure backend environment variables** (`.env`):

```env
PORT=4000
HOST=localhost
NODE_ENV=development
DB_URL=mongodb://localhost:27017/your-ecommerce-db
# or use MongoDB Atlas:
# DB_URL=mongodb+srv://username:password@cluster.mongodb.net/your-db?retryWrites=true&w=majority

BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_ACCESS_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_REFRESH_EXPIRES_IN=1y
```

**Start the backend server:**

```bash
npm run dev
# or
pnpm dev

# Server will run on http://localhost:4000
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd decantifume

# Install dependencies
npm install
# or
pnpm install

# Install Framer Motion for animations
npm install framer-motion
# or
pnpm add framer-motion
```

**Configure frontend environment variables** (`.env.local`):

```env
# NextAuth.js Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**Start the frontend development server:**

```bash
npm run dev
# or
pnpm dev

# Application will run on http://localhost:3000
```

### 4. Create Initial Test User

Register a test user through the frontend or use curl:

```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123"
  }'
```

**Login credentials:**

- Email: `test@example.com`
- Password: `Password123`

## 🔧 Configuration

### Database Setup

**Option 1: Local MongoDB**

```bash
# Install MongoDB locally
# macOS
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Use local connection string
DB_URL=mongodb://localhost:27017/your-ecommerce-db
```

**Option 2: MongoDB Atlas (Cloud)**

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string and add to `.env`

### NextAuth.js Secret Generation

```bash
# Generate secure secret
openssl rand -base64 32
```

Add the generated secret to your `.env.local` file.

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  lavender: {
    50: '#fafaff',
    100: '#f0f0ff',
    // ... customize as needed
  },
  'dark-purple': {
    // ... your custom colors
  }
}
```

### Loading Animations

Customize loading messages and animations in:

- `src/components/ui/loading.tsx` - Main loading component
- `src/lib/hooks/usePageLoading.ts` - Loading utilities
- `src/lib/providers/LoadingProvider.tsx` - Global loading state

### Authentication Flow

Customize authentication in:

- `src/auth.ts` - NextAuth.js configuration
- `src/lib/hooks/useAuth.ts` - Authentication utilities
- Backend: `decant-server/src/app/modules/auth/`

## 📚 Usage Examples

### Using the Loading System

```typescript
import { usePageLoading } from "@/lib/hooks/usePageLoading";

function MyComponent() {
  const { setLoading, withLoading, navigateWithLoading } = usePageLoading();

  // Show loading manually
  const handleAction = async () => {
    setLoading(true, "Processing...");
    // Your async operation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
  };

  // Wrap async operations
  const saveData = async () => {
    await withLoading(async () => {
      // Your async operation
      await api.saveData();
    }, "Saving changes...");
  };

  // Navigate with loading
  const goToProducts = () => {
    navigateWithLoading("/products", "Loading products...");
  };
}
```

### Authentication Usage

```typescript
import { useAuth } from "@/lib/hooks/useAuth";

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();

  const handleLogin = async () => {
    const result = await login({
      email: "user@example.com",
      password: "password",
    });

    if (result.success) {
      // Login successful
    }
  };
}
```

### Adding New API Endpoints

Backend (`decant-server/src/app/modules/`):

```typescript
// 1. Create interface
export interface TProduct {
  name: string;
  price: number;
  description: string;
}

// 2. Create validation schema
const createProductSchema = z.object({
  body: z.object({
    name: z.string(),
    price: z.number().positive(),
    description: z.string(),
  }),
});

// 3. Create service
const createProduct = async (payload: TProduct) => {
  const result = await Product.create(payload);
  return result;
};

// 4. Create controller
const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.createProduct(req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.CREATED,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

// 5. Add route
router.post(
  "/products",
  auth(USER_ROLE.ADMIN),
  validateRequest(ProductValidation.createProductSchema),
  ProductControllers.createProduct
);
```

## 🐳 Docker Support

**Run backend with Docker:**

```bash
cd decant-server

# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t decant-backend .
docker run -p 4000:4000 decant-backend
```

## 📦 Available Scripts

### Frontend (decantifume/)

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checking
```

### Backend (decant-server/)

```bash
npm run dev          # Start development server
npm run build        # Build TypeScript
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Backend (Railway/Render/DigitalOcean)

1. Add environment variables to your hosting platform
2. Set build command: `npm run build`
3. Set start command: `npm start`

### Environment Variables for Production

```env
# Frontend (.env.local)
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://yourapp.vercel.app
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api

# Backend (.env)
NODE_ENV=production
DB_URL=your-production-mongodb-url
JWT_ACCESS_SECRET=your-production-access-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include error logs and environment details

## 🔄 Updates & Maintenance

- **Dependencies**: Run `npm audit` regularly
- **Security**: Update dependencies monthly
- **Database**: Backup your database regularly
- **Environment**: Keep environment variables secure

---

**Built with ❤️ for the e-commerce community**

Ready to build your next amazing e-commerce platform! 🚀
