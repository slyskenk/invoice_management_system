// Data Analysis, Cleansing & Oracle SQL/PL-SQL Studio Module
const DataCleanserModule = {
  render(container) {
    const state = window.appState.getState();
    const dc = state.dataCleansing;

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:24px;">
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h2 style="font-family:var(--font-display); font-size:1.5rem; font-weight:700; color:#FFF;">
              Data Analysis, Integration & Cleansing Engine
            </h2>
            <p style="font-size:0.8rem; color:var(--text-muted);">
              Automated anomaly detection, GL code harmonization & Oracle PL/SQL enterprise data hygiene
            </p>
          </div>
          <button class="btn btn-cyan" id="btn-run-cleansing" ${dc.dirtyRecords.length === 0 ? 'disabled' : ''}>
            <span>🧹</span> Run Oracle PL/SQL Data Scrubber
          </button>
        </div>

        <!-- Metrics Row -->
        <div class="kpi-row">
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-title">Total Processed Records</span>
              <div class="stat-icon">🗄️</div>
            </div>
            <div class="stat-value">${dc.rawRecordsCount.toLocaleString()}</div>
            <div class="stat-footer">
              <span class="stat-trend neutral">● Core ERP & Billing</span>
              <span>Debtor tables</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-title">Anomalies Detected</span>
              <div class="stat-icon" style="color:var(--amber-warning);">⚠️</div>
            </div>
            <div class="stat-value" id="stat-anomalies-val" style="color:${dc.anomaliesDetected > 0 ? 'var(--amber-warning)' : 'var(--emerald-success)'};">
              ${dc.anomaliesDetected}
            </div>
            <div class="stat-footer">
              <span>${dc.anomaliesDetected > 0 ? 'Requires PL/SQL scrubber' : 'All records sanitized'}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-title">Data Cleansing Health Score</span>
              <div class="stat-icon" style="color:var(--emerald-success);">⭐</div>
            </div>
            <div class="stat-value" id="stat-score-val" style="color:var(--emerald-success);">${dc.dataQualityScore}%</div>
            <div class="stat-footer">
              <span class="stat-trend positive">▲ 1.58%</span>
              <span>Audit compliance standard</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-title">Cleaned & Normalized</span>
              <div class="stat-icon">✅</div>
            </div>
            <div class="stat-value" id="stat-cleansed-val">${dc.cleansedCount.toLocaleString()}</div>
            <div class="stat-footer">
              <span class="stat-trend positive">● Verified</span>
              <span>GL Posting Ready</span>
            </div>
          </div>
        </div>

        <!-- Dirty Records Scrubber Inspection Table -->
        <div class="table-container">
          <div class="table-header-bar">
            <h3 class="table-title">
              <span>ERP Raw Ingestion Scrubber Queue</span>
              <span class="badge ${dc.anomaliesDetected > 0 ? 'badge-warning' : 'badge-cleared'}" id="badge-scrubber-status">
                ${dc.anomaliesDetected > 0 ? `${dc.anomaliesDetected} Anomalies Queued` : 'All Clean'}
              </span>
            </h3>
            <span style="font-size:0.75rem; color:var(--text-dim);">
              Rule Engine: NamClear VAT Format + Chart of Accounts Validation
            </span>
          </div>

          <div style="overflow-x:auto;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Record ID</th>
                  <th>Raw Account Ref</th>
                  <th>Raw Tax / VAT ID</th>
                  <th>GL Mapping Code</th>
                  <th>Amount (NAD)</th>
                  <th>Detected Data Defect</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody id="dirty-records-tbody">
                <!-- Dynamic dirty rows -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Oracle PL/SQL & SQL Query Studio -->
        <div class="table-container" style="padding:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
            <div>
              <h3 style="font-family:var(--font-display); font-size:1.15rem; font-weight:600; color:#FFF;">
                Oracle PL/SQL & SQL Systems Studio
              </h3>
              <p style="font-size:0.75rem; color:var(--text-muted);">
                Execute real-time stored procedures, ETL transformations, and data integrity checks directly on the ERP instance
              </p>
            </div>
            <div style="display:flex; gap:10px; align-items:center;">
              <select class="form-control" id="sql-preset-select" style="font-size:0.8rem; padding:6px 12px;">
                <option value="query1">ETL: Cleanse & Harmonize Malformed Debtors</option>
                <option value="query2">Analysis: Aging Debtor Balances by GL Code</option>
                <option value="query3">Reconciliation: Apex Commercial Bank Settlement Match Rate</option>
                <option value="query4">PL/SQL Package: PKG_MUNICIPAL_BILLING.RUN_INTEGRITY_AUDIT</option>
              </select>
              <button class="btn btn-primary btn-sm" id="btn-run-sql">
                <span>▶</span> Execute Script
              </button>
            </div>
          </div>

          <!-- SQL Editor Area -->
          <div class="code-box" style="margin-bottom:16px; min-height:120px;" id="sql-code-editor">
            <!-- SQL query code -->
          </div>

          <!-- Query Execution Result Table -->
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:0.75rem; color:var(--text-dim); text-transform:uppercase; font-weight:700;">
                Query Results Output
              </span>
              <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--emerald-success);" id="sql-exec-time">
                Executed in 2.8 ms (Oracle 19c Enterprise Core)
              </span>
            </div>
            <div style="background:#070B12; border:1px solid var(--border-subtle); border-radius:var(--radius-md); overflow-x:auto;">
              <table class="data-table" id="sql-results-table">
                <!-- Rendered results -->
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    this.renderDirtyRecords();
    this.setupSqlPresets();
    this.bindEvents();
  },

  renderDirtyRecords() {
    const tbody = document.getElementById('dirty-records-tbody');
    if (!tbody) return;

    const dc = window.appState.getState().dataCleansing;

    if (dc.dirtyRecords.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:30px; color:var(--emerald-success); font-weight:600;">
            ✓ All ingestion records are clean, sanitized, and successfully reconciled with the General Ledger!
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = dc.dirtyRecords.map(rec => `
      <tr>
        <td class="cell-mono">${rec.id}</td>
        <td style="font-family:var(--font-mono); color:#FFF;">${rec.account}</td>
        <td class="cell-mono" style="color:var(--rose-danger);">${rec.taxNumber}</td>
        <td><span class="badge badge-warning">${rec.glCode}</span></td>
        <td class="cell-amount">N$ ${rec.amount}</td>
        <td style="color:var(--amber-warning); font-size:0.8rem;">${rec.issue}</td>
        <td><span class="badge badge-high">${rec.status}</span></td>
      </tr>
    `).join('');
  },

  setupSqlPresets() {
    const presets = {
      query1: `-- Oracle PL/SQL Data Cleansing & Reconciliation Procedure
BEGIN
  SYS_DATA_CLEANSE_PKG.PURGE_WHITESPACE();
  SYS_DATA_CLEANSE_PKG.VALIDATE_NAMIBIAN_VAT_CHECKSUM();
  
  UPDATE ERP_DEBTORS_STAGING
  SET GL_CODE = 'GL-4200-ICT-CONN',
      TAX_ID = 'NAM-VAT-0600123982',
      RECORD_STATUS = 'CLEANSED_VALID'
  WHERE RECORD_ID IN ('REC-9012', 'REC-9013', 'REC-9014');
  
  COMMIT;
END;`,

      query2: `SELECT 
    d.GL_CODE,
    g.DESCRIPTION AS GL_NAME,
    COUNT(d.INVOICE_ID) AS ACTIVE_INVOICES,
    SUM(d.TOTAL_AMOUNT) AS TOTAL_OUTSTANDING_NAD,
    ROUND(AVG(d.DAYS_OVERDUE), 1) AS AVG_AGING_DAYS
FROM ERP_INVOICES d
JOIN ERP_CHART_OF_ACCOUNTS g ON d.GL_CODE = g.GL_CODE
WHERE d.STATUS != 'Settled'
GROUP BY d.GL_CODE, g.DESCRIPTION
ORDER BY TOTAL_OUTSTANDING_NAD DESC;`,

      query3: `SELECT 
    i.INVOICE_ID,
    i.CUSTOMER_NAME,
    i.TOTAL_AMOUNT AS ERP_AMOUNT,
    b.CLEARED_AMOUNT AS APEX_BANK_AMOUNT,
    (i.TOTAL_AMOUNT - b.CLEARED_AMOUNT) AS RECON_VARIANCE,
    b.TRANSACTION_STATUS
FROM ERP_INVOICES i
INNER JOIN APEX_COMMERCIAL_H2H_FEED b ON i.INVOICE_ID = b.ERP_REFERENCE_ID
WHERE b.SETTLEMENT_DATE = TRUNC(SYSDATE);`,

      query4: `CREATE OR REPLACE PACKAGE BODY PKG_MUNICIPAL_BILLING AS
  PROCEDURE RUN_INTEGRITY_AUDIT(p_run_id OUT VARCHAR2) IS
  BEGIN
    p_run_id := 'AUDIT-' || TO_CHAR(SYSDATE, 'YYYYMMDD-HH24MISS');
    INSERT INTO AUDIT_LOG (AUDIT_KEY, EVENT_DESC, ITIL_CHANGE_REF)
    VALUES (p_run_id, 'Debtor ledger integrity checksum verified', 'RFC-2026-044');
    COMMIT;
  END RUN_INTEGRITY_AUDIT;
END PKG_MUNICIPAL_BILLING;`
    };

    const editor = document.getElementById('sql-code-editor');
    const select = document.getElementById('sql-preset-select');

    if (editor && select) {
      editor.textContent = presets[select.value];
      this.executeSampleQuery(select.value);

      select.addEventListener('change', () => {
        editor.textContent = presets[select.value];
        this.executeSampleQuery(select.value);
      });
    }
  },

  executeSampleQuery(queryKey) {
    const table = document.getElementById('sql-results-table');
    const timeEl = document.getElementById('sql-exec-time');
    if (!table) return;

    if (queryKey === 'query1') {
      timeEl.textContent = 'PL/SQL Block Executed successfully in 3.1 ms | 3 rows updated';
      table.innerHTML = `
        <thead>
          <tr>
            <th>STATUS</th>
            <th>PROCEDURE_CALLED</th>
            <th>ROWS_CLEANSED</th>
            <th>INTEGRITY_CHECK</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="badge badge-cleared">SUCCESS</span></td>
            <td class="cell-mono">SYS_DATA_CLEANSE_PKG.PURGE_WHITESPACE</td>
            <td class="cell-mono">3</td>
            <td style="color:var(--emerald-success);">✓ PASSED (0 defects)</td>
          </tr>
        </tbody>
      `;
    } else if (queryKey === 'query2') {
      timeEl.textContent = 'Query executed in 4.2 ms | 3 rows returned';
      table.innerHTML = `
        <thead>
          <tr>
            <th>GL_CODE</th>
            <th>GL_NAME</th>
            <th>ACTIVE_INVOICES</th>
            <th>TOTAL_OUTSTANDING_NAD</th>
            <th>AVG_AGING_DAYS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="cell-mono">GL-4100-MUNI-UTIL</td>
            <td>Windhoek Water & Bulk Purification</td>
            <td class="cell-mono">4</td>
            <td class="cell-amount">N$ 170,798.00</td>
            <td class="cell-mono">12.4 days</td>
          </tr>
          <tr>
            <td class="cell-mono">GL-4200-ICT-CONN</td>
            <td>ICT Dedicated WAN Trunk Line</td>
            <td class="cell-mono">2</td>
            <td class="cell-amount">N$ 100,510.00</td>
            <td class="cell-mono">8.0 days</td>
          </tr>
          <tr>
            <td class="cell-mono">GL-5100-PUBLIC-HLTH</td>
            <td>Health & Emergency Fleet Telematics</td>
            <td class="cell-mono">1</td>
            <td class="cell-amount">N$ 396,750.00</td>
            <td class="cell-mono">3.0 days</td>
          </tr>
        </tbody>
      `;
    } else if (queryKey === 'query3') {
      timeEl.textContent = 'Query executed in 1.9 ms | 2 rows returned';
      table.innerHTML = `
        <thead>
          <tr>
            <th>INVOICE_ID</th>
            <th>CUSTOMER_NAME</th>
            <th>ERP_AMOUNT</th>
            <th>APEX_BANK_AMOUNT</th>
            <th>RECON_VARIANCE</th>
            <th>TRANSACTION_STATUS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="cell-mono">INV-2026-0891</td>
            <td>Windhoek Municipal Water Utility</td>
            <td class="cell-mono">N$ 170,798.00</td>
            <td class="cell-mono">N$ 170,798.00</td>
            <td style="color:var(--emerald-success); font-family:var(--font-mono);">0.00</td>
            <td><span class="badge badge-cleared">SETTLED</span></td>
          </tr>
          <tr>
            <td class="cell-mono">INV-2026-0892</td>
            <td>Namibia Telecom & Fiber Grid</td>
            <td class="cell-mono">N$ 100,510.00</td>
            <td class="cell-mono">N$ 100,510.00</td>
            <td style="color:var(--emerald-success); font-family:var(--font-mono);">0.00</td>
            <td><span class="badge badge-cleared">SETTLED</span></td>
          </tr>
        </tbody>
      `;
    } else {
      timeEl.textContent = 'PL/SQL Package Compiled with 0 errors in 12.0 ms';
      table.innerHTML = `
        <thead>
          <tr>
            <th>OBJECT_NAME</th>
            <th>OBJECT_TYPE</th>
            <th>STATUS</th>
            <th>COMPILED_AT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="cell-mono">PKG_MUNICIPAL_BILLING</td>
            <td>PACKAGE BODY</td>
            <td><span class="badge badge-cleared">VALID</span></td>
            <td class="cell-mono">2026-10-18 12:00:10</td>
          </tr>
        </tbody>
      `;
    }
  },

  bindEvents() {
    // Run Cleansing button
    const cleanBtn = document.getElementById('btn-run-cleansing');
    if (cleanBtn) {
      cleanBtn.addEventListener('click', () => {
        cleanBtn.disabled = true;
        cleanBtn.innerHTML = '<span>⏳</span> Cleansing Ingestion Pipeline...';

        setTimeout(() => {
          window.appState.runDataCleansing();
          this.renderDirtyRecords();

          // Update metrics
          const dc = window.appState.getState().dataCleansing;
          document.getElementById('stat-anomalies-val').textContent = dc.anomaliesDetected;
          document.getElementById('stat-anomalies-val').style.color = 'var(--emerald-success)';
          document.getElementById('stat-score-val').textContent = `${dc.dataQualityScore}%`;
          document.getElementById('stat-cleansed-val').textContent = dc.cleansedCount.toLocaleString();

          const badge = document.getElementById('badge-scrubber-status');
          if (badge) {
            badge.className = 'badge badge-cleared';
            badge.textContent = 'All Clean';
          }

          cleanBtn.innerHTML = '<span>✓</span> Data Cleansed & Normalized';
          window.Notifications.show('Data Cleansing complete: 3 anomalies resolved via Oracle PL/SQL script', 'success');
        }, 1200);
      });
    }

    // Run SQL button
    const runSqlBtn = document.getElementById('btn-run-sql');
    if (runSqlBtn) {
      runSqlBtn.addEventListener('click', () => {
        const select = document.getElementById('sql-preset-select');
        this.executeSampleQuery(select.value);
        window.Notifications.show('SQL statement executed successfully against ERP database', 'success');
      });
    }
  }
};

window.DataCleanserModule = DataCleanserModule;
