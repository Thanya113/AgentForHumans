import React, { useState } from 'react';
import { 
  CheckSquare, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Bot, 
  CheckCircle2, 
  AlertOctagon, 
  ChevronRight, 
  ShieldAlert, 
  Plus,
  ArrowUpDown,
  History,
  Activity
} from 'lucide-react';
import { TaskItem, TaskStatus } from '../../types';

interface TasksViewProps {
  tasks: TaskItem[];
  onSelectTask?: (task: TaskItem) => void;
}

const ALL_STATUSES: TaskStatus[] = [
  'Pending',
  'In Progress',
  'Waiting Approval',
  'Completed',
  'Failed',
  'Escalated'
];

export const TasksView: React.FC<TasksViewProps> = ({ tasks }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [activeTask, setActiveTask] = useState<TaskItem | null>(tasks[0] || null);

  const filteredTasks = tasks.filter(t => {
    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                          t.id.toLowerCase().includes(search.toLowerCase()) ||
                          (t.customerName && t.customerName.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <CheckSquare className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wide">
              Operations Workflow Management
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Tasks Queue</h1>
          <p className="text-sm text-slate-400">
            Monitor autonomous and human-assigned operational work across refunds, invoices, support, and policy reviews.
          </p>
        </div>

        {/* Status Counts */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            Total: <strong>{tasks.length}</strong>
          </span>
          <span className="px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
            Waiting: <strong>{tasks.filter(t => t.status === 'Waiting Approval').length}</strong>
          </span>
          <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            Completed: <strong>{tasks.filter(t => t.status === 'Completed').length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
              selectedStatus === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All ({tasks.length})
          </button>
          {ALL_STATUSES.map(s => {
            const count = tasks.filter(t => t.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  selectedStatus === s ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter tasks..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Main Task Split View: Task List + Task Detail & Action History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Task List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredTasks.map((t) => {
            const isSelected = activeTask?.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setActiveTask(t)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-850 border-indigo-500 shadow-md shadow-indigo-950' 
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-300">{t.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      t.priority === 'High' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      t.priority === 'Medium' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {t.priority}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {t.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      t.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' :
                      t.status === 'Waiting Approval' ? 'bg-rose-500/20 text-rose-300' :
                      t.status === 'Escalated' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-slate-100">{t.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{t.description}</p>

                <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      {t.assignee === 'OpsPilot Agent' ? (
                        <Bot className="w-3.5 h-3.5 text-cyan-400" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                      <span>{t.assignee}</span>
                    </span>
                    {t.customerName && <span>Customer: <strong className="text-slate-300">{t.customerName}</strong></span>}
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>Created: {t.createdAt}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 1 Col: Task Action History (Agent Actions vs Human Actions) */}
        <div className="space-y-4">
          {activeTask ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 sticky top-24">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-indigo-400 font-bold">{activeTask.id}</span>
                  <span className="text-slate-400">Deadline: {activeTask.deadline}</span>
                </div>
                <h3 className="text-base font-bold text-slate-100">{activeTask.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{activeTask.description}</p>
              </div>

              {/* Agent Actions History */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wide">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span>Agent Actions ({activeTask.agentActions.length})</span>
                </div>

                {activeTask.agentActions.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No agent actions recorded yet.</p>
                ) : (
                  <div className="space-y-2 border-l-2 border-slate-800 ml-2 pl-3">
                    {activeTask.agentActions.map((act, idx) => (
                      <div key={idx} className="relative text-xs">
                        <span className="absolute -left-[19px] top-1.5 w-2 h-2 rounded-full bg-cyan-400"></span>
                        <div className="font-mono text-[10px] text-slate-500">{act.timestamp}</div>
                        <p className="text-slate-300 text-[11px] font-medium">{act.action}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Human Actions History */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wide">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>Human Interventions ({activeTask.humanActions.length})</span>
                </div>

                {activeTask.humanActions.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No human interventions required.</p>
                ) : (
                  <div className="space-y-2 border-l-2 border-slate-800 ml-2 pl-3">
                    {activeTask.humanActions.map((act, idx) => (
                      <div key={idx} className="relative text-xs">
                        <span className="absolute -left-[19px] top-1.5 w-2 h-2 rounded-full bg-indigo-400"></span>
                        <div className="font-mono text-[10px] text-slate-500">{act.timestamp} · {act.operator}</div>
                        <p className="text-slate-200 text-[11px] font-semibold">{act.action}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-500">
              Select a task to inspect full audit and action timeline.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
