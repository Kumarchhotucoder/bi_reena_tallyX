import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';
import logoImage from '../../assets/logo.jpeg';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [openMenus, setOpenMenus] = useState({ coreTransactions: true });
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [dashboardData, setDashboardData] = useState({ ledgers: [], stocks: [], vouchers: [] });
  const [metrics, setMetrics] = useState({ receivables: 0, payables: 0, cash: 0, cashIn: 0, cashOut: 0 });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [settingsModalTitle, setSettingsModalTitle] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const profileRef = useRef(null);
  const [user, setUser] = useState({ name: 'Admin User', email: 'admin@bireena.com', initials: 'AD', companyName: 'My Company' });

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
          fetch('http://localhost:5001/api/ledgers', { headers }),
          fetch('http://localhost:5001/api/stocks', { headers }),
          fetch('http://localhost:5001/api/vouchers', { headers })
        ]);
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
  }, []);


  // Keyboard Shortcut Handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      const key = e.key;
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
      const response = await fetch('http://localhost:5001/api/vouchers', {
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

  const renderReport = () => {
    switch(activeTab) {
      
      // --- 🚀 NEW SAANDAR SCREENS (Fixed Alignment & Detailed) ---

      case 'SALES':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
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
            
            <div style={{ padding: '20px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderTop: 'none', boxSizing: 'border-box' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={labelStyle}><span>Party A/c Name</span> <span style={{color: 'var(--accent-blue)'}}>+ Alt C</span></label>
                  <select style={inputStyle}><option>Rahul Traders (GST: 10AAAAA1234A1Z1)</option><option>Cash</option></select>
                </div>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={labelStyle}>Sales Ledger</label>
                  <select style={inputStyle}><option>Sales - Local @ 18%</option><option>Sales - Interstate @ 18%</option></select>
                </div>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={labelStyle}>Place of Supply</label>
                  <input type="text" style={inputStyle} defaultValue="10 - Bihar" />
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
                      <th style={{...thStyle, width: '25%', textAlign: 'right', color: 'var(--accent-blue)'}}>Amount (₹)</th>
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
                  <textarea style={{...inputStyle, height: '50px', resize: 'none'}} placeholder="Being goods sold on credit..."></textarea>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', boxSizing: 'border-box' }}>
                  <button style={{ background: 'linear-gradient(135deg, #2f81f7 0%, #1a62cc 100%)', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    <i className="fas fa-check-circle"></i> Save (Ctrl+A)
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'PURCHASE':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div className="report-header" style={{ background: 'linear-gradient(90deg, rgba(40,167,69,0.1) 0%, transparent 100%)', borderLeft: '4px solid var(--accent-green)', padding: '15px 20px' }}>
              <div>
                <h3 style={{color: 'var(--accent-green)', fontSize: '20px', margin: '0 0 5px 0'}}><i className="fas fa-shopping-basket"></i> Purchase Voucher</h3>
                <span style={{ background: 'var(--accent-green)', color: '#fff', padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>F9 : VOUCHER</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '5px' }}>
                    <input type="text" style={{...inputStyle, width: '130px', padding: '6px', fontSize: '13px'}} placeholder="Sup. Inv No." />
                    <input type="date" style={{...inputStyle, width: '130px', padding: '6px', fontSize: '13px'}} defaultValue="2025-04-01" />
                </div>
                <button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn" style={{marginTop: '5px'}}><i className="fas fa-times"></i> Esc: Quit</button>
              </div>
            </div>
            
            <div style={{ padding: '20px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderTop: 'none', boxSizing: 'border-box' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={labelStyle}><span>Party A/c Name</span></label>
                  <select style={inputStyle}><option>XYZ Suppliers (Creditor)</option><option>Cash</option></select>
                </div>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={labelStyle}>Purchase Ledger</label>
                  <select style={inputStyle}><option>Purchase Accounts @ 18%</option></select>
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
                  <textarea style={{...inputStyle, height: '50px', resize: 'none'}} placeholder="Being goods purchased..."></textarea>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', boxSizing: 'border-box' }}>
                  <button style={{ background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    <i className="fas fa-save"></i> Save (Ctrl+A)
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
                <h3 style={{fontSize: '20px'}}><i className="fas fa-building" style={{color: '#2f81f7'}}></i> Company Configuration (Master Setup)</h3>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc: Quit</button>
            </div>
            
            <div style={{ padding: '20px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '6px', marginTop: '20px', boxSizing: 'border-box' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', boxSizing: 'border-box' }}>
                
                <div style={{boxSizing: 'border-box'}}>
                  <h4 style={{ color: 'var(--accent-blue)', marginBottom: '15px' }}>Directory & Name</h4>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={labelStyle}>Company Name</label>
                    <input type="text" style={{...inputStyle, fontWeight: 'bold'}} placeholder="e.g. Manish Pvt Ltd" autoFocus />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={labelStyle}>Registered Address</label>
                    <textarea style={{...inputStyle, resize: 'none', height: '60px'}}></textarea>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={labelStyle}>State</label>
                      <select style={inputStyle}><option>Bihar</option><option>Delhi</option></select>
                    </div>
                    <div>
                      <label style={labelStyle}>PIN Code</label>
                      <input type="text" style={inputStyle} placeholder="800001" />
                    </div>
                  </div>
                </div>

                <div style={{boxSizing: 'border-box'}}>
                  <h4 style={{ color: 'var(--accent-blue)', marginBottom: '15px' }}>Compliance & Books</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                      <label style={labelStyle}>Financial Year from</label>
                      <input type="date" style={inputStyle} defaultValue="2025-04-01" />
                    </div>
                    <div>
                      <label style={labelStyle}>Books beginning from</label>
                      <input type="date" style={inputStyle} defaultValue="2025-04-01" />
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <label style={labelStyle}>GSTIN / UIN</label>
                    <input type="text" style={{...inputStyle, textTransform: 'uppercase'}} placeholder="22AAAAA0000A1Z5" />
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <label style={labelStyle}>PAN / IT No.</label>
                    <input type="text" style={{...inputStyle, textTransform: 'uppercase'}} placeholder="ABCDE1234F" />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                <button style={{ background: 'linear-gradient(135deg, #2f81f7 0%, #1a62cc 100%)', color: 'white', padding: '10px 30px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Accept (Ctrl+A)
                </button>
              </div>
            </div>
          </div>
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

            <div style={{ padding: '20px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '6px', marginTop: '20px', maxWidth: '850px', margin: '20px auto 0', boxSizing: 'border-box' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', boxSizing: 'border-box' }}>
                
                <div>
                  <label style={labelStyle}>Name of Ledger</label>
                  <input type="text" style={{...inputStyle, fontSize: '16px', fontWeight: 'bold'}} placeholder="e.g. Ramesh & Co." autoFocus />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', boxSizing: 'border-box' }}>
                  <div style={{boxSizing: 'border-box'}}>
                    <label style={labelStyle}>Under (Group Head)</label>
                    <select style={inputStyle}>
                      <option>Sundry Debtors</option>
                      <option>Sundry Creditors</option>
                      <option>Sales Accounts</option>
                    </select>
                  </div>
                  <div style={{boxSizing: 'border-box'}}>
                    <label style={labelStyle}>Maintain balances bill-by-bill</label>
                    <select style={inputStyle}>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', boxSizing: 'border-box' }}>
                  <div style={{boxSizing: 'border-box'}}>
                    <label style={labelStyle}>Address / State</label>
                    <textarea style={{...inputStyle, resize: 'none', height: '50px', marginBottom: '10px'}}></textarea>
                    <input type="text" style={inputStyle} placeholder="State" />
                  </div>
                  <div style={{boxSizing: 'border-box'}}>
                    <label style={labelStyle}>Tax Registration (GSTIN)</label>
                    <select style={{...inputStyle, marginBottom: '10px'}}><option>Regular</option><option>Unregistered</option></select>
                    <input type="text" style={{...inputStyle, textTransform: 'uppercase'}} placeholder="Format: 22AAAAA0000A1Z5" />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(40,167,69,0.05)', padding: '15px', borderRadius: '6px', border: '1px solid rgba(40,167,69,0.2)', boxSizing: 'border-box' }}>
                   <label style={{...labelStyle, margin: 0, color: 'var(--accent-green)'}}>Opening Balance</label>
                   <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input type="text" style={{...inputStyle, width: '150px', textAlign: 'right', fontWeight: 'bold', margin: 0}} placeholder="0.00" />
                      <select style={{...inputStyle, width: '70px', margin: 0}}>
                        <option>Dr</option><option>Cr</option>
                      </select>
                   </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button style={{ background: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)', color: '#000', padding: '10px 30px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Save Ledger (Ctrl+A)
                </button>
              </div>
            </div>
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

            <div style={{ padding: '20px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '6px', marginTop: '20px', maxWidth: '850px', margin: '20px auto 0', boxSizing: 'border-box' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', boxSizing: 'border-box' }}>
                
                <div>
                  <label style={labelStyle}>Name of Stock Item</label>
                  <input type="text" style={{...inputStyle, fontSize: '16px', fontWeight: 'bold'}} placeholder="e.g. Dell Inspiron 15" autoFocus />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{boxSizing: 'border-box'}}>
                    <label style={labelStyle}>Under (Category / Group)</label>
                    <select style={inputStyle}><option>Primary</option><option>Electronics</option></select>
                  </div>
                  <div style={{boxSizing: 'border-box'}}>
                    <label style={labelStyle}>Units of Measure (UOM)</label>
                    <select style={inputStyle}><option>Nos (Numbers)</option><option>Pcs (Pieces)</option></select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', boxSizing: 'border-box' }}>
                  <div style={{boxSizing: 'border-box'}}>
                     <label style={labelStyle}>HSN / SAC Code</label>
                     <input type="text" style={{...inputStyle, marginBottom: '10px'}} placeholder="e.g. 8471" />
                     <label style={labelStyle}>Taxability</label>
                     <select style={inputStyle}><option>Taxable (18%)</option><option>Exempt</option></select>
                  </div>
                  <div style={{boxSizing: 'border-box'}}>
                     <label style={labelStyle}>Costing Method</label>
                     <select style={{...inputStyle, marginBottom: '10px'}}><option>Average Cost</option><option>FIFO</option></select>
                     <label style={labelStyle}>Maintain in Batches?</label>
                     <select style={inputStyle}><option>No</option><option>Yes</option></select>
                  </div>
                </div>

                <div style={{ marginTop: '10px', background: 'rgba(40,167,69,0.05)', padding: '15px', borderRadius: '6px', border: '1px solid rgba(40,167,69,0.2)', boxSizing: 'border-box' }}>
                  <label style={{...labelStyle, color: 'var(--accent-green)', marginBottom: '10px'}}>Opening Balance</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', boxSizing: 'border-box' }}>
                    <div style={{boxSizing: 'border-box'}}>
                      <label style={{...labelStyle, fontSize: '11px'}}>Quantity</label>
                      <input type="text" style={{...inputStyle, textAlign: 'right'}} placeholder="0" />
                    </div>
                    <div style={{boxSizing: 'border-box'}}>
                      <label style={{...labelStyle, fontSize: '11px'}}>Rate (₹)</label>
                      <input type="text" style={{...inputStyle, textAlign: 'right'}} placeholder="0.00" />
                    </div>
                    <div style={{boxSizing: 'border-box'}}>
                      <label style={{...labelStyle, fontSize: '11px'}}>Total Value (₹)</label>
                      <input type="text" style={{...inputStyle, textAlign: 'right', background: 'rgba(0,0,0,0.1)'}} placeholder="0.00" readOnly />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button style={{ background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)', color: '#fff', padding: '10px 30px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Save Item (Ctrl+A)
                </button>
              </div>
            </div>
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
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
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
            
            <div style={{ padding: '20px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderTop: 'none', boxSizing: 'border-box' }}>
              {activeTab !== 'JOURNAL' && (
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '6px', marginBottom: '20px', boxSizing: 'border-box' }}>
                  <label style={{...labelStyle, color: vColor2}}>Account (Cash / Bank)</label>
                  <select style={{...inputStyle, fontSize: '16px', fontWeight: 'bold'}}><option>Cash</option><option>HDFC Bank Current A/c</option></select>
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
                      <td style={tdStyle}><select style={{...inputStyle, border:'none', background:'transparent'}}><option>Dr</option><option>Cr</option></select></td>
                      <td style={tdStyle}>
                        <input type="text" style={{...inputStyle, border:'none', background:'transparent'}} placeholder="Select Ledger..." />
                        <div style={{fontSize: '11px', color: 'var(--text-dim)', paddingLeft: '12px'}}>Cur Bal: ₹ 0.00</div>
                      </td>
                      <td style={tdStyle}><input type="text" style={{...inputStyle, border:'none', background:'transparent', textAlign: 'right'}} placeholder="0.00" /></td>
                      <td style={tdStyle}><input type="text" style={{...inputStyle, border:'none', background:'transparent', textAlign: 'right'}} placeholder="0.00" disabled /></td>
                    </tr>
                    <tr>
                      <td style={tdStyle}><select style={{...inputStyle, border:'none', background:'transparent'}}><option>Cr</option><option>Dr</option></select></td>
                      <td style={tdStyle}>
                        <input type="text" style={{...inputStyle, border:'none', background:'transparent'}} placeholder="Select Ledger..." />
                        <div style={{fontSize: '11px', color: 'var(--text-dim)', paddingLeft: '12px'}}>Cur Bal: ₹ 0.00</div>
                      </td>
                      <td style={tdStyle}><input type="text" style={{...inputStyle, border:'none', background:'transparent', textAlign: 'right'}} placeholder="0.00" disabled /></td>
                      <td style={tdStyle}><input type="text" style={{...inputStyle, border:'none', background:'transparent', textAlign: 'right'}} placeholder="0.00" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px', boxSizing: 'border-box' }}>
                <div style={{ boxSizing: 'border-box' }}>
                  <label style={labelStyle}>Narration:</label>
                  <textarea style={{...inputStyle, height: '50px', resize: 'none'}} placeholder="Enter details..."></textarea>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', boxSizing: 'border-box' }}>
                  <button style={{ background: vColor2, color: activeTab==='PAYMENT'?'#000':'#fff', padding: '12px 25px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save (Ctrl+A)</button>
                </div>
              </div>
            </div>
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
                <p>Total Taxable Value</p>
                <h4>₹ 2,30,000.00</h4>
              </div>
              <div className="r-card">
                <p>Total Tax Liability</p>
                <h4 style={{color: 'var(--accent-red)'}}>₹ 41,400.00</h4>
              </div>
              <div className="r-card">
                <p>Available ITC</p>
                <h4 style={{color: 'var(--accent-green)'}}>₹ 18,200.00</h4>
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
                  <div className="ledger-row fw-bold"><span>Opening Stock</span><span className="amt">45,000.00</span></div>
                  <div className="ledger-row fw-bold"><span>Purchase Accounts</span><span className="amt">1,20,500.00</span></div>
                  <div className="ledger-row child"><span>Local Purchases</span><span className="amt">80,000.00</span></div>
                  <div className="ledger-row child"><span>Interstate Purchases</span><span className="amt">40,500.00</span></div>
                  
                  <div className="ledger-row fw-bold"><span>Direct Expenses</span><span className="amt">12,000.00</span></div>
                  <div className="ledger-row child"><span>Wages</span><span className="amt">8,000.00</span></div>
                  <div className="ledger-row child"><span>Freight Inward</span><span className="amt">4,000.00</span></div>
                  
                  <div className="ledger-row fw-bold" style={{marginTop: '20px', color: 'var(--accent-blue)'}}>
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
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="report-header">
              <div>
                <h3><i className="fas fa-balance-scale" style={{color: '#007bff'}}></i> Balance Sheet</h3>
                <p className="report-subtitle">Manish Pvt Ltd | As of 31-Mar-2026</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc: Back</button>
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
                  
                  <div className="ledger-row fw-bold mt-3" style={{color: 'var(--accent-green)'}}><span>Profit & Loss A/c</span><span className="amt">2,59,000.00</span></div>
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
                <div style={{ display: 'grid', gap: '20px' }}>
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

      case 'IMPORT':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="report-header">
              <div>
                <h3><i className="fas fa-file-import" style={{color: '#e83e8c'}}></i> Import & Export Data</h3>
                <p className="report-subtitle">Masters & Vouchers Sync</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc: Back</button>
            </div>
            <div className="ledger-split" style={{marginTop: '20px'}}>
              <div className="ledger-side border-right">
                <div className="ledger-head">Import Data</div>
                <div className="ledger-body" style={{padding: '15px'}}>
                   <div className="ledger-row fw-bold" style={{cursor: 'pointer', padding: '10px', borderBottom: '1px solid var(--border)'}}><span>Masters (XML)</span></div>
                   <div className="ledger-row fw-bold" style={{cursor: 'pointer', padding: '10px', borderBottom: '1px solid var(--border)'}}><span>Vouchers (XML)</span></div>
                   <div className="ledger-row fw-bold" style={{cursor: 'pointer', padding: '10px'}}><span>Bank Statement (Excel/CSV)</span></div>
                </div>
              </div>
              <div className="ledger-side">
                <div className="ledger-head">Export Data</div>
                <div className="ledger-body" style={{padding: '15px'}}>
                   <div className="ledger-row fw-bold" style={{cursor: 'pointer', padding: '10px', borderBottom: '1px solid var(--border)'}}><span>All Masters</span></div>
                   <div className="ledger-row fw-bold" style={{cursor: 'pointer', padding: '10px', borderBottom: '1px solid var(--border)'}}><span>Day Book Vouchers</span></div>
                   <div className="ledger-row fw-bold" style={{cursor: 'pointer', padding: '10px'}}><span>Tally e-Way Bill Data</span></div>
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


      default: return null;
    }
  };

  return (
    <div className={`app-wrapper ${isDarkMode ? '' : 'light-mode'}`}>
      
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logoImage} alt="BIREENA Tally X" className="app-logo" />
        </div>
        
        <nav className="nav-group">
          <div className="nav-label">Main</div>
          <MenuItem icon="fas fa-home" label="Home" active={activeTab === 'DASHBOARD'} onClick={() => setActiveTab('DASHBOARD')} />
          
          <div className="nav-label">Setup & Creation</div>
          <MenuItem icon="fas fa-plus-circle" label="Company Creation" onClick={() => setActiveTab('COMPANY')} />
          <MenuItem icon="fas fa-book" label="Ledger Creation" onClick={() => setActiveTab('LEDGER')} />
          <MenuItem icon="fas fa-boxes" label="Stock Entry" onClick={() => setActiveTab('STOCK')} />
          
          <div className="nav-label">Core Transactions</div>
          <div className={`menu-item ${openMenus.coreTransactions ? 'open' : ''}`}>
            <button className={`nav-btn ${['JOURNAL', 'CONTRA', 'PAYMENT', 'RECEIPT'].includes(activeTab) ? 'active' : ''}`} onClick={() => toggleMenu('coreTransactions')}>
              <i className="fas fa-receipt"></i> Voucher Entry (F7) 
              <i className={`fas fa-chevron-${openMenus.coreTransactions ? 'up' : 'down'}`} style={{marginLeft:'auto', fontSize: '10px'}}></i>
            </button>
            <div className="sub-menu">
              <button className="sub-btn" onClick={() => setActiveTab('JOURNAL')}>Journal Entry</button>
              <button className="sub-btn" onClick={() => setActiveTab('CONTRA')}>Contra Entry (F4)</button>
              <button className="sub-btn" onClick={() => setActiveTab('PAYMENT')}>Payment (F5)</button>
              <button className="sub-btn" onClick={() => setActiveTab('RECEIPT')}>Receipt (F6)</button>
            </div>
          </div>

          <MenuItem icon="fas fa-shopping-cart" label="Sales (F8)" onClick={() => setActiveTab('SALES')} />
          <MenuItem icon="fas fa-shopping-basket" label="Purchase (F9)" onClick={() => setActiveTab('PURCHASE')} />
          <MenuItem icon="fas fa-university" label="Banking" onClick={() => setActiveTab('BANKING')} />

          <div className="nav-label">Compliance & Reports</div>
          <MenuItem icon="fas fa-percentage" label="GST / Taxation" onClick={() => setActiveTab('GST')} />
          <MenuItem icon="fas fa-chart-line" label="Profit & Loss" onClick={() => setActiveTab('PL')} />
          <MenuItem icon="fas fa-balance-scale" label="Balance Sheet" onClick={() => setActiveTab('BS')} />
          
          <div className="nav-label">Utilities</div>
          <MenuItem icon="fas fa-print" label="Printing & Export" shortcut="Alt+R" active={activeTab === 'PRINT'} onClick={() => setActiveTab('PRINT')} />
          <MenuItem icon="fas fa-sync" label="Backup & Restore" shortcut="Alt+K" active={activeTab === 'BACKUP'} onClick={() => setActiveTab('BACKUP')} />
          <MenuItem icon="fas fa-file-import" label="Import & Export" shortcut="Alt+I" active={activeTab === 'IMPORT'} onClick={() => setActiveTab('IMPORT')} />
          <MenuItem icon="fas fa-user-circle" label="My Profile" shortcut="Alt+U" active={activeTab === 'PROFILE'} onClick={() => setActiveTab('PROFILE')} />

          <MenuItem icon="fas fa-sign-out-alt" label="Logout" shortcut="Alt+L" className="dash-logout-btn" onClick={handleLogout} />
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-nav">
          <div className="command-center">
            <i className="fas fa-bolt" style={{color: 'var(--tally-yellow)'}}></i>
            <input type="text" placeholder="Go To... (Alt+G)" />
          </div>
          
          <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
            <button className="theme-toggle" onClick={toggleTheme}>
              <i className={isDarkMode ? "fas fa-moon" : "fas fa-sun"}></i> 
              <span>{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
            </button>
            <div style={{textAlign: 'right'}}>
              <p style={{fontSize: '14px', fontWeight: '800'}}>Manish Pvt Ltd</p>
              <p style={{fontSize: '11px', color: 'var(--accent-green)', fontWeight: '700'}}>FY 2025-26 | Patna</p>
            </div>
            <img src={`https://ui-avatars.com/api/?name=Admin&background=8b5cf6&color=fff&bold=true`} 
                 style={{width: '42px', borderRadius: '50%', border: '2px solid var(--border)'}} alt="User" />
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
                  { name: 'On Time', value: recOnTime, color: '#8b5cf6' },
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
                    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.25) 0%, rgba(236, 72, 153, 0.25) 50%, rgba(139, 92, 246, 0.25) 100%)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                      <div className="card-title">Total Receivables <i className="fas fa-arrow-trend-up" style={{color:'var(--accent-green)'}}></i></div>
                      <div className="insights-grid">
                        <div style={{ width: '90px', height: '90px' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={recData} innerRadius={30} outerRadius={45} dataKey="value" stroke="none">
                                {recData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                              </Pie>
                              <Tooltip contentStyle={{fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: isDarkMode?'#161b22':'#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}} itemStyle={{color: isDarkMode?'#fff':'#000'}} formatter={(value) => `₹${value.toLocaleString('en-IN', {maximumFractionDigits: 0})}`}/>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div>
                          <div className="big-amt">₹ {recAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                          <div style={{display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px'}}>
                            <span style={{color: '#8b5cf6'}}><i className="fas fa-check-circle"></i> On Time: <b>₹{recOnTime.toLocaleString('en-IN', {maximumFractionDigits:0})}</b></span>
                            <span style={{color: 'var(--tally-yellow)'}}><i className="fas fa-exclamation-circle"></i> Overdue: <b>₹{recOverdue.toLocaleString('en-IN', {maximumFractionDigits:0})}</b></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.25) 0%, rgba(236, 72, 153, 0.25) 50%, rgba(139, 92, 246, 0.25) 100%)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                      <div className="card-title">Total Payables <i className="fas fa-arrow-trend-down" style={{color:'var(--accent-red)'}}></i></div>
                      <div className="insights-grid">
                        <div style={{ width: '90px', height: '90px' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <defs>
                                <linearGradient id="pieGradient" x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="0%" stopColor="#fb923c" />
                                  <stop offset="50%" stopColor="#ec4899" />
                                  <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                              </defs>
                              <Pie data={payData} innerRadius={30} outerRadius={45} dataKey="value" stroke="none">
                                {payData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                              </Pie>
                              <Tooltip contentStyle={{fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: isDarkMode?'#161b22':'#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}} itemStyle={{color: isDarkMode?'#fff':'#000'}} formatter={(value) => `₹${value.toLocaleString('en-IN', {maximumFractionDigits: 0})}`}/>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div>
                          <div className="big-amt">₹ {payAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                          <div style={{display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px'}}>
                            <span style={{color: 'var(--text-dim)'}}><i className="fas fa-clock"></i> Pending: <b>₹{payPending.toLocaleString('en-IN', {maximumFractionDigits:0})}</b></span>
                            <span style={{color: 'var(--accent-red)'}}><i className="fas fa-bolt"></i> Critical: <b>₹{payCritical.toLocaleString('en-IN', {maximumFractionDigits:0})}</b></span>
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
                      <BarChart data={[
                        { name: 'APR', v: 300 }, { name: 'MAY', v: 1000 }, { name: 'JUN', v: 1000 },
                        { name: 'JUL', v: 1000 }, { name: 'AUG', v: 1100 }, { name: 'SEP', v: 1500 },
                        { name: 'OCT', v: 1700 }, { name: 'NOV', v: 1800 }, { name: 'DEC', v: 1950 },
                        { name: 'JAN', v: 2000 }, { name: 'FEB', v: 2050 }, { name: 'MAR', v: 2100 }
                      ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="barViolet" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.7} />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.3} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={isDarkMode ? "#30363d" : "#cbd5e1"} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: isDarkMode ? '#8b949e' : '#64748b'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: isDarkMode ? '#8b949e' : '#64748b'}} tickFormatter={(v) => `${v}K`} dx={-10} />
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: isDarkMode ? '#161b22' : '#ffffff', 
                                border: `1px solid ${isDarkMode ? '#30363d' : '#e2e8f0'}`,
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                            }} 
                            cursor={{ fill: isDarkMode ? '#30363d' : '#f1f5f9' }}
                            itemStyle={{ color: isDarkMode ? '#e6edf3' : '#0f172a', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="v" fill="url(#barViolet)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div style={{ flex: 1.2, borderLeft: '1px solid var(--border)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '15px' }}>
                  <div style={{textAlign: 'right'}}><p style={{fontSize: '11px', color: 'var(--text-dim)'}}>Cash as on 01-04-23</p><p style={{fontSize: '16px', fontWeight: '800'}}>₹ 0.00</p></div>
                  <div style={{textAlign: 'right'}}><p style={{fontSize: '11px', color: 'var(--text-dim)'}}>Incoming</p><p style={{fontSize: '16px', fontWeight: '800', color: 'var(--accent-green)'}}>₹ {metrics.cashIn.toLocaleString('en-IN', { minimumFractionDigits: 2 })} +</p></div>
                  <div style={{textAlign: 'right'}}><p style={{fontSize: '11px', color: 'var(--text-dim)'}}>Outgoing</p><p style={{fontSize: '16px', fontWeight: '800', color: 'var(--accent-red)'}}>₹ {metrics.cashOut.toLocaleString('en-IN', { minimumFractionDigits: 2 })} -</p></div>
                  <div style={{textAlign: 'right', borderTop: '1px solid var(--border)', paddingTop: '10px'}}><p style={{fontSize: '11px', color: 'var(--text-dim)'}}>Cash Flow Balance</p><p style={{fontSize: '16px', fontWeight: '800', color: 'var(--accent-blue)'}}>₹ {metrics.cash.toLocaleString('en-IN', { minimumFractionDigits: 2 })} =</p></div>
                </div>
              </div>
            </>
          ) : (
            renderReport()
          )}
        </div>
      </main>
    </div>
  );
};

const MenuItem = ({ icon, label, shortcut, active, onClick }) => (
  <div className="menu-item">
    <button className={`nav-btn ${active ? 'active' : ''}`} onClick={onClick}>
      <i className={icon}></i> {label}
    </button>
  </div>
);

export default Dashboard;
