const E = React.createElement;
const N = (v) => Number(v || 0).toLocaleString('en-CA');
const MONEY = (v) => Number(v || 0).toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const FIX = (v, d = 1) => Number(v || 0).toFixed(d);
const PCT = (v, d = 1) => (100 * Number(v || 0)).toFixed(d) + '%';
const scorePct = (v) => PCT(v, 1);
const STATUS = { unreviewed: 'Unreviewed', investigating: 'Investigating', escalated: 'Escalated', cleared: 'Cleared' };
const NAV = [['overview', 'Overview', 'dashboard'], ['explorer', 'Transactions', 'list'], ['alerts', 'Alert investigation', 'shield'], ['insights', 'Analytics & insights', 'chart'], ['models', 'Model decision lab', 'activity'], ['quality', 'Data & documentation', 'layers']];
const ICON = {
    dashboard: React.createElement("g", null,
        React.createElement("rect", { x: "3", y: "3", width: "7", height: "9", rx: "1.4" }),
        React.createElement("rect", { x: "14", y: "3", width: "7", height: "5", rx: "1.4" }),
        React.createElement("rect", { x: "14", y: "12", width: "7", height: "9", rx: "1.4" }),
        React.createElement("rect", { x: "3", y: "16", width: "7", height: "5", rx: "1.4" })),
    list: React.createElement("g", null,
        React.createElement("path", { d: "M8 6h13M8 12h13M8 18h13" }),
        React.createElement("path", { d: "M3.5 6h.01M3.5 12h.01M3.5 18h.01" })),
    shield: React.createElement("g", null,
        React.createElement("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" }),
        React.createElement("path", { d: "m9 12 2 2 4-4" })),
    chart: React.createElement("g", null,
        React.createElement("path", { d: "M3 3v18h18" }),
        React.createElement("path", { d: "m6 15 5-5 4 3 5-8" })),
    activity: React.createElement("g", null,
        React.createElement("path", { d: "M3 12h4l3-8 4 16 3-8h4" })),
    layers: React.createElement("g", null,
        React.createElement("path", { d: "m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5" })),
    chevron: React.createElement("path", { d: "m9 18 6-6-6-6" }), search: React.createElement("g", null,
        React.createElement("circle", { cx: "11", cy: "11", r: "7" }),
        React.createElement("path", { d: "m20 20-4-4" })),
    download: React.createElement("g", null,
        React.createElement("path", { d: "M12 3v12m-5-5 5 5 5-5" }),
        React.createElement("path", { d: "M4 17v4h16v-4" })),
    arrow: React.createElement("g", null,
        React.createElement("path", { d: "M5 12h14m-7-7 7 7-7 7" })),
    settings: React.createElement("g", null,
        React.createElement("circle", { cx: "12", cy: "12", r: "3" }),
        React.createElement("path", { d: "M4 12H2m20 0h-2M12 4V2m0 20v-2M6.3 6.3 5 5m14 14-1.3-1.3m0-11.4L19 5M5 19l1.3-1.3" })),
    check: React.createElement("path", { d: "m4 12 5 5L20 6" }), alert: React.createElement("g", null,
        React.createElement("path", { d: "m12 3 10 18H2L12 3Z" }),
        React.createElement("path", { d: "M12 9v4m0 4h.01" })),
    close: React.createElement("path", { d: "M5 5l14 14M19 5 5 19" }), external: React.createElement("g", null,
        React.createElement("path", { d: "M14 3h7v7m0-7L10 14" }),
        React.createElement("path", { d: "M20 14v7H3V4h7" })),
    calendar: React.createElement("g", null,
        React.createElement("rect", { x: "3", y: "5", width: "18", height: "16", rx: "2" }),
        React.createElement("path", { d: "M7 3v4m10-4v4M3 10h18" })),
    target: React.createElement("g", null,
        React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
        React.createElement("circle", { cx: "12", cy: "12", r: "5" }),
        React.createElement("circle", { cx: "12", cy: "12", r: "1" })),
    filter: React.createElement("g", null,
        React.createElement("path", { d: "M4 7h16M7 12h10m-7 5h4" })),
    menu: React.createElement("path", { d: "M3 6h18M3 12h18M3 18h18" }),
    info: React.createElement("g", null,
        React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
        React.createElement("path", { d: "M12 11v6m0-10h.01" })),
    database: React.createElement("g", null,
        React.createElement("ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }),
        React.createElement("path", { d: "M3 5v14c0 4 18 4 18 0V5M3 12c0 4 18 4 18 0" })),
    refresh: React.createElement("g", null,
        React.createElement("path", { d: "M21 12a9 9 0 0 0-15-6L3 9" }),
        React.createElement("path", { d: "M3 3v6h6M3 12a9 9 0 0 0 15 6l3-3m0 6v-6h-6" }))
};
function Icon({ name, size = 18 }) { return React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, ICON[name] || ICON.dashboard); }
function Chip({ children, tone = 'neutral' }) { return React.createElement("span", { className: 'chip ' + tone }, children); }
function Panel({ title, sub, children, action, className = '' }) { return React.createElement("section", { className: 'panel ' + className },
    React.createElement("div", { className: "panel-head" },
        React.createElement("div", null,
            React.createElement("h3", null, title),
            sub && React.createElement("p", null, sub)),
        action),
    React.createElement("div", { className: "panel-body" }, children)); }
function Metric({ label, value, detail, icon = 'activity', tone = 'teal' }) { return React.createElement("div", { className: "metric" },
    React.createElement("div", { className: "metric-top" },
        React.createElement("span", null, label),
        React.createElement("div", { className: 'metric-icon ' + tone },
            React.createElement(Icon, { name: icon, size: 17 }))),
    React.createElement("div", { className: "metric-value" }, value),
    React.createElement("div", { className: "metric-detail" }, detail)); }
function Banner({ tone = 'info', children }) { return React.createElement("div", { className: 'banner ' + tone },
    React.createElement(Icon, { name: tone === 'warning' ? 'alert' : 'info', size: 17 }),
    React.createElement("div", null, children)); }
function Empty({ text }) { return React.createElement("div", { className: "empty" },
    React.createElement(Icon, { name: "database", size: 30 }),
    React.createElement("p", null, text)); }
function HBars({ rows, max, format }) { let m = max || Math.max(1, ...rows.map((x) => x.value)); return React.createElement("div", { className: "bar-list" }, rows.map((x, i) => React.createElement("div", { className: "bar-item", key: i },
    React.createElement("div", { className: "bar-top" },
        React.createElement("span", null, x.label),
        React.createElement("strong", null, format ? format(x.value) : N(x.value))),
    React.createElement("div", { className: "bar-track" },
        React.createElement("div", { className: 'bar-fill ' + (x.tone || 'teal'), style: { width: Math.max(1, (x.value / m) * 100) + '%' } }))))); }
function AreaPlot({ series, labels, minY = 0, maxY = 1, percent = true }) {
    const W = 680, H = 220, pl = 43, pr = 14, pt = 14, pb = 31;
    let ys = series.flatMap((s) => s.points.map((p) => p.y));
    let high = maxY === null ? Math.max(...ys, 1) : maxY;
    const x = (v) => pl + v * (W - pl - pr), y = (v) => pt + (high - v) / (high - minY || 1) * (H - pt - pb);
    return React.createElement("div", { className: "plot" },
        React.createElement("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": labels?.join(', ') || 'Analytical line chart' },
            [0, .25, .5, .75, 1].map((t, i) => React.createElement("g", { key: i },
                React.createElement("line", { x1: pl, x2: W - pr, y1: y(t * high), y2: y(t * high), stroke: "#26384c", strokeDasharray: "4 6" }),
                React.createElement("text", { x: pl - 9, y: y(t * high) + 4, textAnchor: "end", fill: "#869ab0", fontSize: "11" }, percent ? (100 * t * high).toFixed(0) + '%' : (t * high).toFixed(0)))),
            series.map((s, i) => React.createElement("polyline", { key: i, fill: "none", stroke: s.color, strokeWidth: "2.8", strokeLinejoin: "round", strokeLinecap: "round", points: s.points.map((p) => `${x(p.x).toFixed(1)},${y(p.y).toFixed(1)}`).join(' ') },
                React.createElement("title", null, s.name))),
            [0, .25, .5, .75, 1].map((v, i) => React.createElement("text", { key: i, x: x(v), y: H - 9, textAnchor: "middle", fill: "#869ab0", fontSize: "11" },
                (100 * v).toFixed(0),
                percent ? '%' : ''))),
        React.createElement("div", { className: "chart-legend" }, series.map((s) => React.createElement("span", { key: s.name },
            React.createElement("i", { style: { background: s.color } }),
            s.name))));
}
function ColumnChart({ rows }) { let max = Math.max(1, ...rows.map((x) => Math.max(x.total - x.labelled_fraud, x.labelled_fraud))); return React.createElement("div", { className: "columns" },
    React.createElement("div", { className: "columns-plot" }, rows.map((v, i) => React.createElement("div", { className: "column-pair", key: i, title: `${v.band}: ${N(v.total)} records; ${N(v.labelled_fraud)} fraud-labelled` },
        React.createElement("div", { className: "column-bars" },
            React.createElement("div", { className: "column blue", style: { height: Math.max(1, ((v.total - v.labelled_fraud) / max) * 100) + '%' } }),
            React.createElement("div", { className: "column mint", style: { height: Math.max(1, (v.labelled_fraud / max) * 100) + '%' } })),
        React.createElement("span", null, v.band)))),
    React.createElement("div", { className: "chart-legend" },
        React.createElement("span", null,
            React.createElement("i", { style: { background: '#567dbb' } }),
            "Legitimate"),
        React.createElement("span", null,
            React.createElement("i", { style: { background: '#3cc6a7' } }),
            "Fraud labelled"))); }
function Confusion({ m }) { if (!m)
    return null; return React.createElement("div", { className: "confusion" },
    React.createElement("div", { className: "matrix-label" }, "Predicted legitimate"),
    React.createElement("div", { className: "matrix-label" }, "Predicted flagged"),
    React.createElement("div", { className: "matrix-cell green" },
        React.createElement("b", null, N(m.tn)),
        React.createElement("span", null, "True negative")),
    React.createElement("div", { className: "matrix-cell amber" },
        React.createElement("b", null, N(m.fp)),
        React.createElement("span", null, "False alarm")),
    React.createElement("div", { className: "matrix-cell amber" },
        React.createElement("b", null, N(m.fn)),
        React.createElement("span", null, "Missed fraud")),
    React.createElement("div", { className: "matrix-cell green" },
        React.createElement("b", null, N(m.tp)),
        React.createElement("span", null, "Correctly flagged")),
    React.createElement("div", { className: "matrix-footer" }, "Rows: actual legitimate / actual fraud \u00B7 columns: prediction")); }
function Param({ label, value, min, max, step, onChange, display, desc }) { return React.createElement("label", { className: "param" },
    React.createElement("div", { className: "param-head" },
        React.createElement("span", null, label),
        React.createElement("strong", null, display || value)),
    React.createElement("input", { type: "range", min: min, max: max, step: step, value: value, onChange: (e) => onChange(Number(e.target.value)) }),
    desc && React.createElement("small", null, desc)); }
function Table({ rows, onDetail }) { if (!rows || rows.length === 0)
    return React.createElement(Empty, { text: "No records match those filters. Try broadening your criteria." }); return React.createElement("div", { className: "table-wrap" },
    React.createElement("table", null,
        React.createElement("thead", null,
            React.createElement("tr", null,
                React.createElement("th", null, "Transaction ID"),
                React.createElement("th", null, "Amount"),
                React.createElement("th", null, "Known label"),
                React.createElement("th", null, "Model risk"),
                React.createElement("th", null, "Dataset split"),
                React.createElement("th", null, "Review status"),
                React.createElement("th", null))),
        React.createElement("tbody", null, rows.map((r) => React.createElement("tr", { key: r.id, onClick: () => onDetail(r.id), tabIndex: 0, onKeyDown: (e) => e.key === 'Enter' && onDetail(r.id), "aria-label": `Open transaction ${r.id}` },
            React.createElement("td", { className: "mono strong" },
                "TX-",
                r.id.toString().padStart(6, '0')),
            React.createElement("td", { className: "medium" }, MONEY(r.amount)),
            React.createElement("td", null, r.label === 1 ? React.createElement(Chip, { tone: "red" }, "Fraud label") : React.createElement(Chip, { tone: "neutral" }, "Legitimate")),
            React.createElement("td", null,
                React.createElement("div", { className: "risk-value" },
                    React.createElement("div", { className: 'risk-dot ' + (r.risk_score >= .8 ? 'high' : r.risk_score >= .3 ? 'medium' : 'low') }),
                    React.createElement("b", null, scorePct(r.risk_score)))),
            React.createElement("td", { className: "subtle" }, r.partition),
            React.createElement("td", null,
                React.createElement(Chip, { tone: r.review_status === 'escalated' ? 'red' : r.review_status === 'cleared' ? 'teal' : 'neutral' }, STATUS[r.review_status])),
            React.createElement("td", { className: "arrowcell" },
                React.createElement(Icon, { name: "chevron", size: 16 }))))))); }
class App extends React.Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.toast = (v) => { this.setState({ toast: v }); if (this.timer)
            clearTimeout(this.timer); this.timer = setTimeout(() => this.setState({ toast: '' }), 4500); };
        this.setRoute = (route) => { this.setState({ route, menuOpen: false, page: 1, error: '' }, () => { if (route === 'explorer' || route === 'alerts')
            this.fetchList(); window.scrollTo(0, 0); }); };
        this.changeThreshold = (threshold) => { this.setState({ threshold }, () => { this.refreshThreshold(); if (this.state.route === 'alerts')
            this.fetchList(); }); };
        this.scenario = (key, val) => this.setState({ [key]: val }, () => this.refreshThreshold());
        this.setFilter = (key, val) => this.setState((s) => ({ filter: { ...s.filter, [key]: val }, page: 1 }), () => this.fetchList());
        this.clearFilters = () => this.setState({ filter: { q: '', label: '', min_amount: '', max_amount: '', risk_min: '', risk_max: '', status: '', sort: 'risk_score', direction: 'desc', partition: '' }, page: 1 }, () => this.fetchList());
        this.changePage = (page) => { this.setState({ page }, () => this.fetchList()); };
        this.download = () => { window.location.href = this.filterUrl(true); };
        this.state = { route: 'overview', overview: null, insights: null, models: null, quality: null, decision: null, list: null, loading: true, error: '', toast: '', threshold: .5, filter: { q: '', label: '', min_amount: '', max_amount: '', risk_min: '', risk_max: '', status: '', sort: 'risk_score', direction: 'desc', partition: '' }, page: 1, selected: null, selectedLoading: false, reviewStatus: 'unreviewed', note: '', saving: false, prevalence: 1, reviewCost: 2, missedCost: 150, menuOpen: false };
    }
    componentDidMount() { this.bootstrap(); }
    componentWillUnmount() { if (this.timer)
        clearTimeout(this.timer); }
    async get(url, options = {}) { let r = await fetch(url, options); if (!r.ok) {
        let err = {};
        try {
            err = await r.json();
        }
        catch { }
        throw new Error(typeof err.detail === 'string' ? err.detail : `Request failed (${r.status})`);
    } return r.json(); }
    async bootstrap() { try {
        const [overview, insights, models, quality, decision] = await Promise.all(['/api/overview', '/api/insights', '/api/models', '/api/quality', '/api/decision'].map(x => this.get(x)));
        this.setState({ overview, insights, models, quality, decision, loading: false });
        await this.fetchList();
    }
    catch (e) {
        this.setState({ error: e.message, loading: false });
    } }
    async refreshThreshold() { let t = this.state.threshold; try {
        let [overview, decision] = await Promise.all([this.get('/api/overview?threshold=' + t), this.get(this.decisionUrl())]);
        if (this.state.threshold === t)
            this.setState({ overview, decision });
    }
    catch (e) {
        this.toast(e.message);
    } }
    decisionUrl() { let s = this.state; return `/api/decision?threshold=${s.threshold}&prevalence=${s.prevalence / 100}&review_cost=${s.reviewCost}&missed_cost=${s.missedCost}`; }
    filterUrl(exporting = false) { let s = this.state, f = s.filter, p = new URLSearchParams(); Object.keys(f).forEach(k => { if (f[k] !== '' && f[k] != null && (!exporting || !['sort', 'direction'].includes(k)))
        p.set(k, String(f[k])); }); if (s.route === 'alerts')
        p.set('threshold', String(s.threshold)); if (!exporting) {
        p.set('page', String(s.page));
        p.set('page_size', '12');
    } return '/api/transactions' + (exporting ? '/export' : '') + '?' + p.toString(); }
    async fetchList() { try {
        let url = this.filterUrl();
        let list = await this.get(url);
        this.setState({ list });
    }
    catch (e) {
        this.setState({ error: e.message });
    } }
    async openDetail(id) { this.setState({ selectedLoading: true, selected: null }); try {
        let d = await this.get('/api/transactions/' + id);
        this.setState({ selected: d, selectedLoading: false, reviewStatus: d.transaction.review_status, note: d.transaction.note || '' });
    }
    catch (e) {
        this.setState({ selectedLoading: false });
        this.toast(e.message);
    } }
    async saveReview() { let s = this.state; if (!s.selected)
        return; this.setState({ saving: true }); try {
        await this.get(`/api/reviews/${s.selected.transaction.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: s.reviewStatus, note: s.note }) });
        this.toast('Simulated review saved locally');
        await this.openDetail(s.selected.transaction.id);
        await this.fetchList();
    }
    catch (e) {
        this.toast(e.message);
    }
    finally {
        this.setState({ saving: false });
    } }
    shellHead(label, heading, description, extra = null) { return React.createElement("div", { className: "page-heading" },
        React.createElement("div", null,
            React.createElement("div", { className: "eyebrow" }, label),
            React.createElement("h1", null, heading),
            React.createElement("p", null, description)),
        extra && React.createElement("div", { className: "heading-actions" }, extra)); }
    thresholdControl() { return React.createElement("div", { className: "threshold-card" },
        React.createElement("div", { className: "threshold-title" },
            React.createElement("span", null, "Detection threshold"),
            React.createElement("b", null, PCT(this.state.threshold, 0))),
        React.createElement("input", { "aria-label": "Detection threshold", type: "range", min: "0.05", max: "0.95", step: "0.05", value: this.state.threshold, onChange: (e) => this.changeThreshold(Number(e.target.value)) }),
        React.createElement("div", { className: "threshold-ends" },
            React.createElement("span", null, "More alerts \u00B7 higher recall"),
            React.createElement("span", null, "Fewer alerts \u00B7 higher precision"))); }
    renderOverview() {
        let d = this.state.overview, i = this.state.insights;
        if (!d || !i)
            return null;
        let m = d.model.heldout;
        return React.createElement("div", { className: "page-animate" },
            this.shellHead('EXECUTIVE INTELLIGENCE', 'Fraud risk, made actionable.', 'A unified view of transaction quality, detection performance, and analyst workload.', React.createElement("button", { className: "btn secondary", onClick: () => this.setRoute('models') },
                React.createElement(Icon, { name: "activity" }),
                " Open decision lab ",
                React.createElement(Icon, { name: "arrow", size: 15 }))),
            React.createElement(Banner, null,
                React.createElement("b", null, "Research dataset, not live banking activity."),
                " Exactly 50% of records have a fraud label by design. No event dates, customers, or merchants are provided."),
            React.createElement("div", { className: "metrics four" },
                React.createElement(Metric, { label: "Transactions analyzed", value: N(d.dataset.total), detail: "Records in supplied CSV", icon: "database" }),
                React.createElement(Metric, { label: "Fraud-labelled share", value: PCT(d.dataset.fraud_rate), detail: N(d.dataset.labelled_fraud) + ' labelled records', icon: "shield", tone: "blue" }),
                React.createElement(Metric, { label: "Recorded amount", value: (d.dataset.total_amount / 1e9).toFixed(2) + 'B units', detail: "Dataset units; currency unspecified", icon: "chart", tone: "purple" }),
                React.createElement(Metric, { label: "Held-out model F1", value: PCT(m.f1), detail: N(m.sample_size) + ' independent test rows', icon: "target", tone: "gold" })),
            React.createElement("div", { className: "layout two-third" },
                React.createElement(Panel, { title: "Transaction amount by class", sub: "Compare amount bands; volume is not a historical trend.", action: React.createElement("span", { className: "subtle tiny" }, "568,630 records") },
                    React.createElement(ColumnChart, { rows: i.bands }),
                    React.createElement("div", { className: "panel-note" }, "Amounts are similar across classes. Amount alone is not a reliable fraud indicator in this dataset.")),
                React.createElement(Panel, { title: "Risk operations snapshot", sub: "Model scores shown alongside actual known labels." },
                    React.createElement("div", { className: "summary-list" },
                        React.createElement("div", null,
                            React.createElement("span", null,
                                "Alerted at ",
                                PCT(this.state.threshold, 0),
                                " threshold"),
                            React.createElement("strong", null, N(d.alerts.flagged))),
                        React.createElement("div", null,
                            React.createElement("span", null, "Labelled fraud among alerts"),
                            React.createElement("strong", null, N(d.alerts.true_positives))),
                        React.createElement("div", null,
                            React.createElement("span", null, "False alarms, all data*"),
                            React.createElement("strong", { className: "amber-text" }, N(d.alerts.false_positives))),
                        React.createElement("div", null,
                            React.createElement("span", null, "Dataset legitimate"),
                            React.createElement("strong", null, N(d.dataset.legitimate)))),
                    this.thresholdControl(),
                    React.createElement("p", { className: "micro" }, "*Full-data alert counts include training examples. Model quality uses held-out scores only."))),
            React.createElement("div", { className: "layout half" },
                React.createElement(Panel, { title: "Risk-score distribution", sub: "Number of records by model risk-score decile (full scored index)." },
                    React.createElement("div", { className: "risk-hist" }, d.risk_histogram.map((x) => React.createElement("div", { className: "risk-bar-wrap", key: x.bucket, title: `${x.bucket * 10}–${x.bucket * 10 + 10}%: ${N(x.transactions)} records` },
                        React.createElement("div", { className: "risk-bar", style: { height: Math.max(2, x.transactions / Math.max(...d.risk_histogram.map((q) => q.transactions)) * 100) + '%' } }),
                        React.createElement("span", null, x.bucket * 10)))),
                    React.createElement("div", { className: "hist-legend" },
                        React.createElement("span", null, "0% score"),
                        React.createElement("span", null, "Risk score (%)"),
                        React.createElement("span", null, "100% score"))),
                React.createElement(Panel, { title: "Detection scorecard", sub: "Selected model \u00B7 held-out test set, threshold 50%." },
                    React.createElement("div", { className: "score-grid" },
                        React.createElement("div", null,
                            React.createElement("b", null, PCT(m.precision)),
                            React.createElement("small", null, "Precision")),
                        React.createElement("div", null,
                            React.createElement("b", null, PCT(m.recall)),
                            React.createElement("small", null, "Recall")),
                        React.createElement("div", null,
                            React.createElement("b", null, PCT(m.roc_auc, 2)),
                            React.createElement("small", null, "ROC-AUC")),
                        React.createElement("div", null,
                            React.createElement("b", null, PCT(m.pr_auc, 2)),
                            React.createElement("small", null, "PR-AUC"))),
                    React.createElement("div", { className: "panel-note" }, "Strong held-out results are not evidence of performance on a real bank\u2019s naturally imbalanced transactions."),
                    React.createElement("button", { className: "link-action", onClick: () => this.setRoute('models') },
                        "Review evaluation methodology ",
                        React.createElement(Icon, { name: "arrow", size: 15 })))),
            React.createElement("div", { className: "section-footer" },
                "BUILT FOR EXPLAINABILITY ",
                React.createElement("span", null, "Every displayed figure is computed from the source dataset, derived scored index, or held-out model scores.")));
    }
    renderFilters() { let f = this.state.filter; return React.createElement("div", { className: "filter-box" },
        React.createElement("div", { className: "filter-grid" },
            React.createElement("label", null,
                React.createElement("span", null, "Transaction ID"),
                React.createElement("div", { className: "input-icon" },
                    React.createElement(Icon, { name: "search", size: 15 }),
                    React.createElement("input", { "aria-label": "Search transaction ID", placeholder: "Search by ID...", type: "text", inputMode: "numeric", value: f.q, onChange: (e) => this.setFilter('q', e.target.value) }))),
            React.createElement("label", null,
                React.createElement("span", null, "Known label"),
                React.createElement("select", { "aria-label": "Filter by class", value: f.label, onChange: (e) => this.setFilter('label', e.target.value) },
                    React.createElement("option", { value: "" }, "All labels"),
                    React.createElement("option", { value: "1" }, "Fraud labelled"),
                    React.createElement("option", { value: "0" }, "Legitimate"))),
            React.createElement("label", null,
                React.createElement("span", null, "Min amount"),
                React.createElement("input", { "aria-label": "Minimum amount", type: "number", min: "0", placeholder: "$0", value: f.min_amount, onChange: (e) => this.setFilter('min_amount', e.target.value) })),
            React.createElement("label", null,
                React.createElement("span", null, "Max amount"),
                React.createElement("input", { "aria-label": "Maximum amount", type: "number", min: "0", placeholder: "Any", value: f.max_amount, onChange: (e) => this.setFilter('max_amount', e.target.value) })),
            React.createElement("label", null,
                React.createElement("span", null, "Risk score min"),
                React.createElement("select", { "aria-label": "Minimum risk score", value: f.risk_min, onChange: (e) => this.setFilter('risk_min', e.target.value) },
                    React.createElement("option", { value: "" }, "Any risk"),
                    React.createElement("option", { value: "0.2" }, "20%+"),
                    React.createElement("option", { value: "0.5" }, "50%+"),
                    React.createElement("option", { value: "0.8" }, "80%+"),
                    React.createElement("option", { value: "0.95" }, "95%+"))),
            React.createElement("label", null,
                React.createElement("span", null, "Risk score max"),
                React.createElement("select", { "aria-label": "Maximum risk score", value: f.risk_max, onChange: (e) => this.setFilter('risk_max', e.target.value) },
                    React.createElement("option", { value: "" }, "Any risk"),
                    React.createElement("option", { value: "0.2" }, "20% or less"),
                    React.createElement("option", { value: "0.5" }, "50% or less"),
                    React.createElement("option", { value: "0.8" }, "80% or less"),
                    React.createElement("option", { value: "0.95" }, "95% or less"))),
            React.createElement("label", null,
                React.createElement("span", null, "Review status"),
                React.createElement("select", { "aria-label": "Filter by review status", value: f.status, onChange: (e) => this.setFilter('status', e.target.value) },
                    React.createElement("option", { value: "" }, "All statuses"),
                    Object.keys(STATUS).map((key) => React.createElement("option", { value: key, key: key }, STATUS[key])))),
            React.createElement("label", null,
                React.createElement("span", null, "Sort by"),
                React.createElement("select", { "aria-label": "Sort transactions", value: f.sort, onChange: (e) => this.setFilter('sort', e.target.value) },
                    React.createElement("option", { value: "risk_score" }, "Model risk"),
                    React.createElement("option", { value: "amount" }, "Amount"),
                    React.createElement("option", { value: "id" }, "Transaction ID"),
                    React.createElement("option", { value: "label" }, "Known label"),
                    React.createElement("option", { value: "review_status" }, "Review status"))),
            React.createElement("label", null,
                React.createElement("span", null, "Direction"),
                React.createElement("select", { "aria-label": "Sort direction", value: f.direction, onChange: (e) => this.setFilter('direction', e.target.value) },
                    React.createElement("option", { value: "desc" }, "High \u2192 low"),
                    React.createElement("option", { value: "asc" }, "Low \u2192 high"))),
            React.createElement("label", null,
                React.createElement("span", null, "Dataset split"),
                React.createElement("select", { "aria-label": "Filter partition", value: f.partition, onChange: (e) => this.setFilter('partition', e.target.value) },
                    React.createElement("option", { value: "" }, "All splits"),
                    React.createElement("option", { value: "test" }, "Test only"),
                    React.createElement("option", { value: "validation" }, "Validation only"),
                    React.createElement("option", { value: "train" }, "Training only")))),
        React.createElement("div", { className: "filter-actions" },
            React.createElement("span", null,
                React.createElement(Icon, { name: "filter", size: 15 }),
                " Server-side filtering \u00B7 no large browser downloads"),
            React.createElement("button", { className: "text-btn", onClick: this.clearFilters }, "Clear filters"))); }
    renderRecords(alerts = false) {
        let l = this.state.list;
        return React.createElement("div", { className: "page-animate" },
            this.shellHead(alerts ? 'FRAUD OPERATIONS' : 'TRANSACTION INTELLIGENCE', alerts ? 'Alert investigation queue' : 'Transaction explorer', alerts ? 'A simulated analyst workspace to inspect and document model-flagged records.' : 'Search, segment, and investigate the original dataset with server-side pagination.', React.createElement("button", { className: "btn secondary", onClick: this.download },
                React.createElement(Icon, { name: "download", size: 16 }),
                " Export filtered CSV")),
            alerts ? React.createElement(Banner, { tone: "warning" }, "Risk score \u2260 confirmed fraud. Analyst review statuses and notes are simulated and saved only in your local SQLite file.") : React.createElement(Banner, null, "Known labels come from Kaggle; model risk scores are generated predictions. These are different kinds of evidence."),
            alerts && React.createElement("div", { className: "alert-top" },
                React.createElement("div", null,
                    React.createElement("div", { className: "eyebrow" }, "ACTIVE MODEL ALERT FILTER"),
                    React.createElement("h3", null,
                        "Review queue \u00B7 ",
                        N(l?.total),
                        " records"),
                    React.createElement("p", null, "Prioritize higher model risk; record your simulated review decision below.")),
                this.thresholdControl()),
            this.renderFilters(),
            React.createElement(Panel, { title: alerts ? 'Flagged transactions' : 'Transaction records', sub: `${N(l?.total || 0)} matching rows · displaying ${N(l?.rows?.length || 0)} per page`, action: React.createElement(Chip, { tone: "teal" }, "LIVE SQL QUERY") },
                React.createElement(Table, { rows: l?.rows, onDetail: (id) => this.openDetail(id) }),
                React.createElement("div", { className: "pagination" },
                    React.createElement("span", null,
                        "Page ",
                        N(l?.page || 1),
                        " of ",
                        N(l?.pages || 1)),
                    React.createElement("div", null,
                        React.createElement("button", { disabled: !l || this.state.page <= 1, onClick: () => this.changePage(this.state.page - 1) }, "Previous"),
                        React.createElement("button", { disabled: !l || this.state.page >= l.pages, onClick: () => this.changePage(this.state.page + 1) },
                            "Next ",
                            React.createElement(Icon, { name: "chevron", size: 13 }))))),
            React.createElement("p", { className: "micro outside-note" }, "The stored risk-score index contains all 568,630 records; only held-out test cases support independent model evaluation."));
    }
    renderInsights() {
        let i = this.state.insights;
        if (!i)
            return null;
        let correlations = i.correlations.slice(0, 8);
        let hist = i.histograms;
        let max = Math.max(...hist['0'], ...hist['1']);
        let n = Math.max(hist['0'].length - 1, 1);
        let series = [{ name: 'Legitimate', color: '#638ac9', points: hist['0'].map((v, j) => ({ x: j / n, y: v / max })) }, { name: 'Fraud labelled', color: '#42c9ad', points: hist['1'].map((v, j) => ({ x: j / n, y: v / max })) }];
        return React.createElement("div", { className: "page-animate" },
            this.shellHead('DATA & BUSINESS INSIGHTS', 'Find signal in the noise.', 'A statistical view of class differences, transaction amounts, and anonymized predictors.'),
            React.createElement(Banner, null,
                "These are cross-sectional comparisons, ",
                React.createElement("b", null, "not time-series trends"),
                ". There are no transaction dates in the source."),
            React.createElement("div", { className: "metrics three" },
                React.createElement(Metric, { label: "Mean amount \u00B7 legitimate", value: MONEY(i.amount_stats['0'].mean), detail: "Recorded dataset amount", icon: "database", tone: "blue" }),
                React.createElement(Metric, { label: "Mean amount \u00B7 fraud", value: MONEY(i.amount_stats['1'].mean), detail: "Recorded dataset amount", icon: "chart" }),
                React.createElement(Metric, { label: "Difference in class means", value: MONEY(i.amount_stats['1'].mean - i.amount_stats['0'].mean), detail: "Association only \u00B7 not causal", icon: "target", tone: "purple" })),
            React.createElement("div", { className: "layout two-third" },
                React.createElement(Panel, { title: "Amount distributions by known class", sub: "Real 25-bin histograms; x-axis spans recorded amounts from 0 to 25,000." },
                    React.createElement(AreaPlot, { series: series, labels: ['Amount distributions'], maxY: 1, percent: false }),
                    React.createElement("div", { className: "panel-note" }, "Both labels span similar transaction amounts. Amount alone offers limited predictive separation in this dataset.")),
                React.createElement(Panel, { title: "Class composition by amount band", sub: "Labels are exactly balanced overall by dataset construction." },
                    React.createElement(HBars, { rows: i.bands.map((x) => ({ label: x.band, value: x.labelled_fraud / x.total, tone: 'teal' })), max: 1, format: (x) => PCT(x) }),
                    React.createElement("p", { className: "micro" }, "Shows share with label 1 within each amount band, not estimated real-world fraud probability."))),
            React.createElement("div", { className: "layout half" },
                React.createElement(Panel, { title: "Strongest feature-label correlations", sub: "Absolute ordering of Pearson correlations; signed values shown." },
                    React.createElement(HBars, { rows: correlations.map((x) => ({ label: x.feature, value: Math.abs(x.correlation), tone: x.correlation < 0 ? 'blue' : 'teal' })), max: 1, format: (x) => FIX(x, 3) }),
                    React.createElement("p", { className: "micro" }, "V1\u2013V28 are anonymized numerical coordinates; their business meaning is unknown.")),
                React.createElement(Panel, { title: "Selected model \u00B7 global importance", sub: i.importance_explanation },
                    React.createElement(HBars, { rows: i.importances.slice(0, 8).map((x) => ({ label: x.feature, value: x.value, tone: 'violet' })), format: (x) => PCT(x) }),
                    React.createElement("p", { className: "micro" }, "Permutation importance is a descriptive sensitivity metric. It is not a causal or transaction-level reason."))),
            React.createElement(Panel, { title: "How to interpret these findings", sub: "A focused business synthesis, not chart decoration." },
                React.createElement("div", { className: "insight-cards" },
                    React.createElement("div", null,
                        React.createElement("span", { className: "insight-number" }, "01"),
                        React.createElement("h4", null, "Fraud labels are balanced by design"),
                        React.createElement("p", null, "50% flagged labels create an unrealistic base rate. Compare model rates, then run hypothetical prevalence scenarios in the decision lab.")),
                    React.createElement("div", null,
                        React.createElement("span", { className: "insight-number" }, "02"),
                        React.createElement("h4", null, "Amount is weak on its own"),
                        React.createElement("p", null, "Class means are close; multivariate anonymized features contain much stronger label association than recorded transaction amount.")),
                    React.createElement("div", null,
                        React.createElement("span", { className: "insight-number" }, "03"),
                        React.createElement("h4", null, "Model scores need human interpretation"),
                        React.createElement("p", null, "High discrimination on held-out records does not establish live deployment readiness or tell us why a real customer transacted.")))));
    }
    renderModels() {
        let mod = this.state.models, d = this.state.decision;
        if (!mod || !d)
            return null;
        let m = d.metrics, s = d.scenario;
        return React.createElement("div", { className: "page-animate" },
            this.shellHead('RISK STRATEGY & MODELS', 'The decision lab.', 'Move the alert threshold and evaluate the operational consequences on held-out predictions.'),
            React.createElement(Banner, null,
                React.createElement("b", null, "Independent test evaluation:"),
                " All metrics on this page use ",
                N(m.tested),
                " held-out test rows. Business-cost simulations explicitly use assumptions."),
            React.createElement("div", { className: "decision-layout" },
                React.createElement("div", { className: "panel control-panel" },
                    React.createElement("div", { className: "panel-head" },
                        React.createElement("div", null,
                            React.createElement("h3", null, "Set your decision policy"),
                            React.createElement("p", null, "Live calculations using saved model probabilities.")),
                        React.createElement(Icon, { name: "settings", size: 20 })),
                    React.createElement("div", { className: "panel-body" },
                        this.thresholdControl(),
                        React.createElement("div", { className: "horizontal-rule" }),
                        React.createElement("div", { className: "eyebrow" }, "HYPOTHETICAL OPERATING ASSUMPTIONS"),
                        React.createElement(Param, { label: "Assumed fraud prevalence", min: .1, max: 10, step: .1, value: this.state.prevalence, display: FIX(this.state.prevalence, 1) + '%', onChange: (v) => this.scenario('prevalence', v) }),
                        React.createElement(Param, { label: "Analyst review cost", min: 0, max: 30, step: 1, value: this.state.reviewCost, display: MONEY(this.state.reviewCost), onChange: (v) => this.scenario('reviewCost', v) }),
                        React.createElement(Param, { label: "Cost per missed fraud case", min: 0, max: 1000, step: 25, value: this.state.missedCost, display: MONEY(this.state.missedCost), onChange: (v) => this.scenario('missedCost', v) }),
                        React.createElement("p", { className: "micro" }, "All costs are illustrative and have no specified currency. Volume fixed to 10,000 hypothetical transactions."))),
                React.createElement("div", { className: "decision-content" },
                    React.createElement("div", { className: "metrics three" },
                        React.createElement(Metric, { label: "Precision at threshold", value: PCT(m.precision), detail: "Flagged predictions that are label 1", icon: "target" }),
                        React.createElement(Metric, { label: "Recall at threshold", value: PCT(m.recall), detail: "Share of fraud labels detected", icon: "shield", tone: "blue" }),
                        React.createElement(Metric, { label: "False positive rate", value: PCT(m.fpr, 2), detail: N(m.fp) + ' false alarms · held-out', icon: "alert", tone: "gold" })),
                    React.createElement("div", { className: "layout half" },
                        React.createElement(Panel, { title: "Held-out confusion matrix", sub: "Counts change when you adjust the threshold." },
                            React.createElement(Confusion, { m: m })),
                        React.createElement(Panel, { title: "Assumption-based scenario", sub: "Estimated per 10,000 hypothetical transactions." },
                            React.createElement("div", { className: "summary-list" },
                                React.createElement("div", null,
                                    React.createElement("span", null, "Review queue volume"),
                                    React.createElement("strong", null, N(s.flagged.toFixed(0)))),
                                React.createElement("div", null,
                                    React.createElement("span", null, "False alarms"),
                                    React.createElement("strong", null, N(s.false_alarms.toFixed(0)))),
                                React.createElement("div", null,
                                    React.createElement("span", null, "Missed fraud cases"),
                                    React.createElement("strong", null, FIX(s.estimated_missed_fraud, 2))),
                                React.createElement("div", null,
                                    React.createElement("span", null, "Total hypothetical cost"),
                                    React.createElement("strong", null, MONEY(s.total_hypothetical_cost)))),
                            React.createElement("p", { className: "micro" }, "Estimated using test-set TPR/FPR and user-specified assumptions. No actual savings claimed."))))),
            React.createElement("div", { className: "layout half" },
                React.createElement(Panel, { title: "ROC curve", sub: "True positive rate versus false positive rate \u00B7 held-out predictions." },
                    React.createElement(AreaPlot, { series: [{ name: 'Model ROC', color: '#43ceae', points: mod.curves.roc }, { name: 'No skill', color: '#62748f', points: [{ x: 0, y: 0 }, { x: 1, y: 1 }] }], labels: ['ROC curve'], maxY: 1 })),
                React.createElement(Panel, { title: "Precision\u2013recall curve", sub: "Precision versus recall, evaluated on the artificially balanced test set." },
                    React.createElement(AreaPlot, { series: [{ name: 'Precision–recall', color: '#6a9be9', points: mod.curves.pr }], labels: ['Precision recall curve'], maxY: 1 }))),
            React.createElement(Panel, { title: "Model comparison", sub: "Pre-selected by validation average precision; table shows untouched test-set results at threshold 50%." },
                React.createElement("div", { className: "table-wrap" },
                    React.createElement("table", null,
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", null, "Algorithm"),
                                React.createElement("th", null, "Train rows"),
                                React.createElement("th", null, "F1"),
                                React.createElement("th", null, "Precision"),
                                React.createElement("th", null, "Recall"),
                                React.createElement("th", null, "ROC-AUC"),
                                React.createElement("th", null, "PR-AUC"),
                                React.createElement("th", null, "Selection"))),
                        React.createElement("tbody", null, Object.keys(mod.models).map((name) => React.createElement("tr", { key: name },
                            React.createElement("td", { className: "strong" }, name),
                            React.createElement("td", null, N(mod.models[name].train_rows)),
                            React.createElement("td", null, PCT(mod.models[name].test.f1)),
                            React.createElement("td", null, PCT(mod.models[name].test.precision)),
                            React.createElement("td", null, PCT(mod.models[name].test.recall)),
                            React.createElement("td", null, PCT(mod.models[name].test.roc_auc, 2)),
                            React.createElement("td", null, PCT(mod.models[name].test.pr_auc, 2)),
                            React.createElement("td", null, name === mod.selected ? React.createElement(Chip, { tone: "teal" }, "Selected") : React.createElement(Chip, null, "Baseline"))))))),
                React.createElement("div", { className: "panel-note" }, "No ID leakage. One duplicated feature vector excluded before splitting. Models selected with validation data, then independently tested. High metrics may reflect the source dataset's artificial generation process.")));
    }
    renderQuality() {
        let q = this.state.quality;
        if (!q)
            return null;
        let info = q.quality;
        return React.createElement("div", { className: "page-animate" },
            this.shellHead('DATA GOVERNANCE & DOCUMENTATION', 'Trust the process.', 'From schema validation to model provenance, every step is documented and reproducible.'),
            React.createElement("div", { className: "metrics four" },
                React.createElement(Metric, { label: "Data quality checks", value: q.checks.length + '/7', detail: "All declared checks executed", icon: "check" }),
                React.createElement(Metric, { label: "Missing cells", value: N(info.missing_cells), detail: "Original 31-column dataset", icon: "database", tone: "blue" }),
                React.createElement(Metric, { label: "Duplicate feature rows", value: N(info.duplicate_feature_vectors), detail: "1 record excluded from splits", icon: "layers", tone: "gold" }),
                React.createElement(Metric, { label: "Evaluation test records", value: N(info.split_counts.test), detail: "Held-out, never used for selection", icon: "target", tone: "purple" })),
            React.createElement("div", { className: "layout half" },
                React.createElement(Panel, { title: "Validation checks", sub: "Results from real CSV inspection and the processing pipeline." },
                    React.createElement("div", { className: "validation-list" }, q.checks.map((x) => React.createElement("div", { key: x.name },
                        React.createElement("div", { className: 'validation-icon ' + (x.passed ? 'pass' : 'fail') },
                            React.createElement(Icon, { name: x.passed ? 'check' : 'alert', size: 15 })),
                        React.createElement("div", null,
                            React.createElement("b", null, x.name),
                            x.detail && React.createElement("small", null, x.detail)),
                        React.createElement(Chip, { tone: x.passed ? 'teal' : 'red' }, x.passed ? 'PASS' : 'FAIL'))))),
                React.createElement(Panel, { title: "Data dictionary", sub: "Understanding the actual information available." },
                    React.createElement("div", { className: "dictionary" },
                        React.createElement("div", null,
                            React.createElement("code", null, "id"),
                            React.createElement("span", null, "Unique source record identifier; not a predictive feature.")),
                        React.createElement("div", null,
                            React.createElement("code", null, "V1 \u2026 V28"),
                            React.createElement("span", null, "Anonymized numeric features; their original meanings are unavailable.")),
                        React.createElement("div", null,
                            React.createElement("code", null, "Amount"),
                            React.createElement("span", null, "Recorded transaction amount; original currency unit not established.")),
                        React.createElement("div", null,
                            React.createElement("code", null, "Class"),
                            React.createElement("span", null, "Supplied label; 0 = legitimate, 1 = fraud.")),
                        React.createElement("div", null,
                            React.createElement("code", null, "risk_score"),
                            React.createElement("span", null, "Derived model probability; not a source column or established fraud finding.")),
                        React.createElement("div", null,
                            React.createElement("code", null, "review_status"),
                            React.createElement("span", null, "Simulated local analyst state, stored in a separate SQL table."))))),
            React.createElement("div", { className: "layout half" },
                React.createElement(Panel, { title: "Reproducible model approach", sub: "Honest separation of training, validation and test data." },
                    React.createElement("div", { className: "process-steps" },
                        React.createElement("div", null,
                            React.createElement("b", null, "01"),
                            React.createElement("span", null,
                                React.createElement("strong", null, "Validate and inspect"),
                                React.createElement("small", null, "568,630 records; schema, nulls, IDs and duplicate feature vectors."))),
                        React.createElement("div", null,
                            React.createElement("b", null, "02"),
                            React.createElement("span", null,
                                React.createElement("strong", null, "Stratify the data"),
                                React.createElement("small", null,
                                    N(info.split_counts.train),
                                    " train \u00B7 ",
                                    N(info.split_counts.validation),
                                    " validation \u00B7 ",
                                    N(info.split_counts.test),
                                    " test."))),
                        React.createElement("div", null,
                            React.createElement("b", null, "03"),
                            React.createElement("span", null,
                                React.createElement("strong", null, "Train competing models"),
                                React.createElement("small", null, "Logistic regression baseline vs. histogram gradient boosting."))),
                        React.createElement("div", null,
                            React.createElement("b", null, "04"),
                            React.createElement("span", null,
                                React.createElement("strong", null, "Select and evaluate"),
                                React.createElement("small", null, "Validation PR-AUC decides winner; held-out test gives final metrics."))))),
                React.createElement(Panel, { title: "Critical limitations", sub: "The most important caveats a risk stakeholder should see." },
                    React.createElement("div", { className: "limitation-list" },
                        React.createElement("p", null,
                            React.createElement(Icon, { name: "alert", size: 17 }),
                            "Artificial 50% fraud-labelled proportion; not representative of industry prevalence."),
                        React.createElement("p", null,
                            React.createElement(Icon, { name: "alert", size: 17 }),
                            "No true transaction timestamps, merchant, geography or customer attributes."),
                        React.createElement("p", null,
                            React.createElement(Icon, { name: "alert", size: 17 }),
                            "Origin and generation methodology of the rebalanced 2023 data are not fully independently documented."),
                        React.createElement("p", null,
                            React.createElement(Icon, { name: "alert", size: 17 }),
                            "High performance on this dataset cannot validate live banking effectiveness."),
                        React.createElement("p", null,
                            React.createElement(Icon, { name: "alert", size: 17 }),
                            "Individual investigation outcomes are simulated; no customer action is taken.")))),
            React.createElement(Panel, { title: "Project documentation", sub: "These files live in the downloaded repository's docs/ directory." },
                React.createElement("div", { className: "doc-grid" }, [['BRD.md', 'Business case & requirements', 'Stakeholders, stories, acceptance criteria, traceability'], ['ARCHITECTURE.md', 'System and SQL architecture', 'ER diagram, backend endpoints, deployment decisions'], ['METHODOLOGY.md', 'Analytical methodology', 'Source provenance, features, model evaluation'], ['TEST_PLAN.md', 'Verification & UAT', 'Automated checks, simulated workflows, execution honesty'], ['INTERVIEW_GUIDE.md', 'Recruiter discussion guide', '60-second pitch, defendable resume bullets'], ['BI_GUIDE.md', 'Power BI / Tableau guide', 'DAX measures, dashboard data model and refresh']].map((d) => React.createElement("div", { key: d[0] },
                    React.createElement(Icon, { name: "layers", size: 20 }),
                    React.createElement("div", null,
                        React.createElement("b", null, d[1]),
                        React.createElement("span", null, d[2]),
                        React.createElement("small", null,
                            "docs/",
                            d[0])))))));
    }
    detailDrawer() { let s = this.state; if (!s.selected && !s.selectedLoading)
        return null; let d = s.selected?.transaction; return React.createElement("div", { className: "drawer-backdrop", role: "presentation", onClick: () => this.setState({ selected: null, selectedLoading: false }) },
        React.createElement("aside", { className: "drawer", role: "dialog", "aria-modal": "true", "aria-label": "Transaction details", onClick: (e) => e.stopPropagation() },
            React.createElement("div", { className: "drawer-head" },
                React.createElement("div", null,
                    React.createElement("div", { className: "eyebrow" }, "INVESTIGATION DETAIL"),
                    React.createElement("h2", null, d ? `TX-${String(d.id).padStart(6, '0')}` : 'Loading transaction')),
                React.createElement("button", { className: "icon-btn", "aria-label": "Close details", onClick: () => this.setState({ selected: null, selectedLoading: false }) },
                    React.createElement(Icon, { name: "close" }))),
            d && React.createElement("div", { className: "drawer-scroll" },
                React.createElement("div", { className: "drawer-risk" },
                    React.createElement("div", { className: "eyebrow" }, "MODEL-ESTIMATED RISK"),
                    React.createElement("strong", null, scorePct(d.risk_score)),
                    React.createElement("div", { className: "risk-progress" },
                        React.createElement("span", { style: { width: scorePct(d.risk_score) } })),
                    React.createElement("small", null, "Not proof of a fraudulent act")),
                React.createElement("div", { className: "drawer-section" },
                    React.createElement("h4", null, "Record details"),
                    React.createElement("div", { className: "summary-list" },
                        React.createElement("div", null,
                            React.createElement("span", null, "Recorded amount"),
                            React.createElement("strong", null, MONEY(d.amount))),
                        React.createElement("div", null,
                            React.createElement("span", null, "Known dataset label"),
                            React.createElement("strong", null, d.label ? 'Fraud (1)' : 'Legitimate (0)')),
                        React.createElement("div", null,
                            React.createElement("span", null,
                                "Score threshold ",
                                PCT(s.threshold, 0)),
                            React.createElement("strong", null, d.risk_score >= s.threshold ? 'Flagged' : 'Not flagged')),
                        React.createElement("div", null,
                            React.createElement("span", null, "Dataset split"),
                            React.createElement("strong", null, d.partition)))),
                React.createElement("div", { className: "drawer-section" },
                    React.createElement("h4", null, "Simulated analyst review"),
                    React.createElement("label", { className: "field-label" },
                        "Review status",
                        React.createElement("select", { value: s.reviewStatus, onChange: (e) => this.setState({ reviewStatus: e.target.value }) }, Object.keys(STATUS).map((k) => React.createElement("option", { value: k, key: k }, STATUS[k])))),
                    React.createElement("label", { className: "field-label" },
                        "Investigation note",
                        React.createElement("textarea", { rows: 5, maxLength: 2000, placeholder: "Write a simulated investigation observation...", value: s.note, onChange: (e) => this.setState({ note: e.target.value }) })),
                    React.createElement("button", { className: "btn primary block", disabled: s.saving, onClick: () => this.saveReview() },
                        s.saving ? 'Saving…' : 'Save local review',
                        " ",
                        React.createElement(Icon, { name: "arrow", size: 15 }))),
                React.createElement("div", { className: "drawer-section" },
                    React.createElement("h4", null, "Interpretation limits"),
                    React.createElement("p", { className: "micro" }, "The scoring index intentionally excludes raw V1\u2013V28 vectors. Population-level feature importance is available in Analytics, but individual feature attribution is not supported here. Do not claim the model explains a customer\u2019s behaviour."))))); }
    render() {
        let s = this.state;
        if (s.loading)
            return React.createElement("div", { className: "startup" },
                React.createElement("div", { className: "brand-crest" },
                    React.createElement(Icon, { name: "shield", size: 26 })),
                React.createElement("h2", null, "Initializing FraudShield"),
                React.createElement("p", null, "Connecting to verified model results and SQLite analytics."),
                React.createElement("div", { className: "loading-line" }));
        if (s.error && !s.overview)
            return React.createElement("div", { className: "startup" },
                React.createElement("div", { className: "brand-crest" },
                    React.createElement(Icon, { name: "alert", size: 27 })),
                React.createElement("h2", null, "Couldn't load the dashboard"),
                React.createElement("p", null, s.error),
                React.createElement("button", { className: "btn primary", onClick: () => this.bootstrap() }, "Retry connection"));
        return React.createElement("div", { className: "app-shell" },
            React.createElement("aside", { className: 'sidebar ' + (s.menuOpen ? 'opened' : '') },
                React.createElement("div", { className: "brand", onClick: () => this.setRoute('overview'), role: "button", tabIndex: 0 },
                    React.createElement("div", { className: "brand-crest" },
                        React.createElement(Icon, { name: "shield", size: 23 })),
                    React.createElement("div", null,
                        React.createElement("b", null,
                            "Fraud",
                            React.createElement("span", null, "Shield")),
                        React.createElement("small", null, "RISK INTELLIGENCE"))),
                React.createElement("div", { className: "workspace-label" },
                    "WORKSPACE ",
                    React.createElement("span", null, "01")),
                React.createElement("nav", { "aria-label": "Main navigation" }, NAV.map(([route, label, icon]) => React.createElement("button", { key: route, className: 'nav-item ' + (s.route === route ? 'active' : ''), onClick: () => this.setRoute(route) },
                    React.createElement(Icon, { name: icon, size: 18 }),
                    React.createElement("span", null, label),
                    s.route === route && React.createElement("span", { className: "nav-active-dot" })))),
                React.createElement("div", { className: "sidebar-bottom" },
                    React.createElement("div", { className: "system-card" },
                        React.createElement("div", null,
                            React.createElement("span", { className: "pulse-dot" }),
                            " SYSTEM STATUS"),
                        React.createElement("b", null, "Local research mode"),
                        React.createElement("p", null, "Real Kaggle data \u00B7 No bank integration")),
                    React.createElement("div", { className: "sidebar-person" },
                        React.createElement("div", { className: "user-avatar" }, "FS"),
                        React.createElement("div", null,
                            React.createElement("b", null, "Portfolio prototype"),
                            React.createElement("small", null, "Student research edition")),
                        React.createElement(Icon, { name: "chevron", size: 15 })))),
            React.createElement("div", { className: "mobile-shade", onClick: () => this.setState({ menuOpen: false }), style: { display: s.menuOpen ? 'block' : 'none' } }),
            React.createElement("div", { className: "main-column" },
                React.createElement("header", { className: "topbar" },
                    React.createElement("div", { className: "top-left" },
                        React.createElement("button", { className: "mobile-menu", "aria-label": "Open menu", onClick: () => this.setState({ menuOpen: true }) },
                            React.createElement(Icon, { name: "menu", size: 20 })),
                        React.createElement("span", { className: "breadcrumb" }, "FRAUDSHIELD"),
                        React.createElement(Icon, { name: "chevron", size: 12 }),
                        React.createElement("strong", null, NAV.find((x) => x[0] === s.route)?.[1])),
                    React.createElement("div", { className: "top-right" },
                        React.createElement("div", { className: "top-tag" },
                            React.createElement("span", { className: "pulse-dot" }),
                            " VERIFIED DATASET"),
                        React.createElement("div", { className: "top-divider" }),
                        React.createElement("div", { className: "top-role" },
                            "RESEARCH ENVIRONMENT ",
                            React.createElement(Icon, { name: "shield", size: 16 })))),
                React.createElement("main", { className: "content", id: "main-content" },
                    s.error && React.createElement("div", { className: "banner warning" },
                        s.error,
                        React.createElement("button", { onClick: () => this.setState({ error: '' }) }, "Dismiss")),
                    s.route === 'overview' && this.renderOverview(),
                    s.route === 'explorer' && this.renderRecords(false),
                    s.route === 'alerts' && this.renderRecords(true),
                    s.route === 'insights' && this.renderInsights(),
                    s.route === 'models' && this.renderModels(),
                    s.route === 'quality' && this.renderQuality(),
                    React.createElement("footer", { className: "footer" },
                        React.createElement("span", null, "\u00A9 FraudShield \u00B7 Research prototype"),
                        React.createElement("span", null, "Actual data \u00B7 Simulated workflows \u00B7 Transparent limitations")))),
            this.detailDrawer(),
            s.toast && React.createElement("div", { className: "toast" },
                React.createElement(Icon, { name: "info", size: 17 }),
                s.toast));
    }
}
ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
