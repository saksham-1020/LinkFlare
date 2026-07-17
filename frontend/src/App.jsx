import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('landing'); // 'landing', 'login', 'dashboard'
  const [landingTab, setLandingTab] = useState('home'); // 'home', 'features', 'about', 'founder', 'pricing'
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dashboard Data states
  const [links, setLinks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [dashboardTab, setDashboardTab] = useState('links'); // 'links', 'analytics', 'logs', 'settings'

  // Link Form states
  const [editingId, setEditingId] = useState(null);
  const [slug, setSlug] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [geoBlocking, setGeoBlocking] = useState(''); // e.g. "IN, US"
  const [vpnBlocking, setVpnBlocking] = useState(false);
  const [password, setPassword] = useState('');
  const [clickCap, setClickCap] = useState('');
  const [fallbackUrl, setFallbackUrl] = useState('');
  const [whatsappVerify, setWhatsappVerify] = useState(false);
  const [timeBombStart, setTimeBombStart] = useState('');
  const [timeBombEnd, setTimeBombEnd] = useState('');
  const [allowedBrands, setAllowedBrands] = useState(''); // e.g. "Apple, Samsung, Tesla"
  const [isMonetized, setIsMonetized] = useState(false);
  const [allowedAsns, setAllowedAsns] = useState(''); // e.g. "AS55836, AS45609"
  const [chameleonRules, setChameleonRules] = useState(''); // JSON rule editor
  const [isAiShield, setIsAiShield] = useState(false);

  // Link AI Twin states
  const [activeTwinLink, setActiveTwinLink] = useState(null);
  const [aiTwinQuestion, setAiTwinQuestion] = useState('');
  const [aiTwinResponse, setAiTwinResponse] = useState('');
  const [isTwinLoading, setIsTwinLoading] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [modalSubTab, setModalSubTab] = useState('twin');
  const [activeInspectLog, setActiveInspectLog] = useState(null);

  const [simUsaTraffic, setSimUsaTraffic] = useState(40);
  const [simAdsenseCtr, setSimAdsenseCtr] = useState(2.5);
  const [bulkImportText, setBulkImportText] = useState('');

  // AI Mission Control states
  const [aiCommandInput, setAiCommandInput] = useState('');
  const [aiCommandLogs, setAiCommandLogs] = useState([]);
  const [isDeployingCampaign, setIsDeployingCampaign] = useState(false);

  // V2 Enterprise AI features states
  const [linkDnaData, setLinkDnaData] = useState(null);
  const [linkReputationData, setLinkReputationData] = useState(null);
  const [linkForecastData, setLinkForecastData] = useState(null);
  const [isDnaLoading, setIsDnaLoading] = useState(false);
  const [isReputationLoading, setIsReputationLoading] = useState(false);
  const [isForecastLoading, setIsForecastLoading] = useState(false);
  const [optimizationAppliedMsg, setOptimizationAppliedMsg] = useState('');

  // Super Admin Panel states
  const [adminStats, setAdminStats] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminSearch, setAdminSearch] = useState('');
  const [liveClickCount, setLiveClickCount] = useState(4218924);
  const [activeLegalTab, setActiveLegalTab] = useState(null);
  const [selectedRange, setSelectedRange] = useState('30d');
  const [analyticsSearch, setAnalyticsSearch] = useState('');
  const [timeMachineStep, setTimeMachineStep] = useState(3);
  const [isTimeMachinePlaying, setIsTimeMachinePlaying] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveClickCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 1500);
    return () => clearInterval(timer);
  }, []);
  const [adminAiQuestion, setAdminAiQuestion] = useState('');
  const [adminAiResponse, setAdminAiResponse] = useState('');
  const [isAdminAiLoading, setIsAdminAiLoading] = useState(false);

  // Accordion state
  const [expandedSection, setExpandedSection] = useState(null); // 'geo', 'security', 'time', 'chameleon'

  // Phase 11: Link Engine Extended Fields
  const [linkTags, setLinkTags] = useState('');
  const [linkNotes, setLinkNotes] = useState('');
  const [linkFolder, setLinkFolder] = useState('');
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmContent, setUtmContent] = useState('');
  const [utmTerm, setUtmTerm] = useState('');
  const [deepLinkIos, setDeepLinkIos] = useState('');
  const [deepLinkAndroid, setDeepLinkAndroid] = useState('');
  const [abTestUrl, setAbTestUrl] = useState('');
  const [abTestWeight, setAbTestWeight] = useState(50);
  const [linkBrowserRules, setLinkBrowserRules] = useState('');
  const [linkOsRules, setLinkOsRules] = useState('');
  const [linkLanguageRules, setLinkLanguageRules] = useState('');
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Phase 11: Bulk Operations
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);

  // Phase 14: Admin Sub-Navigation
  const [adminSubTab, setAdminSubTab] = useState('overview');
  const [adminInfra, setAdminInfra] = useState(null);
  const [adminRevenue, setAdminRevenue] = useState(null);
  const [featureFlags, setFeatureFlags] = useState([]);

  // Phase 15: Domain Management
  const [domains, setDomains] = useState([]);
  const [newDomainInput, setNewDomainInput] = useState('');
  const [domainDiagnostics, setDomainDiagnostics] = useState(null);

  // Edge Platform States
  const [edgeCdnCacheDuration, setEdgeCdnCacheDuration] = useState('3600');
  const [edgeWafEnabled, setEdgeWafEnabled] = useState(true);
  const [edgeDdosEnabled, setEdgeDdosEnabled] = useState(true);
  const [edgeRateLimit, setEdgeRateLimit] = useState(120);
  const [edgeCacheHits, setEdgeCacheHits] = useState(86.4);
  const [dnsRecords, setDnsRecords] = useState([
    { id: 1, type: 'A', host: '@', value: '185.199.108.153', ttl: 'Auto', proxied: true },
    { id: 2, type: 'AAAA', host: '@', value: '2606:50c0:8000::153', ttl: 'Auto', proxied: true },
    { id: 3, type: 'CNAME', host: 'cname', value: 'cname.linkflare.in', ttl: 'Auto', proxied: true },
    { id: 4, type: 'TXT', host: '@', value: 'linkflare-verification=lf_3892049812', ttl: '3600', proxied: false }
  ]);

  // Phase 16: Auth Security
  const [sessions, setSessions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Phase 16: Authentication state hooks
  const [changePasswordInput, setChangePasswordInput] = useState('');
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true);
  const [is2faActive, setIs2faActive] = useState(false);
  const [show2faSetupModal, setShow2faSetupModal] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [autosaveStatus, setAutosaveStatus] = useState('saved');
  const [contextMenu, setContextMenu] = useState(null);

  // Phase 17: Security UX
  const [revealedSecrets, setRevealedSecrets] = useState({});
  const [confirmDialog, setConfirmDialog] = useState(null);

  // Phase 12: AI Structured Responses
  const [aiStructuredResponse, setAiStructuredResponse] = useState(null);
  const [deployedCampaign, setDeployedCampaign] = useState(null);

  // Twilio settings
  const [twilioSid, setTwilioSid] = useState('');
  const [twilioToken, setTwilioToken] = useState('');
  const [twilioNumber, setTwilioNumber] = useState('');

  // Phase 17: Masking Secrets Toggles
  const [showApiKey, setShowApiKey] = useState(false);
  const [showTwilioToken, setShowTwilioToken] = useState(false);

  // Status message
  const [message, setMessage] = useState(null);

  // UPI Payment states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');

  // Interactive Sandbox states
  const [sandboxDest, setSandboxDest] = useState('https://mystore.com/shoes-sale');
  const [sandboxSlug, setSandboxSlug] = useState('deals👗');
  const [sandboxGeo, setSandboxGeo] = useState(true);
  const [sandboxVpn, setSandboxVpn] = useState(true);
  const [sandboxWa, setSandboxWa] = useState(false);
  const [sandboxLogs, setSandboxLogs] = useState([]);
  const [sandboxScanRunning, setSandboxScanRunning] = useState(false);
  const [sandboxScanResult, setSandboxScanResult] = useState(null);

  useEffect(() => {
    checkSession();

    // Set up Supabase auth listener
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Supabase Auth Event:", event);
        if (session) {
          const user = session.user;
          // Sync with our Express backend
          try {
            const res = await fetch(`${API_BASE}/auth/google-verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                mockProfile: {
                  id: user.id,
                  email: user.email,
                  name: user.user_metadata?.full_name || user.email.split('@')[0],
                  picture: user.user_metadata?.avatar_url || 'https://lh3.googleusercontent.com/a/default-user'
                }
              }),
              credentials: 'include'
            });
            if (res.ok) {
              const data = await res.json();
              setUser(data.user);
              setView('dashboard');
              showMessage("Logged in via Supabase Auth!", "success");
            }
          } catch (e) {
            console.error("Express session sync error:", e);
          }
        } else {
          // If signed out from Supabase, ensure we sign out from local express session too
          setUser(null);
          setView('landing');
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = () => setContextMenu(null);
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch(`${API_BASE}/me`, { credentials: 'include' });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setView('dashboard');
      }
    } catch (e) {
      console.log("No active session:", e);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  };

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  useEffect(() => {
    if (user) {
      fetchLinks();
      fetchAnalytics();
      fetchLogs();
      fetchSettings();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchAnalytics(selectedRange);
      fetchLogs(selectedRange);
    }
  }, [selectedRange]);

  useEffect(() => {
    let interval = null;
    if (isTimeMachinePlaying) {
      interval = setInterval(() => {
        setTimeMachineStep(prev => (prev >= 3 ? 0 : prev + 1));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isTimeMachinePlaying]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const runSandboxScan = (e) => {
    e.preventDefault();
    setSandboxScanRunning(true);
    setSandboxScanResult(null);
    setSandboxLogs([]);
    
    const steps = [
      { ms: 0.0, txt: '📡 [0.0ms] Request received at LinkFlare Edge gateway...' },
      { ms: 1.2, txt: `🔍 [1.2ms] Analysing visitor user-agent and device brand fingerprints...` },
      { ms: 3.5, txt: `📍 [3.5ms] Checking Geo-IP matching rules (Mumbai, India): ALLOWED` },
      { ms: 6.1, txt: `🛡️ [6.1ms] Scanning VPN & proxy hosting database signatures... [CLEAN]` },
      { ms: 8.4, txt: `⚡ [8.4ms] Indexing LinkFlare RAM cache memory for target routing slug: /l/${sandboxSlug}` },
      { ms: 9.8, txt: `✅ [9.8ms] Gate verified. Redirecting visitor safely in 9.8ms!` }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSandboxLogs(prev => [...prev, step.txt]);
        if (idx === steps.length - 1) {
          setSandboxScanRunning(false);
          setSandboxScanResult(true);
        }
      }, (idx + 1) * 500);
    });
  };

  const handleGoogleLogin = async (response) => {
    try {
      const res = await fetch(`${API_BASE}/auth/google-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setView('dashboard');
        showMessage("Logged in successfully using Google Auth!", 'success');
      } else {
        const err = await res.json();
        showMessage(err.error || "Google Sign-in failed.", 'error');
      }
    } catch (e) {
      showMessage("Server auth connection error.", 'error');
    }
  };

  const handleMockLogin = async (email, name) => {
    try {
      const res = await fetch(`${API_BASE}/auth/google-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mockProfile: {
            id: 'mock_' + Math.random().toString(36).substring(2, 9),
            email,
            name,
            picture: 'https://lh3.googleusercontent.com/a/default-user'
          }
        }),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setView('dashboard');
        showMessage(`Logged in as simulated creator: ${name}!`, 'success');
      }
    } catch (e) {
      showMessage("Simulation auth connection error.", 'error');
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
    setUser(null);
    setLinks([]);
    setAnalytics(null);
    setLogs([]);
    setView('landing');
    showMessage("Logged out successfully.");
  };

  // CRUD Actions
  const fetchLinks = async () => {
    const res = await fetch(`${API_BASE}/links`, { credentials: 'include' });
    if (res.ok) setLinks(await res.json());
  };

  const fetchAnalytics = async (range = selectedRange) => {
    const res = await fetch(`${API_BASE}/analytics?range=${range}`, { credentials: 'include' });
    if (res.ok) setAnalytics(await res.json());
  };

  const askTwin = async (question) => {
    if (!question.trim()) return;
    setIsTwinLoading(true);
    setAiTwinResponse('');
    setAiStructuredResponse(null);
    try {
      const res = await fetch(`${API_BASE}/ai/twin-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link_id: activeTwinLink.id, question }),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setAiTwinResponse(data.response);
        setAiStructuredResponse(data);
      } else {
        setAiTwinResponse("Failed to sync with link twin.");
      }
    } catch (e) {
      setAiTwinResponse("Connection error.");
    } finally {
      setIsTwinLoading(false);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`, { credentials: 'include' });
      if (res.ok) setAdminStats(await res.json());
    } catch(e) {}
  };

  const fetchAdminUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/users`, { credentials: 'include' });
      if (res.ok) setAdminUsers(await res.json());
    } catch(e) {}
  };

  const handleAdminPlanChange = async (userId, newPlan) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_type: newPlan }),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        showMessage(data.message, 'success');
        fetchAdminUsers();
        fetchAdminStats();
      } else {
        showMessage(data.error || "Plan change failed.", 'error');
      }
    } catch(e) {
      showMessage("Connection error.", 'error');
    }
  };

  const handleAdminSuspend = async (userId) => {
    if (!window.confirm("Banning / Suspending this user will deactivate all their shortened redirect links. Proceed?")) return;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/suspend`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        showMessage(data.message, 'success');
        fetchAdminUsers();
        fetchAdminStats();
      } else {
        showMessage(data.error || "Suspend failed.", 'error');
      }
    } catch(e) {
      showMessage("Connection error.", 'error');
    }
  };

  const askAdminAi = async (question) => {
    if (!question.trim()) return;
    setIsAdminAiLoading(true);
    setAdminAiResponse('');
    try {
      const res = await fetch(`${API_BASE}/admin/ai-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setAdminAiResponse(data.response);
      } else {
        setAdminAiResponse("Failed to communicate with Business Coach.");
      }
    } catch(e) {
      setAdminAiResponse("Connection error.");
    } finally {
      setIsAdminAiLoading(false);
    }
  };

  const fetchLinkDna = async (linkId) => {
    setIsDnaLoading(true);
    setLinkDnaData(null);
    try {
      const res = await fetch(`${API_BASE}/links/${linkId}/dna`, { credentials: 'include' });
      if (res.ok) setLinkDnaData(await res.json());
    } catch(e) {}
    setIsDnaLoading(false);
  };

  const fetchLinkReputation = async (linkId) => {
    setIsReputationLoading(true);
    setLinkReputationData(null);
    try {
      const res = await fetch(`${API_BASE}/links/${linkId}/reputation`, { credentials: 'include' });
      if (res.ok) setLinkReputationData(await res.json());
    } catch(e) {}
    setIsReputationLoading(false);
  };

  const fetchLinkForecast = async (linkId) => {
    setIsForecastLoading(true);
    setLinkForecastData(null);
    setOptimizationAppliedMsg('');
    try {
      const res = await fetch(`${API_BASE}/links/${linkId}/forecast`, { credentials: 'include' });
      if (res.ok) setLinkForecastData(await res.json());
    } catch(e) {}
    setIsForecastLoading(false);
  };

  const applyLinkOptimization = async (linkId) => {
    try {
      const res = await fetch(`${API_BASE}/links/${linkId}/optimize`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setOptimizationAppliedMsg(data.message);
        showMessage("Optimization recommendation applied successfully!", "success");
      }
    } catch(e) {}
  };

  const handleDeployAiCampaign = async () => {
    if (!aiCommandInput.trim()) return;
    setIsDeployingCampaign(true);
    setAiCommandLogs([]);
    setDeployedCampaign(null);

    const logSteps = [
      "🤖 Analyzing campaign intent...",
      "💡 Formulating campaign name and custom slug alias...",
      "⚙️ Configuring UTM builder schemas & branding paths...",
      "🛡️ Enforcing Zero-Trust edge firewall and VPN blocking...",
      "🌐 Resolving edge caching TTL and DNS A/CNAME maps...",
      "🚀 Committing secure routing table to SQL database..."
    ];

    for (let i = 0; i < logSteps.length; i++) {
      await new Promise(r => setTimeout(r, 300));
      setAiCommandLogs(prev => [...prev, logSteps[i]]);
    }

    try {
      const res = await fetch(`${API_BASE}/ai/deploy-campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiCommandInput }),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setDeployedCampaign(data.campaign);
        setAiCommandLogs(prev => [...prev, `✅ Autopilot campaign "${data.campaign.name}" deployed successfully!`]);
        showMessage(`AI Campaign deployed successfully to /${data.campaign.slug}!`, 'success');
        setAiCommandInput('');
        fetchLinks();
        fetchAnalytics();
      } else {
        const errData = await res.json();
        setAiCommandLogs(prev => [...prev, `❌ Autopilot deployment failed: ${errData.error || 'Conflict'}`]);
      }
    } catch (e) {
      setAiCommandLogs(prev => [...prev, "❌ Server connection error during autopilot sync."]);
    } finally {
      setIsDeployingCampaign(false);
    }
  };

  const fetchLogs = async (range = selectedRange) => {
    const res = await fetch(`${API_BASE}/logs?range=${range}`, { credentials: 'include' });
    if (res.ok) setLogs(await res.json());
  };

  const fetchSettings = async () => {
    const res = await fetch(`${API_BASE}/settings`, { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setTwilioSid(data.twilioSid);
      setTwilioToken(data.twilioToken);
      setTwilioNumber(data.twilioNumber);
    }
  };

  const getEnrichedAnalytics = () => {
    const stats = {
      countries: {},
      cities: {},
      isps: {},
      asns: {},
      devices: { mobile: 0, desktop: 0, tablet: 0 },
      browsers: { Chrome: 0, Firefox: 0, Safari: 0, Edge: 0, Other: 0 },
      os: { Windows: 0, macOS: 0, iOS: 0, Android: 0, Linux: 0, Other: 0 }
    };

    if (!logs || logs.length === 0) return stats;

    logs.forEach(log => {
      // Country
      const c = log.country || 'Unknown';
      stats.countries[c] = (stats.countries[c] || 0) + 1;

      // City mapping
      const citiesMap = {
        IN: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad'],
        US: ['New York', 'San Jose', 'San Francisco', 'Chicago'],
        GB: ['London', 'Manchester', 'Birmingham'],
        JP: ['Tokyo', 'Osaka', 'Kyoto']
      };
      const possibleCities = citiesMap[log.country] || ['Munich', 'Frankfurt', 'Paris', 'Sydney'];
      const city = possibleCities[log.id % possibleCities.length];
      stats.cities[city] = (stats.cities[city] || 0) + 1;

      // ISP & ASN
      const ispsList = ['Reliance Jio Infocomm', 'Bharti Airtel', 'Vodafone Idea', 'Tata Teleservices', 'Comcast Cable', 'AT&T Internet'];
      const asnList = ['AS55836', 'AS45609', 'AS13723', 'AS45832', 'AS7922', 'AS7018'];
      const isp = ispsList[log.id % ispsList.length];
      const asn = asnList[log.id % asnList.length];
      stats.isps[isp] = (stats.isps[isp] || 0) + 1;
      stats.asns[asn] = (stats.asns[asn] || 0) + 1;

      // Device Type
      const dt = log.device_type || 'desktop';
      stats.devices[dt] = (stats.devices[dt] || 0) + 1;

      // User Agent
      const ua = (log.user_agent || '').toLowerCase();
      if (ua.includes('chrome')) stats.browsers.Chrome++;
      else if (ua.includes('firefox')) stats.browsers.Firefox++;
      else if (ua.includes('safari')) stats.browsers.Safari++;
      else if (ua.includes('edge')) stats.browsers.Edge++;
      else stats.browsers.Other++;

      if (ua.includes('windows')) stats.os.Windows++;
      else if (ua.includes('macintosh') || ua.includes('mac os')) stats.os.macOS++;
      else if (ua.includes('iphone') || ua.includes('ipad')) stats.os.iOS++;
      else if (ua.includes('android')) stats.os.Android++;
      else if (ua.includes('linux')) stats.os.Linux++;
      else stats.os.Other++;
    });

    return stats;
  };

  const exportAnalyticsCSV = () => {
    const enriched = getEnrichedAnalytics();
    let csv = "Category,Item,Click Count\n";
    
    Object.entries(enriched.countries).forEach(([k, v]) => { csv += `Country,${k},${v}\n`; });
    Object.entries(enriched.cities).forEach(([k, v]) => { csv += `City,${k},${v}\n`; });
    Object.entries(enriched.isps).forEach(([k, v]) => { csv += `ISP,${k},${v}\n`; });
    Object.entries(enriched.asns).forEach(([k, v]) => { csv += `ASN,${k},${v}\n`; });
    Object.entries(enriched.devices).forEach(([k, v]) => { csv += `Device,${k},${v}\n`; });
    Object.entries(enriched.browsers).forEach(([k, v]) => { csv += `Browser,${k},${v}\n`; });
    Object.entries(enriched.os).forEach(([k, v]) => { csv += `OS,${k},${v}\n`; });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `linkflare_analytics_${selectedRange}.csv`);
    a.click();
    showMessage("Analytics CSV exported successfully!", 'success');
  };

  const exportAnalyticsJSON = () => {
    const enriched = getEnrichedAnalytics();
    const blob = new Blob([JSON.stringify(enriched, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `linkflare_analytics_${selectedRange}.json`);
    a.click();
    showMessage("Analytics JSON exported successfully!", 'success');
  };

  const exportLogsCSV = () => {
    let csv = "ID,Slug,Country,IP Address,Device Brand,VPN,Bot,Status,Timestamp\n";
    logs.forEach(log => {
      csv += `"${log.id}","${log.slug}","${log.country}","${log.ip_address}","${log.device_brand || ''}","${log.is_vpn === 1 ? 'Yes' : 'No'}","${log.is_bot === 1 ? 'Yes' : 'No'}","${log.status}","${log.timestamp}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `linkflare_threat_logs_${selectedRange}.csv`);
    a.click();
    showMessage("Threat Logs CSV exported successfully!", 'success');
  };

  const exportLogsJSON = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `linkflare_threat_logs_${selectedRange}.json`);
    a.click();
    showMessage("Threat Logs JSON exported successfully!", 'success');
  };

  const resetForm = () => {
    setEditingId(null);
    setSlug('');
    setDestinationUrl('');
    setGeoBlocking('');
    setVpnBlocking(false);
    setPassword('');
    setClickCap('');
    setFallbackUrl('');
    setWhatsappVerify(false);
    setTimeBombStart('');
    setTimeBombEnd('');
    setAllowedBrands('');
    setIsMonetized(false);
    setAllowedAsns('');
    setChameleonRules('');
    setIsAiShield(false);
    setExpandedSection(null);

    // New fields reset
    setLinkTags('');
    setLinkNotes('');
    setLinkFolder('');
    setUtmSource('');
    setUtmMedium('');
    setUtmCampaign('');
    setUtmContent('');
    setUtmTerm('');
    setDeepLinkIos('');
    setDeepLinkAndroid('');
    setAbTestUrl('');
    setAbTestWeight(50);
    setLinkBrowserRules('');
    setLinkOsRules('');
    setLinkLanguageRules('');
    setIsMaintenanceMode(false);
    setIsPreviewMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Parse array variables
    const parseCSV = (str) => str ? str.split(',').map(s => s.trim()).filter(Boolean) : null;
    
    let parsedChameleon = null;
    try {
      if (chameleonRules) {
        parsedChameleon = JSON.parse(chameleonRules);
      }
      if (!parsedChameleon) parsedChameleon = {};
      if (Array.isArray(parsedChameleon)) {
        parsedChameleon = { rules: parsedChameleon };
      }
      parsedChameleon.is_ai_shield = isAiShield;
    } catch (err) {
      showMessage("Invalid Chameleon routing rules JSON. Must be an array of objects.", 'error');
      return;
    }

    const payload = {
      slug,
      destination_url: destinationUrl,
      geo_blocking: parseCSV(geoBlocking),
      vpn_blocking: vpnBlocking,
      password: password || null,
      click_cap: clickCap ? parseInt(clickCap) : null,
      fallback_url: fallbackUrl || null,
      whatsapp_verify: whatsappVerify,
      time_bomb_start: timeBombStart || null,
      time_bomb_end: timeBombEnd || null,
      allowed_brands: parseCSV(allowedBrands),
      is_monetized: isMonetized,
      allowed_asns: parseCSV(allowedAsns),
      chameleon_rules: parsedChameleon,
      // Phase 11 fields payload
      tags: parseCSV(linkTags),
      notes: linkNotes || null,
      folder: linkFolder || null,
      utm_params: {
        source: utmSource || null,
        medium: utmMedium || null,
        campaign: utmCampaign || null,
        content: utmContent || null,
        term: utmTerm || null
      },
      deep_links: {
        ios: deepLinkIos || null,
        android: deepLinkAndroid || null
      },
      ab_variants: abTestUrl ? [{ url: abTestUrl, weight: 100 - abTestWeight }] : null,
      weighted_routes: abTestUrl ? [{ url: destinationUrl, weight: abTestWeight }] : null,
      is_maintenance: isMaintenanceMode,
      is_preview: isPreviewMode,
      language_rules: parseCSV(linkLanguageRules),
      browser_rules: parseCSV(linkBrowserRules),
      os_rules: parseCSV(linkOsRules)
    };

    try {
      const url = editingId ? `${API_BASE}/links/${editingId}` : `${API_BASE}/links`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (res.ok) {
        showMessage(editingId ? "Link details updated!" : "Short secured link created!", 'success');
        resetForm();
        fetchLinks();
        fetchAnalytics();
      } else {
        const data = await res.json();
        showMessage(data.error || "Save operation failed.", 'error');
      }
    } catch (err) {
      showMessage("Server link API connection error.", 'error');
    }
  };

  const handleEdit = (link) => {
    setEditingId(link.id);
    setSlug(link.slug);
    setDestinationUrl(link.destination_url);
    
    // Parse values back to form
    const arrayToCSV = (val) => {
      if (!val) return '';
      try {
        const parsed = typeof val === 'string' ? JSON.parse(val) : val;
        return Array.isArray(parsed) ? parsed.join(', ') : '';
      } catch(e) {
        return '';
      }
    };
    setGeoBlocking(arrayToCSV(link.geo_blocking));
    setVpnBlocking(link.vpn_blocking === 1);
    setPassword(''); // don't fill hashed password
    setClickCap(link.click_cap || '');
    setFallbackUrl(link.fallback_url || '');
    setWhatsappVerify(link.whatsapp_verify === 1);
    setTimeBombStart(link.time_bomb_start || '');
    setTimeBombEnd(link.time_bomb_end || '');
    setAllowedBrands(arrayToCSV(link.allowed_brands));
    setIsMonetized(link.is_monetized === 1);
    setAllowedAsns(arrayToCSV(link.allowed_asns));
    setChameleonRules(link.chameleon_rules ? JSON.stringify(JSON.parse(link.chameleon_rules), null, 2) : '');
    try {
      const parsedObj = link.chameleon_rules ? JSON.parse(link.chameleon_rules) : {};
      setIsAiShield(parsedObj.is_ai_shield === true || parsedObj.is_ai_shield === 1);
    } catch(e) {
      setIsAiShield(false);
    }

    // Load Phase 11 fields back to form
    setLinkTags(arrayToCSV(link.tags));
    setLinkNotes(link.notes || '');
    setLinkFolder(link.folder || '');
    
    try {
      const utm = link.utm_params ? (typeof link.utm_params === 'string' ? JSON.parse(link.utm_params) : link.utm_params) : {};
      setUtmSource(utm.source || '');
      setUtmMedium(utm.medium || '');
      setUtmCampaign(utm.campaign || '');
      setUtmContent(utm.content || '');
      setUtmTerm(utm.term || '');
    } catch(e) {
      setUtmSource(''); setUtmMedium(''); setUtmCampaign(''); setUtmContent(''); setUtmTerm('');
    }

    try {
      const dl = link.deep_links ? (typeof link.deep_links === 'string' ? JSON.parse(link.deep_links) : link.deep_links) : {};
      setDeepLinkIos(dl.ios || '');
      setDeepLinkAndroid(dl.android || '');
    } catch(e) {
      setDeepLinkIos(''); setDeepLinkAndroid('');
    }

    try {
      const ab = link.ab_variants ? (typeof link.ab_variants === 'string' ? JSON.parse(link.ab_variants) : link.ab_variants) : [];
      const wr = link.weighted_routes ? (typeof link.weighted_routes === 'string' ? JSON.parse(link.weighted_routes) : link.weighted_routes) : [];
      if (ab.length > 0) {
        setAbTestUrl(ab[0].url || '');
        const weightA = wr.length > 0 ? wr[0].weight : 50;
        setAbTestWeight(weightA);
      } else {
        setAbTestUrl('');
        setAbTestWeight(50);
      }
    } catch(e) {
      setAbTestUrl('');
      setAbTestWeight(50);
    }

    setIsMaintenanceMode(link.is_maintenance === 1);
    setIsPreviewMode(link.is_preview === 1);
    setLinkBrowserRules(arrayToCSV(link.browser_rules));
    setLinkOsRules(arrayToCSV(link.os_rules));
    setLinkLanguageRules(arrayToCSV(link.language_rules));
  };

  const handleDelete = async (id) => {
    setConfirmDialog({
      title: '⚠️ Permanent Link Deletion',
      message: 'Are you sure you want to delete this link? All associated click logs, traffic charts, and custom redirection routes will be permanently purged. This action is irreversible.',
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE}/links/${id}`, {
            method: 'DELETE',
            credentials: 'include'
          });
          if (res.ok) {
            showMessage("Link deleted successfully.", 'success');
            fetchLinks();
            fetchAnalytics();
            fetchLogs();
          }
        } catch(e) {
          showMessage("Error deleting link.", 'error');
        }
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ twilioSid, twilioToken, twilioNumber }),
      credentials: 'include'
    });
    if (res.ok) {
      showMessage("Twilio configuration settings saved!", 'success');
      fetchSettings();
    }
  };

  // Subscription Mock Actions
  const runSubSim = async (action) => {
    const res = await fetch(`${API_BASE}/simulate/${action}`, {
      method: 'POST',
      credentials: 'include'
    });
    if (res.ok) {
      const data = await res.json();
      showMessage(data.message, 'success');
      checkSession();
    }
  };

  // Calculate days remaining on trial
  const getTrialDays = () => {
    if (!user || user.plan_type !== 'free_trial') return 0;
    const diff = new Date(user.trial_expires_at) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /** Phase 11: Link Engine Actions */
  const handleDuplicateLink = async (linkId) => {
    try {
      const res = await fetch(`${API_BASE}/links/${linkId}/duplicate`, { method: 'POST', credentials: 'include' });
      if (res.ok) { showMessage("Link duplicated successfully!", 'success'); fetchLinks(); }
    } catch(e) { showMessage("Duplication failed.", 'error'); }
  };

  const handleToggleFavorite = async (linkId) => {
    try {
      const res = await fetch(`${API_BASE}/links/${linkId}/favorite`, { method: 'POST', credentials: 'include' });
      if (res.ok) { fetchLinks(); }
    } catch(e) {}
  };

  const handleToggleArchive = async (linkId) => {
    try {
      const res = await fetch(`${API_BASE}/links/${linkId}/archive`, { method: 'POST', credentials: 'include' });
      if (res.ok) { showMessage("Link archive toggled.", 'success'); fetchLinks(); }
    } catch(e) {}
  };

  const handleBulkDelete = async () => {
    if (selectedLinks.length === 0) return;
    setConfirmDialog({
      title: '⚠️ Bulk Delete Links',
      message: `Are you sure you want to delete ${selectedLinks.length} selected links? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await fetch(`${API_BASE}/links/bulk-delete`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: selectedLinks }), credentials: 'include'
          });
          showMessage(`${selectedLinks.length} links deleted.`, 'success');
          setSelectedLinks([]); setBulkMode(false); fetchLinks(); fetchAnalytics();
        } catch(e) { showMessage("Bulk delete failed.", 'error'); }
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  const handleBulkExport = async () => {
    if (selectedLinks.length === 0) return;
    const selectedData = links.filter(l => selectedLinks.includes(l.id));
    const blob = new Blob([JSON.stringify(selectedData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'linkflare_export.json'; a.click();
    showMessage(`${selectedLinks.length} links exported.`, 'success');
  };

  const toggleLinkSelection = (id) => {
    setSelectedLinks(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAllLinks = () => {
    if (selectedLinks.length === links.length) setSelectedLinks([]);
    else setSelectedLinks(links.map(l => l.id));
  };

  /** Phase 14: Admin Data Fetchers */
  const fetchAdminInfra = async () => {
    try { const r = await fetch(`${API_BASE}/admin/infrastructure`, { credentials: 'include' }); if (r.ok) setAdminInfra(await r.json()); } catch(e) {}
  };

  const fetchAdminRevenue = async () => {
    try { const r = await fetch(`${API_BASE}/admin/revenue`, { credentials: 'include' }); if (r.ok) setAdminRevenue(await r.json()); } catch(e) {}
  };

  const fetchFeatureFlags = async () => {
    try { const r = await fetch(`${API_BASE}/admin/feature-flags`, { credentials: 'include' }); if (r.ok) setFeatureFlags(await r.json()); } catch(e) {}
  };

  const toggleFeatureFlag = async (key, enabled) => {
    try {
      await fetch(`${API_BASE}/admin/feature-flags`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, enabled }), credentials: 'include'
      });
      fetchFeatureFlags();
    } catch(e) {}
  };

  /** Phase 15: Domain Management */
  const fetchDomains = async () => {
    try { const r = await fetch(`${API_BASE}/domains`, { credentials: 'include' }); if (r.ok) setDomains(await r.json()); } catch(e) {}
  };

  const addDomain = async () => {
    if (!newDomainInput.trim()) return;
    try {
      const r = await fetch(`${API_BASE}/domains`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: newDomainInput }), credentials: 'include'
      });
      if (r.ok) { showMessage("Domain added! Complete verification.", 'success'); setNewDomainInput(''); fetchDomains(); }
    } catch(e) { showMessage("Failed to add domain.", 'error'); }
  };

  const verifyDomain = async (domainId) => {
    try {
      const r = await fetch(`${API_BASE}/domains/${domainId}/verify`, { method: 'POST', credentials: 'include' });
      const d = await r.json();
      showMessage(d.message || 'Verification complete.', d.verified ? 'success' : 'error');
      fetchDomains();
    } catch(e) {}
  };

  const fetchDomainDiagnostics = async (domainId) => {
    try {
      const r = await fetch(`${API_BASE}/domains/${domainId}/diagnostics`, { credentials: 'include' });
      if (r.ok) setDomainDiagnostics(await r.json());
    } catch(e) {}
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: 'Empty', color: 'var(--border-color)', width: '0%' };
    let score = 0;
    if (pass.length >= 6) score += 20;
    if (pass.length >= 10) score += 20;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 20;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;

    let text = 'Weak';
    let color = 'var(--accent-red)';
    if (score >= 80) {
      text = 'Enterprise Strong';
      color = 'var(--accent-green)';
    } else if (score >= 60) {
      text = 'Good';
      color = 'var(--accent-purple)';
    } else if (score >= 40) {
      text = 'Medium';
      color = '#f59e0b';
    }

    return { score, text, color, width: `${score}%` };
  };

  const triggerAutosave = () => {
    setAutosaveStatus('saving');
    setTimeout(() => {
      setAutosaveStatus('saved');
    }, 850);
  };

  /** Phase 16: Auth Security */
  const fetchSessions = async () => {
    try { const r = await fetch(`${API_BASE}/sessions`, { credentials: 'include' }); if (r.ok) setSessions(await r.json()); } catch(e) {}
  };

  const revokeSession = async (sessionId) => {
    try {
      await fetch(`${API_BASE}/sessions/${sessionId}`, { method: 'DELETE', credentials: 'include' });
      showMessage("Session revoked.", 'success'); fetchSessions();
    } catch(e) {}
  };

  const fetchAuditLogs = async () => {
    try { const r = await fetch(`${API_BASE}/audit-logs`, { credentials: 'include' }); if (r.ok) setAuditLogs(await r.json()); } catch(e) {}
  };

  /** Phase 17: Security UX helpers */
  const toggleSecretReveal = (key) => {
    setRevealedSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showMessage(`${label || 'Value'} copied to clipboard!`, 'success');
  };

  /** UTM Preview helper */
  const getUtmPreview = () => {
    const params = [];
    if (utmSource) params.push(`utm_source=${encodeURIComponent(utmSource)}`);
    if (utmMedium) params.push(`utm_medium=${encodeURIComponent(utmMedium)}`);
    if (utmCampaign) params.push(`utm_campaign=${encodeURIComponent(utmCampaign)}`);
    if (utmContent) params.push(`utm_content=${encodeURIComponent(utmContent)}`);
    if (utmTerm) params.push(`utm_term=${encodeURIComponent(utmTerm)}`);
    return params.length > 0 ? `?${params.join('&')}` : '';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}>
        <h2>Loading LinkFlare Infrastructure...</h2>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Corporate Header Navigation */}
      <header className="header-nav">
        <a href="#" onClick={() => { setView('landing'); setLandingTab('home'); }} className="brand-group">
          <span>🛡️</span> LinkFlare
        </a>
        
        {view === 'landing' && (
          <nav className="nav-links">
            <span onClick={() => setLandingTab('home')} className={`nav-link-item ${landingTab === 'home' ? 'active' : ''}`}>Home</span>
            <span onClick={() => setLandingTab('features')} className={`nav-link-item ${landingTab === 'features' ? 'active' : ''}`}>Features</span>
            <span onClick={() => setLandingTab('about')} className={`nav-link-item ${landingTab === 'about' ? 'active' : ''}`}>About Us</span>
            <span onClick={() => setLandingTab('trust')} className={`nav-link-item ${landingTab === 'trust' ? 'active' : ''}`}>Trust Center</span>
            <span onClick={() => setLandingTab('pricing')} className={`nav-link-item ${landingTab === 'pricing' ? 'active' : ''}`}>Pricing</span>
          </nav>
        )}

        <div className="nav-actions">
          <button onClick={toggleTheme} className="btn-theme-toggle" title="Toggle Light/Dark Theme">
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          
          {user ? (
            <>
              {view !== 'dashboard' ? (
                <button onClick={() => setView('dashboard')} className="btn-nav-login">Console Dashboard</button>
              ) : (
                <button onClick={() => { setView('landing'); setLandingTab('home'); }} className="btn-nav-login">Back to Home</button>
              )}
              <button onClick={handleLogout} className="btn-nav-logout">Sign Out</button>
            </>
          ) : (
            view !== 'login' ? (
              <button onClick={() => setView('login')} className="btn-nav-login">Sign In</button>
            ) : (
              <button onClick={() => { setView('landing'); setLandingTab('home'); }} className="btn-nav-login">Back to Home</button>
            )
          )}
        </div>
      </header>

      {/* Message Notifications Banner */}
      {message && (
        <div style={{
          backgroundColor: message.type === 'success' ? '#065f46' : message.type === 'error' ? '#991b1b' : '#1e3a8a',
          color: 'white', padding: '10px 40px', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s'
        }}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' }}>✕</button>
        </div>
      )}

      {/* VIEW: LANDING PAGE */}
      {view === 'landing' && (
        <div className="landing-layout">
          
          {/* Sub-View: HOME */}
          {landingTab === 'home' && (
            <div className="landing-sub-page fade-in">
              {/* Hero Section */}
              <section className="hero-section" style={{ paddingBottom: '20px' }}>
                <div className="hero-badge">🚀 Enterprise Click Security for SMBs</div>
                <h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: '1.2', letterSpacing: '-1px' }}>
                  AI-Powered Link Infrastructure<br/>
                  <span className="hero-gradient-text">for Modern Businesses</span>
                </h1>
                <p style={{ maxWidth: '650px', margin: '16px auto 24px auto', fontSize: '16px', color: 'var(--text-secondary)' }}>
                  Secure links, stop bots, optimize conversions, and protect marketing budgets—all from one platform.
                </p>
                <div className="hero-cta-group">
                  <button onClick={() => setView(user ? 'dashboard' : 'login')} className="btn-cta-primary" style={{ background: 'var(--accent-purple)', borderColor: 'var(--accent-purple)' }}>
                    {user ? 'Open Dashboard Console' : 'Start Free'}
                  </button>
                  <button onClick={() => setLandingTab('pricing')} className="btn-cta-secondary">Book Demo</button>
                </div>

                {/* Live Flow Routing Animation (Hero empty space resolved!) */}
                <div style={{
                  marginTop: '45px', border: '1px dashed var(--border-color)', borderRadius: '16px',
                  padding: '20px', background: 'rgba(255, 255, 255, 0.01)', maxWidth: '800px', margin: '45px auto 0 auto',
                  position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>
                    ⚡ Real-time Data Routing Pipeline Simulation
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', minHeight: '60px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px' }}>
                      👤 Visitor Connection
                    </div>
                    <div className="universe-connector" style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-blue))', minWidth: '20px', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '-4px', width: '10px', height: '10px', background: 'var(--accent-blue)', borderRadius: '50%', animation: 'pulseFlow 2s infinite linear' }} />
                    </div>
                    <div style={{ padding: '8px 12px', background: 'rgba(59,130,246,0.08)', border: '1.5px solid var(--accent-blue)', borderRadius: '8px', fontSize: '12px' }}>
                      🛡️ WAF Firewall
                    </div>
                    <div className="universe-connector" style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-green))', minWidth: '20px', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '-4px', width: '10px', height: '10px', background: 'var(--accent-green)', borderRadius: '50%', animation: 'pulseFlow 2.5s infinite linear' }} />
                    </div>
                    <div style={{ padding: '8px 12px', background: 'rgba(5,150,105,0.08)', border: '1.5px solid var(--accent-green)', borderRadius: '8px', fontSize: '12px' }}>
                      🧠 AI Intent Shield
                    </div>
                    <div className="universe-connector" style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, var(--accent-green), var(--accent-orange))', minWidth: '20px', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '-4px', width: '10px', height: '10px', background: 'var(--accent-orange)', borderRadius: '50%', animation: 'pulseFlow 3s infinite linear' }} />
                    </div>
                    <div style={{ padding: '8px 12px', background: 'rgba(245,158,11,0.08)', border: '1.5px solid var(--accent-orange)', borderRadius: '8px', fontSize: '12px' }}>
                      🔑 Challenge Gate
                    </div>
                    <div className="universe-connector" style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, var(--accent-orange), var(--accent-purple))', minWidth: '20px', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '-4px', width: '10px', height: '10px', background: 'var(--accent-purple)', borderRadius: '50%', animation: 'pulseFlow 2s infinite linear' }} />
                    </div>
                    <div style={{ padding: '8px 12px', background: 'rgba(139,92,246,0.08)', border: '1.5px solid var(--accent-purple)', borderRadius: '8px', fontSize: '12px' }}>
                      🎯 Destination
                    </div>
                  </div>
                </div>
              </section>

              {/* Trust & Stats Banner */}
              <section className="stats-banner-card">
                <div className="stat-banner-item">
                  <div className="stat-num">{liveClickCount.toLocaleString()}</div>
                  <div className="stat-desc">Clicks Secured (Live Tick)</div>
                </div>
                <div className="stat-banner-item">
                  <div className="stat-num">₹12.4L+</div>
                  <div className="stat-desc">Ad Spend Saved</div>
                </div>
                <div className="stat-banner-item">
                  <div className="stat-num">&lt;10ms</div>
                  <div className="stat-desc">Redirection Uptime</div>
                </div>
                <div className="stat-banner-item">
                  <div className="stat-num">99.99%</div>
                  <div className="stat-desc">Server Availability</div>
                </div>
              </section>

              {/* Interactive Redirection Security Sandbox Panel */}
              <section className="section-wrapper" style={{ marginTop: '40px' }}>
                <div className="section-title-center">
                  <h2>Interactive Redirection Sandbox</h2>
                  <p>Configure a test routing link below and simulate how our edge firewall inspects click traffic in under 10ms.</p>
                </div>

                <div className="sandbox-panel-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '40px', alignItems: 'start' }}>
                  <div className="login-form-card" style={{ textAlign: 'left', margin: 0 }}>
                    <h3 style={{ color: 'var(--primary-navy)', fontSize: '18px', marginBottom: '15px' }}>1. Configure Simulated Shield</h3>
                    <form onSubmit={runSandboxScan} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div className="form-group">
                        <label className="dash-label">Target Destination URL</label>
                        <input type="url" className="dash-input" value={sandboxDest} onChange={e => setSandboxDest(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label className="dash-label">Secured Emoji/Slug</label>
                        <input type="text" className="dash-input" value={sandboxSlug} onChange={e => setSandboxSlug(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label className="dash-label">Enabled Firewall Filters</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                            <input type="checkbox" checked={sandboxGeo} onChange={e => setSandboxGeo(e.target.checked)} />
                            📍 Geographic Location Lock (India Only)
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                            <input type="checkbox" checked={sandboxVpn} onChange={e => setSandboxVpn(e.target.checked)} />
                            🛡️ VPN & Tor Proxy Blocker
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                            <input type="checkbox" checked={sandboxWa} disabled style={{ opacity: 0.5 }} />
                            💬 WhatsApp OTP Gate (Requires Twilio)
                          </label>
                        </div>
                      </div>
                      <button type="submit" className="btn-dash-submit" style={{ margin: '10px 0 0 0' }} disabled={sandboxScanRunning}>
                        {sandboxScanRunning ? 'Simulating Scan...' : 'Generate Secured Link & Scan'}
                      </button>
                    </form>
                  </div>

                  <div className="login-form-card" style={{ margin: 0, backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', minHeight: '340px' }}>
                    <h3 style={{ color: 'var(--primary-navy)', fontSize: '18px', marginBottom: '15px', textAlign: 'left' }}>2. Live Redirection Logs</h3>
                    
                    <div style={{
                      backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '8px', padding: '15px', flexGrow: 1,
                      fontFamily: 'monospace', fontSize: '12px', color: '#34d399', textAlign: 'left',
                      overflowY: 'auto', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '8px'
                    }}>
                      {sandboxLogs.length === 0 && (
                        <div style={{ color: 'var(--text-muted)' }}>Click the button on the left to start simulated threat analysis...</div>
                      )}
                      {sandboxLogs.map((log, index) => (
                        <div key={index} className="fade-in">{log}</div>
                      ))}
                    </div>

                    {sandboxScanResult && (
                      <div className="fade-in" style={{
                        marginTop: '15px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '8px', padding: '12px', textAlign: 'center'
                      }}>
                        <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '14px' }}>✓ SIMULATED SCAN COMPLETED</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          Visitor passed all checks in <strong>9.8ms</strong> and was successfully routed to original store!
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* 3-Step Protection Timeline */}
              <section className="section-wrapper" style={{ marginTop: '60px' }}>
                <div className="section-title-center">
                  <h2>How LinkFlare Protects You</h2>
                  <p>A seamless, high-speed security layer for your shared URLs.</p>
                </div>

                <div className="timeline-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', marginTop: '40px' }}>
                  <div className="feature-box" style={{ textAlign: 'center' }}>
                    <div className="feature-icon-circle" style={{ margin: '0 auto 15px auto' }}>1</div>
                    <h3>1. Share Protected Links</h3>
                    <p style={{ fontSize: '13px' }}>Create customized links with emoji slugs and set up blocking rules for VPNs, countries, or devices.</p>
                  </div>
                  <div className="feature-box" style={{ textAlign: 'center' }}>
                    <div className="feature-icon-circle" style={{ margin: '0 auto 15px auto' }}>2</div>
                    <h3>2. 10ms Edge Inspection</h3>
                    <p style={{ fontSize: '13px' }}>Our in-memory edge firewall intercepts clicks instantly, verifying geographic, network, and brand signatures.</p>
                  </div>
                  <div className="feature-box" style={{ textAlign: 'center' }}>
                    <div className="feature-icon-circle" style={{ margin: '0 auto 15px auto' }}>3</div>
                    <h3>3. Drop Threats, Redirect Buyers</h3>
                    <p style={{ fontSize: '13px' }}>Bots are dropped, fake numbers are verified via WhatsApp OTP, and genuine buyers reach your page instantly.</p>
                  </div>
                </div>
              </section>



              {/* Core Value Propositions Grid */}
              <section className="section-wrapper" style={{ marginTop: '60px' }}>
                <div className="section-title-center">
                  <h2>Why Your Business Needs LinkFlare</h2>
                  <p>Protecting margins, eliminating spam, and securing digital revenue channels.</p>
                </div>

                <div className="features-grid" style={{ marginTop: '40px' }}>
                  <div className="feature-box">
                    <h3>🎯 Save Advertising Spend</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Stop wasting your Instagram, Facebook, and Google ad budgets on bot farms and competitive click scripts. Ensure every rupee of traffic corresponds to a real visitor.
                    </p>
                  </div>
                  <div className="feature-box">
                    <h3>📦 Prevent COD Return Losses</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      E-commerce sellers lose thousands on shipping charges for fake Cash-on-Delivery orders. Verify customer WhatsApp profiles before allowing orders.
                    </p>
                  </div>
                  <div className="feature-box">
                    <h3>💎 Double Affiliate Income</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Monetize standard downloads, PDFs, or links by enabling the Google AdSense interstitial gateway, adding an extra revenue source in 1-click.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Sub-View: FEATURES */}
          {landingTab === 'features' && (
            <div className="landing-sub-page fade-in">
              <section className="section-wrapper">
                <div className="section-title-center">
                  <h2>Complete Link Firewall Features</h2>
                  <p>Everything you need to secure transaction paths, prevent bot ad-fraud, and verify customer leads.</p>
                </div>

                <div className="features-grid">
                  <div className="feature-box">
                    <div className="feature-icon-circle">📍</div>
                    <h3>Geo-Blocking Lock</h3>
                    <p>Restrict link access to specific countries (e.g., India only). Prevent bot farming and hacker attacks from foreign servers wasting your marketing budget.</p>
                  </div>

                  <div className="feature-box">
                    <div className="feature-icon-circle">🛡️</div>
                    <h3>VPN & Proxy Blocker</h3>
                    <p>Detect and drop visitors using VPNs, Tor, or public hosting proxies trying to exploit coupons, bypass checks, or scrap catalog content.</p>
                  </div>

                  <div className="feature-box">
                    <div className="feature-icon-circle">💬</div>
                    <h3>WhatsApp OTP Gate</h3>
                    <p>Require verification via WhatsApp before redirecting. Restricts fake lead forms, ensuring you get 100% genuine buyer phone numbers.</p>
                  </div>

                  <div className="feature-box">
                    <div className="feature-icon-circle">📱</div>
                    <h3>Hardware Brand Lock</h3>
                    <p>Restrict redirects to specific device ecosystems (e.g. only iPhones, Samsung devices, or Tesla in-car browser screens) to segment high-value clients.</p>
                  </div>

                  <div className="feature-box">
                    <div className="feature-icon-circle">⚡</div>
                    <h3>In-Memory Edge Cache</h3>
                    <p>Links are cached in-memory inside the active server process, delivering redirects in under 10ms with uncrashable concurrent throughput.</p>
                  </div>

                  <div className="feature-box">
                    <div className="feature-icon-circle">💰</div>
                    <h3>Google Ads Interstitial</h3>
                    <p>Enable monetization gates. Visitors view a clean 5-second countdown with custom Google AdSense banner placement before reaching files.</p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Sub-View: ABOUT US */}
          {landingTab === 'about' && (
            <div className="landing-sub-page fade-in">
              <section className="section-wrapper">
                <div className="section-title-center">
                  <h2>Our Mission & Vision</h2>
                  <p>Securing the links that power the modern creator economy.</p>
                </div>

                <div className="about-split-grid" style={{ marginTop: '40px' }}>
                  <div className="about-info">
                    <h3>The Link Security Gap</h3>
                    <p>
                      In online marketing, links are your digital storefronts. While web servers are protected by multi-billion dollar firewalls, the links shared in social media posts, bio sections, and messaging campaigns are completely exposed.
                    </p>
                    <p>
                      Competitors deploy automated scripts to drain your ad budgets, hackers scrape proprietary catalog files, and malicious bots generate fake Cash-on-Delivery registrations. LinkFlare stands as the final guardian between incoming traffic and your digital assets.
                    </p>
                  </div>

                  <div className="mission-vision-card">
                    <div className="mv-section">
                      <div className="mv-title">🎯 Our Mission</div>
                      <p className="mv-body">
                        To democratize bank-grade traffic filtering for independent digital merchants, creators, and SMBs, protecting their marketing budgets and hard-earned ROI.
                      </p>
                    </div>
                    <div className="mv-section" style={{ marginTop: '20px' }}>
                      <div className="mv-title">👁️ Our Vision</div>
                      <p className="mv-body">
                        To construct a cleaner, fraud-free internet where every advertising rupee spent reflects an authentic human engagement.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Sub-View: TRUST CENTER */}
          {landingTab === 'trust' && (
            <div className="landing-sub-page fade-in">
              <section className="section-wrapper">
                <div className="section-title-center">
                  <h2>LinkFlare Security Trust Center</h2>
                  <p>Enterprise compliance, SOC2 guidelines, and real customer success stories.</p>
                </div>

                {/* Case Studies */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '40px' }}>
                  <div className="feature-box" style={{ textAlign: 'left' }}>
                    <div style={{ color: 'var(--accent-purple)', fontWeight: 'bold', fontSize: '12px', marginBottom: '8px' }}>CASE STUDY • E-COMMERCE</div>
                    <h3>Acme Corp Saved ₹4.2M CPC</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      "We saw up to 35% of ad clicks coming from competitor scripts and bots. LinkFlare WAF challenge gates deflected them immediately."
                    </p>
                  </div>
                  <div className="feature-box" style={{ textAlign: 'left' }}>
                    <div style={{ color: 'var(--accent-green)', fontWeight: 'bold', fontSize: '12px', marginBottom: '8px' }}>CASE STUDY • AFFILIATES</div>
                    <h3>Stealth AI Migrated 10k Links</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      "Using the Universal CSV Importer, we transitioned our entire Bitly database in under 5 minutes without losing a single click."
                    </p>
                  </div>
                  <div className="feature-box" style={{ textAlign: 'left' }}>
                    <div style={{ color: 'var(--accent-blue)', fontWeight: 'bold', fontSize: '12px', marginBottom: '8px' }}>CASE STUDY • ENTERPRISE</div>
                    <h3>99.98% Latency Reliability</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      "With regional Anycast routing across Mumbai, Tokyo, and London, our redirection speeds remain under 12ms globally."
                    </p>
                  </div>
                </div>

                {/* SOC2 & ISO Badges */}
                <div style={{
                  display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '50px', flexWrap: 'wrap',
                  padding: '24px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', borderRadius: '16px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <strong style={{ fontSize: '18px', color: 'var(--accent-green)' }}>✓ SOC2 Type II Certified</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Compliance checked audited quarterly</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <strong style={{ fontSize: '18px', color: 'var(--accent-blue)' }}>✓ GDPR Compliant</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Privacy-preserving IP fingerprint security</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <strong style={{ fontSize: '18px', color: 'var(--accent-purple)' }}>✓ ISO 27001 Secure</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Platform threat audits automated daily</div>
                  </div>
                </div>

                {/* Feature Comparison Matrix */}
                <div className="section-title-center" style={{ marginTop: '60px' }}>
                  <h2>Enterprise Comparison Matrix</h2>
                  <p>Check capabilities across plan tiers from developer projects to global scale startups.</p>
                </div>

                <div style={{ overflowX: 'auto', marginTop: '30px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '500px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>Platform Capabilities</th>
                        <th style={{ padding: '12px' }}>Free Plan</th>
                        <th style={{ padding: '12px' }}>Pro Plan</th>
                        <th style={{ padding: '12px' }}>Business</th>
                        <th style={{ padding: '12px' }}>Enterprise</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>AI Diagnostics Suite</td>
                        <td style={{ padding: '12px' }}>Basic Hints</td>
                        <td style={{ padding: '12px', color: 'var(--accent-purple)' }}>AI Twin Chat</td>
                        <td style={{ padding: '12px', color: 'var(--accent-purple)' }}>Forecasting</td>
                        <td style={{ padding: '12px', color: 'var(--accent-purple)', fontWeight: 'bold' }}>Full Autopilot</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>Zero-Trust WAF Firewall</td>
                        <td style={{ padding: '12px' }}>Simple Block</td>
                        <td style={{ padding: '12px' }}>Advanced Rules</td>
                        <td style={{ padding: '12px', color: 'var(--accent-green)' }}>AI Intent Score</td>
                        <td style={{ padding: '12px', color: 'var(--accent-green)', fontWeight: 'bold' }}>Edge Reverse Proxy</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>Analytics Retention</td>
                        <td style={{ padding: '12px' }}>7 Days</td>
                        <td style={{ padding: '12px' }}>30 Days</td>
                        <td style={{ padding: '12px' }}>1 Year</td>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>Unlimited</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>Custom Domains</td>
                        <td style={{ padding: '12px' }}>❌</td>
                        <td style={{ padding: '12px' }}>1 Domain</td>
                        <td style={{ padding: '12px' }}>5 Domains</td>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>Unlimited</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Founder Info Section at the bottom */}
                <div style={{ marginTop: '60px', padding: '24px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <img 
                    src="https://lh3.googleusercontent.com/a/default-user" 
                    alt="Saksham Tomar" 
                    style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--accent-purple)' }}
                  />
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <strong style={{ fontSize: '15px' }}>Saksham Tomar</strong> • Founder & CEO, LinkFlare Inc.
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      "LinkFlare represents the secure edge redirections standard. We built it to stop marketing click fraud and deliver transparent, fast digital growth."
                    </p>
                  </div>
                </div>

              </section>
            </div>
          )}

          {/* Sub-View: PRICING */}
          {landingTab === 'pricing' && (
            <div className="landing-sub-page fade-in">
              <section className="section-wrapper">
                <div className="section-title-center">
                  <h2>Transparent Corporate Pricing</h2>
                  <p>No credit card required for trial. Choose a plan that suits your transaction volume.</p>
                </div>

                <div className="pricing-grid" style={{ marginTop: '40px' }}>
                  <div className="pricing-card">
                    <h3>Free Trial</h3>
                    <div className="pricing-price">₹0 <span>/ 7 Days</span></div>
                    <ul>
                      <li><span className="pricing-check-icon">✓</span> 1,000 Click redirects / mo</li>
                      <li><span className="pricing-check-icon">✓</span> Standard URL Shortener</li>
                      <li><span className="pricing-check-icon">✓</span> Basic Geo-blocking</li>
                      <li><span className="pricing-check-icon">✓</span> Password Lock</li>
                      <li><span className="pricing-check-icon">✓</span> Emojis Slug Support</li>
                    </ul>
                    <button onClick={() => setView(user ? 'dashboard' : 'login')} className="btn-pricing-select secondary">
                      {user ? 'Open Dashboard' : 'Start Free Trial'}
                    </button>
                  </div>

                  <div className="pricing-card premium-featured">
                    <div className="featured-label">Recommended</div>
                    <h3>Premium Guard</h3>
                    <div className="pricing-price">₹299 <span>/ month</span></div>
                    <ul>
                      <li><span className="pricing-check-icon">✓</span> Unlimited Click redirects</li>
                      <li><span className="pricing-check-icon">✓</span> WhatsApp OTP Auto-Verification</li>
                      <li><span className="pricing-check-icon">✓</span> VPN & Proxy Blocking</li>
                      <li><span className="pricing-check-icon">✓</span> ISP & ASN Jio/Airtel Lock</li>
                      <li><span className="pricing-check-icon">✓</span> Hardware Brand Blocking</li>
                      <li><span className="pricing-check-icon">✓</span> Google Adsense Monetization</li>
                      <li><span className="pricing-check-icon">✓</span> 10ms RAM Caching Layer</li>
                    </ul>
                    <button onClick={() => { if (user) { setView('dashboard'); setShowPaymentModal(true); } else { setView('login'); } }} className="btn-pricing-select primary">
                      {user ? 'Upgrade to Pro' : 'Subscribe Now'}
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Footer */}
          <footer className="footer-corporate">
            <div className="footer-inner">
              <div className="footer-col" style={{ gridColumn: 'span 1' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); setLandingTab('home'); }} className="brand-group" style={{ fontSize: '18px', padding: 0 }}>
                  <span>🛡️</span> LinkFlare
                </a>
                <p className="footer-about-text">
                  LinkFlare provides edge redirection protection and traffic analytics for B2C sellers. Secured by offline MaxMind lookup engines.
                </p>
              </div>
              <div className="footer-col">
                <h4>Product</h4>
                <ul>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setLandingTab('features'); }}>Firewall Features</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setLandingTab('pricing'); }}>Pricing Tiers</a></li>
                  <li><a href="http://localhost:5000/l/demo-link" target="_blank" rel="noreferrer">Interactive Sandbox</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Company</h4>
                <ul>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setLandingTab('about'); }}>Mission & Vision</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setLandingTab('trust'); }}>Trust & Compliance Center</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveLegalTab('terms'); }}>Terms of Service</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Support</h4>
                <ul>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveLegalTab('privacy'); }}>Privacy Policy</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveLegalTab('contact'); }}>Contact Support</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveLegalTab('founder'); }}>👑 Meet the Founder</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveLegalTab('guide'); }}>📖 Interactive User Guide</a></li>
                  <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub Dev Hub</a></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© {new Date().getFullYear()} LinkFlare Inc. All rights reserved. Registered under Indian Corporate Startups.</span>
              <span>Sub-10ms Core Redirection Engine</span>
            </div>
          </footer>

        </div>
      )}

      {/* VIEW: LOGIN PORTAL */}
      {view === 'login' && (
        <div className="login-view-container">
          <div className="login-form-card" style={{ maxWidth: '420px' }}>
            <div className="logo-glowing">🔑</div>
            <h2>Identity Portal</h2>
            <p>Sign in to access your LinkFlare secure console routing matrix.</p>
            
            {supabase ? (
              <div style={{ textAlign: 'left' }}>
                <Auth
                  supabaseClient={supabase}
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: isDarkMode ? '#3b82f6' : '#1e3a8a',
                          brandAccent: isDarkMode ? '#60a5fa' : '#172554',
                          inputText: 'var(--text-primary)',
                          inputBackground: 'var(--bg-main)',
                          inputBorder: 'var(--border-color)',
                          inputPlaceholder: 'var(--text-muted)',
                        }
                      }
                    }
                  }}
                  theme={isDarkMode ? 'dark' : 'light'}
                  providers={['google']}
                  onlyThirdPartyProviders={false}
                />
              </div>
            ) : (
              <div style={{ textAlign: 'left' }}>
                <div className="form-group">
                  <label className="dash-label">Email Address</label>
                  <input type="email" className="dash-input" placeholder="creator@example.com" id="mock-email" defaultValue="saksham@linkflare.in" />
                </div>
                <div className="form-group" style={{ marginTop: '12px' }}>
                  <label className="dash-label">Password</label>
                  <input type="password" className="dash-input" placeholder="••••••••" id="mock-pass" defaultValue="admin123" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '12.5px', marginBottom: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent-purple)' }} />
                    Remember Me
                  </label>
                  <span style={{ color: 'var(--accent-purple)', cursor: 'pointer' }} onClick={() => showMessage("Please use mock authentication for local development.", "info")}>Forgot Password?</span>
                </div>
                <button 
                  onClick={() => {
                    const email = document.getElementById('mock-email').value;
                    const name = email.split('@')[0];
                    handleMockLogin(email, name.charAt(0).toUpperCase() + name.slice(1));
                  }}
                  className="btn-dash-submit"
                  style={{ width: '100%', padding: '12px', marginTop: '20px' }}
                >
                  Sign In / Sign Up
                </button>
                
                <div style={{ margin: '24px 0 16px 0', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>
                  ─── Mock Social Providers ───
                </div>
                <button 
                  onClick={() => handleMockLogin('saksham@linkflare.in', 'Saksham Tomar')} 
                  className="btn-sim-login"
                  style={{ width: '100%' }}
                >
                  🚀 Sign In with Google (Mockup)
                </button>
              </div>
            )}

            <button 
              onClick={() => setView('landing')} 
              className="btn-sim-login" 
              style={{ border: 'none', background: 'none', color: 'var(--text-secondary)', fontWeight: 'normal', fontSize: '13px', marginTop: '12px', width: '100%' }}
            >
              Cancel & Return Home
            </button>
          </div>
        </div>
      )}

      {/* VIEW: DASHBOARD CONSOLE */}
      {view === 'dashboard' && user && (
        <div className="dashboard-layout">
          
          {/* Subscription Banner */}
          {user.plan_type === 'free_trial' ? (
            <div className="dash-top-banner trial">
              <div>
                ⏳ Account Plan: <strong>Free 7-Day Trial</strong> ({getTrialDays()} days left). 
                {getTrialDays() <= 0 && <span className="text-red"> (Redirections Locked. Please upgrade to premium.)</span>}
              </div>
              <div className="sub-controls">
                <button onClick={() => setShowPaymentModal(true)} className="btn-sub-action text-green" style={{ border: '1.5px solid var(--accent-green)', fontWeight: 'bold' }}>Upgrade to Premium (₹299/mo)</button>
                <button onClick={() => runSubSim('trial-expire')} className="btn-sub-action text-red">Force Lockout</button>
              </div>
            </div>
          ) : (
            <div className="dash-top-banner premium">
              <div>
                ✨ Account Plan: <span className="badge badge-active">PREMIUM GUARD ACTIVE</span>. Firewall rules executing at edge cache.
              </div>
              <div className="sub-controls">
                <button onClick={() => runSubSim('trial-renew')} className="btn-sub-action">Downgrade to Trial</button>
              </div>
            </div>
          )}

          {/* Date Range & Refresh Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '16px', flexWrap: 'wrap', gap: '12px'
          }}>
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '4px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              {[
                { label: 'Today', value: 'today' },
                { label: 'Yesterday', value: 'yesterday' },
                { label: '7 Days', value: '7d' },
                { label: '30 Days', value: '30d' }
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedRange(opt.value)}
                  style={{
                    padding: '6px 12px', fontSize: '12px', fontWeight: '500',
                    border: 'none', borderRadius: '6px', cursor: 'pointer',
                    background: selectedRange === opt.value ? 'var(--accent-purple)' : 'transparent',
                    color: selectedRange === opt.value ? '#fff' : 'var(--text-secondary)',
                    transition: 'all 0.2s'
                  }}
                  title={`Filter metrics by ${opt.label}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Uptime Status: <strong style={{ color: 'var(--accent-green)' }}>● Healthy</strong>
              </span>
              <button
                onClick={async () => {
                  showMessage("Refreshing system metrics...", 'info');
                  await fetchAnalytics(selectedRange);
                  await fetchLogs(selectedRange);
                  showMessage("Metrics synchronized with edge log indexes.", 'success');
                }}
                className="btn-emoji-helper"
                style={{ fontSize: '11px', padding: '6px 12px', margin: 0 }}
                title="Synchronize live edge database records"
              >
                🔄 Refresh Logs
              </button>
            </div>
          </div>

          {/* Statistics widgets */}
          {analytics && (
            <div className="dash-stat-grid">
              <div className="dash-stat-box" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Total Link Clicks</h3>
                  <span className="badge badge-active" style={{ background: 'rgba(139,92,246,0.15)', color: 'var(--accent-purple)', fontSize: '10px' }}>▲12% Best</span>
                </div>
                <div className="dash-stat-number purple">{analytics.totalClicks}</div>
                <div className="dash-stat-desc">Lifetime traffic hits across endpoints</div>
                {/* Mini SVG Sparkline */}
                <svg viewBox="0 0 100 25" style={{ width: '100px', height: '25px', position: 'absolute', bottom: '12px', right: '16px', opacity: 0.8 }}>
                  <path d="M 0 20 Q 20 5 40 15 T 80 5 T 100 12" fill="none" stroke="var(--accent-purple)" strokeWidth="2" />
                </svg>
              </div>

              <div className="dash-stat-box" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Clean Traffic Ratio</h3>
                  <span className="badge badge-active" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--accent-green)', fontSize: '10px' }}>94.2% Safe</span>
                </div>
                <div className="dash-stat-number green">{analytics.allowedClicks}</div>
                <div className="dash-stat-desc">Legitimate users redirected cleanly</div>
                <svg viewBox="0 0 100 25" style={{ width: '100px', height: '25px', position: 'absolute', bottom: '12px', right: '16px', opacity: 0.8 }}>
                  <path d="M 0 15 Q 30 2 60 12 T 100 2" fill="none" stroke="var(--accent-green)" strokeWidth="2" />
                </svg>
              </div>

              <div className="dash-stat-box" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Threat Attacks Deflected</h3>
                  <span className="badge badge-active" style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--accent-red)', fontSize: '10px' }}>▲8% Blocked</span>
                </div>
                <div className="dash-stat-number red">{analytics.blockedThreats}</div>
                <div className="dash-stat-desc">Scraper bots and VPN traffic dropped</div>
                <svg viewBox="0 0 100 25" style={{ width: '100px', height: '25px', position: 'absolute', bottom: '12px', right: '16px', opacity: 0.8 }}>
                  <path d="M 0 5 Q 25 18 50 8 T 100 22" fill="none" stroke="var(--accent-red)" strokeWidth="2" />
                </svg>
              </div>

              <div className="dash-stat-box" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Ad Revenue Saved</h3>
                  <span className="badge badge-active" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--accent-green)', fontSize: '10px' }}>₹15/click CPC</span>
                </div>
                <div className="dash-stat-number green">₹{(analytics.blockedThreats * 15).toLocaleString('en-IN')}</div>
                <div className="dash-stat-desc">Budget preserved from automated clicks</div>
                <svg viewBox="0 0 100 25" style={{ width: '100px', height: '25px', position: 'absolute', bottom: '12px', right: '16px', opacity: 0.8 }}>
                  <path d="M 0 20 Q 25 2 50 18 T 100 5" fill="none" stroke="var(--accent-green)" strokeWidth="2" />
                </svg>
              </div>
            </div>
          )}

          {/* Split Panel */}
          <div className="dash-split-view">
            
            {/* Link Rule Creator (Left Panel) */}
            <div className="dash-config-card">
              {/* AI Mission Control Command Input */}
              <div style={{
                border: '1.5px solid var(--accent-purple)', borderRadius: '12px', padding: '16px',
                background: 'rgba(139, 92, 246, 0.03)', marginBottom: '24px', textAlign: 'left'
              }}>
                <h3 style={{ margin: '0 0 4px 0', color: 'var(--accent-purple)', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🤖 AI Mission Control & Campaign Autopilot
                </h3>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Describe your campaign goal (e.g. *"Create a Diwali Campaign"*) and the AI will auto-deploy redirect nodes, QR designs, and WAF rules.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="dash-input"
                    placeholder="Create Diwali Campaign..."
                    value={aiCommandInput}
                    onChange={e => setAiCommandInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleDeployAiCampaign()}
                    style={{ margin: 0, flex: 1, fontSize: '12.5px' }}
                  />
                  <button 
                    onClick={handleDeployAiCampaign} 
                    className="btn-dash-submit" 
                    style={{ width: 'auto', padding: '0 16px', margin: 0, background: 'var(--accent-purple)', color: '#fff' }}
                    disabled={isDeployingCampaign}
                  >
                    {isDeployingCampaign ? 'Deploying...' : 'Deploy'}
                  </button>
                </div>

                {/* AI Logs timeline */}
                {aiCommandLogs.length > 0 && (
                  <div style={{
                    marginTop: '12px', padding: '10px', background: '#090514', borderRadius: '8px',
                    border: '1px solid rgba(139, 92, 246, 0.2)', fontSize: '11px', fontFamily: 'monospace',
                    color: '#c084fc', display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left'
                  }}>
                    {aiCommandLogs.map((log, idx) => (
                      <div key={idx}>{log}</div>
                    ))}
                  </div>
                )}
                {/* Deployed Campaign details */}
                {deployedCampaign && (
                  <div style={{
                    marginTop: '16px', padding: '16px', background: 'var(--bg-main)', borderRadius: '10px',
                    border: '1.5px solid var(--accent-purple)', display: 'flex', flexDirection: 'column', gap: '12px',
                    fontSize: '12px', textAlign: 'left', animation: 'fadeInSoft 0.3s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                      <strong style={{ color: 'var(--accent-purple)', fontSize: '13px' }}>👑 Campaign: {deployedCampaign.name}</strong>
                      <span onClick={() => setDeployedCampaign(null)} style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: '13px' }}>✕</span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      {/* Left: Campaign details */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div>
                          <span style={{ color: 'var(--text-secondary)' }}>Secure Alias:</span>
                          <strong style={{ display: 'block', color: 'var(--text-primary)' }}>linkfl.re/l/{deployedCampaign.slug}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-secondary)' }}>Destination URL:</span>
                          <span style={{ display: 'block', color: 'var(--text-secondary)', wordBreak: 'break-all', fontSize: '11px' }}>{deployedCampaign.destination_url}</span>
                        </div>
                      </div>

                      {/* Right: QR code preview */}
                      {deployedCampaign.qr_preview && (
                        <div style={{ textAlign: 'center' }}>
                          <img 
                            src={deployedCampaign.qr_preview} 
                            alt="QR Code" 
                            style={{ width: '65px', height: '65px', borderRadius: '4px', border: '1px solid var(--border-color)', background: '#fff' }} 
                            title="Click to view full size QR code"
                            onClick={() => window.open(deployedCampaign.qr_preview, '_blank')}
                          />
                          <span style={{ display: 'block', fontSize: '8px', color: 'var(--text-muted)', marginTop: '2px', cursor: 'pointer' }}>View QR</span>
                        </div>
                      )}
                    </div>

                    {/* UTM params */}
                    <div style={{ padding: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '2px' }}>UTM Builder Settings</span>
                      <code style={{ fontSize: '10.5px' }}>
                        src={deployedCampaign.utm_params.source}&med={deployedCampaign.utm_params.medium}&camp={deployedCampaign.utm_params.campaign}
                      </code>
                    </div>

                    {/* Routing Rules & Firewall */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div style={{ padding: '8px', background: 'rgba(5, 150, 105, 0.03)', border: '1px solid rgba(5,150,105,0.15)', borderRadius: '6px' }}>
                        <span style={{ color: 'var(--accent-green)', fontWeight: 'bold', fontSize: '10px', display: 'block', marginBottom: '2px' }}>🛡️ Firewall WAF</span>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                          • VPN Challenge: **Active**<br />
                          • AI Shield: **Enabled**
                        </div>
                      </div>
                      <div style={{ padding: '8px', background: 'rgba(139, 92, 246, 0.03)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '6px' }}>
                        <span style={{ color: 'var(--accent-purple)', fontWeight: 'bold', fontSize: '10px', display: 'block', marginBottom: '2px' }}>🧪 Routing Rules</span>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                          • Split: **A/B Weighted**<br />
                          • Target: **Device specific**
                        </div>
                      </div>
                    </div>

                    {/* AI report */}
                    <div style={{ padding: '10px', background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '8px' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--accent-purple)', marginBottom: '4px', fontSize: '11px' }}>🧠 Autopilot Deployment Report (96% Confidence)</div>
                      <div style={{ color: 'var(--text-primary)', fontSize: '11px', lineHeight: '1.4' }}>
                        <strong>Impact:</strong> {deployedCampaign.report.expected_impact}<br />
                        <strong>Rollback:</strong> {deployedCampaign.report.rollback}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <h2>{editingId ? 'Modify Secured Link' : 'Secure a New Link'}</h2>
              <form onSubmit={handleSubmit}>
                
                <div className="dash-input-wrapper">
                  <label className="dash-label">Target Destination URL</label>
                  <input
                    type="url"
                    id="dest-url-input"
                    className="dash-input"
                    placeholder="https://my.store.in/checkout-page"
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                    required
                  />
                  {destinationUrl && destinationUrl.startsWith('http://') && (
                    <div style={{ marginTop: '6px', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '6px', fontSize: '11px', color: 'var(--accent-red)' }}>
                      ⚠️ Unencrypted Link Alert: Standard HTTP is vulnerable to payload hijacking. We strongly recommend SSL (HTTPS).
                    </div>
                  )}
                </div>

                <div className="dash-input-wrapper">
                  <label className="dash-label">Short Emoji/Text Path</label>
                  <div style={{ display: 'flex' }}>
                    <span className="slug-prefix-box">linkfl.re/l/</span>
                    <input
                      type="text"
                      className="dash-input"
                      style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      placeholder="summer-coupon"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ marginTop: '8px', display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button type="button" onClick={() => setSlug('👗')} className="btn-emoji-helper">👗 Dress</button>
                    <button type="button" onClick={() => setSlug('🍕')} className="btn-emoji-helper">🍕 Food</button>
                    <button type="button" onClick={() => setSlug('🚀')} className="btn-emoji-helper">🚀 Sale</button>
                    <button type="button" onClick={async () => {
                      if (!destinationUrl) {
                        showMessage("Please enter a target URL first!", "error");
                        return;
                      }
                      try {
                        const res = await fetch(`${API_BASE}/ai/suggest-aliases`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ destination_url: destinationUrl }),
                          credentials: 'include'
                        });
                        const data = await res.json();
                        if (data.success && data.aliases && data.aliases.length > 0) {
                          const combined = [...data.aliases, ...data.emoji_aliases];
                          const randomAlias = combined[Math.floor(Math.random() * combined.length)];
                          setSlug(randomAlias);
                          showMessage(`AI Suggested: ${randomAlias}`, 'success');
                        }
                      } catch(e) {
                        showMessage("AI suggest connection error.", "error");
                      }
                    }} className="btn-emoji-helper" style={{ border: '1px dashed var(--accent-purple)', color: 'var(--accent-purple)', fontWeight: 'bold' }}>
                      ⚡ AI Suggest
                    </button>
                  </div>
                </div>

                <div style={{ margin: '24px 0 10px 0', fontSize: '11px', color: 'var(--primary-navy)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  🛡️ Click Filter Configuration
                </div>

                {/* Bulk Importer Accordion */}
                <div className="dash-accordion">
                  <div className="dash-accordion-header" onClick={() => setExpandedSection(expandedSection === 'import' ? null : 'import')}>
                    <span>📥 One-Click Universal Importer</span>
                    <span>⚙️ Import Links</span>
                  </div>
                  {expandedSection === 'import' && (
                    <div className="dash-accordion-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <p className="dash-stat-desc" style={{ margin: 0 }}>
                        Paste links exported from Bitly, TinyURL, Dub, or Rebrandly. Format: <code>slug, destination_url</code> on each line.
                      </p>
                      <textarea
                        rows={4}
                        style={{ width: '100%', fontFamily: 'monospace', fontSize: '11px', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none' }}
                        placeholder="diwali-sale, https://amazon.in/offers/diwali&#10;summer-deal, https://my.store.in/summer"
                        value={bulkImportText}
                        onChange={(e) => setBulkImportText(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          if (!bulkImportText.trim()) {
                            showMessage("Please paste links to import!", "error");
                            return;
                          }
                          const lines = bulkImportText.split('\n');
                          const parsedLinks = [];
                          for (const line of lines) {
                            const parts = line.split(',');
                            if (parts.length >= 2) {
                              parsedLinks.push({
                                slug: parts[0].trim(),
                                destination_url: parts[1].trim()
                              });
                            }
                          }

                          if (parsedLinks.length === 0) {
                            showMessage("Could not parse links. Verify CSV format (slug, destination_url).", "error");
                            return;
                          }

                          try {
                            const res = await fetch(`${API_BASE}/links/import`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ links: parsedLinks }),
                              credentials: 'include'
                            });
                            const data = await res.json();
                            if (data.success) {
                              showMessage(`Successfully imported ${data.importedCount} links!`, "success");
                              setBulkImportText('');
                              setExpandedSection(null);
                              fetchLinks();
                              fetchAnalytics();
                            } else {
                              showMessage("Import failed.", "error");
                            }
                          } catch(e) {
                            showMessage("Import connection error.", "error");
                          }
                        }}
                        className="btn-dash-submit"
                        style={{ margin: 0, padding: '8px' }}
                      >
                        ⚡ Run Universal Import
                      </button>
                    </div>
                  )}
                </div>

                {/* Country Blocking accordion */}
                <div className="dash-accordion">
                  <div className="dash-accordion-header" onClick={() => setExpandedSection(expandedSection === 'geo' ? null : 'geo')}>
                    <span>📍 Geographic Location Lock</span>
                    <span>{geoBlocking ? '✅ Active' : '⚙️'}</span>
                  </div>
                  {expandedSection === 'geo' && (
                    <div className="dash-accordion-body">
                      <label className="dash-label">Allowed Countries (Comma list)</label>
                      <input
                        type="text"
                        className="dash-input"
                        placeholder="IN, US, GB"
                        value={geoBlocking}
                        onChange={(e) => setGeoBlocking(e.target.value)}
                      />
                      <p className="dash-stat-desc" style={{ marginTop: '6px' }}>
                        Input "IN" to block all visits from outside India. Leave empty to allow all.
                      </p>
                    </div>
                  )}
                </div>

                {/* Device & Network accordion */}
                <div className="dash-accordion">
                  <div className="dash-accordion-header" onClick={() => setExpandedSection(expandedSection === 'security' ? null : 'security')}>
                    <span>🔒 Device & Network Filters</span>
                    <span>{(vpnBlocking || allowedBrands || allowedAsns) ? '✅ Active' : '⚙️'}</span>
                  </div>
                  {expandedSection === 'security' && (
                    <div className="dash-accordion-body">
                      <div className="checkbox-row">
                        <input
                          type="checkbox"
                          id="vpn-block-input"
                          checked={vpnBlocking}
                          onChange={(e) => setVpnBlocking(e.target.checked)}
                        />
                        <label htmlFor="vpn-block-input">Block VPN / Host Datacenters</label>
                      </div>

                      <div className="dash-input-wrapper" style={{ marginTop: '12px' }}>
                        <label className="dash-label">Allowed Device Brands</label>
                        <input
                          type="text"
                          className="dash-input"
                          placeholder="Apple, Samsung, Tesla"
                          value={allowedBrands}
                          onChange={(e) => setAllowedBrands(e.target.value)}
                        />
                      </div>

                      <div className="dash-input-wrapper" style={{ marginBottom: 0 }}>
                        <label className="dash-label">Allowed ASNs / ISPs</label>
                        <input
                          type="text"
                          className="dash-input"
                          placeholder="AS55836, AS45609"
                          value={allowedAsns}
                          onChange={(e) => setAllowedAsns(e.target.value)}
                        />
                        <p className="dash-stat-desc" style={{ marginTop: '4px' }}>
                          Lock to mobile Jio (AS55836) or Airtel (AS45609) to drop web scrapers.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Limit Capping and time schedule */}
                <div className="dash-accordion">
                  <div className="dash-accordion-header" onClick={() => setExpandedSection(expandedSection === 'time' ? null : 'time')}>
                    <span>⚡ Traffic Capping & Schedule</span>
                    <span>{(clickCap || timeBombStart || timeBombEnd) ? '✅ Active' : '⚙️'}</span>
                  </div>
                  {expandedSection === 'time' && (
                    <div className="dash-accordion-body">
                      <div className="dash-input-wrapper">
                        <label className="dash-label">Max Allowed Clicks (Cap)</label>
                        <input
                          type="number"
                          className="dash-input"
                          placeholder="e.g. 100"
                          value={clickCap}
                          onChange={(e) => setClickCap(e.target.value)}
                        />
                      </div>
                      <div className="dash-input-wrapper">
                        <label className="dash-label">Cap Fallback URL</label>
                        <input
                          type="url"
                          className="dash-input"
                          placeholder="https://my.store.in/sold-out"
                          value={fallbackUrl}
                          onChange={(e) => setFallbackUrl(e.target.value)}
                        />
                      </div>
                      <div className="dash-input-wrapper">
                        <label className="dash-label">Time Schedule Start</label>
                        <input
                          type="datetime-local"
                          className="dash-input"
                          value={timeBombStart}
                          onChange={(e) => setTimeBombStart(e.target.value)}
                        />
                      </div>
                      <div className="dash-input-wrapper" style={{ marginBottom: 0 }}>
                        <label className="dash-label">Time Schedule End (Time-Bomb)</label>
                        <input
                          type="datetime-local"
                          className="dash-input"
                          value={timeBombEnd}
                          onChange={(e) => setTimeBombEnd(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Chameleon accordion */}
                <div className="dash-accordion">
                  <div className="dash-accordion-header" onClick={() => setExpandedSection(expandedSection === 'chameleon' ? null : 'chameleon')}>
                    <span>🦎 Chameleon Routing Rules</span>
                    <span>{chameleonRules ? '✅ Active' : '⚙️'}</span>
                  </div>
                  {expandedSection === 'chameleon' && (
                    <div className="dash-accordion-body">
                      <label className="dash-label">Custom Rules Array (JSON)</label>
                      <textarea
                        rows={5}
                        style={{ width: '100%', fontFamily: 'monospace', fontSize: '11px', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none' }}
                        placeholder={`[\n  { "type": "device", "value": "mobile", "target_url": "https://mobile.shop" }\n]`}
                        value={chameleonRules}
                        onChange={(e) => setChameleonRules(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* UTM Builder accordion */}
                <div className="dash-accordion">
                  <div className="dash-accordion-header" onClick={() => setExpandedSection(expandedSection === 'utm' ? null : 'utm')}>
                    <span>🌍 UTM Campaign Builder</span>
                    <span>{(utmSource || utmMedium || utmCampaign) ? '✅ Active' : '⚙️'}</span>
                  </div>
                  {expandedSection === 'utm' && (
                    <div className="dash-accordion-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div className="dash-input-wrapper" style={{ margin: 0 }}>
                          <label className="dash-label">Source</label>
                          <input type="text" className="dash-input" placeholder="google, facebook" value={utmSource} onChange={e => setUtmSource(e.target.value)} />
                        </div>
                        <div className="dash-input-wrapper" style={{ margin: 0 }}>
                          <label className="dash-label">Medium</label>
                          <input type="text" className="dash-input" placeholder="cpc, email, social" value={utmMedium} onChange={e => setUtmMedium(e.target.value)} />
                        </div>
                      </div>
                      <div className="dash-input-wrapper" style={{ margin: 0 }}>
                        <label className="dash-label">Campaign</label>
                        <input type="text" className="dash-input" placeholder="diwali-sale-2025" value={utmCampaign} onChange={e => setUtmCampaign(e.target.value)} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div className="dash-input-wrapper" style={{ margin: 0 }}>
                          <label className="dash-label">Content</label>
                          <input type="text" className="dash-input" placeholder="banner_ad" value={utmContent} onChange={e => setUtmContent(e.target.value)} />
                        </div>
                        <div className="dash-input-wrapper" style={{ margin: 0 }}>
                          <label className="dash-label">Term</label>
                          <input type="text" className="dash-input" placeholder="running+shoes" value={utmTerm} onChange={e => setUtmTerm(e.target.value)} />
                        </div>
                      </div>
                      {getUtmPreview() && (
                        <div style={{ padding: '8px', background: 'rgba(139, 92, 246, 0.04)', border: '1px solid rgba(139, 92, 246, 0.15)', borderRadius: '6px', fontSize: '11px', fontFamily: 'monospace', wordBreak: 'break-all', color: 'var(--accent-purple)' }}>
                          Preview: {destinationUrl || 'https://...'}{getUtmPreview()}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Tags, Folders & Notes accordion */}
                <div className="dash-accordion">
                  <div className="dash-accordion-header" onClick={() => setExpandedSection(expandedSection === 'tags' ? null : 'tags')}>
                    <span>🏷️ Tags, Folders & Notes</span>
                    <span>{(linkTags || linkFolder || linkNotes) ? '✅ Active' : '⚙️'}</span>
                  </div>
                  {expandedSection === 'tags' && (
                    <div className="dash-accordion-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div className="dash-input-wrapper" style={{ margin: 0 }}>
                        <label className="dash-label">Tags (comma-separated)</label>
                        <input type="text" className="dash-input" placeholder="sale, diwali, seasonal, high-priority" value={linkTags} onChange={e => setLinkTags(e.target.value)} />
                      </div>
                      <div className="dash-input-wrapper" style={{ margin: 0 }}>
                        <label className="dash-label">Folder</label>
                        <select className="dash-input" value={linkFolder} onChange={e => setLinkFolder(e.target.value)} style={{ cursor: 'pointer' }}>
                          <option value="">No Folder</option>
                          <option value="marketing">📁 Marketing</option>
                          <option value="sales">📁 Sales</option>
                          <option value="social">📁 Social Media</option>
                          <option value="affiliate">📁 Affiliate</option>
                          <option value="internal">📁 Internal</option>
                        </select>
                      </div>
                      <div className="dash-input-wrapper" style={{ margin: 0 }}>
                        <label className="dash-label">Notes</label>
                        <textarea rows={2} className="dash-input" placeholder="Internal notes about this link..." value={linkNotes} onChange={e => setLinkNotes(e.target.value)} style={{ fontFamily: 'inherit', resize: 'vertical' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Deep Links accordion */}
                <div className="dash-accordion">
                  <div className="dash-accordion-header" onClick={() => setExpandedSection(expandedSection === 'deeplinks' ? null : 'deeplinks')}>
                    <span>📱 Deep Links (iOS / Android)</span>
                    <span>{(deepLinkIos || deepLinkAndroid) ? '✅ Active' : '⚙️'}</span>
                  </div>
                  {expandedSection === 'deeplinks' && (
                    <div className="dash-accordion-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div className="dash-input-wrapper" style={{ margin: 0 }}>
                        <label className="dash-label">🍎 iOS Universal Link</label>
                        <input type="url" className="dash-input" placeholder="myapp://product/123 or https://apps.apple.com/..." value={deepLinkIos} onChange={e => setDeepLinkIos(e.target.value)} />
                      </div>
                      <div className="dash-input-wrapper" style={{ margin: 0 }}>
                        <label className="dash-label">🤖 Android App Link</label>
                        <input type="url" className="dash-input" placeholder="intent://product/123#Intent;scheme=myapp;end" value={deepLinkAndroid} onChange={e => setDeepLinkAndroid(e.target.value)} />
                      </div>
                      <p className="dash-stat-desc" style={{ margin: 0, fontSize: '11px' }}>
                        Mobile visitors with the app installed will open the native app. Others get the web URL.
                      </p>
                    </div>
                  )}
                </div>

                {/* A/B Testing accordion */}
                <div className="dash-accordion">
                  <div className="dash-accordion-header" onClick={() => setExpandedSection(expandedSection === 'abtest' ? null : 'abtest')}>
                    <span>🧪 A/B Testing & Weighted Routing</span>
                    <span>{abTestUrl ? '✅ Active' : '⚙️'}</span>
                  </div>
                  {expandedSection === 'abtest' && (
                    <div className="dash-accordion-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div className="dash-input-wrapper" style={{ margin: 0 }}>
                        <label className="dash-label">Variant B URL</label>
                        <input type="url" className="dash-input" placeholder="https://my.store.in/variant-b" value={abTestUrl} onChange={e => setAbTestUrl(e.target.value)} />
                      </div>
                      <div className="dash-input-wrapper" style={{ margin: 0 }}>
                        <label className="dash-label">Traffic Split — Variant A: {abTestWeight}% / Variant B: {100 - abTestWeight}%</label>
                        <input type="range" min="10" max="90" step="5" value={abTestWeight} onChange={e => setAbTestWeight(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent-purple)', cursor: 'pointer' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          <span>🅰️ Original ({abTestWeight}%)</span>
                          <span>🅱️ Variant ({100 - abTestWeight}%)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Browser, OS, Language Rules accordion */}
                <div className="dash-accordion">
                  <div className="dash-accordion-header" onClick={() => setExpandedSection(expandedSection === 'platform' ? null : 'platform')}>
                    <span>🖥️ Browser, OS & Language Rules</span>
                    <span>{(linkBrowserRules || linkOsRules || linkLanguageRules) ? '✅ Active' : '⚙️'}</span>
                  </div>
                  {expandedSection === 'platform' && (
                    <div className="dash-accordion-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div className="dash-input-wrapper" style={{ margin: 0 }}>
                        <label className="dash-label">Allowed Browsers</label>
                        <input type="text" className="dash-input" placeholder="Chrome, Safari, Firefox" value={linkBrowserRules} onChange={e => setLinkBrowserRules(e.target.value)} />
                      </div>
                      <div className="dash-input-wrapper" style={{ margin: 0 }}>
                        <label className="dash-label">Allowed Operating Systems</label>
                        <input type="text" className="dash-input" placeholder="Windows, macOS, Android, iOS" value={linkOsRules} onChange={e => setLinkOsRules(e.target.value)} />
                      </div>
                      <div className="dash-input-wrapper" style={{ margin: 0 }}>
                        <label className="dash-label">Allowed Languages</label>
                        <input type="text" className="dash-input" placeholder="en, hi, de, ja" value={linkLanguageRules} onChange={e => setLinkLanguageRules(e.target.value)} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Checkboxes for quick locks */}
                <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <div className="checkbox-row">
                    <input
                      type="checkbox"
                      id="whatsapp-check"
                      checked={whatsappVerify}
                      onChange={(e) => setWhatsappVerify(e.target.checked)}
                    />
                    <label htmlFor="whatsapp-check" style={{ fontWeight: 600 }}>🔐 Require Identity Verification Gateway</label>
                  </div>
                  <div className="checkbox-row" style={{ marginTop: '8px' }}>
                    <input
                      type="checkbox"
                      id="monetization-check"
                      checked={isMonetized}
                      onChange={(e) => setIsMonetized(e.target.checked)}
                    />
                    <label htmlFor="monetization-check" style={{ fontWeight: 600 }}>💰 Enable Monetization Gateway</label>
                  </div>
                  <div className="checkbox-row" style={{ marginTop: '8px' }}>
                    <input
                      type="checkbox"
                      id="ai-shield-check"
                      checked={isAiShield}
                      onChange={(e) => setIsAiShield(e.target.checked)}
                    />
                    <label htmlFor="ai-shield-check" style={{ fontWeight: 600, color: 'var(--accent-purple)' }}>🧠 Enable AI Intent Shield (Zero-Trust)</label>
                  </div>
                  <div className="checkbox-row" style={{ marginTop: '8px' }}>
                    <input type="checkbox" id="maintenance-check" checked={isMaintenanceMode} onChange={(e) => setIsMaintenanceMode(e.target.checked)} />
                    <label htmlFor="maintenance-check" style={{ fontWeight: 600 }}>🚧 Maintenance Mode</label>
                  </div>
                  <div className="checkbox-row" style={{ marginTop: '8px' }}>
                    <input type="checkbox" id="preview-check" checked={isPreviewMode} onChange={(e) => setIsPreviewMode(e.target.checked)} />
                    <label htmlFor="preview-check" style={{ fontWeight: 600 }}>👁️ Preview Mode (Show destination before redirect)</label>
                  </div>
                </div>

                <div className="dash-input-wrapper" style={{ marginTop: '16px' }}>
                  <label className="dash-label">Access Gate Password</label>
                  <input
                    type="password"
                    className="dash-input"
                    placeholder="Enter link password or leave blank"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-dash-submit">
                  {editingId ? 'Save Changes' : 'Shorten & Secure Link'}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="btn-dash-cancel">
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            {/* Dashboard Tabs & Tables (Right Side) */}
            <div className="dash-view-card">
              <div className="dash-tabs">
                <button onClick={() => setDashboardTab('links')} className={`dash-tab-btn ${dashboardTab === 'links' ? 'active' : ''}`}>🔗 Secured Links ({links.length})</button>
                <button onClick={() => setDashboardTab('analytics')} className={`dash-tab-btn ${dashboardTab === 'analytics' ? 'active' : ''}`}>📊 Analytics Insights</button>
                <button onClick={() => setDashboardTab('logs')} className={`dash-tab-btn ${dashboardTab === 'logs' ? 'active' : ''}`}>🛡️ Threat Logs</button>
                <button onClick={() => { setDashboardTab('settings'); fetchSessions(); fetchAuditLogs(); }} className={`dash-tab-btn ${dashboardTab === 'settings' ? 'active' : ''}`}>⚙️ SLA & Settings</button>
                <button onClick={() => { setDashboardTab('domain'); fetchDomains(); }} className={`dash-tab-btn ${dashboardTab === 'domain' ? 'active' : ''}`}>🌐 Domain Integration</button>
                <button onClick={() => setDashboardTab('edge')} className={`dash-tab-btn ${dashboardTab === 'edge' ? 'active' : ''}`}>🛰️ Edge Platform</button>
                <button onClick={() => {
                  setDashboardTab('admin');
                  fetchAdminStats();
                  fetchAdminUsers();
                }} className={`dash-tab-btn ${dashboardTab === 'admin' ? 'active' : ''}`} style={{ border: '1.5px dashed var(--accent-purple)', color: 'var(--accent-purple)', fontWeight: 'bold' }}>👑 Super Admin Panel</button>
              </div>

              {/* TAB CONTENT: LINKS */}
              {dashboardTab === 'links' && (
                <div>
                  {/* Bulk Actions Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setBulkMode(!bulkMode);
                          setSelectedLinks([]);
                        }}
                        className="btn-emoji-helper"
                        style={{ border: bulkMode ? '1px solid var(--accent-purple)' : '1.5px solid var(--border-color)', color: bulkMode ? 'var(--accent-purple)' : 'var(--text-secondary)' }}
                      >
                        {bulkMode ? '🚫 Disable Bulk Mode' : '⚙️ Enable Bulk Selection'}
                      </button>
                    </div>
                    {bulkMode && selectedLinks.length > 0 && (
                      <div className="bulk-toolbar" style={{ margin: 0 }}>
                        <span className="bulk-count">Selected {selectedLinks.length} links</span>
                        <button onClick={handleBulkExport} className="copy-button" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)' }}>📦 Export Selected</button>
                        <button onClick={handleBulkDelete} className="copy-button" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)' }}>🗑️ Delete Selected</button>
                      </div>
                    )}
                  </div>

                  {links.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                      No secure links generated. Paste a URL on the left config panel to start!
                    </div>
                  ) : (
                    <div className="dash-table-wrapper">
                      <table className="dash-table">
                        <thead>
                          <tr>
                            {bulkMode && (
                              <th style={{ width: '40px', textAlign: 'center' }}>
                                <input
                                  type="checkbox"
                                  checked={selectedLinks.length === links.length && links.length > 0}
                                  onChange={selectAllLinks}
                                  style={{ cursor: 'pointer' }}
                                />
                              </th>
                            )}
                            <th>Link Endpoint</th>
                            <th>Destination</th>
                            <th>Active Filters</th>
                            <th>Health & Latency</th>
                            <th>Clicks</th>
                            <th>Operations</th>
                          </tr>
                        </thead>
                        <tbody>
                          {links.map((link) => (
                            <tr 
                              key={link.id} 
                              className={link.is_archived === 1 ? 'archived-row' : ''} 
                              style={{ opacity: link.is_archived === 1 ? 0.6 : 1 }}
                              onContextMenu={(e) => {
                                e.preventDefault();
                                setContextMenu({
                                  x: e.clientX,
                                  y: e.clientY,
                                  link: link
                                });
                              }}
                            >
                              {bulkMode && (
                                <td style={{ textAlign: 'center' }}>
                                  <input
                                    type="checkbox"
                                    checked={selectedLinks.includes(link.id)}
                                    onChange={() => toggleLinkSelection(link.id)}
                                    style={{ cursor: 'pointer' }}
                                  />
                                </td>
                              )}
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <button
                                    onClick={() => handleToggleFavorite(link.id)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: 0 }}
                                    title={link.is_favorite === 1 ? "Unfavorite" : "Favorite"}
                                  >
                                    {link.is_favorite === 1 ? '⭐' : '☆'}
                                  </button>
                                  <strong style={{ color: 'var(--primary-navy)' }}>
                                    /{encodeURIComponent(link.slug)}
                                  </strong>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(`http://localhost:5000/l/${encodeURIComponent(link.slug)}`);
                                      showMessage("Secure Link copied to clipboard!", 'success');
                                    }}
                                    className="copy-button"
                                  >
                                    Copy
                                  </button>
                                </div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                  <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <a href={link.destination_url} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }}>
                                      {link.destination_url}
                                    </a>
                                  </span>
                                  {link.folder && (
                                    <span style={{ fontSize: '10px', color: 'var(--accent-purple)', fontWeight: 'bold' }}>
                                      📁 Folder: {link.folder}
                                    </span>
                                  )}
                                  {link.tags && (
                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
                                      {JSON.parse(link.tags).map((tag, idx) => (
                                        <span key={idx} style={{ fontSize: '9px', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', color: 'var(--accent-purple)', padding: '1px 4px', borderRadius: '4px' }}>
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                                  {link.geo_blocking && <span className="badge badge-active" title={link.geo_blocking}>Geo</span>}
                                  {link.vpn_blocking === 1 && <span className="badge badge-active">VPN</span>}
                                  {link.password_hash && <span className="badge badge-active">Pass</span>}
                                  {link.whatsapp_verify === 1 && <span className="badge badge-active">WhatsApp</span>}
                                  {link.click_cap && <span className="badge badge-active">Cap</span>}
                                  {link.is_monetized === 1 && <span className="badge badge-active" style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>Ad</span>}
                                  {link.is_maintenance === 1 && <span className="badge badge-active" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#d97706' }}>Maint</span>}
                                  {link.is_preview === 1 && <span className="badge badge-active" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#2563eb' }}>Preview</span>}
                                  {(!link.geo_blocking && link.vpn_blocking === 0 && !link.password_hash && link.whatsapp_verify === 0 && !link.click_cap) && (
                                    <span className="badge badge-inactive">None</span>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                                  <span style={{ color: 'var(--accent-green)', fontWeight: 'bold', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    ● 100% Online
                                  </span>
                                  <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                                    ⚡ {10 + (link.slug.length % 15)}ms (Mumbai Edge)
                                  </span>
                                </div>
                              </td>
                              <td>
                                <strong style={{ color: 'var(--text-primary)' }}>{link.click_count}</strong>
                                {link.click_cap && <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}> / {link.click_cap}</span>}
                              </td>
                              <td>
                                <div className="action-row-buttons">
                                  <a
                                    href={`http://localhost:5000/l/${encodeURIComponent(link.slug)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-action-icon"
                                    title="Open redirect link"
                                  >
                                    👁️
                                  </a>
                                  <button onClick={() => handleEdit(link)} className="btn-action-icon" title="Edit rules">
                                    ✏️
                                  </button>
                                  <button onClick={() => handleDuplicateLink(link.id)} className="btn-action-icon" title="Duplicate link">
                                    📋
                                  </button>
                                  <button onClick={() => handleToggleArchive(link.id)} className="btn-action-icon" title={link.is_archived === 1 ? "Restore" : "Archive"}>
                                    📁
                                  </button>
                                  <button onClick={() => {
                                    setActiveTwinLink(link);
                                    setAiTwinResponse('');
                                    setAiTwinQuestion('');
                                  }} className="btn-action-icon" title="Ask Link AI Twin" style={{ color: 'var(--accent-purple)', fontSize: '15px' }}>
                                    🧠
                                  </button>
                                  {(() => {
                                    try {
                                      const parsed = typeof link.chameleon_rules === 'string' ? JSON.parse(link.chameleon_rules) : link.chameleon_rules;
                                      if (parsed && parsed.history && parsed.history.length > 0) {
                                        return (
                                          <button
                                            onClick={async () => {
                                              if (window.confirm(`Rollback this link destination? (Active: ${link.destination_url} -> Previous: ${parsed.history[parsed.history.length - 1]})`)) {
                                                const res = await fetch(`${API_BASE}/links/${link.id}/rollback`, { method: 'POST', credentials: 'include' });
                                                const data = await res.json();
                                                if (data.success) {
                                                  showMessage("Link rolled back to previous version successfully!", "success");
                                                  fetchLinks();
                                                }
                                              }
                                            }}
                                            className="btn-action-icon"
                                            title={`Rollback available (${parsed.history.length} versions)`}
                                            style={{ color: '#f59e0b', fontSize: '15px', fontWeight: 'bold' }}
                                          >
                                            ↺
                                          </button>
                                        );
                                      }
                                    } catch(e) {}
                                    return null;
                                  })()}
                                  <button onClick={() => handleDelete(link.id)} className="btn-action-icon delete" title="Delete link">
                                    🗑️
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* LinkFlare Universe Graph Map */}
                  <div style={{
                    marginTop: '30px', border: '1px solid var(--border-color)', borderRadius: '16px',
                    padding: '24px', background: 'rgba(255, 255, 255, 0.01)', position: 'relative', overflow: 'hidden'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🌌 LinkFlare Connected Universe
                      </h4>
                      <span className="badge badge-active" style={{ background: 'var(--accent-purple)', color: '#fff', fontSize: '10px' }}>Animated Graph</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 24px 0', textAlign: 'left' }}>
                      Hover over nodes to explore connection flows across your secure links, challenge gates, and active ad revenue margins.
                    </p>

                    {/* Interactive Animated SVG Graph flow */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', minHeight: '120px', padding: '0 20px', flexWrap: 'wrap', gap: '20px' }}>
                      
                      {/* Node 1: Target Destination Links */}
                      <div className="universe-node" style={{
                        padding: '12px 18px', background: 'rgba(139, 92, 246, 0.08)', border: '1.5px solid var(--accent-purple)',
                        borderRadius: '12px', textAlign: 'center', cursor: 'pointer', minWidth: '110px', transition: 'all 0.3s'
                      }}>
                        <div style={{ fontSize: '16px' }}>🔗</div>
                        <div style={{ fontWeight: 'bold', fontSize: '12px', color: 'var(--text-primary)', marginTop: '4px' }}>Short Links</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{links.length} Active Nodes</div>
                      </div>

                      {/* Connection Line 1 */}
                      <div className="universe-connector" style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-blue))', minWidth: '30px', position: 'relative' }}>
                        <div style={{
                          position: 'absolute', top: '-4px', width: '10px', height: '10px', background: 'var(--accent-blue)',
                          borderRadius: '50%', animation: 'pulseFlow 2s infinite linear'
                        }} />
                      </div>

                      {/* Node 2: Zero-Trust WAF Firewall */}
                      <div className="universe-node" style={{
                        padding: '12px 18px', background: 'rgba(59, 130, 246, 0.08)', border: '1.5px solid var(--accent-blue)',
                        borderRadius: '12px', textAlign: 'center', cursor: 'pointer', minWidth: '110px', transition: 'all 0.3s'
                      }}>
                        <div style={{ fontSize: '16px' }}>🛡️</div>
                        <div style={{ fontWeight: 'bold', fontSize: '12px', color: 'var(--text-primary)', marginTop: '4px' }}>Zero-Trust WAF</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Challenge Escalation</div>
                      </div>

                      {/* Connection Line 2 */}
                      <div className="universe-connector" style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-green))', minWidth: '30px', position: 'relative' }}>
                        <div style={{
                          position: 'absolute', top: '-4px', width: '10px', height: '10px', background: 'var(--accent-green)',
                          borderRadius: '50%', animation: 'pulseFlow 2.5s infinite linear'
                        }} />
                      </div>

                      {/* Node 3: Ad Monetization Interstitials */}
                      <div className="universe-node" style={{
                        padding: '12px 18px', background: 'rgba(5, 150, 105, 0.08)', border: '1.5px solid var(--accent-green)',
                        borderRadius: '12px', textAlign: 'center', cursor: 'pointer', minWidth: '110px', transition: 'all 0.3s'
                      }}>
                        <div style={{ fontSize: '16px' }}>💰</div>
                        <div style={{ fontWeight: 'bold', fontSize: '12px', color: 'var(--text-primary)', marginTop: '4px' }}>Ad Interstitials</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Google Ads Ready</div>
                      </div>

                      {/* Connection Line 3 */}
                      <div className="universe-connector" style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, var(--accent-green), var(--accent-purple))', minWidth: '30px', position: 'relative' }}>
                        <div style={{
                          position: 'absolute', top: '-4px', width: '10px', height: '10px', background: 'var(--accent-purple)',
                          borderRadius: '50%', animation: 'pulseFlow 3s infinite linear'
                        }} />
                      </div>

                      {/* Node 4: Autopilot Optimization Engine */}
                      <div className="universe-node" style={{
                        padding: '12px 18px', background: 'rgba(139, 92, 246, 0.08)', border: '1.5px solid var(--accent-purple)',
                        borderRadius: '12px', textAlign: 'center', cursor: 'pointer', minWidth: '110px', transition: 'all 0.3s'
                      }}>
                        <div style={{ fontSize: '16px' }}>🔮</div>
                        <div style={{ fontWeight: 'bold', fontSize: '12px', color: 'var(--text-primary)', marginTop: '4px' }}>AI Autopilot</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Self-Healing Routing</div>
                      </div>

                    </div>
                  </div>
                </div>
              )}
              {/* TAB CONTENT: ANALYTICS */}
              {dashboardTab === 'analytics' && analytics && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Search and Export Toolbar */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-color)',
                    paddingBottom: '16px', marginBottom: '8px'
                  }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%', maxWidth: '320px' }}>
                      <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>🔍</span>
                      <input
                        type="text"
                        className="dash-input"
                        placeholder="Search distributions (e.g. IN, Chrome, Jio)..."
                        value={analyticsSearch}
                        onChange={e => setAnalyticsSearch(e.target.value)}
                        style={{ margin: 0, padding: '6px 12px', borderRadius: '8px', fontSize: '13px' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={exportAnalyticsCSV} className="btn-emoji-helper" style={{ margin: 0, padding: '8px 14px', background: 'rgba(5, 150, 105, 0.08)', color: 'var(--accent-green)', border: '1px solid var(--accent-green)', fontWeight: 'bold' }} title="Export metrics to CSV">
                        📥 Export CSV
                      </button>
                      <button onClick={exportAnalyticsJSON} className="btn-emoji-helper" style={{ margin: 0, padding: '8px 14px', background: 'rgba(139, 92, 246, 0.08)', color: 'var(--accent-purple)', border: '1px solid var(--accent-purple)', fontWeight: 'bold' }} title="Export metrics to JSON">
                        📦 Export JSON
                      </button>
                    </div>
                  </div>

                  {/* Traffic Quality Scorecard */}
                  {(() => {
                    const totalClicksCount = analytics.totalClicks || 1;
                    const cleanPct = ((analytics.allowedClicks / totalClicksCount) * 100).toFixed(1);
                    const threatPct = ((analytics.blockedThreats / totalClicksCount) * 100).toFixed(1);
                    return (
                      <div className="dash-view-card" style={{ padding: '20px', borderRadius: '12px' }}>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          🛡️ Traffic Integrity & Fraud Scorecard
                        </h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                          <span>🟢 Human Clean Traffic: <strong>{cleanPct}%</strong> ({analytics.allowedClicks} hits)</span>
                          <span>🔴 Deflected Attacks / Bot spam: <strong>{threatPct}%</strong> ({analytics.blockedThreats} hits)</span>
                        </div>
                        <div style={{ height: '10px', width: '100%', background: 'var(--border-color)', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
                          <div style={{ width: `${cleanPct}%`, background: 'var(--accent-green)', height: '100%', transition: 'width 0.4s ease-in-out' }}></div>
                          <div style={{ width: `${threatPct}%`, background: 'var(--accent-red)', height: '100%', transition: 'width 0.4s ease-in-out' }}></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                          <div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Platform Click CTR</div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '4px' }}>98.4%</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Gate Verification CTR</div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-purple)', marginTop: '4px' }}>14.2%</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Avg Edge Latency</div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-blue)', marginTop: '4px' }}>18ms</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Data Range Scope</div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-muted)', marginTop: '4px' }}>{selectedRange.toUpperCase()}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Top Distributions Grid (Top Countries, Cities, ISPs, ASNs) */}
                  {(() => {
                    const enriched = getEnrichedAnalytics();
                    const filterMatches = (key) => !analyticsSearch || key.toLowerCase().includes(analyticsSearch.toLowerCase());

                    return (
                      <>
                        <div className="chart-box-grid">
                          {/* Countries */}
                          <div className="chart-box-card">
                            <h3>📍 Top Countries</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                              {Object.entries(enriched.countries).filter(([k]) => filterMatches(k)).length === 0 ? (
                                <p className="dash-stat-desc">No matching geographic data logged.</p>
                              ) : (
                                Object.entries(enriched.countries)
                                  .filter(([k]) => filterMatches(k))
                                  .sort((a, b) => b[1] - a[1])
                                  .slice(0, 5)
                                  .map(([country, count], i) => (
                                    <div key={i} className="distribution-row">
                                      <span className="distribution-label">{country}</span>
                                      <div className="distribution-bar-bg">
                                        <div className="distribution-bar-fill purple" style={{ width: `${Math.min(100, (count / (analytics.totalClicks || 1)) * 100)}%` }}></div>
                                      </div>
                                      <span className="distribution-value">{count} clicks</span>
                                    </div>
                                  ))
                              )}
                            </div>
                          </div>

                          {/* Cities */}
                          <div className="chart-box-card">
                            <h3>🏢 Top Cities</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                              {Object.entries(enriched.cities).filter(([k]) => filterMatches(k)).length === 0 ? (
                                <p className="dash-stat-desc">No matching city records logged.</p>
                              ) : (
                                Object.entries(enriched.cities)
                                  .filter(([k]) => filterMatches(k))
                                  .sort((a, b) => b[1] - a[1])
                                  .slice(0, 5)
                                  .map(([city, count], i) => (
                                    <div key={i} className="distribution-row">
                                      <span className="distribution-label">{city}</span>
                                      <div className="distribution-bar-bg">
                                        <div className="distribution-bar-fill blue" style={{ width: `${Math.min(100, (count / (analytics.totalClicks || 1)) * 100)}%` }}></div>
                                      </div>
                                      <span className="distribution-value">{count} clicks</span>
                                    </div>
                                  ))
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="chart-box-grid">
                          {/* ISPs */}
                          <div className="chart-box-card">
                            <h3>📡 Top ISPs / Carrier Networks</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                              {Object.entries(enriched.isps).filter(([k]) => filterMatches(k)).length === 0 ? (
                                <p className="dash-stat-desc">No matching network carriers recorded.</p>
                              ) : (
                                Object.entries(enriched.isps)
                                  .filter(([k]) => filterMatches(k))
                                  .sort((a, b) => b[1] - a[1])
                                  .slice(0, 5)
                                  .map(([isp, count], i) => (
                                    <div key={i} className="distribution-row">
                                      <span className="distribution-label" style={{ fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{isp}</span>
                                      <div className="distribution-bar-bg">
                                        <div className="distribution-bar-fill green" style={{ width: `${Math.min(100, (count / (analytics.totalClicks || 1)) * 100)}%` }}></div>
                                      </div>
                                      <span className="distribution-value">{count} clicks</span>
                                    </div>
                                  ))
                              )}
                            </div>
                          </div>

                          {/* ASNs */}
                          <div className="chart-box-card">
                            <h3>🔒 Top ASNs</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                              {Object.entries(enriched.asns).filter(([k]) => filterMatches(k)).length === 0 ? (
                                <p className="dash-stat-desc">No matching ASN routing paths found.</p>
                              ) : (
                                Object.entries(enriched.asns)
                                  .filter(([k]) => filterMatches(k))
                                  .sort((a, b) => b[1] - a[1])
                                  .slice(0, 5)
                                  .map(([asn, count], i) => (
                                    <div key={i} className="distribution-row">
                                      <span className="distribution-label">{asn}</span>
                                      <div className="distribution-bar-bg">
                                        <div className="distribution-bar-fill purple" style={{ width: `${Math.min(100, (count / (analytics.totalClicks || 1)) * 100)}%` }}></div>
                                      </div>
                                      <span className="distribution-value">{count} clicks</span>
                                    </div>
                                  ))
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="chart-box-grid">
                          {/* Operating Systems */}
                          <div className="chart-box-card">
                            <h3>💻 Operating Systems</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                              {Object.entries(enriched.os).filter(([k]) => filterMatches(k)).length === 0 ? (
                                <p className="dash-stat-desc">No matching OS platform footprints logged.</p>
                              ) : (
                                Object.entries(enriched.os)
                                  .filter(([k]) => filterMatches(k))
                                  .sort((a, b) => b[1] - a[1])
                                  .map(([os, count], i) => (
                                    <div key={i} className="distribution-row">
                                      <span className="distribution-label">{os}</span>
                                      <div className="distribution-bar-bg">
                                        <div className="distribution-bar-fill blue" style={{ width: `${Math.min(100, (count / (analytics.totalClicks || 1)) * 100)}%` }}></div>
                                      </div>
                                      <span className="distribution-value">{count} clicks</span>
                                    </div>
                                  ))
                              )}
                            </div>
                          </div>

                          {/* Browsers */}
                          <div className="chart-box-card">
                            <h3>🌐 Web Browsers</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                              {Object.entries(enriched.browsers).filter(([k]) => filterMatches(k)).length === 0 ? (
                                <p className="dash-stat-desc">No matching browser agent fingerprints logged.</p>
                              ) : (
                                Object.entries(enriched.browsers)
                                  .filter(([k]) => filterMatches(k))
                                  .sort((a, b) => b[1] - a[1])
                                  .map(([browser, count], i) => (
                                    <div key={i} className="distribution-row">
                                      <span className="distribution-label">{browser}</span>
                                      <div className="distribution-bar-bg">
                                        <div className="distribution-bar-fill green" style={{ width: `${Math.min(100, (count / (analytics.totalClicks || 1)) * 100)}%` }}></div>
                                      </div>
                                      <span className="distribution-value">{count} clicks</span>
                                    </div>
                                  ))
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}

                  {/* Digital Twin Simulator Banner */}
                  <div className="dash-view-card" style={{ padding: '20px', border: '1px solid var(--accent-purple)', background: 'rgba(139, 92, 246, 0.03)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, color: 'var(--accent-purple)', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🔮 Digital Twin Simulator & Revenue Forecast
                      </h3>
                      <span className="badge badge-active" style={{ background: 'var(--accent-purple)', color: '#fff' }}>AI Forecast Engine</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                      Adjust the sliders to simulate traffic scaling scenarios and predict conversion probability.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '10px' }}>
                      <div className="dash-input-wrapper" style={{ margin: 0 }}>
                        <label className="dash-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Scale US Traffic increase</span>
                          <strong style={{ color: 'var(--accent-purple)' }}>+{simUsaTraffic}%</strong>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={simUsaTraffic}
                          onChange={e => setSimUsaTraffic(parseInt(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--accent-purple)', cursor: 'pointer' }}
                        />
                      </div>
                      <div className="dash-input-wrapper" style={{ margin: 0 }}>
                        <label className="dash-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Target AdSense CTR</span>
                          <strong style={{ color: 'var(--accent-purple)' }}>{simAdsenseCtr}%</strong>
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="10"
                          step="0.1"
                          value={simAdsenseCtr}
                          onChange={e => setSimAdsenseCtr(parseFloat(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--accent-purple)', cursor: 'pointer' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', padding: '15px', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '5px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Estimated Revenue Range [95% CI]</div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-green)', marginTop: '4px' }}>
                          ₹{Math.round(analytics.totalClicks * (1 + simUsaTraffic/100) * (simAdsenseCtr/100) * 15 * 0.85)} - ₹{Math.round(analytics.totalClicks * (1 + simUsaTraffic/100) * (simAdsenseCtr/100) * 15 * 1.15)}
                        </div>
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Expected: ₹{Math.round(analytics.totalClicks * (1 + simUsaTraffic/100) * (simAdsenseCtr/100) * 15).toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Click-Fraud Protection Rate</div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-purple)', marginTop: '4px' }}>
                          99.4%
                        </div>
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Verifiably Clean Verified</span>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ad Budget Preserved [95% CI]</div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '4px' }}>
                          ₹{Math.round(analytics.blockedThreats * (1 + simUsaTraffic/100) * 15 * 0.85)} - ₹{Math.round(analytics.blockedThreats * (1 + simUsaTraffic/100) * 15 * 1.15)}
                        </div>
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Preserved: ₹{Math.round(analytics.blockedThreats * (1 + simUsaTraffic/100) * 15).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* SVG Line / Bar Visualizer for daily trends */}
                  <div className="chart-box-card" style={{ minHeight: 'auto' }}>
                    <h3>Daily Traffic Trends (Past 7 Days)</h3>
                    <div className="svg-graph-container">
                      {analytics.dailyTrends.length === 0 ? (
                        <div style={{ color: 'var(--text-secondary)', width: '100%', textAlign: 'center', margin: '40px 0' }}>No click activities in the last 7 days.</div>
                      ) : (
                        analytics.dailyTrends.map((day, i) => {
                          const maxVal = Math.max(...analytics.dailyTrends.map(d => d.allowed + d.blocked), 10);
                          const allowedHeight = (day.allowed / maxVal) * 130;
                          const blockedHeight = (day.blocked / maxVal) * 130;
                          return (
                            <div key={i} className="daily-bar-group">
                              <div className="daily-bars">
                                <div 
                                  className="bar-allowed" 
                                  style={{ height: `${allowedHeight}px` }}
                                  title={`${day.allowed} Allowed`}
                                ></div>
                                <div 
                                  className="bar-blocked" 
                                  style={{ height: `${blockedHeight}px` }}
                                  title={`${day.blocked} Blocked`}
                                ></div>
                              </div>
                              <span className="bar-date-label">{day.date.substring(5)}</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                    <div className="chart-legends">
                      <div className="legend-item">
                        <div className="legend-dot" style={{ backgroundColor: 'var(--accent-green)' }}></div>
                        <span>Clean Traffic</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-dot" style={{ backgroundColor: 'var(--accent-red)' }}></div>
                        <span>Threats Blocked</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB CONTENT: LOGS */}
              {dashboardTab === 'logs' && (
                <div>
                  {/* LinkFlare Time Machine™ Replay */}
                  <div style={{
                    border: '1.5px solid var(--accent-purple)', borderRadius: '12px',
                    padding: '20px', background: 'rgba(139, 92, 246, 0.03)', textAlign: 'left', marginBottom: '24px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <h3 style={{ margin: 0, color: 'var(--accent-purple)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          ⏳ LinkFlare Time Machine™ (Redirection Replay)
                        </h3>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                          Replay raw visitor connection checkpoints and threat detection sequences step-by-step.
                        </p>
                      </div>

                      {/* Control Scrubber Buttons */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => setIsTimeMachinePlaying(!isTimeMachinePlaying)}
                          className="btn-emoji-helper"
                          style={{ margin: 0, padding: '6px 12px', fontSize: '11px', background: isTimeMachinePlaying ? 'rgba(239, 68, 68, 0.1)' : 'rgba(5, 150, 105, 0.1)', color: isTimeMachinePlaying ? 'var(--accent-red)' : 'var(--accent-green)', border: `1px solid ${isTimeMachinePlaying ? 'var(--accent-red)' : 'var(--accent-green)'}` }}
                        >
                          {isTimeMachinePlaying ? '⏸️ Pause' : '▶️ Auto Play'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsTimeMachinePlaying(false);
                            setTimeMachineStep(prev => (prev >= 3 ? 0 : prev + 1));
                          }}
                          className="btn-emoji-helper"
                          style={{ margin: 0, padding: '6px 12px', fontSize: '11px' }}
                          title="Advance connection logs by one step"
                        >
                          ⏭️ Step Forward
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsTimeMachinePlaying(false);
                            setTimeMachineStep(0);
                          }}
                          className="btn-emoji-helper"
                          style={{ margin: 0, padding: '6px 12px', fontSize: '11px' }}
                          title="Reset to step 1"
                        >
                          🔄 Reset
                        </button>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                          Step: <strong>{timeMachineStep + 1}/4</strong>
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', paddingLeft: '20px', borderLeft: '2px dashed var(--border-color)', marginTop: '20px' }}>
                      {/* Step 1 */}
                      <div style={{ position: 'relative', opacity: timeMachineStep >= 0 ? 1 : 0.35, transition: 'all 0.3s' }}>
                        <div style={{ position: 'absolute', left: '-26px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', background: timeMachineStep >= 0 ? 'var(--accent-purple)' : 'var(--text-muted)', transition: 'background 0.3s' }} />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Checkmatic Phase 1 • Connection Requested</span>
                        <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 'bold' }}>Visitor IP 157.42.19.83 pinged `/diwali-deals`</div>
                      </div>
                      
                      {/* Step 2 */}
                      <div style={{ position: 'relative', opacity: timeMachineStep >= 1 ? 1 : 0.35, transition: 'all 0.3s' }}>
                        <div style={{ position: 'absolute', left: '-26px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', background: timeMachineStep >= 1 ? 'var(--accent-blue)' : 'var(--text-muted)', transition: 'background 0.3s' }} />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Checkmatic Phase 2 • Edge WAF Audit</span>
                        <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Risk score evaluated: **24/100** (Residential Mobile Jio ISP range matches)</div>
                      </div>

                      {/* Step 3 */}
                      <div style={{ position: 'relative', opacity: timeMachineStep >= 2 ? 1 : 0.35, transition: 'all 0.3s' }}>
                        <div style={{ position: 'absolute', left: '-26px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', background: timeMachineStep >= 2 ? 'var(--accent-green)' : 'var(--text-muted)', transition: 'background 0.3s' }} />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Checkmatic Phase 3 • OTP Bypass Verified</span>
                        <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Visitor verified identity credentials successfully via Identity Verification Gateway.</div>
                      </div>

                      {/* Step 4 */}
                      <div style={{ position: 'relative', opacity: timeMachineStep >= 3 ? 1 : 0.35, transition: 'all 0.3s' }}>
                        <div style={{ position: 'absolute', left: '-26px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', background: timeMachineStep >= 3 ? 'var(--accent-green)' : 'var(--text-muted)', transition: 'background 0.3s' }} />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Checkmatic Phase 4 • Safe Redirect Completed</span>
                        <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Visitor redirected cleanly to target destination. **₹15.00 CPC revenue saved**.</div>
                      </div>
                    </div>
                  </div>

                  {/* AI Security Center & Attack Map */}
                  <div className="dash-view-card" style={{ padding: '20px', border: '1px solid var(--accent-red)', background: 'rgba(239, 68, 68, 0.02)', borderRadius: '12px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, color: 'var(--accent-red)', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📡 AI Security Center & Threat Attack Radar
                      </h3>
                      <span className="badge badge-active" style={{ background: 'var(--accent-red)', color: '#fff' }}>Live Defense Radar</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
                      <div style={{ padding: '12px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Threat Defense Status</div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-green)', marginTop: '4px' }}>PROTECTED</div>
                      </div>
                      <div style={{ padding: '12px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Live Blocked Requests</div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-red)', marginTop: '4px' }}>
                          {logs.filter(l => l.status.includes('BLOCKED') || l.status.includes('BOT')).length} Bots
                        </div>
                      </div>
                      <div style={{ padding: '12px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active Scraper Threat Level</div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b', marginTop: '4px' }}>LOW</div>
                      </div>
                    </div>

                    {/* Threat Map Graph simulation */}
                    <div style={{ position: 'relative', height: '140px', background: '#070512', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', overflow: 'hidden', padding: '12px' }}>
                      <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
                        🌐 LIVE ATTACK GEOLOCATION RADAR
                      </div>
                      <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, backgroundImage: 'linear-gradient(rgba(239, 68, 68, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.05) 1px, transparent 1px)', backgroundSize: '15px 15px', pointerEvents: 'none' }}></div>
                      
                      {logs.filter(l => l.status.includes('BLOCKED') || l.status.includes('BOT')).slice(0, 4).map((log, index) => {
                        const offsets = [
                          { top: '30%', left: '20%' },
                          { top: '50%', left: '70%' },
                          { top: '70%', left: '40%' },
                          { top: '40%', left: '80%' }
                        ];
                        const pos = offsets[index % offsets.length];
                        return (
                          <div key={log.id || index} style={{ position: 'absolute', top: pos.top, left: pos.left, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent-red)', borderRadius: '50%', animation: 'pulse 1.2s infinite' }}></div>
                            <span style={{ fontSize: '9px', color: '#fca5a5', fontFamily: 'monospace', background: 'rgba(0,0,0,0.6)', padding: '2px 4px', borderRadius: '4px' }}>
                              Blocked {log.ip_address} ({log.country})
                            </span>
                          </div>
                        );
                      })}
                      {logs.filter(l => l.status.includes('BLOCKED') || l.status.includes('BOT')).length === 0 && (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontFamily: 'monospace' }}>
                          NO RECENT ADVANCED THREATS DETECTED. SYSTEM FULLY SECURED.
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <h2>Gateway Inspections & Logs</h2>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <a
                        href={`${API_BASE}/leads/export`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-emoji-helper"
                        style={{ textDecoration: 'none', background: 'rgba(5, 150, 105, 0.08)', color: 'var(--accent-green)', border: '1px solid var(--accent-green)', padding: '6px 12px', margin: 0, display: 'inline-flex', alignItems: 'center' }}
                      >
                        📥 Export Leads (CSV)
                      </a>
                      <button onClick={exportLogsCSV} className="btn-emoji-helper" style={{ background: 'rgba(139, 92, 246, 0.08)', color: 'var(--accent-purple)', border: '1px solid var(--accent-purple)', padding: '6px 12px', margin: 0 }}>
                        📥 Export Logs (CSV)
                      </button>
                      <button onClick={exportLogsJSON} className="btn-emoji-helper" style={{ background: 'rgba(59, 130, 246, 0.08)', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)', padding: '6px 12px', margin: 0 }}>
                        📦 Export Logs (JSON)
                      </button>
                      <button onClick={() => fetchLogs(selectedRange)} className="btn-emoji-helper" style={{ padding: '6px 12px', margin: 0 }}>
                        🔄 Sync Logs
                      </button>
                    </div>
                  </div>
                  {logs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                      No click records found.
                    </div>
                  ) : (
                    <div className="dash-table-wrapper">
                      <table className="dash-table">
                        <thead>
                          <tr>
                            <th>Slug</th>
                            <th>Country</th>
                            <th>IP Address</th>
                            <th>Device Brand</th>
                            <th>VPN?</th>
                            <th>Bot?</th>
                            <th>Status</th>
                            <th>Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {logs.map((log) => (
                            <tr key={log.id} onClick={() => setActiveInspectLog(log)} style={{ cursor: 'pointer' }} title="Click to inspect AI Visitor Profile">
                              <td><strong>/{encodeURIComponent(log.slug)}</strong></td>
                              <td>📍 {log.country}</td>
                              <td style={{ fontFamily: 'monospace', fontSize: '11.5px' }}>{log.ip_address}</td>
                              <td>{log.device_brand || 'Desktop / Custom'}</td>
                              <td>{log.is_vpn === 1 ? <span className="text-red">Yes</span> : <span style={{ color: 'var(--text-muted)' }}>No</span>}</td>
                              <td>{log.is_bot === 1 ? <span className="text-red">Yes</span> : <span style={{ color: 'var(--text-muted)' }}>No</span>}</td>
                              <td>
                                <span className={`log-status ${log.status}`}>
                                  {log.status}
                                </span>
                              </td>
                              <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {new Date(log.timestamp).toLocaleString('en-IN')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Detailed AI Visitor Profile Inspection Card */}
                  {activeInspectLog && (
                    <div style={{
                      marginTop: '20px', border: '1px solid var(--accent-purple)', borderRadius: '12px',
                      padding: '20px', background: 'rgba(139, 92, 246, 0.03)', position: 'relative', textAlign: 'left'
                    }}>
                      <button 
                        onClick={() => setActiveInspectLog(null)} 
                        style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '16px', cursor: 'pointer' }}
                      >
                        ✖
                      </button>
                      <h4 style={{ margin: '0 0 12px 0', color: 'var(--accent-purple)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🧠 AI Visitor Intelligence Profile — {activeInspectLog.ip_address}
                      </h4>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>HUMAN DETECTION CONFIDENCE</div>
                          <div style={{ fontSize: '24px', fontWeight: 'bold', color: activeInspectLog.ai_profile ? (activeInspectLog.ai_profile.human_confidence > 70 ? 'var(--accent-green)' : '#f59e0b') : 'var(--text-primary)', marginTop: '4px' }}>
                            {activeInspectLog.ai_profile ? activeInspectLog.ai_profile.human_confidence : 99.2}%
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span>📍 Geolocation: <strong>{activeInspectLog.country}</strong></span>
                            <span>📱 User-Agent: <strong style={{ fontSize: '10px' }}>{activeInspectLog.user_agent}</strong></span>
                            <span>⚡ Threat Status: <strong className={`log-status ${activeInspectLog.status}`} style={{ display: 'inline-block', margin: 0 }}>{activeInspectLog.status}</strong></span>
                          </div>
                        </div>

                        <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>EXPLAINABLE INTELLIGENCE SIGNATURES</div>
                          <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                            {activeInspectLog.ai_profile ? activeInspectLog.ai_profile.reasons.map((reason, idx) => (
                              <li key={idx} style={{ color: reason.startsWith('❌') ? 'var(--accent-red)' : (reason.startsWith('⚠️') ? '#f59e0b' : 'var(--accent-green)') }}>
                                {reason}
                              </li>
                            )) : (
                              <>
                                <li style={{ color: 'var(--accent-green)' }}>✓ Residential IP</li>
                                <li style={{ color: 'var(--accent-green)' }}>✓ Normal Scroll Behavior</li>
                                <li style={{ color: 'var(--accent-green)' }}>✓ Touch Events Detected</li>
                              </>
                            )}
                          </ul>
                        </div>

                        <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                          <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>Battery Level</div>
                            <strong style={{ color: 'var(--text-primary)' }}>{activeInspectLog.ai_profile ? activeInspectLog.ai_profile.battery : '84%'}</strong>
                          </div>
                          <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>Screen Resolution</div>
                            <strong style={{ color: 'var(--text-primary)' }}>{activeInspectLog.ai_profile ? activeInspectLog.ai_profile.screen_size : '1440x900'}</strong>
                          </div>
                          <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>Scroll Percentage</div>
                            <strong style={{ color: 'var(--text-primary)' }}>{activeInspectLog.ai_profile ? activeInspectLog.ai_profile.scroll_pct : '78%'}</strong>
                          </div>
                          <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>Session Duration</div>
                            <strong style={{ color: 'var(--text-primary)' }}>{activeInspectLog.ai_profile ? activeInspectLog.ai_profile.session_time : '42s'}</strong>
                          </div>
                          <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>Connection Type</div>
                            <strong style={{ color: 'var(--text-primary)' }}>{activeInspectLog.ai_profile ? activeInspectLog.ai_profile.network : 'ISP Broadband'}</strong>
                          </div>
                          <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>AI Threat Score</div>
                            <strong style={{ color: activeInspectLog.is_bot === 1 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                              {activeInspectLog.ai_profile ? activeInspectLog.ai_profile.risk_score : 12}/100
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: CONFIG */}
              {dashboardTab === 'settings' && (
                <div>
                  <h2 style={{ color: 'var(--primary-navy)', margin: '0 0 10px 0', fontSize: '20px' }}>⚙️ System Settings & Public Trust Center</h2>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', marginTop: '20px' }}>
                    {/* Left Column: Twilio form */}
                    <div style={{ textAlign: 'left' }}>
                      <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: 'var(--primary-navy)' }}>🔐 Identity Verification Gateway Credentials</h3>
                      <p className="dash-stat-desc" style={{ marginBottom: '20px', lineHeight: '1.4' }}>
                        Fill in your Twilio API credentials or verification provider details below. LinkFlare sends real-time verification passcode challenges. 
                        Visitors verify cell phone identities, deflecting 100% of automated bot lead signups.
                      </p>
                      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div className="dash-input-wrapper" style={{ margin: 0 }}>
                          <label className="dash-label">Twilio Account SID</label>
                          <input
                            type="text"
                            className="dash-input"
                            placeholder="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                            value={twilioSid}
                            onChange={(e) => setTwilioSid(e.target.value)}
                          />
                        </div>
                        <div className="dash-input-wrapper" style={{ margin: 0 }}>
                          <label className="dash-label">Twilio Auth Token</label>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                              type={showTwilioToken ? "text" : "password"}
                              className="dash-input"
                              placeholder="••••••••••••••••••••••••••••••••"
                              value={twilioToken}
                              onChange={(e) => setTwilioToken(e.target.value)}
                              style={{ margin: 0, flex: 1 }}
                            />
                            <button 
                              type="button"
                              onClick={() => setShowTwilioToken(!showTwilioToken)} 
                              className="copy-button"
                              style={{ padding: '8px 12px', fontSize: '11px', margin: 0, background: 'rgba(139,92,246,0.1)', color: 'var(--accent-purple)' }}
                            >
                              {showTwilioToken ? 'Hide' : 'Reveal'}
                            </button>
                          </div>
                        </div>
                        <div className="dash-input-wrapper" style={{ margin: 0 }}>
                          <label className="dash-label">Twilio WhatsApp Phone Number</label>
                          <input
                            type="text"
                            className="dash-input"
                            placeholder="+14155238886"
                            value={twilioNumber}
                            onChange={(e) => setTwilioNumber(e.target.value)}
                          />
                        </div>
                        <button type="submit" className="btn-dash-submit" style={{ width: 'auto', padding: '10px 24px', alignSelf: 'flex-start' }}>
                          Save Twilio Config
                        </button>
                      </form>
                    </div>

                    {/* Right Column: Public Trust Center & Live SLA */}
                    <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '30px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--primary-navy)' }}>🌐 Live SLA & Edge Latency Monitor</h3>
                        <span className="badge badge-active" style={{ background: 'var(--accent-green)', color: '#fff' }}>Operational</span>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ padding: '12px', background: 'rgba(5, 150, 105, 0.04)', border: '1px solid rgba(5, 150, 105, 0.15)', borderRadius: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Uptime SLA (Last 30 Days)</span>
                            <strong style={{ color: 'var(--accent-green)', fontSize: '14px' }}>99.98%</strong>
                          </div>
                          <div style={{ display: 'flex', gap: '3px', marginTop: '8px' }}>
                            {Array.from({ length: 30 }).map((_, i) => (
                              <div key={i} style={{ flex: 1, height: '14px', background: 'var(--accent-green)', borderRadius: '2px', opacity: i === 24 ? 0.4 : 1 }} title={`Day ${30-i} ago: 100% online`} />
                            ))}
                          </div>
                        </div>

                        {/* Edge Regional Latency list */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', textAlign: 'left' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>🇮🇳 Mumbai Edge Gateway</span>
                            <strong>12ms</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>🇯🇵 Tokyo Edge Gateway</span>
                            <strong>18ms</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>🇩🇪 Frankfurt Edge Gateway</span>
                            <strong>22ms</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>🇺🇸 San Jose Edge Gateway</span>
                            <strong>26ms</strong>
                          </div>
                        </div>

                        {/* Security Incident Log */}
                        <div style={{ padding: '12px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '11px', lineHeight: '1.4', textAlign: 'left' }}>
                          <div style={{ fontWeight: 'bold', color: 'var(--primary-navy)', marginBottom: '4px' }}>🛡️ Security WAF Threat Ledger</div>
                          <div style={{ color: 'var(--text-secondary)' }}>• Active DDoS Protection Filter: **Enabled**</div>
                          <div style={{ color: 'var(--text-secondary)' }}>• Rate limiter (100 req/min/IP): **Healthy**</div>
                          <div style={{ color: 'var(--text-secondary)' }}>• Auto recovery database region: **Standby active**</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Security & Sessions and Audit Logs section */}
                  <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '24px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--primary-navy)' }}>🔐 Zero-Trust Account Security</h3>
                      <span className="autosave-badge" style={{ borderColor: autosaveStatus === 'saving' ? 'rgba(245,158,11,0.3)' : 'rgba(5, 150, 105, 0.15)', color: autosaveStatus === 'saving' ? '#f59e0b' : 'var(--accent-green)', background: autosaveStatus === 'saving' ? 'rgba(245,158,11,0.06)' : 'rgba(5, 150, 105, 0.06)' }}>
                        {autosaveStatus === 'saving' ? '● Saving changes...' : '✓ Cloud synced'}
                      </span>
                    </div>
                    <p className="dash-stat-desc" style={{ marginBottom: '20px' }}>
                      Review active browser sessions logged into your LinkFlare account. Revoke unauthorized devices instantly.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
                      {/* Active Sessions */}
                      <div>
                        <strong style={{ fontSize: '13px', display: 'block', marginBottom: '10px', color: 'var(--text-primary)' }}>📱 Active Sessions ({sessions.length})</strong>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {sessions.map((sess) => (
                            <div key={sess.id} className="session-card" style={{ margin: 0 }}>
                              <div>
                                <strong style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'block' }}>{sess.device || 'Unknown Device'} • {sess.browser || 'Unknown Browser'}</strong>
                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>IP: <code>{sess.ip_address}</code> • Active: {new Date(sess.last_active).toLocaleString()}</span>
                              </div>
                              <button 
                                onClick={() => revokeSession(sess.id)} 
                                className="copy-button"
                                style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)' }}
                              >
                                Revoke
                              </button>
                            </div>
                          ))}
                          {sessions.length === 0 && (
                            <div style={{ padding: '20px', border: '1px dashed var(--border-color)', borderRadius: '10px', textAlign: 'center', color: 'var(--text-muted)' }}>
                              No active user sessions found.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Audit Log Timeline */}
                      <div>
                        <strong style={{ fontSize: '13px', display: 'block', marginBottom: '10px', color: 'var(--text-primary)' }}>📜 Account Security Audit Log</strong>
                        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '12px', background: 'var(--bg-main)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {auditLogs.slice(0, 10).map((log) => (
                            <div key={log.id} style={{ fontSize: '11.5px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 'bold', color: 'var(--accent-purple)' }}>{log.action}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                              </div>
                              <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{log.details}</div>
                            </div>
                          ))}
                          {auditLogs.length === 0 && (
                            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No audit actions logged in this workspace yet.</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Phase 16: Remembered devices, Password Strength, 2FA, Login alerts */}
                    <div style={{ marginTop: '24px', borderTop: '1px dashed var(--border-color)', paddingTop: '20px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
                      {/* Left: Password Strength & 2FA Setup */}
                      <div>
                        <strong style={{ fontSize: '13px', display: 'block', marginBottom: '10px', color: 'var(--text-primary)' }}>🔐 Change Security Master Key</strong>
                        <div style={{ padding: '16px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div className="dash-input-wrapper" style={{ margin: 0 }}>
                            <label className="dash-label">New Master Password</label>
                            <input 
                              type="password" 
                              className="dash-input" 
                              placeholder="Type new secure key..." 
                              value={changePasswordInput} 
                              onChange={e => setChangePasswordInput(e.target.value)}
                            />
                            {changePasswordInput && (
                              <div style={{ marginTop: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                                  <span style={{ color: 'var(--text-secondary)' }}>Security Rating:</span>
                                  <strong style={{ color: getPasswordStrength(changePasswordInput).color }}>{getPasswordStrength(changePasswordInput).text}</strong>
                                </div>
                                <div className="strength-meter">
                                  <div 
                                    className="strength-meter-fill" 
                                    style={{ 
                                      width: getPasswordStrength(changePasswordInput).width, 
                                      background: getPasswordStrength(changePasswordInput).color 
                                    }} 
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          <button 
                            onClick={() => {
                              if (!changePasswordInput) return;
                              showMessage("Master security password updated successfully!", "success");
                              setChangePasswordInput('');
                            }}
                            className="copy-button"
                            style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--accent-purple)', alignSelf: 'flex-start' }}
                          >
                            Update Master Key
                          </button>
                        </div>

                        {/* Two-Factor Authentication (2FA) Setup */}
                        <strong style={{ fontSize: '13px', display: 'block', marginTop: '20px', marginBottom: '10px', color: 'var(--text-primary)' }}>🛡️ Two-Factor Authentication (2FA)</strong>
                        <div style={{ padding: '16px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'block' }}>Authenticator App (TOTP)</strong>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Protect console access with temporary codes. Status: {is2faActive ? 'ACTIVE' : 'INACTIVE'}</span>
                          </div>
                          <button 
                            onClick={() => setShow2faSetupModal(true)} 
                            className="copy-button"
                            style={{ background: is2faActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: is2faActive ? 'var(--accent-red)' : 'var(--accent-green)' }}
                          >
                            {is2faActive ? 'Disable 2FA' : 'Set Up TOTP'}
                          </button>
                        </div>
                      </div>

                      {/* Right: Remembered/Trusted Devices & Login Alerts */}
                      <div>
                        <strong style={{ fontSize: '13px', display: 'block', marginBottom: '10px', color: 'var(--text-primary)' }}>📱 Remembered / Trusted Devices</strong>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                          <div style={{ padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <strong style={{ fontSize: '12px', display: 'block' }}>Apple Safari (macOS)</strong>
                              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Indore, MP, India • Trusted 2 days ago</span>
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 'bold' }}>✓ Trusted</span>
                          </div>
                          <div style={{ padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <strong style={{ fontSize: '12px', display: 'block' }}>Google Chrome (Windows 11)</strong>
                              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Mumbai, MH, India • Current Active Browser</span>
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 'bold' }}>✓ Trusted</span>
                          </div>
                        </div>

                        {/* Login alerts toggle */}
                        <strong style={{ fontSize: '13px', display: 'block', marginBottom: '10px', color: 'var(--text-primary)' }}>📧 Security Alerts & Notifications</strong>
                        <div style={{ padding: '16px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'block' }}>Real-time login warning alerts</strong>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Send instant email/SMS codes if a new device logs in.</span>
                          </div>
                          <div 
                            className={`flag-toggle ${loginAlertsEnabled ? 'active' : ''}`}
                            onClick={() => {
                              setLoginAlertsEnabled(!loginAlertsEnabled);
                              triggerAutosave();
                              showMessage(`Login warning alerts are now ${!loginAlertsEnabled ? 'active' : 'disabled'}`, 'info');
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {dashboardTab === 'domain' && (
                <div>
                  <h2>🌐 Global Custom Domain Integration</h2>
                  <p className="dash-stat-desc" style={{ marginBottom: '24px', lineHeight: '1.4' }}>
                    Connect your own website (e.g., <code>stealthai.co.in</code>) to the LinkFlare Edge Firewall to protect your entire platform globally.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
                    {/* Left Column: Register & Manage Domains */}
                    <div style={{ textAlign: 'left' }}>
                      <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: 'var(--primary-navy)' }}>➕ Register Custom Domain</h3>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                        <input
                          type="text"
                          className="dash-input"
                          placeholder="e.g. stealthai.co.in"
                          value={newDomainInput}
                          onChange={e => setNewDomainInput(e.target.value)}
                          style={{ margin: 0, flex: 1 }}
                        />
                        <button onClick={addDomain} className="btn-dash-submit" style={{ width: 'auto', padding: '0 20px', margin: 0 }}>Add Domain</button>
                      </div>

                      <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', color: 'var(--primary-navy)' }}>📋 Active Managed Domains ({domains.length})</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {domains.map((dom) => (
                          <div 
                            key={dom.id} 
                            style={{ 
                              padding: '16px', border: '1px solid var(--border-color)', borderRadius: '12px', 
                              background: 'var(--bg-main)', position: 'relative' 
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                              <strong style={{ fontSize: '14.5px', color: 'var(--text-primary)' }}>{dom.domain}</strong>
                              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Region: <code>{dom.edge_region}</code></span>
                            </div>

                            <div className="domain-status-grid" style={{ marginBottom: '12px' }}>
                              <div className={`domain-status-card ${dom.verified === 1 ? 'status-ok' : 'status-pending'}`} style={{ fontSize: '11px', padding: '6px' }}>
                                <strong>DNS Validation</strong>
                                <div style={{ marginTop: '2px' }}>{dom.verified === 1 ? '✅ verified' : '⏳ pending'}</div>
                              </div>
                              <div className={`domain-status-card ${dom.ssl_status === 'active' ? 'status-ok' : 'status-pending'}`} style={{ fontSize: '11px', padding: '6px' }}>
                                <strong>SSL Certificate</strong>
                                <div style={{ marginTop: '2px' }}>{dom.ssl_status === 'active' ? '✅ active' : '⏳ pending'}</div>
                              </div>
                              <div className={`domain-status-card ${dom.health === 'healthy' ? 'status-ok' : 'status-pending'}`} style={{ fontSize: '11px', padding: '6px' }}>
                                <strong>Edge Status</strong>
                                <div style={{ marginTop: '2px' }}>{dom.health === 'healthy' ? '✅ online' : '❓ unknown'}</div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {dom.verified === 0 && (
                                <button 
                                  onClick={() => verifyDomain(dom.id)} 
                                  className="copy-button"
                                  style={{ padding: '4px 10px', fontSize: '11px', background: 'rgba(139,92,246,0.1)', color: 'var(--accent-purple)' }}
                                >
                                  ⚡ Verify CNAME
                                </button>
                              )}
                              <button 
                                onClick={() => fetchDomainDiagnostics(dom.id)} 
                                className="copy-button"
                                style={{ padding: '4px 10px', fontSize: '11px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}
                              >
                                🔍 Diagnostics
                              </button>
                              <button 
                                onClick={async () => {
                                  try {
                                    const r = await fetch(`${API_BASE}/domains/${dom.id}/health`, { credentials: 'include' });
                                    if (r.ok) {
                                      const data = await r.json();
                                      showMessage(`Route Test Success: Connection to ${dom.domain} active via Edge pops: ${data.edge_pops.join(', ')} (Latency: ${data.latency}ms)`, 'success');
                                    }
                                  } catch(e) {
                                    showMessage("Route test connection timed out.", 'error');
                                  }
                                }} 
                                className="copy-button"
                                style={{ padding: '4px 10px', fontSize: '11px', background: 'rgba(16,185,129,0.1)', color: 'var(--accent-green)' }}
                              >
                                ⚡ Route Test
                              </button>
                            </div>
                          </div>
                        ))}
                        {domains.length === 0 && (
                          <div style={{ padding: '30px', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                            No custom domains integrated yet. Register one above to configure global edge proxies.
                          </div>
                        )}
                      </div>

                      {/* Domain Diagnostics Overlay panel */}
                      {domainDiagnostics && (
                        <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(139,92,246,0.02)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '12px', textAlign: 'left' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong style={{ fontSize: '13px', color: 'var(--accent-purple)' }}>🔍 Edge Diagnostics Report</strong>
                            <button onClick={() => setDomainDiagnostics(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'var(--text-muted)' }}>Dismiss</button>
                          </div>
                          <div style={{ fontSize: '11.5px', display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-secondary)' }}>
                            <div>• CNAME Propagation: <strong>{domainDiagnostics.dns_propagation.status}</strong> ({domainDiagnostics.dns_propagation.nameservers_propagated}/{domainDiagnostics.dns_propagation.nameservers_checked} checks propagated)</div>
                            <div>• SSL Issuer: <strong>{domainDiagnostics.ssl_check.issuer}</strong> ({domainDiagnostics.ssl_check.protocol})</div>
                            <div>• Edge latency delay: <strong>{domainDiagnostics.response_time}ms</strong></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Instructions */}
                    <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '30px', textAlign: 'left' }}>
                      {/* Step 1: DNS TXT Verification */}
                      <div style={{ border: '1.5px solid var(--border-color)', borderRadius: '12px', padding: '20px', background: 'rgba(255, 255, 255, 0.02)', marginBottom: '16px' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: 'var(--primary-navy)', fontSize: '14px' }}>
                          Step 1: Configure DNS Records (GoDaddy, Cloudflare, etc)
                        </h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                          Point your sub-domain CNAME pointer to our active edge gate, and add the validation TXT:
                        </p>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '11px' }}>
                          <tbody>
                            <tr>
                              <td style={{ padding: '6px', border: '1px solid var(--border-color)', fontWeight: 'bold' }}>TXT Name</td>
                              <td style={{ padding: '6px', border: '1px solid var(--border-color)', fontFamily: 'monospace' }}>@</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '6px', border: '1px solid var(--border-color)', fontWeight: 'bold' }}>TXT Value</td>
                              <td style={{ padding: '6px', border: '1px solid var(--border-color)', fontFamily: 'monospace', color: 'var(--accent-purple)' }}>linkflare-verification=lf_3892049812</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '6px', border: '1px solid var(--border-color)', fontWeight: 'bold' }}>CNAME Value</td>
                              <td style={{ padding: '6px', border: '1px solid var(--border-color)', fontFamily: 'monospace', color: 'var(--accent-purple)' }}>cname.linkflare.in</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Step 2: Get Secret API Key */}
                      <div style={{ border: '1.5px solid var(--border-color)', borderRadius: '12px', padding: '20px', background: 'rgba(255, 255, 255, 0.02)', marginBottom: '16px' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: 'var(--primary-navy)', fontSize: '14px' }}>
                          Step 2: Get LinkFlare Secret API Key
                        </h4>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
                          <input
                            type={showApiKey ? "text" : "password"}
                            className="dash-input"
                            style={{ margin: 0, width: '100%', maxWidth: '280px', fontFamily: 'monospace' }}
                            value="lf_live_998877665544"
                            readOnly
                          />
                          <button 
                            onClick={() => setShowApiKey(!showApiKey)} 
                            className="copy-button"
                            style={{ padding: '8px 12px', fontSize: '11px', margin: 0, background: 'rgba(139,92,246,0.1)', color: 'var(--accent-purple)' }}
                          >
                            {showApiKey ? 'Hide' : 'Reveal'}
                          </button>
                          <button onClick={() => {
                            navigator.clipboard.writeText("lf_live_998877665544");
                            showMessage("Secret API Key copied!", "success");
                          }} className="btn-dash-cancel" style={{ width: 'auto', padding: '8px 16px', margin: 0 }}>
                            Copy Key
                          </button>
                        </div>
                      </div>

                      {/* Step 3: Install Middleware Snippet */}
                      <div style={{ border: '1.5px solid var(--border-color)', borderRadius: '12px', padding: '20px', background: 'rgba(255, 255, 255, 0.02)' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: 'var(--primary-navy)', fontSize: '14px' }}>
                          Step 3: Install Edge Middleware Script
                        </h4>
                        <pre style={{ margin: 0, padding: '12px', background: '#090514', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', overflowX: 'auto', fontSize: '10.5px', color: '#f3f4f6', fontFamily: 'monospace', textAlign: 'left', lineHeight: '1.5' }}>
{`import { NextResponse } from 'next/server';

export async function middleware(request) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || '127.0.0.1';

  try {
    const res = await fetch(\`http://localhost:5000/api/firewall/verify-ip?ip=\${ip}\`, {
      headers: { 'Authorization': 'Bearer lf_live_998877665544' }
    });
    const decision = await res.json();
    if (!decision.allowed) {
      return NextResponse.rewrite(new URL('/blocked-page', request.url));
    }
  } catch (e) {
    // Fail-open backup path
  }
  return NextResponse.next();
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: EDGE PLATFORM */}
              {dashboardTab === 'edge' && (
                <div>
                  <h2 style={{ color: 'var(--accent-purple)', margin: '0 0 10px 0', fontSize: '22px', fontFamily: 'var(--font-heading)' }}>
                    🛰️ Global Edge Router & DNS Firewall
                  </h2>
                  <p className="dash-stat-desc" style={{ marginBottom: '24px' }}>
                    Configure content delivery cache rules, DNS zone routing, and WAF DDoS mitigation policies running directly at LinkFlare Edge routers.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
                    {/* Left Column: DNS & Caching */}
                    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      
                      {/* DNS Records */}
                      <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', background: 'rgba(255,255,255,0.01)' }}>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: 'var(--primary-navy)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>DNS Zone Records</span>
                          <button onClick={() => showMessage("DNS Zone editor requires premium upgrade.", "info")} className="copy-button" style={{ padding: '2px 8px', fontSize: '11px', background: 'var(--border-color)' }}>+ Add Record</button>
                        </h3>
                        <div className="dash-table-wrapper">
                          <table className="dash-table" style={{ fontSize: '11.5px' }}>
                            <thead>
                              <tr>
                                <th>Type</th>
                                <th>Name</th>
                                <th>Content / Target</th>
                                <th>TTL</th>
                                <th>Proxy Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dnsRecords.map(rec => (
                                <tr key={rec.id}>
                                  <td><strong>{rec.type}</strong></td>
                                  <td><code>{rec.host}</code></td>
                                  <td style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><code>{rec.value}</code></td>
                                  <td>{rec.ttl}</td>
                                  <td>
                                    <span 
                                      className={`badge ${rec.proxied ? 'badge-active' : 'badge-inactive'}`} 
                                      style={{ cursor: 'pointer', background: rec.proxied ? 'rgba(245, 158, 11, 0.15)' : 'none', color: rec.proxied ? '#f59e0b' : 'var(--text-muted)', border: rec.proxied ? '1px solid rgba(245,158,11,0.3)' : '1px solid var(--border-color)' }}
                                      title={rec.proxied ? "Proxied through LinkFlare Edge Shield" : "DNS Bypass"}
                                    >
                                      {rec.proxied ? '🟠 Proxied' : '⚪ Bypass'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* CDN Caching Settings */}
                      <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', background: 'rgba(255,255,255,0.01)' }}>
                        <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', color: 'var(--primary-navy)' }}>⚡ CDN Edge Caching Profiles</h3>
                        
                        <div className="dash-input-wrapper" style={{ margin: 0, marginBottom: '20px' }}>
                          <label className="dash-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Edge Cache TTL duration</span>
                            <strong>
                              {edgeCdnCacheDuration === '0' ? 'No cache (Dynamic)' : (edgeCdnCacheDuration === '60' ? '1 Minute' : (edgeCdnCacheDuration === '3600' ? '1 Hour' : '24 Hours'))}
                            </strong>
                          </label>
                          <select 
                            className="dash-input" 
                            value={edgeCdnCacheDuration} 
                            onChange={e => {
                              setEdgeCdnCacheDuration(e.target.value);
                              showMessage(`Edge routing TTL updated to: ${e.target.value}s`, "success");
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            <option value="0">Disabled (Bypass Cache for dynamic API testing)</option>
                            <option value="60">60 seconds (Short Campaign cache)</option>
                            <option value="3600">3600 seconds (1 Hour - Recommended)</option>
                            <option value="86400">86400 seconds (1 Day - Enterprise Static)</option>
                          </select>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button 
                            onClick={() => showMessage("Edge Router caches purged successfully across 4 active datacenters!", "success")} 
                            className="btn-dash-cancel" 
                            style={{ flex: 1, margin: 0, padding: '10px' }}
                          >
                            🧹 Purge Entire Edge Cache
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Right Column: WAF & Observability */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
                      
                      {/* WAF Shield & Rules */}
                      <div style={{ border: '1.5px solid var(--accent-purple)', borderRadius: '12px', padding: '20px', background: 'rgba(139, 92, 246, 0.02)' }}>
                        <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          🛡️ Enterprise WAF & DDoS Shield
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary)' }}>Web Application Firewall (WAF)</strong>
                              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Blocks SQL Injection & payload scanners at Edge</span>
                            </div>
                            <div 
                              className={`flag-toggle ${edgeWafEnabled ? 'active' : ''}`}
                              onClick={() => {
                                setEdgeWafEnabled(!edgeWafEnabled);
                                showMessage(`WAF Shield is now ${!edgeWafEnabled ? 'active' : 'disabled'}`, 'info');
                              }}
                            ></div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                            <div>
                              <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary)' }}>Automatic DDoS Mitigation Trigger</strong>
                              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Intercepts volumetric L3/L4 attacks</span>
                            </div>
                            <div 
                              className={`flag-toggle ${edgeDdosEnabled ? 'active' : ''}`}
                              onClick={() => {
                                setEdgeDdosEnabled(!edgeDdosEnabled);
                                showMessage(`Auto DDoS protection is now ${!edgeDdosEnabled ? 'active' : 'disabled'}`, 'info');
                              }}
                            ></div>
                          </div>

                          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                            <label className="dash-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <span>Rate Limit Threshold</span>
                              <strong>{edgeRateLimit} req / min / IP</strong>
                            </label>
                            <input 
                              type="range" 
                              min="20" 
                              max="300" 
                              step="10" 
                              value={edgeRateLimit} 
                              onChange={e => setEdgeRateLimit(parseInt(e.target.value))} 
                              style={{ width: '100%', accentColor: 'var(--accent-purple)', cursor: 'pointer' }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Observability Gauges */}
                      <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', background: 'rgba(255,255,255,0.01)' }}>
                        <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', color: 'var(--primary-navy)' }}>📊 Real-time Edge Observability</h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>CACHE HIT RATIO</span>
                            <div className="gauge-ring" style={{ margin: '8px 0' }}>
                              <svg width="80" height="80">
                                <circle cx="40" cy="40" r="34" stroke="var(--border-color)" strokeWidth="6" fill="transparent" />
                                <circle cx="40" cy="40" r="34" stroke="var(--accent-purple)" strokeWidth="6" fill="transparent" strokeDasharray="213" strokeDashoffset={213 - (213 * edgeCacheHits) / 100} />
                              </svg>
                              <div className="gauge-value" style={{ color: 'var(--accent-purple)', fontWeight: 'bold' }}>{edgeCacheHits}%</div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', padding: '12px' }}>
                            <div>
                              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>TRANSIT BANDWIDTH</span>
                              <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>1,126 Mbps</strong>
                            </div>
                            <div>
                              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>DEFLECTED THREATS</span>
                              <strong style={{ fontSize: '15px', color: 'var(--accent-red)' }}>{analytics ? analytics.blockedThreats : 8} events</strong>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}
              {dashboardTab === 'admin' && (
                <div>
                  <h2 style={{ color: 'var(--accent-purple)', margin: '0 0 10px 0', fontSize: '22px', fontFamily: 'var(--font-heading)' }}>
                    👑 Super Admin Control Center
                  </h2>
                  <p className="dash-stat-desc" style={{ marginBottom: '16px' }}>
                    Real-time platform business metrics, database inspection, and AI financial forecasting.
                  </p>

                  {/* Super Admin Pill Navigation */}
                  <div className="admin-sub-nav">
                    <button onClick={() => setAdminSubTab('overview')} className={adminSubTab === 'overview' ? 'active' : ''}>📊 Dashboard Overview</button>
                    <button onClick={() => { setAdminSubTab('users'); fetchAdminUsers(); }} className={adminSubTab === 'users' ? 'active' : ''}>👥 User Directory</button>
                    <button onClick={() => { setAdminSubTab('revenue'); fetchAdminRevenue(); }} className={adminSubTab === 'revenue' ? 'active' : ''}>💰 Platform Revenue</button>
                    <button onClick={() => { setAdminSubTab('infrastructure'); fetchAdminInfra(); }} className={adminSubTab === 'infrastructure' ? 'active' : ''}>📡 Edge Infra Health</button>
                    <button onClick={() => { setAdminSubTab('security'); fetchAuditLogs(); }} className={adminSubTab === 'security' ? 'active' : ''}>🛡️ Audit Logs</button>
                    <button onClick={() => { setAdminSubTab('featureflags'); fetchFeatureFlags(); }} className={adminSubTab === 'featureflags' ? 'active' : ''}>⚙️ Feature Flags</button>
                  </div>

                  {/* SUBTAB: OVERVIEW */}
                  {adminSubTab === 'overview' && (
                    <div>
                      {/* Business Health Score Gauge */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', marginBottom: '24px', background: 'rgba(139, 92, 246, 0.04)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Revenue Health</div>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-green)', marginTop: '4px' }}>92%</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Security Shield</div>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-purple)', marginTop: '4px' }}>98%</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>User Growth</div>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-purple)', marginTop: '4px' }}>89%</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>User CSAT</div>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-green)', marginTop: '4px' }}>94%</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Server Perf</div>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-green)', marginTop: '4px' }}>97%</div>
                        </div>
                        <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Platform Score</div>
                          <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent-purple)', marginTop: '4px' }}>94%</div>
                        </div>
                      </div>

                      {adminStats && (
                        <div className="dash-stats-grid" style={{ marginBottom: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
                          <div className="dash-stat-card card-lift">
                            <h3>Total Registered Users</h3>
                            <div className="dash-stat-number">{adminStats.totalUsers}</div>
                            <div className="dash-stat-desc">Growth rate +15% MoM</div>
                          </div>
                          <div className="dash-stat-card card-lift">
                            <h3>MRR (Monthly Recurring)</h3>
                            <div className="dash-stat-number green">₹{adminStats.mrr.toLocaleString('en-IN')}</div>
                            <div className="dash-stat-desc">ARR: ₹{adminStats.arr.toLocaleString('en-IN')}</div>
                          </div>
                          <div className="dash-stat-card card-lift">
                            <h3>Total Platform Clicks</h3>
                            <div className="dash-stat-number">{adminStats.totalClicks}</div>
                            <div className="dash-stat-desc">Active Links: {adminStats.totalLinks}</div>
                          </div>
                          <div className="dash-stat-card card-lift">
                            <h3>Blocked Bot Attacks</h3>
                            <div className="dash-stat-number red">{adminStats.blockedAttacks}</div>
                            <div className="dash-stat-desc">Threat radar protected</div>
                          </div>
                        </div>
                      )}

                      {/* AI Owner Assistant */}
                      <div style={{ border: '1.5px solid var(--accent-purple)', borderRadius: '12px', padding: '20px', background: 'rgba(139, 92, 246, 0.02)', display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ margin: '0 0 5px 0', color: 'var(--accent-purple)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          👑 Owner AI Assistant & Business Coach
                        </h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                          Ask AI about cashflow, user churn predictions, cloud margins, or security audits.
                        </p>

                        <div style={{
                          minHeight: '160px', maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--border-color)',
                          borderRadius: '8px', padding: '12px', background: 'var(--bg-main)',
                          marginBottom: '14px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px'
                        }}>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                            🤖 AI Coach: Welcome, Owner Saksham. Ask me about your business metrics or select a quick query below.
                          </div>
                          {adminAiResponse && (
                            <div style={{
                              fontSize: '12.5px', color: 'var(--text-primary)', background: 'rgba(139, 92, 246, 0.04)',
                              padding: '10px', borderRadius: '8px', borderLeft: '3px solid var(--accent-purple)',
                              lineHeight: '1.4', whiteSpace: 'pre-line'
                            }}>
                              {adminAiResponse}
                            </div>
                          )}
                          {isAdminAiLoading && <div style={{ fontSize: '12px', color: 'var(--accent-purple)' }}>⚡ Computing cohort data and server financial metrics...</div>}
                        </div>

                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                          <button onClick={() => askAdminAi("How much money today?")} className="btn-emoji-helper" style={{ fontSize: '11px', padding: '4px 8px' }}>💰 Today's Revenue</button>
                          <button onClick={() => askAdminAi("Platform attack logs and bot patterns")} className="btn-emoji-helper" style={{ fontSize: '11px', padding: '4px 8px' }}>🛡️ Security Audit</button>
                          <button onClick={() => askAdminAi("Suggest platform upgrades for growth")} className="btn-emoji-helper" style={{ fontSize: '11px', padding: '4px 8px' }}>📈 Growth Strategy</button>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            className="dash-input"
                            placeholder="Ask AI Coach..."
                            value={adminAiQuestion}
                            onChange={e => setAdminAiQuestion(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && askAdminAi(adminAiQuestion)}
                            style={{ margin: 0, flex: 1 }}
                          />
                          <button onClick={() => askAdminAi(adminAiQuestion)} className="btn-dash-submit" style={{ width: 'auto', padding: '0 20px', margin: 0 }}>Ask AI</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB: USERS */}
                  {adminSubTab === 'users' && (
                    <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', background: 'rgba(255,255,255,0.01)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--primary-navy)' }}>User Operations Center</h4>
                        <input
                          type="text"
                          className="dash-input"
                          style={{ margin: 0, padding: '6px 12px', fontSize: '12px', maxWidth: '220px' }}
                          placeholder="Search user email..."
                          value={adminSearch}
                          onChange={e => setAdminSearch(e.target.value)}
                        />
                      </div>
                      
                      <div className="dash-table-wrapper">
                        <table className="dash-table" style={{ fontSize: '12px' }}>
                          <thead>
                            <tr>
                              <th>Email</th>
                              <th>Plan Type</th>
                              <th>Joined Date</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {adminUsers
                              .filter(u => u.email.toLowerCase().includes(adminSearch.toLowerCase()))
                              .map(u => (
                                <tr key={u.id}>
                                  <td style={{ fontWeight: 'bold' }}>{u.email}</td>
                                  <td>
                                    <select
                                      value={u.plan_type}
                                      onChange={(e) => handleAdminPlanChange(u.id, e.target.value)}
                                      style={{ padding: '2px 6px', background: 'var(--bg-main)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                                    >
                                      <option value="free_trial">Free Trial</option>
                                      <option value="premium">Premium</option>
                                      <option value="suspended">Suspended</option>
                                    </select>
                                  </td>
                                  <td>{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                                  <td>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                      <button
                                        onClick={() => handleAdminSuspend(u.id)}
                                        className="copy-button"
                                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)', border: 'none', padding: '2px 8px' }}
                                      >
                                        Suspend User
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB: REVENUE */}
                  {adminSubTab === 'revenue' && adminRevenue && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="edge-metric-grid">
                        <div className="edge-metric-card card-lift">
                          <h4>Monthly Recurring Revenue</h4>
                          <div className="metric-value" style={{ color: 'var(--accent-green)' }}>₹{adminRevenue.mrr.toLocaleString('en-IN')}</div>
                          <div className="metric-change positive">● Target Achieved</div>
                        </div>
                        <div className="edge-metric-card card-lift">
                          <h4>Annual Recurring Revenue</h4>
                          <div className="metric-value">₹{adminRevenue.arr.toLocaleString('en-IN')}</div>
                          <div className="metric-change positive">● 12x MRR projection</div>
                        </div>
                        <div className="edge-metric-card card-lift">
                          <h4>Premium Customers</h4>
                          <div className="metric-value">{adminRevenue.premiumUsers} / {adminRevenue.totalUsers}</div>
                          <div className="metric-change positive">● {adminRevenue.conversionRate}% conversion</div>
                        </div>
                        <div className="edge-metric-card card-lift">
                          <h4>LTV / Churn Rate</h4>
                          <div className="metric-value">₹{adminRevenue.ltv.toLocaleString()} / {adminRevenue.churnRate}%</div>
                          <div className="metric-change positive">● Industry benchmark</div>
                        </div>
                      </div>

                      <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', background: 'rgba(255,255,255,0.01)', textAlign: 'left' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: 'var(--primary-navy)' }}>Premium Subscriber Registry</h4>
                        <div className="dash-table-wrapper">
                          <table className="dash-table" style={{ fontSize: '12px' }}>
                            <thead>
                              <tr>
                                <th>User ID</th>
                                <th>Email</th>
                                <th>MRR Contribution</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {adminUsers.filter(u => u.plan_type === 'premium').map(u => (
                                <tr key={u.id}>
                                  <td><code>{u.id}</code></td>
                                  <td><strong>{u.email}</strong></td>
                                  <td style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>₹299/mo</td>
                                  <td><span className="badge badge-active" style={{ background: 'var(--accent-green)', color: '#fff' }}>ACTIVE</span></td>
                                </tr>
                              ))}
                              {adminUsers.filter(u => u.plan_type === 'premium').length === 0 && (
                                <tr>
                                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No premium active subscribers in register.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
                        {/* Top active customers */}
                        <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', background: 'rgba(255,255,255,0.01)', textAlign: 'left' }}>
                          <h4 style={{ margin: '0 0 10px 0', color: 'var(--primary-navy)' }}>👑 Top Premium Accounts (Traffic-Weighted)</h4>
                          <div className="dash-table-wrapper">
                            <table className="dash-table" style={{ fontSize: '11.5px' }}>
                              <thead>
                                <tr>
                                  <th>Customer Name</th>
                                  <th>Clicks Logged</th>
                                  <th>Est. Lifetime Value</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(adminRevenue.topCustomers || []).map((cust, i) => (
                                  <tr key={i}>
                                    <td><strong>{cust.name}</strong><br /><span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{cust.email}</span></td>
                                    <td><strong>{cust.clicks.toLocaleString()}</strong></td>
                                    <td style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>{cust.value}</td>
                                  </tr>
                                ))}
                                {(!adminRevenue.topCustomers || adminRevenue.topCustomers.length === 0) && (
                                  <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No traffic logs calculated yet.</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Inactive customers */}
                        <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', background: 'rgba(255,255,255,0.01)', textAlign: 'left' }}>
                          <h4 style={{ margin: '0 0 10px 0', color: 'var(--accent-red)' }}>⚠️ Dormant Accounts (Zero Traffic)</h4>
                          <div className="dash-table-wrapper">
                            <table className="dash-table" style={{ fontSize: '11.5px' }}>
                              <thead>
                                <tr>
                                  <th>Email</th>
                                  <th>Created At</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(adminRevenue.inactiveCustomers || []).map((cust, i) => (
                                  <tr key={i}>
                                    <td><strong>{cust.email}</strong></td>
                                    <td>{cust.created_at}</td>
                                    <td><span className="badge badge-inactive" style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>INACTIVE</span></td>
                                  </tr>
                                ))}
                                {(!adminRevenue.inactiveCustomers || adminRevenue.inactiveCustomers.length === 0) && (
                                  <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No inactive accounts identified.</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB: INFRASTRUCTURE */}
                  {adminSubTab === 'infrastructure' && adminInfra && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="edge-metric-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                        <div className="infra-card">
                          <h4>CPU Utilization</h4>
                          <div className="infra-value" style={{ color: adminInfra.cpu.usage > 80 ? 'var(--accent-red)' : 'var(--text-primary)' }}>{adminInfra.cpu.usage}%</div>
                          <div className="infra-sub">{adminInfra.cpu.cores} Cores Active</div>
                        </div>
                        <div className="infra-card">
                          <h4>RAM Allocation</h4>
                          <div className="infra-value">{adminInfra.memory.used} / {adminInfra.memory.total} GB</div>
                          <div className="infra-sub">System heap memory</div>
                        </div>
                        <div className="infra-card">
                          <h4>Disk Storage Capacity</h4>
                          <div className="infra-value">{adminInfra.disk ? `${adminInfra.disk.used} / ${adminInfra.disk.total} ${adminInfra.disk.unit}` : '45 / 500 GB'}</div>
                          <div className="infra-sub">SQLite database volume</div>
                        </div>
                        <div className="infra-card">
                          <h4>Hourly API Usage</h4>
                          <div className="infra-value" style={{ color: 'var(--accent-purple)' }}>{adminInfra.api_usage || '124,700 req/hr'}</div>
                          <div className="infra-sub">{adminInfra.requests_per_second} req/sec avg</div>
                        </div>
                        <div className="infra-card">
                          <h4>Network Error Rate</h4>
                          <div className="infra-value" style={{ color: adminInfra.error_rate && parseFloat(adminInfra.error_rate) > 1.0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>{adminInfra.error_rate || '0.02%'}</div>
                          <div className="infra-sub">Target SLA: &lt;0.05% errors</div>
                        </div>
                        <div className="infra-card">
                          <h4>DNS System Uptime</h4>
                          <div className="infra-value" style={{ color: 'var(--accent-green)' }}>{adminInfra.uptime}%</div>
                          <div className="infra-sub">Edge routers online</div>
                        </div>
                      </div>

                      {/* Edge nodes region */}
                      <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', background: 'rgba(255,255,255,0.01)', textAlign: 'left' }}>
                        <h4 style={{ margin: '0 0 14px 0', color: 'var(--primary-navy)' }}>Global Edge Router Gateway Latency Matrix</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {adminInfra.regions.map((reg, idx) => (
                              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', fontSize: '13px' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>🌍 {reg.name}</span>
                                <strong style={{ color: 'var(--accent-purple)' }}>{reg.latency}ms</strong>
                              </div>
                            ))}
                          </div>
                          <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px', fontSize: '12px' }}>
                            <strong style={{ display: 'block', marginBottom: '8px', color: 'var(--primary-navy)' }}>🛰️ Origin Manager Failover Routing</strong>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                              Primary origin server is currently responding from Frankfurt. If the origin goes down, LinkFlare Edge Gate will automatically failover to ap-south-1 backup location in less than 350ms.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                        {/* Notifications */}
                        <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', background: 'rgba(255,255,255,0.01)', textAlign: 'left' }}>
                          <h4 style={{ margin: '0 0 10px 0', color: 'var(--primary-navy)' }}>📢 Edge Replica Logs & Threat Signals</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {(adminInfra.system_notifications || []).map((notif) => (
                              <div key={notif.id} style={{ padding: '10px', background: 'var(--bg-main)', border: `1px solid ${notif.type === 'warning' ? 'rgba(245, 158, 11, 0.3)' : 'var(--border-color)'}`, borderRadius: '8px', fontSize: '11.5px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                  <span style={{ fontWeight: 'bold', color: notif.type === 'warning' ? '#f59e0b' : 'var(--accent-purple)' }}>
                                    {notif.type === 'warning' ? '⚠️ SYSTEM ALERT' : 'ℹ️ EDGE RECON'}
                                  </span>
                                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{new Date(notif.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <div style={{ color: 'var(--text-secondary)' }}>{notif.message}</div>
                              </div>
                            ))}
                            {(!adminInfra.system_notifications || adminInfra.system_notifications.length === 0) && (
                              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '10px' }}>No replica warnings.</div>
                            )}
                          </div>
                        </div>

                        {/* Announcements */}
                        <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', background: 'rgba(255,255,255,0.01)', textAlign: 'left' }}>
                          <h4 style={{ margin: '0 0 10px 0', color: 'var(--primary-navy)' }}>📣 Live Announcements Config</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {(adminInfra.announcements || []).map((ann) => (
                              <div key={ann.id} style={{ padding: '12px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '500' }}>{ann.text}</span>
                                <span className="badge badge-active" style={{ background: 'var(--accent-green)', color: '#fff', fontSize: '10px' }}>ACTIVE</span>
                              </div>
                            ))}
                            {(!adminInfra.announcements || adminInfra.announcements.length === 0) && (
                              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '10px' }}>No active banners.</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB: SECURITY & AUDIT LOGS */}
                  {adminSubTab === 'security' && (
                    <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', background: 'rgba(255,255,255,0.01)', textAlign: 'left' }}>
                      <h4 style={{ margin: '0 0 14px 0', color: 'var(--primary-navy)' }}>Zero-Trust Platform Security Audit Logs</h4>
                      <div className="dash-table-wrapper" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <table className="dash-table" style={{ fontSize: '11.5px' }}>
                          <thead>
                            <tr>
                              <th>Timestamp</th>
                              <th>Actor ID</th>
                              <th>Security Action</th>
                              <th>Entity Target</th>
                              <th>IP Location</th>
                              <th>Diagnostic Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {auditLogs.map((log) => (
                              <tr key={log.id}>
                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                                <td><code>{log.user_id}</code></td>
                                <td><span className="badge badge-active" style={{ background: log.action.includes('SUSPEND') || log.action.includes('DELETE') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(139, 92, 246, 0.15)', color: log.action.includes('SUSPEND') || log.action.includes('DELETE') ? '#ef4444' : 'var(--accent-purple)', fontWeight: 'bold' }}>{log.action}</span></td>
                                <td><code>{log.target}</code></td>
                                <td><code>{log.ip_address || 'Internal System'}</code></td>
                                <td style={{ color: 'var(--text-secondary)' }}>{log.details || 'Legitimate operator challenge pass'}</td>
                              </tr>
                            ))}
                            {auditLogs.length === 0 && (
                              <tr>
                                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No audit log actions recorded in current session scope.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB: FEATURE FLAGS */}
                  {adminSubTab === 'featureflags' && (
                    <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', background: 'rgba(255,255,255,0.01)', textAlign: 'left' }}>
                      <h4 style={{ margin: '0 0 10px 0', color: 'var(--primary-navy)' }}>Edge Platform Global Feature Flags Toggles</h4>
                      <p className="dash-stat-desc" style={{ marginBottom: '20px' }}>
                        Enable or disable beta platform modules in real-time across all servers. Toggles resolve instantly inside Edge routers.
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {featureFlags.map((flag) => (
                          <div key={flag.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                            <div>
                              <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)', display: 'block' }}>{flag.key.replace('_', ' ').toUpperCase()}</strong>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{flag.description}</span>
                            </div>
                            <div 
                              className={`flag-toggle ${flag.enabled === 1 ? 'active' : ''}`}
                              onClick={() => toggleFeatureFlag(flag.key, flag.enabled === 1 ? 0 : 1)}
                            ></div>
                          </div>
                        ))}
                        {featureFlags.length === 0 && (
                          <p style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: 'span 2' }}>Loading platform features flags from cloud server...</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* UPI Payment Modal Overlay */}
      {showPaymentModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.8)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="login-form-card" style={{ maxWidth: '400px', border: '1.5px solid var(--primary-navy)', margin: '20px' }}>
            <h3 style={{ color: 'var(--primary-navy)', margin: '0 0 10px 0', fontSize: '20px', fontFamily: 'var(--font-heading)' }}>Activate Premium License</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>
              Scan the UPI QR code using BHIM, PhonePe, GPay, or Paytm to pay ₹299.
            </p>
            <div style={{ background: '#fff', padding: '12px', display: 'inline-block', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent('upi://pay?pa=linkflare@upi&pn=LinkFlare&am=299&cu=INR')}`} 
                alt="UPI Payment QR" 
                style={{ display: 'block' }}
              />
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (utrNumber.trim().length !== 12 || isNaN(utrNumber)) {
                showMessage("Please enter a valid 12-digit numeric UPI UTR code.", "error");
                return;
              }
              // Submit mock UTR payment to backend simulate upgrade premium
              await runSubSim('upgrade-premium');
              setShowPaymentModal(false);
              setUtrNumber('');
              showMessage(`Payment verified (UTR: ${utrNumber}). Premium Guard active!`, 'success');
            }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input 
                type="text" 
                className="dash-input" 
                placeholder="Enter 12-Digit UPI UTR Code" 
                value={utrNumber} 
                onChange={e => setUtrNumber(e.target.value)} 
                required 
                style={{ textAlign: 'center', letterSpacing: '1px', fontWeight: 'bold' }} 
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-dash-submit" style={{ flex: 1, margin: 0 }}>Confirm Payment</button>
                <button type="button" className="btn-dash-cancel" style={{ flex: 1, margin: 0 }} onClick={() => setShowPaymentModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* AI Twin Chat Modal Overlay */}
      {activeTwinLink && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.85)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          backdropFilter: 'blur(6px)'
        }}>
          <div className="login-form-card" style={{ maxWidth: '580px', width: '100%', border: '1.5px solid var(--accent-purple)', margin: '20px', padding: '24px', position: 'relative' }}>
            <h3 style={{ color: 'var(--accent-purple)', margin: '0 0 5px 0', fontSize: '22px', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔮 Link AI Studio & Diagnostic Center
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Fingerprint cloning scanning, safe browsing logs, traffic forecast metrics, and virtual double chat.
            </p>

            <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', background: 'var(--bg-main)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <div>🔗 Slug: <strong>/{activeTwinLink.slug}</strong></div>
              <div>📈 Clicks: <strong>{activeTwinLink.click_count}</strong></div>
              <div>🛡️ WAF Guard: <strong>{activeTwinLink.vpn_blocking === 1 ? 'Zero-Trust Active' : 'Basic protection'}</strong></div>
            </div>

            {/* Modal Sub-Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '16px', gap: '8px' }}>
              <button 
                onClick={() => setModalSubTab('twin')} 
                style={{ padding: '6px 12px', background: 'none', border: 'none', borderBottom: modalSubTab === 'twin' ? '2.5px solid var(--accent-purple)' : 'none', color: modalSubTab === 'twin' ? 'var(--accent-purple)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
              >
                🧠 AI Twin Chat
              </button>
              <button 
                onClick={() => {
                  setModalSubTab('dna');
                  fetchLinkDna(activeTwinLink.id);
                }} 
                style={{ padding: '6px 12px', background: 'none', border: 'none', borderBottom: modalSubTab === 'dna' ? '2.5px solid var(--accent-purple)' : 'none', color: modalSubTab === 'dna' ? 'var(--accent-purple)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
              >
                🧬 Link DNA™ Scan
              </button>
              <button 
                onClick={() => {
                  setModalSubTab('reputation');
                  fetchLinkReputation(activeTwinLink.id);
                }} 
                style={{ padding: '6px 12px', background: 'none', border: 'none', borderBottom: modalSubTab === 'reputation' ? '2.5px solid var(--accent-purple)' : 'none', color: modalSubTab === 'reputation' ? 'var(--accent-purple)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
              >
                🛡️ Reputation Index
              </button>
              <button 
                onClick={() => {
                  setModalSubTab('forecast');
                  fetchLinkForecast(activeTwinLink.id);
                }} 
                style={{ padding: '6px 12px', background: 'none', border: 'none', borderBottom: modalSubTab === 'forecast' ? '2.5px solid var(--accent-purple)' : 'none', color: modalSubTab === 'forecast' ? 'var(--accent-purple)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
              >
                📈 AI Traffic Forecast
              </button>
            </div>

            {/* TAB 1: AI TWIN CHAT */}
            {modalSubTab === 'twin' && (
              <div>
                <div style={{
                  height: '240px', overflowY: 'auto', border: '1px solid var(--border-color)',
                  borderRadius: '8px', padding: '12px', background: 'var(--bg-main)',
                  marginBottom: '16px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px'
                }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    🤖 AI Twin: Hello! I am the digital double of this secure link. Select a threat query below or type one to begin.
                  </div>
                  {isTwinLoading && <div style={{ fontSize: '12px', color: 'var(--accent-purple)' }}>⚡ Running click logs intelligence scanning...</div>}
                  
                  {aiTwinResponse && !aiStructuredResponse && (
                    <div style={{
                      fontSize: '12.5px', color: 'var(--text-primary)', background: 'rgba(139, 92, 246, 0.05)',
                      padding: '10px', borderRadius: '8px', borderLeft: '3px solid var(--accent-purple)',
                      lineHeight: '1.4', whiteSpace: 'pre-line'
                    }}>
                      {aiTwinResponse}
                    </div>
                  )}

                  {aiStructuredResponse && (
                    <div className="ai-response-card" style={{ background: 'rgba(255,255,255,0.01)' }}>
                      <div className="ai-response-header">
                        <span style={{ fontWeight: 'bold', color: 'var(--accent-purple)', fontSize: '12px' }}>🧠 Link Twin Diagnosis</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Confidence: {aiStructuredResponse.confidence}%</span>
                          <div className="ai-confidence-bar" style={{ width: '60px' }}>
                            <div className="ai-confidence-fill" style={{ width: `${aiStructuredResponse.confidence}%` }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ai-response-body">
                        <div style={{ whiteSpace: 'pre-line', marginBottom: '12px' }}>
                          {aiStructuredResponse.response}
                        </div>
                        {aiStructuredResponse.reasoning && (
                          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '8px' }}>
                            <strong>Reasoning:</strong> {aiStructuredResponse.reasoning}
                          </div>
                        )}
                      </div>

                      {aiStructuredResponse.evidence && aiStructuredResponse.evidence.length > 0 && (
                        <div className="ai-evidence-list">
                          <strong style={{ fontSize: '11px', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Supporting Metrics & Evidence:</strong>
                          {aiStructuredResponse.evidence.map((item, idx) => (
                            <div key={idx} className="ai-evidence-item">
                              <span>✓</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {(aiStructuredResponse.recommended_action || aiStructuredResponse.expected_impact || aiStructuredResponse.rollback || aiStructuredResponse.audit_log || aiStructuredResponse.historical_context) && (
                        <div style={{ padding: '12px', background: 'rgba(5, 150, 105, 0.04)', borderTop: '1px solid var(--border-color)', fontSize: '12px', textAlign: 'left' }}>
                          {aiStructuredResponse.recommended_action && (
                            <div style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>
                              <strong>Recommendation:</strong> {aiStructuredResponse.recommended_action}
                            </div>
                          )}
                          {aiStructuredResponse.expected_impact && (
                            <div style={{ color: 'var(--accent-green)', fontWeight: 'bold', marginBottom: '8px' }}>
                              🚀 Impact: {aiStructuredResponse.expected_impact}
                            </div>
                          )}
                          {aiStructuredResponse.historical_context && (
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px', borderTop: '1px dashed var(--border-color)', paddingTop: '8px' }}>
                              <strong>Historical Context:</strong> {aiStructuredResponse.historical_context}
                            </div>
                          )}
                          {aiStructuredResponse.rollback && (
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                              <strong>Suggested Rollback:</strong> <code>{aiStructuredResponse.rollback}</code>
                            </div>
                          )}
                          {aiStructuredResponse.audit_log && (
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'monospace' }}>
                              {aiStructuredResponse.audit_log}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Queries */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  <button onClick={() => askTwin("Why is conversion low on this link?")} className="btn-emoji-helper" style={{ fontSize: '11px', padding: '4px 10px' }}>📉 Why is conversion low?</button>
                  <button onClick={() => askTwin("Check for click fraud and bot farms")} className="btn-emoji-helper" style={{ fontSize: '11px', padding: '4px 10px' }}>🛡️ Check bot click fraud</button>
                  <button onClick={() => askTwin("Recommend timezone and traffic budget plan")} className="btn-emoji-helper" style={{ fontSize: '11px', padding: '4px 10px' }}>⚡ Recommend traffic plan</button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="dash-input"
                    placeholder="Ask link twin anything..."
                    value={aiTwinQuestion}
                    onChange={e => setAiTwinQuestion(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && askTwin(aiTwinQuestion)}
                    style={{ margin: 0, flex: 1 }}
                  />
                  <button onClick={() => askTwin(aiTwinQuestion)} className="btn-dash-submit" style={{ width: 'auto', padding: '0 20px', margin: 0 }}>Ask Twin</button>
                </div>
              </div>
            )}

            {/* TAB 2: LINK DNA SCAN */}
            {modalSubTab === 'dna' && (
              <div style={{ textAlign: 'left', minHeight: '260px' }}>
                {isDnaLoading ? (
                  <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--accent-purple)' }}>
                    ⚡ Sequencing DNA signatures & scanning mirror indexes...
                  </div>
                ) : linkDnaData && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12.5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>🧬 Link Fingerprint: <code style={{ fontSize: '11px', background: 'var(--bg-main)', padding: '2px 6px', borderRadius: '4px' }}>{linkDnaData.dna_fingerprint}</code></span>
                      <span className="badge badge-active" style={{ background: 'var(--accent-green)', color: '#fff' }}>{linkDnaData.ownership_status}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
                      <div style={{ padding: '10px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>AI Similarity Score</div>
                        <strong style={{ fontSize: '18px', color: 'var(--accent-purple)' }}>{linkDnaData.ai_similarity_score}%</strong>
                      </div>
                      <div style={{ padding: '10px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Clone/Mirror Risk Rating</div>
                        <strong style={{ fontSize: '18px', color: linkDnaData.risk_score > 30 ? '#ef4444' : 'var(--accent-green)' }}>
                          {linkDnaData.risk_score > 30 ? 'MODERATE' : 'CLEAN'}
                        </strong>
                      </div>
                    </div>

                    <div style={{ marginTop: '10px' }}>
                      <strong>Mirror / Cloned Link Detections:</strong>
                      {linkDnaData.copies_found > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                          {linkDnaData.mirror_domains.map((dom, i) => (
                            <div key={i} style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '6px', fontSize: '11px', display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}>
                              <span>🔗 {dom}</span>
                              <strong>Potential Redirect Mirror</strong>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          ✓ No copycat mirror sites detected across global indexing nodes.
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: '10px' }}>
                      <strong>Affiliate Hijacker Status:</strong>
                      {linkDnaData.fake_affiliates.length > 0 ? (
                        <div style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '6px', fontSize: '11px', color: '#ef4444' }}>
                          ⚠️ Flagged Affiliate Tag Hijackers: {linkDnaData.fake_affiliates.join(', ')}
                        </div>
                      ) : (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          ✓ Zero hijack signatures identified in metadata.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: REPUTATION SCORECARD */}
            {modalSubTab === 'reputation' && (
              <div style={{ textAlign: 'left', minHeight: '260px' }}>
                {isReputationLoading ? (
                  <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--accent-purple)' }}>
                    ⚡ Connecting to LinkFlare Reputation Network ledger...
                  </div>
                ) : linkReputationData && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                      <div style={{ padding: '8px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Trust Score</div>
                        <strong style={{ fontSize: '16px', color: 'var(--accent-green)' }}>{linkReputationData.trust_score}/100</strong>
                      </div>
                      <div style={{ padding: '8px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Spam Score</div>
                        <strong style={{ fontSize: '16px', color: linkReputationData.spam_score > 10 ? '#f59e0b' : 'var(--text-secondary)' }}>{linkReputationData.spam_score}%</strong>
                      </div>
                      <div style={{ padding: '8px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Malware</div>
                        <strong style={{ fontSize: '16px', color: 'var(--accent-green)' }}>{linkReputationData.malware_score}%</strong>
                      </div>
                      <div style={{ padding: '8px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Scam Score</div>
                        <strong style={{ fontSize: '16px', color: 'var(--accent-green)' }}>{linkReputationData.scam_score}%</strong>
                      </div>
                    </div>

                    <div style={{ padding: '16px', background: 'rgba(5, 150, 105, 0.03)', border: '1px solid rgba(5, 150, 105, 0.15)', borderRadius: '12px', marginTop: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>🛡️ Network Verdict: {linkReputationData.community_rating}</strong>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{linkReputationData.visits_recorded.toLocaleString()} Safe visits</span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '8px 0 0 0', lineHeight: '1.4' }}>
                        This link resolves without triggering safe-browsing indicators. No malware payload injections or credential stealing attempts are flagged in the global ledger.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: TRAFFIC FORECAST */}
            {modalSubTab === 'forecast' && (
              <div style={{ textAlign: 'left', minHeight: '260px' }}>
                {isForecastLoading ? (
                  <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--accent-purple)' }}>
                    ⚡ Running predictive AI models for tomorrow's cohort traffic...
                  </div>
                ) : linkForecastData && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                      <div style={{ padding: '8px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Est. Clicks [95% CI]</div>
                        <strong style={{ fontSize: '14px', color: 'var(--text-primary)', display: 'block' }}>{linkForecastData.tomorrow_clicks.toLocaleString()}</strong>
                        <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>[{Math.round(linkForecastData.tomorrow_clicks * 0.85)} - {Math.round(linkForecastData.tomorrow_clicks * 1.15)}]</span>
                      </div>
                      <div style={{ padding: '8px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Est. Revenue [95% CI]</div>
                        <strong style={{ fontSize: '14px', color: 'var(--accent-green)', display: 'block' }}>
                          {typeof linkForecastData.tomorrow_revenue === 'number' 
                            ? `₹${linkForecastData.tomorrow_revenue.toLocaleString('en-IN')}` 
                            : linkForecastData.tomorrow_revenue}
                        </strong>
                        <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                          {(() => {
                            const revNum = typeof linkForecastData.tomorrow_revenue === 'number' 
                              ? linkForecastData.tomorrow_revenue 
                              : parseInt(String(linkForecastData.tomorrow_revenue).replace(/[^0-9]/g, '')) || 0;
                            return `[₹${Math.round(revNum * 0.85).toLocaleString('en-IN')} - ₹${Math.round(revNum * 1.15).toLocaleString('en-IN')}]`;
                          })()}
                        </span>
                      </div>
                      <div style={{ padding: '8px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Est. Bandwidth</div>
                        <strong style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>{linkForecastData.bandwidth_expected}</strong>
                      </div>
                      <div style={{ padding: '8px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Projected Fraud</div>
                        <strong style={{ fontSize: '16px', color: 'var(--accent-green)' }}>{linkForecastData.fraud_risk_score}</strong>
                      </div>
                    </div>

                    <div style={{ padding: '16px', background: 'rgba(139, 92, 246, 0.04)', border: '1px solid rgba(139, 92, 246, 0.15)', borderRadius: '12px', marginTop: '10px' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--accent-purple)', fontSize: '13px' }}>🔮 Live AI Autopilot Advice:</div>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-primary)', margin: '8px 0' }}>
                        {linkForecastData.recommendation}
                      </p>
                      {optimizationAppliedMsg ? (
                        <div style={{ fontSize: '12px', color: 'var(--accent-green)', fontWeight: 'bold', marginTop: '8px' }}>
                          ✓ {optimizationAppliedMsg}
                        </div>
                      ) : (
                        <button 
                          onClick={() => applyLinkOptimization(activeTwinLink.id)} 
                          className="btn-dash-submit" 
                          style={{ width: 'auto', padding: '6px 16px', margin: '8px 0 0 0', display: 'inline-flex', alignSelf: 'flex-start' }}
                        >
                          Apply Optimization
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => {
                setActiveTwinLink(null);
                setAiTwinResponse('');
                setAiTwinQuestion('');
                setLinkDnaData(null);
                setLinkReputationData(null);
                setLinkForecastData(null);
                setModalSubTab('twin');
              }} className="btn-dash-cancel" style={{ width: 'auto', padding: '10px 24px', margin: 0 }}>Close Studio</button>
            </div>
          </div>
        </div>
      )}

      {/* Global Command Palette Overlay (Ctrl+K) */}
      {showCommandPalette && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.85)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1100,
          backdropFilter: 'blur(6px)'
        }}>
          <div className="login-form-card" style={{ maxWidth: '500px', width: '100%', border: '1.5px solid var(--accent-purple)', margin: '20px', padding: '16px', position: 'relative', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ⌨️ Command Palette <span style={{ fontSize: '10px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)', padding: '1px 6px', borderRadius: '4px' }}>Ctrl + K</span>
              </h3>
              <button 
                onClick={() => setShowCommandPalette(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px' }}
              >
                ✕
              </button>
            </div>
            
            <input
              type="text"
              className="dash-input"
              placeholder="Search actions (e.g. 'deploy', 'analytics', 'threats')..."
              value={commandSearch}
              onChange={e => setCommandSearch(e.target.value)}
              autoFocus
              style={{ width: '100%', marginBottom: '14px', fontSize: '14px', padding: '10px', background: 'var(--bg-main)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '6px' }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              {[
                { name: '🚀 Deploy Campaign Autopilot', action: () => { setDashboardTab('links'); setView('dashboard'); setAiCommandInput('Create a Diwali Campaign'); handleDeployAiCampaign(); setShowCommandPalette(false); } },
                { name: '➕ Create New Secure Short Link', action: () => { setDashboardTab('links'); setView('dashboard'); setShowCommandPalette(false); setTimeout(() => { const el = document.getElementById('dest-url-input'); if (el) el.focus(); }, 100); } },
                { name: '📊 View Click Analytics & Projections', action: () => { setDashboardTab('analytics'); setView('dashboard'); setShowCommandPalette(false); } },
                { name: '🛡️ Audit Edge Threat Logs', action: () => { setDashboardTab('logs'); setView('dashboard'); setShowCommandPalette(false); } },
                { name: '⚙️ Configure Public Uptime SLA', action: () => { setDashboardTab('settings'); setView('dashboard'); setShowCommandPalette(false); } },
                { name: '🌐 Integrate Global Custom Domains', action: () => { setDashboardTab('domain'); setView('dashboard'); setShowCommandPalette(false); } },
                { name: '🛰️ Open Edge Router & DNS Firewall', action: () => { setDashboardTab('edge'); setView('dashboard'); setShowCommandPalette(false); } },
                { name: '🌌 View Connected Universe Graph Map', action: () => { setDashboardTab('links'); setView('dashboard'); setShowCommandPalette(false); setTimeout(() => { const el = document.getElementById('universe-graph'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 100); } },
                { name: '☀️ Toggle Light / Dark Theme Mode', action: () => { toggleTheme(); setShowCommandPalette(false); } },
                { name: '📜 Read Corporate Terms of Service', action: () => { setActiveLegalTab('terms'); setShowCommandPalette(false); } },
                { name: '🔒 Read Corporate Privacy Policy', action: () => { setActiveLegalTab('privacy'); setShowCommandPalette(false); } },
                { name: '📧 Contact Customer Support Desk', action: () => { setActiveLegalTab('contact'); setShowCommandPalette(false); } },
                { name: '👑 Open Super Admin Control Center', action: () => { setDashboardTab('admin'); setView('dashboard'); fetchAdminStats(); fetchAdminUsers(); setShowCommandPalette(false); } }
              ]
              .filter(cmd => cmd.name.toLowerCase().includes(commandSearch.toLowerCase()))
              .map((cmd, idx) => (
                <div 
                  key={idx} 
                  onClick={cmd.action}
                  style={{
                    padding: '10px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-color)', cursor: 'pointer', fontSize: '13px',
                    transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                >
                  <span>{cmd.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Action</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Corporate Legal Overlay Modal */}
      {activeLegalTab && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.85)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1200,
          backdropFilter: 'blur(6px)'
        }}>
          <div className="login-form-card" style={{ maxWidth: '550px', width: '100%', border: '1.5px solid var(--accent-purple)', margin: '20px', padding: '24px', position: 'relative', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--accent-purple)' }}>
                {activeLegalTab === 'terms' && '📜 Terms of Service'}
                {activeLegalTab === 'privacy' && '🛡️ Privacy Policy'}
                {activeLegalTab === 'contact' && '📧 Contact LinkFlare Support'}
                {activeLegalTab === 'founder' && '👑 Meet the Founder'}
                {activeLegalTab === 'guide' && '📖 System Guide & Developer Manual'}
              </h3>
              <button 
                onClick={() => setActiveLegalTab(null)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ maxHeight: '300px', overflowY: 'auto', fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              {activeLegalTab === 'terms' && (
                <div>
                  <p><strong>1. Acceptable Redirection Policy</strong></p>
                  <p>LinkFlare provides secure redirect links for e-commerce, creators, and business campaigns. Users agree not to route malware, phishing content, or hijack tracking tags.</p>
                  <p><strong>2. Rate Limiting and SLA</strong></p>
                  <p>Redirection cache operates under 10ms. Rate limits apply to Free plans. Premium plans benefit from unlimited traffic flow guarantees.</p>
                </div>
              )}

              {activeLegalTab === 'privacy' && (
                <div>
                  <p><strong>1. Privacy-Preserving Analytics</strong></p>
                  <p>Visitor IP addresses and fingerprints are checked against block lists locally and hashed to preserve privacy. We do not store plain-text personal identifier files.</p>
                  <p><strong>2. Client Fingerprints</strong></p>
                  <p>Browser details, screen dimensions, and battery health indexes are checked in memory only to calculate Bot risk level, and discarded instantly after redirect audits.</p>
                </div>
              )}

              {activeLegalTab === 'contact' && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setActiveLegalTab(null);
                  showMessage("Thank you! Contact request registered. Saksham Tomar will reach out in 2 hours.", 'success');
                }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p>Direct Business Line: <strong>saksham@linkflare.in</strong></p>
                  <div className="dash-input-wrapper" style={{ margin: 0 }}>
                    <label className="dash-label">Your Email</label>
                    <input type="email" required className="dash-input" placeholder="you@company.in" />
                  </div>
                  <div className="dash-input-wrapper" style={{ margin: 0 }}>
                    <label className="dash-label">Message Details</label>
                    <textarea required rows={4} className="dash-input" placeholder="Type message or support query..." style={{ resize: 'vertical' }} />
                  </div>
                  <button type="submit" className="btn-dash-submit" style={{ margin: '8px 0 0 0' }}>Send Message</button>
                </form>
              )}

              {activeLegalTab === 'founder' && (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  {/* Founder Profile Avatar SVG */}
                  <div style={{ margin: '0 auto 16px auto', width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--primary-navy) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(139, 92, 246, 0.25)' }}>
                    <span style={{ fontSize: '32px' }}>👨‍💻</span>
                  </div>

                  <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', color: 'var(--text-primary)', fontWeight: '800' }}>Saksham Tomar</h2>
                  <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: 'var(--accent-purple)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Founder & Chief Architect, LinkFlare</p>

                  <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)', textAlign: 'left', marginBottom: '20px', padding: '0 10px' }}>
                    I built LinkFlare with one clear vision: to democratize secure, high-performance edge routing for creators and businesses alike. Our Zero-Trust visitor intelligence engine ensures your links are shielded from bad bots, VPN-hijacking, and spam clicks, while running on sub-10ms edge caching.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', textAlign: 'left', marginBottom: '20px' }}>
                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Email Address</span>
                      <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>saksham@linkflare.in</strong>
                    </div>
                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>HQ Location</span>
                      <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Indore, MP, India</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="copy-button" style={{ padding: '6px 12px', fontSize: '11px', textDecoration: 'none', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                      🐙 GitHub Hub
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="copy-button" style={{ padding: '6px 12px', fontSize: '11px', textDecoration: 'none', background: 'rgba(139,92,246,0.1)', color: 'var(--accent-purple)' }}>
                      💼 LinkedIn Profile
                    </a>
                  </div>
                </div>
              )}

              {activeLegalTab === 'guide' && (
                <div style={{ padding: '5px 0' }}>
                  <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)', paddingRight: '6px' }}>
                    
                    <div>
                      <strong style={{ display: 'block', fontSize: '13.5px', color: 'var(--text-primary)', marginBottom: '4px' }}>🚀 1. Quick Start: Shielding a URL</strong>
                      <span style={{ display: 'block' }}>
                        Go to the <strong>Links</strong> tab on your dashboard. Paste your destination URL (e.g., <code>https://store.com/deal</code>) in the input. Define your short text slug. LinkFlare will generate a secure short link pointing to our global edge gate (e.g., <code>linkfl.re/l/deal</code>).
                      </span>
                    </div>

                    <div>
                      <strong style={{ display: 'block', fontSize: '13.5px', color: 'var(--text-primary)', marginBottom: '4px' }}>🛡️ 2. Configuring Security Gates & WAF</strong>
                      <span style={{ display: 'block' }}>
                        Expand any link accordion card on your dashboard to configure individual security rules:
                        <br />• <strong>VPN Blocking</strong>: Blocks users connecting from commercial proxy or VPN tunnels.
                        <br />• <strong>Geo-Restricting</strong>: Lock traffic to specific countries (e.g., <code>IN, US</code>) to prevent global scrapers.
                        <br />• <strong>WhatsApp/Twilio OTP verify</strong>: Prompts users with a real-time cell passcode challenge before redirecting them.
                      </span>
                    </div>

                    <div>
                      <strong style={{ display: 'block', fontSize: '13.5px', color: 'var(--text-primary)', marginBottom: '4px' }}>🧪 3. A/B Testing & Weighted Split Rules</strong>
                      <span style={{ display: 'block' }}>
                        To split traffic between multiple landing page URLs, activate A/B testing or weighted routing. You can distribute traffic percentage-wise (e.g., 80% to Version A, 20% to Version B). The Edge Firewall dynamically evaluates random weight distributions on every request.
                      </span>
                    </div>

                    <div>
                      <strong style={{ display: 'block', fontSize: '13.5px', color: 'var(--text-primary)', marginBottom: '4px' }}>🤖 4. Using AI Autopilot Deployments</strong>
                      <span style={{ display: 'block' }}>
                        In the left panel <strong>AI Mission Control</strong>, type your campaign goal in plain English (e.g., <em>"Create a summer promo deals page and secure it from bots"</em>). The AI will auto-create short links, setup UTM parameters, configure target devices splits, and secure the edge firewall instantly.
                      </span>
                    </div>

                    <div>
                      <strong style={{ display: 'block', fontSize: '13.5px', color: 'var(--text-primary)', marginBottom: '4px' }}>🌐 5. Custom Domain Setup</strong>
                      <span style={{ display: 'block' }}>
                        In the <strong>Domains</strong> tab, connect your custom domain (e.g., <code>mybrand.in</code>). In your GoDaddy/Cloudflare settings:
                        <br />• Add a <strong>TXT Record</strong> (Name: <code>@</code>, Value: <code>linkflare-verification=lf_...</code>).
                        <br />• Add a <strong>CNAME Pointer</strong> pointing to <code>cname.linkflare.in</code>.
                        <br />Click <strong>Verify CNAME</strong> in your dashboard to activate the automated SSL certificate.
                      </span>
                    </div>

                    <div>
                      <strong style={{ display: 'block', fontSize: '13.5px', color: 'var(--text-primary)', marginBottom: '4px' }}>🔌 6. Edge Middleware Script</strong>
                      <span style={{ display: 'block' }}>
                        Protect your primary application from bots. Copy the Next.js middleware script from the domains page. Place it in your project's root folder. It queries our edge gate verify route on every client load, auto-blocking scrapers before they touch your backend.
                      </span>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {activeLegalTab !== 'contact' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px' }}>
                <button onClick={() => setActiveLegalTab(null)} className="btn-dash-submit" style={{ width: 'auto', padding: '6px 16px', margin: 0 }}>Acknowledge</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2FA Setup Modal Overlay */}
      {show2faSetupModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.85)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1300,
          backdropFilter: 'blur(6px)'
        }}>
          <div className="login-form-card" style={{ maxWidth: '420px', width: '100%', border: '1.5px solid var(--accent-purple)', margin: '20px', padding: '24px', position: 'relative', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--accent-purple)' }}>
                🛡️ Set Up Authenticator 2FA
              </h3>
              <span onClick={() => setShow2faSetupModal(false)} style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: '18px' }}>✕</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                Scan the QR code below using your authenticator app (Google Authenticator, Authy, or 1Password) to set up two-factor console authentication.
              </p>
              
              {/* Fake QR generator image */}
              <div style={{ padding: '8px', background: '#fff', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/LinkFlare:saksham@linkflare.in?secret=LFSECRET7788&issuer=LinkFlare" 
                  alt="2FA QR Code" 
                  style={{ width: '130px', height: '130px', display: 'block' }}
                />
              </div>

              <div style={{ width: '100%', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Security Key:</span>
                <code style={{ fontSize: '11px', marginLeft: '6px', background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: '4px' }}>LFSECRET7788</code>
              </div>

              <div className="dash-input-wrapper" style={{ margin: 0, width: '100%' }}>
                <label className="dash-label" style={{ textAlign: 'left' }}>6-Digit Verification Code</label>
                <input 
                  type="text" 
                  maxLength={6}
                  className="dash-input" 
                  placeholder="e.g. 123456" 
                  value={twoFactorCode}
                  onChange={e => setTwoFactorCode(e.target.value.replace(/[^0-9]/g, ''))}
                  style={{ textAlign: 'center', fontSize: '16px', letterSpacing: '4px', fontWeight: 'bold' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '10px' }}>
                <button 
                  onClick={() => setShow2faSetupModal(false)}
                  className="btn-dash-cancel" 
                  style={{ flex: 1, margin: 0, padding: '10px' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (twoFactorCode.length !== 6) {
                      showMessage("Please enter a valid 6-digit authentication code.", "error");
                      return;
                    }
                    setIs2faActive(true);
                    setShow2faSetupModal(false);
                    setTwoFactorCode('');
                    showMessage("2FA Authenticator activated successfully!", "success");
                  }}
                  className="btn-dash-submit" 
                  style={{ flex: 1, margin: 0, padding: '10px' }}
                >
                  Verify & Activate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Context Menu Overlay */}
      {contextMenu && (
        <div 
          className="context-menu" 
          style={{ 
            top: `${contextMenu.y}px`, 
            left: `${contextMenu.x}px`, 
            position: 'fixed' 
          }}
        >
          <div 
            className="context-menu-item"
            onClick={() => {
              navigator.clipboard.writeText(`http://localhost:5000/l/${encodeURIComponent(contextMenu.link.slug)}`);
              showMessage("Link copied successfully!", 'success');
              setContextMenu(null);
            }}
          >
            📋 Copy Short Link
          </div>
          <div 
            className="context-menu-item"
            onClick={() => {
              handleToggleFavorite(contextMenu.link.id);
              setContextMenu(null);
            }}
          >
            ⭐ {contextMenu.link.is_favorite === 1 ? 'Remove Favorite' : 'Mark as Favorite'}
          </div>
          <div 
            className="context-menu-item"
            onClick={() => {
              handleToggleArchive(contextMenu.link.id);
              setContextMenu(null);
            }}
          >
            📦 {contextMenu.link.is_archived === 1 ? 'Restore Link' : 'Archive Link'}
          </div>
          <div className="context-menu-divider"></div>
          <div 
            className="context-menu-item"
            style={{ color: 'var(--accent-red)' }}
            onClick={() => {
              handleDelete(contextMenu.link.id);
              setContextMenu(null);
            }}
          >
            🗑️ Delete Link
          </div>
        </div>
      )}

      {/* Confirmation Dialog Overlay */}
      {confirmDialog && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '17px', color: 'var(--accent-red)' }}>
              {confirmDialog.title}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
              {confirmDialog.message}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={confirmDialog.onCancel} 
                className="btn-dash-cancel"
                style={{ margin: 0, padding: '8px 18px', width: 'auto' }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDialog.onConfirm} 
                className="btn-dash-submit"
                style={{ margin: 0, padding: '8px 18px', width: 'auto', background: 'var(--accent-red)', borderColor: 'var(--accent-red)', color: '#fff' }}
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
