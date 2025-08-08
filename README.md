# MetaSelect - Breast Cancer Classification

A modern, AI-powered breast cancer classification web application built with Next.js, shadcn/ui, and Clerk authentication.

## Features

- 🔐 **Secure Authentication** - Built with Clerk for seamless user authentication
- 🎨 **Modern UI** - Beautiful, responsive design with glassmorphism effects
- 📊 **AI Classification** - Breast cancer classification with probability scores
- 📈 **XAI Explanations** - Explainable AI with heat map visualizations
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- 🎯 **User-Friendly** - Intuitive interface for medical professionals

## Tech Stack

### Frontend
- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: Clerk
- **Icons**: Lucide React
- **State Management**: React Hooks

### Backend
- **Framework**: FastAPI
- **ML Framework**: TensorFlow/Keras
- **Image Processing**: OpenCV, Pillow
- **API Documentation**: Swagger/OpenAPI

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Python 3.8+
- pip
- Clerk account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd metaselect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. **Set up the backend**
   ```bash
   # Windows
   setup-backend.bat
   
   # Unix/Mac
   chmod +x setup-backend.sh
   ./setup-backend.sh
   ```

5. **Start the backend server**
   ```bash
   cd backend
   # Windows
   venv\Scripts\activate.bat
   
   # Unix/Mac
   source venv/bin/activate
   
   python start.py
   ```

6. **Start the frontend development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)
   
   The backend API will be available at [http://localhost:8000](http://localhost:8000)
   API documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

## Project Structure

```
metaselect/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   ├── page.js            # Main page
│   ├── sign-in/           # Sign-in page
│   └── sign-up/           # Sign-up page
├── backend/               # FastAPI backend
│   ├── main.py           # Main FastAPI application
│   ├── start.py          # Server startup script
│   ├── requirements.txt  # Python dependencies
│   └── README.md         # Backend documentation
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── auth-wrapper.jsx  # Authentication wrapper
├── lib/                  # Utility functions
│   └── api.js           # API communication utilities
├── public/               # Static assets
├── best_model.h5         # Trained ML model
├── middleware.js         # Clerk middleware
├── setup-backend.bat     # Windows backend setup script
└── setup-backend.sh      # Unix backend setup script
```

## Key Components

### Authentication
- Custom sign-in and sign-up pages with modern design
- Clerk integration for secure user management
- Protected routes with middleware

### Main Interface
- **Upload Panel**: Drag-and-drop file upload with visual feedback
- **Results Display**: Probability scores, diagnosis, and XAI explanations
- **Navigation**: Clean header with user information and actions

### Styling
- Dark theme with glassmorphism effects
- Gradient backgrounds and modern typography
- Responsive design for all screen sizes

## Customization

### Colors and Themes
The application uses CSS custom properties for easy theming. Main colors can be modified in `app/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... more variables */
}
```

### Components
All UI components are built with shadcn/ui and can be customized in the `components/ui/` directory.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@metaselect.com or join our Slack channel.

## Acknowledgments

- [Clerk](https://clerk.com) for authentication
- [shadcn/ui](https://ui.shadcn.com) for UI components
- [Lucide](https://lucide.dev) for icons
- [Tailwind CSS](https://tailwindcss.com) for styling
