# Blynt

> Your AI-powered personal finance copilot. Track expenses effortlessly with natural language.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

---

## About

**Blynt** is an open-source personal finance application that makes expense tracking effortless. Instead of clicking through forms and dropdowns, simply type natural language like:

- `"coffee $5"`
- `"salary 3000"`
- `"uber $20, lunch $50, netflix $15"`

The AI handles everything: parsing amounts, detecting categories, normalizing dates, and managing multiple currencies.

### Why Blynt?

Traditional expense trackers are **tedious**. Blynt solves this by:

- **Natural Language Input**: Type expenses as you think about them
- **AI-Powered Categorization**: Automatically categorizes transactions (no manual selection)
- **Multi-Currency Support**: Track expenses in any currency
- **Smart Date Parsing**: Understands "yesterday", "last week", etc.
- **Bulk Entry**: Add multiple transactions at once
- **Privacy-Focused**: Self-hostable, your data stays with you

---

## Features

### Core Functionality

- **AI Transaction Parsing**: Natural language processing powered by Groq/Cerebras LLMs
- **Smart Categorization**: Automatic categorization into 10+ categories (Food, Transport, Entertainment, etc.)
- **Multi-Currency**: Track expenses in USD, EUR, COP, and more
- **Dashboard Views**:
    - Overview: Stats cards, budget summary
    - Transactions: Full CRUD with filtering
    - Calendar: Visualize expenses by date
- **User Management**: Profile settings, password management, email verification
- **Subscription System**: Free and Pro tiers with usage limits
- **Date Range Filtering**: Analyze spending over custom periods

### Technical Highlights

- Built with **Next.js 16** and **React 19**
- **TypeScript** for type safety
- **PostgreSQL** database with **Drizzle ORM**
- **Better Auth** for authentication
- **TanStack Query** for data fetching
- **Radix UI** + **Tailwind CSS 4** for beautiful UI
- **Zod** validation for all inputs
- **Recharts** for data visualization

---

## Tech Stack

| Category             | Technologies                           |
| -------------------- | -------------------------------------- |
| **Framework**        | Next.js 16.1.6, React 19               |
| **Language**         | TypeScript 5.9.3                       |
| **Database**         | PostgreSQL, Drizzle ORM 0.45.1         |
| **Authentication**   | Better Auth 1.4.18                     |
| **AI/LLM**           | Groq SDK 0.37.0, Cerebras SDK 1.64.1   |
| **UI Components**    | Radix UI, Tailwind CSS 4               |
| **State Management** | Zustand 5.0.10, TanStack Query 5.90.20 |
| **Forms**            | React Hook Form 7.71.1, Zod 4.3.6      |
| **Animations**       | Motion 12.29.2                         |
| **Charts**           | Recharts 2.15.4                        |

---

## Getting Started

### Prerequisites

- **Node.js** 20+
- **PostgreSQL** 14+
- **API Keys**:
    - [Groq API Key](https://console.groq.com/) (for AI parsing)
    - OR [Cerebras API Key](https://cloud.cerebras.ai/) (alternative)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/vrgs-dev/blynt.git
cd blynt
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/blynt

# Authentication
BETTER_AUTH_SECRET=your-random-secret-here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_URL=http://localhost:3000

# AI Services (choose one or both)
GROQ_API_KEY=your-groq-api-key
CEREBRAS_API_KEY=your-cerebras-api-key
```

Generate a secure random secret:

```bash
openssl rand -base64 32
```

4. **Set up the database**

```bash
# Push schema to database
npm run db:push

# Seed initial data (plans, features)
npm run db:seed
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
blynt/
├── app/
│   ├── (app)/                    # Protected app routes
│   │   ├── dashboard/            # Main dashboard
│   │   └── settings/             # User settings
│   ├── (auth)/                   # Auth routes (login, register)
│   ├── api/                      # API routes
│   │   ├── parse/                # AI transaction parsing
│   │   ├── transactions/         # Transaction CRUD
│   │   └── subscription/         # Subscription management
│   └── page.tsx                  # Landing page
│
├── components/
│   ├── landing/                  # Landing page components
│   ├── ui/                       # Reusable UI components
│   └── ...
│
├── db/
│   ├── schema.ts                 # Database schema (Drizzle)
│   └── seed.ts                   # Seed script
│
├── lib/
│   ├── auth.ts                   # Auth configuration
│   ├── api/                      # API client & hooks
│   ├── billing/                  # Subscription logic
│   └── validators.ts             # Zod schemas
│
├── services/
│   ├── groq.ts                   # Groq LLM service
│   ├── cerebras.ts               # Cerebras LLM service
│   └── index.ts                  # Service factory
│
├── constants/
│   ├── prompt.ts                 # AI prompt templates
│   ├── pricing.ts                # Plan definitions
│   └── category.ts               # Transaction categories
│
└── types/                        # TypeScript type definitions
```

---

## Usage

### Adding Transactions

1. Navigate to the Dashboard
2. Use the natural language input at the top
3. Type your expense(s):
    - `"lunch $50"`
    - `"coffee $5 yesterday"`
    - `"uber $20, netflix $15, gym membership $30"`
4. Press Enter or click Submit
5. The AI parses and categorizes your transactions automatically

### Managing Transactions

- **View**: Switch between Overview, Transactions, and Calendar tabs
- **Filter**: Use date range picker and category filters
- **Edit**: Click on any transaction to modify details
- **Delete**: Remove transactions with confirmation

### Settings

- **Profile**: Update name and email
- **Security**: Change password, manage sessions
- **Preferences**: Set currency, timezone, notification preferences
- **Subscription**: View plan limits and usage

---

## Database Schema

### Core Tables

- **users**: User accounts with roles (customer/admin)
- **sessions**: Session management with expiry tracking
- **transactions**: Income/expense entries with category, amount, date
- **plans**: Subscription tiers (Free, Pro, Team)
- **subscriptions**: User subscription status and billing
- **settings**: User preferences (currency, timezone, locale)
- **notifications**: User notification history

See [db/schema.ts](db/schema.ts) for the complete schema.

---

## API Endpoints

### Authentication

- `POST /api/auth/sign-in` - Email/password login
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-out` - Logout

### Transactions

- `GET /api/transactions` - List transactions (with filters)
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### AI Parsing

- `POST /api/parse` - Parse natural language to transactions

### Subscription

- `GET /api/subscription` - Get active subscription
- `GET /api/plans` - List available plans

---

## Configuration

### Environment Variables

| Variable             | Description                    | Required |
| -------------------- | ------------------------------ | -------- |
| `DATABASE_URL`       | PostgreSQL connection string   | Yes      |
| `BETTER_AUTH_SECRET` | Auth secret key                | Yes      |
| `BETTER_AUTH_URL`    | Base URL for auth callbacks    | Yes      |
| `NEXT_PUBLIC_URL`    | Public app URL                 | Yes      |
| `GROQ_API_KEY`       | Groq API key for AI parsing    | Yes\*    |
| `CEREBRAS_API_KEY`   | Cerebras API key (alternative) | Yes\*    |

\*At least one AI provider key is required.

### Subscription Plans

**Free Plan**

- 50 transactions/month
- 7-day history
- Basic features
- Limited support

**Pro Plan** ($5/month)

- Unlimited transactions
- Full history
- Priority support
- Custom categories
- Recurring transactions
- Receipt parsing

Edit plans in [constants/pricing.ts](constants/pricing.ts) or via database seeding.

---

## Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:push          # Push schema to DB
npm run db:seed          # Seed initial data

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format with Prettier
```

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker (Coming Soon)

```bash
docker-compose up -d
```

### Self-Hosted

1. Build the application:

    ```bash
    npm run build
    ```

2. Set up PostgreSQL database

3. Configure environment variables

4. Run with PM2 or systemd:
    ```bash
    npm start
    ```

---

## Roadmap

- [ ] Receipt scanning & OCR
- [ ] Recurring transaction templates
- [ ] Budget goals and alerts
- [ ] Export to CSV/PDF
- [ ] Mobile app (React Native)
- [ ] Team collaboration features
- [ ] Bank account integration
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Custom categories
- [ ] API for third-party integrations

---

## Contributing

Contributions are welcome! This project is now open-source as I've decided to focus on other projects.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style (ESLint + Prettier configured)
- Write meaningful commit messages
- Add tests for new features (when test suite is added)
- Update documentation as needed

---

## Acknowledgments

- **Groq** and **Cerebras** for providing fast LLM inference
- **Radix UI** for accessible component primitives
- **Shadcn** for UI component inspiration
- **Better Auth** for authentication simplicity
- **Drizzle ORM** for type-safe database queries

---

---

## Author

Created by **Camilo Vargas**

- GitHub: [@vrgs-dev](https://github.com/vrgs-dev)
- Twitter: [@vrgs_0](https://x.com/vrgs_0)

---

## Project Status

This project is **no longer actively maintained** as I've transitioned to other ventures. However, it's fully functional and open for community contributions. Feel free to fork, modify, and use it as you see fit!

---

Made with ❤️ using Next.js and AI
