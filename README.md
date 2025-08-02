# Tier-Based Event Showcase
#live url: https://event-showcase-lilac.vercel.app/

A modern web application built with Next.js 15, featuring tier-based event access control, user authentication with Clerk, and real-time database operations with Supabase.

## 🚀 Features

### Core Features
- **Tier-Based Access Control**: Events are filtered based on user subscription tiers (Free, Silver, Gold, Platinum)
- **User Authentication**: Secure authentication using Clerk with role-based access
- **Admin Dashboard**: Complete user management and settings configuration
- **Real-time Events**: Dynamic event fetching and display with Supabase
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Toast Notifications**: User-friendly feedback using react-fox-toast

### User Tiers & Permissions
- **Free**: Access to basic events
- **Silver**: Access to free + silver events
- **Gold**: Access to free + silver + gold events  
- **Platinum**: Access to all events (including premium)

### Admin Features
- **User Management**: View all users with their tier and role information
- **Role Management**: Update user tiers and roles (admin/user)
- **Settings Configuration**: Manage the users tier and role(only admin can)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Authentication**: Clerk
- **Database**: Supabase
- **Styling**: Tailwind CSS v4
- **Notifications**: react-fox-toast
- **Development**: Turbopack for faster builds

## 📋 Prerequisites

Before running this application, you need:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Clerk Account** for authentication
4. **Supabase Account** for database

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Navigate to the project directory
cd event

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Clerk Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy your **Publishable Key** and **Secret Key**
4. Update your `.env.local` file

### 4. Supabase Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to **Settings** → **API**
4. Copy your **Project URL** and **anon/public key**
5. Update your `.env.local` file

#### Database Schema

Create the following table in your Supabase database:

```sql
-- Create events table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'silver', 'gold', 'platinum')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO events (title, description, event_date, tier) VALUES
('Free Workshop', 'Basic workshop for all users', '2024-01-15', 'free'),
('Silver Seminar', 'Advanced seminar for silver+ users', '2024-01-20', 'silver'),
('Gold Conference', 'Premium conference for gold+ users', '2024-01-25', 'gold'),
('Platinum Summit', 'Exclusive summit for platinum users', '2024-01-30', 'platinum');
```

### 5. Run the Application

```bash
# Development mode with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
event/
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   └── user-management.ts    # Server actions for user management
│   │   ├── admin/
│   │   │   ├── page.tsx              # Admin dashboard
│   │   │   ├── settings/
│   │   │   │   └── page.tsx          # User tier/role management
│   │   │   └── users/
│   │   │       └── page.tsx          # User listing
│   │   ├── components/
│   │   │   └── ToastProvider.tsx     # Toast notifications
│   │   ├── events/
│   │   │   └── page.tsx              # Events display page
│   │   ├── signin/
│   │   │   └── sign-in.tsx           # Sign-in page
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home page
│   ├── middleware.ts                 # Route protection
│   └── utils/
│       └── supabase/
│           ├── client.ts             # Client-side Supabase
│           ├── middleware.ts         # Supabase middleware
│           └── server.ts             # Server-side Supabase
├── public/                           # Static assets
├── package.json                      # Dependencies
└── README.md                         # This file
```

## 🔐 Authentication & Authorization

### Route Protection
- `/events` - Requires authentication
- `/admin/*` - Requires authentication + admin role
- `/` - Public access

### User Roles
- **User**: Can view events based on their tier
- **Admin**: Can manage users, update tiers, and access admin features

### Tier System
```typescript
const tierRank = {
    free: 1,
    silver: 2,
    gold: 3,
    platinum: 4,
} as const;
```

## 🎯 Key Features Explained

### 1. Tier-Based Event Filtering
Events are automatically filtered based on user tier. Users can only see events they have access to:

```typescript
const allowedTiers = Object.entries(tierRank)
  .filter(([_, rank]) => rank <= userTierRank)
  .map(([tier]) => tier);
```

### 2. Real-time Event Fetching
Events are fetched immediately when navigating to the events page:

```typescript
useEffect(() => {
  if (isLoaded) {
    fetchEvents();
  }
}, [isLoaded, userTier]);
```

### 3. Admin User Management
Admins can update user tiers and roles through the settings page:

```typescript
await updateUserMetadata(userId, {
  tier: 'platinum',
  role: 'admin'
});
```

### 4. Toast Notifications
User-friendly notifications for various actions:

```typescript
toast.info(`Upgrade to Platinum to access all events`, {
  position: 'bottom-center',
  duration: 5000,
});
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Available Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Component-based architecture

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to fetch" Error**
   - Check your Supabase environment variables
   - Ensure your Supabase project is active
   - Verify database table exists

2. **Authentication Issues**
   - Verify Clerk environment variables
   - Check Clerk application settings
   - Ensure proper redirect URLs

3. **Events Not Loading**
   - Check browser console for errors
   - Verify user tier is set correctly
   - Ensure events table has data

### Debug Mode

Enable debug logging by adding to your `.env.local`:

```env
NEXT_PUBLIC_DEBUG=true
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
1. Check the troubleshooting section
2. Review the code comments
3. Open an issue on GitHub

---

**Built with ❤️ using Next.js, Clerk, and Supabase**
