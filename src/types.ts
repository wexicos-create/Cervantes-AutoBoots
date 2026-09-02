export type ProgrammingLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'c'
  | 'cpp'
  | 'rust'
  | 'go'
  | 'java'
  | 'csharp'
  | 'php'
  | 'ruby'
  | 'swift'
  | 'kotlin'
  | 'html'
  | 'sql'
  | 'bash'
  | 'hibrido';

export interface LanguageInfo {
  id: ProgrammingLanguage;
  name: string;
  extension: string;
  sampleCode: string;
  sampleBuggyCode: string;
  samplePrompt: string;
}

export interface RepoFile {
  id: string;
  path: string;
  name: string;
  folder: string;
  language: ProgrammingLanguage | string;
  content: string;
  sizeBytes?: number;
  isEntrypoint?: boolean;
}

export interface UniversalProject {
  id: string;
  name: string;
  tagline: string;
  userPrompt: string;
  primaryStack: string;
  languagesUsed: string[];
  files: RepoFile[];
  readme: string;
  runInstructions: string;
  architectureDiagram?: string;
  dockerfile?: string;
  createdAt: string;
}

export interface CodeOptimizationResult {
  originalCode: string;
  optimizedCode: string;
  timeComplexity: {
    before: string;
    after: string;
  };
  spaceComplexity: {
    before: string;
    after: string;
  };
  speedupPercentage: number;
  explanation: string;
  optimizationsApplied: string[];
}

export interface TranspileResult {
  sourceLanguage: ProgrammingLanguage;
  targetLanguage: ProgrammingLanguage;
  convertedCode: string;
  idiomaticFeaturesUsed: string[];
  notes: string;
}

export type IssueSeverity = 'critical' | 'error' | 'warning' | 'info' | 'security';

export interface DiagnosticIssue {
  id: string;
  line?: number;
  severity: IssueSeverity;
  title: string;
  description: string;
  suggestion: string;
  codeSnippet?: string;
}

export interface CodeMetrics {
  score: number; // 0 - 100
  complexity: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  maintainability: string;
  linesOfCode: number;
  securityRisk: 'Bajo' | 'Medio' | 'Alto';
}

export interface AnalysisResult {
  issues: DiagnosticIssue[];
  summary: string;
  fixedCode: string;
  changesSummary: string[];
  metrics: CodeMetrics;
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
  executionTimeMs?: number;
  isEdgeCase?: boolean;
  errorMessage?: string;
}

export interface TestSuiteResult {
  tests: TestCase[];
  testFrameworkCode: string;
  totalCount: number;
  passedCount: number;
  failedCount: number;
  overallDurationMs: number;
  summary: string;
}

export interface GenerationResponse {
  code: string;
  explanation: string;
  language: ProgrammingLanguage;
  suggestedTests?: string;
}

export interface BotAgent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'pending' | 'working' | 'completed' | 'verified';
  currentTask: string;
  findings: string[];
  metrics?: {
    label: string;
    value: string;
  };
}

export interface ZeroFaultCertificate {
  syntaxOk: boolean;
  logicOk: boolean;
  securityOk: boolean;
  edgeCasesHandled: boolean;
  score: number;
  verdict: string;
  certifiedAt: string;
}

export interface DecentralizedPHPBot {
  id: string;
  name: string;
  specialty: string;
  daemonState: 'running' | 'idle' | 'executing' | 'syncing';
  memoryUsageMb: number;
  autonomousCycles: number;
  hashProof: string;
  lastAction: string;
  uptimeSeconds: number;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  botId: string;
  botName: string;
  level: 'info' | 'success' | 'warn' | 'algorithm';
  message: string;
  payload?: any;
}

export interface AutonomousSwarmEngineState {
  isAutonomousRunning: boolean;
  swarmId: string;
  consensusScore: number;
  totalOpsExecuted: number;
  activePHPBots: DecentralizedPHPBot[];
  realTimeLogs: ExecutionLog[];
  metrics: {
    surplusValueGenerated: string;
    efficiencyRate: string;
    latencyMs: number;
    zeroFaultAssurance: string;
  };
}

export interface DesignSwarmResult {
  concept: string;
  architecture: string;
  code: string;
  language: ProgrammingLanguage;
  bots: BotAgent[];
  certificate: ZeroFaultCertificate;
  explanation: string;
  highlights: string[];
}

export type CloudProvider = 'gcp' | 'aws' | 'azure' | 'firebase_supabase' | 'custom_vps' | 'hybrid_edge';
export type MobilePlatform = 'android_kotlin' | 'android_java' | 'flutter_dart' | 'react_native';
export type SyncStrategy = 'realtime_websocket' | 'rest_polling' | 'offline_first_queue' | 'event_stream_sse';

export interface CloudAccessEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'WS';
  path: string;
  description: string;
  requiresAuth: boolean;
  requestPayload?: string;
  responsePayload?: string;
}

export interface APKCloudConnectorConfig {
  appName: string;
  packageName: string;
  cloudProvider: CloudProvider;
  mobilePlatform: MobilePlatform;
  syncStrategy: SyncStrategy;
  cloudBaseUrl: string;
  enableSSLPinning: boolean;
  enableOfflineCache: boolean;
  enableAutoTokenRefresh: boolean;
  endpoints: CloudAccessEndpoint[];
  customServices: string[];
}

export interface GeneratedCloudAccessFile {
  name: string;
  path: string;
  language: string;
  category: 'mobile_client' | 'cloud_backend' | 'config_manifest' | 'security_rules';
  description: string;
  content: string;
}

export interface APKCloudSolution {
  id: string;
  title: string;
  summary: string;
  cloudProvider: CloudProvider;
  mobilePlatform: MobilePlatform;
  syncStrategy: SyncStrategy;
  architectureNotes: string;
  files: GeneratedCloudAccessFile[];
  testConnectionSnippet: string;
  deployCommands: string[];
}

export type OllamaCollabMode =
  | 'unrestricted_synthesis'
  | 'deep_repair'
  | 'hybrid_bot_swarm'
  | 'security_audit'
  | 'zero_day_hardening'
  | 'performance_boost';

export interface OllamaModelOption {
  id: string;
  name: string;
  tagline: string;
  category: 'code' | 'general' | 'reasoning' | 'fast';
  contextLength: string;
  isPopular?: boolean;
}

export interface OllamaCollabResult {
  code: string;
  explanation: string;
  model: string;
  mode: OllamaCollabMode;
  botAudit: {
    syntaxScore: number;
    securityPassed: boolean;
    auditPassed: boolean;
    verifiedByBots: string[];
    improvementsApplied: string[];
  };
  durationMs: number;
  unrestrictedFeaturesUsed: string[];
  suggestedTestSuite?: TestCase[];
}

export interface ImmutableBlock {
  blockIndex: number;
  previousHash: string;
  blockHash: string;
  inventionId: string;
  sha256Hash: string;
  timestampUtc: string;
  nonce: number;
  merkleLeaf: string;
}

export interface Rfc3161Proof {
  tsaProvider: 'Sigstore/Rekor' | 'DigiCert Public TSA' | 'Apple Public TSA' | 'FreeTSA Global' | 'OpenTimestamps';
  tsaUrl: string;
  timestampUtc: string;
  serialNumber: string;
  hashAlgorithm: 'SHA-256';
  digest: string;
  tstTokenHex: string;
  isVerified: boolean;
}

export interface PgpSignatureProof {
  publicKeyArmored?: string;
  signatureArmored: string;
  fingerprint: string;
  keyAlgorithm: 'Ed25519' | 'RSA-4096' | 'ECDSA-P256';
  signedAt: string;
  isLocallyVerified: boolean;
}

export interface DailyMerkleAnchor {
  anchorId: string;
  dateString: string;
  merkleRoot: string;
  totalInventions: number;
  inventionsHashes: string[];
  blockchainTxId: string;
  publicNetwork: 'Polygon Free Calldata' | 'Arbitrum Public Layer' | 'OpenTimestamps / Bitcoin' | 'Solana Memo' | 'Sigstore Transparency Log';
  explorerUrl: string;
  rfc3161TsaProvider: string;
  rfc3161Timestamp: string;
  anchoredAtUtc: string;
  status: 'anchored' | 'pending' | 'verified';
}

export interface CommunityInvention {
  id: string;
  title: string;
  authorName: string;
  authorHandle?: string;
  authorFingerprint?: string;
  category:
    | 'algoritmo_novedoso'
    | 'invento_no_existente'
    | 'arquitectura_software'
    | 'e_commerce_disruptivo'
    | 'criptografia_seguridad'
    | 'motor_3d_fisica'
    | 'hardware_firmware'
    | 'inteligencia_determinista';
  noveltyDescription: string;
  language: ProgrammingLanguage | string;
  code: string;
  additionalFiles?: { name: string; content: string; language: string }[];
  license: string;
  sha256Hash: string;
  registeredAt: string;
  witnessCount: number;
  witnessList?: string[];
  tags: string[];
  isVerifiedPriorArt: boolean;
  immutableBlock?: ImmutableBlock;
  rfc3161Proof?: Rfc3161Proof;
  pgpProof?: PgpSignatureProof;
  merkleProof?: string[];
}

export interface AuthorshipCertificate {
  certificateId: string;
  inventionId: string;
  title: string;
  authorName: string;
  sha256Hash: string;
  timestampUtc: string;
  byteSize: number;
  lineCount: number;
  disclaimer: string;
  verificationUrl?: string;
  merkleRoot?: string;
  blockchainAnchorNetwork?: string;
  rfc3161TsaProvider?: string;
  rfc3161TimestampUtc?: string;
  pgpFingerprint?: string;
  blockIndex?: number;
  previousBlockHash?: string;
}


