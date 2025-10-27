# 📦 AuthBase Stable - Dependencies Documentation

## ⚛️ Core Frontend Dependencies

### **React & Framework**

| Package            | Version | Purpose             | Criticality |
| ------------------ | ------- | ------------------- | ----------- |
| `react`            | ^18.2.0 | UI framework        | 🔴 Critical |
| `react-dom`        | ^18.2.0 | DOM rendering       | 🔴 Critical |
| `react-router-dom` | ^6.20.1 | Client-side routing | 🔴 Critical |
| `typescript`       | ^5.2.2  | Type safety         | 🔴 Critical |

### **UI & Styling**

| Package                    | Version  | Purpose               | Criticality  |
| -------------------------- | -------- | --------------------- | ------------ |
| `tailwindcss`              | ^3.3.6   | CSS framework         | 🔴 Critical  |
| `lucide-react`             | ^0.294.0 | Icons                 | 🟡 Important |
| `class-variance-authority` | ^0.7.0   | CSS class utilities   | 🟡 Important |
| `clsx`                     | ^2.0.0   | className conditional | 🟡 Important |

### **UI Components (shadcn/ui)**

| Package                         | Version | Purpose               | Criticality  |
| ------------------------------- | ------- | --------------------- | ------------ |
| `@radix-ui/react-avatar`        | ^1.0.4  | Avatar components     | 🟢 Optional  |
| `@radix-ui/react-dropdown-menu` | ^2.0.6  | Dropdown menus        | 🟡 Important |
| `@radix-ui/react-label`         | ^2.0.2  | Form labels           | 🟡 Important |
| `@radix-ui/react-select`        | ^2.0.0  | Select inputs         | 🟡 Important |
| `@radix-ui/react-slot`          | ^1.0.2  | Component composition | 🟡 Important |
| `@radix-ui/react-switch`        | ^1.0.3  | Toggle switches       | 🟢 Optional  |
| `@radix-ui/react-tabs`          | ^1.0.4  | Tab interfaces        | 🟡 Important |

### **Utilities & API**

| Package  | Version | Purpose             | Criticality  |
| -------- | ------- | ------------------- | ------------ |
| `axios`  | ^1.6.2  | HTTP client         | 🔴 Critical  |
| `sonner` | ^1.0.2  | Toast notifications | 🟡 Important |

## 🔧 Development & Build

| Package                | Version  | Purpose                 |
| ---------------------- | -------- | ----------------------- |
| `vite`                 | ^4.5.0   | Build tool & dev server |
| `@vitejs/plugin-react` | ^4.1.1   | Vite React plugin       |
| `@types/react`         | ^18.2.37 | TypeScript definitions  |
| `@types/react-dom`     | ^18.2.15 | TypeScript definitions  |

## 📊 Bundle Analysis

- **Initial Bundle**: ~150KB gzipped
- **Total Dependencies**: 19 packages
- **Tree-shaking**: Enabled via Vite
- **Code Splitting**: Route-based

## 🛡️ Security Considerations

- **XSS Protection**: React DOM sanitization
- **CSRF**: Axios with token integration
- **CORS**: Configured for production domains

## 🔄 Update Strategy

- **Bi-weekly**: Security patches
- **Monthly**: Minor versions
- **Semi-annual**: Major versions (with regression testing)

## 🎨 Design System

Built on:

- **Tailwind CSS** - Utility-first CSS
- **Radix UI** - Accessible primitives
- **shadcn/ui** - Component library
