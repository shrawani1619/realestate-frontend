import { Suspense } from 'react';
import LoginPage from './LoginPage';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center text-gray-400">
          Loading...
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  );
}
