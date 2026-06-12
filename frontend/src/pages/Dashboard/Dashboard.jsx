import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';
import logoImage from '../../assets/logo.jpeg';
import { API_BASE_URL } from '../../config';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [openMenus, setOpenMenus] = useState({ coreTransactions: true, accountsInfo: false, inventoryInfo: false });
  const [activeTab, setActiveTab] = useState('GATEWAY');
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [dashboardData, setDashboardData] = useState({ ledgers: [], stocks: [], vouchers: [] });
  const [metrics, setMetrics] = useState({ receivables: 0, payables: 0, cash: 0, cashIn: 0, cashOut: 0 });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [settingsModalTitle, setSettingsModalTitle] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const storedCompany = localStorage.getItem('tallyx_company_name');
  const [user, setUser] = useState({ name: 'Admin User', email: 'admin@bireena.com', initials: 'AD', companyName: storedCompany || '' });
  
  // Refs for auto-focusing primary inputs
  const companyNameRef = useRef(null);
  const ledgerNameRef = useRef(null);
  const stockNameRef = useRef(null);

  // Auto-focus logic when activeTab changes
  useEffect(() => {
    if (activeTab === 'COMPANY') { setTimeout(() => companyNameRef.current?.focus(), 100); }
    else if (activeTab === 'LEDGER') { setTimeout(() => ledgerNameRef.current?.focus(), 100); }
    else if (activeTab === 'STOCK') { setTimeout(() => stockNameRef.current?.focus(), 100); }
  }, [activeTab]);

  // Company Form State
  const [companyForm, setCompanyForm] = useState({
    name: '',
    mailingName: '',
    address: '',
    state: 'Bihar',
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

  const [voucherForm, setVoucherForm] = useState({
    type: 'PAYMENT',
    date: new Date().toISOString().split('T')[0],
    voucherNo: '',
    ledgerName: '',
    amount: '',
    narration: '',
    entries: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('tallyx_token');
        const headers = { Authorization: `Bearer ${token}` };
        const [lRes, sRes, vRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/ledgers`, { headers }),
          fetch(`${API_BASE_URL}/api/stocks`, { headers }),
          fetch(`${API_BASE_URL}/api/vouchers`, { headers })
        ]);
        const ledgers = await lRes.json();
        const stocks = await sRes.json();
        const vouchers = await vRes.json();
        setDashboardData({ ledgers: ledgers || [], stocks: stocks || [], vouchers: vouchers || [] });

        let rec = 0, pay = 0, cashIn = 0, cashOut = 0, cash = 0;
        if (vouchers && vouchers.length > 0) {
          vouchers.forEach(v => {
            if (v.type === 'SALES') rec += v.totalAmount || 0;
            if (v.type === 'PURCHASE') pay += v.totalAmount || 0;
            if (v.type === 'RECEIPT') cashIn += v.totalAmount || 0;
            if (v.type === 'PAYMENT') cashOut += v.totalAmount || 0;
          });
          cash = cashIn - cashOut;
        }
        setMetrics({ receivables: rec, payables: pay, cash: cash, cashIn: cashIn, cashOut: cashOut });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);


  // Keyboard Shortcut Handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;

      // 🚀 Ctrl+A: Accept/Save across all screens
      if (e.ctrlKey && key.toLowerCase() === 'a') {
        e.preventDefault();
        if (activeTab === 'COMPANY') { handleCompanySubmit(e); }
        else if (activeTab === 'LEDGER') { /* handleLedgerSubmit(e) - to be implemented */ }
        else if (activeTab === 'STOCK') { /* handleStockSubmit(e) - to be implemented */ }
        else if (['PAYMENT', 'RECEIPT', 'CONTRA', 'JOURNAL'].includes(activeTab)) { handleVoucherSubmit(e); }
        return;
      }

      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      
      if (key === 'Escape') { setActiveTab('DASHBOARD'); return; }
      // Import/Export sub-shortcuts (1-6) when on IMPORT page
      if (activeTab === 'IMPORT' && !e.altKey && !e.ctrlKey) {
        if (key === '1') { document.getElementById('import-masters-xml')?.click(); return; }
        if (key === '2') { document.getElementById('import-vouchers-xml')?.click(); return; }
        if (key === '3') { document.getElementById('import-bank-csv')?.click(); return; }
        if (key === '4') { document.querySelectorAll('.ie-action-card')[3]?.click(); return; }
        if (key === '5') { document.querySelectorAll('.ie-action-card')[4]?.click(); return; }
        if (key === '6') { document.querySelectorAll('.ie-action-card')[5]?.click(); return; }
      }
      // Backup/Restore sub-shortcuts when on BACKUP page
      if (activeTab === 'BACKUP' && !e.altKey && !e.ctrlKey) {
        if (key === 'Enter') { document.getElementById('backup-start-btn')?.click(); return; }
        if (key.toLowerCase() === 'r') { document.getElementById('restore-file-picker')?.click(); return; }
      }
      if (key === 'F1') { e.preventDefault(); setActiveTab('COMPANY'); }
      else if (key === 'F2') { e.preventDefault(); setActiveTab('LEDGER'); }
      else if (key === 'F3') { e.preventDefault(); setActiveTab('STOCK'); }
      else if (key === 'F4') { e.preventDefault(); setActiveTab('CONTRA'); }
      else if (key === 'F5') { e.preventDefault(); setActiveTab('PAYMENT'); }
      else if (key === 'F6') { e.preventDefault(); setActiveTab('RECEIPT'); }
      else if (key === 'F7') { e.preventDefault(); setActiveTab('VOUCHER'); }
      else if (key === 'F8') { e.preventDefault(); setActiveTab('SALES'); }
      else if (key === 'F9') { e.preventDefault(); setActiveTab('PURCHASE'); }
      else if (key === 'F10') { e.preventDefault(); setActiveTab('BANKING'); }
      else if (e.altKey && key.toLowerCase() === 'g') { e.preventDefault(); setActiveTab('GST'); }
      else if (e.altKey && key.toLowerCase() === 'p') { e.preventDefault(); setActiveTab('PL'); }
      else if (e.altKey && key.toLowerCase() === 'b') { e.preventDefault(); setActiveTab('BS'); }
      else if (e.altKey && key.toLowerCase() === 'r') { e.preventDefault(); setActiveTab('PRINT'); }
      else if (e.altKey && key.toLowerCase() === 'k') { e.preventDefault(); setActiveTab('BACKUP'); }
      else if (e.altKey && key.toLowerCase() === 'i') { e.preventDefault(); setActiveTab('IMPORT'); }
      else if (e.altKey && key.toLowerCase() === 'u') { e.preventDefault(); setActiveTab('PROFILE'); }
      else if (e.altKey && key.toLowerCase() === 'l') { e.preventDefault(); handleLogout(); }
      else if (e.altKey && key.toLowerCase() === 'c') { 
        e.preventDefault(); 
        setOpenMenus(prev => ({ ...prev, accountsInfo: true })); 
        setActiveTab('LEDGER'); 
      }

      // Contextual Ledger Shortcuts (when Ledger menu is open)
      if (openMenus.accountsInfo && !e.ctrlKey && !e.altKey) {
        if (key.toLowerCase() === 'c') { setActiveTab('LEDGER'); return; }
        if (key.toLowerCase() === 'd') { setActiveTab('LEDGER_DISPLAY'); return; }
        if (key.toLowerCase() === 'a') { setActiveTab('LEDGER_ALTER'); return; }
        if (key.toLowerCase() === 'r') { setActiveTab('MULTI_LEDGER_CREATE'); return; }
        if (key.toLowerCase() === 'i') { setActiveTab('MULTI_LEDGER_DISPLAY'); return; }
        if (key.toLowerCase() === 'l') { setActiveTab('MULTI_LEDGER_ALTER'); return; }
        if (key.toLowerCase() === 'q') { setOpenMenus(prev => ({ ...prev, accountsInfo: false })); return; }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, companyForm, voucherForm, openMenus]); // Added openMenus to dependencies

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('tallyx_token');
      const response = await fetch(`${API_BASE_URL}/api/companies`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success && data.data) {
        setAvailableCompanies(data.data);
      } else if (Array.isArray(data)) {
        setAvailableCompanies(data);
      }
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };


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
    border: '1px solid #000000',
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
    try {
      const token = localStorage.getItem('tallyx_token');
      const response = await fetch(`${API_BASE_URL}/api/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(companyForm)
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMessage(`Company "${data.data.name}" created successfully!`);
        setShowSuccessModal(true);
        // Update current user context with new company
        localStorage.setItem('tallyx_company_name', data.data.name);
        setUser(prev => ({ ...prev, companyName: data.data.name, initials: data.data.name.substring(0, 2).toUpperCase() }));
      } else {
        alert(data.message || 'Error creating company');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Connection error. Is the backend running?');
    }
  };

  const handleVoucherChange = (e) => {
    const { name, value } = e.target;
    setVoucherForm(prev => ({ ...prev, [name]: value }));
  };

  const handleVoucherSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('tallyx_token');
      const response = await fetch(`${API_BASE_URL}/api/vouchers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...voucherForm, companyName: user.companyName })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(`Voucher created successfully for ${user.companyName}!`);
        setShowSuccessModal(true);
        // Clear form after success
        setVoucherForm({
          type: 'PAYMENT',
          date: new Date().toISOString().split('T')[0],
          voucherNo: '',
          ledgerName: '',
          amount: '',
          narration: '',
          entries: []
        });
      } else {
        alert(data.message || 'Error creating voucher');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error connecting to backend');
    }

  };

  const [stockForm, setStockForm] = useState({
    name: '',
    group: 'Primary',
    uom: 'Nos',
    hsn: '',
    taxability: 'Taxable (18%)',
    costingMethod: 'Average Cost',
    maintainBatches: 'No',
    openingQty: '0',
    openingRate: '0.00',
    openingValue: '0.00'
  });

  const handleStockChange = (e) => {
    const { name, value } = e.target;
    setStockForm(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'openingQty' || name === 'openingRate') {
        const qty = parseFloat(updated.openingQty) || 0;
        const rate = parseFloat(updated.openingRate) || 0;
        updated.openingValue = (qty * rate).toFixed(2);
      }
      return updated;
    });
  };

  const handleStockSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      const token = localStorage.getItem('tallyx_token');
      const response = await fetch(`${API_BASE_URL}/api/stocks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: stockForm.name,
          group: stockForm.group,
          uom: stockForm.uom,
          hsn: stockForm.hsn,
          taxability: stockForm.taxability,
          costingMethod: stockForm.costingMethod,
          maintainBatches: stockForm.maintainBatches === 'Yes',
          openingQty: parseFloat(stockForm.openingQty) || 0,
          openingRate: parseFloat(stockForm.openingRate) || 0,
          openingValue: parseFloat(stockForm.openingValue) || 0,
          companyName: user.companyName
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(`Stock Item "${stockForm.name}" created successfully!`);
        setShowSuccessModal(true);
        setDashboardData(prev => ({
          ...prev,
          stocks: [...prev.stocks, data]
        }));
        setStockForm({
          name: '',
          group: 'Primary',
          uom: 'Nos',
          hsn: '',
          taxability: 'Taxable (18%)',
          costingMethod: 'Average Cost',
          maintainBatches: 'No',
          openingQty: '0',
          openingRate: '0.00',
          openingValue: '0.00'
        });
      } else {
        alert(data.message || 'Error creating stock item');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error connecting to backend');
    }
  };

  const renderReport = () => {
    switch (activeTab) {

      case 'GATEWAY':
        return (
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', opacity: 0.5 }}>
            <img src={logoImage} alt="Logo" style={{ width: '200px', filter: 'grayscale(100%)', marginBottom: '20px' }} />
            <h2 style={{ fontSize: '24px', letterSpacing: '1px' }}>Welcome to TallyX</h2>
            <p>Please Select or Create a Company from the Sidebar to begin.</p>
          </div>
        );

      case 'SELECT_COMPANY':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '700px', margin: '20px auto', boxSizing: 'border-box' }}>
            <div className="report-header" style={{ borderBottom: '1px solid rgba(143, 0, 204, 0.2)' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: '#8F00CC', margin: 0 }}><i className="fas fa-list"></i> Select Company</h3>
                <p className="report-subtitle">Choose a company to load</p>
              </div>
              <button onClick={() => setActiveTab('GATEWAY')} className="esc-btn"><i className="fas fa-times"></i> Esc: Back</button>
            </div>
            <div style={{ padding: '20px', background: 'var(--card-bg)', minHeight: '300px', borderRadius: '8px' }}>
              {availableCompanies.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {availableCompanies.map(c => (
                    <div key={c._id || c.id} 
                      className="company-list-item"
                      onClick={() => {
                        localStorage.setItem('tallyx_company_name', c.name);
                        setUser(prev => ({ ...prev, companyName: c.name, initials: c.name.substring(0, 2).toUpperCase() }));
                        setActiveTab('DASHBOARD');
                      }}
                    >
                      <div>
                        <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--text-main)' }}>{c.name}</h4>
                        <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: 'var(--text-dim)' }}>
                          FY: {c.fyFrom ? new Date(c.fyFrom).getFullYear() : '2025'} - {c.fyFrom ? new Date(c.fyFrom).getFullYear() + 1 : '2026'}
                        </p>
                      </div>
                      <i className="fas fa-chevron-right" style={{ color: 'var(--text-dim)' }}></i>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-dim)' }}>
                  <i className="fas fa-folder-open" style={{ fontSize: '40px', marginBottom: '15px', color: 'rgba(255,255,255,0.1)' }}></i>
                  <p>No companies found. Please create a new company.</p>
                  <button onClick={() => setActiveTab('COMPANY')} style={{ marginTop: '15px', padding: '10px 20px', background: '#8F00CC', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Create Company</button>
                </div>
              )}
            </div>
          </div>
        );

      // --- 🚀 NEW SAANDAR SCREENS (Fixed Alignment & Detailed) ---

      case 'SALES':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '25px' }}>
            <div className="report-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: '#8F00CC', fontSize: '20px', margin: '0 0 5px 0', fontWeight: '800' }}><i className="fas fa-file-invoice-dollar" style={{ marginRight: '8px' }}></i> Sales Tax Invoice</h3>
                <span style={{ background: '#8F00CC', color: '#fff', padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>F8 : VOUCHER</span>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000' }}># INV-25/001</div>
                  <div style={{ color: '#636c76', fontSize: '11px' }}><i className="far fa-calendar-alt"></i> 01-Apr-2025</div>
                </div>
                <button onClick={() => setActiveTab('DASHBOARD')} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Esc: Quit</button>
              </div>
            </div>

            <div style={{ boxSizing: 'border-box' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={{ ...labelStyle, color: '#000000' }}><span>Party A/c Name</span> <span style={{ color: '#8F00CC' }}>+ Alt C</span></label>
                  <select style={inputStyle}><option>Rahul Traders (GST: 10AAAAA1234A1Z1)</option><option>Cash</option></select>
                </div>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={{ ...labelStyle, color: '#000000' }}>Sales Ledger</label>
                  <select style={inputStyle}><option>Sales - Local @ 18%</option><option>Sales - Interstate @ 18%</option></select>
                </div>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={{ ...labelStyle, color: '#000000' }}>Place of Supply</label>
                  <input type="text" style={inputStyle} defaultValue="10 - Bihar" />
                </div>
              </div>

              {/* Table Wrapper ensures no overflow */}
              <div style={{ width: '100%', overflowX: 'auto', boxSizing: 'border-box', marginBottom: '20px' }}>
                <table style={voucherTableStyle}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, width: '30%' }}>Name of Item</th>
                      <th style={{ ...thStyle, width: '10%', textAlign: 'center' }}>HSN/SAC</th>
                      <th style={{ ...thStyle, width: '10%', textAlign: 'right' }}>Qty</th>
                      <th style={{ ...thStyle, width: '15%', textAlign: 'right' }}>Rate (₹)</th>
                      <th style={{ ...thStyle, width: '10%' }}>Disc %</th>
                      <th style={{ ...thStyle, width: '25%', textAlign: 'right', color: '#8F00CC' }}>Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdStyle}><input type="text" style={{ ...inputStyle, border: 'none', background: 'transparent' }} placeholder="Select Item..." /></td>
                      <td style={tdStyle}><input type="text" style={{ ...inputStyle, textAlign: 'center', border: 'none', background: 'transparent' }} placeholder="8471" /></td>
                      <td style={tdStyle}><input type="text" style={{ ...inputStyle, textAlign: 'right', border: 'none', background: 'transparent' }} placeholder="0" /></td>
                      <td style={tdStyle}><input type="text" style={{ ...inputStyle, textAlign: 'right', border: 'none', background: 'transparent' }} placeholder="0.00" /></td>
                      <td style={tdStyle}><input type="text" style={{ ...inputStyle, textAlign: 'right', border: 'none', background: 'transparent' }} placeholder="0" /></td>
                      <td style={tdStyle}><input type="text" style={{ ...inputStyle, textAlign: 'right', border: 'none', background: 'transparent', fontWeight: 'bold' }} placeholder="0.00" readOnly /></td>
                    </tr>
                    <tr>
                      <td colSpan="5" style={{ ...tdStyle, textAlign: 'right', color: 'var(--text-dim)', borderRight: 'none' }}>CGST @ 9%</td>
                      <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--text-dim)' }}>0.00</td>
                    </tr>
                    <tr>
                      <td colSpan="5" style={{ ...tdStyle, textAlign: 'right', color: 'var(--text-dim)', borderRight: 'none' }}>SGST @ 9%</td>
                      <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--text-dim)' }}>0.00</td>
                    </tr>
                    <tr style={{ background: 'rgba(47,129,247,0.05)' }}>
                      <td colSpan="5" style={{ ...tdStyle, textAlign: 'right', fontWeight: '900', borderRight: 'none', color: 'var(--text-main)' }}>GRAND TOTAL</td>
                      <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '900', fontSize: '18px', color: 'var(--accent-blue)' }}>₹ 0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', boxSizing: 'border-box' }}>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={{ ...labelStyle, color: '#000000' }}>Narration / Remarks:</label>
                  <textarea style={{ ...inputStyle, height: '50px', resize: 'none' }} placeholder="Being goods sold on credit..."></textarea>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', boxSizing: 'border-box' }}>
                  <button style={{
                    background: '#efe0ff',
                    color: '#8F00CC',
                    padding: '10px 30px',
                    border: '1px solid #8F00CC',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>
                    Save (Ctrl+A)
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'PURCHASE':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '25px' }}>
            <div className="report-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: '#8F00CC', fontSize: '20px', margin: '0 0 5px 0', fontWeight: '800' }}><i className="fas fa-shopping-basket" style={{ marginRight: '8px' }}></i> Purchase Voucher</h3>
                <span style={{ background: '#8F00CC', color: '#fff', padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>F9 : VOUCHER</span>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '5px' }}>
                    <input type="text" style={{ ...inputStyle, width: '130px', padding: '6px', fontSize: '13px' }} placeholder="Sup. Inv No." />
                    <input type="date" style={{ ...inputStyle, width: '130px', padding: '6px', fontSize: '13px' }} defaultValue="2025-04-01" />
                  </div>
                </div>
                <button onClick={() => setActiveTab('DASHBOARD')} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Esc: Quit</button>
              </div>
            </div>

            <div style={{ boxSizing: 'border-box' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={{ ...labelStyle, color: '#000000' }}><span>Party A/c Name</span></label>
                  <select style={inputStyle}><option>XYZ Suppliers (Creditor)</option><option>Cash</option></select>
                </div>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={{ ...labelStyle, color: '#000000' }}>Purchase Ledger</label>
                  <select style={inputStyle}><option>Purchase Accounts @ 18%</option></select>
                </div>
              </div>

              <div style={{ width: '100%', overflowX: 'auto', boxSizing: 'border-box', marginBottom: '20px' }}>
                <table style={voucherTableStyle}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, width: '40%' }}>Name of Item</th>
                      <th style={{ ...thStyle, width: '15%', textAlign: 'right' }}>Quantity</th>
                      <th style={{ ...thStyle, width: '15%', textAlign: 'right' }}>Rate</th>
                      <th style={{ ...thStyle, width: '10%', textAlign: 'center' }}>Per</th>
                      <th style={{ ...thStyle, width: '20%', textAlign: 'right', color: '#8F00CC' }}>Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdStyle}><input type="text" style={{ ...inputStyle, border: 'none', background: 'transparent' }} placeholder="Select Item..." /></td>
                      <td style={tdStyle}><input type="text" style={{ ...inputStyle, textAlign: 'right', border: 'none', background: 'transparent' }} placeholder="0" /></td>
                      <td style={tdStyle}><input type="text" style={{ ...inputStyle, textAlign: 'right', border: 'none', background: 'transparent' }} placeholder="0.00" /></td>
                      <td style={tdStyle}><input type="text" style={{ ...inputStyle, textAlign: 'center', border: 'none', background: 'transparent' }} placeholder="Nos" /></td>
                      <td style={tdStyle}><input type="text" style={{ ...inputStyle, textAlign: 'right', border: 'none', background: 'transparent', fontWeight: 'bold' }} placeholder="0.00" readOnly /></td>
                    </tr>
                    <tr style={{ background: 'rgba(40,167,69,0.05)' }}>
                      <td colSpan="4" style={{ ...tdStyle, textAlign: 'right', fontWeight: '900', borderRight: 'none' }}>TOTAL VALUE</td>
                      <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '900', fontSize: '18px', color: 'var(--accent-green)' }}>₹ 0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', boxSizing: 'border-box' }}>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={{ ...labelStyle, color: '#000000' }}>Narration:</label>
                  <textarea style={{ ...inputStyle, height: '50px', resize: 'none' }} placeholder="Being goods purchased..."></textarea>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', boxSizing: 'border-box' }}>
                  <button style={{
                    background: '#efe0ff',
                    color: '#8F00CC',
                    padding: '10px 30px',
                    border: '1px solid #8F00CC',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>
                    Save (Ctrl+A)
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'COMPANY':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="report-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: '#8F00CC' }}><i className="fas fa-building" style={{ color: '#8F00CC' }}></i> Company Configuration (Master Setup)</h3>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc: Quit</button>
            </div>

            <div style={{ padding: '20px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '6px', marginTop: '20px', boxSizing: 'border-box' }}>
              <form onSubmit={handleCompanySubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', boxSizing: 'border-box' }}>

                  <div style={{ boxSizing: 'border-box' }}>
                    <h4 style={{ color: '#8F00CC', marginBottom: '15px' }}>Directory & Name</h4>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ ...labelStyle, color: '#000000' }}>Company Name</label>
                      <input 
                        ref={companyNameRef}
                        type="text" 
                        name="name"
                        value={companyForm.name}
                        onChange={handleCompanyChange}
                        style={{ ...inputStyle, fontWeight: 'bold' }} 
                        placeholder="e.g. Manish Pvt Ltd" 
                        required
                      />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ ...labelStyle, color: '#000000' }}>Registered Address</label>
                      <textarea 
                        name="address"
                        value={companyForm.address}
                        onChange={handleCompanyChange}
                        style={{ ...inputStyle, resize: 'none', height: '60px' }}
                      ></textarea>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div>
                        <label style={{ ...labelStyle, color: '#000000' }}>State</label>
                        <select 
                          name="state"
                          value={companyForm.state}
                          onChange={handleCompanyChange}
                          style={inputStyle}
                        >
                          <option value="">Select State</option>
                          <option value="Bihar">Bihar</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Chhattisgarh">Chhattisgarh</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ ...labelStyle, color: '#000000' }}>PIN Code</label>
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

                  <div style={{ boxSizing: 'border-box' }}>
                    <h4 style={{ color: '#8F00CC', marginBottom: '15px' }}>Compliance & Books</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                      <div>
                        <label style={{ ...labelStyle, color: '#000000' }}>Financial Year from</label>
                        <input 
                          type="date" 
                          name="fyFrom"
                          value={companyForm.fyFrom}
                          onChange={handleCompanyChange}
                          style={inputStyle} 
                        />
                      </div>
                      <div>
                        <label style={{ ...labelStyle, color: '#000000' }}>Books beginning from</label>
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
                      <label style={{ ...labelStyle, color: '#000000' }}>GSTIN / UIN</label>
                      <input 
                        type="text" 
                        name="gstinUin"
                        value={companyForm.gstinUin}
                        onChange={handleCompanyChange}
                        style={{ ...inputStyle, textTransform: 'uppercase' }} 
                        placeholder="22AAAAA0000A1Z5" 
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ ...labelStyle, color: '#000000' }}>PAN / IT No.</label>
                      <input 
                        type="text" 
                        name="pan"
                        value={companyForm.pan}
                        onChange={handleCompanyChange}
                        style={{ ...inputStyle, textTransform: 'uppercase' }} 
                        placeholder="ABCDE1234F" 
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                  <button 
                    type="submit"
                    style={{
                      background: '#efe0ff',
                      color: '#8F00CC',
                      padding: '10px 30px',
                      border: '1px solid #8F00CC',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Accept (Ctrl+A)
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case 'LEDGER':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '25px' }}>
            <div className="report-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: '#8F00CC', margin: 0, fontWeight: '800' }}>Ledger Creation (Account Masters)</h3>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Esc: Quit</button>
            </div>

            <div style={{ boxSizing: 'border-box', maxWidth: '850px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', boxSizing: 'border-box' }}>

                <div>
                  <label style={{ ...labelStyle, color: '#000000' }}>Name of Ledger</label>
                  <input ref={ledgerNameRef} type="text" style={{ ...inputStyle, fontSize: '16px', fontWeight: 'bold' }} placeholder="e.g. Ramesh & Co." />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', boxSizing: 'border-box' }}>
                  <div style={{ boxSizing: 'border-box' }}>
                    <label style={{ ...labelStyle, color: '#000000' }}>Under (Group Head)</label>
                    <select style={inputStyle}>
                      <option>Sundry Debtors</option>
                      <option>Sundry Creditors</option>
                      <option>Sales Accounts</option>
                    </select>
                  </div>
                  <div style={{ boxSizing: 'border-box' }}>
                    <label style={{ ...labelStyle, color: '#000000' }}>Maintain balances bill-by-bill</label>
                    <select style={inputStyle}>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', boxSizing: 'border-box' }}>
                  <div style={{ boxSizing: 'border-box' }}>
                    <label style={{ ...labelStyle, color: '#000000' }}>Address / State</label>
                    <textarea style={{ ...inputStyle, resize: 'none', height: '50px', marginBottom: '10px' }}></textarea>
                    <input type="text" style={inputStyle} placeholder="State" />
                  </div>
                  <div style={{ boxSizing: 'border-box' }}>
                    <label style={{ ...labelStyle, color: '#000000' }}>Tax Registration (GSTIN)</label>
                    <select style={{ ...inputStyle, marginBottom: '10px' }}><option>Regular</option><option>Unregistered</option></select>
                    <input type="text" style={{ ...inputStyle, textTransform: 'uppercase' }} placeholder="Format: 22AAAAA0000A1Z5" />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box' }}>
                  <label style={{ ...labelStyle, margin: 0, color: '#8F00CC', fontSize: '14px' }}>Opening Balance</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input type="text" style={{ ...inputStyle, width: '150px', textAlign: 'right', fontWeight: 'bold', margin: 0 }} placeholder="0.00" />
                    <select style={{ ...inputStyle, width: '70px', margin: 0 }}>
                      <option>Dr</option><option>Cr</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button style={{
                  background: '#efe0ff',
                  color: '#8F00CC',
                  padding: '10px 30px',
                  border: '1px solid #8F00CC',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  Save Ledger (Ctrl+A)
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'LEDGER_DISPLAY':
      case 'LEDGER_ALTER':
      case 'MULTI_LEDGER_CREATE':
      case 'MULTI_LEDGER_DISPLAY':
      case 'MULTI_LEDGER_ALTER':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '25px', textAlign: 'center' }}>
             <i className="fas fa-tools" style={{ fontSize: '50px', color: '#8F00CC', marginBottom: '20px', opacity: 0.3 }}></i>
             <h3 style={{ color: '#000', fontSize: '20px', fontWeight: '800' }}>{activeTab.split('_').join(' ')}</h3>
             <p style={{ color: '#636c76' }}>The <strong>{activeTab.split('_').join(' ')}</strong> module is currently being optimized for the Elite Modern interface.</p>
             <button onClick={() => setActiveTab('LEDGER')} style={{ marginTop: '20px', background: '#8F00CC', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Back to Creation</button>
          </div>
        );

      case 'STOCK':
        return (
          <form onSubmit={handleStockSubmit} className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '25px' }}>
            <div className="report-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: '#8F00CC', margin: 0, fontWeight: '800' }}>Stock Item Creation (Inventory Master)</h3>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ background: '#8F00CC', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Save (Ctrl+A)</button>
                <button type="button" onClick={() => setActiveTab('DASHBOARD')} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Esc: Quit</button>
              </div>
            </div>

            <div style={{ boxSizing: 'border-box', maxWidth: '850px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', boxSizing: 'border-box' }}>

                <div>
                  <label style={{ ...labelStyle, color: '#000000' }}>Name of Stock Item</label>
                  <input
                    ref={stockNameRef}
                    type="text"
                    name="name"
                    value={stockForm.name}
                    onChange={handleStockChange}
                    style={{ ...inputStyle, fontSize: '16px', fontWeight: 'bold' }}
                    placeholder="e.g. Dell Inspiron 15"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', boxSizing: 'border-box' }}>
                  <div style={{ boxSizing: 'border-box' }}>
                    <label style={{ ...labelStyle, color: '#000000' }}>Under (Category / Group)</label>
                    <select
                      name="group"
                      value={stockForm.group}
                      onChange={handleStockChange}
                      style={inputStyle}
                    >
                      <option value="Primary">Primary</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Raw Materials">Raw Materials</option>
                      <option value="Finished Goods">Finished Goods</option>
                    </select>
                  </div>
                  <div style={{ boxSizing: 'border-box' }}>
                    <label style={{ ...labelStyle, color: '#000000' }}>Units of Measure (UOM)</label>
                    <select
                      name="uom"
                      value={stockForm.uom}
                      onChange={handleStockChange}
                      style={inputStyle}
                    >
                      <option value="Nos">Nos (Numbers)</option>
                      <option value="Pcs">Pcs (Pieces)</option>
                      <option value="Kgs">Kgs (Kilograms)</option>
                      <option value="Box">Box (Boxes)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', boxSizing: 'border-box' }}>
                  <div style={{ boxSizing: 'border-box' }}>
                    <label style={{ ...labelStyle, color: '#000000' }}>HSN / SAC Code</label>
                    <input
                      type="text"
                      name="hsn"
                      value={stockForm.hsn}
                      onChange={handleStockChange}
                      style={{ ...inputStyle, marginBottom: '10px' }}
                      placeholder="e.g. 8471"
                    />
                    <label style={{ ...labelStyle, color: '#000000' }}>Taxability</label>
                    <select
                      name="taxability"
                      value={stockForm.taxability}
                      onChange={handleStockChange}
                      style={inputStyle}
                    >
                      <option value="Taxable (18%)">Taxable (18%)</option>
                      <option value="Taxable (12%)">Taxable (12%)</option>
                      <option value="Taxable (5%)">Taxable (5%)</option>
                      <option value="Exempt">Exempt</option>
                      <option value="Nil Rated">Nil Rated</option>
                    </select>
                  </div>
                  <div style={{ boxSizing: 'border-box' }}>
                    <label style={{ ...labelStyle, color: '#000000' }}>Costing Method</label>
                    <select
                      name="costingMethod"
                      value={stockForm.costingMethod}
                      onChange={handleStockChange}
                      style={{ ...inputStyle, marginBottom: '10px' }}
                    >
                      <option value="Average Cost">Average Cost</option>
                      <option value="FIFO">FIFO</option>
                      <option value="LIFO">LIFO</option>
                    </select>
                    <label style={{ ...labelStyle, color: '#000000' }}>Maintain in Batches?</label>
                    <select
                      name="maintainBatches"
                      value={stockForm.maintainBatches}
                      onChange={handleStockChange}
                      style={inputStyle}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </div>

                <div style={{ boxSizing: 'border-box' }}>
                  <h4 style={{ color: '#8F00CC', marginBottom: '15px' }}>Opening Balance</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', boxSizing: 'border-box' }}>
                    <div style={{ boxSizing: 'border-box' }}>
                      <label style={{ ...labelStyle, fontSize: '11px' }}>Quantity</label>
                      <input
                        type="number"
                        name="openingQty"
                        value={stockForm.openingQty}
                        onChange={handleStockChange}
                        style={{ ...inputStyle, textAlign: 'right' }}
                        placeholder="0"
                      />
                    </div>
                    <div style={{ boxSizing: 'border-box' }}>
                      <label style={{ ...labelStyle, fontSize: '11px' }}>Rate (₹)</label>
                      <input
                        type="number"
                        name="openingRate"
                        value={stockForm.openingRate}
                        onChange={handleStockChange}
                        style={{ ...inputStyle, textAlign: 'right' }}
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    <div style={{ boxSizing: 'border-box' }}>
                      <label style={{ ...labelStyle, fontSize: '11px' }}>Total Value (₹)</label>
                      <input
                        type="text"
                        name="openingValue"
                        value={stockForm.openingValue}
                        style={{ ...inputStyle, textAlign: 'right', background: 'rgba(0,0,0,0.05)' }}
                        placeholder="0.00"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                <button type="submit" style={{
                  background: '#efe0ff',
                  color: '#8F00CC',
                  padding: '10px 30px',
                  border: '1px solid #8F00CC',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  Save Item (Ctrl+A)
                </button>
              </div>
            </div>
          </form>
        );

      case 'PAYMENT':
      case 'RECEIPT':
      case 'CONTRA':
      case 'JOURNAL':
        let vIcon2 = 'fa-money-bill-wave';
        if (activeTab === 'RECEIPT') { vIcon2 = 'fa-hand-holding-usd'; }
        if (activeTab === 'CONTRA') { vIcon2 = 'fa-exchange-alt'; }
        if (activeTab === 'JOURNAL') { vIcon2 = 'fa-book-open'; }

        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '25px' }}>
            <div className="report-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: '#8F00CC', margin: 0, fontWeight: '800' }}><i className={`fas ${vIcon2}`} style={{ marginRight: '8px' }}></i>{activeTab} Voucher</h3>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: '#000000', fontSize: '14px' }}>No. 001</div>
                  <div style={{ color: '#636c76', fontSize: '11px' }}>1-Apr-25</div>
                </div>
                <button onClick={() => setActiveTab('DASHBOARD')} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Esc: Quit</button>
              </div>
            </div>

            <div style={{ boxSizing: 'border-box' }}>
              {activeTab !== 'JOURNAL' && (
                <div style={{ padding: '15px', background: '#e2e8f0', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '20px', boxSizing: 'border-box' }}>
                  <label style={{ ...labelStyle, color: '#475569' }}>ACCOUNT (CASH / BANK)</label>
                  <select style={{ ...inputStyle, fontSize: '16px', fontWeight: 'bold' }}><option>Cash</option><option>HDFC Bank Current A/c</option></select>
                  <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '5px', fontWeight: '600' }}>Cur Bal: ₹ 1,12,000.00 Dr</div>
                </div>
              )}

              <div style={{ overflowX: 'auto', width: '100%', boxSizing: 'border-box' }}>
                <table style={voucherTableStyle}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, width: '10%' }}>Dr / Cr</th>
                      <th style={{ ...thStyle, width: '50%' }}>Particulars (Ledger)</th>
                      <th style={{ ...thStyle, width: '20%', textAlign: 'right' }}>Debit (₹)</th>
                      <th style={{ ...thStyle, width: '20%', textAlign: 'right' }}>Credit (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdStyle}><select style={{ ...inputStyle, border: 'none', background: 'transparent' }}><option>Dr</option><option>Cr</option></select></td>
                      <td style={tdStyle}>
                        <input type="text" style={{ ...inputStyle, border: 'none', background: 'transparent' }} placeholder="Select Ledger..." />
                        <div style={{ fontSize: '11px', color: 'var(--text-dim)', paddingLeft: '12px' }}>Cur Bal: ₹ 0.00</div>
                      </td>
                      <td style={tdStyle}><input type="text" style={{ ...inputStyle, border: 'none', background: 'transparent', textAlign: 'right' }} placeholder="0.00" /></td>
                      <td style={tdStyle}><input type="text" style={{ ...inputStyle, border: 'none', background: 'transparent', textAlign: 'right' }} placeholder="0.00" disabled /></td>
                    </tr>
                    <tr>
                      <td style={tdStyle}><select style={{ ...inputStyle, border: 'none', background: 'transparent' }}><option>Cr</option><option>Dr</option></select></td>
                      <td style={tdStyle}>
                        <input type="text" style={{ ...inputStyle, border: 'none', background: 'transparent' }} placeholder="Select Ledger..." />
                        <div style={{ fontSize: '11px', color: 'var(--text-dim)', paddingLeft: '12px' }}>Cur Bal: ₹ 0.00</div>
                      </td>
                      <td style={tdStyle}><input type="text" style={{ ...inputStyle, border: 'none', background: 'transparent', textAlign: 'right' }} placeholder="0.00" disabled /></td>
                      <td style={tdStyle}><input type="text" style={{ ...inputStyle, border: 'none', background: 'transparent', textAlign: 'right' }} placeholder="0.00" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px', boxSizing: 'border-box' }}>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={{ ...labelStyle, color: '#000000' }}>Narration:</label>
                  <textarea style={{ ...inputStyle, height: '50px', resize: 'none' }} placeholder="Enter details..."></textarea>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', boxSizing: 'border-box' }}>
                  <button style={{
                    background: '#efe0ff',
                    color: '#8F00CC',
                    padding: '10px 30px',
                    border: '1px solid #8F00CC',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>Save (Ctrl+A)</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'BANKING':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '25px' }}>
            <div className="report-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: '#8F00CC', margin: 0, fontWeight: '800' }}><i className="fas fa-university" style={{ marginRight: '8px' }}></i> Banking Utilities</h3>
                <p style={{ margin: '5px 0 0 0', color: '#636c76', fontSize: '13px' }}>Reconciliation, Cheque Management & E-Payments</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Esc: Back</button>
            </div>
            <div className="ledger-split" style={{ marginTop: '20px', gap: '20px' }}>
              <div className="ledger-side" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <div className="ledger-head" style={{ background: '#efe0ff', color: '#8F00CC', padding: '10px 15px', fontWeight: 'bold', borderRadius: '6px 6px 0 0' }}>Bank Operations</div>
                <div className="ledger-body" style={{ padding: '15px', background: '#fff', borderRadius: '0 0 6px 6px' }}>
                  <div className="ledger-row fw-bold" style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #e2e8f0', color: '#000000' }}><i className="fas fa-money-check" style={{ marginRight: '10px', color: '#636c76' }}></i> <span>Cheque Printing</span></div>
                  <div className="ledger-row fw-bold" style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #e2e8f0', color: '#000000' }}><i className="fas fa-book" style={{ marginRight: '10px', color: '#636c76' }}></i> <span>Cheque Register</span></div>
                  <div className="ledger-row fw-bold" style={{ cursor: 'pointer', padding: '10px', color: '#000000' }}><i className="fas fa-sync-alt" style={{ marginRight: '10px', color: '#8F00CC' }}></i> <span>Bank Reconciliation (BRS)</span></div>
                </div>
              </div>
              <div className="ledger-side" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <div className="ledger-head" style={{ background: '#efe0ff', color: '#8F00CC', padding: '10px 15px', fontWeight: 'bold', borderRadius: '6px 6px 0 0' }}>Payments & Statements</div>
                <div className="ledger-body" style={{ padding: '15px', background: '#fff', borderRadius: '0 0 6px 6px' }}>
                  <div className="ledger-row fw-bold" style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #e2e8f0', color: '#000000' }}><i className="fas fa-file-invoice" style={{ marginRight: '10px', color: '#636c76' }}></i> <span>Deposit Slip</span></div>
                  <div className="ledger-row fw-bold" style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #e2e8f0', color: '#000000' }}><i className="fas fa-envelope-open-text" style={{ marginRight: '10px', color: '#636c76' }}></i> <span>Payment Advice</span></div>
                  <div className="ledger-row fw-bold" style={{ cursor: 'pointer', padding: '10px', color: '#000000' }}><i className="fas fa-calendar-check" style={{ marginRight: '10px', color: '#8F00CC' }}></i> <span>Post-Dated Summary (PDC)</span></div>
                </div>
              </div>
            </div>
          </div>
        );

      // --- 📌 ORIGINAL REPORTS (100% UNTOUCHED FROM FIRST PROMPT) ---

      case 'GST':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '25px' }}>
            <div className="report-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: '#8F00CC', margin: 0, fontWeight: '800' }}><i className="fas fa-percentage" style={{ marginRight: '8px' }}></i> GSTR-1 & Taxation Summary</h3>
                <p style={{ margin: '5px 0 0 0', color: '#636c76', fontSize: '13px' }}>For the period: 01-Apr-2025 to 31-Mar-2026</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Esc: Back</button>
            </div>

            <div className="report-summary-cards">
              <div className="r-card">
                <p>Total Taxable Value</p>
                <h4>₹ 2,30,000.00</h4>
              </div>
              <div className="r-card">
                <p>Total Tax Liability</p>
                <h4 style={{ color: 'var(--accent-red)' }}>₹ 41,400.00</h4>
              </div>
              <div className="r-card">
                <p>Available ITC</p>
                <h4 style={{ color: 'var(--accent-green)' }}>₹ 18,200.00</h4>
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
                    <td>B2B Invoices (Registered)</td>
                    <td className="num-col">1,50,000.00</td>
                    <td className="num-col">13,500.00</td>
                    <td className="num-col">13,500.00</td>
                    <td className="num-col">-</td>
                    <td className="num-col highlight">1,77,000.00</td>
                  </tr>
                  <tr>
                    <td>B2C Invoices (Unregistered)</td>
                    <td className="num-col">80,000.00</td>
                    <td className="num-col">7,200.00</td>
                    <td className="num-col">7,200.00</td>
                    <td className="num-col">-</td>
                    <td className="num-col highlight">94,400.00</td>
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
                    <td className="num-col">2,30,000.00</td>
                    <td className="num-col">20,700.00</td>
                    <td className="num-col">20,700.00</td>
                    <td className="num-col">-</td>
                    <td className="num-col">2,71,400.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'PL':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '25px' }}>
            <div className="report-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: '#8F00CC', margin: 0, fontWeight: '800' }}><i className="fas fa-chart-line" style={{ marginRight: '8px' }}></i> Profit & Loss A/c</h3>
                <p style={{ margin: '5px 0 0 0', color: '#636c76', fontSize: '13px' }}>Manish Pvt Ltd | As of 31-Mar-2026</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Esc: Back</button>
            </div>

            <div className="ledger-split">
              <div className="ledger-side border-right">
                <div className="ledger-head">Particulars (Expenses)</div>
                <div className="ledger-body">
                  <div className="ledger-row fw-bold"><span>Opening Stock</span><span className="amt">45,000.00</span></div>
                  <div className="ledger-row fw-bold"><span>Purchase Accounts</span><span className="amt">1,20,500.00</span></div>
                  <div className="ledger-row child"><span>Local Purchases</span><span className="amt">80,000.00</span></div>
                  <div className="ledger-row child"><span>Interstate Purchases</span><span className="amt">40,500.00</span></div>

                  <div className="ledger-row fw-bold"><span>Direct Expenses</span><span className="amt">12,000.00</span></div>
                  <div className="ledger-row child"><span>Wages</span><span className="amt">8,000.00</span></div>
                  <div className="ledger-row child"><span>Freight Inward</span><span className="amt">4,000.00</span></div>

                  <div className="ledger-row fw-bold" style={{ marginTop: '20px', color: 'var(--accent-blue)' }}>
                    <span>Gross Profit c/o</span><span className="amt">2,59,000.00</span>
                  </div>
                </div>
                <div className="ledger-footer"><span>Total</span><span className="amt">4,36,500.00</span></div>
              </div>

              <div className="ledger-side">
                <div className="ledger-head">Particulars (Income)</div>
                <div className="ledger-body">
                  <div className="ledger-row fw-bold"><span>Sales Accounts</span><span className="amt">3,84,500.00</span></div>
                  <div className="ledger-row child"><span>Sales B2B</span><span className="amt">2,50,000.00</span></div>
                  <div className="ledger-row child"><span>Sales B2C</span><span className="amt">1,34,500.00</span></div>

                  <div className="ledger-row fw-bold"><span>Closing Stock</span><span className="amt">52,000.00</span></div>
                </div>
                <div className="ledger-footer"><span>Total</span><span className="amt">4,36,500.00</span></div>
              </div>
            </div>
          </div>
        );

      case 'BS':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '25px' }}>
            <div className="report-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: '#8F00CC', margin: 0, fontWeight: '800' }}><i className="fas fa-balance-scale" style={{ marginRight: '8px' }}></i> Balance Sheet</h3>
                <p style={{ margin: '5px 0 0 0', color: '#636c76', fontSize: '13px' }}>Manish Pvt Ltd | As of 31-Mar-2026</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Esc: Back</button>
            </div>

            <div className="ledger-split">
              <div className="ledger-side border-right">
                <div className="ledger-head">Liabilities</div>
                <div className="ledger-body">
                  <div className="ledger-row fw-bold"><span>Capital Account</span><span className="amt">5,00,000.00</span></div>
                  <div className="ledger-row child"><span>Manish Capital</span><span className="amt">5,00,000.00</span></div>

                  <div className="ledger-row fw-bold mt-3"><span>Loans (Liability)</span><span className="amt">1,50,000.00</span></div>
                  <div className="ledger-row child"><span>Bank OD A/c</span><span className="amt">1,50,000.00</span></div>

                  <div className="ledger-row fw-bold mt-3"><span>Current Liabilities</span><span className="amt">92,250.00</span></div>
                  <div className="ledger-row child"><span>Sundry Creditors</span><span className="amt">60,000.00</span></div>
                  <div className="ledger-row child"><span>Duties & Taxes</span><span className="amt">32,250.00</span></div>

                  <div className="ledger-row fw-bold mt-3" style={{ color: 'var(--accent-green)' }}><span>Profit & Loss A/c</span><span className="amt">2,59,000.00</span></div>
                </div>
                <div className="ledger-footer"><span>Total</span><span className="amt">10,01,250.00</span></div>
              </div>

              <div className="ledger-side">
                <div className="ledger-head">Assets</div>
                <div className="ledger-body">
                  <div className="ledger-row fw-bold"><span>Fixed Assets</span><span className="amt">3,50,000.00</span></div>
                  <div className="ledger-row child"><span>Computers & IT</span><span className="amt">1,50,000.00</span></div>
                  <div className="ledger-row child"><span>Office Equipment</span><span className="amt">2,00,000.00</span></div>

                  <div className="ledger-row fw-bold mt-3"><span>Investments</span><span className="amt">1,00,000.00</span></div>

                  <div className="ledger-row fw-bold mt-3"><span>Current Assets</span><span className="amt">5,51,250.00</span></div>
                  <div className="ledger-row child"><span>Closing Stock</span><span className="amt">52,000.00</span></div>
                  <div className="ledger-row child"><span>Sundry Debtors</span><span className="amt">3,45,000.00</span></div>
                  <div className="ledger-row child"><span>Cash-in-Hand</span><span className="amt">42,250.00</span></div>
                  <div className="ledger-row child"><span>Bank Accounts</span><span className="amt">1,12,000.00</span></div>
                </div>
                <div className="ledger-footer"><span>Total</span><span className="amt">10,01,250.00</span></div>
              </div>
            </div>
          </div>
        );

      case 'PRINT':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '25px' }}>
            <div className="report-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: '#8F00CC', margin: 0, fontWeight: '800' }}><i className="fas fa-print" style={{ marginRight: '8px' }}></i> Printing & Export</h3>
                <p style={{ margin: '5px 0 0 0', color: '#636c76', fontSize: '13px' }}>Manish Pvt Ltd | Configuration</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Esc: Back</button>
            </div>
            <div style={{ marginTop: '20px' }}>
              <table className="report-table premium-table">
                <thead>
                  <tr><th>Report Type</th><th>Default Format</th><th>Action</th></tr>
                </thead>
                <tbody>
                  <tr><td>Sales Invoice (Current)</td><td>PDF</td><td className="num-col highlight" style={{ cursor: 'pointer' }}>Print (Alt+P)</td></tr>
                  <tr><td>Day Book / Registers</td><td>Excel</td><td className="num-col highlight" style={{ cursor: 'pointer' }}>Export (Alt+E)</td></tr>
                  <tr><td>Outstanding Receivables</td><td>PDF</td><td className="num-col highlight" style={{ cursor: 'pointer' }}>Print (Alt+P)</td></tr>
                  <tr><td>GSTR-1 Summary</td><td>JSON</td><td className="num-col highlight" style={{ cursor: 'pointer' }}>Export (Alt+E)</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'BACKUP':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '25px' }}>
            <div className="report-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: '#8F00CC', margin: 0, fontWeight: '800' }}><i className="fas fa-sync" style={{ marginRight: '8px' }}></i> Backup & Restore</h3>
                <p style={{ margin: '5px 0 0 0', color: '#636c76', fontSize: '13px' }}>Secure your Company Data</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Esc: Back</button>
            </div>
            <div style={{ padding: '25px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', marginTop: '20px' }}>
              <h4 style={{ color: '#8F00CC', marginBottom: '20px', fontSize: '18px' }}>Backup Details</h4>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold', color: '#000000' }}>Source Path :</span>
                  <span style={{ fontFamily: 'monospace', color: '#636c76' }}>C:\TallyPrime\Data</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold', color: '#000000' }}>Destination Path :</span>
                  <span style={{ fontFamily: 'monospace', color: '#636c76' }}>D:\TallyBackups\2026</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span style={{ fontWeight: 'bold', color: '#000000' }}>Company Name :</span>
                  <span style={{ fontWeight: 'bold', color: '#000000' }}>Manish Pvt Ltd (10000)</span>
                </div>
                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                  <button style={{ background: '#efe0ff', color: '#8F00CC', padding: '12px 20px', border: '1px solid #8F00CC', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', flex: 1 }}>Start Backup (Enter)</button>
                  <button style={{ background: 'transparent', color: '#8F00CC', border: '1px solid #8F00CC', padding: '12px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', flex: 1 }}>Restore Data</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'IMPORT':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '25px' }}>
            <div className="report-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: '#8F00CC', margin: 0, fontWeight: '800' }}><i className="fas fa-file-import" style={{ marginRight: '8px' }}></i> Import & Export Data</h3>
                <p style={{ margin: '5px 0 0 0', color: '#636c76', fontSize: '13px' }}>Masters & Vouchers Sync</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Esc: Back</button>
            </div>
            <div className="ledger-split" style={{ marginTop: '20px' }}>
              <div className="ledger-side" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <div className="ledger-head" style={{ background: '#efe0ff', color: '#8F00CC', padding: '10px 15px', fontWeight: 'bold', borderRadius: '6px 6px 0 0' }}>Import Data</div>
                <div className="ledger-body" style={{ padding: '15px', background: '#fff', borderRadius: '0 0 6px 6px' }}>
                  <div className="ledger-row fw-bold" style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #e2e8f0', color: '#000000' }}><span>Masters (XML)</span></div>
                  <div className="ledger-row fw-bold" style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #e2e8f0', color: '#000000' }}><span>Vouchers (XML)</span></div>
                  <div className="ledger-row fw-bold" style={{ cursor: 'pointer', padding: '10px', color: '#000000' }}><span>Bank Statement (Excel/CSV)</span></div>
                </div>
              </div>
              <div className="ledger-side" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <div className="ledger-head" style={{ background: '#efe0ff', color: '#8F00CC', padding: '10px 15px', fontWeight: 'bold', borderRadius: '6px 6px 0 0' }}>Export Data</div>
                <div className="ledger-body" style={{ padding: '15px', background: '#fff', borderRadius: '0 0 6px 6px' }}>
                  <div className="ledger-row fw-bold" style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #e2e8f0', color: '#000000' }}><span>All Masters</span></div>
                  <div className="ledger-row fw-bold" style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #e2e8f0', color: '#000000' }}><span>Day Book Vouchers</span></div>
                  <div className="ledger-row fw-bold" style={{ cursor: 'pointer', padding: '10px', color: '#000000' }}><span>Tally e-Way Bill Data</span></div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'PROFILE':
        return (
          <div className="report-card animate-fade profile-report-wrapper" style={{ gridColumn: '1 / -1', padding: 0, overflow: 'hidden' }}>
            <div className="profile-container">
              {/* Profile Local Sidebar */}
              <div className="profile-sidebar">
                <div className="profile-sidebar-header">
                  <h3>Accounts</h3>
                </div>
                <nav className="profile-nav">
                  <div className="profile-nav-item active">
                    <i className="fas fa-user-circle"></i> Profile
                    <div className="profile-sub-nav">
                      <span className="active">• Personal Information</span>
                      <span>Email Address</span>
                      <span>Mobile Numbers</span>
                    </div>
                  </div>
                  <div className="profile-nav-item"><i className="fas fa-shield-alt"></i> Security</div>
                  <div className="profile-nav-item"><i className="fas fa-user-shield"></i> Multi-Factor Auth</div>
                  <div className="profile-nav-item"><i className="fas fa-cog"></i> Settings</div>
                  <div className="profile-nav-item"><i className="fas fa-history"></i> Sessions</div>
                  <div className="profile-nav-item"><i className="fas fa-users"></i> Groups</div>
                  <div className="profile-nav-item"><i className="fas fa-lock"></i> Privacy</div>
                  <div className="profile-nav-item"><i className="fas fa-balance-scale"></i> Compliance</div>
                </nav>
              </div>

              {/* Profile Main Content */}
              <div className="profile-main">
                <div className="profile-main-header">
                  <h2>Profile</h2>
                  <button onClick={() => setActiveTab('DASHBOARD')} className="profile-back-btn"><i className="fas fa-times"></i> Esc</button>
                </div>

                <div className="profile-content-scroll">
                  {/* Hero Card */}
                  <div className="profile-hero-card">
                    <div className="profile-hero-left">
                      <div className="profile-avatar-large">
                        {user.initials}
                      </div>
                      <div className="profile-hero-info">
                        <h3>{user.name}</h3>
                        <p>{user.email}</p>
                      </div>
                    </div>
                    <button className="profile-edit-btn">Edit</button>
                  </div>

                  {/* Personal Info Card */}
                  <div className="profile-info-section">
                    <div className="profile-section-title">Personal Information</div>
                    <div className="profile-info-grid">
                      <div className="profile-info-item">
                        <label>Full Name</label>
                        <p>{user.name}</p>
                      </div>
                      <div className="profile-info-item">
                        <label>Display Name</label>
                        <p>{user.name}</p>
                      </div>
                      <div className="profile-info-item">
                        <label>Gender</label>
                        <p>I'd prefer not to say</p>
                      </div>
                      <div className="profile-info-item">
                        <label>Country/Region</label>
                        <p><span className="flag-icon">🇮🇳</span> India</p>
                      </div>
                      <div className="profile-info-item">
                        <label>State</label>
                        <p>Chhattisgarh</p>
                      </div>
                      <div className="profile-info-item">
                        <label>Language</label>
                        <p>English</p>
                      </div>
                      <div className="profile-info-item full-width">
                        <label>Time zone</label>
                        <p>(GMT +05:30) India Standard Time ( Asia/Kolkata )</p>
                      </div>
                    </div>
                  </div>

                  {/* Email Card */}
                  <div className="profile-info-section">
                    <div className="profile-section-title">My Email Addresses</div>
                    <p className="profile-section-desc">View and manage the email addresses associated with your account.</p>
                    <div className="profile-action-card">
                      <div className="profile-card-left">
                        <div className="profile-card-icon email-icon"><i className="fas fa-envelope"></i></div>
                        <div>
                          <div className="profile-card-title">{user.email}</div>
                          <div className="profile-card-subtitle">Default Email</div>
                        </div>
                      </div>
                      <div className="profile-card-right">
                        <span className="status-pill verified">Verified</span>
                      </div>
                    </div>
                    <button className="profile-add-link">+ Add Email Address</button>
                  </div>

                  {/* Mobile Card */}
                  <div className="profile-info-section">
                    <div className="profile-section-title">My Mobile Numbers</div>
                    <p className="profile-section-desc">View and manage all of the mobile numbers associated with your account.</p>
                    <div className="profile-action-card">
                      <div className="profile-card-left">
                        <div className="profile-card-icon phone-icon"><i className="fas fa-phone-alt"></i></div>
                        <div>
                          <div className="profile-card-title">+91 96315 767XX</div>
                          <div className="profile-card-subtitle">Primary Mobile</div>
                        </div>
                      </div>
                      <div className="profile-card-right">
                        <span className="status-pill verified">Verified</span>
                      </div>
                    </div>
                    <button className="profile-add-link">+ Add Mobile Number</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'GROUPS':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '25px' }}>
            <div className="report-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: '#8F00CC', margin: 0, fontWeight: '800' }}><i className="fas fa-folder" style={{ marginRight: '8px' }}></i> List of Groups</h3>
                <p style={{ margin: '5px 0 0 0', color: '#636c76', fontSize: '13px' }}>Pre-configured Accounting Groups</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Esc: Back</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
              {[
                'Sundry Debtors', 'Sundry Creditors', 'Direct Incomes', 'Indirect Incomes', 
                'Direct Expenses', 'Indirect Expenses', 'Bank Accounts', 'Cash-in-hand', 
                'Loans & Liabilities', 'Reserves & Surplus', 'Capital Account', 'Fixed Assets', 
                'Investments', 'Current Assets', 'Current Liabilities'
              ].map((g, idx) => (
                <div key={idx} style={{ padding: '15px', background: '#fdfbff', border: '1px solid #efe0ff', borderRadius: '8px', fontWeight: '600', color: '#000205', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fas fa-folder" style={{ color: '#8F00CC' }}></i>
                  <span>{g}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'VOUCHER_TYPES':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '25px' }}>
            <div className="report-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: '#8F00CC', margin: 0, fontWeight: '800' }}><i className="fas fa-file-invoice" style={{ marginRight: '8px' }}></i> Accounting Voucher Types</h3>
                <p style={{ margin: '5px 0 0 0', color: '#636c76', fontSize: '13px' }}>Configure numbering and settings for accounting vouchers</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Esc: Back</button>
            </div>

            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table className="report-table premium-table">
                <thead>
                  <tr>
                    <th>Voucher Type Name</th>
                    <th>Parent Voucher Type</th>
                    <th>Numbering Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: 'Payment', parent: 'Payment', numbering: 'Automatic', status: 'Active' },
                    { type: 'Receipt', parent: 'Receipt', numbering: 'Automatic', status: 'Active' },
                    { type: 'Contra', parent: 'Contra', numbering: 'Automatic', status: 'Active' },
                    { type: 'Journal', parent: 'Journal', numbering: 'Manual', status: 'Active' },
                    { type: 'Sales', parent: 'Sales', numbering: 'Automatic', status: 'Active' },
                    { type: 'Purchase', parent: 'Purchase', numbering: 'Automatic', status: 'Active' }
                  ].map((v, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 'bold', color: '#000000' }}>{v.type}</td>
                      <td>{v.parent}</td>
                      <td style={{ color: '#007bff', fontWeight: '600' }}>{v.numbering}</td>
                      <td><span className="status-pill verified">{v.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'STOCK_GROUPS':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '25px' }}>
            <div className="report-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: '#8F00CC', margin: 0, fontWeight: '800' }}><i className="fas fa-layer-group" style={{ marginRight: '8px' }}></i> Stock Groups</h3>
                <p style={{ margin: '5px 0 0 0', color: '#636c76', fontSize: '13px' }}>Inventory Grouping Categories</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Esc: Back</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
              {[
                { name: 'Primary', count: 12 },
                { name: 'Electronics', count: 5 },
                { name: 'Raw Materials', count: 3 },
                { name: 'Finished Goods', count: 4 },
                { name: 'Accessories', count: 2 }
              ].map((sg, idx) => (
                <div key={idx} style={{ padding: '20px', background: '#fdfbff', border: '1px solid #efe0ff', borderRadius: '10px', color: '#000205', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{sg.name}</h4>
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: 'var(--text-dim)' }}>{sg.count} Stock Items</p>
                  </div>
                  <i className="fas fa-boxes" style={{ color: '#8F00CC', fontSize: '20px', opacity: 0.5 }}></i>
                </div>
              ))}
            </div>
          </div>
        );

      case 'UOM':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '25px' }}>
            <div className="report-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: '#8F00CC', margin: 0, fontWeight: '800' }}><i className="fas fa-balance-scale-left" style={{ marginRight: '8px' }}></i> Units of Measure (UOM)</h3>
                <p style={{ margin: '5px 0 0 0', color: '#636c76', fontSize: '13px' }}>Standard units for stock verification</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Esc: Back</button>
            </div>

            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table className="report-table premium-table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Formal Name</th>
                    <th>Number of Decimal Places</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { symbol: 'Nos', name: 'Numbers', decimals: 0 },
                    { symbol: 'Pcs', name: 'Pieces', decimals: 0 },
                    { symbol: 'Kgs', name: 'Kilograms', decimals: 3 },
                    { symbol: 'Box', name: 'Boxes', decimals: 0 },
                    { symbol: 'Mtr', name: 'Meters', decimals: 2 }
                  ].map((u, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 'bold', color: '#8F00CC' }}><span className="shortcut-badge" style={{ background: '#efe0ff', color: '#8F00CC', border: '1px solid #efe0ff', margin: 0 }}>{u.symbol}</span></td>
                      <td style={{ color: '#000000', fontWeight: '600' }}>{u.name}</td>
                      <td style={{ fontWeight: 'bold', color: '#000000' }}>{u.decimals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'INV_VOUCHER_TYPES':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '25px' }}>
            <div className="report-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: '#8F00CC', margin: 0, fontWeight: '800' }}><i className="fas fa-file-invoice" style={{ marginRight: '8px' }}></i> Inventory Voucher Types</h3>
                <p style={{ margin: '5px 0 0 0', color: '#636c76', fontSize: '13px' }}>Configure settings for inventory transactions</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Esc: Back</button>
            </div>

            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table className="report-table premium-table">
                <thead>
                  <tr>
                    <th>Voucher Type Name</th>
                    <th>Voucher Type Group</th>
                    <th>Numbering Method</th>
                    <th>Prevent Duplicates</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: 'Physical Stock', group: 'Physical Stock', numbering: 'Automatic', dup: 'Yes' },
                    { type: 'Delivery Note', group: 'Delivery Note', numbering: 'Automatic', dup: 'Yes' },
                    { type: 'Receipt Note', group: 'Receipt Note', numbering: 'Automatic', dup: 'Yes' },
                    { type: 'Stock Journal', group: 'Stock Journal', numbering: 'Automatic', dup: 'Yes' }
                  ].map((v, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 'bold', color: '#000000' }}>{v.type}</td>
                      <td>{v.group}</td>
                      <td style={{ color: '#007bff', fontWeight: '600' }}>{v.numbering}</td>
                      <td style={{ color: '#28a745', fontWeight: '600' }}>{v.dup}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'INVENTORY_VOUCHERS':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '25px' }}>
            <div className="report-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: '#8F00CC', fontSize: '20px', margin: '0 0 5px 0', fontWeight: '800' }}><i className="fas fa-warehouse" style={{ marginRight: '8px' }}></i> Inventory Voucher Entry</h3>
                <span style={{ background: '#8F00CC', color: '#fff', padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>Alt+F9 : PHYSICAL STOCK</span>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Esc: Quit</button>
            </div>

            <div style={{ boxSizing: 'border-box' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={{ ...labelStyle, color: '#000000' }}>Voucher Type</label>
                  <select style={inputStyle}>
                    <option>Physical Stock (Verify Actual Qty)</option>
                    <option>Delivery Note (Sales Dispatch)</option>
                    <option>Receipt Note (Purchase Inward)</option>
                    <option>Stock Journal (Transfer between Godowns)</option>
                  </select>
                </div>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={{ ...labelStyle, color: '#000000' }}>Source Godown (From)</label>
                  <select style={inputStyle}>
                    <option>Main Store (Patna)</option>
                    <option>Warehouse A (Danapur)</option>
                    <option>Transit Godown</option>
                  </select>
                </div>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={{ ...labelStyle, color: '#000000' }}>Destination Godown (To)</label>
                  <select style={inputStyle}>
                    <option>Warehouse A (Danapur)</option>
                    <option>Main Store (Patna)</option>
                    <option>Transit Godown</option>
                  </select>
                </div>
              </div>

              <div style={{ width: '100%', overflowX: 'auto', boxSizing: 'border-box', marginBottom: '20px' }}>
                <table style={voucherTableStyle}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, width: '40%' }}>Name of Item</th>
                      <th style={{ ...thStyle, width: '20%', textAlign: 'right' }}>Quantity</th>
                      <th style={{ ...thStyle, width: '20%', textAlign: 'right' }}>Rate (₹)</th>
                      <th style={{ ...thStyle, width: '20%', textAlign: 'right', color: '#8F00CC' }}>Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdStyle}><input type="text" style={{ ...inputStyle, border: 'none', background: 'transparent' }} placeholder="Select Item..." /></td>
                      <td style={tdStyle}><input type="text" style={{ ...inputStyle, textAlign: 'right', border: 'none', background: 'transparent' }} placeholder="0" /></td>
                      <td style={tdStyle}><input type="text" style={{ ...inputStyle, textAlign: 'right', border: 'none', background: 'transparent' }} placeholder="0.00" /></td>
                      <td style={tdStyle}><input type="text" style={{ ...inputStyle, textAlign: 'right', border: 'none', background: 'transparent', fontWeight: 'bold' }} placeholder="0.00" readOnly /></td>
                    </tr>
                    <tr style={{ background: 'rgba(143,0,204,0.05)' }}>
                      <td colSpan="3" style={{ ...tdStyle, textAlign: 'right', fontWeight: '900', borderRight: 'none', color: 'var(--text-main)' }}>TOTAL VALUATION</td>
                      <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '900', fontSize: '18px', color: '#8F00CC' }}>₹ 0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', boxSizing: 'border-box' }}>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={{ ...labelStyle, color: '#000000' }}>Narration / Remarks:</label>
                  <textarea style={{ ...inputStyle, height: '50px', resize: 'none' }} placeholder="Being physical stock verification or transfer completed..."></textarea>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', boxSizing: 'border-box' }}>
                  <button style={{
                    background: '#efe0ff',
                    color: '#8F00CC',
                    padding: '10px 30px',
                    border: '1px solid #8F00CC',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>Save Voucher (Ctrl+A)</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'STOCK_SUMMARY':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '25px' }}>
            <div className="report-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: '#8F00CC', margin: 0, fontWeight: '800' }}><i className="fas fa-boxes" style={{ marginRight: '8px' }}></i> Stock Summary</h3>
                <p style={{ margin: '5px 0 0 0', color: '#636c76', fontSize: '13px' }}>Current Inventory Valuation & Stock Quantities</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Esc: Back</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div className="r-card" style={{ borderLeft: '4px solid #8F00CC' }}>
                <p>Total Stock Items</p>
                <h4 style={{ color: '#000000' }}>{dashboardData.stocks.length} Items</h4>
              </div>
              <div className="r-card" style={{ borderLeft: '4px solid #28a745' }}>
                <p>Total Stock Value</p>
                <h4 style={{ color: '#28a745' }}>₹ {dashboardData.stocks.reduce((acc, curr) => acc + (curr.openingValue || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h4>
              </div>
              <div className="r-card" style={{ borderLeft: '4px solid #007bff' }}>
                <p>Active Categories</p>
                <h4 style={{ color: '#007bff' }}>{new Set(dashboardData.stocks.map(s => s.group)).size || 1} Categories</h4>
              </div>
            </div>

            <div className="table-responsive" style={{ boxSizing: 'border-box' }}>
              <table className="report-table premium-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>UOM</th>
                    <th className="num-col">Quantity</th>
                    <th className="num-col">Average Rate (₹)</th>
                    <th className="num-col">Valuation (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.stocks.length > 0 ? (
                    dashboardData.stocks.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 'bold', color: '#000000' }}>{item.name}</td>
                        <td>{item.group}</td>
                        <td><span className="shortcut-badge sm" style={{ background: '#efe0ff', color: '#8F00CC', border: '1px solid #efe0ff' }}>{item.uom}</span></td>
                        <td className="num-col" style={{ color: '#000000' }}>{item.openingQty || 0}</td>
                        <td className="num-col" style={{ color: '#000000' }}>{(item.openingRate || 0).toFixed(2)}</td>
                        <td className="num-col highlight" style={{ color: '#8F00CC', fontWeight: 'bold' }}>₹ {(item.openingValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-dim)' }}>No Stock Items found in database. Use Inventory Info to add stock items.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'RATIO_ANALYSIS':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '25px' }}>
            <div className="report-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: '#8F00CC', margin: 0, fontWeight: '800' }}><i className="fas fa-chart-pie" style={{ marginRight: '8px' }}></i> Ratio Analysis</h3>
                <p style={{ margin: '5px 0 0 0', color: '#636c76', fontSize: '13px' }}>Key Financial Indicators & Business Ratios</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Esc: Back</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', boxSizing: 'border-box' }}>
              <div style={{ padding: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <h4 style={{ color: '#8F00CC', fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Liquidity & Working Capital Ratios</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '6px' }}>
                    <span style={{ fontWeight: 'bold', color: '#000000' }}>Current Ratio</span>
                    <span style={{ color: '#28a745', fontWeight: '800' }}>1.85 : 1 (Healthy)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '6px' }}>
                    <span style={{ fontWeight: 'bold', color: '#000000' }}>Quick / Acid Test Ratio</span>
                    <span style={{ color: '#007bff', fontWeight: '800' }}>1.45 : 1</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '6px' }}>
                    <span style={{ fontWeight: 'bold', color: '#000000' }}>Debt Equity Ratio</span>
                    <span style={{ color: '#dc3545', fontWeight: '800' }}>0.35 : 1</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px' }}>
                    <span style={{ fontWeight: 'bold', color: '#000000' }}>Proprietary Ratio</span>
                    <span style={{ color: '#4b5563', fontWeight: '800' }}>0.74 : 1</span>
                  </div>
                </div>
              </div>

              <div style={{ padding: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <h4 style={{ color: '#8F00CC', fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Profitability & Turnover Ratios</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '6px' }}>
                    <span style={{ fontWeight: 'bold', color: '#000000' }}>Gross Profit Percentage (%)</span>
                    <span style={{ color: '#28a745', fontWeight: '800' }}>24.50 %</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '6px' }}>
                    <span style={{ fontWeight: 'bold', color: '#000000' }}>Net Profit Percentage (%)</span>
                    <span style={{ color: '#007bff', fontWeight: '800' }}>12.80 %</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '6px' }}>
                    <span style={{ fontWeight: 'bold', color: '#000000' }}>Inventory Turnover Ratio</span>
                    <span style={{ color: '#e3b341', fontWeight: '800' }}>6.42 times</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px' }}>
                    <span style={{ fontWeight: 'bold', color: '#000000' }}>Return on Investment (ROI)</span>
                    <span style={{ color: '#8F00CC', fontWeight: '800' }}>16.80 %</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'DISPLAY_MENU':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '800px', margin: '20px auto', boxSizing: 'border-box', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '25px' }}>
            <div className="report-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '20px', color: '#8F00CC', margin: 0, fontWeight: '800' }}><i className="fas fa-folder-open" style={{ marginRight: '8px' }}></i> Display Menu</h3>
                <p style={{ margin: '5px 0 0 0', color: '#636c76', fontSize: '13px' }}>Gateway of Tally > Display More Reports</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Esc: Quit</button>
            </div>

            <div style={{ boxSizing: 'border-box' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ padding: '8px 15px', fontSize: '11px', fontWeight: '800', color: '#8F00CC', textTransform: 'uppercase', letterSpacing: '1.5px', background: '#fdfbff', borderRadius: '4px' }}>Accounting Reports</div>
                  <div onClick={() => setActiveTab('BS')} className="company-list-item" style={{ padding: '12px 18px', cursor: 'pointer' }}><span>Trial Balance</span><i className="fas fa-chevron-right" style={{ fontSize: '12px' }}></i></div>
                  <div onClick={() => setActiveTab('DASHBOARD')} className="company-list-item" style={{ padding: '12px 18px', cursor: 'pointer' }}><span>Day Book</span><i className="fas fa-chevron-right" style={{ fontSize: '12px' }}></i></div>
                  <div onClick={() => setActiveTab('DASHBOARD')} className="company-list-item" style={{ padding: '12px 18px', cursor: 'pointer' }}><span>Cash / Bank Book</span><i className="fas fa-chevron-right" style={{ fontSize: '12px' }}></i></div>
                  <div onClick={() => setActiveTab('GST')} className="company-list-item" style={{ padding: '12px 18px', cursor: 'pointer' }}><span>GST Reports / GSTR-1</span><i className="fas fa-chevron-right" style={{ fontSize: '12px' }}></i></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ padding: '8px 15px', fontSize: '11px', fontWeight: '800', color: '#8F00CC', textTransform: 'uppercase', letterSpacing: '1.5px', background: '#fdfbff', borderRadius: '4px' }}>Inventory & Statements</div>
                  <div onClick={() => setActiveTab('STOCK_SUMMARY')} className="company-list-item" style={{ padding: '12px 18px', cursor: 'pointer' }}><span>Stock Summary</span><i className="fas fa-chevron-right" style={{ fontSize: '12px' }}></i></div>
                  <div onClick={() => setActiveTab('RATIO_ANALYSIS')} className="company-list-item" style={{ padding: '12px 18px', cursor: 'pointer' }}><span>Ratio Analysis</span><i className="fas fa-chevron-right" style={{ fontSize: '12px' }}></i></div>
                  <div onClick={() => setActiveTab('PRINT')} className="company-list-item" style={{ padding: '12px 18px', cursor: 'pointer' }}><span>Print & Export Setup</span><i className="fas fa-chevron-right" style={{ fontSize: '12px' }}></i></div>
                  <div onClick={() => setActiveTab('BACKUP')} className="company-list-item" style={{ padding: '12px 18px', cursor: 'pointer' }}><span>Backup Configuration</span><i className="fas fa-chevron-right" style={{ fontSize: '12px' }}></i></div>
                </div>
              </div>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className={`app-wrapper ${isDarkMode ? '' : 'light-mode'}`}>

      <aside className="sidebar">
        <div className="sidebar-header" style={{ padding: '40px 25px', borderBottom: '1px solid rgba(143, 0, 204, 0.05)', background: '#fff' }}>
          <img src={logoImage} alt="BIREENA Tally X" className="app-logo" style={{ filter: 'brightness(0) saturate(100%) invert(18%) sepia(88%) saturate(5185%) hue-rotate(275deg) brightness(80%) contrast(115%)' }} />
        </div>

        <nav className="nav-group">
          {!user.companyName ? (
            <>
              <div className="nav-label">Gateway of TallyX</div>
              <MenuItem icon="fas fa-list" label="Select Company" active={activeTab === 'SELECT_COMPANY'} onClick={() => { fetchCompanies(); setActiveTab('SELECT_COMPANY'); }} />
              <MenuItem icon="fas fa-plus-circle" label="Create Company" active={activeTab === 'COMPANY'} onClick={() => setActiveTab('COMPANY')} />
              <MenuItem icon="fas fa-sync" label="Backup" active={activeTab === 'BACKUP'} onClick={() => setActiveTab('BACKUP')} />
              <MenuItem icon="fas fa-undo" label="Restore" active={activeTab === 'RESTORE'} onClick={() => alert('Restore action placeholder')} />
              <MenuItem icon="fas fa-sign-out-alt" label="Quit" onClick={handleLogout} />
            </>
          ) : (
            <>
              <div className="nav-label">Main</div>
              <MenuItem icon="fas fa-home" label="Home" active={activeTab === 'DASHBOARD'} onClick={() => setActiveTab('DASHBOARD')} />

              <div className="nav-label">Master</div>
              
              <div className={`menu-item ${openMenus.accountsInfo ? 'open' : ''}`}>
                <button 
                  className={`nav-btn ${['GROUPS', 'LEDGER', 'VOUCHER_TYPES'].includes(activeTab) ? 'active' : ''}`} 
                  onClick={() => toggleMenu('accountsInfo')}
                >
                  <i className="fas fa-book"></i> Accounts Info
                  <i className={`fas fa-chevron-${openMenus.accountsInfo ? 'up' : 'down'}`} style={{ marginLeft: 'auto', fontSize: '10px' }}></i>
                </button>
                <div className="sub-menu">
                  <button className={`sub-btn ${activeTab === 'GROUPS' ? 'active' : ''}`} onClick={() => setActiveTab('GROUPS')}>
                    Groups
                  </button>
                  <button className={`sub-btn ${activeTab === 'LEDGER' ? 'active' : ''}`} onClick={() => setActiveTab('LEDGER')}>
                    Ledgers
                  </button>
                  <button className={`sub-btn ${activeTab === 'VOUCHER_TYPES' ? 'active' : ''}`} onClick={() => setActiveTab('VOUCHER_TYPES')}>
                    Voucher Type
                  </button>
                  <button className="sub-btn" onClick={() => setOpenMenus(prev => ({ ...prev, accountsInfo: false }))} style={{ marginTop: '5px', borderTop: '1px solid rgba(143, 0, 204, 0.05)' }}>
                    Quit
                  </button>
                </div>
              </div>
              
              <div className={`menu-item ${openMenus.inventoryInfo ? 'open' : ''}`}>
                <button 
                  className={`nav-btn ${['STOCK_GROUPS', 'STOCK', 'UOM', 'INV_VOUCHER_TYPES'].includes(activeTab) ? 'active' : ''}`} 
                  onClick={() => toggleMenu('inventoryInfo')}
                >
                  <i className="fas fa-boxes"></i> Inventory Info
                  <i className={`fas fa-chevron-${openMenus.inventoryInfo ? 'up' : 'down'}`} style={{ marginLeft: 'auto', fontSize: '10px' }}></i>
                </button>
                <div className="sub-menu">
                  <button className={`sub-btn ${activeTab === 'STOCK_GROUPS' ? 'active' : ''}`} onClick={() => setActiveTab('STOCK_GROUPS')}>
                    Stock Groups
                  </button>
                  <button className={`sub-btn ${activeTab === 'STOCK' ? 'active' : ''}`} onClick={() => setActiveTab('STOCK')}>
                    Stock Items
                  </button>
                  <button className={`sub-btn ${activeTab === 'UOM' ? 'active' : ''}`} onClick={() => setActiveTab('UOM')}>
                    Units of Measures
                  </button>
                  <button className={`sub-btn ${activeTab === 'INV_VOUCHER_TYPES' ? 'active' : ''}`} onClick={() => setActiveTab('INV_VOUCHER_TYPES')}>
                    Vouchers Types
                  </button>
                  <button className="sub-btn" onClick={() => setOpenMenus(prev => ({ ...prev, inventoryInfo: false }))} style={{ marginTop: '5px', borderTop: '1px solid rgba(143, 0, 204, 0.05)' }}>
                    Quit
                  </button>
                </div>
              </div>

              <div className="nav-label">Transactions</div>
              <div className={`menu-item ${openMenus.coreTransactions ? 'open' : ''}`}>
                <button className={`nav-btn ${['JOURNAL', 'CONTRA', 'PAYMENT', 'RECEIPT', 'SALES', 'PURCHASE'].includes(activeTab) ? 'active' : ''}`} onClick={() => toggleMenu('coreTransactions')}>
                  <i className="fas fa-receipt"></i> Accounting Vouchers
                  <i className={`fas fa-chevron-${openMenus.coreTransactions ? 'up' : 'down'}`} style={{ marginLeft: 'auto', fontSize: '10px' }}></i>
                </button>
                <div className="sub-menu">
                  <button className={`sub-btn ${activeTab === 'JOURNAL' ? 'active' : ''}`} onClick={() => setActiveTab('JOURNAL')}>Journal Entry</button>
                  <button className={`sub-btn ${activeTab === 'CONTRA' ? 'active' : ''}`} onClick={() => setActiveTab('CONTRA')}>Contra Entry (F4)</button>
                  <button className={`sub-btn ${activeTab === 'PAYMENT' ? 'active' : ''}`} onClick={() => setActiveTab('PAYMENT')}>Payment (F5)</button>
                  <button className={`sub-btn ${activeTab === 'RECEIPT' ? 'active' : ''}`} onClick={() => setActiveTab('RECEIPT')}>Receipt (F6)</button>
                  <button className={`sub-btn ${activeTab === 'SALES' ? 'active' : ''}`} onClick={() => setActiveTab('SALES')}>Sales (F8)</button>
                  <button className={`sub-btn ${activeTab === 'PURCHASE' ? 'active' : ''}`} onClick={() => setActiveTab('PURCHASE')}>Purchase (F9)</button>
                </div>
              </div>

              <MenuItem icon="fas fa-dolly" label="Inventory Vouchers" active={activeTab === 'INVENTORY_VOUCHERS'} onClick={() => setActiveTab('INVENTORY_VOUCHERS')} />

              <div className="nav-label">Utilities</div>
              <MenuItem icon="fas fa-file-import" label="Import Data" active={activeTab === 'IMPORT'} onClick={() => setActiveTab('IMPORT')} />
              <MenuItem icon="fas fa-university" label="Banking" active={activeTab === 'BANKING'} onClick={() => setActiveTab('BANKING')} />

              <div className="nav-label">Reports</div>
              <MenuItem icon="fas fa-balance-scale" label="Balance Sheet" active={activeTab === 'BS'} onClick={() => setActiveTab('BS')} />
              <MenuItem icon="fas fa-chart-line" label="Profit & Loss A/C" active={activeTab === 'PL'} onClick={() => setActiveTab('PL')} />
              <MenuItem icon="fas fa-box-open" label="Stock Summary" active={activeTab === 'STOCK_SUMMARY'} onClick={() => setActiveTab('STOCK_SUMMARY')} />
              <MenuItem icon="fas fa-percent" label="Ratio Analysis" active={activeTab === 'RATIO_ANALYSIS'} onClick={() => setActiveTab('RATIO_ANALYSIS')} />
              <MenuItem icon="fas fa-folder-open" label="Display" active={activeTab === 'DISPLAY_MENU'} onClick={() => setActiveTab('DISPLAY_MENU')} />
              <MenuItem icon="fas fa-sign-out-alt" label="Quit" onClick={() => {
                localStorage.removeItem('tallyx_company_name');
                setUser(prev => ({ ...prev, companyName: '' }));
                setActiveTab('GATEWAY');
              }} />
            </>
          )}

          <div style={{
            padding: '24px 25px',
            marginTop: 'auto',
            borderTop: '1px solid rgba(143, 0, 204, 0.08)',
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #8F00CC, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: '900',
                boxShadow: '0 4px 12px rgba(143, 0, 204, 0.2)'
              }}>{user.initials}</div>
              <div>
                <p style={{ fontSize: '13.5px', fontWeight: '800', color: '#000205' }}>{user.name}</p>
                <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Standard Edition</p>
              </div>
              <i className="fas fa-sign-out-alt" style={{ marginLeft: 'auto', color: '#8F00CC', cursor: 'pointer', fontSize: '18px' }} onClick={handleLogout}></i>
            </div>
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-nav">
          <div className="command-center">
            <i className="fas fa-bolt" style={{ color: 'var(--tally-yellow)' }}></i>
            <input type="text" placeholder="Go To... (Alt+G)" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button className="theme-toggle" onClick={toggleTheme}>
              <i className={isDarkMode ? "fas fa-moon" : "fas fa-sun"}></i>
              <span>{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
            </button>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', fontWeight: '800' }}>{user.companyName || 'No Company Selected'}</p>
              <p style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: '700' }}>FY 2025-26 | Patna</p>
            </div>
            <img src={`https://ui-avatars.com/api/?name=Admin&background=8F00CC&color=fff&bold=true`}
              style={{ width: '42px', borderRadius: '50%', border: '2px solid var(--border)' }} alt="User" />
          </div>
        </header>

        <div className="dashboard-container">
          {activeTab === 'DASHBOARD' ? (
            <>
              {(() => {
                const recAmt = metrics.receivables > 0 ? metrics.receivables : 384500;
                const recOnTime = recAmt * 0.89;
                const recOverdue = recAmt * 0.11;
                const recData = [
                  { name: 'On Time', value: recOnTime, color: '#8F00CC' },
                  { name: 'Overdue', value: recOverdue, color: '#ffc107' }
                ];

                const payAmt = metrics.payables > 0 ? metrics.payables : 254500;
                const payPending = payAmt * 0.95;
                const payCritical = payAmt * 0.05;
                const payData = [
                  { name: 'Pending', value: payPending, color: 'url(#pieGradient)' },
                  { name: 'Critical', value: payCritical, color: '#ff4d4f' }
                ];

                return (
                  <>
                    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.25) 0%, rgba(236, 72, 153, 0.25) 50%, rgba(143, 0, 204, 0.25) 100%)', border: '1px solid rgba(143, 0, 204, 0.2)' }}>
                      <div className="card-title">Total Receivables <i className="fas fa-arrow-trend-up" style={{ color: 'var(--accent-green)' }}></i></div>
                      <div className="insights-grid">
                        <div style={{ width: '90px', height: '90px' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={recData} innerRadius={30} outerRadius={45} dataKey="value" stroke="none">
                                {recData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                              </Pie>
                              <Tooltip contentStyle={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: isDarkMode ? '#161b22' : '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} itemStyle={{ color: isDarkMode ? '#fff' : '#000' }} formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div>
                          <div className="big-amt">₹ {recAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                            <span style={{ color: '#8F00CC' }}><i className="fas fa-check-circle"></i> On Time: <b>₹{recOnTime.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</b></span>
                            <span style={{ color: 'var(--tally-yellow)' }}><i className="fas fa-exclamation-circle"></i> Overdue: <b>₹{recOverdue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</b></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.25) 0%, rgba(236, 72, 153, 0.25) 50%, rgba(143, 0, 204, 0.25) 100%)', border: '1px solid rgba(143, 0, 204, 0.2)' }}>
                      <div className="card-title">Total Payables <i className="fas fa-arrow-trend-down" style={{ color: 'var(--accent-red)' }}></i></div>
                      <div className="insights-grid">
                        <div style={{ width: '90px', height: '90px' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <defs>
                                <linearGradient id="pieGradient" x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="0%" stopColor="#fb923c" />
                                  <stop offset="50%" stopColor="#ec4899" />
                                  <stop offset="100%" stopColor="#8F00CC" />
                                </linearGradient>
                              </defs>
                              <Pie data={payData} innerRadius={30} outerRadius={45} dataKey="value" stroke="none">
                                {payData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                              </Pie>
                              <Tooltip contentStyle={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: isDarkMode ? '#161b22' : '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} itemStyle={{ color: isDarkMode ? '#fff' : '#000' }} formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div>
                          <div className="big-amt">₹ {payAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                            <span style={{ color: 'var(--text-dim)' }}><i className="fas fa-clock"></i> Pending: <b>₹{payPending.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</b></span>
                            <span style={{ color: 'var(--accent-red)' }}><i className="fas fa-bolt"></i> Critical: <b>₹{payCritical.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</b></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}

              <div className="card cash-flow-container" style={{ display: 'flex', gap: '20px', minHeight: '350px', gridColumn: 'span 2' }}>
                <div style={{ flex: 3, display: 'flex', flexDirection: 'column' }}>
                  <div className="card-title" style={{ marginBottom: '10px' }}>CASH FLOW</div>
                  <div style={{ flex: 1, width: '100%', minHeight: '280px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={(() => {
                        const data = [];
                        // 120 points mimicking CNN Money Market pattern
                        for (let i = 0; i < 120; i++) {
                          let v;
                          if (i < 5) v = 17300 - (i * 100); // Initial start and drop
                          else if (i < 15) v = 16800 + Math.random() * 200; // Low dip
                          else if (i < 80) v = 16900 + Math.random() * 300; // Long steady low but jagged
                          else if (i < 100) v = 17200 + (i - 80) * 20 + Math.random() * 200; // Start of sharp rise
                          else v = 17800 + (i - 100) * 10 + Math.random() * 250; // Final sharp multi-step peak
                          data.push({ name: i, v: Math.round(v) });
                        }
                        return data;
                      })()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={isDarkMode ? "#30363d" : "#cbd5e1"} />
                        <XAxis dataKey="name" hide={true} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: isDarkMode ? '#8b949e' : '#64748b' }} domain={[16500, 18500]} tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`} dx={-10} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDarkMode ? '#161b22' : '#ffffff',
                            border: `1px solid ${isDarkMode ? '#30363d' : '#e2e8f0'}`,
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                          }}
                          itemStyle={{ color: isDarkMode ? '#e6edf3' : '#0f172a', fontWeight: 'bold' }}
                          labelFormatter={() => 'Cash Flow Trace'}
                          formatter={(v) => [`₹${v.toLocaleString()}`, 'Volume']}
                        />
                        <Area type="linear" dataKey="v" stroke="#8F00CC" strokeWidth={1} fillOpacity={1} fill="#8F00CC" animationDuration={800} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ flex: 1.2, borderLeft: '1px solid var(--border)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '15px' }}>
                  <div style={{ textAlign: 'right' }}><p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Cash as on 01-04-23</p><p style={{ fontSize: '16px', fontWeight: '800' }}>₹ 0.00</p></div>
                  <div style={{ textAlign: 'right' }}><p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Incoming</p><p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent-green)' }}>₹ {metrics.cashIn.toLocaleString('en-IN', { minimumFractionDigits: 2 })} +</p></div>
                  <div style={{ textAlign: 'right' }}><p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Outgoing</p><p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent-red)' }}>₹ {metrics.cashOut.toLocaleString('en-IN', { minimumFractionDigits: 2 })} -</p></div>
                  <div style={{ textAlign: 'right', borderTop: '1px solid var(--border)', paddingTop: '10px' }}><p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Cash Flow Balance</p><p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent-blue)' }}>₹ {metrics.cash.toLocaleString('en-IN', { minimumFractionDigits: 2 })} =</p></div>
                </div>
              </div>
            </>
          ) : (
            renderReport()
          )}
        </div>
      </main>

      {/* 🚀 ADVANCED SHORTCUT HUD (Elite Modern) */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(143, 0, 204, 0.15)',
        borderRadius: '16px',
        padding: '12px 24px',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        boxShadow: '0 10px 40px rgba(143, 0, 204, 0.12)',
        zIndex: 1000,
        opacity: activeTab === 'DASHBOARD' && !openMenus.accountsInfo ? 0.3 : 1,
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8F00CC', fontWeight: '800', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <i className="fas fa-keyboard"></i> Live Shortcuts:
        </div>
        
        <div style={{ height: '20px', width: '1px', background: 'rgba(143, 0, 204, 0.2)' }}></div>

        <div style={{ display: 'flex', gap: '15px' }}>
          {openMenus.accountsInfo ? (
            <>
              <HUDKey k="C" label="Create" />
              <HUDKey k="D" label="Display" />
              <HUDKey k="A" label="Alter" />
              <HUDKey k="Q" label="Close" color="#ff4d4d" />
            </>
          ) : activeTab === 'DASHBOARD' ? (
            <>
              <HUDKey k="Alt+C" label="Quick Ledger" />
              <HUDKey k="F1-F12" label="Modules" />
              <HUDKey k="G" label="Go To" />
            </>
          ) : (
             <>
               <HUDKey k="Ctrl+A" label="Accept / Save" color="#8F00CC" />
               <HUDKey k="Esc" label="Back to Menu" color="#ff4d4d" />
             </>
          )}
        </div>
      </div>
    </div>
  );
};

const HUDKey = ({ k, label, color = '#333' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
    <kbd style={{
      background: 'linear-gradient(180deg, #fff 0%, #f0f0f0 100%)',
      border: '1px solid #ccc',
      borderBottom: '3px solid #bbb',
      borderRadius: '4px',
      padding: '2px 6px',
      fontSize: '10px',
      fontWeight: '900',
      color: color,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>{k}</kbd>
    <span style={{ fontSize: '11px', fontWeight: '600', color: '#666' }}>{label}</span>
  </div>
);

const MenuItem = ({ icon, label, shortcut, active, onClick }) => (
  <div className="menu-item">
    <button className={`nav-btn ${active ? 'active' : ''}`} onClick={onClick}>
      <i className={icon}></i> {label}
    </button>
  </div>
);

export default Dashboard;
