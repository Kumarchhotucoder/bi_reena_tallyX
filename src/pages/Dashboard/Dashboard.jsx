import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';
import logoImage from '../../assets/bireena_tallyx_logo_no_bg.png';

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [openMenus, setOpenMenus] = useState({ coreTransactions: true });
  const [activeTab, setActiveTab] = useState('DASHBOARD');

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [settingsModalTitle, setSettingsModalTitle] = useState('');
  const profileRef = useRef(null);
  const [user, setUser] = useState({ name: 'Admin User', email: 'admin@bireena.com', initials: 'AD', companyName: 'My Company' });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('tallyx_token');
      if (!token) {
        window.location.assign('/');
        return;
      }

      try {
        const res = await fetch('http://localhost:5001/api/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success && data.user) {
          const name = data.user.name || 'Admin User';
          const email = data.user.email || 'admin@bireena.com';
          const companyName = data.user.companyName || 'My Company';
          const initials = companyName.substring(0, 2).toUpperCase();
          setUser({ name, email, initials, companyName });
        } else {
          // Token is invalid or expired
          localStorage.removeItem('tallyx_token');
          window.location.assign('/');
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
        // On network error just fallback to localStorage for now
        const name = localStorage.getItem('tallyx_user_name') || 'Admin User';
        const email = localStorage.getItem('tallyx_user_email') || 'admin@bireena.com';
        const companyName = localStorage.getItem('tallyx_company_name') || 'My Company';
        const initials = companyName.substring(0, 2).toUpperCase();
        setUser({ name, email, initials, companyName });
      }
    };

    fetchUser();

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
      else if (e.altKey && key.toLowerCase() === 'l') { e.preventDefault(); handleLogout(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('tallyx_token');
    localStorage.removeItem('tallyx_user_name');
    localStorage.removeItem('tallyx_user_email');
    window.location.assign('/');
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const renderReport = () => {
    switch (activeTab) {
      case 'GST':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="report-header">
              <div>
                <h3><i className="fas fa-percentage" style={{ color: '#ffc107' }}></i> GSTR-1 & Taxation Summary</h3>
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
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="report-header">
              <div>
                <h3><i className="fas fa-chart-line" style={{ color: '#28a745' }}></i> Profit & Loss A/c</h3>
                <p className="report-subtitle">{user.companyName} | As of 31-Mar-2026</p>
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
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="report-header">
              <div>
                <h3><i className="fas fa-balance-scale" style={{ color: '#007bff' }}></i> Balance Sheet</h3>
                <p className="report-subtitle">{user.companyName} | As of 31-Mar-2026</p>
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
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="report-header">
              <div>
                <h3><i className="fas fa-print" style={{ color: '#17a2b8' }}></i> Printing & Export</h3>
                <p className="report-subtitle">{user.companyName} | Configuration</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc: Back</button>
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
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="report-header">
              <div>
                <h3><i className="fas fa-sync" style={{ color: '#ffc107' }}></i> Backup & Restore</h3>
                <p className="report-subtitle">Secure your Company Data | Enter = Backup, R = Restore</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc: Back</button>
            </div>

            <div className="ledger-split" style={{ marginTop: '20px' }}>
              {/* BACKUP SIDE */}
              <div className="ledger-side border-right">
                <div className="ledger-head"><i className="fas fa-shield-alt" style={{ marginRight: '8px' }}></i>Backup Company</div>
                <div className="ledger-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                  <div className="ie-action-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '12px', cursor: 'default' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-dim)' }}>Source Path</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--accent-blue)' }}>C:\TallyPrime\Data</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-dim)' }}>Destination</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--accent-blue)' }}>D:\TallyBackups\2026</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-dim)' }}>Company</span>
                      <span style={{ fontWeight: 700 }}>{user.companyName} (10000)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-dim)' }}>Data Size</span>
                      <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>24.8 MB</span>
                    </div>
                  </div>

                  {/* Backup Button */}
                  <div className="ie-action-card" id="backup-start-btn" onClick={() => {
                    const bar = document.getElementById('backup-progress-bar');
                    const txt = document.getElementById('backup-status-text');
                    const wrap = document.getElementById('backup-progress-wrap');
                    if (!bar || !txt || !wrap) return;
                    wrap.style.display = 'block';
                    let p = 0;
                    const iv = setInterval(() => {
                      p += Math.random() * 15;
                      if (p >= 100) { p = 100; clearInterval(iv); txt.textContent = '✅ Backup Complete! (24.8 MB)'; bar.style.background = 'linear-gradient(90deg, #10b981, #34d399)'; }
                      else { txt.textContent = `Backing up... ${Math.round(p)}%`; }
                      bar.style.width = p + '%';
                    }, 300);
                  }}>
                    <div className="ie-action-left">
                      <div className="ie-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}><i className="fas fa-download"></i></div>
                      <div>
                        <div className="ie-title">Start Backup</div>
                        <div className="ie-desc">Compress & save company data</div>
                      </div>
                    </div>
                    <span className="shortcut-badge" style={{ background: 'rgba(16,185,129,0.2)', borderColor: 'rgba(16,185,129,0.4)', color: '#34d399' }}>Enter</span>
                  </div>

                  {/* Progress Bar */}
                  <div id="backup-progress-wrap" style={{ display: 'none' }}>
                    <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div id="backup-progress-bar" style={{ height: '100%', width: '0%', background: 'linear-gradient(90deg, var(--accent-blue), #6366f1)', borderRadius: '3px', transition: 'width 0.3s ease' }}></div>
                    </div>
                    <p id="backup-status-text" style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '6px', textAlign: 'center' }}>Preparing...</p>
                  </div>

                  {/* Schedule */}
                  <div style={{ padding: '12px', background: 'var(--glass)', borderRadius: '10px', border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fas fa-clock" style={{ color: '#ffc107', fontSize: '16px' }}></i>
                    <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Auto-backup: Daily at 11:30 PM | Last: Today 11:30 PM</span>
                  </div>
                </div>
              </div>

              {/* RESTORE SIDE */}
              <div className="ledger-side">
                <div className="ledger-head"><i className="fas fa-undo" style={{ marginRight: '8px' }}></i>Restore Data</div>
                <div className="ledger-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                  {/* Restore File Picker */}
                  <div className="ie-action-card" onClick={() => document.getElementById('restore-file-picker')?.click()}>
                    <div className="ie-action-left">
                      <div className="ie-icon" style={{ background: 'rgba(251,146,60,0.15)', color: '#fb923c' }}><i className="fas fa-upload"></i></div>
                      <div>
                        <div className="ie-title">Restore from File</div>
                        <div className="ie-desc">Select .zip or .bak backup file</div>
                      </div>
                    </div>
                    <span className="shortcut-badge" style={{ background: 'rgba(251,146,60,0.2)', borderColor: 'rgba(251,146,60,0.4)', color: '#fdba74' }}>R</span>
                    <input type="file" id="restore-file-picker" accept=".zip,.bak,.tar.gz" hidden onChange={(e) => { if (e.target.files[0]) alert(`✅ Restore started from "${e.target.files[0].name}" (${(e.target.files[0].size / 1024 / 1024).toFixed(2)} MB). Company data will be replaced.`); }} />
                  </div>

                  {/* Backup History */}
                  <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-dim)', marginTop: '4px' }}>Recent Backups</div>

                  <div className="ie-action-card" onClick={() => alert('✅ Restoring from backup: 13-Mar-2026 (24.8 MB)...\nCompany data will be replaced with this backup.')}>
                    <div className="ie-action-left">
                      <div className="ie-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}><i className="fas fa-archive"></i></div>
                      <div>
                        <div className="ie-title">13-Mar-2026, 11:30 PM</div>
                        <div className="ie-desc">24.8 MB — Auto Backup</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--accent-green)' }}><i className="fas fa-check-circle"></i> Latest</span>
                  </div>

                  <div className="ie-action-card" onClick={() => alert('✅ Restoring from backup: 12-Mar-2026 (24.1 MB)...')}>
                    <div className="ie-action-left">
                      <div className="ie-icon" style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}><i className="fas fa-archive"></i></div>
                      <div>
                        <div className="ie-title">12-Mar-2026, 11:30 PM</div>
                        <div className="ie-desc">24.1 MB — Auto Backup</div>
                      </div>
                    </div>
                  </div>

                  <div className="ie-action-card" onClick={() => alert('✅ Restoring from backup: 10-Mar-2026 (23.5 MB)...')}>
                    <div className="ie-action-left">
                      <div className="ie-icon" style={{ background: 'rgba(236,72,153,0.12)', color: '#ec4899' }}><i className="fas fa-archive"></i></div>
                      <div>
                        <div className="ie-title">10-Mar-2026, 06:15 PM</div>
                        <div className="ie-desc">23.5 MB — Manual Backup</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '12px', background: 'var(--glass)', borderRadius: '10px', border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fas fa-exclamation-triangle" style={{ color: '#ef4444', fontSize: '14px' }}></i>
                    <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Restoring will replace current data. Take a fresh backup first.</span>
                  </div>
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
                <h3><i className="fas fa-file-import" style={{ color: '#e83e8c' }}></i> Import & Export Data</h3>
                <p className="report-subtitle">Masters & Vouchers Sync | Press 1-6 for quick actions</p>
              </div>
              <button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc: Back</button>
            </div>

            <div className="ledger-split" style={{ marginTop: '20px' }}>
              {/* IMPORT SIDE */}
              <div className="ledger-side border-right">
                <div className="ledger-head"><i className="fas fa-download" style={{ marginRight: '8px' }}></i>Import Data</div>
                <div className="ledger-body" style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

                  {/* 1. Masters XML */}
                  <div className="ie-action-card" onClick={() => document.getElementById('import-masters-xml')?.click()}>
                    <div className="ie-action-left">
                      <div className="ie-icon" style={{ background: 'rgba(47,129,247,0.15)', color: '#2f81f7' }}><i className="fas fa-sitemap"></i></div>
                      <div>
                        <div className="ie-title">Masters (XML)</div>
                        <div className="ie-desc">Ledgers, Groups, Stock Items</div>
                      </div>
                    </div>
                    <span className="shortcut-badge" style={{ background: 'rgba(47,129,247,0.2)', borderColor: 'rgba(47,129,247,0.4)', color: '#60a5fa' }}>1</span>
                    <input type="file" id="import-masters-xml" accept=".xml" hidden onChange={(e) => { if (e.target.files[0]) alert(`✅ "${e.target.files[0].name}" imported successfully! ${e.target.files[0].size} bytes processed.`); }} />
                  </div>

                  {/* 2. Vouchers XML */}
                  <div className="ie-action-card" onClick={() => document.getElementById('import-vouchers-xml')?.click()}>
                    <div className="ie-action-left">
                      <div className="ie-icon" style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}><i className="fas fa-receipt"></i></div>
                      <div>
                        <div className="ie-title">Vouchers (XML)</div>
                        <div className="ie-desc">Sales, Purchase, Journal Entries</div>
                      </div>
                    </div>
                    <span className="shortcut-badge" style={{ background: 'rgba(139,92,246,0.2)', borderColor: 'rgba(139,92,246,0.4)', color: '#a78bfa' }}>2</span>
                    <input type="file" id="import-vouchers-xml" accept=".xml" hidden onChange={(e) => { if (e.target.files[0]) alert(`✅ "${e.target.files[0].name}" imported! ${e.target.files[0].size} bytes processed.`); }} />
                  </div>

                  {/* 3. Bank Statement */}
                  <div className="ie-action-card" onClick={() => document.getElementById('import-bank-csv')?.click()}>
                    <div className="ie-action-left">
                      <div className="ie-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}><i className="fas fa-university"></i></div>
                      <div>
                        <div className="ie-title">Bank Statement (CSV/Excel)</div>
                        <div className="ie-desc">Auto-reconcile transactions</div>
                      </div>
                    </div>
                    <span className="shortcut-badge" style={{ background: 'rgba(16,185,129,0.2)', borderColor: 'rgba(16,185,129,0.4)', color: '#34d399' }}>3</span>
                    <input type="file" id="import-bank-csv" accept=".csv,.xlsx,.xls" hidden onChange={(e) => { if (e.target.files[0]) alert(`✅ "${e.target.files[0].name}" imported! ${e.target.files[0].size} bytes processed.`); }} />
                  </div>

                  {/* Drop Zone */}
                  <div className="ie-drop-zone" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) alert(`✅ "${f.name}" dropped & imported!`); }}>
                    <i className="fas fa-cloud-upload-alt" style={{ fontSize: '24px', opacity: 0.5 }}></i>
                    <span>Drag & Drop files here</span>
                  </div>
                </div>
              </div>

              {/* EXPORT SIDE */}
              <div className="ledger-side">
                <div className="ledger-head"><i className="fas fa-upload" style={{ marginRight: '8px' }}></i>Export Data</div>
                <div className="ledger-body" style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

                  {/* 4. All Masters */}
                  <div className="ie-action-card" onClick={() => { const blob = new Blob(['<?xml version="1.0"?>\n<MASTERS>\n  <LEDGER NAME="Cash"/>\n  <LEDGER NAME="Sales"/>\n  <LEDGER NAME="Purchase"/>\n  <GROUP NAME="Sundry Debtors"/>\n  <GROUP NAME="Sundry Creditors"/>\n</MASTERS>'], { type: 'text/xml' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'masters_export.xml'; a.click(); }}>
                    <div className="ie-action-left">
                      <div className="ie-icon" style={{ background: 'rgba(251,146,60,0.15)', color: '#fb923c' }}><i className="fas fa-database"></i></div>
                      <div>
                        <div className="ie-title">All Masters</div>
                        <div className="ie-desc">Ledgers, Groups, Stock Items → XML</div>
                      </div>
                    </div>
                    <span className="shortcut-badge" style={{ background: 'rgba(251,146,60,0.2)', borderColor: 'rgba(251,146,60,0.4)', color: '#fdba74' }}>4</span>
                  </div>

                  {/* 5. Day Book */}
                  <div className="ie-action-card" onClick={() => { const csv = 'Date,Voucher Type,Particulars,Debit,Credit\n01-Mar-26,Sales,ABC Enterprises,25000,0\n05-Mar-26,Purchase,Mehta Traders,0,18000\n10-Mar-26,Payment,Rent A/c,0,15000\n15-Mar-26,Receipt,XYZ Ltd,30000,0\n20-Mar-26,Journal,Depreciation,5000,5000'; const blob = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'daybook_vouchers.csv'; a.click(); }}>
                    <div className="ie-action-left">
                      <div className="ie-icon" style={{ background: 'rgba(236,72,153,0.15)', color: '#ec4899' }}><i className="fas fa-book-open"></i></div>
                      <div>
                        <div className="ie-title">Day Book Vouchers</div>
                        <div className="ie-desc">All entries → CSV/Excel</div>
                      </div>
                    </div>
                    <span className="shortcut-badge" style={{ background: 'rgba(236,72,153,0.2)', borderColor: 'rgba(236,72,153,0.4)', color: '#f472b6' }}>5</span>
                  </div>

                  {/* 6. e-Way Bill */}
                  <div className="ie-action-card" onClick={() => { const json = JSON.stringify({ eWayBills: [{ billNo: 'EWB001', date: '2026-03-01', from: 'Patna', to: 'Mumbai', value: 150000, gstin: '22AAAAA0000A1Z5', vehicle: 'BR01AB1234' }, { billNo: 'EWB002', date: '2026-03-10', from: 'Patna', to: 'Delhi', value: 85000, gstin: '22AAAAA0000A1Z5', vehicle: 'BR01CD5678' }] }, null, 2); const blob = new Blob([json], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'eway_bill_data.json'; a.click(); }}>
                    <div className="ie-action-left">
                      <div className="ie-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}><i className="fas fa-truck"></i></div>
                      <div>
                        <div className="ie-title">Tally e-Way Bill Data</div>
                        <div className="ie-desc">GST e-Way Bills → JSON</div>
                      </div>
                    </div>
                    <span className="shortcut-badge" style={{ background: 'rgba(99,102,241,0.2)', borderColor: 'rgba(99,102,241,0.4)', color: '#818cf8' }}>6</span>
                  </div>

                  {/* Export Format Info */}
                  <div style={{ padding: '12px', background: 'var(--glass)', borderRadius: '10px', border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fas fa-info-circle" style={{ color: 'var(--accent-blue)', fontSize: '16px' }}></i>
                    <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Exports generate instantly. XML for Tally compatibility, CSV for Excel, JSON for GST Portal.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'COMPANY':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1' }}>
            <div className="report-header"><div><h3><i className="fas fa-plus-circle" style={{ color: '#2f81f7' }}></i> Company Creation</h3><p className="report-subtitle">F1 | Create New Company</p></div><button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc</button></div>
            <div className="form-grid">
              <div className="form-group full"><label>Company Name</label><input type="text" placeholder="Enter Company Name" /></div>
              <div className="form-group"><label>Mailing Name</label><input type="text" placeholder="As shown in reports" /></div>
              <div className="form-group"><label>Address</label><input type="text" placeholder="Registered Address" /></div>
              <div className="form-group"><label>State</label><select><option value="">Select State</option><option>Chhattisgarh</option><option>Maharashtra</option><option>Delhi</option><option>Karnataka</option><option>Gujarat</option></select></div>
              <div className="form-group"><label>Country</label><select><option>India</option><option>USA</option><option>UK</option></select></div>
              <div className="form-group"><label>PIN Code</label><input type="text" placeholder="490001" /></div>
              <div className="form-group"><label>Phone No.</label><input type="text" placeholder="+91 " /></div>
              <div className="form-group"><label>E-Mail</label><input type="email" placeholder="company@email.com" /></div>
              <div className="form-group"><label>GSTIN / UIN</label><input type="text" placeholder="22AAAAA0000A1Z5" /></div>
              <div className="form-group"><label>Financial Year From</label><input type="date" defaultValue="2025-04-01" /></div>
              <div className="form-group"><label>Books Beginning From</label><input type="date" defaultValue="2025-04-01" /></div>
              <div className="form-group"><label>Security (Password)</label><input type="password" placeholder="Set admin password" /></div>
              <div className="form-actions"><button className="btn-primary">Accept (Ctrl+A)</button><button className="btn-secondary" onClick={() => setActiveTab('DASHBOARD')}>Cancel (Esc)</button></div>
            </div>
          </div>
        );

      case 'LEDGER':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1' }}>
            <div className="report-header"><div><h3><i className="fas fa-book" style={{ color: '#10b981' }}></i> Ledger Creation</h3><p className="report-subtitle">F2 | Create Ledger Account</p></div><button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc</button></div>
            <div className="form-grid">
              <div className="form-group full"><label>Ledger Name</label><input type="text" placeholder="e.g. Cash A/c, Bank A/c, Sales A/c" /></div>
              <div className="form-group"><label>Under (Group)</label><select><option value="">Select Group</option><option>Bank Accounts</option><option>Cash-in-Hand</option><option>Sundry Creditors</option><option>Sundry Debtors</option><option>Sales Accounts</option><option>Purchase Accounts</option><option>Direct Expenses</option><option>Indirect Expenses</option><option>Capital A/c</option><option>Duties & Taxes</option><option>Current Liabilities</option><option>Current Assets</option><option>Fixed Assets</option></select></div>
              <div className="form-group"><label>Opening Balance</label><input type="number" placeholder="0.00" /></div>
              <div className="form-group"><label>Dr / Cr</label><select><option>Dr</option><option>Cr</option></select></div>
              <div className="form-group"><label>Mailing Name</label><input type="text" placeholder="Party Name for Invoices" /></div>
              <div className="form-group"><label>GSTIN</label><input type="text" placeholder="Party GSTIN" /></div>
              <div className="form-group"><label>PAN / IT No</label><input type="text" placeholder="ABCDE1234F" /></div>
              <div className="form-group"><label>State</label><select><option value="">Select</option><option>Chhattisgarh</option><option>Maharashtra</option><option>Delhi</option><option>Karnataka</option></select></div>
              <div className="form-actions"><button className="btn-primary">Accept (Ctrl+A)</button><button className="btn-secondary" onClick={() => setActiveTab('DASHBOARD')}>Cancel (Esc)</button></div>
            </div>
          </div>
        );

      case 'STOCK':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1' }}>
            <div className="report-header"><div><h3><i className="fas fa-boxes" style={{ color: '#f59e0b' }}></i> Stock Item Creation</h3><p className="report-subtitle">F3 | Create Stock Item</p></div><button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc</button></div>
            <div className="form-grid">
              <div className="form-group full"><label>Item Name</label><input type="text" placeholder="e.g. Laptop HP 15s" /></div>
              <div className="form-group"><label>Under (Group)</label><select><option value="">Primary</option><option>Electronics</option><option>Stationery</option><option>Raw Materials</option><option>Finished Goods</option></select></div>
              <div className="form-group"><label>Unit of Measure</label><select><option>Nos</option><option>Kg</option><option>Ltrs</option><option>Pcs</option><option>Mtr</option><option>Box</option></select></div>
              <div className="form-group"><label>HSN / SAC Code</label><input type="text" placeholder="8471" /></div>
              <div className="form-group"><label>GST Rate (%)</label><select><option>18%</option><option>5%</option><option>12%</option><option>28%</option><option>0%</option></select></div>
              <div className="form-group"><label>Opening Qty</label><input type="number" placeholder="0" /></div>
              <div className="form-group"><label>Rate (per unit)</label><input type="number" placeholder="0.00" /></div>
              <div className="form-group"><label>Opening Value (₹)</label><input type="number" placeholder="0.00" /></div>
              <div className="form-actions"><button className="btn-primary">Accept (Ctrl+A)</button><button className="btn-secondary" onClick={() => setActiveTab('DASHBOARD')}>Cancel (Esc)</button></div>
            </div>
          </div>
        );

      case 'VOUCHER':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1' }}>
            <div className="report-header"><div><h3><i className="fas fa-receipt" style={{ color: '#8b5cf6' }}></i> Journal Voucher</h3><p className="report-subtitle">F7 | Voucher Entry</p></div><button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc</button></div>
            <div className="form-grid">
              <div className="form-group"><label>Voucher No.</label><input type="text" value="J/001" readOnly /></div>
              <div className="form-group"><label>Date</label><input type="date" defaultValue="2026-03-11" /></div>
              <div className="form-group full"><label>Narration</label><input type="text" placeholder="Being entry for..." /></div>
            </div>
            <table className="report-table premium-table" style={{ marginTop: '20px' }}><thead><tr><th>Particulars (Ledger)</th><th className="num-col">Debit (₹)</th><th className="num-col">Credit (₹)</th></tr></thead><tbody>
              <tr><td><input type="text" placeholder="Select Ledger" style={{ width: '100%', background: 'transparent', border: 'none', color: 'inherit' }} /></td><td className="num-col"><input type="number" placeholder="0.00" style={{ width: '100px', background: 'transparent', border: '1px solid var(--border)', color: 'inherit', padding: '4px 8px', borderRadius: '4px', textAlign: 'right' }} /></td><td className="num-col"><input type="number" placeholder="0.00" style={{ width: '100px', background: 'transparent', border: '1px solid var(--border)', color: 'inherit', padding: '4px 8px', borderRadius: '4px', textAlign: 'right' }} /></td></tr>
              <tr><td><input type="text" placeholder="Select Ledger" style={{ width: '100%', background: 'transparent', border: 'none', color: 'inherit' }} /></td><td className="num-col"><input type="number" placeholder="0.00" style={{ width: '100px', background: 'transparent', border: '1px solid var(--border)', color: 'inherit', padding: '4px 8px', borderRadius: '4px', textAlign: 'right' }} /></td><td className="num-col"><input type="number" placeholder="0.00" style={{ width: '100px', background: 'transparent', border: '1px solid var(--border)', color: 'inherit', padding: '4px 8px', borderRadius: '4px', textAlign: 'right' }} /></td></tr>
              <tr><td><input type="text" placeholder="Select Ledger" style={{ width: '100%', background: 'transparent', border: 'none', color: 'inherit' }} /></td><td className="num-col"><input type="number" placeholder="0.00" style={{ width: '100px', background: 'transparent', border: '1px solid var(--border)', color: 'inherit', padding: '4px 8px', borderRadius: '4px', textAlign: 'right' }} /></td><td className="num-col"><input type="number" placeholder="0.00" style={{ width: '100px', background: 'transparent', border: '1px solid var(--border)', color: 'inherit', padding: '4px 8px', borderRadius: '4px', textAlign: 'right' }} /></td></tr>
              <tr className="total-row"><td>Total</td><td className="num-col">0.00</td><td className="num-col">0.00</td></tr>
            </tbody></table>
            <div className="form-actions" style={{ marginTop: '20px' }}><button className="btn-primary">Save Voucher (Ctrl+A)</button><button className="btn-secondary" onClick={() => setActiveTab('DASHBOARD')}>Cancel (Esc)</button></div>
          </div>
        );

      case 'CONTRA':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1' }}>
            <div className="report-header"><div><h3><i className="fas fa-exchange-alt" style={{ color: '#06b6d4' }}></i> Contra Voucher</h3><p className="report-subtitle">F4 | Cash ↔ Bank Transfer</p></div><button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc</button></div>
            <div className="form-grid">
              <div className="form-group"><label>Voucher No.</label><input type="text" value="C/001" readOnly /></div>
              <div className="form-group"><label>Date</label><input type="date" defaultValue="2026-03-11" /></div>
              <div className="form-group"><label>Account (Debit)</label><select><option value="">Select Account</option><option>Cash A/c</option><option>SBI Bank A/c</option><option>HDFC Bank A/c</option><option>PNB Bank A/c</option></select></div>
              <div className="form-group"><label>Account (Credit)</label><select><option value="">Select Account</option><option>Cash A/c</option><option>SBI Bank A/c</option><option>HDFC Bank A/c</option><option>PNB Bank A/c</option></select></div>
              <div className="form-group"><label>Amount (₹)</label><input type="number" placeholder="0.00" /></div>
              <div className="form-group full"><label>Narration</label><input type="text" placeholder="Cash deposited to bank" /></div>
              <div className="form-actions"><button className="btn-primary">Save (Ctrl+A)</button><button className="btn-secondary" onClick={() => setActiveTab('DASHBOARD')}>Cancel (Esc)</button></div>
            </div>
          </div>
        );

      case 'PAYMENT':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1' }}>
            <div className="report-header"><div><h3><i className="fas fa-money-bill-wave" style={{ color: '#ef4444' }}></i> Payment Voucher</h3><p className="report-subtitle">F5 | Payment Entry</p></div><button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc</button></div>
            <div className="form-grid">
              <div className="form-group"><label>Voucher No.</label><input type="text" value="P/001" readOnly /></div>
              <div className="form-group"><label>Date</label><input type="date" defaultValue="2026-03-11" /></div>
              <div className="form-group"><label>Account (Dr.)</label><select><option value="">Select Expense/Party</option><option>Rent A/c</option><option>Salary A/c</option><option>Electricity A/c</option><option>Sundry Creditors</option><option>Office Expenses</option></select></div>
              <div className="form-group"><label>Paid Through (Cr.)</label><select><option>Cash A/c</option><option>SBI Bank A/c</option><option>HDFC Bank A/c</option></select></div>
              <div className="form-group"><label>Amount (₹)</label><input type="number" placeholder="0.00" /></div>
              <div className="form-group"><label>Mode</label><select><option>Cash</option><option>Cheque</option><option>NEFT/RTGS</option><option>UPI</option></select></div>
              <div className="form-group full"><label>Narration</label><input type="text" placeholder="Paid to ..." /></div>
              <div className="form-actions"><button className="btn-primary">Save (Ctrl+A)</button><button className="btn-secondary" onClick={() => setActiveTab('DASHBOARD')}>Cancel (Esc)</button></div>
            </div>
          </div>
        );

      case 'RECEIPT':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1' }}>
            <div className="report-header"><div><h3><i className="fas fa-hand-holding-usd" style={{ color: '#10b981' }}></i> Receipt Voucher</h3><p className="report-subtitle">F6 | Receipt Entry</p></div><button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc</button></div>
            <div className="form-grid">
              <div className="form-group"><label>Voucher No.</label><input type="text" value="R/001" readOnly /></div>
              <div className="form-group"><label>Date</label><input type="date" defaultValue="2026-03-11" /></div>
              <div className="form-group"><label>Account (Cr.)</label><select><option value="">Select Income/Party</option><option>Sundry Debtors</option><option>Sales A/c</option><option>Interest Received</option><option>Commission Received</option></select></div>
              <div className="form-group"><label>Received In (Dr.)</label><select><option>Cash A/c</option><option>SBI Bank A/c</option><option>HDFC Bank A/c</option></select></div>
              <div className="form-group"><label>Amount (₹)</label><input type="number" placeholder="0.00" /></div>
              <div className="form-group"><label>Mode</label><select><option>Cash</option><option>Cheque</option><option>NEFT/RTGS</option><option>UPI</option></select></div>
              <div className="form-group full"><label>Narration</label><input type="text" placeholder="Received from ..." /></div>
              <div className="form-actions"><button className="btn-primary">Save (Ctrl+A)</button><button className="btn-secondary" onClick={() => setActiveTab('DASHBOARD')}>Cancel (Esc)</button></div>
            </div>
          </div>
        );

      case 'SALES':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1' }}>
            <div className="report-header"><div><h3><i className="fas fa-shopping-cart" style={{ color: '#2f81f7' }}></i> Sales Invoice</h3><p className="report-subtitle">F8 | Sales Entry</p></div><button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc</button></div>
            <div className="form-grid">
              <div className="form-group"><label>Invoice No.</label><input type="text" value="INV/001" readOnly /></div>
              <div className="form-group"><label>Date</label><input type="date" defaultValue="2026-03-11" /></div>
              <div className="form-group"><label>Party Name (Dr.)</label><select><option value="">Select Buyer</option><option>ABC Enterprises</option><option>XYZ Ltd</option><option>Sharma & Sons</option></select></div>
              <div className="form-group"><label>Sales Ledger (Cr.)</label><select><option>Sales A/c</option><option>Sales B2B</option><option>Sales B2C</option></select></div>
            </div>
            <table className="report-table premium-table" style={{ marginTop: '20px' }}><thead><tr><th>Item Name</th><th className="num-col">HSN</th><th className="num-col">Qty</th><th className="num-col">Rate</th><th className="num-col">GST %</th><th className="num-col">Amount (₹)</th></tr></thead><tbody>
              <tr><td><input type="text" placeholder="Select Item" style={{ width: '100%', background: 'transparent', border: 'none', color: 'inherit' }} /></td><td className="num-col"><input type="text" placeholder="HSN" style={{ width: '60px', background: 'transparent', border: '1px solid var(--border)', color: 'inherit', padding: '4px', borderRadius: '4px', textAlign: 'center' }} /></td><td className="num-col"><input type="number" placeholder="0" style={{ width: '60px', background: 'transparent', border: '1px solid var(--border)', color: 'inherit', padding: '4px', borderRadius: '4px', textAlign: 'right' }} /></td><td className="num-col"><input type="number" placeholder="0.00" style={{ width: '80px', background: 'transparent', border: '1px solid var(--border)', color: 'inherit', padding: '4px', borderRadius: '4px', textAlign: 'right' }} /></td><td className="num-col">18%</td><td className="num-col highlight">0.00</td></tr>
              <tr><td><input type="text" placeholder="Select Item" style={{ width: '100%', background: 'transparent', border: 'none', color: 'inherit' }} /></td><td className="num-col"><input type="text" placeholder="HSN" style={{ width: '60px', background: 'transparent', border: '1px solid var(--border)', color: 'inherit', padding: '4px', borderRadius: '4px', textAlign: 'center' }} /></td><td className="num-col"><input type="number" placeholder="0" style={{ width: '60px', background: 'transparent', border: '1px solid var(--border)', color: 'inherit', padding: '4px', borderRadius: '4px', textAlign: 'right' }} /></td><td className="num-col"><input type="number" placeholder="0.00" style={{ width: '80px', background: 'transparent', border: '1px solid var(--border)', color: 'inherit', padding: '4px', borderRadius: '4px', textAlign: 'right' }} /></td><td className="num-col">18%</td><td className="num-col highlight">0.00</td></tr>
              <tr className="total-row"><td colSpan="5">Grand Total</td><td className="num-col">0.00</td></tr>
            </tbody></table>
            <div className="form-group full" style={{ marginTop: '15px' }}><label>Narration</label><input type="text" placeholder="Sales invoice to..." /></div>
            <div className="form-actions" style={{ marginTop: '15px' }}><button className="btn-primary">Save Invoice (Ctrl+A)</button><button className="btn-secondary" onClick={() => setActiveTab('DASHBOARD')}>Cancel (Esc)</button></div>
          </div>
        );

      case 'PURCHASE':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1' }}>
            <div className="report-header"><div><h3><i className="fas fa-shopping-basket" style={{ color: '#f97316' }}></i> Purchase Entry</h3><p className="report-subtitle">F9 | Purchase Voucher</p></div><button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc</button></div>
            <div className="form-grid">
              <div className="form-group"><label>Bill No.</label><input type="text" value="PUR/001" readOnly /></div>
              <div className="form-group"><label>Date</label><input type="date" defaultValue="2026-03-11" /></div>
              <div className="form-group"><label>Party Name (Cr.)</label><select><option value="">Select Supplier</option><option>Mehta Traders</option><option>Delhi Distributors</option><option>Global Imports</option></select></div>
              <div className="form-group"><label>Purchase Ledger (Dr.)</label><select><option>Purchase A/c</option><option>Local Purchases</option><option>Interstate Purchases</option></select></div>
            </div>
            <table className="report-table premium-table" style={{ marginTop: '20px' }}><thead><tr><th>Item Name</th><th className="num-col">HSN</th><th className="num-col">Qty</th><th className="num-col">Rate</th><th className="num-col">GST %</th><th className="num-col">Amount (₹)</th></tr></thead><tbody>
              <tr><td><input type="text" placeholder="Select Item" style={{ width: '100%', background: 'transparent', border: 'none', color: 'inherit' }} /></td><td className="num-col"><input type="text" placeholder="HSN" style={{ width: '60px', background: 'transparent', border: '1px solid var(--border)', color: 'inherit', padding: '4px', borderRadius: '4px', textAlign: 'center' }} /></td><td className="num-col"><input type="number" placeholder="0" style={{ width: '60px', background: 'transparent', border: '1px solid var(--border)', color: 'inherit', padding: '4px', borderRadius: '4px', textAlign: 'right' }} /></td><td className="num-col"><input type="number" placeholder="0.00" style={{ width: '80px', background: 'transparent', border: '1px solid var(--border)', color: 'inherit', padding: '4px', borderRadius: '4px', textAlign: 'right' }} /></td><td className="num-col">18%</td><td className="num-col highlight">0.00</td></tr>
              <tr><td><input type="text" placeholder="Select Item" style={{ width: '100%', background: 'transparent', border: 'none', color: 'inherit' }} /></td><td className="num-col"><input type="text" placeholder="HSN" style={{ width: '60px', background: 'transparent', border: '1px solid var(--border)', color: 'inherit', padding: '4px', borderRadius: '4px', textAlign: 'center' }} /></td><td className="num-col"><input type="number" placeholder="0" style={{ width: '60px', background: 'transparent', border: '1px solid var(--border)', color: 'inherit', padding: '4px', borderRadius: '4px', textAlign: 'right' }} /></td><td className="num-col"><input type="number" placeholder="0.00" style={{ width: '80px', background: 'transparent', border: '1px solid var(--border)', color: 'inherit', padding: '4px', borderRadius: '4px', textAlign: 'right' }} /></td><td className="num-col">18%</td><td className="num-col highlight">0.00</td></tr>
              <tr className="total-row"><td colSpan="5">Grand Total</td><td className="num-col">0.00</td></tr>
            </tbody></table>
            <div className="form-group full" style={{ marginTop: '15px' }}><label>Narration</label><input type="text" placeholder="Purchase from..." /></div>
            <div className="form-actions" style={{ marginTop: '15px' }}><button className="btn-primary">Save Purchase (Ctrl+A)</button><button className="btn-secondary" onClick={() => setActiveTab('DASHBOARD')}>Cancel (Esc)</button></div>
          </div>
        );

      case 'BANKING':
        return (
          <div className="report-card animate-fade" style={{ gridColumn: '1 / -1' }}>
            <div className="report-header"><div><h3><i className="fas fa-university" style={{ color: '#6366f1' }}></i> Banking & Reconciliation</h3><p className="report-subtitle">F10 | Bank Accounts</p></div><button onClick={() => setActiveTab('DASHBOARD')} className="esc-btn"><i className="fas fa-times"></i> Esc</button></div>
            <div className="report-summary-cards">
              <div className="r-card"><p>SBI Current A/c</p><h4 style={{ color: 'var(--accent-green)' }}>₹ 1,12,000.00</h4></div>
              <div className="r-card"><p>HDFC Savings A/c</p><h4>₹ 45,500.00</h4></div>
              <div className="r-card"><p>Cash-in-Hand</p><h4>₹ 42,250.11</h4></div>
            </div>
            <table className="report-table premium-table" style={{ marginTop: '20px' }}><thead><tr><th>Date</th><th>Particulars</th><th>Vch Type</th><th className="num-col">Debit</th><th className="num-col">Credit</th><th className="num-col">Balance</th></tr></thead><tbody>
              <tr><td>01-Mar-26</td><td>Opening Balance</td><td>-</td><td className="num-col">-</td><td className="num-col">-</td><td className="num-col highlight">1,50,000.00</td></tr>
              <tr><td>05-Mar-26</td><td>ABC Enterprises</td><td>Receipt</td><td className="num-col" style={{ color: 'var(--accent-green)' }}>25,000.00</td><td className="num-col">-</td><td className="num-col highlight">1,75,000.00</td></tr>
              <tr><td>10-Mar-26</td><td>Salary — Staff</td><td>Payment</td><td className="num-col">-</td><td className="num-col" style={{ color: 'var(--accent-red)' }}>35,000.00</td><td className="num-col highlight">1,40,000.00</td></tr>
              <tr><td>15-Mar-26</td><td>Rent Payment</td><td>Payment</td><td className="num-col">-</td><td className="num-col" style={{ color: 'var(--accent-red)' }}>15,000.00</td><td className="num-col highlight">1,25,000.00</td></tr>
              <tr><td>20-Mar-26</td><td>XYZ Ltd</td><td>Receipt</td><td className="num-col" style={{ color: 'var(--accent-green)' }}>30,000.00</td><td className="num-col">-</td><td className="num-col highlight">1,55,000.00</td></tr>
              <tr className="total-row"><td colSpan="3">Closing Balance</td><td className="num-col">55,000.00</td><td className="num-col">50,000.00</td><td className="num-col">1,55,000.00</td></tr>
            </tbody></table>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className={`app-wrapper ${isDarkMode ? '' : 'light-mode'}`}>

      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logoImage} alt="BiReena Tally X" className="app-logo" style={{ maxWidth: '160px' }} />
        </div>

        <nav className="nav-group">
          <div className="nav-label">Setup & Creation</div>
          <MenuItem icon="fas fa-plus-circle" label="Company Creation" shortcut="F1" active={activeTab === 'COMPANY'} onClick={() => setActiveTab('COMPANY')} />
          <MenuItem icon="fas fa-book" label="Ledger Creation" shortcut="F2" active={activeTab === 'LEDGER'} onClick={() => setActiveTab('LEDGER')} />
          <MenuItem icon="fas fa-boxes" label="Stock Entry" shortcut="F3" active={activeTab === 'STOCK'} onClick={() => setActiveTab('STOCK')} />

          <div className="nav-label">Core Transactions</div>
          <div className={`menu-item ${openMenus.coreTransactions ? 'open' : ''}`}>
            <button className={`nav-btn ${activeTab === 'VOUCHER' ? 'active' : ''}`} onClick={() => { toggleMenu('coreTransactions'); setActiveTab('VOUCHER'); }}>
              <i className="fas fa-receipt"></i> Voucher Entry
              <span className="shortcut-badge">F7</span>
              <i className={`fas fa-chevron-${openMenus.coreTransactions ? 'up' : 'down'}`} style={{ marginLeft: 'auto', fontSize: '10px' }}></i>
            </button>
            <div className="sub-menu">
              <button className={`sub-btn ${activeTab === 'VOUCHER' ? 'active' : ''}`} onClick={() => setActiveTab('VOUCHER')}>Journal Entry <span className="shortcut-badge sm">F7</span></button>
              <button className={`sub-btn ${activeTab === 'CONTRA' ? 'active' : ''}`} onClick={() => setActiveTab('CONTRA')}>Contra Entry <span className="shortcut-badge sm">F4</span></button>
              <button className={`sub-btn ${activeTab === 'PAYMENT' ? 'active' : ''}`} onClick={() => setActiveTab('PAYMENT')}>Payment <span className="shortcut-badge sm">F5</span></button>
              <button className={`sub-btn ${activeTab === 'RECEIPT' ? 'active' : ''}`} onClick={() => setActiveTab('RECEIPT')}>Receipt <span className="shortcut-badge sm">F6</span></button>
            </div>
          </div>

          <MenuItem icon="fas fa-shopping-cart" label="Sales" shortcut="F8" active={activeTab === 'SALES'} onClick={() => setActiveTab('SALES')} />
          <MenuItem icon="fas fa-shopping-basket" label="Purchase" shortcut="F9" active={activeTab === 'PURCHASE'} onClick={() => setActiveTab('PURCHASE')} />
          <MenuItem icon="fas fa-university" label="Banking" shortcut="F10" active={activeTab === 'BANKING'} onClick={() => setActiveTab('BANKING')} />

          <div className="nav-label">Compliance & Reports</div>
          <MenuItem icon="fas fa-percentage" label="GST / Taxation" shortcut="Alt+G" active={activeTab === 'GST'} onClick={() => setActiveTab('GST')} />
          <MenuItem icon="fas fa-chart-line" label="Profit & Loss" shortcut="Alt+P" active={activeTab === 'PL'} onClick={() => setActiveTab('PL')} />
          <MenuItem icon="fas fa-balance-scale" label="Balance Sheet" shortcut="Alt+B" active={activeTab === 'BS'} onClick={() => setActiveTab('BS')} />

          <div className="nav-label">Utilities</div>
          <MenuItem icon="fas fa-print" label="Printing & Export" shortcut="Alt+R" active={activeTab === 'PRINT'} onClick={() => setActiveTab('PRINT')} />
          <MenuItem icon="fas fa-sync" label="Backup & Restore" shortcut="Alt+K" active={activeTab === 'BACKUP'} onClick={() => setActiveTab('BACKUP')} />
          <MenuItem icon="fas fa-file-import" label="Import & Export" shortcut="Alt+I" active={activeTab === 'IMPORT'} onClick={() => setActiveTab('IMPORT')} />

          <MenuItem icon="fas fa-sign-out-alt" label="Logout" shortcut="Alt+L" className="dash-logout-btn" onClick={handleLogout} />
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-nav">
          <div className="command-center">
            <i className="fas fa-bolt" style={{ color: 'var(--tally-yellow)' }}></i>
            <input type="text" placeholder="Go To... (Alt+G)" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative' }} ref={profileRef}>
            <button className="theme-toggle" onClick={toggleTheme}>
              <i className={isDarkMode ? "fas fa-moon" : "fas fa-sun"}></i>
              <span>{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
            </button>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', fontWeight: '800' }}>{user.companyName}</p>
              <p style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: '700' }}>FY 2025-26 | Patna</p>
            </div>

            <div
              className="dash-profile-avatar"
              onClick={(e) => { e.stopPropagation(); setIsProfileOpen(!isProfileOpen); }}
              title={user.name}
            >
              {user.initials}
            </div>

            <div className={`dash-profile-popup ${isProfileOpen ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
              <div className="dash-profile-header">
                <div className="dash-profile-avatar large">
                  {user.initials}
                </div>
                <div className="dash-profile-info">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                </div>
              </div>
              <div className="dash-profile-menu">
                <button className="dash-menu-item" onClick={() => { setIsProfileOpen(false); setSettingsModalTitle('Change Photo'); setSettingsModalOpen(true); }}>
                  Change Photo
                </button>
                <button className="dash-menu-item" onClick={() => { setIsProfileOpen(false); setSettingsModalTitle('Company Settings'); setSettingsModalOpen(true); }}>
                  Company Settings
                </button>
                <button className="dash-menu-item" onClick={() => { setIsProfileOpen(false); setSettingsModalTitle('User Preferences'); setSettingsModalOpen(true); }}>
                  User Preferences
                </button>
                <div className="dash-divider"></div>
                <button className="dash-menu-item dash-logout" onClick={handleLogout}>
                  Secure Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {settingsModalOpen && (
          <div className="settings-modal-overlay" onClick={() => setSettingsModalOpen(false)}>
            <div className="settings-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="settings-close-btn" onClick={() => setSettingsModalOpen(false)}><i className="fas fa-times"></i></button>
              <h2>{settingsModalTitle}</h2>
              <div className="settings-modal-body">
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <i className={`fas ${settingsModalTitle === 'Change Photo' ? 'fa-camera' : settingsModalTitle === 'Company Settings' ? 'fa-building' : 'fa-user-shield'}`} style={{ fontSize: '48px', color: 'var(--accent-blue)', marginBottom: '20px' }}></i>
                  <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Integration Pending</h3>
                  <p style={{ color: 'var(--text-dim)' }}>This module ({settingsModalTitle}) is currently being linked to the backend database. Full functionality will be available in the next release!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="dashboard-container">
          {activeTab === 'DASHBOARD' ? (
            <>
              <div className="card">
                <div className="card-title">Total Receivables <i className="fas fa-arrow-trend-up" style={{ color: 'var(--accent-green)' }}></i></div>
                <div className="insights-grid">
                  <div className="circle-chart"></div>
                  <div>
                    <div className="big-amt">₹ 3,84,500.00</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                      <span style={{ color: 'var(--accent-blue)' }}><i className="fas fa-check-circle"></i> On Time: <b>₹3,42,250</b></span>
                      <span style={{ color: 'var(--tally-yellow)' }}><i className="fas fa-exclamation-circle"></i> Overdue: <b>₹42,250</b></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-title">Total Payables <i className="fas fa-arrow-trend-down" style={{ color: 'var(--accent-red)' }}></i></div>
                <div className="insights-grid">
                  <div className="circle-chart payables-chart"></div>
                  <div>
                    <div className="big-amt">₹ 22,54,500.00</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text-dim)' }}><i className="fas fa-clock"></i> Pending: <b>₹2,42,250</b></span>
                      <span style={{ color: 'var(--accent-red)' }}><i className="fas fa-bolt"></i> Critical: <b>₹12,250</b></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card cash-flow-container" style={{ display: 'flex', gap: '20px', minHeight: '350px', gridColumn: 'span 2' }}>
                <div style={{ flex: 3, display: 'flex', flexDirection: 'column' }}>
                  <div className="card-title" style={{ marginBottom: '10px' }}>CASH FLOW</div>
                  <div style={{ flex: 1, width: '100%', minHeight: '280px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: 'APR', v: 300 }, { name: 'MAY', v: 1000 }, { name: 'JUN', v: 1000 },
                        { name: 'JUL', v: 1000 }, { name: 'AUG', v: 1100 }, { name: 'SEP', v: 1500 },
                        { name: 'OCT', v: 1700 }, { name: 'NOV', v: 1800 }, { name: 'DEC', v: 1950 },
                        { name: 'JAN', v: 2000 }, { name: 'FEB', v: 2050 }, { name: 'MAR', v: 2100 }
                      ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2f81f7" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#2f81f7" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#30363d" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8b949e' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8b949e' }} tickFormatter={(v) => `${v}K`} />
                        <Tooltip contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d' }} />
                        <Area type="monotone" dataKey="v" stroke="#2f81f7" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ flex: 1.2, borderLeft: '1px solid var(--border)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '15px' }}>
                  <div style={{ textAlign: 'right' }}><p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Cash as on 01-04-23</p><p style={{ fontSize: '16px', fontWeight: '800' }}>₹ 42,250.11</p></div>
                  <div style={{ textAlign: 'right' }}><p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Incoming</p><p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent-green)' }}>₹ 1,11,53,838.29 +</p></div>
                  <div style={{ textAlign: 'right' }}><p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Outgoing</p><p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent-red)' }}>₹ 1,23,59,118.12 -</p></div>
                  <div style={{ textAlign: 'right', borderTop: '1px solid var(--border)', paddingTop: '10px' }}><p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Cash as on 31-03-24</p><p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent-blue)' }}>₹ 15,41,933.67 =</p></div>
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

const MenuItem = ({ icon, label, onClick, className = '', shortcut = '', active = false }) => (
  <div className="menu-item">
    <button className={`nav-btn ${className} ${active ? 'active' : ''}`} onClick={onClick}>
      <i className={icon}></i> {label}
      {shortcut && <span className="shortcut-badge">{shortcut}</span>}
    </button>
  </div>
);

export default Dashboard;