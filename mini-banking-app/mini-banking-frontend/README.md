# Mini Banking Frontend

A modern React-based frontend application for a mini banking system, built with Vite and featuring a complete banking experience without Tailwind CSS.

## Features

### 🔐 User Authentication
- **Login & Registration**: Secure user authentication with JWT tokens
- **Session Management**: Automatic token validation and session persistence
- **Protected Routes**: Route protection for authenticated users only

### 🏦 Banking Features
- **Account Management**: Create, view, and manage multiple account types (Savings, Checking, Credit)
- **Account Search**: Real-time search functionality using query parameters
- **Balance Display**: Real-time account balance and transaction history
- **Money Transfer**: Secure money transfer between accounts with validation
- **Transaction History**: Comprehensive transaction tracking with filtering and search

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Modern Styling**: Custom CSS without Tailwind, featuring gradients and smooth animations
- **User-Friendly Interface**: Intuitive navigation and clear visual hierarchy
- **Loading States**: Proper loading indicators and error handling

### 🔧 Technical Features
- **State Management**: React Context API for global state management
- **API Integration**: Axios for secure API communication
- **Routing**: React Router for seamless navigation
- **Form Validation**: Comprehensive client-side validation
- **Error Handling**: Graceful error handling and user feedback

## Tech Stack

- **React 19**: Latest React with hooks and modern patterns
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication
- **Custom CSS**: Modern styling without external CSS frameworks
- **Context API**: State management solution

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Auth.css
│   ├── dashboard/      # Dashboard components
│   │   ├── Dashboard.jsx
│   │   └── Dashboard.css
│   ├── accounts/       # Account management
│   │   ├── CreateAccount.jsx
│   │   ├── AccountDetails.jsx
│   │   └── Accounts.css
│   ├── transactions/   # Transaction components
│   │   ├── TransferMoney.jsx
│   │   ├── TransactionHistory.jsx
│   │   └── Transactions.css
│   └── layout/         # Layout components
│       ├── Navbar.jsx
│       └── Navbar.css
├── contexts/           # React Context providers
│   └── AuthContext.jsx
├── services/           # API service layer
│   ├── authService.js
│   ├── accountService.js
│   └── transactionService.js
├── utils/              # Utility functions
├── App.jsx            # Main application component
├── App.css            # Global styles
├── index.css          # Base styles
└── main.jsx           # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:8080`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mini-banking-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend integrates with the backend API at `http://localhost:8080/api`. Key endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/validate` - Token validation

### Accounts
- `GET /api/accounts` - Get user accounts
- `POST /api/accounts` - Create new account
- `GET /api/accounts/{id}` - Get account details
- `PUT /api/accounts/{id}` - Update account
- `DELETE /api/accounts/{id}` - Delete account

### Transactions
- `GET /api/transactions` - Get transaction history
- `POST /api/transactions/transfer` - Transfer money
- `GET /api/accounts/{id}/transactions` - Get account transactions

## Features in Detail

### Authentication Flow
1. User registers/logs in with email and password
2. JWT token is stored in localStorage
3. Token is automatically included in API requests
4. Protected routes redirect to login if not authenticated

### Account Management
- **Account Types**: Savings, Checking, Credit accounts
- **Account Creation**: Users can create new accounts with initial balance
- **Account Details**: Comprehensive account information display
- **Search Functionality**: Real-time search across account numbers and types

### Money Transfer
- **Source Account Selection**: Choose from user's accounts
- **Recipient Input**: Enter recipient account number
- **Amount Validation**: Real-time balance checking
- **Transfer Confirmation**: Success/error feedback
- **Security**: Form validation and error handling

### Transaction History
- **Comprehensive View**: All transaction types (Transfer, Deposit, Withdrawal)
- **Search & Filter**: Search by description, type, or amount
- **Pagination**: Load more functionality for large transaction lists
- **Transaction Details**: Detailed view of transfer information

## Styling Approach

The application uses custom CSS without Tailwind CSS, featuring:

- **Modern Design**: Clean, professional banking interface
- **Responsive Layout**: Mobile-first responsive design
- **Smooth Animations**: Hover effects and transitions
- **Color Scheme**: Professional blue and green color palette
- **Typography**: Clear, readable font hierarchy
- **Component Isolation**: Scoped CSS for each component

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Input Validation**: Comprehensive client-side validation
- **Error Handling**: Secure error messages without exposing sensitive data
- **HTTPS Ready**: Prepared for production HTTPS deployment

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
