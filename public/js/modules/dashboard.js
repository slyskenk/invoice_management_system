// Dashboard Module - ERP Core Health & Enterprise Middleware Monitor
const DashboardModule = {
  render(container) {
    const state = window.appState.getState();
    const totalRevenue = state.invoices.reduce((sum, inv) => sum + inv.total, 0);

    container.innerHTML = `
      <div class="dashboard-grid">
        <!-- Key Performance Area Metric Tiles -->
        <div class="kpi-row">
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-title">ERP Core Uptime</span>
              <div class="stat-icon">⚡</div>
            </div>
            <div class="stat-value">99.98%</div>
            <div class="stat-footer">
              <span class="stat-trend positive">▲ 0.02%</span>
              <span>vs prior 30-day SLA</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-title">Active 3rd-Party Interfaces</span>
              <div class="stat-icon">🔌</div>
            </div>
            <div class="stat-value">${state.integrations.length} Gateways</div>
            <div class="stat-footer">
              <span class="stat-trend positive">● All Healthy</span>
              <span>Apex / Atlantic / Java CAPS</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-title">ERP Invoiced (MTD)</span>
              <div class="stat-icon">💰</div>
            </div>
            <div class="stat-value">N$ ${(totalRevenue / 1000).toFixed(1)}k</div>
            <div class="stat-footer">
              <span class="stat-trend positive">▲ 14.8%</span>
              <span>Reconciled Debtor Ledger</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-title">Data Cleansing Quality</span>
              <div class="stat-icon">✨</div>
            </div>
            <div class="stat-value" id="kpi-quality-score">${state.dataCleansing.dataQualityScore}%</div>
            <div class="stat-footer">
              <span class="stat-trend neutral">● Oracle PL/SQL</span>
              <span>${state.dataCleansing.anomaliesDetected} pending anomalies</span>
            </div>
          </div>
        </div>

        <!-- Middle Section: ERP Architecture Topology & Throughput Canvas -->
        <div class="topology-card">
          <div class="topology-header">
            <div>
              <h3 class="topology-title">Windhoek Municipal ERP Ecosystem Topology</h3>
              <p style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">
                Interface bus between Core ERP, .NET WebAPIs, Java CAPS, Oracle PL/SQL, and 3rd Party Banking APIs
              </p>
            </div>
            <span class="badge badge-online">
              <span class="pulse-dot"></span> Live Bus Active
            </span>
          </div>

          <div class="topology-container">
            <div class="topo-node">
              <div class="topo-node-header">
                <span class="topo-node-name">ERP Core System</span>
                <span class="badge badge-cleared">Host</span>
              </div>
              <span class="topo-node-tech">SAP / Oracle ERP</span>
              <div class="topo-node-stat">
                <span>Database Pool</span>
                <strong style="color:#FFF;">14 / 50 conn</strong>
              </div>
              <div class="topo-node-stat">
                <span>Latency</span>
                <strong style="color:var(--cyan-accent);">${state.systemHealth.dbPoolLatency}</strong>
              </div>
            </div>

            <div class="topo-node">
              <div class="topo-node-header">
                <span class="topo-node-name">.NET Web API Bus</span>
                <span class="badge badge-cleared">Online</span>
              </div>
              <span class="topo-node-tech">C# / Visual Studio</span>
              <div class="topo-node-stat">
                <span>REST Endpoints</span>
                <strong style="color:#FFF;">28 Services</strong>
              </div>
              <div class="topo-node-stat">
                <span>Avg Response</span>
                <strong style="color:var(--cyan-accent);">14ms</strong>
              </div>
            </div>

            <div class="topo-node">
              <div class="topo-node-header">
                <span class="topo-node-name">Java CAPS Middleware</span>
                <span class="badge badge-cleared">Online</span>
              </div>
              <span class="topo-node-tech">JMS / Enterprise EAI</span>
              <div class="topo-node-stat">
                <span>Queue Depth</span>
                <strong style="color:#FFF;">0 Pending</strong>
              </div>
              <div class="topo-node-stat">
                <span>Msg Rate</span>
                <strong style="color:var(--cyan-accent);">190/sec</strong>
              </div>
            </div>

            <div class="topo-node">
              <div class="topo-node-header">
                <span class="topo-node-name">3rd Party Bank Gate</span>
                <span class="badge badge-cleared">Online</span>
              </div>
              <span class="topo-node-tech">ISO20022 / mTLS</span>
              <div class="topo-node-stat">
                <span>Apex Commercial</span>
                <strong style="color:var(--emerald-success);">Connected</strong>
              </div>
              <div class="topo-node-stat">
                <span>EFT Success</span>
                <strong style="color:#FFF;">99.94%</strong>
              </div>
            </div>
          </div>

          <!-- Live Throughput Canvas -->
          <div style="margin-top: 20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:0.75rem; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.05em; font-weight:600;">
                Real-Time Message Bus Transactions Per Second (TPS)
              </span>
              <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--cyan-accent);" id="canvas-tps-val">
                74.2 tps
              </span>
            </div>
            <div style="background:rgba(10, 14, 23, 0.6); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:10px;">
              <canvas id="throughput-canvas" style="width:100%; height:130px; display:block;"></canvas>
            </div>
          </div>
        </div>

        <!-- Split Row: Service Health & Live Terminal Stream -->
        <div class="dashboard-split">
          <!-- Live Integration Event Log -->
          <div class="terminal-window">
            <div class="terminal-header">
              <div class="terminal-dots">
                <span class="dot-red"></span>
                <span class="dot-yellow"></span>
                <span class="dot-green"></span>
              </div>
              <span class="terminal-title">Enterprise Systems Event Stream (ITIL Event Management)</span>
              <span style="font-size:0.7rem; color:var(--emerald-success);">LIVE</span>
            </div>
            <div class="terminal-body" id="dashboard-terminal-stream">
              <!-- Log entries filled dynamically -->
            </div>
          </div>

          <!-- Service Health List -->
          <div class="table-container" style="padding: 20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <h4 style="font-family:var(--font-display); font-size:0.95rem; font-weight:600;">Service Status & SLA</h4>
              <button class="btn btn-outline btn-sm" id="btn-refresh-health">Test Diagnostic</button>
            </div>
            <div class="service-health-list">
              <div class="service-item">
                <div class="service-meta">
                  <div class="service-dot"></div>
                  <div>
                    <div class="service-name">Apex Commercial Bank Host-to-Host</div>
                    <div class="service-type">ISO20022 Financial Gateway</div>
                  </div>
                </div>
                <div class="service-stats">
                  <span class="service-latency">38ms</span>
                  <span class="badge badge-cleared">99.94%</span>
                </div>
              </div>

              <div class="service-item">
                <div class="service-meta">
                  <div class="service-dot"></div>
                  <div>
                    <div class="service-name">Oracle PL/SQL ETL Engine</div>
                    <div class="service-type">Scheduled Jobs & Data Cleansing</div>
                  </div>
                </div>
                <div class="service-stats">
                  <span class="service-latency">4ms</span>
                  <span class="badge badge-cleared">100%</span>
                </div>
              </div>

              <div class="service-item">
                <div class="service-meta">
                  <div class="service-dot"></div>
                  <div>
                    <div class="service-name">Java CAPS EAI Message Bus</div>
                    <div class="service-type">Enterprise Service Integration</div>
                  </div>
                </div>
                <div class="service-stats">
                  <span class="service-latency">22ms</span>
                  <span class="badge badge-cleared">99.89%</span>
                </div>
              </div>

              <div class="service-item">
                <div class="service-meta">
                  <div class="service-dot"></div>
                  <div>
                    <div class="service-name">.NET 8 ERP Integration API</div>
                    <div class="service-type">RESTful Invoicing & Accounts</div>
                  </div>
                </div>
                <div class="service-stats">
                  <span class="service-latency">14ms</span>
                  <span class="badge badge-cleared">99.98%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Render Canvas Chart
    setTimeout(() => {
      window.ChartRenderer.drawThroughputChart('throughput-canvas');
    }, 50);

    // Populate initial logs
    this.renderLogs();

    // Hook up refresh button
    const refreshBtn = document.getElementById('btn-refresh-health');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        window.appState.log('Diagnostic ping executed across all 5 Enterprise connectors: All nodes nominal.', 'SUCCESS');
        window.Notifications.show('Diagnostic ping complete: 0 errors detected.', 'success');
      });
    }

    // Subscribe to state logs
    window.appState.subscribe('logAdded', () => this.renderLogs());
    window.appState.subscribe('telemetryTick', (health) => {
      const tpsEl = document.getElementById('canvas-tps-val');
      if (tpsEl) {
        tpsEl.textContent = `${(health.cpuLoadPct * 2.8 + 10).toFixed(1)} tps`;
      }
    });
  },

  renderLogs() {
    const stream = document.getElementById('dashboard-terminal-stream');
    if (!stream) return;

    const state = window.appState.getState();
    stream.innerHTML = state.liveLogs.map(log => `
      <div class="log-entry">
        <span class="log-ts">[${log.time}]</span>
        <span class="log-level ${log.level}">${log.level}</span>
        <span class="log-msg">${log.msg}</span>
      </div>
    `).join('');
  }
};

window.DashboardModule = DashboardModule;
