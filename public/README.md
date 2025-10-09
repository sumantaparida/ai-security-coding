# AI Security Dashboard Frontend

A beautiful, modern web interface for the AI Security Coding Assistant.

## Features

### 🎨 Modern Dark Theme UI
- Responsive design that works on all devices
- Beautiful gradient backgrounds and glowing effects
- Smooth animations and transitions
- Professional dark theme with accent colors

### 🚀 Interactive Interface
- **Real-time status updates** - Shows connection status and processing state
- **Form validation** - Visual feedback for required fields
- **Quick examples** - Pre-built vulnerability scenarios for testing
- **Responsive results** - Beautiful formatting for AI responses

### ⌨️ Keyboard Shortcuts
- `Ctrl/Cmd + Enter` - Submit form
- `Escape` - Clear results

### 🔧 Built With
- Vanilla JavaScript (ES6+)
- Modern CSS with CSS Grid and Flexbox
- Font Awesome icons
- Inter font family

## File Structure

```
public/
├── index.html     # Main dashboard HTML
├── styles.css     # Comprehensive CSS styling
├── app.js         # JavaScript functionality
└── README.md      # This documentation
```

## Supported Vulnerability Types

- SQL Injection
- Cross-Site Scripting (XSS)
- Path Traversal
- Cross-Site Request Forgery (CSRF)
- Authentication Bypass
- Buffer Overflow
- Insecure Deserialization
- Command Injection

## Usage

1. Start the server with `pnpm dev`
2. Open `http://localhost:4000` in your browser
3. Use the quick examples or input your own vulnerability data
4. Submit and view AI-generated security patches

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## API Integration

The frontend connects to the `/suggest-patch` endpoint and handles:
- Loading states
- Error handling
- Response formatting
- Diff highlighting