import ReactDOM from 'react-dom/client';
// import App from './App';
import BlogPage from './components/untiles';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
        <BlogPage />
  );
} else {
  console.error("Root element not found");
}

