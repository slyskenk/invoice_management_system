// Job Application Dossier & Candidate Competency Matrix Module (Ref: WIN260818-1)
const DossierModule = {
  activeSlide: 0,

  render(container) {
    const state = window.appState.getState();
    const d = state.candidateDossier;

    container.innerHTML = `
      <div class="dossier-grid">
        <!-- Job Advert Banner -->
        <div class="job-advert-banner">
          <div class="job-header-row">
            <div class="job-title-group">
              <span class="badge badge-cleared" style="margin-bottom:8px;">Job Application Dossier</span>
              <h2>${d.title} (Grade ${d.grade})</h2>
              <div class="job-subtitle">
                <span>🏢 ${d.dept}</span>
                <span>•</span>
                <span>📍 ${d.location}</span>
                <span>•</span>
                <span>📋 Ref: <strong>${d.ref}</strong></span>
              </div>
            </div>
            <div style="display:flex; gap:10px; align-items:center;">
              <button class="btn btn-cyan" id="btn-open-pitch-deck">
                <span>🎤</span> Launch Interview Pitch Deck
              </button>
            </div>
          </div>

          <div class="job-meta-chips">
            <div class="meta-chip">
              <span>Closing Date:</span>
              <strong>${d.closingDate}</strong>
            </div>
            <div class="meta-chip">
              <span>Job Type:</span>
              <strong>Permanent</strong>
            </div>
            <div class="meta-chip">
              <span>Education:</span>
              <strong>3-Yr National Diploma in Business Computing / IS</strong>
            </div>
            <div class="meta-chip">
              <span>Required Experience:</span>
              <strong>3+ Years Systems Development</strong>
            </div>
            <div class="meta-chip">
              <span>Legal Requirement:</span>
              <strong>Code B/BE Driver License ✓</strong>
            </div>
          </div>
        </div>

        <!-- Remuneration & Benefits Breakdown -->
        <div class="salary-breakdown-card">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div>
              <h3 style="font-family:var(--font-display); font-size:1.15rem; font-weight:600; color:#FFF;">
                Official Remuneration & Allowance Structure (Grade C5)
              </h3>
              <p style="font-size:0.75rem; color:var(--text-muted);">
                Windhoek Municipal Enterprise remuneration framework breakdown
              </p>
            </div>
            <span class="badge badge-online">Annual CTC: N$ ${d.remuneration.totalCTC.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>

          <div class="salary-pills-grid">
            <div class="salary-pill">
              <span class="salary-label">Basic Salary</span>
              <span class="salary-val">N$ ${d.remuneration.basic.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              <span style="font-size:0.7rem; color:var(--text-dim);">Per annum</span>
            </div>

            <div class="salary-pill">
              <span class="salary-label">Housing Allowance</span>
              <span class="salary-val">N$ ${d.remuneration.housing.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              <span style="font-size:0.7rem; color:var(--text-dim);">Per annum</span>
            </div>

            <div class="salary-pill">
              <span class="salary-label">Transport Allowance</span>
              <span class="salary-val">N$ ${d.remuneration.transport.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              <span style="font-size:0.7rem; color:var(--text-dim);">Per annum</span>
            </div>

            <div class="salary-pill">
              <span class="salary-label">Municipal Allowance</span>
              <span class="salary-val">N$ ${d.remuneration.municipal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              <span style="font-size:0.7rem; color:var(--text-dim);">Per annum</span>
            </div>

            <div class="salary-pill highlight">
              <span class="salary-label" style="color:var(--cyan-accent); font-weight:700;">Monthly Gross Package</span>
              <span class="salary-val primary-val">N$ ${d.remuneration.monthlyGross.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              <span style="font-size:0.7rem; color:var(--emerald-success);">N$ 750,228.00 Total CTC pa</span>
            </div>
          </div>
        </div>

        <!-- Key Performance Area (KPA) Alignment & Competency Matrix -->
        <div>
          <h3 style="font-family:var(--font-display); font-size:1.25rem; font-weight:700; color:#FFF; margin-bottom:16px;">
            Key Performance Area (KPA) Alignment Matrix
          </h3>
          <div class="competency-grid">
            <div class="competency-card">
              <div class="comp-header">
                <span class="comp-title">1. Enterprise System Support & Maintenance</span>
                <span class="badge badge-cleared">100% Match</span>
              </div>
              <div class="comp-progress-bar">
                <div class="comp-progress-fill" style="width: 100%;"></div>
              </div>
              <p class="comp-details">
                Continuous operational health monitoring, uptime diagnostics, and system upgrade execution for core ERP modules and relational database servers.
              </p>
              <div class="comp-evidence">
                Evidence: NEXUS-ERP Telemetry Monitor, Uptime tracking (99.98%), DB connection pool governance.
              </div>
            </div>

            <div class="competency-card">
              <div class="comp-header">
                <span class="comp-title">2. System Analysis, Design & Testing</span>
                <span class="badge badge-cleared">98% Match</span>
              </div>
              <div class="comp-progress-bar">
                <div class="comp-progress-fill" style="width: 98%;"></div>
              </div>
              <p class="comp-details">
                Translating municipal business requirements into technical system specifications, unit tests, integration harnesses, and end-user documentation.
              </p>
              <div class="comp-evidence">
                Evidence: Formal SDLC pipeline, schema models, automated regression test harness.
              </div>
            </div>

            <div class="competency-card">
              <div class="comp-header">
                <span class="comp-title">3. Data Analysis, Integration & Cleansing</span>
                <span class="badge badge-cleared">96% Match</span>
              </div>
              <div class="comp-progress-bar">
                <div class="comp-progress-fill" style="width: 96%;"></div>
              </div>
              <p class="comp-details">
                High-throughput data extraction, transformation, duplicate purging, and sanitization utilizing advanced Oracle SQL & PL/SQL packages.
              </p>
              <div class="comp-evidence">
                Evidence: Built-in Data Scrubber with live anomaly detection and real-time PL/SQL execution studio.
              </div>
            </div>

            <div class="competency-card">
              <div class="comp-header">
                <span class="comp-title">4. 3rd-Party Application Support & Middleware</span>
                <span class="badge badge-cleared">95% Match</span>
              </div>
              <div class="comp-progress-bar">
                <div class="comp-progress-fill" style="width: 95%;"></div>
              </div>
              <p class="comp-details">
                Engineering bi-directional interface protocols between ERP and external payment gateways (Apex Commercial ISO20022, Atlantic Corporate Bank, Municipal SmartPay).
              </p>
              <div class="comp-evidence">
                Evidence: Multi-protocol payload inspector supporting ISO20022 XML, Java CAPS JMS, and REST JSON.
              </div>
            </div>

            <div class="competency-card">
              <div class="comp-header">
                <span class="comp-title">5. ITIL & COBIT Process Workflow</span>
                <span class="badge badge-cleared">94% Match</span>
              </div>
              <div class="comp-progress-bar">
                <div class="comp-progress-fill" style="width: 94%;"></div>
              </div>
              <p class="comp-details">
                Managing change control via Request for Change (RFC) registries, CAB approvals, risk categorization, and COBIT governance frameworks.
              </p>
              <div class="comp-evidence">
                Evidence: Integrated ITIL v4 RFC Registry & COBIT 2019 Domain Mapping (BAI06, DSS05, MEA02).
              </div>
            </div>

            <div class="competency-card">
              <div class="comp-header">
                <span class="comp-title">6. User Support & Training Enablement</span>
                <span class="badge badge-cleared">92% Match</span>
              </div>
              <div class="comp-progress-bar">
                <div class="comp-progress-fill" style="width: 92%;"></div>
              </div>
              <p class="comp-details">
                Delivering day-to-day enterprise tier-3 technical guidance, documentation, SOPs, and training workshops for the business support team.
              </p>
              <div class="comp-evidence">
                Evidence: Interactive pitch walkthrough, printable invoice slips, and system architecture manuals.
              </div>
            </div>
          </div>
        </div>

        <!-- Technical Stack Pre-Appointment Matrix -->
        <div class="table-container" style="padding:24px;">
          <h3 style="font-family:var(--font-display); font-size:1.15rem; font-weight:600; color:#FFF; margin-bottom:14px;">
            Pre-Appointment Added Advantage Competency Verification
          </h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:14px;">
            <div style="background:rgba(15,23,42,0.6); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:14px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <strong style="color:#FFF;">Visual Studio & .NET</strong>
                <span class="badge badge-cleared">Advanced</span>
              </div>
              <p style="font-size:0.75rem; color:var(--text-muted);">C#, ASP.NET Core Web API, Entity Framework, WCF middleware adapters.</p>
            </div>

            <div style="background:rgba(15,23,42,0.6); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:14px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <strong style="color:#FFF;">Java & Java CAPS</strong>
                <span class="badge badge-cleared">Proficient</span>
              </div>
              <p style="font-size:0.75rem; color:var(--text-muted);">Enterprise EAI, JMS queues, message-driven beans, and GlassFish ESB.</p>
            </div>

            <div style="background:rgba(15,23,42,0.6); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:14px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <strong style="color:#FFF;">Oracle SQL & PL/SQL</strong>
                <span class="badge badge-cleared">Expert</span>
              </div>
              <p style="font-size:0.75rem; color:var(--text-muted);">Stored procedures, ETL pipelines, triggers, indexing, window functions & views.</p>
            </div>

            <div style="background:rgba(15,23,42,0.6); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:14px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <strong style="color:#FFF;">ITIL v4 & COBIT</strong>
                <span class="badge badge-cleared">Certified</span>
              </div>
              <p style="font-size:0.75rem; color:var(--text-muted);">Service transition, incident lifecycle, CAB authorization & COBIT governance.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Interview Pitch Deck Modal -->
      <div class="modal-overlay" id="pitch-deck-modal">
        <div class="modal-content" style="max-width: 840px;">
          <div class="modal-header">
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="logo-icon" style="width:28px; height:28px; font-size:0.8rem;">NX</span>
              <h3 class="modal-title">Interview Presentation Deck (Ref: WIN260818-1)</h3>
            </div>
            <button class="modal-close" id="pitch-close-btn">&times;</button>
          </div>
          <div class="pitch-modal-body" id="pitch-slide-content">
            <!-- Slide dynamically rendered -->
          </div>
          <div class="modal-footer" style="justify-content:space-between;">
            <div style="font-size:0.8rem; color:var(--text-muted);" id="slide-tracker">Slide 1 of 5</div>
            <div style="display:flex; gap:10px;">
              <button class="btn btn-outline" id="btn-prev-slide">Previous</button>
              <button class="btn btn-primary" id="btn-next-slide">Next Slide</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  },

  getSlides() {
    return [
      {
        number: "SLIDE 01 / 05",
        title: "Executive Value Proposition: Application Systems Specialist",
        bullets: [
          "Direct alignment with Reference WIN260818-1 requirements: 3-Year National Diploma in Business Computing / Information Systems + 3+ years enterprise systems engineering experience.",
          "Core focus on improving, maintaining, and upgrading ERP modules and ensuring 99.98% operational uptime across municipal services.",
          "Bridging technical execution with business needs: Streamlining financial processes, reducing settlement cycles, and empowering business support personnel."
        ]
      },
      {
        number: "SLIDE 02 / 05",
        title: "Enterprise ERP Upgrades & 3rd-Party Integration Architecture",
        bullets: [
          "Robust middleware strategy connecting Core ERP with Apex Commercial Bank (ISO20022), Atlantic Corporate Bank, and municipal metering systems.",
          "Seamless migration and coexistence between legacy Java CAPS messaging infrastructure and modern .NET / RESTful WebAPIs.",
          "Enforcing end-to-end encryption, mTLS authentication, and standardized XML/JSON schemas to prevent transaction failures."
        ]
      },
      {
        number: "SLIDE 03 / 05",
        title: "Data Analysis, Cleansing & Oracle PL/SQL Hygiene",
        bullets: [
          "Proactive automated data scrubber that intercepts malformed VAT numbers, cleans trailing whitespaces, and normalizes debtor keys before ledger posting.",
          "High-performance Oracle PL/SQL stored procedures and batch ETL jobs ensuring exact balance reconciliation with zero reconciliation variance.",
          "Comprehensive reporting dashboards giving finance and ICT executives real-time transparency into billing integrity."
        ]
      },
      {
        number: "SLIDE 04 / 05",
        title: "ITIL v4 & COBIT 2019 Change Governance",
        bullets: [
          "Rigorous Change Advisory Board (CAB) control: Every ERP upgrade and module patch is scoped via Request for Change (RFC) with rollback plans.",
          "Adherence to COBIT BAI06 (Manage Changes) and DSS05 (Security Services) to protect municipal financial infrastructure.",
          "Systematic Systems Development Lifecycle (SDLC) ensuring unit testing, regression testing, and UAT sign-off prior to production deployment."
        ]
      },
      {
        number: "SLIDE 05 / 05",
        title: "Operational Leadership, Documentation & Training",
        bullets: [
          "Translating complex technical architecture into clear Standard Operating Procedures (SOPs) for the Business Support team.",
          "Structured knowledge-transfer workshops and Tier-3 escalated support to resolve day-to-day user roadblocks efficiently.",
          "Commitment to continuous improvement, digital transformation, and sustainable service delivery for Windhoek ICT."
        ]
      }
    ];
  },

  renderCurrentSlide() {
    const slides = this.getSlides();
    const slide = slides[this.activeSlide];
    const content = document.getElementById('pitch-slide-content');
    const tracker = document.getElementById('slide-tracker');
    const prevBtn = document.getElementById('btn-prev-slide');
    const nextBtn = document.getElementById('btn-next-slide');

    if (!content) return;

    tracker.textContent = `Slide ${this.activeSlide + 1} of ${slides.length}`;
    prevBtn.disabled = this.activeSlide === 0;
    nextBtn.textContent = this.activeSlide === slides.length - 1 ? 'Finish Presentation' : 'Next Slide';

    content.innerHTML = `
      <div class="pitch-slide">
        <span class="slide-number">${slide.number}</span>
        <h4 class="slide-title">${slide.title}</h4>
        <ul class="slide-bullets">
          ${slide.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `;
  },

  bindEvents() {
    const modal = document.getElementById('pitch-deck-modal');
    const openBtn = document.getElementById('btn-open-pitch-deck');
    const closeBtn = document.getElementById('pitch-close-btn');
    const prevBtn = document.getElementById('btn-prev-slide');
    const nextBtn = document.getElementById('btn-next-slide');

    if (openBtn) {
      openBtn.onclick = () => {
        this.activeSlide = 0;
        this.renderCurrentSlide();
        modal.classList.add('active');
      };
    }

    if (closeBtn) {
      closeBtn.onclick = () => modal.classList.remove('active');
    }

    if (prevBtn) {
      prevBtn.onclick = () => {
        if (this.activeSlide > 0) {
          this.activeSlide--;
          this.renderCurrentSlide();
        }
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        const slides = this.getSlides();
        if (this.activeSlide < slides.length - 1) {
          this.activeSlide++;
          this.renderCurrentSlide();
        } else {
          modal.classList.remove('active');
          window.Notifications.show('Interview pitch deck completed successfully', 'success');
        }
      };
    }
  }
};

window.DossierModule = DossierModule;
