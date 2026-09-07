'use client';

import { useEffect, useRef, useState } from 'react';
import { WidgetState, DocumentConstraint, DigiLockerAsset, BatchItem } from '@/types';
import { COLORS, PORTALS, WIDGET_STATES } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { parsePortalConstraints } from '@/lib/openai';
import { processDocument } from '@/lib/processor';
import DigiLockerModal from './DigiLockerModal';
import CameraCapture from './CameraCapture';
import SignaturePad from './SignaturePad';
import ProcessingOverlay from './ProcessingOverlay';
import PreviewPanel from './PreviewPanel';
import PrivacyBadge from '@/components/ui/PrivacyBadge';
import { useLang, voiceLang } from '@/lib/i18n';
import { useVoiceGuide } from '@/hooks/useVoiceGuide';
import { dwellForSpeech, isVoiceOn } from '@/lib/voice';

function portalDisplayName(portalId: DocBridgeWidgetProps['portalId']): string {
  return portalId === 'epfo' ? 'EPFO' : portalId === 'vahan' ? 'Sarathi' : portalId === 'upsc' ? 'UPSC' : portalId === 'passport' ? 'Passport Seva' : portalId === 'ssc' ? 'SSC' : portalId === 'nsp' ? 'NSP' : 'portal';
}

// Which upload slot a DigiLocker / device document maps to, so each batch item
// is prepared against that slot's constraint and routed to the matching
// legacy-* endpoint (photo / signature / income / passbook) on submit.
function inferDocType(name: string): BatchItem['docType'] {
  const n = name.toLowerCase();
  if (n.includes('selfie') || n.includes('photo')) return 'photo';
  if (n.includes('signature')) return 'signature';
  if (n.includes('cert')) return 'income';
  if (n.includes('passbook') || n.includes('pan') || n.includes('address') || n.includes('aadhaar')) return 'passbook';
  return 'other';
}

// Emphasizes the product name inside helper copy (EN + HI strings both
// carry "DocBridge" in Latin script).
function boldDocBridge(text: string): React.ReactNode {
  const parts = text.split('DocBridge');
  if (parts.length === 1) return text;
  return parts.flatMap((p, i) => (i === 0 ? [p] : [<strong key={i}>DocBridge</strong>, p]));
}
const SLOT_REQUIREMENTS: Record<string, Partial<Record<BatchItem['docType'], string>>> = {
  epfo: { passbook: 'EPFO passbook. PDF format, maximum size 500KB, account number must be visible.' },
  upsc: {
    photo: 'UPSC photograph. JPEG only, 20KB - 300KB, minimum 350 x 350 pixels, maximum 1000 x 1000 pixels, white background.',
    signature: 'UPSC signature. JPEG only, 20KB - 300KB, minimum 350 x 350 pixels, maximum 1000 x 1000 pixels, white background.',
  },
  vahan: {
    photo: 'Sarathi driving licence photo. JPEG only, 10KB - 20KB, 35mm x 45mm, white background.',
    signature: 'Sarathi driving licence signature upload. Signature scan, JPEG only, 10KB - 20KB, 30x10mm strip, black ink on white paper.',
  },
  passport: {
    photo: 'Passport Seva GPSP photo. Exactly 630x810 pixels, JPEG only, 10KB - 250KB, white background.',
    signature: 'Passport signature upload. Signature scan, JPEG only, under 100KB, white paper background.',
  },
  ssc: {
    photo: 'SSC OTR photo upload. JPEG only, 20KB - 50KB, exactly 200x230 pixels, white background.',
    signature: 'SSC signature upload. Signature scan, JPEG only, 10KB - 20KB, 140x60 pixels, running handwriting.',
  },
  nsp: {
    photo: 'NSP OTR scholarship photo. JPEG only, under 50KB, 200x230 pixels, white background.',
    income: 'NSP income certificate upload. PDF only, maximum 500KB, stamp and signature of issuing authority visible.',
  },
};

interface DocBridgeWidgetProps {
  portalId: 'epfo' | 'upsc' | 'vahan' | 'passport' | 'ssc' | 'nsp';
  requirements: string;
  docType?: string;
  onSuccess?: (result: any) => void;
  // Multi-document batch mode — only where the portal genuinely accepts
  // several files in ONE upload (e.g. NSP multi-cert, Sarathi DMS). Defaults
  // to single-select, which every per-slot card wants.
  multi?: boolean;
  // Hand-off mode for focused OTR cards (e.g. UPSC photo/signature): the portal
  // owns the hidden native <input>, the "Upload from device" card triggers its
  // .click(), and the chosen file is fed back in through deviceFile.
  deviceInputId?: string;
  deviceFile?: File | null;
  onDeviceFileChange?: (file: File | null) => void;
  // Portal-specific override for the source-chooser heading/subtext
  // (e.g. EPFO KYC). Falls back to the shared w.where / w.whereSub copy.
  sourceHeading?: string;
  sourceSub?: string;
  // Which source cards the chooser offers. Defaults to DigiLocker + device.
  // 'camera' opens a live-photo capture, 'draw' a signature pad; the captured
  // file flows through the same pipeline as any other upload.
  captureModes?: Array<'digilocker' | 'device' | 'camera' | 'draw'>;
  // Trust micro-copy rendered under the chooser heading (e.g. Passport's
  // auto-crop/compress promise).
  assistantNote?: string;
  // Optional refs the parent guide can use to observe widget state/source for
  // per-site narration without coupling the widget to the guide.
  // Guide passes mutable refs (from useRef) so the widget can mirror state/source.
  widgetStateRef?: React.MutableRefObject<string>;
  sourceRef?: React.MutableRefObject<string>;
  // Optional callback the parent guide uses to react to widget phase changes
  // (e.g. delayed 'ready to upload' narration after optimization).
  onWidgetPhase?: (phase: string) => void;
  // DigiLocker identity to sign in as (first name). Defaults to the portal's
  // persona — override for multi-persona demos on one portal (e.g. Passport
  // Kabir vs Ramesh get separate vaults).
  digiLockerUser?: string;
}

export default function DocBridgeWidget({ 
  portalId, 
  requirements, 
  docType,
  onSuccess,
  multi = false,
  deviceInputId,
  deviceFile,
  onDeviceFileChange,
  sourceHeading,
  sourceSub,
  captureModes = ['digilocker', 'device'],
  assistantNote,
  widgetStateRef,
  sourceRef,
  onWidgetPhase,
  digiLockerUser,
}: DocBridgeWidgetProps) {
  const { t, lang } = useLang();
  const [state, setState] = useState<WidgetState>('idle');
  const notifyPhase = (s: WidgetState) => { if (onWidgetPhase) onWidgetPhase(s); if (widgetStateRef) widgetStateRef.current = s; };
  const [showModal, setShowModal] = useState(false);
  const [showSaveAuthModal, setShowSaveAuthModal] = useState(false);
  const [isSaveAuthed, setIsSaveAuthed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingResult, setProcessingResult] = useState<any>(null);
  const [selectedAsset, setSelectedAsset] = useState<DigiLockerAsset | null>(null);
  const [source, setSource] = useState<'digilocker' | 'device'>('digilocker');
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [batchProgress, setBatchProgress] = useState<{ done: number; total: number } | null>(null);
  const [lastSaved, setLastSaved] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showPad, setShowPad] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // Inside the Guide the companion owns preview/success narration (per-site
  // copy, delayed so the optimizing readout finishes) — speaking here too
  // would cancel the overlay mid-sentence. Standalone slots keep their own.
  const guided = !!onWidgetPhase;
  useVoiceGuide(isVoiceOn() && !guided && state === 'success', t('w.congrats'), voiceLang(lang));
  useVoiceGuide(isVoiceOn() && !guided && state === 'previewing', t('w.optimizedReady'), voiceLang(lang));
  // Gently guide through errors — only when voice is opted in.
  useVoiceGuide(isVoiceOn() && !!error, error ?? '', voiceLang(lang));

  const startDigiLocker = () => {
    setError(null);
    setShowModal(true);
    setState('authenticating');
    notifyPhase('authenticating');
    if (sourceRef) sourceRef.current = 'digilocker';
  };

  const startManualUpload = () => {
    setError(null);
    if (sourceRef) sourceRef.current = 'device';
    if (deviceInputId) {
      // Carve-out mode: open the portal's hidden native input instead of the
      // widget's internal one so the OTR card owns the browser dialog.
      document.getElementById(deviceInputId)?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  // Files from live capture (camera / signature pad) join the same pipeline:
  // in carve-out mode they are handed to the portal's flow, otherwise they
  // are processed directly like a device upload.
  const handleCapturedFile = (file: File) => {
    setShowCamera(false);
    setShowPad(false);
    setError(null);
    if (sourceRef) sourceRef.current = 'device';
    if (deviceInputId) {
      onDeviceFileChange?.(file);
    } else {
      setSource('device');
      void handleManualFile(file);
    }
  };
  const prevExternalRef = useRef<File | null>(null);
  useEffect(() => {
    if (!deviceInputId || !deviceFile || deviceFile === prevExternalRef.current) return;
    prevExternalRef.current = deviceFile;
    setSource('device');
    void handleManualFile(deviceFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceFile, deviceInputId]);

  const [lastBlob, setLastBlob] = useState<Blob | null>(null);
  const [lastMeta, setLastMeta] = useState<{ name: string; type: string; size_mb: number; optimizedFor?: string } | null>(null);
  const [isRecompressing, setIsRecompressing] = useState(false);

  const runProcessing = async (blob: Blob, meta: { name: string; type: string; size_mb: number; optimizedFor?: string }, opts?: { aggressive?: boolean; rotation?: number; enhance?: boolean; targetKB?: number; targetWidth?: number; targetHeight?: number }) => {
    const conn = (navigator as any)?.connection?.effectiveType;
    if ((conn === '2g' || conn === 'slow-2g') && !opts?.aggressive && !opts?.rotation && !opts?.enhance && !opts?.targetKB) opts = { ...opts, aggressive: true };
    try {
      setLastBlob(blob);
      setLastMeta(meta);
      setAiCleaned(false);
      const portalName = portalDisplayName(portalId);

      setState('parsing');
      notifyPhase('parsing');
      await dwellForSpeech(`${t('ov.reading')} ${portalName}`, 1600);
      const constraint = await parsePortalConstraints(requirements);
      setState('processing');
      notifyPhase('processing');
      await dwellForSpeech(`${t('ov.optimizingFor')} ${portalName}`, 400);
      const result = await processDocument(blob, constraint, meta, opts);
      await dwellForSpeech('', 2000);

      setProcessingResult(result);
      setState('previewing');
      notifyPhase('previewing');
      return result;
    } catch (err: any) {
      setError(err?.message || t('w.errProcess'));
      setState('idle');
      return null;
    }
  };

  const handleRecompress = async () => {
    if (!lastBlob || !lastMeta) return;
    setIsRecompressing(true);
    setError(null);
    await runProcessing(lastBlob, lastMeta, { aggressive: true });
    setIsRecompressing(false);
  };
  const handleRetake = () => {
    setError(null);
    setState('idle');
    notifyPhase('idle');
  };
  const handleAdjust = async (choice: { targetKB: number; aggressive: boolean; targetWidth?: number; targetHeight?: number }) => {
    if (!lastBlob || !lastMeta) return;
    setError(null);
    await runProcessing(lastBlob, lastMeta, { targetKB: choice.targetKB, aggressive: choice.aggressive, targetWidth: choice.targetWidth, targetHeight: choice.targetHeight });
  };
  const handleEnhance = async () => {
    if (!lastBlob || !lastMeta) return;
    setError(null);
    await runProcessing(lastBlob, lastMeta, { enhance: true });
  };
  // Optional consent-gated AI pass (passport): background other than white?
  // Narrates the AI removal over a 2s micro-animation, then lands on
  // save-or-submit guidance — no reprocessing loop.
  const [aiCleaned, setAiCleaned] = useState(false);
  const handleAiCleanup = async () => {
    if (!lastBlob || !lastMeta) return;
    setError(null);
    setAiCleaned(false);
    await dwellForSpeech(t('w.aiWorking'), 2000);
    setAiCleaned(true);
  };

  const handleAssetSelected = async (asset: DigiLockerAsset) => {
    setSelectedAsset(asset);
    setSource('digilocker');
    if (sourceRef) sourceRef.current = 'digilocker';
    setShowModal(false);

    const fileBlob = await supabase.fetchAsset(asset.id);
    await runProcessing(fileBlob, {
      name: asset.name,
      type: asset.type,
      size_mb: asset.size_mb,
      optimizedFor: asset.source === 'optimized' ? asset.optimizedFor : undefined,
    });
  };

  // B3 — multi-document batch: N DigiLocker assets → N previews → one Submit all.
  const handleAssetsSelected = async (assets: DigiLockerAsset[]) => {
    setSource('digilocker');
    if (sourceRef) sourceRef.current = 'digilocker';
    setShowModal(false);
    setSelectedAsset(assets[0] ?? null);
    const blobs = await supabase.fetchAssets(assets.map((a) => a.id));
    await runBatchProcessing(assets.map((asset, i) => makeBatchItem({
      name: asset.name,
      type: asset.type,
      size_mb: asset.size_mb,
      blob: blobs[i],
      optimizedFor: asset.source === 'optimized' ? asset.optimizedFor : undefined,
    })));
  };

  const handleManualFile = async (input: File | FileList | null) => {
    if (!input) return;
    const isList = typeof (input as FileList).length === 'number' && ((input as FileList).length as number) > 0;
    const files: File[] = isList ? Array.from(input as FileList) : [input as unknown as File];
    const batch = files.filter(Boolean).slice(0, 3);
    if (batch.length > 1) {
      setSource('device');
      await runBatchProcessing(batch.map((f) => makeBatchItem({
        name: f.name,
        type: f.type,
        size_mb: f.size / (1024 * 1024),
        blob: f,
      })));
      return;
    }
    const file = batch[0] as File;
    setSelectedAsset({ id: 'manual', name: file.name, type: file.type, size_mb: file.size / (1024 * 1024), url: '', owner: 'ramesh' });
    setSource('device');
    await runProcessing(file, { name: file.name, type: file.type, size_mb: file.size / (1024 * 1024) });
  };

  const makeBatchItem = (meta: { name: string; type: string; size_mb: number; blob: Blob; optimizedFor?: string }): BatchItem => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: meta.name,
    type: meta.type,
    blob: meta.blob,
    size_mb: meta.size_mb,
    docType: (docType as BatchItem['docType'] | undefined) ?? inferDocType(meta.name),
    optimizedFor: meta.optimizedFor,
    status: 'queued',
  });

  const requirementFor = (item: BatchItem): string =>
    SLOT_REQUIREMENTS[portalId]?.[item.docType] ?? requirements;

  // Sequential per-file queue — each item is parsed + optimized against its own
  // slot constraint, then all results render together in the batch grid.
  const runBatchProcessing = async (items: BatchItem[]) => {
    setError(null);
    setBatchItems(items.map((it) => ({ ...it, status: 'processing' as BatchItem['status'] })));
    setBatchProgress({ done: 0, total: items.length });
    setState('processing');
    // One full narration of the optimizing line up front; per-item waits stay short.
    await dwellForSpeech(`${t('ov.optimizingFor')} ${portalDisplayName(portalId)}`, 300);
    const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      try {
        await wait(i === 0 ? 0 : 250);
        setBatchProgress({ done: i, total: items.length });
        const constraint = await parsePortalConstraints(requirementFor(item));
        await wait(300);
        const result = await processDocument(item.blob, constraint, { name: item.name, type: item.type, size_mb: item.size_mb, optimizedFor: item.optimizedFor });
        setBatchItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, result, status: 'done' as BatchItem['status'] } : it)));
      } catch (err: any) {
        setBatchItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, status: 'error' as BatchItem['status'], error: err?.message || t('w.errProcess') } : it)));
      }
    }
    setBatchProgress(null);
    setState('previewing_batch');
  };

  const reitem = (id: string) => setBatchItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: 'processing' as BatchItem['status'] } : it)));

  const reprocessItem = async (id: string, opts?: { aggressive?: boolean; enhance?: boolean; targetKB?: number; targetWidth?: number; targetHeight?: number }) => {
    const item = batchItems.find((it) => it.id === id);
    if (!item || !item.result) return;
    setError(null);
    reitem(id);
    setBatchProgress({ done: 0, total: 1 });
    setState('processing');
    await dwellForSpeech(`${t('ov.optimizingFor')} ${portalDisplayName(portalId)}`, 300);
    try {
      const constraint = await parsePortalConstraints(requirementFor(item));
      const result = await processDocument(item.blob, constraint, { name: item.name, type: item.type, size_mb: item.size_mb, optimizedFor: item.optimizedFor }, opts);
      setBatchItems((prev) => prev.map((it) => (it.id === id ? { ...it, result, status: 'done' as BatchItem['status'], error: undefined, submitted: undefined, submitError: undefined } : it)));
    } catch (err: any) {
      setBatchItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: 'error' as BatchItem['status'], error: err?.message || t('w.errProcess') } : it)));
    }
    setBatchProgress(null);
    setState('previewing_batch');
  };

  const handleBatchAdjust = (id: string, choice: { targetKB: number; aggressive: boolean; targetWidth?: number; targetHeight?: number }) => reprocessItem(id, { targetKB: choice.targetKB, aggressive: choice.aggressive, targetWidth: choice.targetWidth, targetHeight: choice.targetHeight });
  const handleBatchRecompress = (id: string) => reprocessItem(id, { aggressive: true });
  const handleBatchEnhance = (id: string) => reprocessItem(id, { enhance: true });
  const handleBatchRemove = (id: string) => {
    const next = batchItems.filter((it) => it.id !== id);
    setBatchItems(next);
    if (next.length === 0) {
      setState('idle');
      setProcessingResult(null);
      setSelectedAsset(null);
    }
  };

  const endpointFor = (): string =>
    portalId === 'epfo'
      ? '/api/legacy-epfo'
      : portalId === 'vahan'
        ? '/api/legacy-vahan'
        : portalId === 'passport'
          ? '/api/legacy-passport'
          : portalId === 'ssc'
            ? '/api/legacy-ssc'
            : portalId === 'nsp'
              ? '/api/legacy-nsp'
              : '/api/legacy-upsc';

  // Single-file submit — shared by the standalone flow and each batch item.
  const submitOne = async (args: { result: any; name: string; slot?: BatchItem['docType']; saveToDigiLocker: boolean }): Promise<{ success: boolean; error?: string }> => {
    const { result, name, slot, saveToDigiLocker } = args;
    try {
      let blobToSend: Blob = result.processed.blob;
      try {
        const { embedDocBridgeMetadata } = await import('@/lib/processor');
        const hash = await crypto.subtle.digest('SHA-256', await result.original.blob.slice(0, 65536).arrayBuffer()).then(b => Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('').slice(0,16)).catch(()=>undefined);
        blobToSend = await embedDocBridgeMetadata(blobToSend, { portalId, source, hash });
      } catch {}
      // Dual-document portals (passport / ssc / nsp) tell the legacy
      // endpoint which slot is being filled: photo, signature, or income.
      const slotUsed = slot ?? docType;
      if (saveToDigiLocker) {
        const ext = result.constraint.format;
        const base = (result.original.assetName || name || 'Document').replace(/\.[^.]+$/, '');
        const storedName = `${base} (${portalDisplayName(portalId)}-ready).${ext}`;
        const dims = result.processed.dimensions ? `${result.processed.dimensions.width}x${result.processed.dimensions.height}` : undefined;
        // Persist the resized copy into the vault with auto-tags so the same
        // citizen can reuse it on another portal (mock, survives via localStorage).
        await supabase.storeAsset({
          name: storedName,
          type: blobToSend.type,
          blob: blobToSend,
          portalId,
          portalName: portalDisplayName(portalId),
          tags: [String(slotUsed || docType || 'doc'), dims].filter(Boolean) as string[],
        });
      }
      const formData = new FormData();
      const extension = result.constraint.format === 'pdf' ? 'pdf' : 'jpg';
      formData.append('file', blobToSend, `docbridge-ready.${extension}`);

      // EPFO's legacy endpoint expects the account number as a separate form value.
      if (portalId === 'epfo') {
        formData.append('account_number', '3847 2910 5678');
      }
      // Dual-document portals (passport / ssc / nsp) tell the legacy
      // endpoint which slot is being filled: photo, signature, or income.
      if (slotUsed && slotUsed !== 'other') {
        formData.append('doc', slotUsed);
      }

      // Never spin forever: a hung dev-server/legacy endpoint aborts into
      // a retriable error instead of a permanent submitting overlay.
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 20000);
      let response: Response;
      try {
        response = await fetch(endpointFor(), {
          method: 'POST',
          body: formData,
          signal: ctrl.signal,
        });
      } finally {
        clearTimeout(timer);
      }

      const data = await response.json();
      return data.success ? { success: true } : { success: false, error: data.error || 'Submission failed' };
    } catch (err) {
      return { success: false, error: t('w.errNetwork') };
    }
  };

  const handleSubmit = async (saveToDigiLocker: boolean = true) => {
    if (!processingResult) return;
    setState('submitting');
    await dwellForSpeech(t('ov.submitting'), 800);
    const out = await submitOne({ result: processingResult, name: processingResult.original.assetName || 'Document', slot: docType as BatchItem['docType'], saveToDigiLocker });
    if (out.success) {
      setLastSaved(saveToDigiLocker);
      setState('success');
      notifyPhase('success');
      onSuccess?.({ ...out, result: processingResult });
    } else {
      setError(out.error || 'Submission failed');
      setState('previewing');
      notifyPhase('previewing');
    }
  };

  // Batch "Submit all" — sequential submit with one retry per file so a single
  // flaky legacy-* call can't fail the whole batch (PRD §5 risk mitigation).
  // Only items that have a result and aren't already submitted are sent, which
  // lets the same routine serve both "Submit all" and "Retry failed".
  const submitSequential = async () => {
    const toSubmit = batchItems.filter((it) => it.result && it.submitted !== true);
    if (toSubmit.length === 0) return;
    setState('submitting');
    await dwellForSpeech(t('ov.submitting'), 800);
    let failedCount = 0;
    for (const item of toSubmit) {
      let out = await submitOne({ result: item.result!, name: item.name, slot: item.docType, saveToDigiLocker: true });
      if (!out.success) {
        out = await submitOne({ result: item.result!, name: item.name, slot: item.docType, saveToDigiLocker: true });
      }
      if (!out.success) failedCount += 1;
      setBatchItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, submitted: out.success, submitError: out.success ? undefined : out.error } : it)));
    }
    if (failedCount === 0) {
      setLastSaved(true);
      setState('success');
      onSuccess?.({ batch: true, count: toSubmit.length });
    } else {
      setState('previewing_batch');
    }
  };

  const handleBatchSubmit = () => submitSequential();
  const handleRetryFailed = () => submitSequential();

  const handleReset = () => {
    setState('idle');
    setError(null);
    setAiCleaned(false);
    setProcessingResult(null);
    setSelectedAsset(null);
    setBatchItems([]);
    setBatchProgress(null);
    setLastSaved(false);
    setIsSaveAuthed(false);
    setShowSaveAuthModal(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Guided multi-step flows reuse one widget across slots (photo → signature).
  // When the slot changes, reset to the source chooser instead of lingering
  // on the previous slot's success/preview screen.
  const slotKeyRef = useRef(docType ?? portalId);
  useEffect(() => {
    if (slotKeyRef.current !== (docType ?? portalId)) {
      slotKeyRef.current = docType ?? portalId;
      handleReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const handleExternalDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    if (deviceInputId) {
      const input = document.getElementById(deviceInputId) as HTMLInputElement | null;
      if (input) {
        const dt = new DataTransfer();
        dt.items.add(f);
        input.files = dt.files;
      }
    } else if (fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(f);
      fileInputRef.current.files = dt.files;
    }
    onDeviceFileChange?.(f);
  };

  return (
    <div className="relative">
      {/* Source chooser */}
      {state === 'idle' && (
        <div className="space-y-2">
          <div className="rounded-xl border p-4" style={{ borderColor: COLORS.gray[300], backgroundColor: COLORS.primaryLight }}>
            {deviceInputId && deviceFile ? (
              /* Carve-out: a file was chosen through the portal's native input. */
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: '#fff', color: COLORS.success }}>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold" style={{ color: COLORS.gray[800] }}>{t('w.fileSelected')}</p>
                  <p className="truncate text-xs" style={{ color: COLORS.gray[600] }}>{deviceFile.name}</p>
                  <p className="text-[11px] font-semibold" style={{ color: COLORS.success }}>✓ {t('w.fileChosen')}</p>
                </div>                  <button
                    type="button"
                    onClick={() => (deviceInputId
                      ? document.getElementById(deviceInputId)?.click()
                      : fileInputRef.current)?.click()}
                    className="shrink-0 rounded-full border bg-white px-3 py-1.5 text-xs font-bold hover:-translate-y-0.5"
                    style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                  >
                    {t('w.changeFile')}
                  </button>
                <button
                  type="button"
                  onClick={() => onDeviceFileChange?.(null)}
                  className="shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold"
                  style={{ borderColor: COLORS.gray[300], color: COLORS.gray[600] }}
                >
                  {t('w.removeDoc')}
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold mb-0.5" style={{ color: COLORS.primary }}>{sourceHeading ?? t('w.where')}</p>
                <p className="text-xs mb-3" style={{ color: COLORS.gray[600] }}>
                  {boldDocBridge(sourceSub ?? t('w.whereSub'))}
                </p>
                {assistantNote && (
                  <p className="mb-3 flex items-start gap-1.5 text-xs leading-5" style={{ color: '#166534' }}>
                    <span aria-hidden="true">✨</span>
                    <span>{boldDocBridge(assistantNote)}</span>
                  </p>
                )}
                <div className="grid gap-2.5 pb-0.5 sm:grid-cols-2">
                  {captureModes.includes('digilocker') && (
                    <SourceOption
                      title={t('w.fromDigi')}
                      badge="Recommended"
                      description={t('w.fromDigiSub')}
                      icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                      onClick={startDigiLocker}
                    />
                  )}
                  {captureModes.includes('camera') && (
                    <SourceOption
                      title={t('w.takePhoto')}
                      description={t('w.takePhotoSub')}
                      icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                      onClick={() => { setError(null); setShowCamera(true); }}
                    />
                  )}
                  {captureModes.includes('draw') && (
                    <SourceOption
                      title={t('w.drawSign')}
                      description={t('w.drawSignSub')}
                      icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>}
                      onClick={() => { setError(null); setShowPad(true); }}
                    />
                  )}
                  {captureModes.includes('device') && (
                    <SourceOption
                      title={t('w.fromDevice')}
                      description={deviceInputId ? `${t('w.fromDeviceSub')} ${t('w.orDrag')}` : t('w.fromDeviceSub')}
                      icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>}
                      onClick={startManualUpload}
                      {...(deviceInputId ? {
                        onDragOver: (e: React.DragEvent) => e.preventDefault(),
                        onDrop: handleExternalDrop,
                        dragHint: true,
                      } : {})}
                    />
                  )}
                </div>
              </>
            )}
          </div>
          <PrivacyBadge />
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*,.pdf" multiple={multi} className="hidden" onChange={(e) => handleManualFile(e.target.files?.[0] ? (e.target.files as any) : null)} />

      {/* Error Message */}
      {error && (
        <div 
          className="mt-4 p-4 rounded-lg flex items-center gap-3"
          style={{ backgroundColor: COLORS.errorLight, color: COLORS.error }}
          role="alert"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
          <button 
            onClick={handleReset}
            className="ml-auto underline hover:no-underline"
          >
            {t('w.tryAgain')}
          </button>
        </div>
      )}

      {/* Loading States */}
      {['authenticating', 'parsing', 'processing', 'submitting'].includes(state) && (
        <ProcessingOverlay state={state} source={source} portalId={portalId} batchProgress={batchProgress ?? undefined} />
      )}

      {/* Preview Panel — single file or batch grid */}
      {state === 'previewing' && processingResult && !batchItems.length && (
        <PreviewPanel
          result={processingResult}
          portalId={portalId}
          source={source}
          isSaveAuthed={isSaveAuthed}
          onRequestSaveAuth={() => setShowSaveAuthModal(true)}
          onRecompress={handleRecompress}
          isRecompressing={isRecompressing}
          onAdjust={handleAdjust}
          onEnhance={handleEnhance}
          onAiCleanup={portalId === 'passport' ? handleAiCleanup : undefined}
          aiCleaned={aiCleaned}
          onSubmit={handleSubmit}
          onCancel={handleReset}
        />
      )}

      {state === 'previewing_batch' && batchItems.length > 0 && (
        <PreviewPanel
          portalId={portalId}
          source={source}
          items={batchItems.map((it) => ({
            id: it.id,
            name: it.name,
            docType: it.docType,
            result: it.result,
            status: it.status,
            submitted: it.submitted,
            submitError: it.submitError,
            error: it.error,
          }))}
          onSubmitBatch={handleBatchSubmit}
          onRetryFailed={handleRetryFailed}
          onItemAdjust={handleBatchAdjust}
          onItemRecompress={handleBatchRecompress}
          onItemEnhance={handleBatchEnhance}
          onRemoveItem={handleBatchRemove}
          onCancel={handleReset}
        />
      )}

      {/* Success State */}
      {state === 'success' && (
        <div 
          className="p-6 rounded-lg text-center"
          style={{ backgroundColor: COLORS.successLight }}
        >
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: COLORS.success }}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.success }}>
            {batchItems.length > 0 ? t('w.batchDone') : t('w.success')}
          </h3>
          <p className="text-gray-600 mb-4">
            {batchItems.length > 0 ? t('w.batchDoneSub') : t('w.successSub')}
          </p>
          {lastSaved && (
            <div className="mb-4 inline-flex max-w-full items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-xs font-bold" style={{ borderColor: COLORS.success, color: COLORS.success }}>
              ✦ {t('w.savedTag')}
            </div>
          )}
          <button
            onClick={handleReset}
            className="px-6 py-2 rounded-lg font-semibold text-white transition-colors"
            style={{ backgroundColor: COLORS.primary }}
          >
            {t('w.processAnother')}
          </button>
        </div>
      )}

      {/* Live capture — camera / signature pad feed the same pipeline */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCapturedFile}
          onClose={() => setShowCamera(false)}
          onFallback={startManualUpload}
        />
      )}
      {showPad && (
        <SignaturePad
          onCapture={handleCapturedFile}
          onClose={() => setShowPad(false)}
        />
      )}

      {/* DigiLocker Modal — fetch flow */}
      {showModal && (
        <DigiLockerModal
          portalId={portalId}
          signInName={digiLockerUser ?? PORTALS.find(p => p.id === portalId)?.persona?.name ?? 'the citizen'}
          onClose={() => {
            setShowModal(false);
            setState('idle');
          }}
          onAssetSelected={handleAssetSelected}
          onAssetsSelected={multi ? handleAssetsSelected : undefined}
        />
      )}

      {/* DigiLocker Modal — save-auth flow for device uploads */}
      {showSaveAuthModal && (
        <DigiLockerModal
          portalId={portalId}
          signInName={digiLockerUser ?? PORTALS.find(p => p.id === portalId)?.persona?.name ?? 'the citizen'}
          onClose={() => setShowSaveAuthModal(false)}
          onAssetSelected={() => {}}
          onAuthenticated={() => {
            setIsSaveAuthed(true);
            setShowSaveAuthModal(false);
          }}
        />
      )}
    </div>
  );
}

function SourceOption({ title, description, icon, badge, onClick, onDragOver, onDrop, dragHint }: { title: string; description: string; icon: React.ReactNode; badge?: string; onClick: () => void; onDragOver?: (e: React.DragEvent) => void; onDrop?: (e: React.DragEvent) => void; dragHint?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="group relative flex cursor-pointer flex-col items-start gap-1.5 rounded-lg border bg-white p-3.5 text-left transition-all duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ borderColor: COLORS.gray[300], ...(dragHint ? { borderStyle: 'dashed' } : {}) }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.primary; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.gray[300]; }}
    >
      {badge && (
        <span
          className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{ backgroundColor: COLORS.successLight, color: COLORS.success }}
        >
          {badge}
        </span>
      )}
      <span className="flex w-full items-center gap-2.5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md" style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }}>
          {icon}
        </span>
        <span className="flex-1 text-sm font-bold" style={{ color: COLORS.gray[800] }}>{title}</span>
        <span aria-hidden="true" className="text-lg font-bold transition-transform duration-200 group-hover:translate-x-1" style={{ color: COLORS.primary }}>→</span>
      </span>
      <span className="block text-xs leading-5" style={{ color: COLORS.gray[500] }}>{description}</span>
    </button>
  );
}
