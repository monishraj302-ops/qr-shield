import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Scanner from './components/Scanner';
import AnalysisProgressModal from './components/AnalysisProgressModal';
import SecurityReportModal from './components/SecurityReportModal';
import Dashboard from './components/Dashboard';
import History from './components/History';
import HowItWorks from './components/HowItWorks';
import SecurityFeatures from './components/SecurityFeatures';
import DemoMode from './components/DemoMode';
import PrivacySecurity from './components/PrivacySecurity';
import About from './components/About';
import Footer from './components/Footer';
import QrGeneratorModal from './components/QrGeneratorModal';

import { analyzeSecurity } from './utils/securityEngine';
import { 
  getScanHistory, saveScanRecord, deleteScanRecord, 
  clearAllHistory, computeStatistics 
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalScans: 0, lowRisk: 0, mediumRisk: 0, highRisk: 0, recentScans: [] });
  
  // Active payload to inspect or pass to Scanner
  const [scannerInitialPayload, setScannerInitialPayload] = useState(null);

  // Analysis workflow states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentPayloadForAnalysis, setCurrentPayloadForAnalysis] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  // QR Generator modal
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  // Initialize history and stats on load
  useEffect(() => {
    const loadedHistory = getScanHistory();
    setHistory(loadedHistory);
    setStats(computeStatistics(loadedHistory));
  }, []);

  // Refresh stats whenever history changes
  const updateHistoryState = (newHistory) => {
    setHistory(newHistory);
    setStats(computeStatistics(newHistory));
  };

  // Triggered when user clicks "Analyze Security" in Scanner
  const handleStartAnalysis = (payloadInfo) => {
    setCurrentPayloadForAnalysis(payloadInfo);
    setIsAnalyzing(true);
  };

  // Called when 10-step progress completes
  const handleAnalysisCompleted = () => {
    if (!currentPayloadForAnalysis) return;
    const result = analyzeSecurity(currentPayloadForAnalysis);
    
    // Save to storage
    saveScanRecord({
      ...result,
      qrType: currentPayloadForAnalysis.type
    });

    const refreshedHistory = getScanHistory();
    updateHistoryState(refreshedHistory);

    setIsAnalyzing(false);
    setAnalysisResult(result);
  };

  // Handle demo case selection
  const handleSelectDemo = (url) => {
    setScannerInitialPayload(url);
    const scannerSection = document.getElementById('scanner');
    if (scannerSection) {
      scannerSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle history item delete
  const handleDeleteHistory = (id) => {
    const updated = deleteScanRecord(id);
    updateHistoryState(updated);
  };

  // Handle history clear all
  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear all scan history from this browser?')) {
      const updated = clearAllHistory();
      updateHistoryState(updated);
    }
  };

  // Handle viewing audit details from Dashboard or History
  const handleViewAuditDetails = (resultObj) => {
    setAnalysisResult(resultObj);
  };

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Cybersecurity Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onScanClick={() => scrollToSection('scanner')}
      />

      {/* Floating QR Generator Trigger Button */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 90
      }}>
        <button
          onClick={() => setIsGeneratorOpen(true)}
          className="btn btn-secondary"
          style={{
            padding: '12px 18px',
            borderRadius: '50px',
            border: '1px solid #00f2fe',
            boxShadow: '0 4px 25px rgba(0, 242, 254, 0.35)',
            fontSize: '0.85rem'
          }}
        >
          <span>QR Generator Tool</span>
        </button>
      </div>

      {/* Main App Content Sections */}
      <main style={{ flex: 1 }}>
        {/* 1. Hero Section */}
        <Hero
          onOpenScanner={() => scrollToSection('scanner')}
          onOpenUpload={() => scrollToSection('scanner')}
          onOpenDemo={() => scrollToSection('demo')}
        />

        {/* 2. Interactive QR Scanner Panel */}
        <Scanner
          onStartAnalysis={handleStartAnalysis}
          initialPayload={scannerInitialPayload}
        />

        {/* 3. Demo Mode (3 Safe Cases with QR Codes) */}
        <DemoMode onSelectDemo={handleSelectDemo} />

        {/* 4. How It Works Pipeline */}
        <HowItWorks />

        {/* 5. Security Features & Heuristic Engine */}
        <SecurityFeatures />

        {/* 6. Threat Telemetry Dashboard */}
        <Dashboard
          stats={stats}
          onViewDetails={handleViewAuditDetails}
          onScanNow={() => scrollToSection('scanner')}
        />

        {/* 7. Scan History Logs */}
        <History
          history={history}
          onDelete={handleDeleteHistory}
          onClearAll={handleClearAllHistory}
          onViewDetails={handleViewAuditDetails}
        />

        {/* 8. Privacy & Trust Architecture */}
        <PrivacySecurity />

        {/* 9. Hackathon Project & Team Credentials */}
        <About />
      </main>

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* MODAL 1: 10-Step Security Pipeline Progress */}
      {isAnalyzing && (
        <AnalysisProgressModal onComplete={handleAnalysisCompleted} />
      )}

      {/* MODAL 2: Explainable Security Audit Result */}
      {analysisResult && (
        <SecurityReportModal
          result={analysisResult}
          onClose={() => setAnalysisResult(null)}
          onScanAnother={() => {
            setScannerInitialPayload(null);
            scrollToSection('scanner');
          }}
        />
      )}

      {/* MODAL 3: Bonus QR Code Generator Tool */}
      <QrGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onSendToScanner={(txt) => {
          setScannerInitialPayload(txt);
          scrollToSection('scanner');
        }}
      />
    </div>
  );
}
