import React, { useState, useEffect } from 'react';
import { 
  Github, 
  X, 
  Check, 
  Copy, 
  ExternalLink, 
  Loader2,
  Terminal,
  FolderGit2,
  RefreshCw,
  ArrowUpCircle,
  CheckCircle2,
  AlertCircle,
  GitBranch,
  GitCommit,
  Upload,
  Lock,
  Globe,
  FileCode,
  LogOut,
  KeyRound
} from 'lucide-react';
import { Project } from '../types';
import { apiService } from '../services/api';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  bio?: string;
  location?: string;
}

const GITHUB_TOKEN_STORAGE_KEY = 'imch_github_pat_token';

export const GitHubModal: React.FC<GitHubModalProps> = ({ isOpen, onClose, project }) => {
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(GITHUB_TOKEN_STORAGE_KEY) || '';
    }
    return '';
  });

  const [connectedUser, setConnectedUser] = useState<GitHubUser | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [activeTab, setActiveTab] = useState<'export' | 'sync' | 'terminal'>('export');

  // Export form state
  const defaultRepoName = (project.name || 'meu-website')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'meu-website';

  const [repoName, setRepoName] = useState(defaultRepoName);
  const [isPrivate, setIsPrivate] = useState(false);
  const [commitMessage, setCommitMessage] = useState(`feat: exportação do website "${project.name}" via IMCH AI Developer`);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<{
    repoUrl: string;
    repoName: string;
    filesCount: number;
  } | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  // Sync state (advanced)
  const [gitStatus, setGitStatus] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Check connected user
  const checkUser = async (tokenToUse?: string) => {
    setIsCheckingUser(true);
    try {
      const res = await apiService.getGitHubUser(tokenToUse || token || undefined);
      if (res.connected && res.user) {
        setConnectedUser(res.user);
      } else {
        setConnectedUser(null);
      }
    } catch {
      setConnectedUser(null);
    } finally {
      setIsCheckingUser(false);
    }
  };

  const fetchStatus = async () => {
    try {
      const data = await apiService.getGitHubStatus();
      setGitStatus(data);
    } catch (err: any) {
      console.warn('Erro ao carregar estado do GitHub:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkUser();
      fetchStatus();
      setRepoName(defaultRepoName);
      setExportSuccess(null);
      setExportError(null);
    }
  }, [isOpen, project.name]);

  if (!isOpen) return null;

  const handleConnectToken = async () => {
    if (!token.trim()) return;
    localStorage.setItem(GITHUB_TOKEN_STORAGE_KEY, token.trim());
    await checkUser(token.trim());
  };

  const handleDisconnect = () => {
    localStorage.removeItem(GITHUB_TOKEN_STORAGE_KEY);
    setToken('');
    setConnectedUser(null);
  };

  const handleExportProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoName.trim()) {
      setExportError('Por favor insira um nome para o repositório.');
      return;
    }

    setIsExporting(true);
    setExportError(null);
    setExportSuccess(null);

    try {
      const res = await apiService.exportProjectToGitHub({
        token: token.trim() || undefined,
        repoName: repoName.trim(),
        isPrivate,
        files: project.files,
        commitMessage: commitMessage.trim(),
        description: project.description || `Website criado com IMCH AI Developer`,
      });

      if (res.success && res.repoUrl) {
        setExportSuccess({
          repoUrl: res.repoUrl,
          repoName: res.repoName || repoName.trim(),
          filesCount: res.exportedFilesCount || Object.keys(project.files).length,
        });
      } else {
        setExportError(res.message || 'Falha ao exportar ficheiros para o GitHub.');
      }
    } catch (err: any) {
      setExportError(err.message || 'Erro inesperado na exportação para o GitHub.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePushSync = async () => {
    setIsSyncing(true);
    setSyncStatus({ type: 'info', message: 'A enviar alterações para o GitHub...' });
    try {
      const res = await apiService.pushGitHub({
        message: commitMessage.trim() || `feat: atualização de projeto ${project.name}`,
        token: token.trim() || undefined,
      });
      if (res.success) {
        setSyncStatus({ type: 'success', message: res.message });
      } else {
        setSyncStatus({ type: 'error', message: res.message });
      }
      fetchStatus();
    } catch (err: any) {
      setSyncStatus({ type: 'error', message: err.message || 'Falha ao enviar' });
    } finally {
      setIsSyncing(false);
    }
  };

  const copyRepoUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const projectFilesList = Object.keys(project.files || {});

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div 
        className="w-full max-w-xl bg-neutral-900 dark:bg-[#0c0c0e] border border-neutral-700 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center shadow-xs">
              <Github className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-white font-mono">
                  Exportar para o GitHub
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Conexão Direta
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Conecte a sua conta e exporte os ficheiros do seu website para o GitHub
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/40 px-6 pt-2 gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-2.5 px-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'border-blue-500 text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Exportar Website</span>
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`pb-2.5 px-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sync'
                ? 'border-blue-500 text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sincronização Avançada</span>
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`pb-2.5 px-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'terminal'
                ? 'border-blue-500 text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Comandos Git</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* GitHub Account Connection Card ("Porta de Conexão com GitHub") */}
          <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-300 flex items-center gap-2">
                <Github className="w-4 h-4 text-white" />
                <span>Conta do GitHub</span>
              </span>

              {connectedUser && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" />
                  Conectada
                </span>
              )}
            </div>

            {isCheckingUser ? (
              <div className="flex items-center gap-2 py-3 text-xs text-neutral-400">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span>A verificar conta do GitHub...</span>
              </div>
            ) : connectedUser ? (
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                <div className="flex items-center gap-3">
                  <img
                    src={connectedUser.avatar_url}
                    alt={connectedUser.login}
                    className="w-10 h-10 rounded-full border border-neutral-700 object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {connectedUser.name || connectedUser.login}
                      </span>
                      <a
                        href={connectedUser.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-blue-400 hover:underline flex items-center gap-0.5"
                      >
                        @{connectedUser.login}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    <p className="text-[10px] text-neutral-400 font-mono">
                      {connectedUser.public_repos} repositórios públicos
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-2.5 py-1 text-[11px] text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors flex items-center gap-1 cursor-pointer"
                  title="Desconectar token"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Desconectar</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <p className="text-xs text-neutral-400">
                  Conecte a sua conta GitHub usando um Personal Access Token (PAT) para exportar os seus projetos diretamente para repositórios na sua conta.
                </p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-500" />
                    <input
                      type="password"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Cole o seu GitHub Personal Access Token (ghp_...)"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleConnectToken}
                    disabled={!token.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Conectar
                  </button>
                </div>
                <div className="text-[11px] text-neutral-500">
                  <span>Não tem um token? </span>
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=IMCH%20AI%20Developer"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline inline-flex items-center gap-0.5"
                  >
                    Gerar token com permissão 'repo' no GitHub
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* TAB 1: EXPORT WEBSITE (Default) */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              {/* Project summary */}
              <div className="p-3.5 rounded-xl bg-neutral-950/40 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Website Atual: {project.name}</span>
                  </span>
                  <span className="text-neutral-500 font-mono">
                    {projectFilesList.length} ficheiros
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {projectFilesList.slice(0, 6).map((f) => (
                    <span 
                      key={f} 
                      className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-400 flex items-center gap-1"
                    >
                      <FileCode className="w-2.5 h-2.5 text-neutral-500" />
                      {f}
                    </span>
                  ))}
                  {projectFilesList.length > 6 && (
                    <span className="px-1.5 py-0.5 text-[10px] text-neutral-500 font-mono">
                      +{projectFilesList.length - 6} mais
                    </span>
                  )}
                </div>
              </div>

              {/* Success Notification */}
              {exportSuccess && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 space-y-3 animate-in zoom-in-95">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>Website Exportado com Sucesso para o GitHub!</span>
                  </div>
                  <p className="text-xs text-emerald-300/80">
                    Todos os {exportSuccess.filesCount} ficheiros do seu website foram enviados para o repositório <strong>{exportSuccess.repoName}</strong>.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={exportSuccess.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Abrir Repositório no GitHub</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => copyRepoUrl(exportSuccess.repoUrl)}
                      className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copiado!' : 'Copiar URL'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Error Notification */}
              {exportError && (
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{exportError}</span>
                </div>
              )}

              {/* Export Form */}
              <form onSubmit={handleExportProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Nome do Repositório no GitHub:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                      placeholder="ex: meu-novo-website"
                      className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 font-mono"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    Se o repositório não existir na sua conta, ele será criado automaticamente.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Visibilidade do Repositório:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPrivate(false)}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        !isPrivate 
                          ? 'bg-blue-600/10 border-blue-500 text-white' 
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <Globe className={`w-4 h-4 ${!isPrivate ? 'text-blue-400' : 'text-neutral-500'}`} />
                      <div>
                        <div className="text-xs font-semibold">Público</div>
                        <div className="text-[10px] text-neutral-500">Qualquer pessoa pode ver</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsPrivate(true)}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        isPrivate 
                          ? 'bg-blue-600/10 border-blue-500 text-white' 
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <Lock className={`w-4 h-4 ${isPrivate ? 'text-blue-400' : 'text-neutral-500'}`} />
                      <div>
                        <div className="text-xs font-semibold">Privado</div>
                        <div className="text-[10px] text-neutral-500">Apenas você tem acesso</div>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Mensagem de Commit:
                  </label>
                  <input
                    type="text"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    placeholder="feat: website criado no IMCH AI Developer"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Fechar
                  </button>
                  <button
                    type="submit"
                    disabled={isExporting}
                    className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>A exportar para o GitHub...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Exportar Website para o GitHub</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: ADVANCED REAL-TIME SYNC */}
          {activeTab === 'sync' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-neutral-950/40 border border-neutral-800 space-y-2">
                <span className="font-semibold text-neutral-300">
                  Sincronização Contínua em Tempo Real
                </span>
                <p className="text-neutral-400 leading-relaxed text-[11px]">
                  Permite sincronizar alterações bidirecionais entre o repositório e o ambiente de desenvolvimento.
                </p>
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={handlePushSync}
                    disabled={isSyncing}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowUpCircle className="w-3.5 h-3.5 text-blue-400" />}
                    <span>Enviar Alterações (git push)</span>
                  </button>
                </div>
                {syncStatus && (
                  <p className={`text-[11px] pt-1 ${syncStatus.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {syncStatus.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TERMINAL COMMANDS */}
          {activeTab === 'terminal' && (
            <div className="space-y-3 text-xs">
              <p className="text-neutral-400">
                Se preferir usar o terminal local na sua máquina, use os comandos padrão do Git:
              </p>
              <pre className="p-4 rounded-xl bg-black border border-neutral-800 font-mono text-[11px] text-emerald-400 leading-relaxed overflow-x-auto">
{`# 1. Clonar repositório
git clone https://github.com/${connectedUser?.login || 'seu-usuario'}/${repoName}.git

# 2. Entrar no projeto
cd ${repoName}

# 3. Adicionar alterações e enviar
git add .
git commit -m "feat: atualização do site"
git push origin main`}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
