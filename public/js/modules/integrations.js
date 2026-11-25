// Integrations & 3rd-Party Interface Middleware Module
const IntegrationsModule = {
  activePayloadTab: 'iso20022',

  render(container) {
    const state = window.appState.getState();

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:24px;">
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h2 style="font-family:var(--font-display); font-size:1.5rem; font-weight:700; color:#FFF;">
              3rd-Party Systems & ERP Middleware Hub
            </h2>
            <p style="font-size:0.8rem; color:var(--text-muted);">
              Enterprise integration bus bridging Core ERP modules with commercial banks, utility grids & external APIs
            </p>
          </div>
          <button class="btn btn-cyan" id="btn-trigger-sync">
            <span>⚡</span> Trigger Enterprise Sync Handshake
          </button>
        </div>

        <!-- Integration Connectors Grid -->
        <div class="kpi-row" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
          ${state.integrations.map(int => `
            <div class="stat-card" style="border-left: 3px solid var(--cyan-accent);">
              <div class="stat-header">
                <div>
                  <div style="font-weight:700; font-size:0.95rem; color:#FFF;">${int.name}</div>
                  <div style="font-family:var(--font-mono); font-size:0.7rem; color:var(--cyan-accent);">${int.type}</div>
                </div>
                <span class="badge badge-cleared">${int.status}</span>
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:0.78rem; margin-top:8px;">
                <div>
                  <span style="color:var(--text-dim);">Throughput:</span>
                  <div style="font-family:var(--font-mono); color:#FFF; font-weight:600;">${int.throughput}</div>
                </div>
                <div>
                  <span style="color:var(--text-dim);">Round-trip Latency:</span>
                  <div style="font-family:var(--font-mono); color:var(--cyan-accent); font-weight:600;">${int.latency}</div>
                </div>
                <div>
                  <span style="color:var(--text-dim);">Success Rate:</span>
                  <div style="font-family:var(--font-mono); color:var(--emerald-success); font-weight:600;">${int.successRate}</div>
                </div>
                <div>
                  <span style="color:var(--text-dim);">Sync Status:</span>
                  <div style="color:var(--text-muted);">${int.lastSync}</div>
                </div>
              </div>
              <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:10px; border-top:1px solid rgba(255,255,255,0.05); padding-top:10px;">
                <button class="btn btn-outline btn-sm test-conn-btn" data-id="${int.id}">Ping Link</button>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Payload Inspector & Protocol Sandbox -->
        <div class="table-container" style="padding:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
            <div>
              <h3 style="font-family:var(--font-display); font-size:1.1rem; font-weight:600; color:#FFF;">
                Multi-Protocol Interface Payload Inspector
              </h3>
              <p style="font-size:0.75rem; color:var(--text-muted);">
                Validates data marshalling across Apex Commercial Bank ISO20022 XML, Java CAPS JMS messages, and .NET REST APIs
              </p>
            </div>
            <div style="display:flex; gap:8px;">
              <button class="btn btn-sm btn-outline payload-tab active" data-tab="iso20022">Apex Commercial (ISO20022 XML)</button>
              <button class="btn btn-sm btn-outline payload-tab" data-tab="datacaps">Java CAPS (JMS Envelope)</button>
              <button class="btn btn-sm btn-outline payload-tab" data-tab="dotnet">.NET WebAPI (JSON)</button>
            </div>
          </div>

          <div class="code-box" id="payload-content-box">
            <!-- Dynamic payload code -->
          </div>

          <div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div style="font-size:0.75rem; color:var(--text-dim); font-family:var(--font-mono);">
              Schema Validation: <span style="color:var(--emerald-success);">✓ XSD / JSON-Schema Compliant</span> | Encoding: UTF-8
            </div>
            <button class="btn btn-primary btn-sm" id="btn-dispatch-test-packet">
              <span>🚀</span> Dispatch Test Ingestion Packet
            </button>
          </div>
        </div>
      </div>
    `;

    this.renderPayload();
    this.bindEvents();
  },

  getPayloads() {
    return {
      iso20022: `<?xml version="1.0" encoding="UTF-8"?>
<!-- Apex Commercial Bank Host-to-Host pacs.008.001.08 Credit Transfer -->
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08">
  <FIToFICstmrCdtTrf>
    <GrpHdr>
      <MsgId>ACB-EFT-20261018-09142</MsgId>
      <CreDtTm>2026-10-18T12:00:00+02:00</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <SttlmInf>
        <SttlmMtd>CLRG</SttlmMtd>
        <ClrSys><Prtry>NAMCLEAR-NAMIBIA-EFT</Prtry></ClrSys>
      </SttlmInf>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId>
        <EndToEndId>INV-2026-0891-SETTLE</EndToEndId>
      </PmtId>
      <IntrBkSttlmAmt Ccy="NAD">170798.00</IntrBkSttlmAmt>
      <Dbtr>
        <Nm>Windhoek Municipal Water Utility</Nm>
      </Dbtr>
      <Cdtr>
        <Nm>City of Windhoek Consolidated Revenue Fund</Nm>
      </Cdtr>
      <CdtrAgt>
        <FinInstnId><BICFI>APEXNAXX</BICFI></FinInstnId> <!-- Apex Commercial Bank SWIFT/BIC -->
      </CdtrAgt>
      <RmtInf>
        <Ustrd>Ref: ACC-WHM-9812 / GL-4100-MUNI-UTIL / Windhoek Bulk Settlement</Ustrd>
      </RmtInf>
    </CdtTrfTxInf>
  </FIToFICstmrCdtTrf>
</Document>`,

      datacaps: `<!-- Sun Java CAPS / GlassFish ESB Enterprise Message Envelope -->
<jms:message xmlns:jms="http://java.sun.com/caps/jms">
  <jms:header>
    <jms:destination>queue/municipal/billing/ingestion</jms:destination>
    <jms:delivery-mode>PERSISTENT</jms:delivery-mode>
    <jms:priority>7</jms:priority>
    <jms:timestamp>1792324800000</jms:timestamp>
    <jms:correlation-id>ERP-SYNC-CAPS-44821</jms:correlation-id>
  </jms:header>
  <jms:properties>
    <property name="SourceApplication" value="SmartMeterAMR_Substation_04"/>
    <property name="TargetModule" value="ERP_GeneralLedger_Posting"/>
    <property name="SecurityToken" value="HMAC-SHA256-49af88301b..."/>
  </jms:properties>
  <jms:body>
    <MeteringPayload meterId="WNK-MTR-8812" kwhRead="184920.4" readTimestamp="2026-10-18T11:58:00+02:00"/>
  </jms:body>
</jms:message>`,

      dotnet: `{
  "routingKey": "erp.invoicing.reconciliation",
  "sourceService": "Windhoek.ERP.MiddlewareService.v8",
  "transactionId": "TXN-88192-2026",
  "glPosting": {
    "debitAccount": "GL-1100-APEX-COMMERCIAL-OPERATING",
    "creditAccount": "GL-4100-MUNI-UTIL-REVENUE",
    "currency": "NAD",
    "amount": 170798.00,
    "vatComponent": {
      "applicableRate": 0.15,
      "vatAmount": 22278.00,
      "vatRegistrationNo": "NAM-VAT-0600818-WNK"
    }
  },
  "complianceAudit": {
    "cobitRef": "DSS05.02 (Manage Network and Connectivity Security)",
    "itilRef": "ITIL-OPS-INC-0891",
    "signOff": "Application Systems Specialist (C5)"
  }
}`
    };
  },

  renderPayload() {
    const box = document.getElementById('payload-content-box');
    if (!box) return;

    const payloads = this.getPayloads();
    box.textContent = payloads[this.activePayloadTab] || '';
  },

  bindEvents() {
    // Payload tabs
    document.querySelectorAll('.payload-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.payload-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activePayloadTab = tab.getAttribute('data-tab');
        this.renderPayload();
      });
    });

    // Test ping buttons
    document.querySelectorAll('.test-conn-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        window.appState.log(`Pinged connector [${id}]: Response time 21ms | SSL handshake valid.`, 'SUCCESS');
        window.Notifications.show(`Interface ${id} ping successful (21ms latency)`, 'success');
      });
    });

    // Enterprise Sync Handshake
    const syncBtn = document.getElementById('btn-trigger-sync');
    if (syncBtn) {
      syncBtn.addEventListener('click', () => {
        window.appState.log('Enterprise Sync initiated across all 4 3rd-party banking & metering pipelines...', 'SYNC');
        setTimeout(() => {
          window.appState.log('Sync Complete: 1,420 ERP transactional entries cleared without deadlock.', 'SUCCESS');
          window.Notifications.show('Enterprise synchronization cycle completed successfully', 'success');
        }, 1000);
      });
    }

    // Dispatch Test Packet
    const dispatchBtn = document.getElementById('btn-dispatch-test-packet');
    if (dispatchBtn) {
      dispatchBtn.addEventListener('click', () => {
        window.appState.log(`Dispatched test packet via [${this.activePayloadTab.toUpperCase()}] adapter: Acknowledged by upstream gateway.`, 'SUCCESS');
        window.Notifications.show('Test packet acknowledged by upstream gateway (HTTP 200 OK)', 'success');
      });
    }
  }
};

window.IntegrationsModule = IntegrationsModule;
