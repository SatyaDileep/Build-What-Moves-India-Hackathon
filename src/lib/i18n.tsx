'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type Lang = 'en' | 'hi';

const dict: Record<string, { en: string; hi: string }> = {
  'gov.ofIndia': { en: 'Government of India', hi: 'भारत सरकार' },
  'gov.ministry': { en: 'Ministry of Electronics & Information Technology', hi: 'इलेक्ट्रॉनिकी और सूचना प्रौद्योगिकी मंत्रालय' },
  'nav.home': { en: 'Home', hi: 'मुखपृष्ठ' },
  'nav.services': { en: 'Services', hi: 'सेवाएँ' },
  'nav.help': { en: 'Help', hi: 'सहायता' },
  'nav.contact': { en: 'Contact', hi: 'संपर्क' },
  'nav.offline': { en: 'Offline-ready · 0 calls', hi: 'ऑफ़लाइन-रेडी · 0 कॉल' },
  'nav.backHome': { en: 'Back to DocBridge Home', hi: 'DocBridge होम पर वापस' },
  'auth.login': { en: 'Login', hi: 'लॉगिन' },
  'auth.loginId': { en: 'Login ID', hi: 'लॉगिन आईडी' },
  'auth.password': { en: 'Password', hi: 'पासवर्ड' },
  'auth.signInContinue': { en: 'Sign In and Continue', hi: 'साइन इन करें और आगे बढ़ें' },
  'auth.forgot': { en: 'Forgot Password', hi: 'पासवर्ड भूल गए' },
  'auth.forgotLogin': { en: 'Forgot Login ID / Password', hi: 'लॉगिन आईडी / पासवर्ड भूल गए' },
  'auth.welcome': { en: 'Welcome', hi: 'स्वागत है' },
  'auth.demoPrefill': { en: 'Demo is pre-filled — just click Login.', hi: 'डेमो पहले से भरा है — बस लॉगिन दबाएँ।' },
  'upload.docs': { en: 'Upload Documents', hi: 'दस्तावेज़ अपलोड करें' },
  'upload.photoSig': { en: 'Upload Photo & Signature', hi: 'फोटो और हस्ताक्षर अपलोड करें' },
  'upload.photo': { en: 'Upload photograph & signature', hi: 'फोटो और हस्ताक्षर अपलोड करें' },
  'upload.continuePhoto': { en: 'Continue to Photograph Upload', hi: 'फोटो अपलोड पर आगे बढ़ें' },
  'upload.pending': { en: 'Uploads pending', hi: 'अपलोड लंबित' },
  'upload.accepted': { en: 'Uploads accepted', hi: 'अपलोड स्वीकृत' },
  'login.candidate': { en: 'Candidate Login', hi: 'अभ्यर्थी लॉगिन' },
  'login.member': { en: 'Member Login', hi: 'सदस्य लॉगिन' },
  'login.sarathi': { en: 'Sarathi Login', hi: 'सारथी लॉगिन' },
  'login.applicant': { en: 'Applicant Login', hi: 'आवेदक लॉगिन' },
  'login.student': { en: 'Student Login', hi: 'छात्र लॉगिन' },
  'w.where': { en: 'Where is your document?', hi: 'आपका दस्तावेज़ कहाँ है?' },
  'w.whereSub': { en: 'DocBridge works with either a trusted source or a file you already have.', hi: 'DocBridge विश्वसनीय स्रोत या आपके पास मौजूद फ़ाइल — दोनों से काम करता है।' },
  'w.fromDigi': { en: 'From DigiLocker', hi: 'DigiLocker से' },
  'w.fromDigiSub': { en: 'Authorised, consent-based access to your issued documents.', hi: 'आपके जारी दस्तावेज़ों तक अधिकृत, सहमति-आधारित पहुँच।' },
  'w.fromDevice': { en: 'Upload from device', hi: 'डिवाइस से अपलोड करें' },
  'w.fromDeviceSub': { en: 'Pick a photo or PDF you already have on your phone or computer.', hi: 'अपने फोन या कंप्यूटर पर मौजूद फोटो या PDF चुनें।' },
  'w.ready': { en: 'Ready to submit', hi: 'जमा करने के लिए तैयार' },
  'w.readySub': { en: 'The optimized copy is sized to meet portal upload rules', hi: 'अनुकूलित प्रति पोर्टल अपलोड नियमों के अनुसार तैयार है' },
  'w.before': { en: 'Before — Original', hi: 'पहले — मूल' },
  'w.after': { en: 'After — Optimized ✓', hi: 'बाद में — अनुकूलित ✓' },
  'w.download': { en: 'Download', hi: 'डाउनलोड' },
  'w.adjustSize': { en: 'Adjust size', hi: 'साइज़ बदलें' },
  'w.cancel': { en: 'Cancel', hi: 'रद्द करें' },
  'w.tryAgain': { en: 'Try Again', hi: 'पुनः प्रयास करें' },
  'w.chooseOther': { en: 'Choose different document', hi: 'दूसरा दस्तावेज़ चुनें' },
  'w.reqsMet': { en: 'Requirements Met', hi: 'आवश्यकताएँ पूर्ण' },
  'w.overLimit': { en: 'Size still over limit', hi: 'साइज़ अभी भी सीमा से अधिक' },
  'w.format': { en: 'Format', hi: 'प्रारूप' },
  'w.maxSize': { en: 'Max size', hi: 'अधिकतम साइज़' },
  'w.minSize': { en: 'Min size', hi: 'न्यूनतम साइज़' },
  'w.dimensions': { en: 'Dimensions', hi: 'आकार' },
  'w.background': { en: 'Background', hi: 'पृष्ठभूमि' },
  'w.yours': { en: 'yours', hi: 'आपकी' },
  'w.over': { en: '— over', hi: '— अधिक' },
  'w.headsUp': { en: 'Heads up', hi: 'ध्यान दें' },
  'w.needsAttn': { en: 'Needs attention before upload', hi: 'अपलोड से पहले ध्यान दें' },
  'w.strongCompress': { en: 'Try stronger compression', hi: 'मज़बूत कंप्रेशन आज़माएँ' },
  'w.compressing': { en: 'Compressing…', hi: 'कंप्रेस हो रहा है…' },
  'w.qualityNote': { en: '(quality will drop slightly)', hi: '(गुणवत्ता थोड़ी घटेगी)' },
  'w.saveBack': { en: 'Save the optimized copy back to DigiLocker', hi: 'अनुकूलित प्रति DigiLocker में सहेजें' },
  'w.saveBackSub': { en: "Next time you need this document for another portal, it's already correctly sized.", hi: 'अगली बार दूसरे पोर्टल के लिए यह पहले से सही साइज़ में मिलेगा।' },
  'w.signInSave': { en: 'Sign in and save to DigiLocker', hi: 'साइन इन करें और DigiLocker में सहेजें' },
  'w.signInSaveSub': { en: 'Connect your DigiLocker — this optimized file will be ready for reuse on other portals.', hi: 'DigiLocker जोड़ें — यह फ़ाइल अन्य पोर्टलों पर पुनः उपयोग हेतु तैयार रहेगी।' },
  'w.signedIn': { en: 'Signed in — will save to DigiLocker', hi: 'साइन इन हो गया — DigiLocker में सहेजा जाएगा' },
  'w.signedInSub': { en: 'This optimized file will be linked to your DigiLocker for reuse.', hi: 'यह फ़ाइल पुनः उपयोग हेतु DigiLocker से जुड़ जाएगी।' },
  'w.change': { en: 'Change', hi: 'बदलें' },
  'w.signInArrow': { en: 'Sign in →', hi: 'साइन इन →' },
  'w.submitTo': { en: 'Submit to', hi: 'जमा करें —' },
  'w.success': { en: 'Success!', hi: 'सफल!' },
  'w.successSub': { en: 'Your document has been successfully processed and submitted.', hi: 'आपका दस्तावेज़ सफलतापूर्वक तैयार और जमा हो गया।' },
  'w.processAnother': { en: 'Process Another Document', hi: 'दूसरा दस्तावेज़ तैयार करें' },
  'w.zoom': { en: 'Zoom 2×', hi: 'ज़ूम 2×' },
  'w.zoomClick': { en: 'Click to zoom 2×', hi: 'ज़ूम के लिए क्लिक करें 2×' },
  'w.meetsRules': { en: 'Meets portal rules', hi: 'पोर्टल नियमों के अनुरूप' },
  'w.smaller': { en: 'smaller', hi: 'छोटा' },
  'adj.title': { en: 'Adjust file size', hi: 'फ़ाइल साइज़ बदलें' },
  'adj.sub': { en: "Fallback if auto result looks soft or still large. Dimensions stay locked to portal rules.", hi: 'यदि ऑटो परिणाम धुंधला या बड़ा लगे तो विकल्प। आयाम पोर्टल नियमों पर स्थिर रहेंगे।' },
  'adj.smallest': { en: 'Smallest', hi: 'सबसे छोटा' },
  'adj.balanced': { en: 'Balanced', hi: 'संतुलित' },
  'adj.sharpest': { en: 'Sharpest', hi: 'सबसे स्पष्ट' },
  'adj.safe': { en: 'Safest for strict limits', hi: 'कठोर सीमा हेतु सबसे सुरक्षित' },
  'adj.mix': { en: 'Size + clarity mix', hi: 'साइज़ + स्पष्टता का मेल' },
  'adj.best': { en: 'Best clarity under limit', hi: 'सीमा में सर्वोत्तम स्पष्टता' },
  'adj.apply': { en: 'Apply & re-optimize', hi: 'लागू करें और पुनः अनुकूलित करें' },
  'ov.reading': { en: 'Reading portal rules…', hi: 'पोर्टल नियम पढ़े जा रहे हैं…' },
  'ov.optimizing': { en: 'Optimizing…', hi: 'अनुकूलित हो रहा है…' },
  'ov.submitting': { en: 'Submitting…', hi: 'जमा हो रहा है…' },
  'ov.working': { en: 'Working on your document', hi: 'आपके दस्तावेज़ पर काम हो रहा है' },
  'ov.voiceOn': { en: '🔊 Voice on', hi: '🔊 आवाज़ चालू' },
  'ov.voiceOff': { en: '🔈 Voice off', hi: '🔇 आवाज़ बंद' },
  'ov.fetching': { en: 'Fetching from DigiLocker…', hi: 'DigiLocker से लाया जा रहा है…' },
  'ov.fileAdded': { en: 'File added from your device', hi: 'आपके डिवाइस से फ़ाइल जुड़ी' },
  'ov.consent': { en: 'Consent-based', hi: 'सहमति-आधारित' },
  'ov.localFile': { en: 'Local file', hi: 'स्थानीय फ़ाइल' },
  'ov.optimizingFor': { en: 'Optimizing for', hi: 'के लिए अनुकूलन' },
  'ov.validating': { en: 'Validating…', hi: 'जाँच हो रही है…' },
  'ov.checkFormat': { en: 'Checking format & size', hi: 'प्रारूप व साइज़ जाँच' },
  'ov.fetched': { en: 'Fetched from DigiLocker', hi: 'DigiLocker से प्राप्त' },
  'ov.fileReady': { en: 'File ready from device', hi: 'डिवाइस से फ़ाइल तैयार' },
  'ov.verified': { en: 'Verified', hi: 'सत्यापित' },
  'ov.validSubmit': { en: 'Validating & submitting', hi: 'जाँच व जमा' },
  'ov.almost': { en: 'Almost done…', hi: 'लगभग पूर्ण…' },
  'privacy.title': { en: '100% browser-private', hi: '100% ब्राउज़र-प्राइवेट' },
  'privacy.sub': { en: 'Zero storage · No training · DigiLocker consent', hi: 'शून्य स्टोरेज · कोई प्रशिक्षण नहीं · DigiLocker सहमति' },
  'privacy.calls': { en: '0 network calls during processing', hi: 'प्रोसेसिंग में 0 नेटवर्क कॉल' },
  'dl.title': { en: 'Connect DigiLocker', hi: 'DigiLocker जोड़ें' },
  'dl.consent': { en: 'Consent-based fetch. DocBridge never stores your files.', hi: 'सहमति-आधारित प्राप्ति। DocBridge आपकी फ़ाइलें संग्रहित नहीं करता।' },
  'dl.select': { en: 'Select a document to continue', hi: 'आगे बढ़ने हेतु दस्तावेज़ चुनें' },
  'dl.fetch': { en: 'Fetch', hi: 'प्राप्त करें' },
  'dl.cancel': { en: 'Cancel', hi: 'रद्द करें' },
  'home.badge': { en: 'Hackathon demo · DigiLocker-ready', hi: 'हैकाथॉन डेमो · DigiLocker-रेडी' },
  'home.title': { en: "One upload layer for India's many official portals.", hi: 'भारत के अनेक सरकारी पोर्टलों हेतु एक अपलोड परत।' },
  'home.login': { en: 'Login to see it in action', hi: 'लॉगिन करके लाइव देखें' },
  'home.pick': { en: 'Pick a portal — login lands you on its real home.', hi: 'पोर्टल चुनें — लॉगिन आपको उसके असली होम पर ले जाएगा।' },
};

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }>({ lang: 'en', setLang: () => {}, t: (k) => k });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  useEffect(() => {
    try {
      const s = localStorage.getItem('docbridge-lang');
      if (s === 'hi' || s === 'en') setLangState(s);
    } catch {}
  }, []);
  useEffect(() => {
    try { document.documentElement.lang = lang === 'hi' ? 'hi' : 'en'; } catch {}
  }, [lang]);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('docbridge-lang', l); } catch {}
  }, []);
  const t = useCallback((k: string) => dict[k]?.[lang] ?? dict[k]?.en ?? k, [lang]);
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`inline-flex items-center rounded-full border border-white/30 bg-white/10 p-0.5 text-xs font-bold ${compact ? '' : ''}`} role="group" aria-label="Language / भाषा">
      {(['en', 'hi'] as Lang[]).map(l => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 transition ${lang === l ? 'bg-white text-[#1E3A8A]' : 'text-white/80 hover:text-white'}`}
        >
          {l === 'en' ? 'EN' : 'हिं'}
        </button>
      ))}
    </div>
  );
}

export function voiceLang(lang: Lang): string {
  return lang === 'hi' ? 'hi-IN' : 'en-IN';
}
