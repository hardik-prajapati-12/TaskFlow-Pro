import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-gradient-flow font-display text-6xl font-bold">404</p>
      <h1 className="mt-3 font-display text-xl font-semibold text-ink-900 dark:text-white">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-400">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Button className="mt-6" leftIcon={<FiArrowLeft aria-hidden="true" />} onClick={() => navigate('/')}>
        Back to dashboard
      </Button>
    </div>
  );
}
