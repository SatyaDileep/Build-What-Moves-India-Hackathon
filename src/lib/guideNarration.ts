'use client';

import { GuideStep } from '@/components/DocBridgeGuide';

export type PortalId = 'epfo' | 'upsc' | 'vahan' | 'passport' | 'ssc' | 'nsp';

export interface PortalGuideCopy {
  /** One-sentence welcome that plays when the modal opens (per portal). */
  welcome: string;
  /** Narration for an active step, before the user has chosen a source. */
  stepIdle: (step: GuideStep, idx: number, total: number) => string;
  /** Narration right after the user picks a source (DigiLocker / device / camera / draw). */
  sourcePicked: (step: GuideStep, source: string) => string;
  /** Narration after optimization finishes — the delayed 'ready to upload' line. */
  readyToUpload: (step: GuideStep) => string;
  /** Narration when the step is done and we move to the next. */
  stepDone: (step: GuideStep, idx: number, total: number) => string;
}

const SITE: Record<PortalId, PortalGuideCopy> = {
  epfo: {
    welcome: 'DocBridge Assist for EPFO. Here is how to upload your passbook. Select an option of your choice — DigiLocker to securely access your documents, or upload from your device. DocBridge will take care of the rest.',
    stepIdle: (step, idx, total) =>
      `Step ${idx} of ${total}. ${step.label}. Choose where it comes from — DigiLocker or upload from your device. DocBridge will guide you through the next steps.`,
    sourcePicked: (step, source) =>
      source === 'digilocker'
        ? `You chose DigiLocker. DocBridge is now securely fetching your passbook. Your documents stay private.`
        : `You chose upload from your device. DocBridge is reading your passbook file. Your documents stay private.`,
    readyToUpload: (step) =>
      `Your ${step.label} is ready to upload. You may verify it looks correct, then tap upload. DocBridge has taken care of the rest.`,
    stepDone: (step, idx, total) =>
      total > 1
        ? `Step ${idx} of ${total} complete — ${step.label} uploaded.`
        : `Passbook uploaded. DocBridge Assist is done.`,
  },
  upsc: {
    welcome: 'DocBridge Assist for UPSC. Here are the steps to upload your photo and signature. Select an option of your choice — DigiLocker to securely access your documents, or upload from your device. DocBridge will take care of the rest.',
    stepIdle: (step, idx, total) =>
      `Step ${idx} of ${total}. ${step.label}. Choose where it comes from — DigiLocker or upload from your device. DocBridge will guide you through the next steps.`,
    sourcePicked: (step, source) =>
      source === 'digilocker'
        ? `You chose DigiLocker. DocBridge is now securely fetching your ${step.label}. Your documents stay private.`
        : `You chose upload from your device. DocBridge is reading your ${step.label} file. Your documents stay private.`,
    readyToUpload: (step) =>
      `Your ${step.label} is ready to upload. You may verify it looks correct, then tap upload. DocBridge has taken care of the rest.`,
    stepDone: (step, idx, total) =>
      total > 1
        ? `Step ${idx} of ${total} complete — ${step.label} uploaded.`
        : `${step.label} uploaded. DocBridge Assist is done.`,
  },
  vahan: {
    welcome: 'DocBridge Assist for Sarathi. Here are the steps to upload your photograph and signature. Select an option of your choice — DigiLocker to securely access your documents, or upload from your device. DocBridge will take care of the rest.',
    stepIdle: (step, idx, total) =>
      `Step ${idx} of ${total}. ${step.label}. Choose where it comes from — DigiLocker or upload from your device. DocBridge will guide you through the next steps.`,
    sourcePicked: (step, source) =>
      source === 'digilocker'
        ? `You chose DigiLocker. DocBridge is now securely fetching your ${step.label}. Your documents stay private.`
        : `You chose upload from your device. DocBridge is reading your ${step.label} file. Your documents stay private.`,
    readyToUpload: (step) =>
      `Your ${step.label} is ready to upload. You may verify it looks correct, then tap upload. DocBridge has taken care of the rest.`,
    stepDone: (step, idx, total) =>
      total > 1
        ? `Step ${idx} of ${total} complete — ${step.label} uploaded.`
        : `${step.label} uploaded. DocBridge Assist is done.`,
  },
  passport: {
    welcome: 'DocBridge Assist for Passport Seva. Here are the steps to upload your photo and signature. Select an option of your choice — DigiLocker to securely access your documents, or upload from your device. DocBridge will take care of the rest.',
    stepIdle: (step, idx, total) =>
      `Step ${idx} of ${total}. ${step.label}. Choose where it comes from — DigiLocker, take a live photo, or upload from your device. DocBridge will guide you through the next steps.`,
    sourcePicked: (step, source) =>
      source === 'digilocker'
        ? `You chose DigiLocker. DocBridge is now securely fetching your ${step.label}. Your documents stay private.`
        : source === 'camera' || source === 'draw'
          ? `You chose a live capture. DocBridge is reading your ${step.label}. Your documents stay private.`
          : `You chose upload from your device. DocBridge is reading your ${step.label} file. Your documents stay private.`,
    readyToUpload: (step) =>
      `Your ${step.label} is ready to upload. You may verify it looks correct, then tap upload. DocBridge has taken care of the rest.`,
    stepDone: (step, idx, total) =>
      total > 1
        ? `Step ${idx} of ${total} complete — ${step.label} uploaded.`
        : `${step.label} uploaded. DocBridge Assist is done.`,
  },
  ssc: {
    welcome: 'DocBridge Assist for SSC. Here are the steps to upload your photo and signature. Select an option of your choice — DigiLocker to securely access your documents, or upload from your device. DocBridge will take care of the rest.',
    stepIdle: (step, idx, total) =>
      `Step ${idx} of ${total}. ${step.label}. Choose where it comes from — DigiLocker or upload from your device. DocBridge will guide you through the next steps.`,
    sourcePicked: (step, source) =>
      source === 'digilocker'
        ? `You chose DigiLocker. DocBridge is now securely fetching your ${step.label}. Your documents stay private.`
        : `You chose upload from your device. DocBridge is reading your ${step.label} file. Your documents stay private.`,
    readyToUpload: (step) =>
      `Your ${step.label} is ready to upload. You may verify it looks correct, then tap upload. DocBridge has taken care of the rest.`,
    stepDone: (step, idx, total) =>
      total > 1
        ? `Step ${idx} of ${total} complete — ${step.label} uploaded.`
        : `${step.label} uploaded. DocBridge Assist is done.`,
  },
  nsp: {
    welcome: 'DocBridge Assist for NSP. Here are the steps to upload your photo and income certificate. Select an option of your choice — DigiLocker to securely access your documents, or upload from your device. DocBridge will take care of the rest.',
    stepIdle: (step, idx, total) =>
      `Step ${idx} of ${total}. ${step.label}. Choose where it comes from — DigiLocker or upload from your device. DocBridge will guide you through the next steps.`,
    sourcePicked: (step, source) =>
      source === 'digilocker'
        ? `You chose DigiLocker. DocBridge is now securely fetching your ${step.label}. Your documents stay private.`
        : `You chose upload from your device. DocBridge is reading your ${step.label} file. Your documents stay private.`,
    readyToUpload: (step) =>
      `Your ${step.label} is ready to upload. You may verify it looks correct, then tap upload. DocBridge has taken care of the rest.`,
    stepDone: (step, idx, total) =>
      total > 1
        ? `Step ${idx} of ${total} complete — ${step.label} uploaded.`
        : `${step.label} uploaded. DocBridge Assist is done.`,
  },
};

export function getGuideCopy(portalId: PortalId): PortalGuideCopy {
  return SITE[portalId] ?? SITE.epfo;
}
