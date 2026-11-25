const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// In-memory Enterprise state
let invoices = [
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
];

let changeRequests = [
  {
    id: "RFC-2026-042",
    title: "ERP Core 3rd-Party Apex Commercial Bank ISO20022 Gateway Upgrade",
    category: "ERP Interface / Financial Services",
    priority: "High",
    impact: "Enterprise-wide Invoicing & Settlements",
    requestedBy: "Application Systems Specialist",
    status: "CAB Approved - Scheduled for Deployment",
    cabReviewDate: "2026-10-22",
    cobitDomain: "BAI06 (Manage Changes) & DSS05 (Manage Security Services)",
    itilStage: "Service Transition"
  },
  {
    id: "RFC-2026-043",
    title: "Java CAPS to Spring Integration Adapter Modernization",
    category: "Middleware & Interface Bus",
    priority: "Medium",
    impact: "Municipal Smart Meter Data Ingestion",
    requestedBy: "ICT Architecture Board",
    status: "In Staging / UAT Verification",
    cabReviewDate: "2026-10-28",
    cobitDomain: "BAI03 (Manage Solutions Identification & Build)",
    itilStage: "Service Design & Transition"
  },
  {
    id: "RFC-2026-044",
    title: "Automated Data Cleansing & Deduplication Cron in Oracle PL/SQL",
    category: "Data Integrity & Reporting",
    priority: "Standard",
    impact: "Debtor Reconciliation Records",
    requestedBy: "Financial Reporting Division",
    status: "Implemented & Monitored",
    cabReviewDate: "2026-10-12",
    cobitDomain: "MEA02 (Monitor Internal Control System)",
    itilStage: "Service Operation"
  }
];

const candidateProfile = {
  referenceNumber: "WIN260818-1",
  jobTitle: "Application Systems Specialist",
  department: "INFORMATION, COMMUNICATION & TECHNOLOGY",
  town: "Windhoek",
  country: "Namibia",
  closingDate: "2026/11/09",
  grade: "C5",
  packageBreakdown: {
    basic: 497844.00,
    housing: 199140.00,
    transport: 30216.00,
    municipal: 23028.00,
    totalAnnual: 750228.00,
    monthlyGross: 62519.00
  },
  qualification: {
    title: "National Diploma in Business Computing / Information Systems (3 Years)",
    institution: "Namibia University of Science and Technology (NUST) / Recognized Tertiary",
    specialisation: "Business Computing and Information Systems"
  },
  experience: {
    years: 3.5,
    summary: "Over 3 years of hands-on experience in Systems Development, Enterprise ERP interface engineering, automated data pipelines, and 3rd party middleware support."
  },
  legal: "Valid Driver License Code B/BE (Confirmed)",
  addedAdvantageSkills: [
    { skill: "ITIL v4 Service Management", level: "Practitioner / Foundation Certified", score: 95 },
    { skill: "COBIT 2019 IT Governance", level: "Framework Implementation & Audit Aligned", score: 90 },
    { skill: ".NET & C# Enterprise Services", level: "Web API / WCF / Entity Framework Core", score: 94 },
    { skill: "Java & Java CAPS / Middleware", level: "EAI, Enterprise Service Bus & JMS", score: 88 },
    { skill: "SQL & Oracle PL/SQL Stored Procedures", level: "ETL, Window Functions, Index Tuning", score: 96 },
    { skill: "REST & SOAP XML Interface Engineering", level: "Secure Bank Gateways & API Security", score: 95 }
  ]
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoints
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');

    // Health Telemetry
    if (pathname === '/api/system/health') {
      const healthData = {
        status: "OPTIMAL",
        uptimeSeconds: Math.floor(process.uptime()) + 142850,
        cpuLoadPct: Math.floor(18 + Math.random() * 12),
        memoryUsageMb: 342,
        activeConnections: 124,
        databasePool: {
          active: 14,
          idle: 26,
          max: 50,
          latencyMs: (2.4 + Math.random() * 0.8).toFixed(2)
        },
        interfaces: [
          { name: "ERP Core Accounting Bus", type: ".NET WebAPI", status: "ONLINE", latency: "14ms", successRate: "99.98%" },
          { name: "Apex Commercial Bank Host-to-Host", type: "ISO20022 / mTLS", status: "ONLINE", latency: "38ms", successRate: "99.94%" },
          { name: "Java CAPS Municipal Messaging", type: "JMS Broker", status: "ONLINE", latency: "22ms", successRate: "99.89%" },
          { name: "Oracle PL/SQL Cleansing Engine", type: "DB Job Scheduler", status: "ONLINE", latency: "4ms", successRate: "100%" },
          { name: "3rd-Party Metering Gateway", type: "REST/OAuth2", status: "ONLINE", latency: "52ms", successRate: "99.72%" }
        ],
        timestamp: new Date().toISOString()
      };
      res.writeHead(200);
      res.end(JSON.stringify(healthData));
      return;
    }

    // Invoices list & create
    if (pathname === '/api/invoices') {
      if (req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, count: invoices.length, data: invoices }));
        return;
      }

      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const newInv = JSON.parse(body);
            newInv.id = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
            newInv.date = newInv.date || new Date().toISOString().split('T')[0];
            newInv.status = newInv.status || "Draft";
            invoices.unshift(newInv);
            res.writeHead(201);
            res.end(JSON.stringify({ success: true, message: "Invoice created & queued in ERP bus", invoice: newInv }));
          } catch (err) {
            res.writeHead(400);
            res.end(JSON.stringify({ success: false, error: "Invalid JSON payload" }));
          }
        });
        return;
      }
    }

    // Candidate Profile (WIN260818-1)
    if (pathname === '/api/candidate/profile') {
      res.writeHead(200);
      res.end(JSON.stringify(candidateProfile));
      return;
    }

    // ITIL Change Requests
    if (pathname === '/api/itil/rfc') {
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, count: changeRequests.length, data: changeRequests }));
      return;
    }

    // 404 for unknown api
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Endpoint not found" }));
    return;
  }

  // Static File Serving
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, safePath);
  const ext = path.extname(filePath).toLowerCase();

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA if not an asset
      if (!ext || ext === '.html') {
        const fallbackPath = path.join(PUBLIC_DIR, 'index.html');
        fs.readFile(fallbackPath, (fbErr, content) => {
          if (fbErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
          }
        });
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 File Not Found');
      }
      return;
    }

    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`[NEXUS-ERP Enterprise System Specialist Suite running at http://localhost:${PORT}]`);
  console.log(`[Job Ref: WIN260818-1 | Windhoek, Namibia | Grade C5]`);
});
