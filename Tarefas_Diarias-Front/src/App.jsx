import './styles/globals.css';
import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './store/store';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
