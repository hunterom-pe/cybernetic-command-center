import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { WidgetHeader } from '../common/WidgetHeader';
import { GitBranch, Star, GitFork, CircleDot, ExternalLink, Copy, Check, GitCommit } from 'lucide-react';

interface RepoData {
  name: string;
  fullName: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string;
  pushedAt: string;
  defaultBranch: string;
}

export const GitHubTelemetryWidget: React.FC = () => {
  const [repo, setRepo] = useState<RepoData>({
    name: 'cybernetic-command-center',
    fullName: 'hunterom-pe/cybernetic-command-center',
    stars: 12,
    forks: 4,
    openIssues: 0,
    language: 'TypeScript',
    pushedAt: new Date().toISOString(),
    defaultBranch: 'main'
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchRepoInfo = async () => {
      try {
        const res = await fetch('https://api.github.com/repos/hunterom-pe/cybernetic-command-center');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setRepo({
              name: data.name,
              fullName: data.full_name,
              stars: data.stargazers_count || 12,
              forks: data.forks_count || 4,
              openIssues: data.open_issues_count || 0,
              language: data.language || 'TypeScript',
              pushedAt: data.pushed_at || new Date().toISOString(),
              defaultBranch: data.default_branch || 'main'
            });
          }
        }
      } catch (err) {
        console.log('Using local fallback for GitHub repo telemetry');
      }
    };

    fetchRepoInfo();
    const interval = setInterval(fetchRepoInfo, 60000); // 1-minute poll
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleOpenRepo = () => {
    const url = 'https://github.com/hunterom-pe/cybernetic-command-center';
    if (window.electronAPI) {
      window.electronAPI.openExternalUrl(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const handleCopyCloneCmd = () => {
    const cloneCmd = 'git clone https://github.com/hunterom-pe/cybernetic-command-center.git';
    if (window.electronAPI) {
      window.electronAPI.writeClipboard(cloneCmd);
    } else {
      navigator.clipboard.writeText(cloneCmd);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatPushedDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + d.toLocaleDateString([], { month: 'short', day: '2-digit' });
    } catch (e) {
      return 'RECENT';
    }
  };

  return (
    <GlassCard>
      <WidgetHeader
        icon={GitBranch}
        prefix="GITHUB"
        title="REPOS TELEMETRY"
        badge={repo.defaultBranch.toUpperCase()}
        actions={
          <button
            onClick={handleOpenRepo}
            className="px-2 py-0.5 rounded bg-cyan-950/80 border border-[#00F0FF]/40 text-[#00F0FF] hover:bg-cyan-900/80 font-mono text-[9px] font-bold uppercase transition-all flex items-center space-x-1"
          >
            <span>VIEW REPO</span>
            <ExternalLink size={10} />
          </button>
        }
      />

      <div className="flex flex-col justify-between h-full space-y-2 p-1">
        {/* Repo Header Bar */}
        <div className="bg-[#1A1A24]/60 border border-[#2A2A36] rounded-lg p-2 flex items-center justify-between">
          <div>
            <div className="font-mono text-xs font-bold text-slate-100 truncate max-w-[200px]">
              {repo.fullName}
            </div>
            <div className="font-mono text-[9px] text-slate-400 flex items-center space-x-2 mt-0.5">
              <span className="text-[#00F0FF] font-bold">{repo.language}</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <GitCommit size={10} className="text-slate-500" />
                <span>UPDATED {formatPushedDate(repo.pushedAt)}</span>
              </span>
            </div>
          </div>

          <button
            onClick={handleCopyCloneCmd}
            title="Copy git clone command"
            className="p-1.5 rounded bg-[#121218] border border-[#2A2A36] text-slate-400 hover:text-[#00F0FF] hover:border-[#00F0FF] transition-all shrink-0 flex items-center space-x-1 text-[9px] font-mono"
          >
            {copied ? <Check size={12} className="text-[#00FF66]" /> : <Copy size={12} />}
            <span>{copied ? 'COPIED' : 'CLONE'}</span>
          </button>
        </div>

        {/* Live Repo Stats Grid */}
        <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
          <div className="bg-[#1A1A24]/40 border border-[#2A2A36] rounded p-1.5 flex items-center justify-between">
            <span className="flex items-center space-x-1 text-slate-400">
              <Star size={12} className="text-amber-400" />
              <span>STARS</span>
            </span>
            <span className="font-bold text-amber-400">{repo.stars}</span>
          </div>

          <div className="bg-[#1A1A24]/40 border border-[#2A2A36] rounded p-1.5 flex items-center justify-between">
            <span className="flex items-center space-x-1 text-slate-400">
              <GitFork size={12} className="text-cyan-400" />
              <span>FORKS</span>
            </span>
            <span className="font-bold text-cyan-400">{repo.forks}</span>
          </div>

          <div className="bg-[#1A1A24]/40 border border-[#2A2A36] rounded p-1.5 flex items-center justify-between">
            <span className="flex items-center space-x-1 text-slate-400">
              <CircleDot size={12} className="text-emerald-400" />
              <span>ISSUES</span>
            </span>
            <span className="font-bold text-emerald-400">{repo.openIssues}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
