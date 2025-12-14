import type { ReactNode } from 'react';
import Sidebar from '../UI/Sidebar';
import EmployeeSidebar from '../UI/EmployeeSidebar';

interface LayoutProps {
  children: ReactNode;
  sidebar?: boolean;
  type?: string;
}

export default function Layout({ children, sidebar = false, type='admin' }: LayoutProps) {
  return (
    <div className="w-screen h-screen bg-sky-50">
      <div className="flex w-full h-full">

        {sidebar && type === 'admin' && <Sidebar />}
        {sidebar && type === 'employee' && <EmployeeSidebar />}

        <div className="w-full flex flex-col items-center">
          {children}
        </div>

      </div>
    </div>
  );
}