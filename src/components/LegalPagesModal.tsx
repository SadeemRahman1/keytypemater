import React, { useState } from 'react';
import { X, Shield, FileText, Info, Mail, CheckCircle2, Lock, Eye, Globe } from 'lucide-react';
import { UserSettings } from '../types';
import { THEMES } from '../lib/themes';

export type LegalTab = 'about' | 'privacy' | 'terms' | 'contact';

interface LegalPagesModalProps {
  initialTab?: LegalTab;
  settings: UserSettings;
  onClose: () => void;
}

export const LegalPagesModal: React.FC<LegalPagesModalProps> = ({
  initialTab = 'about',
  settings,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);
  const theme = THEMES[settings.theme];

  return (
    <div className="fixed inset-[#0000] z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border ${theme.border} ${theme.panelBg} shadow-2xl overflow-hidden`}
      >
        {/* Modal Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${theme.border}`}>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg text-slate-100">
              Information & Compliance
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className={`flex items-center gap-2 px-6 py-2.5 border-b ${theme.border} bg-slate-900/50 overflow-x-auto`}>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'about'
                ? 'bg-amber-400 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>About Us</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'bg-amber-400 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'terms'
                ? 'bg-amber-400 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'contact'
                ? 'bg-amber-400 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contact Us</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-300 text-sm leading-relaxed space-y-6">
          {activeTab === 'about' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <Globe className="w-6 h-6 text-amber-400" />
                <div>
                  <h2 className="text-xl font-bold text-slate-100">About KeyType Master</h2>
                  <p className="text-xs text-slate-400">Precision Touch Typing & AI-Powered Speed Trainer</p>
                </div>
              </div>

              <p>
                Welcome to <strong>KeyType Master</strong>, a next-generation web-based typing speed trainer designed for typists, programmers, students, and professionals striving to unlock high-speed muscle memory and fluid touch typing skills.
              </p>

              <h4 className="font-bold text-slate-200 text-base pt-2">Our Mission</h4>
              <p>
                Our mission is to provide a free, accessible, distraction-free environment that combines scientific memory repetition algorithms (inspired by Keybr and Monkeytype) with AI-assisted weakness diagnosis.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <h5 className="font-bold text-amber-400 text-sm mb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Procedural Keybr Mechanics
                  </h5>
                  <p className="text-xs text-slate-400">
                    Gradually unlocks keys as your accuracy improves, building subconscious finger placement from home row keys out.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <h5 className="font-bold text-amber-400 text-sm mb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Real-time Analytics
                  </h5>
                  <p className="text-xs text-slate-400">
                    Detailed speed graphs, raw WPM, burst accuracy, consistency metrics, and key-by-key confidence heatmaps.
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-400 italic pt-2">
                KeyType Master is maintained as an open learning utility. All typing benchmarks and audio feedback run locally in your web browser for minimum latency and optimal user privacy.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <Lock className="w-6 h-6 text-emerald-400" />
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Privacy Policy</h2>
                  <p className="text-xs text-slate-400">Last updated: July 2026 • Google AdSense GDPR & CCPA Compliant</p>
                </div>
              </div>

              <p>
                At <strong>KeyType Master</strong>, accessible from our web platform, user privacy is one of our main priorities. This Privacy Policy document outlines the types of information collected and recorded by KeyType Master and how we use it.
              </p>

              <h4 className="font-bold text-slate-200 text-sm pt-2">1. Local Storage & Client Processing</h4>
              <p>
                KeyType Master operates primarily in your browser. Your custom sound preferences, theme choices, unlock progressions, and historical typing test scores are saved locally in your browser&apos;s <code>localStorage</code>. No personal keystroke logs or sensitive text data are transmitted to external servers.
              </p>

              <h4 className="font-bold text-slate-200 text-sm pt-2">2. Google DoubleClick DART Cookie & AdSense</h4>
              <p>
                Google is a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our platform and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL:
                <br />
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 underline hover:text-amber-300 transition-colors inline-block mt-1"
                >
                  https://policies.google.com/technologies/ads
                </a>
              </p>

              <h4 className="font-bold text-slate-200 text-sm pt-2">3. Advertising Partners Privacy Policies</h4>
              <p>
                Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on KeyType Master. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
              </p>

              <h4 className="font-bold text-slate-200 text-sm pt-2">4. GDPR Data Protection Rights</h4>
              <p>
                We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
                <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
                <li><strong>The right to erasure:</strong> You have the right to clear your local storage data at any time via the History tab.</li>
                <li><strong>The right to restrict processing:</strong> You can opt out of personalized advertising at any time.</li>
              </ul>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <FileText className="w-6 h-6 text-sky-400" />
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Terms of Service</h2>
                  <p className="text-xs text-slate-400">Terms of Use & Fair Usage Policy</p>
                </div>
              </div>

              <p>
                By accessing or using <strong>KeyType Master</strong>, you agree to be bound by these Terms of Service and all applicable laws and regulations.
              </p>

              <h4 className="font-bold text-slate-200 text-sm pt-2">1. Use License</h4>
              <p>
                Permission is granted to temporarily access and use the educational typing software on KeyType Master for personal, non-commercial, educational practice only.
              </p>

              <h4 className="font-bold text-slate-200 text-sm pt-2">2. Prohibited Conduct</h4>
              <p>
                Users agree not to attempt to reverse engineer, exploit, run automated score-falsification bots, or overload the platform infrastructure.
              </p>

              <h4 className="font-bold text-slate-200 text-sm pt-2">3. Disclaimer</h4>
              <p>
                The materials and typing benchmarks on KeyType Master are provided on an &apos;as is&apos; basis. KeyType Master makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation fitness for a particular purpose.
              </p>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <Mail className="w-6 h-6 text-indigo-400" />
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Contact & Support</h2>
                  <p className="text-xs text-slate-400">Inquiries, Feedback & AdSense Compliance Contact</p>
                </div>
              </div>

              <p>
                Have questions, feature requests, or compliance inquiries regarding KeyType Master? We welcome feedback from typists and visitors!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-slate-100 text-sm mb-1">Email Support</h5>
                    <p className="text-xs text-slate-400">For general support, feedback, and bugs:</p>
                    <span className="text-amber-400 font-mono text-xs block mt-2 font-bold select-all">
                      support@keytypemaster.com
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-slate-100 text-sm mb-1">Business & AdSense</h5>
                    <p className="text-xs text-slate-400">For advertising and partnership inquiries:</p>
                    <span className="text-amber-400 font-mono text-xs block mt-2 font-bold select-all">
                      adsense@keytypemaster.com
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                <strong>Response Time:</strong> We strive to respond to all inquiries within 24–48 business hours.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`flex items-center justify-between px-6 py-4 border-t ${theme.border} bg-slate-900/40 text-xs text-slate-400`}>
          <span>KeyType Master © 2026. All rights reserved.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all cursor-pointer shadow"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
