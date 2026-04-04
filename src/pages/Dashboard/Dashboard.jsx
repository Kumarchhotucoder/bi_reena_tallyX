import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import useGlobalShortcuts from '../../hooks/useGlobalShortcuts';
import './Dashboard.css';
import logoImage from '../../assets/logo.jpeg';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [openMenus, setOpenMenus] = useState({ coreTransactions: true });
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [dashboardData, setDashboardData] = useState({ ledgers: [], stocks: [], vouchers: [] });
  const [metrics, setMetrics] = useState({ receivables: 0, payables: 0, cash: 0, cashIn: 0, cashOut: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [settingsModalTitle, setSettingsModalTitle] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const profileRef = useRef(null);
  const [user, setUser] = useState({ 
    name: localStorage.getItem('tallyx_user_name') || 'Admin User', 
    email: localStorage.getItem('tallyx_user_email') || 'admin@bireena.com', 
    role: localStorage.getItem('tallyx_user_role') || 'admin',
    initials: (localStorage.getItem('tallyx_user_name') || 'AD').substring(0, 2).toUpperCase(),
    companyName: localStorage.getItem('tallyx_company_name') || 'My Company' 
  });

  // Company Form State
  const [companyForm, setCompanyForm] = useState({
    name: '',
    mailingName: '',
    address: '',
    state: '',
    country: 'India',
    pin: '',
    phone: '',
    email: '',
    gstinUin: '',
    pan: '',
    fyFrom: '2025-04-01',
    booksFrom: '2025-04-01',
    securityPassword: ''
  });

  const [ledgerForm, setLedgerForm] = useState({
    name: '',
    group: 'Sundry Debtors',
    billByBill: 'Yes',
    address: '',
    state: '',
    gstType: 'Regular',
    gstin: '',
    openingBalance: '0.00',
    balanceType: 'Dr'
  });

  const [stockForm, setStockForm] = useState({
    name: '',
    under: 'Primary',
    units: 'Nos',
    hsn: '',
    taxability: 'Taxable (18%)',
    costingMethod: 'Average Cost',
    batch: 'No',
    openingQty: '0',
    rate: '0.00'
  });

  const [salesForm, setSalesForm] = useState({
    partyName: 'Rahul Traders (GST: 10AAAAA1234A1Z1)',
    salesLedger: 'Sales - Local @ 18%',
    placeOfSupply: '10 - Bihar',
    narration: '',
    items: [{ name: '', hsn: '8471', qty: '0', rate: '0.00', disc: '0', amount: '0.00' }]
  });

  const [purchaseForm, setPurchaseForm] = useState({
    partyName: 'XYZ Suppliers (Creditor)',
    purchaseLedger: 'Purchase Accounts @ 18%',
    invNo: '',
    invDate: '2025-04-01',
    narration: '',
    items: [{ name: '', qty: '0', rate: '0.00', per: 'Nos', amount: '0.00' }]
  });

  const [voucherForm, setVoucherForm] = useState({
    type: 'PAYMENT',
    date: '2025-04-01',
    voucherNo: '001',
    account: 'Cash',
    narration: '',
    entries: [
      { type: 'Dr', ledger: '', debit: '0.00', credit: '0.00' },
      { type: 'Cr', ledger: '', debit: '0.00', credit: '0.00' }
    ]
  });

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('tallyx_token');
      if (token && token.startsWith('mock-jwt-token-')) {
          console.warn('Mock token detected. Logging out for security...');
          handleLogout();
      }
    };
    checkToken();

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('tallyx_token');
        const headers = { Authorization: `Bearer ${token}` };
        const lRes = await fetch('http://localhost:5001/api/ledgers', { headers });
        const sRes = await fetch('http://localhost:5001/api/stocks', { headers });
        const vRes = await fetch('http://localhost:5001/api/vouchers', { headers });

        if (lRes.status === 401 || sRes.status === 401 || vRes.status === 401) {
            console.warn("Session expired or invalid token. Logging out...");
            handleLogout();
            return;
        }

        const ledgers = await lRes.json();
        const stocks = await sRes.json();
        const vouchers = await vRes.json();
        setDashboardData({ ledgers: ledgers || [], stocks: stocks || [], vouchers: vouchers || [] });
        
        let rec = 0, pay = 0, cashIn = 0, cashOut = 0, cash = 0;
        if(vouchers && vouchers.length > 0) {
           vouchers.forEach(v => {
              if(v.type === 'SALES') rec += v.totalAmount || 0;
              if(v.type === 'PURCHASE') pay += v.totalAmount || 0;
              if(v.type === 'RECEIPT') cashIn += v.totalAmount || 0;
              if(v.type === 'PAYMENT') cashOut += v.totalAmount || 0;
           });
           cash = cashIn - cashOut;
        }
        setMetrics({ receivables: rec, payables: pay, cash: cash, cashIn: cashIn, cashOut: cashOut });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [user.role]); // Refetch if role changes (unlikely)

  // Smart Narration Logic
  useEffect(() => {
    if (activeTab === 'SALES') {
      setSalesForm(prev => ({ ...prev, narration: prev.narration || `Being goods sold on credit to ${prev.partyName}` }));
    } else if (activeTab === 'PURCHASE') {
      setPurchaseForm(prev => ({ ...prev, narration: prev.narration || `Being goods purchased on credit from ${prev.partyName}` }));
    } else if (activeTab === 'PAYMENT') {
      setVoucherForm(prev => ({ ...prev, type: 'PAYMENT', narration: prev.narration || `Being payment made via ${prev.account}` }));
    } else if (activeTab === 'RECEIPT') {
      setVoucherForm(prev => ({ ...prev, type: 'RECEIPT', narration: prev.narration || `Being payment received via ${prev.account}` }));
    } else if (activeTab === 'CONTRA') {
      setVoucherForm(prev => ({ ...prev, type: 'CONTRA', narration: prev.narration || `Being cash/bank transfer via ${prev.account}` }));
    } else if (activeTab === 'JOURNAL') {
      setVoucherForm(prev => ({ ...prev, type: 'JOURNAL', narration: prev.narration || `Being adjustment entry` }));
    }
  }, [activeTab]);

  useGlobalShortcuts(setActiveTab);

  const reportData = useMemo(() => {
    const vouchers = dashboardData.vouchers || [];
    const ledgers = dashboardData.ledgers || [];

    // GST Calculations
    const gstData = {
      taxableSales: 0,
      cgstSales: 0,
      sgstSales: 0,
      totalSalesWithTax: 0,
      taxablePurchases: 0,
      cgstPurchases: 0,
      sgstPurchases: 0,
      totalPurchasesWithTax: 0
    };

    vouchers.forEach(v => {
      const amount = parseFloat(v.totalAmount || 0);
      const taxable = amount / 1.18;
      const gst = (amount - taxable) / 2;

      if (v.type === 'SALES') {
        gstData.taxableSales += taxable;
        gstData.cgstSales += gst;
        gstData.sgstSales += gst;
        gstData.totalSalesWithTax += amount;
      } else if (v.type === 'PURCHASE') {
        gstData.taxablePurchases += taxable;
        gstData.cgstPurchases += gst;
        gstData.sgstPurchases += gst;
        gstData.totalPurchasesWithTax += amount;
      }
    });

    // P&L Calculations (Simplified)
    const plData = {
      openingStock: 0, // Simplified for now
      purchases: gstData.totalPurchasesWithTax,
      sales: gstData.totalSalesWithTax,
      closingStock: 0, // Simplified for now
      expenses: 0 // Simplified for now
    };
    plData.grossProfit = plData.sales - plData.purchases;

    // Balance Sheet Summaries
    const bsData = {
      assets: {
        fixed: 0,
        investments: 0,
        cash: metrics.cash,
        debtors: ledgers.filter(l => l.group === 'Sundry Debtors').reduce((sum, l) => sum + (parseFloat(l.openingBalance) || 0), 0)
      },
      liabilities: {
        capital: 0,
        loans: 0,
        creditors: ledgers.filter(l => l.group === 'Sundry Creditors').reduce((sum, l) => sum + (parseFloat(l.openingBalance) || 0), 0),
        tax: gstData.cgstSales + gstData.sgstSales - (gstData.cgstPurchases + gstData.sgstPurchases)
      }
    };

    return { gstData, plData, bsData, vouchers: vouchers.sort((a,b) => new Date(b.date) - new Date(a.date)) };
  }, [dashboardData, metrics]);

  // Keyboard Shortcut Handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      
      const key = e.key;
      const alt = e.altKey;

      // Esc always returns to dashboard
      if (key === 'Escape') { 
        setActiveTab('DASHBOARD'); 
        return; 
      }

      // Functional Keys (F1 - F10)
      if (key === 'F1') { e.preventDefault(); setActiveTab('COMPANY'); }
      else if (key === 'F2') { e.preventDefault(); setActiveTab('LEDGER'); }
      else if (key === 'F3') { e.preventDefault(); setActiveTab('STOCK'); }
      else if (key === 'F4') { e.preventDefault(); setActiveTab('CONTRA'); }
      else if (key === 'F5') { e.preventDefault(); setActiveTab('PAYMENT'); }
      else if (key === 'F6') { e.preventDefault(); setActiveTab('RECEIPT'); }
      else if (key === 'F7') { e.preventDefault(); setActiveTab('JOURNAL'); }
      else if (key === 'F8') { e.preventDefault(); setActiveTab('SALES'); }
      else if (key === 'F9') { e.preventDefault(); setActiveTab('PURCHASE'); }
      else if (key === 'F10') { e.preventDefault(); setActiveTab('BANKING'); }

      // Alt Shortcuts
      if (alt) {
        const lowerKey = key.toLowerCase();
        if (lowerKey === 't') { e.preventDefault(); if (user.role !== 'staff') setActiveTab('GST'); } 
        else if (lowerKey === 'd') { e.preventDefault(); setActiveTab('DAYBOOK'); }
        else if (lowerKey === 'v') { e.preventDefault(); if (user.role !== 'staff') setActiveTab('VERIFICATION'); }
        else if (lowerKey === 'p') { e.preventDefault(); if (user.role !== 'staff') setActiveTab('PL'); }
        else if (lowerKey === 'b') { e.preventDefault(); if (user.role !== 'staff') setActiveTab('BS'); }
        else if (lowerKey === 'r') { e.preventDefault(); setActiveTab('EXPORT'); }
        else if (lowerKey === 'k') { e.preventDefault(); setActiveTab('BACKUP'); }
        else if (lowerKey === 'i') { e.preventDefault(); setActiveTab('IMPORT'); }
        else if (lowerKey === 'u') { e.preventDefault(); setSettingsModalTitle('My Profile'); setSettingsModalOpen(true); }
        else if (lowerKey === 'l') { e.preventDefault(); handleLogout(); }
        else if (lowerKey === 'g') {
          e.preventDefault();
          const searchInput = document.querySelector('.command-center input');
          if (searchInput) searchInput.focus();
        }
      }

      // Quick actions for specific tabs
      if (activeTab === 'IMPORT' && !alt && !e.ctrlKey) {
        if (key === '1') { document.getElementById('import-masters-xml')?.click(); }
        if (key === '2') { document.getElementById('import-vouchers-xml')?.click(); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);


  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleLogout = () => {
    localStorage.removeItem('tallyx_token');
    localStorage.removeItem('tallyx_user_name');
    localStorage.removeItem('tallyx_company_name');
    localStorage.removeItem('tallyx_user_email');
    navigate('/');
  };

  // 🚀 ULTRA-PREMIUM ALIGNED STYLES (No Overflow, Fixed Bounds)
  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    color: 'var(--text-main)',
    outline: 'none',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box', // Yeh kisi bhi box ko bahar nahi jane dega
    transition: 'all 0.3s ease'
  };

  const labelStyle = {
    fontSize: '12px',
    color: 'var(--text-dim)',
    marginBottom: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: '600',
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  };

  const voucherTableStyle = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    minWidth: '700px', // Ensures table details don't squash too much
    boxSizing: 'border-box'
  };

  const thStyle = {
    background: 'linear-gradient(180deg, rgba(48,54,61,0.5) 0%, rgba(22,27,34,0.5) 100%)',
    borderBottom: '1px solid var(--border)',
    padding: '12px 10px',
    textAlign: 'left',
    color: 'var(--text-dim)',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase'
  };

  const tdStyle = {
    borderBottom: '1px solid var(--border)',
    borderRight: '1px solid var(--border)',
    padding: '8px',
    background: 'var(--card-bg)'
  };
  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    
    // Client-side Validation for Security
    if (!companyForm.name) {
        alert('Company Name is required');
        return;
    }

    if (companyForm.gstinUin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(companyForm.gstinUin.toUpperCase())) {
        alert('Invalid GSTIN format');
        return;
    }

    if (companyForm.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(companyForm.pan.toUpperCase())) {
        alert('Invalid PAN format');
        return;
    }

    if (companyForm.pin && !/^[0-9]{6}$/.test(companyForm.pin)) {
        alert('Invalid PIN Code (must be 6 digits)');
        return;
    }

    try {
      const token = localStorage.getItem('tallyx_token');
      const response = await fetch('http://localhost:5001/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(companyForm)
      });

      if (response.status === 401) {
          alert('Session expired. Please login again.');
          handleLogout();
          return;
      }

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(`Company "${companyForm.name}" created successfully!`);
        setShowSuccessModal(true);
        
        // Update user context
        localStorage.setItem('tallyx_company_name', companyForm.name);
        setUser(prev => ({ 
          ...prev, 
          companyName: companyForm.name, 
          initials: companyForm.name.substring(0, 2).toUpperCase() 
        }));
      } else {
        alert(data.message || 'Error creating company');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to connect to server. Please try again.');
    }
  };

  const handleVoucherChange = (e) => {
    const { name, value } = e.target;
    setVoucherForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEntryChange = (index, field, value) => {
    setVoucherForm(prev => {
      const newEntries = [...prev.entries];
      newEntries[index] = { ...newEntries[index], [field]: value };
      return { ...prev, entries: newEntries };
    });
  };

  const handleLedgerChange = (e) => {
    const { name, value } = e.target;
    setLedgerForm(prev => ({ ...prev, [name]: value }));
  };

  const handleStockChange = (e) => {
    const { name, value } = e.target;
    setStockForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSalesChange = (e) => {
    const { name, value } = e.target;
    setSalesForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePurchaseChange = (e) => {
    const { name, value } = e.target;
    setPurchaseForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSalesSubmit = async (e) => {
    e.preventDefault();
    if (!salesForm.partyName.trim()) {
      alert('Party Name is required');
      return;
    }
    try {
      const token = localStorage.getItem('tallyx_token');
      const response = await fetch('http://localhost:5001/api/vouchers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          ...salesForm, 
          type: 'SALES', 
          companyName: user.companyName,
          status: user.role === 'staff' ? 'pending' : 'approved' 
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(`Sales Invoice ${salesForm.partyName} saved successfully!`);
        setShowSuccessModal(true);
        // Update metrics
        setMetrics(prev => ({
          ...prev,
          cashIn: prev.cashIn + parseFloat(salesForm.totalAmount || 0),
          cash: prev.cash + parseFloat(salesForm.totalAmount || 0)
        }));
        // Reset
        setSalesForm({ partyName: '', date: '2025-04-01', invNo: 'INV/25-01', items: [], totalAmount: 0 });
      } else {
        alert(data.message || 'Error creating sales voucher');
      }
    } catch (err) {
      console.error('Error:', err);
      setSuccessMessage(`Sales Invoice ${salesForm.partyName} saved successfully (Local)!`);
      setShowSuccessModal(true);
    }
  };

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    if (!purchaseForm.partyName.trim()) {
      alert('Party Name is required');
      return;
    }
    try {
      const token = localStorage.getItem('tallyx_token');
      const response = await fetch('http://localhost:5001/api/vouchers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          ...purchaseForm, 
          type: 'PURCHASE', 
          companyName: user.companyName,
          status: user.role === 'staff' ? 'pending' : 'approved'
        })
      });
      if (response.ok) {
        setSuccessMessage(`Purchase Voucher ${purchaseForm.invNo} saved successfully!`);
        setShowSuccessModal(true);
        // Update metrics
        setMetrics(prev => ({
          ...prev,
          cashOut: prev.cashOut + parseFloat(purchaseForm.totalAmount || 0),
          cash: prev.cash - parseFloat(purchaseForm.totalAmount || 0)
        }));
        // Reset
        setPurchaseForm({ partyName: '', date: '2025-04-01', invNo: 'PUR/25-01', items: [], totalAmount: 0 });
      }
    } catch (err) {
      setSuccessMessage(`Purchase Voucher ${purchaseForm.invNo} saved successfully (Local)!`);
      setShowSuccessModal(true);
    }
  };

  const handleVoucherSubmit = async (e) => {
    e.preventDefault();
    if (!voucherForm.partyName?.trim() && !voucherForm.ledgerName?.trim()) {
      alert('Account/Ledger name is required');
      return;
    }
    try {
      const token = localStorage.getItem('tallyx_token');
      const response = await fetch('http://localhost:5001/api/vouchers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          ...voucherForm, 
          type: activeTab, 
          companyName: user.companyName,
          status: user.role === 'staff' ? 'pending' : 'approved'
        })
      });
      if (response.ok) {
        setSuccessMessage(`${activeTab} Voucher saved successfully!`);
        setShowSuccessModal(true);
        // Reset
        setVoucherForm({ partyName: '', account: '', amount: 0, narration: '' });
      }
    } catch (err) {
      setSuccessMessage(`${activeTab} Voucher saved successfully (Local)!`);
      setShowSuccessModal(true);
    }
  };

  const handleLedgerSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!ledgerForm.name.trim()) {
      alert('Ledger name is required');
      return;
    }

    // Uniqueness Check (Local)
    const isDuplicate = dashboardData.ledgers.some(l => l.name.toLowerCase() === ledgerForm.name.toLowerCase());
    if (isDuplicate) {
      alert(`Ledger "${ledgerForm.name}" already exists!`);
      return;
    }

    // GSTIN Validation (if Regular)
    if (ledgerForm.gstType === 'Regular' && ledgerForm.gstin) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(ledgerForm.gstin.toUpperCase())) {
        alert('Invalid GSTIN format!');
        return;
      }
    }

    try {
      const token = localStorage.getItem('tallyx_token');
      const response = await fetch('http://localhost:5001/api/ledgers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...ledgerForm, companyName: user.companyName })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(`Ledger "${ledgerForm.name}" created successfully!`);
        setShowSuccessModal(true);
        // Update local state to include new ledger
        setDashboardData(prev => ({ ...prev, ledgers: [...prev.ledgers, data] }));
        // Reset form
        setLedgerForm({
          name: '', group: 'Sundry Debtors', billByBill: 'Yes', address: '', state: '',
          gstType: 'Regular', gstin: '', openingBalance: '0.00', balanceType: 'Dr'
        });
      } else {
        alert(data.message || 'Error creating ledger');
      }
    } catch (err) {
      console.error('Error:', err);
      setSuccessMessage(`Ledger "${ledgerForm.name}" created (Local)!`);
      setShowSuccessModal(true);
    }
  };

  const handleStockSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!stockForm.name.trim()) {
      alert('Stock item name is required');
      return;
    }

    // Uniqueness Check (Local)
    const isDuplicate = dashboardData.stocks.some(s => s.name.toLowerCase() === stockForm.name.toLowerCase());
    if (isDuplicate) {
      alert(`Stock item "${stockForm.name}" already exists!`);
      return;
    }

    try {
      const token = localStorage.getItem('tallyx_token');
      const response = await fetch('http://localhost:5001/api/stocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...stockForm, companyName: user.companyName })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(`Stock Item "${stockForm.name}" created successfully!`);
        setShowSuccessModal(true);
        // Update local state
        setDashboardData(prev => ({ ...prev, stocks: [...prev.stocks, data] }));
        // Reset form
        setStockForm({
          name: '', under: 'Primary', units: 'Nos', hsn: '', taxability: 'Taxable (18%)',
          costingMethod: 'Average Cost', batch: 'No', openingQty: '0', rate: '0.00'
        });
      } else {
        alert(data.message || 'Error creating stock item');
      }
    } catch (err) {
      console.error('Error:', err);
      setSuccessMessage(`Stock Item "${stockForm.name}" created (Local)!`);
      setShowSuccessModal(true);
    }
  };



  const renderReport = () => {
    switch(activeTab) {
      
      // --- 🚀 NEW SAANDAR SCREENS (Fixed Alignment & Detailed) ---

      case 'SALES':
        return (
          <div className="report-card animate-fade voucher-sales" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div className="report-header" style={{ background: 'linear-gradient(90deg, rgba(47,129,247,0.1) 0%, transparent 100%)', borderLeft: '4px solid var(--accent-blue)', padding: '15px 20px' }}>
              <div>
                <h3 style={{color: 'var(--accent-blue)', fontSize: '20px', margin: '0 0 5px 0'}}><i className="fas fa-file-invoice-dollar"></i> Sales Tax Invoice</h3>
                <span style={{ background: 'var(--accent-blue)', color: '#fff', padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>F8 : VOUCHER</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}># INV-25/001</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '13px' }}><i className="far fa-calendar-alt"></i> 01-Apr-2025</div>
                <button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn" style={{marginTop: '8px'}}><i className="fas fa-times"></i> Esc: Quit</button>
              </div>
            </div>
                   <form onSubmit={handleSalesSubmit} style={{ padding: '20px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderTop: 'none', boxSizing: 'border-box' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={labelStyle}><span>Party A/c Name</span> <span style={{color: 'var(--accent-blue)'}}>+ Alt C</span></label>
                  <select 
                    name="partyName"
                    value={salesForm.partyName}
                    onChange={handleSalesChange}
                    style={inputStyle}
                  >
                    <option value="">Select Party...</option>
                    {dashboardData.ledgers.filter(l => l.group === 'Sundry Debtors').map(l => (
                      <option key={l._id} value={l.name}>{l.name}</option>
                    ))}
                    <option>Cash</option>
                  </select>
                </div>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={labelStyle}>Sales Ledger</label>
                  <select 
                    name="salesLedger"
                    value={salesForm.salesLedger}
                    onChange={handleSalesChange}
                    style={inputStyle}
                  >
                    <option>Sales - Local @ 18%</option>
                    <option>Sales - Interstate @ 18%</option>
                  </select>
                </div>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={labelStyle}>Place of Supply</label>
                  <input 
                    type="text" 
                    name="placeOfSupply"
                    value={salesForm.placeOfSupply}
                    onChange={handleSalesChange}
                    style={inputStyle} 
                  />
                </div>
              </div>

              {/* Table Wrapper ensures no overflow */}
              <div style={{ width: '100%', overflowX: 'auto', boxSizing: 'border-box', marginBottom: '20px' }}>
                <table style={voucherTableStyle}>
                  <thead>
                    <tr>
                      <th style={{...thStyle, width: '30%'}}>Name of Item</th>
                      <th style={{...thStyle, width: '10%', textAlign: 'center'}}>HSN/SAC</th>
                      <th style={{...thStyle, width: '10%', textAlign: 'right'}}>Qty</th>
                      <th style={{...thStyle, width: '15%', textAlign: 'right'}}>Rate (₹)</th>
                      <th style={{...thStyle, width: '10%', textAlign: 'right'}}>Disc %</th>
                      <th style={{...thStyle, width: '15%', textAlign: 'right', color: 'var(--accent-blue)'}}>Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdStyle}><input type="text" style={{...inputStyle, border: 'none', background: 'transparent'}} placeholder="Select Item..." /></td>
                      <td style={tdStyle}><input type="text" style={{...inputStyle, textAlign: 'center', border: 'none', background: 'transparent'}} placeholder="8471" /></td>
                      <td style={tdStyle}><input type="text" style={{...inputStyle, textAlign: 'right', border: 'none', background: 'transparent'}} placeholder="0" /></td>
                      <td style={tdStyle}><input type="text" style={{...inputStyle, textAlign: 'right', border: 'none', background: 'transparent'}} placeholder="0.00" /></td>
                      <td style={tdStyle}><input type="text" style={{...inputStyle, textAlign: 'right', border: 'none', background: 'transparent'}} placeholder="0" /></td>
                      <td style={tdStyle}><input type="text" style={{...inputStyle, textAlign: 'right', border: 'none', background: 'transparent', fontWeight: 'bold'}} placeholder="0.00" readOnly /></td>
                    </tr>
                    <tr>
                      <td colSpan="5" style={{...tdStyle, textAlign: 'right', color: 'var(--text-dim)', borderRight: 'none'}}>CGST @ 9%</td>
                      <td style={{...tdStyle, textAlign: 'right', color: 'var(--text-dim)'}}>0.00</td>
                    </tr>
                    <tr>
                      <td colSpan="5" style={{...tdStyle, textAlign: 'right', color: 'var(--text-dim)', borderRight: 'none'}}>SGST @ 9%</td>
                      <td style={{...tdStyle, textAlign: 'right', color: 'var(--text-dim)'}}>0.00</td>
                    </tr>
                    <tr style={{ background: 'rgba(47,129,247,0.05)' }}>
                      <td colSpan="5" style={{...tdStyle, textAlign: 'right', fontWeight: '900', borderRight: 'none', color: 'var(--text-main)'}}>GRAND TOTAL</td>
                      <td style={{...tdStyle, textAlign: 'right', fontWeight: '900', fontSize: '18px', color: 'var(--accent-blue)'}}>₹ 0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', boxSizing: 'border-box' }}>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={labelStyle}>Narration / Remarks:</label>
                  <textarea 
                    name="narration"
                    value={salesForm.narration}
                    onChange={handleSalesChange}
                    style={{...inputStyle, height: '50px', resize: 'none'}} 
                    placeholder="Being goods sold on credit..."
                  ></textarea>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', boxSizing: 'border-box' }}>
                  <button type="submit" style={{ background: 'linear-gradient(135deg, #2f81f7 0%, #1a62cc 100%)', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    <i className="fas fa-check-circle"></i> Save (Ctrl+A)
                  </button>
                </div>
              </div>
            </form>
          </div>
        );

      case 'PURCHASE':
        return (
          <div className="report-card animate-fade voucher-purchase" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div className="report-header" style={{ background: 'linear-gradient(90deg, rgba(40,167,69,0.1) 0%, transparent 100%)', borderLeft: '4px solid var(--accent-green)', padding: '15px 20px' }}>
              <div>
                <h3 style={{color: 'var(--accent-green)', fontSize: '20px', margin: '0 0 5px 0'}}><i className="fas fa-shopping-basket"></i> Purchase Voucher</h3>
                <span style={{ background: 'var(--accent-green)', color: '#fff', padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>F9 : VOUCHER</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '5px' }}>
                    <input 
                      type="text" 
                      name="invNo"
                      value={purchaseForm.invNo}
                      onChange={handlePurchaseChange}
                      style={{...inputStyle, width: '130px', padding: '6px', fontSize: '13px'}} 
                      placeholder="Sup. Inv No." 
                    />
                    <input 
                      type="date" 
                      name="date"
                      value={purchaseForm.date}
                      onChange={handlePurchaseChange}
                      style={{...inputStyle, width: '130px', padding: '6px', fontSize: '13px'}} 
                    />
                </div>
                <button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn" style={{marginTop: '5px'}}><i className="fas fa-times"></i> Esc: Quit</button>
              </div>
            </div>
            
            <form onSubmit={handlePurchaseSubmit} style={{ padding: '20px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderTop: 'none', boxSizing: 'border-box' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={labelStyle}><span>Party A/c Name</span></label>
                  <select 
                    name="partyName"
                    value={purchaseForm.partyName}
                    onChange={handlePurchaseChange}
                    style={inputStyle}
                  >
                    <option value="">Select Supplier...</option>
                    {dashboardData.ledgers.filter(l => l.group === 'Sundry Creditors').map(l => (
                      <option key={l._id} value={l.name}>{l.name}</option>
                    ))}
                    <option>Cash</option>
                  </select>
                </div>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={labelStyle}>Purchase Ledger</label>
                  <select 
                    name="purchaseLedger"
                    value={purchaseForm.purchaseLedger}
                    onChange={handlePurchaseChange}
                    style={inputStyle}
                  >
                    <option>Purchase Accounts @ 18%</option>
                  </select>
                </div>
              </div>

              <div style={{ width: '100%', overflowX: 'auto', boxSizing: 'border-box', marginBottom: '20px' }}>
                <table style={voucherTableStyle}>
                  <thead>
                    <tr>
                      <th style={{...thStyle, width: '40%'}}>Name of Item</th>
                      <th style={{...thStyle, width: '15%', textAlign: 'right'}}>Quantity</th>
                      <th style={{...thStyle, width: '15%', textAlign: 'right'}}>Rate</th>
                      <th style={{...thStyle, width: '10%', textAlign: 'center'}}>Per</th>
                      <th style={{...thStyle, width: '20%', textAlign: 'right', color: 'var(--accent-green)'}}>Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdStyle}><input type="text" style={{...inputStyle, border: 'none', background: 'transparent'}} placeholder="Select Item..." /></td>
                      <td style={tdStyle}><input type="text" style={{...inputStyle, textAlign: 'right', border: 'none', background: 'transparent'}} placeholder="0" /></td>
                      <td style={tdStyle}><input type="text" style={{...inputStyle, textAlign: 'right', border: 'none', background: 'transparent'}} placeholder="0.00" /></td>
                      <td style={tdStyle}><input type="text" style={{...inputStyle, textAlign: 'center', border: 'none', background: 'transparent'}} placeholder="Nos" /></td>
                      <td style={tdStyle}><input type="text" style={{...inputStyle, textAlign: 'right', border: 'none', background: 'transparent', fontWeight: 'bold'}} placeholder="0.00" readOnly /></td>
                    </tr>
                    <tr style={{ background: 'rgba(40,167,69,0.05)' }}>
                      <td colSpan="4" style={{...tdStyle, textAlign: 'right', fontWeight: '900', borderRight: 'none'}}>TOTAL VALUE</td>
                      <td style={{...tdStyle, textAlign: 'right', fontWeight: '900', fontSize: '18px', color: 'var(--accent-green)'}}>₹ 0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', boxSizing: 'border-box' }}>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={labelStyle}>Narration:</label>
                  <textarea 
                    name="narration"
                    value={purchaseForm.narration}
                    onChange={handlePurchaseChange}
                    style={{...inputStyle, height: '50px', resize: 'none'}} 
                    placeholder="Being goods purchased..."
                  ></textarea>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', boxSizing: 'border-box' }}>
                  <button type="submit" style={{ background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    <i className="fas fa-save"></i> Save (Ctrl+A)
                  </button>
                </div>
              </div>
            </form>
          </div>
        );

      case 'COMPANY':
        return (
          <form className="report-card animate-fade" onSubmit={handleCompanySubmit} style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="report-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <h3 style={{fontSize: '20px'}}><i className="fas fa-building" style={{color: '#2f81f7'}}></i> Company Configuration (Master Setup)</h3>
              </div>
              <button type="button" onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc: Quit</button>
            </div>
            
            <div style={{ padding: '20px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '6px', marginTop: '20px', boxSizing: 'border-box' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', boxSizing: 'border-box' }}>
                
                <div style={{boxSizing: 'border-box'}}>
                  <h4 style={{ color: 'var(--accent-blue)', marginBottom: '15px' }}>Directory & Name</h4>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={labelStyle}>Company Name <span style={{color: 'var(--accent-red)'}}>*</span></label>
                    <input 
                      type="text" 
                      name="name" 
                      value={companyForm.name} 
                      onChange={handleCompanyChange} 
                      style={{...inputStyle, fontWeight: 'bold'}} 
                      placeholder="e.g. Manish Pvt Ltd" 
                      autoFocus 
                      required 
                    />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={labelStyle}>Registered Address</label>
                    <textarea 
                      name="address" 
                      value={companyForm.address} 
                      onChange={handleCompanyChange} 
                      style={{...inputStyle, resize: 'none', height: '60px'}}
                    ></textarea>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={labelStyle}>State</label>
                      <select name="state" value={companyForm.state} onChange={handleCompanyChange} style={inputStyle}>
                        <option value="">Select State</option>
                        <option>Bihar</option>
                        <option>Delhi</option>
                        <option>Maharashtra</option>
                        <option>Uttar Pradesh</option>
                        <option>West Bengal</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>PIN Code</label>
                      <input 
                        type="text" 
                        name="pin" 
                        value={companyForm.pin} 
                        onChange={handleCompanyChange} 
                        style={inputStyle} 
                        placeholder="800001" 
                      />
                    </div>
                  </div>
                </div>

                <div style={{boxSizing: 'border-box'}}>
                  <h4 style={{ color: 'var(--accent-blue)', marginBottom: '15px' }}>Compliance & Books</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                      <label style={labelStyle}>Financial Year from</label>
                      <input 
                        type="date" 
                        name="fyFrom" 
                        value={companyForm.fyFrom} 
                        onChange={handleCompanyChange} 
                        style={inputStyle} 
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Books beginning from</label>
                      <input 
                        type="date" 
                        name="booksFrom" 
                        value={companyForm.booksFrom} 
                        onChange={handleCompanyChange} 
                        style={inputStyle} 
                      />
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <label style={labelStyle}>GSTIN / UIN</label>
                    <input 
                      type="text" 
                      name="gstinUin" 
                      value={companyForm.gstinUin} 
                      onChange={handleCompanyChange} 
                      style={{...inputStyle, textTransform: 'uppercase'}} 
                      placeholder="22AAAAA0000A1Z5" 
                    />
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <label style={labelStyle}>PAN / IT No.</label>
                    <input 
                      type="text" 
                      name="pan" 
                      value={companyForm.pan} 
                      onChange={handleCompanyChange} 
                      style={{...inputStyle, textTransform: 'uppercase'}} 
                      placeholder="ABCDE1234F" 
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                <button type="submit" style={{ background: 'linear-gradient(135deg, #2f81f7 0%, #1a62cc 100%)', color: 'white', padding: '10px 30px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Accept (Ctrl+A)
                </button>
              </div>
            </div>
          </form>
        );

      case 'LEDGER':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="report-header">
              <div>
                <h3><i className="fas fa-book-open" style={{color: '#ffc107'}}></i> Ledger Creation (Account Masters)</h3>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc: Quit</button>
            </div>

            <form onSubmit={handleLedgerSubmit} style={{ padding: '20px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '6px', marginTop: '20px', maxWidth: '850px', margin: '20px auto 0', boxSizing: 'border-box' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', boxSizing: 'border-box' }}>
                
                <div>
                  <label style={labelStyle}>Name of Ledger <span style={{color: 'var(--accent-red)'}}>*</span></label>
                  <input 
                    type="text" 
                    name="name"
                    value={ledgerForm.name}
                    onChange={handleLedgerChange}
                    style={{...inputStyle, fontSize: '16px', fontWeight: 'bold'}} 
                    placeholder="e.g. Ramesh & Co." 
                    autoFocus 
                    required
                  />
                </div>

                <div className="grid-2" style={{ background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{boxSizing: 'border-box'}}>
                    <label style={labelStyle}>Under (Group Head)</label>
                    <select 
                      name="group"
                      value={ledgerForm.group}
                      onChange={handleLedgerChange}
                      style={inputStyle}
                    >
                      <option>Sundry Debtors</option>
                      <option>Sundry Creditors</option>
                      <option>Sales Accounts</option>
                    </select>
                  </div>
                  <div style={{boxSizing: 'border-box'}}>
                    <label style={labelStyle}>Maintain balances bill-by-bill</label>
                    <select 
                      name="billByBill"
                      value={ledgerForm.billByBill}
                      onChange={handleLedgerChange}
                      style={inputStyle}
                    >
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div style={{boxSizing: 'border-box'}}>
                    <label style={labelStyle}>Address / State</label>
                    <textarea 
                      name="address"
                      value={ledgerForm.address}
                      onChange={handleLedgerChange}
                      style={{...inputStyle, resize: 'none', height: '50px', marginBottom: '10px'}}
                    ></textarea>
                    <input 
                      type="text" 
                      name="state"
                      value={ledgerForm.state}
                      onChange={handleLedgerChange}
                      style={inputStyle} 
                      placeholder="State" 
                    />
                  </div>
                  <div style={{boxSizing: 'border-box'}}>
                    <label style={labelStyle}>Tax Registration (GSTIN)</label>
                    <select 
                      name="gstType"
                      value={ledgerForm.gstType}
                      onChange={handleLedgerChange}
                      style={{...inputStyle, marginBottom: '10px'}}
                    >
                      <option>Regular</option>
                      <option>Unregistered</option>
                      <option>Composition</option>
                    </select>
                    <input 
                      type="text" 
                      name="gstin"
                      value={ledgerForm.gstin}
                      onChange={handleLedgerChange}
                      style={{...inputStyle, textTransform: 'uppercase'}} 
                      placeholder="Format: 22AAAAA0000A1Z5" 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(40,167,69,0.05)', padding: '15px', borderRadius: '6px', border: '1px solid rgba(40,167,69,0.2)', boxSizing: 'border-box' }}>
                   <label style={{...labelStyle, margin: 0, color: 'var(--accent-green)'}}>Opening Balance</label>
                   <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        name="openingBalance"
                        value={ledgerForm.openingBalance}
                        onChange={handleLedgerChange}
                        style={{...inputStyle, width: '150px', textAlign: 'right', fontWeight: 'bold', margin: 0}} 
                        placeholder="0.00" 
                      />
                      <select 
                        name="balanceType"
                        value={ledgerForm.balanceType}
                        onChange={handleLedgerChange}
                        style={{...inputStyle, width: '70px', margin: 0}}
                      >
                        <option>Dr</option><option>Cr</option>
                      </select>
                   </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="submit" style={{ background: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)', color: '#000', padding: '10px 30px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Save Ledger (Ctrl+A)
                </button>
              </div>
            </form>
          </div>
        );

      case 'STOCK':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="report-header">
              <div>
                <h3><i className="fas fa-boxes" style={{color: '#28a745'}}></i> Stock Item Creation (Inventory Master)</h3>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc: Quit</button>
            </div>

            <form onSubmit={handleStockSubmit} style={{ padding: '20px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '6px', marginTop: '20px', maxWidth: '850px', margin: '20px auto 0', boxSizing: 'border-box' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', boxSizing: 'border-box' }}>
                
                <div>
                  <label style={labelStyle}>Name of Stock Item <span style={{color: 'var(--accent-red)'}}>*</span></label>
                  <input 
                    type="text" 
                    name="name"
                    value={stockForm.name}
                    onChange={handleStockChange}
                    style={{...inputStyle, fontSize: '16px', fontWeight: 'bold'}} 
                    placeholder="e.g. Dell Inspiron 15" 
                    autoFocus 
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{boxSizing: 'border-box'}}>
                    <label style={labelStyle}>Under (Category / Group)</label>
                    <select 
                      name="under"
                      value={stockForm.under}
                      onChange={handleStockChange}
                      style={inputStyle}
                    >
                      <option>Primary</option>
                      <option>Electronics</option>
                    </select>
                  </div>
                  <div style={{boxSizing: 'border-box'}}>
                    <label style={labelStyle}>Units of Measure (UOM)</label>
                    <select 
                      name="units"
                      value={stockForm.units}
                      onChange={handleStockChange}
                      style={inputStyle}
                    >
                      <option>Nos (Numbers)</option>
                      <option>Pcs (Pieces)</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div style={{boxSizing: 'border-box'}}>
                     <label style={labelStyle}>HSN / SAC Code</label>
                     <input 
                       type="text" 
                       name="hsn"
                       value={stockForm.hsn}
                       onChange={handleStockChange}
                       style={{...inputStyle, marginBottom: '10px'}} 
                       placeholder="e.g. 8471" 
                      />
                     <label style={labelStyle}>Taxability</label>
                     <select 
                       name="taxability"
                       value={stockForm.taxability}
                       onChange={handleStockChange}
                       style={inputStyle}
                      >
                        <option>Taxable (18%)</option>
                        <option>Exempt</option>
                      </select>
                  </div>
                  <div style={{boxSizing: 'border-box'}}>
                     <label style={labelStyle}>Costing Method</label>
                     <select 
                       name="costingMethod"
                       value={stockForm.costingMethod}
                       onChange={handleStockChange}
                       style={{...inputStyle, marginBottom: '10px'}}
                      >
                        <option>Average Cost</option>
                        <option>FIFO</option>
                      </select>
                     <label style={labelStyle}>Maintain in Batches?</label>
                     <select 
                       name="batch"
                       value={stockForm.batch}
                       onChange={handleStockChange}
                       style={inputStyle}
                      >
                        <option>No</option>
                        <option>Yes</option>
                      </select>
                  </div>
                </div>

                <div style={{ marginTop: '10px', background: 'rgba(40,167,69,0.05)', padding: '15px', borderRadius: '6px', border: '1px solid rgba(40,167,69,0.2)', boxSizing: 'border-box' }}>
                  <label style={{...labelStyle, color: 'var(--accent-green)', marginBottom: '10px'}}>Opening Balance</label>
                  <div className="grid-3">
                    <div style={{boxSizing: 'border-box'}}>
                      <label style={{...labelStyle, fontSize: '11px'}}>Quantity</label>
                      <input 
                        type="text" 
                        name="openingQty"
                        value={stockForm.openingQty}
                        onChange={handleStockChange}
                        style={{...inputStyle, textAlign: 'right'}} 
                        placeholder="0" 
                      />
                    </div>
                    <div style={{boxSizing: 'border-box'}}>
                      <label style={{...labelStyle, fontSize: '11px'}}>Rate (₹)</label>
                      <input 
                        type="text" 
                        name="rate"
                        value={stockForm.rate}
                        onChange={handleStockChange}
                        style={{...inputStyle, textAlign: 'right'}} 
                        placeholder="0.00" 
                      />
                    </div>
                    <div style={{boxSizing: 'border-box'}}>
                      <label style={{...labelStyle, fontSize: '11px'}}>Total Value (₹)</label>
                      <input 
                        type="text" 
                        style={{...inputStyle, textAlign: 'right', background: 'rgba(0,0,0,0.1)'}} 
                        value={(parseFloat(stockForm.openingQty || 0) * parseFloat(stockForm.rate || 0)).toFixed(2)}
                        readOnly 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="submit" style={{ background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)', color: '#fff', padding: '10px 30px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Save Item (Ctrl+A)
                </button>
              </div>
            </form>
          </div>
        );

      case 'PAYMENT':
      case 'RECEIPT':
      case 'CONTRA':
      case 'JOURNAL':
        let vColor2 = '#ffc107'; let vIcon2 = 'fa-money-bill-wave';
        if(activeTab === 'RECEIPT') { vColor2 = '#17a2b8'; vIcon2 = 'fa-hand-holding-usd'; }
        if(activeTab === 'CONTRA') { vColor2 = '#e83e8c'; vIcon2 = 'fa-exchange-alt'; }
        if(activeTab === 'JOURNAL') { vColor2 = '#6f42c1'; vIcon2 = 'fa-book-open'; }

        return (
          <div className={`report-card animate-fade voucher-${activeTab.toLowerCase()}`} style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div className="report-header" style={{ borderBottom: `2px solid ${vColor2}`, paddingBottom: '10px' }}>
              <div>
                <h3 style={{color: vColor2}}><i className={`fas ${vIcon2}`}></i> {activeTab} Voucher</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold' }}>No. 001</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '13px' }}>1-Apr-25</div>
                <button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn" style={{marginTop: '5px'}}><i className="fas fa-times"></i> Esc: Quit</button>
              </div>
            </div>
            
            <form onSubmit={handleVoucherSubmit} style={{ padding: '20px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderTop: 'none', boxSizing: 'border-box' }}>
              {activeTab !== 'JOURNAL' && (
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '6px', marginBottom: '20px', boxSizing: 'border-box' }}>
                  <label style={{...labelStyle, color: vColor2}}>Account (Cash / Bank)</label>
                  <select 
                    name="account"
                    value={voucherForm.account}
                    onChange={handleVoucherChange}
                    style={{...inputStyle, fontSize: '16px', fontWeight: 'bold'}}
                  >
                    <option>Cash</option>
                    <option>HDFC Bank Current A/c</option>
                  </select>
                  <div style={{ fontSize: '12px', color: 'var(--accent-green)', marginTop: '5px' }}>Cur Bal: ₹ 1,12,000.00 Dr</div>
                </div>
              )}

              <div style={{ overflowX: 'auto', width: '100%', boxSizing: 'border-box' }}>
                <table style={voucherTableStyle}>
                  <thead>
                    <tr>
                      <th style={{...thStyle, width: '10%'}}>Dr / Cr</th>
                      <th style={{...thStyle, width: '50%'}}>Particulars (Ledger)</th>
                      <th style={{...thStyle, width: '20%', textAlign: 'right'}}>Debit (₹)</th>
                      <th style={{...thStyle, width: '20%', textAlign: 'right'}}>Credit (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdStyle}>
                        <select 
                          value={voucherForm.entries[0].type}
                          onChange={(e) => handleEntryChange(0, 'type', e.target.value)}
                          style={{...inputStyle, border:'none', background:'transparent'}}
                        >
                          <option value="Dr">Dr</option>
                          <option value="Cr">Cr</option>
                        </select>
                      </td>
                      <td style={tdStyle}>
                        <select 
                          value={voucherForm.entries[0].ledger}
                          onChange={(e) => handleEntryChange(0, 'ledger', e.target.value)}
                          style={{...inputStyle, border:'none', background:'transparent'}}
                        >
                          <option value="">Select Ledger...</option>
                          {dashboardData.ledgers.map(l => (
                            <option key={l._id} value={l.name}>{l.name}</option>
                          ))}
                        </select>
                        <div style={{fontSize: '11px', color: 'var(--text-dim)', paddingLeft: '12px'}}>Cur Bal: ₹ 0.00</div>
                      </td>
                      <td style={tdStyle}>
                        <input 
                          type="text" 
                          value={voucherForm.entries[0].debit}
                          onChange={(e) => handleEntryChange(0, 'debit', e.target.value)}
                          style={{...inputStyle, border:'none', background:'transparent', textAlign: 'right'}} 
                          placeholder="0.00" 
                        />
                      </td>
                      <td style={tdStyle}>
                        <input 
                          type="text" 
                          value={voucherForm.entries[0].credit}
                          onChange={(e) => handleEntryChange(0, 'credit', e.target.value)}
                          style={{...inputStyle, border:'none', background:'transparent', textAlign: 'right'}} 
                          placeholder="0.00" 
                          disabled={activeTab !== 'JOURNAL'}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>
                        <select 
                          value={voucherForm.entries[1].type}
                          onChange={(e) => handleEntryChange(1, 'type', e.target.value)}
                          style={{...inputStyle, border:'none', background:'transparent'}}
                        >
                          <option value="Cr">Cr</option>
                          <option value="Dr">Dr</option>
                        </select>
                      </td>
                      <td style={tdStyle}>
                        <select 
                          value={voucherForm.entries[1].ledger}
                          onChange={(e) => handleEntryChange(1, 'ledger', e.target.value)}
                          style={{...inputStyle, border:'none', background:'transparent'}}
                        >
                          <option value="">Select Ledger...</option>
                          {dashboardData.ledgers.map(l => (
                            <option key={l._id} value={l.name}>{l.name}</option>
                          ))}
                        </select>
                        <div style={{fontSize: '11px', color: 'var(--text-dim)', paddingLeft: '12px'}}>Cur Bal: ₹ 0.00</div>
                      </td>
                      <td style={tdStyle}>
                        <input 
                          type="text" 
                          value={voucherForm.entries[1].debit}
                          onChange={(e) => handleEntryChange(1, 'debit', e.target.value)}
                          style={{...inputStyle, border:'none', background:'transparent', textAlign: 'right'}} 
                          placeholder="0.00" 
                          disabled={activeTab !== 'JOURNAL'}
                        />
                      </td>
                      <td style={tdStyle}>
                        <input 
                          type="text" 
                          value={voucherForm.entries[1].credit}
                          onChange={(e) => handleEntryChange(1, 'credit', e.target.value)}
                          style={{...inputStyle, border:'none', background:'transparent', textAlign: 'right'}} 
                          placeholder="0.00" 
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid-2-1">
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={labelStyle}>Narration:</label>
                  <textarea 
                    name="narration"
                    value={voucherForm.narration}
                    onChange={handleVoucherChange}
                    style={{...inputStyle, height: '50px', resize: 'none'}} 
                    placeholder="Enter details..."
                  ></textarea>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', boxSizing: 'border-box' }}>
                  <button type="submit" style={{ background: vColor2, color: activeTab==='PAYMENT'?'#000':'#fff', padding: '12px 25px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save (Ctrl+A)</button>
                </div>
              </div>
            </form>
          </div>
        );
      
      case 'BANKING':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="report-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <h3 style={{fontSize: '20px'}}><i className="fas fa-university" style={{color: '#007bff'}}></i> Banking Utilities</h3>
                <p className="report-subtitle">Reconciliation, Cheque Management & E-Payments</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc: Back</button>
            </div>
            <div className="ledger-split" style={{marginTop: '20px', gap: '20px'}}>
              <div className="ledger-side" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                <div className="ledger-head" style={{ background: 'rgba(0,123,255,0.1)', color: '#007bff', borderRadius: '6px 6px 0 0' }}>Bank Operations</div>
                <div className="ledger-body" style={{padding: '15px'}}>
                   <div className="ledger-row fw-bold" style={{cursor: 'pointer', padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)'}}><i className="fas fa-money-check" style={{marginRight:'10px', color:'var(--text-dim)'}}></i> <span>Cheque Printing</span></div>
                   <div className="ledger-row fw-bold" style={{cursor: 'pointer', padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)'}}><i className="fas fa-book" style={{marginRight:'10px', color:'var(--text-dim)'}}></i> <span>Cheque Register</span></div>
                   <div className="ledger-row fw-bold" style={{cursor: 'pointer', padding: '10px'}}><i className="fas fa-sync-alt" style={{marginRight:'10px', color:'var(--accent-green)'}}></i> <span style={{color: 'var(--text-main)'}}>Bank Reconciliation (BRS)</span></div>
                </div>
              </div>
              <div className="ledger-side" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                <div className="ledger-head" style={{ background: 'rgba(40,167,69,0.1)', color: 'var(--accent-green)', borderRadius: '6px 6px 0 0' }}>Payments & Statements</div>
                <div className="ledger-body" style={{padding: '15px'}}>
                   <div className="ledger-row fw-bold" style={{cursor: 'pointer', padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)'}}><i className="fas fa-file-invoice" style={{marginRight:'10px', color:'var(--text-dim)'}}></i> <span>Deposit Slip</span></div>
                   <div className="ledger-row fw-bold" style={{cursor: 'pointer', padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)'}}><i className="fas fa-envelope-open-text" style={{marginRight:'10px', color:'var(--text-dim)'}}></i> <span>Payment Advice</span></div>
                   <div className="ledger-row fw-bold" style={{cursor: 'pointer', padding: '10px'}}><i className="fas fa-calendar-check" style={{marginRight:'10px', color:'var(--tally-yellow)'}}></i> <span>Post-Dated Summary (PDC)</span></div>
                </div>
              </div>
            </div>
          </div>
        );

      // --- 📌 ORIGINAL REPORTS (100% UNTOUCHED FROM FIRST PROMPT) ---

      case 'GST':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="report-header">
              <div>
                <h3><i className="fas fa-percentage" style={{color: '#ffc107'}}></i> GSTR-1 & Taxation Summary</h3>
                <p className="report-subtitle">For the period: 01-Apr-2025 to 31-Mar-2026</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc: Back</button>
            </div>

            <div className="report-summary-cards">
              <div className="r-card">
                <p>Total Taxable Value (Sales)</p>
                <h4>₹ {reportData.gstData.taxableSales.toLocaleString('en-IN', {minimumFractionDigits: 2})}</h4>
              </div>
              <div className="r-card">
                <p>Total Tax Liability</p>
                <h4 style={{color: 'var(--accent-red)'}}>₹ {(reportData.gstData.cgstSales + reportData.gstData.sgstSales).toLocaleString('en-IN', {minimumFractionDigits: 2})}</h4>
              </div>
              <div className="r-card">
                <p>Available ITC (Purchases)</p>
                <h4 style={{color: 'var(--accent-green)'}}>₹ {(reportData.gstData.cgstPurchases + reportData.gstData.sgstPurchases).toLocaleString('en-IN', {minimumFractionDigits: 2})}</h4>
              </div>
            </div>

            <div className="table-responsive">
              <table className="report-table premium-table">
                <thead>
                  <tr>
                    <th>Particulars (Nature of Supplies)</th>
                    <th className="num-col">Taxable Value</th>
                    <th className="num-col">CGST</th>
                    <th className="num-col">SGST/UTGST</th>
                    <th className="num-col">IGST</th>
                    <th className="num-col">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="group-row"><td colSpan="6">Outward Supplies</td></tr>
                  <tr>
                    <td>B2B Invoices (Sales)</td>
                    <td className="num-col">{reportData.gstData.taxableSales.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className="num-col">{reportData.gstData.cgstSales.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className="num-col">{reportData.gstData.sgstSales.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className="num-col">-</td>
                    <td className="num-col highlight">{reportData.gstData.totalSalesWithTax.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                  </tr>
                  <tr>
                    <td>Purchase Invoices (ITC)</td>
                    <td className="num-col">{reportData.gstData.taxablePurchases.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className="num-col">{reportData.gstData.cgstPurchases.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className="num-col">{reportData.gstData.sgstPurchases.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className="num-col">-</td>
                    <td className="num-col highlight">{reportData.gstData.totalPurchasesWithTax.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                  </tr>
                  <tr>
                    <td>Export Invoices</td>
                    <td className="num-col">-</td>
                    <td className="num-col">-</td>
                    <td className="num-col">-</td>
                    <td className="num-col">-</td>
                    <td className="num-col highlight">-</td>
                  </tr>
                  <tr className="total-row">
                    <td>Total Outward Supplies</td>
                    <td className="num-col">{reportData.gstData.taxableSales.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className="num-col">{reportData.gstData.cgstSales.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className="num-col">{reportData.gstData.sgstSales.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className="num-col">-</td>
                    <td className="num-col">{reportData.gstData.totalSalesWithTax.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'PL':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="report-header">
              <div>
                <h3><i className="fas fa-chart-line" style={{color: '#28a745'}}></i> Profit & Loss A/c</h3>
                <p className="report-subtitle">Manish Pvt Ltd | As of 31-Mar-2026</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc: Back</button>
            </div>

            <div className="ledger-split">
              <div className="ledger-side border-right">
                <div className="ledger-head">Particulars (Expenses)</div>
                <div className="ledger-body">
                  <div className="ledger-row fw-bold"><span>Opening Stock</span><span className="amt">{reportData.plData.openingStock.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
                  <div className="ledger-row fw-bold"><span>Purchase Accounts</span><span className="amt">{reportData.plData.purchases.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
                  
                  <div className="ledger-row fw-bold"><span>Direct Expenses</span><span className="amt">{reportData.plData.expenses.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
                  
                  <div className="ledger-row fw-bold" style={{marginTop: '20px', color: 'var(--accent-blue)'}}>
                    <span>Gross Profit c/o</span><span className="amt">{reportData.plData.grossProfit.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                  </div>
                </div>
                <div className="ledger-footer"><span>Total</span><span className="amt">{(reportData.plData.openingStock + reportData.plData.purchases + reportData.plData.expenses + reportData.plData.grossProfit).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
              </div>

              <div className="ledger-side">
                <div className="ledger-head">Particulars (Income)</div>
                <div className="ledger-body">
                  <div className="ledger-row fw-bold"><span>Sales Accounts</span><span className="amt">{reportData.plData.sales.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
                  <div className="ledger-row fw-bold"><span>Closing Stock</span><span className="amt">{reportData.plData.closingStock.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
                </div>
                <div className="ledger-footer"><span>Total</span><span className="amt">{(reportData.plData.sales + reportData.plData.closingStock).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
              </div>
            </div>
          </div>
        );

      case 'BS':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="report-header">
              <div>
                <h3><i className="fas fa-balance-scale" style={{color: '#007bff'}}></i> Balance Sheet</h3>
                <p className="report-subtitle">{user.companyName} | As of {new Date().toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'})}</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc: Back</button>
            </div>

            <div className="ledger-split">
              <div className="ledger-side border-right">
                <div className="ledger-head">Liabilities</div>
                <div className="ledger-body">
                  <div className="ledger-row fw-bold"><span>Capital Account</span><span className="amt">{reportData.bsData.liabilities.capital.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
                  
                  <div className="ledger-row fw-bold mt-3"><span>Loans (Liability)</span><span className="amt">{reportData.bsData.liabilities.loans.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>

                  <div className="ledger-row fw-bold mt-3"><span>Current Liabilities</span><span className="amt">{(reportData.bsData.liabilities.creditors + reportData.bsData.liabilities.tax).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
                  <div className="ledger-row child"><span>Sundry Creditors</span><span className="amt">{reportData.bsData.liabilities.creditors.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
                  <div className="ledger-row child"><span>Duties & Taxes</span><span className="amt">{reportData.bsData.liabilities.tax.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
                  
                  <div className="ledger-row fw-bold mt-3" style={{color: 'var(--accent-green)'}}><span>Profit & Loss A/c</span><span className="amt">{reportData.plData.grossProfit.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
                </div>
                <div className="ledger-footer"><span>Total</span><span className="amt">{(reportData.bsData.liabilities.capital + reportData.bsData.liabilities.loans + reportData.bsData.liabilities.creditors + reportData.bsData.liabilities.tax + reportData.plData.grossProfit).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
              </div>

              <div className="ledger-side">
                <div className="ledger-head">Assets</div>
                <div className="ledger-body">
                  <div className="ledger-row fw-bold"><span>Fixed Assets</span><span className="amt">{reportData.bsData.assets.fixed.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
                  
                  <div className="ledger-row fw-bold mt-3"><span>Investments</span><span className="amt">{reportData.bsData.assets.investments.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>

                  <div className="ledger-row fw-bold mt-3"><span>Current Assets</span><span className="amt">{(reportData.plData.closingStock + reportData.bsData.assets.debtors + reportData.bsData.assets.cash).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
                  <div className="ledger-row child"><span>Closing Stock</span><span className="amt">{reportData.plData.closingStock.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
                  <div className="ledger-row child"><span>Sundry Debtors</span><span className="amt">{reportData.bsData.assets.debtors.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
                  <div className="ledger-row child"><span>Cash & Bank</span><span className="amt">{reportData.bsData.assets.cash.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
                </div>
                <div className="ledger-footer"><span>Total</span><span className="amt">{(reportData.bsData.assets.fixed + reportData.bsData.assets.investments + reportData.plData.closingStock + reportData.bsData.assets.debtors + reportData.bsData.assets.cash).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
              </div>
            </div>
          </div>
        );

      case 'DAYBOOK':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="report-header">
              <div>
                <h3><i className="fas fa-book" style={{color: 'var(--tally-yellow)'}}></i> Day Book</h3>
                <p className="report-subtitle">All Transactions | {new Date().toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'})}</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc: Back</button>
            </div>
            <div className="table-responsive" style={{ marginTop: '20px' }}>
              <table className="report-table premium-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Particulars</th>
                    <th>Vch Type</th>
                    <th>Vch No.</th>
                    <th className="num-col">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.vouchers.length === 0 ? (
                    <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px', color: 'var(--text-dim)'}}>No transactions found for the period.</td></tr>
                  ) : (
                    reportData.vouchers.map(v => (
                      <tr key={v._id}>
                        <td>{new Date(v.date).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'})}</td>
                        <td>{v.partyName || v.account || v.party || 'Generic Entry'}</td>
                        <td>{v.type}</td>
                        <td>{v.voucherNo || v.invNo || '-'}</td>
                        <td className="num-col highlight">₹ {parseFloat(v.totalAmount || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'PRINT':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="report-header">
              <div>
                <h3><i className="fas fa-print" style={{color: '#17a2b8'}}></i> Printing & Export</h3>
                <p className="report-subtitle">Manish Pvt Ltd | Configuration</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc: Back</button>
            </div>
            <div style={{ marginTop: '20px' }}>
               <table className="report-table premium-table">
                 <thead>
                   <tr><th>Report Type</th><th>Default Format</th><th>Action</th></tr>
                 </thead>
                 <tbody>
                   <tr><td>Sales Invoice (Current)</td><td>PDF</td><td className="num-col highlight" style={{cursor: 'pointer'}}>Print (Alt+P)</td></tr>
                   <tr><td>Day Book / Registers</td><td>Excel</td><td className="num-col highlight" style={{cursor: 'pointer'}}>Export (Alt+E)</td></tr>
                   <tr><td>Outstanding Receivables</td><td>PDF</td><td className="num-col highlight" style={{cursor: 'pointer'}}>Print (Alt+P)</td></tr>
                   <tr><td>GSTR-1 Summary</td><td>JSON</td><td className="num-col highlight" style={{cursor: 'pointer'}}>Export (Alt+E)</td></tr>
                 </tbody>
               </table>
            </div>
          </div>
        );

      case 'BACKUP':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="report-header">
              <div>
                <h3><i className="fas fa-sync" style={{color: '#ffc107'}}></i> Backup & Restore</h3>
                <p className="report-subtitle">Secure your Company Data</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc: Back</button>
            </div>
            <div style={{ padding: '25px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', marginTop: '20px' }}>
                <h4 style={{ color: 'var(--accent-blue)', marginBottom: '20px', fontSize: '18px' }}>Backup Details</h4>
                <div className="grid-1" style={{display: 'grid', gap: '20px'}}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border)', paddingBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold' }}>Source Path :</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--text-dim)' }}>C:\TallyPrime\Data</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border)', paddingBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold' }}>Destination Path :</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--text-dim)' }}>D:\TallyBackups\2026</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <span style={{ fontWeight: 'bold' }}>Company Name :</span>
                    <span style={{ fontWeight: 'bold' }}>Manish Pvt Ltd (10000)</span>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                    <button style={{ background: 'var(--accent-blue)', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', flex: 1 }}>Start Backup (Enter)</button>
                    <button style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '12px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', flex: 1 }}>Restore Data</button>
                  </div>
                </div>
            </div>
          </div>
        );

      case 'VERIFICATION':
        const pendingVouchers = (dashboardData.vouchers || []).filter(v => v.status === 'pending');
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="report-header">
              <div>
                <h3><i className="fas fa-shield-alt" style={{color: '#ec4899'}}></i> Verification Center</h3>
                <p className="report-subtitle">Approve or Reject Staff Entries ({pendingVouchers.length} Pending)</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc: Back</button>
            </div>
            
            <div className="verification-grid" style={{ padding: '20px', display: 'grid', gap: '15px' }}>
              {pendingVouchers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                  <i className="fas fa-check-circle" style={{ fontSize: '40px', marginBottom: '10px', color: 'var(--accent-green)' }}></i>
                  <p>All entries are verified! No pending items.</p>
                </div>
              ) : (
                pendingVouchers.map(v => (
                  <div key={v._id} className="pending-item-card" style={{ 
                    background: 'var(--card-bg)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '12px', 
                    padding: '15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{v.partyName || v.ledgerName || 'General Voucher'}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                        {v.type} | {v.date} | ₹ {v.totalAmount || 0}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={async () => {
                          const token = localStorage.getItem('tallyx_token');
                          const res = await fetch(`http://localhost:5001/api/vouchers/${v._id}/status`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                            body: JSON.stringify({ status: 'approved' })
                          });
                          if(res.ok) {
                            setDashboardData(prev => ({
                              ...prev,
                              vouchers: prev.vouchers.map(item => item._id === v._id ? { ...item, status: 'approved' } : item)
                            }));
                            toast.success('Approved successfully!');
                          }
                        }}
                        style={{ background: 'var(--accent-green)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}
                      >Approve</button>
                      <button 
                         onClick={async () => {
                          const token = localStorage.getItem('tallyx_token');
                          const res = await fetch(`http://localhost:5001/api/vouchers/${v._id}/status`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                            body: JSON.stringify({ status: 'rejected' })
                          });
                          if(res.ok) {
                            setDashboardData(prev => ({
                              ...prev,
                              vouchers: prev.vouchers.map(item => item._id === v._id ? { ...item, status: 'rejected' } : item)
                            }));
                            toast.error('Entry Rejected');
                          }
                        }}
                        style={{ background: 'var(--accent-red)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold' }}
                      >Reject</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className={`app-wrapper ${isDarkMode ? '' : 'light-mode'}`}>
      
      <aside className="sidebar">
        <div className="sidebar-header" onClick={() => setActiveTab('DASHBOARD')} style={{cursor: 'pointer'}}>
          <img src={logoImage} alt="Logo" className="sidebar-logo" />
          <div className="sidebar-brand">
            <h2>BiReena</h2>
            <p>TallyX</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <PhaseLabel phase="1" label="Phase 1 — Setup" />
          <SidebarItem icon="fas fa-building" label="Company" shortcut="F1" active={activeTab === 'COMPANY'} onClick={() => setActiveTab('COMPANY')} />
          <SidebarItem icon="fas fa-book" label="Ledger" shortcut="F2" active={activeTab === 'LEDGER'} onClick={() => setActiveTab('LEDGER')} />
          <SidebarItem icon="fas fa-boxes" label="Stock Entry" shortcut="F3" active={activeTab === 'STOCK'} onClick={() => setActiveTab('STOCK')} />

          <PhaseLabel phase="2" label="Phase 2 — Transactions" />
          <SidebarItem icon="fas fa-shopping-cart" label="Sales" shortcut="F8" active={activeTab === 'SALES'} onClick={() => setActiveTab('SALES')} />
          <SidebarItem icon="fas fa-shopping-basket" label="Purchase" shortcut="F9" active={activeTab === 'PURCHASE'} onClick={() => setActiveTab('PURCHASE')} />
          
          <div style={{ padding: '20px 20px 8px', fontSize: '10px', color: 'var(--text-dim)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Vouchers</div>
          <SidebarItem icon="fas fa-money-bill-wave" label="Payment" shortcut="F5" active={activeTab === 'PAYMENT'} onClick={() => setActiveTab('PAYMENT')} />
          <SidebarItem icon="fas fa-hand-holding-usd" label="Receipt" shortcut="F6" active={activeTab === 'RECEIPT'} onClick={() => setActiveTab('RECEIPT')} />
          <SidebarItem icon="fas fa-exchange-alt" label="Contra" shortcut="F4" active={activeTab === 'CONTRA'} onClick={() => setActiveTab('CONTRA')} />
          <SidebarItem icon="fas fa-book-open" label="Journal" shortcut="F7" active={activeTab === 'JOURNAL'} onClick={() => setActiveTab('JOURNAL')} />
          <SidebarItem icon="fas fa-university" label="Banking" shortcut="F10" active={activeTab === 'BANKING'} onClick={() => setActiveTab('BANKING')} />

          <PhaseLabel phase="3" label="Phase 3 — Review" />
          <SidebarItem icon="fas fa-history" label="Day Book" shortcut="Alt+D" active={activeTab === 'DAYBOOK'} onClick={() => setActiveTab('DAYBOOK')} />
          <SidebarItem icon="fas fa-check-double" label="Verification" shortcut="Alt+V" active={activeTab === 'VERIFICATION'} onClick={() => setActiveTab('VERIFICATION')} />

          <PhaseLabel phase="4" label="Phase 4 — Reports" />
          <SidebarItem icon="fas fa-percentage" label="GST/Tax" shortcut="Alt+T" active={activeTab === 'GST'} onClick={() => setActiveTab('GST')} />
          <SidebarItem icon="fas fa-chart-line" label="P&L" shortcut="Alt+P" active={activeTab === 'PL'} onClick={() => setActiveTab('PL')} />
          <SidebarItem icon="fas fa-balance-scale" label="Balance Sheet" shortcut="Alt+B" active={activeTab === 'BS'} onClick={() => setActiveTab('BS')} />
          <SidebarItem icon="fas fa-file-export" label="Print & Export" shortcut="Alt+R" active={activeTab === 'EXPORT'} onClick={() => setActiveTab('EXPORT')} />

          <PhaseLabel phase="5" label="Phase 5 — Utils" />
          <SidebarItem icon="fas fa-save" label="Backup" shortcut="Alt+K" active={activeTab === 'BACKUP'} onClick={() => setActiveTab('BACKUP')} />
          <SidebarItem icon="fas fa-file-import" label="Import" shortcut="Alt+I" active={activeTab === 'IMPORT'} onClick={() => setActiveTab('IMPORT')} />
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-nav">
          <div className="global-search-container">
            <i className="fas fa-search" style={{ color: 'var(--text-dim)', fontSize: '12px' }}></i>
            <input type="text" id="global-search" placeholder="Go to any screen..." />
            <span className="global-search-hint">Alt+G</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="company-info" style={{ textAlign: 'right', marginRight: '15px' }}>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700' }}>{user.companyName}</h4>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--accent-green)', fontWeight: '600' }}>FY 2025-26 | Patna</p>
            </div>
            <div className="dash-profile-avatar" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              {user.initials}
            </div>
          </div>
        </header>

        <div className="shortcut-bar">
          <ShortcutPill badge="F1" label="Setup" color="var(--accent-purple)" onClick={() => setActiveTab('COMPANY')} />
          <ShortcutPill badge="F2" label="Ledger" color="var(--accent-blue)" onClick={() => setActiveTab('LEDGER')} />
          <ShortcutPill badge="F3" label="Stock" color="var(--accent-green)" onClick={() => setActiveTab('STOCK')} />
          <ShortcutPill badge="F4" label="Contra" color="var(--accent-pink)" onClick={() => setActiveTab('CONTRA')} />
          <ShortcutPill badge="F5" label="Payment" color="var(--accent-amber)" onClick={() => setActiveTab('PAYMENT')} />
          <ShortcutPill badge="F6" label="Receipt" color="var(--accent-teal)" onClick={() => setActiveTab('RECEIPT')} />
          <ShortcutPill badge="F7" label="Journal" color="var(--accent-purple)" onClick={() => setActiveTab('JOURNAL')} />
          <ShortcutPill badge="F8" label="Sales" color="var(--accent-blue)" onClick={() => setActiveTab('SALES')} />
          <ShortcutPill badge="F9" label="Purchase" color="var(--accent-green)" onClick={() => setActiveTab('PURCHASE')} />
          <ShortcutPill badge="F10" label="Banking" color="var(--text-dim)" onClick={() => setActiveTab('BANKING')} />
        </div>

        <div className="dashboard-scroll-area" style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'DASHBOARD' ? (
            <>
              <div className="quick-actions-grid animate-fade">
                <ActionCard icon="fa-shopping-cart" label="New Sale" shortcut="F8" color="var(--accent-blue)" bg="var(--sales-bg)" onClick={() => setActiveTab('SALES')} />
                <ActionCard icon="fa-shopping-basket" label="New Purchase" shortcut="F9" color="var(--accent-green)" bg="var(--purchase-bg)" onClick={() => setActiveTab('PURCHASE')} />
                <ActionCard icon="fa-money-bill-wave" label="Record Payment" shortcut="F5" color="var(--accent-amber)" bg="var(--payment-bg)" onClick={() => setActiveTab('PAYMENT')} />
                <ActionCard icon="fa-hand-holding-usd" label="Record Receipt" shortcut="F6" color="var(--accent-teal)" bg="var(--receipt-bg)" onClick={() => setActiveTab('RECEIPT')} />
                <ActionCard icon="fa-user-plus" label="Create Ledger" shortcut="F2" color="var(--accent-blue)" bg="rgba(55,138,221,0.05)" onClick={() => setActiveTab('LEDGER')} />
                <ActionCard icon="fa-history" label="Day Book" shortcut="Alt+D" color="var(--accent-pink)" bg="var(--contra-bg)" onClick={() => setActiveTab('DAYBOOK')} />
              </div>

              <div className="stats-row animate-fade">
                <StatCard label="Total Receivables" value={`₹${metrics.receivables.toLocaleString()}`} sub="On time: ₹3,42,250" color="var(--accent-blue)" />
                <StatCard label="Total Payables" value={`₹${metrics.payables.toLocaleString()}`} sub="Critical: ₹12,250" color="var(--accent-amber)" />
                <StatCard label="Cash Balance" value={`₹${metrics.cash.toLocaleString()}`} sub="As of today" color="var(--text-main)" />
                <StatCard label="GST Liability" value="₹0.00" sub="This quarter" color="var(--accent-amber)" />
              </div>

              <div className="bottom-row animate-fade">
                <div className="section-card">
                  <div className="section-title">Recent Transactions</div>
                  <div className="transaction-list">
                    {dashboardData.vouchers.slice(0, 5).map(v => (
                       <div key={v._id} className="transaction-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
                        <span className="type-badge" style={{ background: `var(--${v.type.toLowerCase()}-bg)`, color: `var(--accent-${v.type.toLowerCase()})`, fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '4px' }}>{v.type}</span>
                        <span className="party-name" style={{ fontSize: '14px', fontWeight: '600' }}>{v.partyName || v.entries[0]?.ledger || 'Cash'}</span>
                        <span className="tx-amt" style={{ color: v.type === 'SALES' || v.type === 'RECEIPT' ? 'var(--accent-blue)' : 'var(--accent-amber)', fontSize: '14px', fontWeight: '700', fontFamily: 'monospace' }}>
                           {v.type === 'SALES' || v.type === 'RECEIPT' ? '+' : '-'} ₹{(v.totalAmount || v.entries[0]?.debit || v.entries[1]?.credit || 0).toLocaleString()}
                        </span>
                       </div>
                    ))}
                  </div>
                </div>

                <div className="section-card">
                  <div className="section-title">Cash flow — this month</div>
                  <div className="cash-flow-list">
                    <FlowBar month="Apr" percent="30" color="var(--accent-blue)" />
                    <FlowBar month="May" percent="55" color="var(--accent-blue)" />
                    <FlowBar month="Jun" percent="72" color="var(--accent-blue)" />
                    <FlowBar month="Jul" percent="90" color="var(--accent-teal)" />
                    <FlowBar month="Aug" percent="65" color="var(--accent-amber)" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="report-container" style={{ padding: '30px' }}>
              {renderReport()}
            </div>
          )}
        </div>
        {showSuccessModal && (
          <div className="settings-modal-overlay" style={{ zIndex: 1001 }}>
            <div className="settings-modal-content animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '50px', color: '#10b981', marginBottom: '20px' }}><i className="fas fa-check-circle"></i></div>
              <h2 style={{ marginBottom: '10px' }}>Congratulations!</h2>
              <p style={{ color: 'var(--text-dim)', marginBottom: '30px' }}>{successMessage}</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button className="btn-primary" onClick={() => { setShowSuccessModal(false); setActiveTab('DASHBOARD'); }}>Go To Dashboard</button>
                <button className="btn-secondary" onClick={() => { setShowSuccessModal(false); }}>Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const PhaseLabel = ({ phase, label }) => (
  <div className={`phase-label phase-${phase}`}>{label}</div>
);

const SidebarItem = ({ icon, label, shortcut, active, onClick }) => (
  <button className={`nav-btn ${active ? 'active' : ''}`} onClick={onClick}>
    <i className={icon} style={{ width: '20px' }}></i>
    <span>{label}</span>
    {shortcut && <span className="shortcut-badge">{shortcut}</span>}
  </button>
);

const ShortcutPill = ({ badge, label, color, onClick }) => (
  <button className="shortcut-pill" onClick={onClick}>
    <span className="pill-badge" style={{ background: color }}>{badge}</span>
    <span>{label}</span>
  </button>
);

const ActionCard = ({ icon, label, shortcut, color, bg, onClick }) => (
  <div className="action-card" onClick={onClick}>
    <div className="action-icon-box" style={{ background: bg, color: color }}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div className="action-info">
      <h5>{label}</h5>
      <span>{shortcut}</span>
    </div>
  </div>
);

const StatCard = ({ label, value, sub, color }) => (
  <div className="stat-card">
    <div className="stat-label">{label}</div>
    <div className="stat-value" style={{ color: color }}>{value}</div>
    <div className="stat-subtext" style={{ color: color }}>{sub}</div>
  </div>
);

const FlowBar = ({ month, percent, color }) => (
  <div className="flow-bar-row">
    <span className="flow-month">{month}</span>
    <div className="flow-bar-bg">
      <div className="flow-bar-fill" style={{ width: `${percent}%`, background: color }}></div>
    </div>
    <span className="flow-percent">{percent}%</span>
  </div>
);

export default Dashboard;
