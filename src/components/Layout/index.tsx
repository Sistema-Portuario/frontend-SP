import type { ReactNode } from 'react';
import Sidebar from '../UI/Sidebar';

interface LayoutProps {
  children: ReactNode;
  sidebar?: boolean;
}

export default function Layout({ children, sidebar = false }: LayoutProps) {
  return (
    <div className="w-screen h-screen bg-sky-50">
      <div className="flex w-full h-full">
        {sidebar && <Sidebar />}

        <div className=" w-full flex flex-col items-center">
          {children}
        </div>

      </div>
    </div>
  );
}