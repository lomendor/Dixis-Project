# Dixis Marketplace

An e-commerce platform connecting Greek producers with consumers.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dixis-marketplace.git
   cd dixis-marketplace
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Required environment variables:

- `VITE_API_URL`: API base URL
- `VITE_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT tokens
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret

## Deployment

This project is configured for automatic deployment to Vercel:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

## License

MIT