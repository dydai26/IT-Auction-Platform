import React from 'react';
import AdminSidebar from './AdminSidebar';
import styles from './AdminLayout.module.css';

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;

  return (
    <div className={styles.wrapper}>
      <AdminSidebar lang={lang} />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
