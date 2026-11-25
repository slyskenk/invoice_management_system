// ITIL & COBIT Systems Governance Module
const ItilModule = {
  render(container) {
    const state = window.appState.getState();

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:24px;">
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h2 style="font-family:var(--font-display); font-size:1.5rem; font-weight:700; color:#FFF;">
              ITIL v4 & COBIT 2019 Systems Governance Hub
            </h2>
            <p style="font-size:0.8rem; color:var(--text-muted);">
              Enterprise Change Advisory Board (CAB) control, SDLC change workflows & IT governance alignment
            </p>
          </div>
          <button class="btn btn-primary" id="btn-new-rfc">
            <span>+</span> Log Request for Change (RFC)
          </button>
        </div>

        <!-- SDLC Interactive Pipeline Stepper -->
        <div class="topology-card">
          <div class="topology-header">
            <div>
              <h3 class="topology-title">Systems Development Lifecycle (SDLC) Pipeline</h3>
              <p style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">
                ITIL Service Transition & COBIT BAI03 (Build & Test) Quality Gate
              </p>
            </div>
            <span class="badge badge-cleared">Audit Compliant</span>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-top:10px;">
            <div style="background:rgba(15,23,42,0.6); border:1px solid var(--border-accent); border-radius:var(--radius-md); padding:14px;">
              <div style="font-size:0.7rem; color:var(--cyan-accent); font-weight:700; text-transform:uppercase;">Stage 01</div>
              <div style="font-size:0.88rem; font-weight:600; color:#FFF; margin:4px 0;">Needs & Systems Analysis</div>
              <div style="font-size:0.72rem; color:var(--text-muted);">Business process mapping & user spec formulation</div>
            </div>

            <div style="background:rgba(15,23,42,0.6); border:1px solid var(--border-accent); border-radius:var(--radius-md); padding:14px;">
              <div style="font-size:0.7rem; color:var(--cyan-accent); font-weight:700; text-transform:uppercase;">Stage 02</div>
              <div style="font-size:0.88rem; font-weight:600; color:#FFF; margin:4px 0;">Architecture & Design</div>
              <div style="font-size:0.72rem; color:var(--text-muted);">Interface specification & schema migration design</div>
            </div>

            <div style="background:rgba(15,23,42,0.6); border:1px solid var(--cyan-accent); border-radius:var(--radius-md); padding:14px; box-shadow:var(--shadow-cyan-glow);">
              <div style="font-size:0.7rem; color:var(--emerald-success); font-weight:700; text-transform:uppercase;">Stage 03 (Active)</div>
              <div style="font-size:0.88rem; font-weight:600; color:#FFF; margin:4px 0;">Development & Testing</div>
              <div style="font-size:0.72rem; color:var(--text-muted);">.NET, Java CAPS & Oracle PL/SQL regression tests</div>
            </div>

            <div style="background:rgba(15,23,42,0.6); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:14px;">
              <div style="font-size:0.7rem; color:var(--text-dim); font-weight:700; text-transform:uppercase;">Stage 04</div>
              <div style="font-size:0.88rem; font-weight:600; color:#FFF; margin:4px 0;">CAB Approval</div>
              <div style="font-size:0.72rem; color:var(--text-muted);">ITIL risk assessment & rollback verification</div>
            </div>

            <div style="background:rgba(15,23,42,0.6); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:14px;">
              <div style="font-size:0.7rem; color:var(--text-dim); font-weight:700; text-transform:uppercase;">Stage 05</div>
              <div style="font-size:0.88rem; font-weight:600; color:#FFF; margin:4px 0;">Deployment & Support</div>
              <div style="font-size:0.72rem; color:var(--text-muted);">Continuous monitoring & business support training</div>
            </div>
          </div>
        </div>

        <!-- ITIL Change Requests Table -->
        <div class="table-container">
          <div class="table-header-bar">
            <h3 class="table-title">
              <span>Active Requests for Change (RFC Registry)</span>
            </h3>
            <span style="font-size:0.75rem; color:var(--text-dim);">
              ITIL Change Enablement Practice
            </span>
          </div>

          <div style="overflow-x:auto;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>RFC ID</th>
                  <th>Title & Scope</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>COBIT 2019 Alignment</th>
                  <th>ITIL Stage</th>
                  <th>CAB Review</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${state.itilChanges.map(rfc => `
                  <tr>
                    <td class="cell-mono">${rfc.id}</td>
                    <td>
                      <div style="font-weight:600; color:#FFF;">${rfc.title}</div>
                      <div style="font-size:0.72rem; color:var(--text-dim);">Impact: ${rfc.impact}</div>
                    </td>
                    <td><span class="badge" style="background:rgba(255,255,255,0.05); color:#93C5FD;">${rfc.category}</span></td>
                    <td><span class="badge ${rfc.priority === 'High' ? 'badge-high' : 'badge-warning'}">${rfc.priority}</span></td>
                    <td style="font-family:var(--font-mono); font-size:0.75rem; color:var(--cyan-accent);">${rfc.cobitDomain}</td>
                    <td style="font-size:0.78rem; color:var(--text-muted);">${rfc.itilStage}</td>
                    <td style="font-size:0.78rem; font-family:var(--font-mono);">${rfc.reviewDate}</td>
                    <td><span class="badge badge-cleared">${rfc.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- COBIT 2019 Governance Alignment Matrix -->
        <div class="table-container" style="padding:24px;">
          <h3 style="font-family:var(--font-display); font-size:1.15rem; font-weight:600; color:#FFF; margin-bottom:12px;">
            COBIT 2019 Framework Mapping for Application Systems Specialist
          </h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:16px;">
            <div style="background:rgba(15,23,42,0.5); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px;">
              <div style="color:var(--cyan-accent); font-weight:700; font-size:0.8rem; font-family:var(--font-mono);">BAI06 - Manage Changes</div>
              <div style="font-size:0.85rem; color:#FFF; margin:6px 0; font-weight:600;">Controlled System Releases</div>
              <p style="font-size:0.75rem; color:var(--text-muted); line-height:1.5;">
                All ERP modifications, middleware interface patches, and schema migrations undergo impact analysis and CAB approval.
              </p>
            </div>

            <div style="background:rgba(15,23,42,0.5); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px;">
              <div style="color:var(--emerald-success); font-weight:700; font-size:0.8rem; font-family:var(--font-mono);">BAI03 - Solutions Identification & Build</div>
              <div style="font-size:0.85rem; color:#FFF; margin:6px 0; font-weight:600;">Modular ERP Development</div>
              <p style="font-size:0.75rem; color:var(--text-muted); line-height:1.5;">
                Engineers reusable .NET and Java CAPS integration pipelines with comprehensive system documentation and automated testing.
              </p>
            </div>

            <div style="background:rgba(15,23,42,0.5); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px;">
              <div style="color:var(--primary); font-weight:700; font-size:0.8rem; font-family:var(--font-mono);">DSS05 - Manage Security Services</div>
              <div style="font-size:0.85rem; color:#FFF; margin:6px 0; font-weight:600;">3rd-Party Banking Security</div>
              <p style="font-size:0.75rem; color:var(--text-muted); line-height:1.5;">
                Enforces mutual TLS (mTLS), ISO20022 schema validation, and secure RESTful tokens across commercial banking partners.
              </p>
            </div>

            <div style="background:rgba(15,23,42,0.5); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px;">
              <div style="color:var(--amber-warning); font-weight:700; font-size:0.8rem; font-family:var(--font-mono);">MEA02 - Monitor Internal Controls</div>
              <div style="font-size:0.85rem; color:#FFF; margin:6px 0; font-weight:600;">Continuous Audit & Cleansing</div>
              <p style="font-size:0.75rem; color:var(--text-muted); line-height:1.5;">
                Oracle PL/SQL audit packages log every invoice state transition and ensure debits/credits balance with zero variance.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    const rfcBtn = document.getElementById('btn-new-rfc');
    if (rfcBtn) {
      rfcBtn.addEventListener('click', () => {
        window.Notifications.show('RFC Creator launched: Pre-populated with ITIL v4 Service Transition template.', 'info');
      });
    }
  }
};

window.ItilModule = ItilModule;
