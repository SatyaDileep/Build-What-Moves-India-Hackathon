'use client';

import type { Lang } from '@/lib/i18n';
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
    welcome: 'DocBridge Assist for EPFO. Choose DigiLocker or your device for the passbook.',
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
    welcome: 'DocBridge Assist for UPSC. Choose DigiLocker or your device for photo and signature.',
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
    welcome: 'DocBridge Assist for Sarathi. Choose DigiLocker or your device for photo and signature.',
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
    welcome: 'DocBridge Assist for Passport Seva. Choose DigiLocker or your device for photo and signature.',
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
    welcome: 'DocBridge Assist for SSC. Choose DigiLocker or your device for photo and signature.',
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
    welcome: 'DocBridge Assist for NSP. Choose DigiLocker or your device for photo and certificate.',
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

const HI_WELCOME: Record<PortalId, string> = {
  epfo: 'EPFO हेतु DocBridge Assist। पासबुक के लिए DigiLocker या अपना डिवाइस चुनें।',
  upsc: 'UPSC हेतु DocBridge Assist। फोटो व हस्ताक्षर के लिए DigiLocker या अपना डिवाइस चुनें।',
  vahan: 'Sarathi हेतु DocBridge Assist। फोटो व हस्ताक्षर के लिए DigiLocker या अपना डिवाइस चुनें।',
  passport: 'Passport Seva हेतु DocBridge Assist। फोटो व हस्ताक्षर के लिए DigiLocker या अपना डिवाइस चुनें।',
  ssc: 'SSC हेतु DocBridge Assist। फोटो व हस्ताक्षर के लिए DigiLocker या अपना डिवाइस चुनें।',
  nsp: 'NSP हेतु DocBridge Assist। फोटो व प्रमाणपत्र के लिए DigiLocker या अपना डिवाइस चुनें।',
};

const HI_DONE_SINGLE: Record<PortalId, string> = {
  epfo: 'पासबुक अपलोड हो गई। DocBridge Assist पूर्ण हुआ।',
  upsc: 'अपलोड पूर्ण हुआ। DocBridge Assist पूर्ण हुआ।',
  vahan: 'अपलोड पूर्ण हुआ। DocBridge Assist पूर्ण हुआ।',
  passport: 'अपलोड पूर्ण हुआ। DocBridge Assist पूर्ण हुआ।',
  ssc: 'अपलोड पूर्ण हुआ। DocBridge Assist पूर्ण हुआ।',
  nsp: 'अपलोड पूर्ण हुआ। DocBridge Assist पूर्ण हुआ।',
};

function hiCopy(portalId: PortalId): PortalGuideCopy {
  const singleDone = HI_DONE_SINGLE[portalId] ?? HI_DONE_SINGLE.epfo;
  return {
    welcome: HI_WELCOME[portalId] ?? HI_WELCOME.epfo,
    stepIdle: (step, idx, total) =>
      `चरण ${idx} / ${total}। ${step.label}। चुनें यह कहाँ से आएगा — DigiLocker या अपने डिवाइस से अपलोड। DocBridge अगले चरणों में मार्गदर्शन करेगा।`,
    sourcePicked: (step, source) =>
      source === 'digilocker'
        ? `आपने DigiLocker चुना। DocBridge आपकी ${step.label} सुरक्षित रूप से ला रहा है। आपके दस्तावेज़ निजी रहते हैं।`
        : source === 'camera' || source === 'draw'
          ? `आपने लाइव कैप्चर चुना। DocBridge आपकी ${step.label} पढ़ रहा है। आपके दस्तावेज़ निजी रहते हैं।`
          : `आपने अपने डिवाइस से अपलोड चुना। DocBridge आपकी ${step.label} फ़ाइल पढ़ रहा है। आपके दस्तावेज़ निजी रहते हैं।`,
    readyToUpload: (step) =>
      `आपकी ${step.label} अपलोड हेतु तैयार है। देखकर सही लगे तो अपलोड दबाएँ। बाकी DocBridge ने सँभाल लिया है।`,
    stepDone: (step, idx, total) =>
      total > 1
        ? `चरण ${idx} / ${total} पूर्ण — ${step.label} अपलोड हो गई।`
        : singleDone,
  };
}

export function getGuideCopy(portalId: PortalId, lang: Lang = 'en'): PortalGuideCopy {
  if (lang === 'hi') return hiCopy(portalId);
  return SITE[portalId] ?? SITE.epfo;
}
