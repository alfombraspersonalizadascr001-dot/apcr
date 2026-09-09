'use client';

import React from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { MatSimulator } from '../../components/MatSimulator';

export default function CrmSimuladorPage() {
  return (
    <SidebarLayout
      title="Simulador Técnico & Ficha Cajetín"
      badge="PRODUCCIÓN"
      badgeColor="emerald"
      activeModule="simulador"
    >
      <div className="py-4">
        <MatSimulator />
      </div>
    </SidebarLayout>
  );
}
