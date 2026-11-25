// Global Enterprise State Management & Reactive Event Hub
class StateManager {
  constructor() {
    this.subscribers = new Map();
    this.state = {
      currentView: 'dashboard',
      systemHealth: {
        status: "OPTIMAL",
        uptimeSeconds: 142850,
        cpuLoadPct: 24,
        memoryUsageMb: 342,
        activeConnections: 124,
        dbPoolLatency: "2.8ms"
      },
      invoices: [
        {
          id: "INV-2026-0891",
          customer: "Windhoek Municipal Water Utility",
          accountNo: "ACC-WHM-9812",
          amount: 148520.00,
          vat: 22278.00,
          total: 170798.00,
          date: "2026-10-14",
          dueDate: "2026-11-14",
          status: "Cleared",
          glCode: "GL-4100-MUNI-UTIL",
          gateway: "Apex Commercial Bank Host-to-Host",
          items: [
            { desc: "Bulk Water Purification Flow (Aug-Sep)", qty: 1, rate: 110000.00 },
            { desc: "Telemetry Sensor Calibration", qty: 4, rate: 9630.00 }
          ]
        },
        {
          id: "INV-2026-0892",
          customer: "Namibia Telecom & Fiber Grid",
          accountNo: "ACC-NTF-4410",
          amount: 87400.00,
          vat: 13110.00,
          total: 100510.00,
          date: "2026-10-15",
          dueDate: "2026-11-15",
          status: "Processing",
          glCode: "GL-4200-ICT-CONN",
          gateway: "Atlantic Corporate Bank ISO20022",
          items: [
            { desc: "Dedicated Municipal WAN Trunk Line 10Gbps", qty: 1, rate: 87400.00 }
          ]
        },
        {
          id: "INV-2026-0893",
          customer: "Khomas Health & Emergency Services",
          accountNo: "ACC-KHM-1102",
          amount: 345000.00,
          vat: 51750.00,
          total: 396750.00,
          date: "2026-10-16",
          dueDate: "2026-11-16",
          status: "Awaiting_Approval",
          glCode: "GL-5100-PUBLIC-HLTH",
          gateway: "Sterling Enterprise Bank Real-time EFT",
          items: [
            { desc: "Fleet Emergency Dispatch Telematics Integration", qty: 23, rate: 15000.00 }
          ]
        },
        {
          id: "INV-2026-0894",
          customer: "Katutura Central Commercial Park",
          accountNo: "ACC-KCP-7749",
          amount: 62300.00,
          vat: 9345.00,
          total: 71645.00,
          date: "2026-10-17",
          dueDate: "2026-11-17",
          status: "Draft",
          glCode: "GL-4300-PROP-ASSESS",
          gateway: "Municipal SmartPay Gateway",
          items: [
            { desc: "Commercial Rates & Refuse Assessment Q3", qty: 1, rate: 62300.00 }
          ]
        }
      ],
      integrations: [
        {
          id: "INT-BW-01",
          name: "Apex Commercial Bank Host-to-Host",
          type: "ISO20022 / mTLS",
          direction: "Bi-directional",
          lastSync: "3s ago",
          status: "ONLINE",
          throughput: "42 tx/min",
          latency: "38ms",
          successRate: "99.94%"
        },
        {
          id: "INT-ACB-02",
          name: "Atlantic Corporate Bank EFT",
          type: "RESTful JSON / OAuth2",
          direction: "Outbound Batch",
          lastSync: "12s ago",
          status: "ONLINE",
          throughput: "28 tx/min",
          latency: "44ms",
          successRate: "99.85%"
        },
        {
          id: "INT-CAPS-03",
          name: "Java CAPS Municipal Messaging Bus",
          type: "JMS Broker / EAI",
          direction: "Enterprise Ingestion",
          lastSync: "1s ago",
          status: "ONLINE",
          throughput: "190 msg/sec",
          latency: "22ms",
          successRate: "99.98%"
        },
        {
          id: "INT-MTR-04",
          name: "Windhoek Electricity & Water AMR",
          type: "SOAP XML Web Service",
          direction: "Inbound Meter Data",
          lastSync: "45s ago",
          status: "ONLINE",
          throughput: "850 reads/min",
          latency: "52ms",
          successRate: "99.72%"
        }
      ],
      dataCleansing: {
        rawRecordsCount: 2540,
        anomaliesDetected: 14,
        cleansedCount: 2526,
        dataQualityScore: 98.4,
        dirtyRecords: [
          {
            id: "REC-9012",
            account: "acc_whm_4410",
            taxNumber: "NAM-VAT-??2940",
            glCode: "NULL_UNMAPPED",
            amount: "14500.5",
            issue: "Malformed Tax ID & Missing GL Code",
            status: "Flagged"
          },
          {
            id: "REC-9013",
            account: "ACC-NTF-4410 ",
            taxNumber: "0600123982",
            glCode: "GL-4200-ICT",
            amount: "87400.00",
            issue: "Trailing whitespace & duplicate customer key",
            status: "Flagged"
          },
          {
            id: "REC-9014",
            account: "ACC-KHM-1102",
            taxNumber: "0600874112",
            glCode: "GL-9999-TEMP",
            amount: "-3500.00",
            issue: "Negative billing amount requires credit note wrapper",
            status: "Flagged"
          }
        ]
      },
      itilChanges: [
        {
          id: "RFC-2026-042",
          title: "ERP Core 3rd-Party Apex Commercial Bank ISO20022 Gateway Upgrade",
          category: "ERP Interface / Financial Services",
          priority: "High",
          impact: "Enterprise Invoicing & Automatic Settlement",
          requestedBy: "Application Systems Specialist",
          status: "CAB Approved - Ready for Deployment",
          reviewDate: "2026-10-22",
          cobitDomain: "BAI06 (Manage Changes) & DSS05 (Security Services)",
          itilStage: "Service Transition"
        },
        {
          id: "RFC-2026-043",
          title: "Java CAPS to Modern Event Bus Adapter Migration",
          category: "Middleware & Interface Bus",
          priority: "Medium",
          impact: "Municipal Smart Meter Ingestion",
          requestedBy: "ICT Architecture Board",
          status: "In Staging / UAT Verification",
          reviewDate: "2026-10-28",
          cobitDomain: "BAI03 (Manage Solutions Build)",
          itilStage: "Service Design & Transition"
        },
        {
          id: "RFC-2026-044",
          title: "Automated Data Cleansing & Deduplication Cron in Oracle PL/SQL",
          category: "Data Integrity & Reporting",
          priority: "Standard",
          impact: "Debtor Ledger Synchronization",
          requestedBy: "Financial Reporting Division",
          status: "Implemented & Active",
          reviewDate: "2026-10-12",
          cobitDomain: "MEA02 (Monitor Internal Controls)",
          itilStage: "Service Operation"
        }
      ],
      candidateDossier: {
        ref: "WIN260818-1",
        title: "Application Systems Specialist",
        dept: "INFORMATION, COMMUNICATION & TECHNOLOGY",
        location: "Windhoek, Namibia",
        closingDate: "2026/11/09",
        grade: "C5",
        remuneration: {
          basic: 497844.00,
          housing: 199140.00,
          transport: 30216.00,
          municipal: 23028.00,
          totalCTC: 750228.00,
          monthlyGross: 62519.00
        }
      },
      liveLogs: []
    };

    this.initLiveSimulation();
  }

  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event).push(callback);
  }

  emit(event, data) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).forEach(cb => cb(data));
    }
  }

  getState() {
    return this.state;
  }

  setView(viewName) {
    this.state.currentView = viewName;
    this.emit('viewChanged', viewName);
  }

  addInvoice(invoice) {
    this.state.invoices.unshift(invoice);
    this.log(`New Invoice generated: ${invoice.id} for ${invoice.customer} (N$ ${invoice.total.toLocaleString()})`, 'INFO');
    this.emit('invoicesChanged', this.state.invoices);
  }

  updateInvoiceStatus(id, newStatus) {
    const inv = this.state.invoices.find(i => i.id === id);
    if (inv) {
      inv.status = newStatus;
      this.log(`Invoice ${id} state transitioned to [${newStatus}]`, 'SYNC');
      this.emit('invoicesChanged', this.state.invoices);
    }
  }

  runDataCleansing() {
    const countBefore = this.state.dataCleansing.anomaliesDetected;
    this.state.dataCleansing.dirtyRecords = [];
    this.state.dataCleansing.anomaliesDetected = 0;
    this.state.dataCleansing.dataQualityScore = 99.98;
    this.state.dataCleansing.cleansedCount += countBefore;

    this.log(`Oracle PL/SQL ETL Engine executed: Cleansed ${countBefore} malformed records & aligned GL mappings.`, 'SUCCESS');
    this.emit('cleansingCompleted', this.state.dataCleansing);
  }

  log(msg, level = 'INFO') {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    const entry = { time: timeStr, level, msg };
    this.state.liveLogs.unshift(entry);
    if (this.state.liveLogs.length > 30) this.state.liveLogs.pop();
    this.emit('logAdded', entry);
  }

  initLiveSimulation() {
    // Initial logs
    this.log('Enterprise ERP Integration Bus initialized on Windows Server 2026 Host', 'INFO');
    this.log('Apex Commercial Bank ISO20022 Gateway handshake verified [mTLS SHA256]', 'SUCCESS');
    this.log('Java CAPS Message Queue listener active on channel tcp://127.0.0.1:7676', 'SYNC');
    this.log('Oracle PL/SQL Scheduled Job [SYS_CLEANSE_DEBTORS_PKG] status: READY', 'INFO');

    // Periodic simulation pulse
    setInterval(() => {
      this.state.systemHealth.cpuLoadPct = Math.floor(18 + Math.random() * 14);
      this.state.systemHealth.uptimeSeconds += 2;
      this.state.systemHealth.activeConnections = Math.floor(120 + Math.random() * 15);
      this.emit('telemetryTick', this.state.systemHealth);
    }, 2500);

    // Periodic simulated enterprise integration event
    const events = [
      { msg: 'Apex Commercial Bank ISO20022: Inbound pacs.008 payment clearance verified', level: 'SUCCESS' },
      { msg: 'Java CAPS EAI: Routing XML municipal rate notice to GL Posting queue', level: 'SYNC' },
      { msg: '.NET WebAPI Service Bus: Reconciled 42 billing accounts against Debtor Ledger', level: 'INFO' },
      { msg: 'Oracle PL/SQL Engine: Executed stored procedure PR_RECONCILE_STATION_ACCS', level: 'INFO' },
      { msg: 'Atlantic Corporate Bank Gateway: Batch payment transmission acknowledged (HTTP 200 OK)', level: 'SUCCESS' }
    ];

    setInterval(() => {
      const evt = events[Math.floor(Math.random() * events.length)];
      this.log(evt.msg, evt.level);
    }, 6000);
  }
}

// Global singleton instance
window.appState = new StateManager();
