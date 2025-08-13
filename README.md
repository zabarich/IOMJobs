# Isle of Man Jobs Dashboard

A mobile-responsive, read-only analytics dashboard for Isle of Man job market data.

## Features

- 📊 Real-time job market statistics (660+ active jobs)
- 📱 Mobile-responsive design (optimised for iPhone)
- 🔍 Search and filter job listings
- 📈 Interactive charts and visualisations
- 💼 Detailed job listings with pagination
- 🕐 Data freshness indicators
- 🥧 Large, readable pie charts for mobile

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Recharts for data visualisation
- Supabase (read-only access)

## Deployment to Vercel

1. Push code to GitHub repository

2. Connect to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables

3. Add environment variables in Vercel:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. Deploy:
   - Vercel will automatically build and deploy
   - Region: London (lhr1) configured for best performance

## Local Development

```bash
npm install
npm run dev
```

Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Security

- Uses Supabase anon key (read-only access)
- No write operations or ETL capabilities
- Row Level Security (RLS) enabled on all tables
- Safe for public deployment

## Pages

- `/` - Dashboard with analytics and charts
- `/jobs` - Browse all jobs with search/filters (25 per page)
- `/jobs/[id]` - Individual job details

## Mobile Optimisation

- Responsive grid layouts (2-column on mobile)
- Touch-optimised controls
- Larger pie chart (140px radius on desktop, 100px on mobile)
- Condensed navigation for small screens
- Optimised font sizes and padding
- Fast loading with Next.js optimisations

## How Data Gets Updated

Data is updated by running the local ETL scraper separately:
```bash
cd ../etl-scraper
npm run scrape
```

The dashboard automatically reflects new data on the next page load.