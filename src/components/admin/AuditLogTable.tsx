import React, { useState } from 'react';
import { 
  History, 
  ShieldCheck, 
  Search, 
  Filter, 
  FileText, 
  Hash, 
  Lock,
  Download
} from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';

export const AuditLogTable: React.FC = () => {
  const { auditLogs } = useDisasterStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        log.id.toLowerCase().includes(term) ||
        log.officerName.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        log.details.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const exportAuditCSV = () => {
    const headers = ['Audit ID', 'Timestamp', 'Officer Name', 'Role', 'Action', 'Target Type', 'Target ID', 'Details', 'Audit Hash'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      `"${l.officerName}"`,
      l.officerRole,
      l.action,
      l.targetType,
      l.targetId,
      `"${l.details.replace(/"/g, '""')}"`,
      l.auditHash
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `disasterguard_audit_trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-900/90 p-4 rounded-xl border border-gray-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" />
            <span>Government Audit Trail & Cryptographic Decision Log</span>
          </h3>
          <p className="text-xs text-gray-400">
            Immutable chronological logging for statutory compliance, accountability, and post-disaster review.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-gray-950 border border-gray-700 rounded-lg text-xs text-white focus:outline-none"
            />
          </div>

          <button
            onClick={exportAuditCSV}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-lg border border-gray-700 flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900/90 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-950 text-gray-400 font-mono uppercase text-[11px] border-b border-gray-800">
              <tr>
                <th className="py-3 px-4">Audit ID & Timestamp</th>
                <th className="py-3 px-4">Officer / Agent</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Decision Record & Details</th>
                <th className="py-3 px-4">Tamper Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-800/50 transition font-sans">
                  <td className="py-3 px-4 whitespace-nowrap font-mono">
                    <div className="font-bold text-white text-xs">{log.id}</div>
                    <div className="text-[10px] text-gray-400">{new Date(log.timestamp).toLocaleString()}</div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-semibold text-white">{log.officerName}</div>
                    <span className="text-[10px] font-mono text-blue-400 uppercase">{log.officerRole}</span>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-amber-300">
                    {log.targetType} ({log.targetId})
                  </td>

                  <td className="py-3 px-4 text-xs text-gray-200 max-w-xs sm:max-w-md">
                    {log.details}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[10px] text-gray-500 truncate max-w-[120px]">
                    {log.auditHash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
