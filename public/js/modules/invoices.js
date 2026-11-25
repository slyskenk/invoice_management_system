// Invoices Module - Enterprise Invoicing, Billing & Debtor Integration
const InvoicesModule = {
  currentFilter: 'ALL',
  searchQuery: '',

  render(container) {
    const state = window.appState.getState();

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px;">
        <!-- Top Action Bar -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px;">
          <div>
            <h2 style="font-family:var(--font-display); font-size:1.5rem; font-weight:700; color:#FFF;">
              Enterprise Invoicing & Revenue Management
            </h2>
            <p style="font-size:0.8rem; color:var(--text-muted);">
              ERP Debtor ledger synchronization, GL posting & automated 3rd-party banking settlements
            </p>
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn btn-outline" id="btn-export-invoices">
              <span>📥</span> Export Batch (JSON)
            </button>
            <button class="btn btn-primary" id="btn-create-invoice-modal">
              <span>+</span> New Enterprise Invoice
            </button>
          </div>
        </div>

        <!-- Filter & Search Controls -->
        <div class="table-container">
          <div class="table-header-bar">
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <button class="btn btn-sm btn-outline filter-btn active" data-filter="ALL">All Invoices</button>
              <button class="btn btn-sm btn-outline filter-btn" data-filter="Cleared">Cleared (Bank Settlement)</button>
              <button class="btn btn-sm btn-outline filter-btn" data-filter="Processing">Processing</button>
              <button class="btn btn-sm btn-outline filter-btn" data-filter="Awaiting_Approval">Awaiting Approval</button>
              <button class="btn btn-sm btn-outline filter-btn" data-filter="Draft">Draft</button>
            </div>
            <div class="table-filters">
              <input type="text" class="search-input" id="invoice-search-input" placeholder="Search by customer, ID or GL Code..." />
            </div>
          </div>

          <div style="overflow-x:auto;">
            <table class="data-table" id="invoices-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Customer Account</th>
                  <th>GL Mapping</th>
                  <th>Date / Due</th>
                  <th>Subtotal</th>
                  <th>VAT (15%)</th>
                  <th>Total (NAD)</th>
                  <th>Settlement Gateway</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="invoices-table-body">
                <!-- Rendered dynamically -->
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Create Invoice Modal -->
      <div class="modal-overlay" id="create-invoice-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Generate Enterprise ERP Invoice</h3>
            <button class="modal-close" id="modal-close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <form id="new-invoice-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Customer / Debtor Organization</label>
                  <input type="text" class="form-control" id="inv-customer" placeholder="e.g. Windhoek Central Hospital" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Account Number</label>
                  <input type="text" class="form-control" id="inv-account" placeholder="e.g. ACC-WCH-8821" required />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">General Ledger (GL) Code</label>
                  <select class="form-control" id="inv-glcode">
                    <option value="GL-4100-MUNI-UTIL">GL-4100-MUNI-UTIL (Water & Sewerage)</option>
                    <option value="GL-4200-ICT-CONN">GL-4200-ICT-CONN (ICT Network Trunk Services)</option>
                    <option value="GL-4300-PROP-ASSESS">GL-4300-PROP-ASSESS (Commercial Rates & Land)</option>
                    <option value="GL-5100-PUBLIC-HLTH">GL-5100-PUBLIC-HLTH (Health & Emergency Telematics)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">3rd-Party Settlement Gateway</label>
                  <select class="form-control" id="inv-gateway">
                    <option value="Apex Commercial Bank Host-to-Host">Apex Commercial Bank Host-to-Host (ISO20022)</option>
                    <option value="Atlantic Corporate Bank ISO20022">Atlantic Corporate Bank ISO20022 EFT</option>
                    <option value="Sterling Enterprise Bank Real-time EFT">Sterling Enterprise Bank Real-time EFT</option>
                    <option value="Municipal SmartPay Gateway">Municipal SmartPay Gateway</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Line Item Description</label>
                  <input type="text" class="form-control" id="inv-desc" placeholder="e.g. Q4 Municipal Data Ingestion" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Quantity</label>
                  <input type="number" class="form-control" id="inv-qty" value="1" min="1" required />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Unit Rate (N$ excl. VAT)</label>
                <input type="number" step="0.01" class="form-control" id="inv-rate" placeholder="e.g. 45000.00" required />
              </div>

              <!-- Computed Preview -->
              <div style="background:rgba(15, 23, 42, 0.7); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:14px; margin-top:8px;">
                <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted); margin-bottom:4px;">
                  <span>Subtotal:</span>
                  <span id="preview-subtotal" style="font-family:var(--font-mono); color:#FFF;">N$ 0.00</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted); margin-bottom:4px;">
                  <span>Namibian VAT (15%):</span>
                  <span id="preview-vat" style="font-family:var(--font-mono); color:var(--cyan-accent);">N$ 0.00</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.95rem; font-weight:700; color:#FFF; border-top:1px solid rgba(255, 255, 255, 0.08); padding-top:6px;">
                  <span>Total Due (NAD):</span>
                  <span id="preview-total" style="font-family:var(--font-mono); color:var(--emerald-success);">N$ 0.00</span>
                </div>
              </div>

              <div class="modal-footer" style="padding:16px 0 0 0;">
                <button type="button" class="btn btn-outline" id="btn-cancel-modal">Cancel</button>
                <button type="submit" class="btn btn-primary">Submit to ERP Bus</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Invoice Detail Slip Modal -->
      <div class="modal-overlay" id="view-invoice-modal">
        <div class="modal-content" style="max-width: 720px;">
          <div class="modal-header">
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="logo-icon" style="width:28px; height:28px; font-size:0.8rem;">NX</span>
              <h3 class="modal-title" id="view-modal-title">ERP Invoice Details</h3>
            </div>
            <button class="modal-close" id="view-modal-close-btn">&times;</button>
          </div>
          <div class="modal-body" id="view-modal-body">
            <!-- Dynamic invoice bill format -->
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" onclick="window.print()">🖨 Print Invoice Slip</button>
            <button class="btn btn-cyan" id="btn-transition-status">Transition Status</button>
          </div>
        </div>
      </div>
    `;

    this.renderTableRows();
    this.bindEvents();
  },

  renderTableRows() {
    const tbody = document.getElementById('invoices-table-body');
    if (!tbody) return;

    const state = window.appState.getState();
    let filtered = state.invoices;

    if (this.currentFilter !== 'ALL') {
      filtered = filtered.filter(i => i.status === this.currentFilter);
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(i => 
        i.id.toLowerCase().includes(q) ||
        i.customer.toLowerCase().includes(q) ||
        i.accountNo.toLowerCase().includes(q) ||
        i.glCode.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align:center; padding:32px; color:var(--text-muted);">
            No enterprise invoices found matching your filter.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(inv => {
      let badgeClass = 'badge-draft';
      if (inv.status === 'Cleared') badgeClass = 'badge-cleared';
      else if (inv.status === 'Processing') badgeClass = 'badge-processing';
      else if (inv.status === 'Awaiting_Approval') badgeClass = 'badge-awaiting';

      return `
        <tr>
          <td class="cell-mono">${inv.id}</td>
          <td>
            <div style="font-weight:600; color:#FFF;">${inv.customer}</div>
            <div style="font-size:0.72rem; color:var(--text-dim);">${inv.accountNo}</div>
          </td>
          <td><span class="badge" style="background:rgba(255,255,255,0.05); color:#93C5FD;">${inv.glCode}</span></td>
          <td style="font-size:0.75rem;">
            <div>Issued: ${inv.date}</div>
            <div style="color:var(--text-dim);">Due: ${inv.dueDate}</div>
          </td>
          <td class="cell-mono">N$ ${inv.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
          <td class="cell-mono" style="color:var(--cyan-accent);">N$ ${inv.vat.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
          <td class="cell-amount">N$ ${inv.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
          <td style="font-size:0.78rem; color:var(--text-muted);">${inv.gateway}</td>
          <td><span class="badge ${badgeClass}">${inv.status.replace('_', ' ')}</span></td>
          <td>
            <button class="btn btn-outline btn-sm view-inv-btn" data-id="${inv.id}">View Slip</button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach click listeners for View Slip
    tbody.querySelectorAll('.view-inv-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openInvoiceSlip(btn.getAttribute('data-id'));
      });
    });
  },

  openInvoiceSlip(id) {
    const inv = window.appState.getState().invoices.find(i => i.id === id);
    if (!inv) return;

    const modal = document.getElementById('view-invoice-modal');
    const titleEl = document.getElementById('view-modal-title');
    const bodyEl = document.getElementById('view-modal-body');
    const transBtn = document.getElementById('btn-transition-status');

    titleEl.textContent = `Invoice Slip: ${inv.id}`;

    bodyEl.innerHTML = `
      <div style="background:#080C14; border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:24px; font-family:var(--font-sans);">
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-subtle); padding-bottom:16px;">
          <div>
            <h4 style="font-family:var(--font-display); font-size:1.15rem; color:#FFF;">NEXUS-ERP MUNICIPAL BILLING</h4>
            <div style="font-size:0.72rem; color:var(--text-dim);">City of Windhoek ICT Enterprise Node</div>
            <div style="font-size:0.72rem; color:var(--text-dim);">Tax / VAT ID: NAM-VAT-0600818-WNK</div>
          </div>
          <div style="text-align:right;">
            <div style="font-family:var(--font-mono); font-size:1.1rem; color:var(--cyan-accent); font-weight:700;">${inv.id}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Issue Date: ${inv.date}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Due Date: ${inv.dueDate}</div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin:20px 0; font-size:0.8rem;">
          <div>
            <div style="color:var(--text-dim); text-transform:uppercase; font-size:0.7rem; font-weight:700;">Billed Debtor:</div>
            <div style="font-size:0.95rem; font-weight:600; color:#FFF; margin-top:2px;">${inv.customer}</div>
            <div style="color:var(--text-muted); font-family:var(--font-mono);">${inv.accountNo}</div>
          </div>
          <div>
            <div style="color:var(--text-dim); text-transform:uppercase; font-size:0.7rem; font-weight:700;">Settlement Channel:</div>
            <div style="font-weight:600; color:var(--cyan-accent); margin-top:2px;">${inv.gateway}</div>
            <div style="color:var(--text-muted); font-family:var(--font-mono);">GL: ${inv.glCode}</div>
          </div>
        </div>

        <table style="width:100%; border-collapse:collapse; margin-bottom:16px; font-size:0.8rem;">
          <thead>
            <tr style="border-bottom:1px solid var(--border-subtle); color:var(--text-dim); text-align:left;">
              <th style="padding:8px 0;">Item Description</th>
              <th style="padding:8px 0; text-align:center;">Qty</th>
              <th style="padding:8px 0; text-align:right;">Rate (NAD)</th>
              <th style="padding:8px 0; text-align:right;">Amount (NAD)</th>
            </tr>
          </thead>
          <tbody>
            ${inv.items.map(it => `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                <td style="padding:10px 0; color:#FFF;">${it.desc}</td>
                <td style="padding:10px 0; text-align:center; color:var(--text-muted);">${it.qty}</td>
                <td style="padding:10px 0; text-align:right; font-family:var(--font-mono);">N$ ${it.rate.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td style="padding:10px 0; text-align:right; font-family:var(--font-mono); color:#FFF;">N$ ${(it.qty * it.rate).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="border-top:1px solid var(--border-subtle); padding-top:12px; display:flex; flex-direction:column; gap:4px; font-size:0.82rem;">
          <div style="display:flex; justify-content:space-between; color:var(--text-muted);">
            <span>Subtotal:</span>
            <span style="font-family:var(--font-mono);">N$ ${inv.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          <div style="display:flex; justify-content:space-between; color:var(--text-muted);">
            <span>Namibian VAT (15%):</span>
            <span style="font-family:var(--font-mono); color:var(--cyan-accent);">N$ ${inv.vat.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:1.1rem; font-weight:700; color:#FFF; border-top:1px solid rgba(255,255,255,0.1); padding-top:8px; margin-top:4px;">
            <span>Total Payable:</span>
            <span style="font-family:var(--font-mono); color:var(--emerald-success);">N$ ${inv.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
        </div>

        <div style="margin-top:18px; padding:10px 14px; background:rgba(255,255,255,0.03); border-radius:var(--radius-sm); font-size:0.75rem; color:var(--text-dim); display:flex; justify-content:space-between; align-items:center;">
          <span>Status: <strong>${inv.status}</strong></span>
          <span style="font-family:var(--font-mono);">Audit Hash: SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
        </div>
      </div>
    `;

    // Setup transition status button
    transBtn.onclick = () => {
      let nextStatus = 'Cleared';
      if (inv.status === 'Draft') nextStatus = 'Awaiting_Approval';
      else if (inv.status === 'Awaiting_Approval') nextStatus = 'Processing';
      else if (inv.status === 'Processing') nextStatus = 'Cleared';
      else if (inv.status === 'Cleared') nextStatus = 'Draft';

      window.appState.updateInvoiceStatus(inv.id, nextStatus);
      window.Notifications.show(`Invoice ${inv.id} transitioned to ${nextStatus}`, 'success');
      modal.classList.remove('active');
      this.renderTableRows();
    };

    modal.classList.add('active');

    document.getElementById('view-modal-close-btn').onclick = () => {
      modal.classList.remove('active');
    };
  },

  bindEvents() {
    // Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.getAttribute('data-filter');
        this.renderTableRows();
      });
    });

    // Search Input
    const searchInput = document.getElementById('invoice-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderTableRows();
      });
    }

    // Modal Opening & Closing
    const modal = document.getElementById('create-invoice-modal');
    const openBtn = document.getElementById('btn-create-invoice-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const cancelBtn = document.getElementById('btn-cancel-modal');

    if (openBtn) openBtn.onclick = () => modal.classList.add('active');
    if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');
    if (cancelBtn) cancelBtn.onclick = () => modal.classList.remove('active');

    // Live calculation in create modal
    const rateInput = document.getElementById('inv-rate');
    const qtyInput = document.getElementById('inv-qty');
    const updatePreview = () => {
      const rate = parseFloat(rateInput.value) || 0;
      const qty = parseInt(qtyInput.value) || 1;
      const subtotal = rate * qty;
      const vat = subtotal * 0.15;
      const total = subtotal + vat;

      document.getElementById('preview-subtotal').textContent = `N$ ${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
      document.getElementById('preview-vat').textContent = `N$ ${vat.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
      document.getElementById('preview-total').textContent = `N$ ${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    };

    if (rateInput) rateInput.addEventListener('input', updatePreview);
    if (qtyInput) qtyInput.addEventListener('input', updatePreview);

    // Form Submission
    const form = document.getElementById('new-invoice-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const customer = document.getElementById('inv-customer').value;
        const account = document.getElementById('inv-account').value;
        const glCode = document.getElementById('inv-glcode').value;
        const gateway = document.getElementById('inv-gateway').value;
        const desc = document.getElementById('inv-desc').value;
        const qty = parseInt(qtyInput.value) || 1;
        const rate = parseFloat(rateInput.value) || 0;

        const amount = qty * rate;
        const vat = amount * 0.15;
        const total = amount + vat;

        const newInv = {
          id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          customer,
          accountNo: account,
          amount,
          vat,
          total,
          date: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
          status: 'Processing',
          glCode,
          gateway,
          items: [{ desc, qty, rate }]
        };

        window.appState.addInvoice(newInv);
        modal.classList.remove('active');
        form.reset();
        updatePreview();
        this.renderTableRows();
        window.Notifications.show(`Invoice ${newInv.id} created and dispatched to ${gateway}`, 'success');
      });
    }

    // Export Invoices
    const exportBtn = document.getElementById('btn-export-invoices');
    if (exportBtn) {
      exportBtn.onclick = () => {
        const state = window.appState.getState();
        const blob = new Blob([JSON.stringify(state.invoices, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Windhoek_ERP_Invoices_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.Notifications.show('Exported enterprise invoice ledger batch', 'info');
      };
    }
  }
};

window.InvoicesModule = InvoicesModule;
