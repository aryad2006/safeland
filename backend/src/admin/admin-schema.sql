-- SafeLand Admin API Database Schema
-- SQLite database for monitoring, alerts, metrics aggregation
-- Created: 2026-04-15

-- Countries/Deployments table
CREATE TABLE IF NOT EXISTS admin_countries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  blockchain VARCHAR(50) NOT NULL,
  blockchain_id INTEGER NOT NULL,
  rpc_url VARCHAR(500) NOT NULL,
  contract_nft VARCHAR(66),
  contract_registry VARCHAR(66),
  contract_escrow VARCHAR(66),
  contract_fridda VARCHAR(66),
  contract_justice VARCHAR(66),
  contract_timelock VARCHAR(66),
  deployed_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (status IN ('active', 'maintenance', 'deprecated'))
);

-- Metrics: User counts, transaction volumes, errors
CREATE TABLE IF NOT EXISTS admin_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  country_id INTEGER NOT NULL,
  metric_type VARCHAR(50) NOT NULL,
  metric_key VARCHAR(100),
  value NUMERIC NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (country_id) REFERENCES admin_countries(id) ON DELETE CASCADE,
  CHECK (metric_type IN ('users', 'transactions', 'blockchain', 'errors', 'fees'))
);

-- Create index for efficient queries (timestamp-based)
CREATE INDEX IF NOT EXISTS idx_admin_metrics_country_type_ts
  ON admin_metrics(country_id, metric_type, timestamp DESC);

-- Alerts: RPC down, error spikes, etc.
CREATE TABLE IF NOT EXISTS admin_alerts (
  id VARCHAR(100) PRIMARY KEY,
  country_id INTEGER NOT NULL,
  alert_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  message VARCHAR(500) NOT NULL,
  threshold NUMERIC,
  current_value NUMERIC,
  status VARCHAR(20) DEFAULT 'active',
  acknowledged_at TIMESTAMP,
  acknowledged_by VARCHAR(200),
  resolved_at TIMESTAMP,
  notes VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (country_id) REFERENCES admin_countries(id) ON DELETE CASCADE,
  CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  CHECK (status IN ('active', 'acknowledged', 'resolved'))
);

-- Create index for active alerts
CREATE INDEX IF NOT EXISTS idx_admin_alerts_status
  ON admin_alerts(status, severity DESC, created_at DESC);

-- Admin settings: Thresholds, feature flags
CREATE TABLE IF NOT EXISTS admin_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'string',
  updated_by VARCHAR(200),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (type IN ('string', 'number', 'boolean', 'json'))
);

-- Default settings
INSERT OR IGNORE INTO admin_settings (key, value, type) VALUES
  ('alert_threshold_rpc_latency_ms', '500', 'number'),
  ('alert_threshold_error_rate_percent', '5', 'number'),
  ('alert_threshold_memory_percent', '80', 'number'),
  ('alert_threshold_block_lag_minutes', '15', 'number'),
  ('monitoring_enabled', 'true', 'boolean'),
  ('monitoring_check_interval_seconds', '60', 'number'),
  ('monitoring_alert_email_recipients', '["ops@safeland.team"]', 'json'),
  ('feature_admin_dashboard', 'true', 'boolean'),
  ('feature_auto_scaling', 'false', 'boolean'),
  ('feature_backup_enabled', 'true', 'boolean');

-- Admin audit log: Track changes to settings, alert acknowledgements
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email VARCHAR(200) NOT NULL,
  action VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50),
  resource_id VARCHAR(100),
  details TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (action IN ('create', 'update', 'delete', 'acknowledge', 'resolve'))
);

-- Create index for audit queries
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_timestamp
  ON admin_audit_log(user_email, timestamp DESC);

-- Health check snapshots: RPC latency, block height, sync status
CREATE TABLE IF NOT EXISTS admin_health_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  country_id INTEGER NOT NULL,
  rpc_latency_ms INTEGER,
  last_block INTEGER,
  block_timestamp TIMESTAMP,
  sync_status VARCHAR(20),
  node_version VARCHAR(50),
  backend_cpu_percent REAL,
  backend_memory_mb INTEGER,
  backend_request_count INTEGER,
  backend_error_count INTEGER,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (country_id) REFERENCES admin_countries(id) ON DELETE CASCADE
);

-- Create index for health queries (last 24h)
CREATE INDEX IF NOT EXISTS idx_admin_health_snapshots_country_ts
  ON admin_health_snapshots(country_id, timestamp DESC);

-- User analytics: Cohort analysis, retention
CREATE TABLE IF NOT EXISTS admin_user_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  country_id INTEGER NOT NULL,
  cohort_date DATE,
  cohort_size INTEGER,
  day_retention_percent REAL,
  week_retention_percent REAL,
  month_retention_percent REAL,
  average_transactions_per_user REAL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (country_id) REFERENCES admin_countries(id) ON DELETE CASCADE
);

-- Transaction analytics: Breakdown by type, fee collection
CREATE TABLE IF NOT EXISTS admin_transaction_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  country_id INTEGER NOT NULL,
  date DATE,
  transaction_type VARCHAR(50),
  transaction_count INTEGER,
  total_value_usd NUMERIC,
  average_value_usd NUMERIC,
  dgi_collected_usd NUMERIC,
  ancfcc_collected_usd NUMERIC,
  platform_collected_usd NUMERIC,
  average_gas_gwei REAL,
  error_count INTEGER,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (country_id) REFERENCES admin_countries(id) ON DELETE CASCADE
);

-- Create index for analytics queries
CREATE INDEX IF NOT EXISTS idx_admin_transaction_analytics_country_date
  ON admin_transaction_analytics(country_id, date DESC);

-- Views for common queries

-- Current health summary
CREATE VIEW IF NOT EXISTS v_current_health AS
SELECT
  ac.name as country,
  ahs.rpc_latency_ms,
  ahs.sync_status,
  ahs.last_block,
  ahs.backend_cpu_percent,
  ahs.backend_memory_mb,
  (CAST(ahs.backend_error_count AS FLOAT) / CAST(ahs.backend_request_count AS FLOAT) * 100) as error_rate_percent,
  ahs.timestamp
FROM admin_health_snapshots ahs
JOIN admin_countries ac ON ahs.country_id = ac.id
WHERE ahs.timestamp = (
  SELECT MAX(timestamp) FROM admin_health_snapshots
  WHERE country_id = ac.id
);

-- Active alerts summary
CREATE VIEW IF NOT EXISTS v_active_alerts AS
SELECT
  aa.id,
  ac.name as country,
  aa.alert_type,
  aa.severity,
  aa.message,
  aa.current_value,
  aa.threshold,
  aa.created_at,
  CASE
    WHEN aa.acknowledged_at IS NOT NULL THEN 'acknowledged'
    ELSE 'active'
  END as current_status
FROM admin_alerts aa
JOIN admin_countries ac ON aa.country_id = ac.id
WHERE aa.status = 'active'
ORDER BY
  CASE
    WHEN aa.severity = 'critical' THEN 1
    WHEN aa.severity = 'error' THEN 2
    WHEN aa.severity = 'warning' THEN 3
    ELSE 4
  END,
  aa.created_at DESC;

-- User metrics summary (last 30 days)
CREATE VIEW IF NOT EXISTS v_user_metrics_summary AS
SELECT
  ac.name as country,
  COUNT(DISTINCT am.id) as total_metrics,
  SUM(CASE WHEN am.metric_key = 'total' AND am.metric_type = 'users' THEN am.value ELSE 0 END) as total_users,
  SUM(CASE WHEN am.metric_key = 'new_24h' AND am.metric_type = 'users' THEN am.value ELSE 0 END) as new_users_24h,
  SUM(CASE WHEN am.metric_key = 'active_24h' AND am.metric_type = 'users' THEN am.value ELSE 0 END) as active_users_24h,
  MIN(am.timestamp) as first_metric,
  MAX(am.timestamp) as last_metric
FROM admin_metrics am
JOIN admin_countries ac ON am.country_id = ac.id
WHERE am.timestamp > datetime('now', '-30 days')
GROUP BY ac.id, ac.name;

-- Deployment status summary
CREATE VIEW IF NOT EXISTS v_deployment_status AS
SELECT
  ac.name as country,
  ac.blockchain,
  ac.status,
  ac.deployed_at,
  CASE
    WHEN ac.contract_nft IS NOT NULL THEN 'deployed'
    ELSE 'pending'
  END as contract_status,
  (SELECT COUNT(*) FROM admin_alerts aa WHERE aa.country_id = ac.id AND aa.status = 'active') as active_alert_count,
  (SELECT ROUND(AVG(ahs.backend_cpu_percent), 1) FROM admin_health_snapshots ahs WHERE ahs.country_id = ac.id AND ahs.timestamp > datetime('now', '-24 hours')) as avg_cpu_percent_24h,
  (SELECT ROUND(AVG(ahs.backend_memory_mb), 0) FROM admin_health_snapshots ahs WHERE ahs.country_id = ac.id AND ahs.timestamp > datetime('now', '-24 hours')) as avg_memory_mb_24h
FROM admin_countries ac;

-- Indexes for views (if needed)
CREATE INDEX IF NOT EXISTS idx_admin_countries_status
  ON admin_countries(status);

-- Trigger: Auto-update admin_countries.updated_at
CREATE TRIGGER IF NOT EXISTS trg_admin_countries_update
AFTER UPDATE ON admin_countries
FOR EACH ROW
BEGIN
  UPDATE admin_countries SET updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
END;

-- Trigger: Auto-cleanup old metrics (keep 90 days)
CREATE TRIGGER IF NOT EXISTS trg_cleanup_old_metrics
AFTER INSERT ON admin_metrics
BEGIN
  DELETE FROM admin_metrics
  WHERE timestamp < datetime('now', '-90 days');
END;

-- Trigger: Auto-cleanup old health snapshots (keep 30 days)
CREATE TRIGGER IF NOT EXISTS trg_cleanup_old_health
AFTER INSERT ON admin_health_snapshots
BEGIN
  DELETE FROM admin_health_snapshots
  WHERE timestamp < datetime('now', '-30 days');
END;

-- Sample data for testing (if needed, comment out in production)
-- INSERT INTO admin_countries (name, blockchain, blockchain_id, rpc_url, status)
-- VALUES
--   ('senegal', 'polygon', 137, 'https://polygon-rpc.com', 'active'),
--   ('test', 'polygon', 137, 'https://polygon-rpc.com', 'active');
