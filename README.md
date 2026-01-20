# Employee Leave Management System

A modern, responsive web application for managing employee leave requests built with Angular 19 and Tailwind CSS.

![Angular](https://img.shields.io/badge/Angular-19-red?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 🌟 Features

- **🔐 Secure Authentication**
  - User login/logout
  - Password reset functionality
  - JWT token-based authentication
  - Protected routes with guards

- **📋 Leave Management**
  - Apply for leave requests
  - View leave history and status
  - Track leave balances
  - Approve/reject leave requests (Admin)

- **📊 Dashboard**
  - Overview of leave statistics
  - Quick navigation to features
  - Responsive design for all devices

- **🎨 Modern UI/UX**
  - Built with Tailwind CSS
  - Responsive two-column layout
  - Dark/light theme support
  - Smooth animations and transitions

- **⚡ Performance**
  - Angular 19 with standalone components
  - Lazy loading for optimal performance
  - Server-side rendering (SSR) ready

## 🛠️ Tech Stack

- **Frontend**: Angular 19
- **Styling**: Tailwind CSS 3.4
- **Language**: TypeScript 5.7
- **Build Tool**: Angular CLI 21.1
- **State Management**: RxJS
- **HTTP Client**: Angular HttpClient
- **Forms**: Reactive Forms
- **Routing**: Angular Router with lazy loading

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **Git**: For version control

```bash
# Check versions
node --version
npm --version
git --version
```

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/evan246/employeeleaveapplication.git
   cd employeeleaveapplication
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   ng serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

## 📖 Usage

### Demo Credentials

For testing purposes, you can use these demo accounts:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | `admin@company.com` | `admin123` | Full system access |
| **Employee** | `employee@company.com` | `emp123` | Basic employee features |
| **Manager** | `manager@company.com` | `mgr123` | Approval capabilities |

### For Employees:
1. **Login**: Use your credentials to access the system
2. **Apply for Leave**: Navigate to "Apply Leave" and fill out the form
3. **View Requests**: Check your leave history in "My Leave Requests"
4. **Reset Password**: Use "Forgot Password" if needed

### For Administrators:
- Access to approve/reject leave requests
- View all employee leave statistics
- Manage leave policies

## 🏗️ Project Structure

```
src/
├── app/
│   ├── auth/                    # Authentication module
│   │   ├── login/              # Login component
│   │   ├── forgot-password/    # Password reset
│   │   └── reset-password/     # Password reset form
│   ├── dashboard/              # Main dashboard
│   ├── leave/                  # Leave management
│   │   ├── apply-leave/        # Leave application form
│   │   └── my-leave-requests/  # Leave history
│   ├── shared/                 # Shared components
│   │   ├── auth-layout/        # Authentication layout
│   │   ├── input/              # Custom input component
│   │   └── button/             # Custom button component
│   ├── services/               # Angular services
│   │   ├── auth.service.ts     # Authentication logic
│   │   ├── leave.service.ts    # Leave management
│   │   └── auth.interceptor.ts # HTTP interceptor
│   ├── guards/                 # Route guards
│   ├── models/                 # TypeScript interfaces
│   └── app.routes.ts           # Application routing
├── styles.scss                 # Global styles
└── main.ts                     # Application bootstrap
```

## 🔧 Development

### Available Scripts

```bash
# Development server
npm start
# or
ng serve

# Production build
npm run build
# or
ng build

# Run tests
npm test
# or
ng test

# Run linting
ng lint

# Generate component
ng generate component component-name

# Generate service
ng generate service service-name
```

### Code Quality

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **Angular CLI** for code generation

## 🔒 Authentication Flow

1. **Login**: Users authenticate with email/password
2. **JWT Tokens**: Access tokens stored securely
3. **Route Guards**: Protected routes require authentication
4. **Auto-logout**: Session management with token expiration

## 📱 Responsive Design

The application is fully responsive and works on:
- 📱 Mobile devices (320px+)
- 📲 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines

- Follow Angular style guide
- Use TypeScript strictly
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋 Support

If you have any questions or need help:

- 📧 **Email**: [your-email@example.com]
- 💬 **Issues**: [GitHub Issues](https://github.com/evan246/employeeleaveapplication/issues)
- 📖 **Documentation**: Check the code comments and this README

## 🚀 Deployment

### Build for Production

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/employeeleaveapplication/` directory.

### Deploy Options

- **GitHub Pages**: `ng deploy --base-href=/employeeleaveapplication/`
- **Vercel/Netlify**: Connect your GitHub repository
- **Firebase**: `firebase deploy`
- **Traditional Hosting**: Upload `dist/` contents to your server

## 📊 Future Enhancements

- [ ] Calendar integration for leave planning
- [ ] Email notifications for leave approvals
- [ ] Advanced reporting and analytics
- [ ] Mobile app companion
- [ ] Multi-language support
- [ ] Role-based access control
- [ ] Leave balance carry-forward
- [ ] Public holidays integration

---

**Built with ❤️ using Angular 19 and Tailwind CSS**

⭐ Star this repository if you find it helpful!
