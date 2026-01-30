
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ERPProvider } from './context';
import { Dashboard } from './modules/Dashboard';
import { Sales } from './modules/Sales';
import { Inventory } from './modules/Inventory';
import { Purchase } from './modules/Purchase';
import { Finance } from './modules/Finance';

const App: React.FC = () => {
  return (
    <ERPProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/purchase" element={<Purchase />} />
            <Route path="/finance" element={<Finance />} />
          </Routes>
        </Layout>
      </Router>
    </ERPProvider>
  );
};

export default App;
