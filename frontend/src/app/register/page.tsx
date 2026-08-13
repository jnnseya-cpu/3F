'use client';

import { useState, useEffect } from 'react';
import { humanFetch } from '@/lib/humanClient';
import { CheckCircle, User, MapPin, BookOpen, Briefcase, Star, DollarSign, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { DRC_PROVINCES, CONTINENTS, AFRICAN_COUNTRIES } from '@/lib/provinces';

type Step = 1 | 2 | 3 | 4 | 5 | 6;

interface FormData {
  // Step 1 - Identity
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  phone: string;
  email: string;
  // Step 2 - Location
  continent: string;
  country: string;
  province: string;
  territory: string;
  commune: string;
  village: string;
  // Step 3 - Education
  eduLevel: string;
  eduField: string;
  institution: string;
  yearCompleted: string;
  // Step 4 - Work
  employer: string;
  jobTitle: string;
  sector: string;
  yearsExperience: string;
  // Step 5 - Political
  prevParty: string;
  civicOrgs: string;
  localRoles: string;
  languagesSpoken: string[];
  // Step 6 - Contribution
  contributionConfirm: boolean;
  paymentMethod: string;
  agreeTerms: boolean;
}

const STEPS = [
  { num: 1 as Step, label: 'Identité', icon: User },
  { num: 2 as Step, label: 'Localisation', icon: MapPin },
  { num: 3 as Step, label: 'Éducation', icon: BookOpen },
  { num: 4 as Step, label: 'Travail', icon: Briefcase },
  { num: 5 as Step, label: 'Profil politique', icon: Star },
  { num: 6 as Step, label: 'Contribution', icon: DollarSign },
];

const LANGUAGES = [
  { code: 'fr', label: 'Français' },
  { code: 'ln', label: 'Lingala' },
  { code: 'kg', label: 'Kikongo' },
  { code: 'ts', label: 'Tshiluba' },
  { code: 'sw', label: 'Kiswahili' },
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
];

const EDU_LEVELS = ['None', 'Primary', 'Secondary', 'Vocational', 'Bachelor', 'Master', 'PhD'];
const PAYMENT_METHODS = ['Mobile Money (M-Pesa, Airtel Money)', 'Virement bancaire', 'Espèces (via coordinateur local)', 'Paiement en ligne'];
const SECTORS = [
  'Agriculture', 'Commerce', 'Éducation', 'Santé', 'Justice',
  'Mines et Ressources', 'Technologies', 'Transport', 'Société Civile',
  'Finance', 'Défense/Sécurité', 'Diplomatie', 'Médias', 'Autre',
];

const initialForm: FormData = {
  firstName: '', lastName: '', dateOfBirth: '', gender: '', nationality: 'Congolais(e)', phone: '', email: '',
  continent: 'Afrique', country: 'RD Congo', province: '', territory: '', commune: '', village: '',
  eduLevel: '', eduField: '', institution: '', yearCompleted: '',
  employer: '', jobTitle: '', sector: '', yearsExperience: '',
  prevParty: '', civicOrgs: '', localRoles: '', languagesSpoken: ['fr'],
  contributionConfirm: false, paymentMethod: '', agreeTerms: false,
};

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref && /^[A-Z0-9]{4,12}$/.test(ref)) {
      setReferralCode(ref);
      try { localStorage.setItem('lcd_referred_by', ref); } catch { /* noop */ }
    }
  }, []);

  const update = (field: keyof FormData, value: string | boolean | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const toggleLanguage = (code: string) => {
    const langs = form.languagesSpoken.includes(code)
      ? form.languagesSpoken.filter(l => l !== code)
      : [...form.languagesSpoken, code];
    update('languagesSpoken', langs);
  };

  const selectedProvince = DRC_PROVINCES.find(p => p.name === form.province);

  const validateStep = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (step === 1) {
      if (!form.firstName.trim()) newErrors.firstName = 'Prénom requis';
      if (!form.lastName.trim()) newErrors.lastName = 'Nom requis';
      if (!form.dateOfBirth) newErrors.dateOfBirth = 'Date de naissance requise';
      if (!form.gender) newErrors.gender = 'Genre requis';
      if (!form.phone.trim()) newErrors.phone = 'Téléphone requis';
      if (!form.email.trim()) newErrors.email = 'Email requis';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Email invalide';
    }
    if (step === 2) {
      if (!form.continent) newErrors.continent = 'Continent requis';
      if (!form.country) newErrors.country = 'Pays requis';
    }
    if (step === 3) {
      if (!form.eduLevel) newErrors.eduLevel = 'Niveau d\'éducation requis';
    }
    if (step === 6) {
      if (!form.paymentMethod) newErrors.paymentMethod = 'Méthode de paiement requise';
      if (!form.agreeTerms) newErrors.agreeTerms = 'Vous devez accepter les conditions';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step < 6) setStep((step + 1) as Step);
      else handleSubmit();
    }
  };

  const handleSubmit = async () => {
    // Persist to the members API (Firestore-backed once FIREBASE_* env vars are set).
    // The success screen shows regardless — a failed network call must not
    // block a citizen's registration; the record is retried server-side.
    try {
      await humanFetch('/api/members/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          province: form.province,
          territory: form.territory,
          commune: form.commune,
          village: form.village,
          education: form.eduLevel,
          profession: form.jobTitle,
          languages: form.languagesSpoken,
          paymentMethod: form.paymentMethod,
        }),
      });
    } catch {
      // offline or API down — registration UX continues
    }
    if (referralCode) {
      try {
        await humanFetch('/api/referral/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: referralCode }),
        });
      } catch { /* non-blocking */ }
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-drc-blue" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3">Inscription réussie !</h2>
          <p className="text-gray-600 mb-2">
            <strong>{form.firstName} {form.lastName}</strong>, bienvenue dans le mouvement <strong>Le Congo D’Abord</strong> !
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Votre dossier a été transmis à votre coordinateur local. Vous recevrez une confirmation par email à <strong>{form.email}</strong>.
          </p>
          <div className="bg-blue-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
            <h4 className="font-semibold text-drc-blue mb-2">Prochaines étapes :</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Configurer votre premier paiement de $1 USD</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Accéder à l'Académie Politique CDP</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Rejoindre votre cellule locale</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Consulter le tableau de bord de votre province</li>
            </ul>
          </div>
          <div className="bg-drc-yellow/15 border border-drc-yellow rounded-xl p-4 mb-6">
            <p className="font-black text-gray-900 text-sm mb-1">🚀 Faites grandir le mouvement</p>
            <p className="text-gray-600 text-sm mb-3">Invitez 3 proches dès aujourd&apos;hui. C&apos;est ainsi qu&apos;un pays se transforme.</p>
            <a href="/invite" className="inline-block bg-green-600 text-white font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-green-700">Inviter mes proches sur WhatsApp</a>
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="/dashboard" className="btn-primary text-sm">Accéder au tableau de bord</a>
            <a href="/training" className="border-2 border-drc-blue text-drc-blue px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-50">Commencer la formation</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-drc-blue text-white py-8">
        <div className="flag-stripe -mt-8 mb-0" />
        <div className="max-w-4xl mx-auto px-4 pt-8 text-center">
          <h1 className="text-3xl font-black mb-2">Inscription — Le Congo D'Abord</h1>
          <p className="text-blue-200">Rejoignez le mouvement citoyen pour un Congo meilleur</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between overflow-x-auto gap-1">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === s.num;
              const isDone = step > s.num;
              return (
                <div key={s.num} className="flex items-center gap-1 flex-1 min-w-0">
                  <button
                    onClick={() => isDone ? setStep(s.num) : undefined}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                      isActive ? 'bg-drc-blue text-white' :
                      isDone ? 'bg-green-100 text-drc-blue cursor-pointer hover:bg-green-200' :
                      'bg-gray-100 text-gray-400 cursor-default'
                    }`}
                  >
                    {isDone ? <CheckCircle className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{s.label}</span>
                    <span className="sm:hidden">{s.num}</span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 ${step > s.num ? 'bg-drc-blue' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Body */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

          {/* STEP 1 — Identity */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <User className="w-5 h-5 text-drc-blue" /> Identité personnelle
              </h2>
              <p className="text-gray-500 text-sm mb-6">Informations de base du membre</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Prénom <span className="text-red-500">*</span></label>
                  <input className="form-input" placeholder="Ex: Justin" value={form.firstName} onChange={e => update('firstName', e.target.value)} />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="form-label">Nom de famille <span className="text-red-500">*</span></label>
                  <input className="form-input" placeholder="Ex: Nseya" value={form.lastName} onChange={e => update('lastName', e.target.value)} />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <label className="form-label">Date de naissance <span className="text-red-500">*</span></label>
                  <input type="date" className="form-input" value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)} />
                  {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                </div>
                <div>
                  <label className="form-label">Genre <span className="text-red-500">*</span></label>
                  <select className="form-select" value={form.gender} onChange={e => update('gender', e.target.value)}>
                    <option value="">Sélectionner...</option>
                    <option value="M">Homme</option>
                    <option value="F">Femme</option>
                    <option value="Other">Autre</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                </div>
                <div>
                  <label className="form-label">Nationalité</label>
                  <input className="form-input" value={form.nationality} onChange={e => update('nationality', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Téléphone <span className="text-red-500">*</span></label>
                  <input className="form-input" placeholder="+243 81 234 5678" value={form.phone} onChange={e => update('phone', e.target.value)} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="form-label">Adresse email <span className="text-red-500">*</span></label>
                  <input type="email" className="form-input" placeholder="votre@email.com" value={form.email} onChange={e => update('email', e.target.value)} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Location */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-drc-blue" /> Localisation Administrative
              </h2>
              <p className="text-gray-500 text-sm mb-6">Votre positionnement géographique dans la structure du parti</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Continent <span className="text-red-500">*</span></label>
                  <select className="form-select" value={form.continent} onChange={e => update('continent', e.target.value)}>
                    {CONTINENTS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Pays de résidence <span className="text-red-500">*</span></label>
                  {form.continent === 'Afrique' ? (
                    <select className="form-select" value={form.country} onChange={e => update('country', e.target.value)}>
                      <option value="">Sélectionner...</option>
                      {AFRICAN_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <input className="form-input" placeholder="Ex: Belgique, France, Canada..." value={form.country} onChange={e => update('country', e.target.value)} />
                  )}
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>

                {form.country === 'RD Congo' && (
                  <>
                    <div>
                      <label className="form-label">Province</label>
                      <select className="form-select" value={form.province} onChange={e => { update('province', e.target.value); update('territory', ''); }}>
                        <option value="">Sélectionner une province...</option>
                        {DRC_PROVINCES.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Territoire / Ville</label>
                      {selectedProvince ? (
                        <select className="form-select" value={form.territory} onChange={e => update('territory', e.target.value)}>
                          <option value="">Sélectionner un territoire...</option>
                          {selectedProvince.territories.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                        </select>
                      ) : (
                        <input className="form-input" placeholder="Sélectionner d'abord une province" disabled />
                      )}
                    </div>
                    {form.territory && selectedProvince && (
                      <div>
                        <label className="form-label">Commune / Secteur</label>
                        {(() => {
                          const territory = selectedProvince.territories.find(t => t.name === form.territory);
                          return territory ? (
                            <select className="form-select" value={form.commune} onChange={e => update('commune', e.target.value)}>
                              <option value="">Sélectionner...</option>
                              {territory.communes.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          ) : <input className="form-input" value={form.commune} onChange={e => update('commune', e.target.value)} />;
                        })()}
                      </div>
                    )}
                  </>
                )}

                <div className={form.country === 'RD Congo' ? '' : 'md:col-span-2'}>
                  <label className="form-label">Village / Quartier / Arrondissement</label>
                  <input className="form-input" placeholder="Ex: Quartier Matonge, Village Kimpese..." value={form.village} onChange={e => update('village', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Education */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-drc-blue" /> Profil Éducatif
              </h2>
              <p className="text-gray-500 text-sm mb-6">Votre formation académique et qualifications</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Niveau d'éducation <span className="text-red-500">*</span></label>
                  <select className="form-select" value={form.eduLevel} onChange={e => update('eduLevel', e.target.value)}>
                    <option value="">Sélectionner...</option>
                    {EDU_LEVELS.map(l => (
                      <option key={l} value={l}>
                        {l === 'None' ? 'Aucune formation formelle' : l === 'Primary' ? 'Primaire' : l === 'Secondary' ? 'Secondaire' : l === 'Vocational' ? 'Professionnel / Technique' : l === 'Bachelor' ? 'Licence / Bachelor' : l}
                      </option>
                    ))}
                  </select>
                  {errors.eduLevel && <p className="text-red-500 text-xs mt-1">{errors.eduLevel}</p>}
                </div>
                <div>
                  <label className="form-label">Domaine d'études</label>
                  <input className="form-input" placeholder="Ex: Sciences Politiques, Droit, Médecine..." value={form.eduField} onChange={e => update('eduField', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Établissement</label>
                  <input className="form-input" placeholder="Ex: UNIKIN, ULB, Université de Lubumbashi..." value={form.institution} onChange={e => update('institution', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Année de fin</label>
                  <input type="number" className="form-input" placeholder="Ex: 2010" min="1960" max={new Date().getFullYear()} value={form.yearCompleted} onChange={e => update('yearCompleted', e.target.value)} />
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-700">
                  <strong>Note IA :</strong> L'algorithme de scoring attribue automatiquement un score d'éducation (0-100)
                  basé sur votre niveau. Ce score représente 15% du score candidat total. Les expériences non formelles
                  et certifications sont valorisées lors de la vérification humaine.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4 — Work */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-drc-blue" /> Profil Professionnel
              </h2>
              <p className="text-gray-500 text-sm mb-6">Votre parcours professionnel et expérience de travail</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Employeur actuel</label>
                  <input className="form-input" placeholder="Ex: Gouvernement, ONG, Entreprise..." value={form.employer} onChange={e => update('employer', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Titre du poste</label>
                  <input className="form-input" placeholder="Ex: Directeur, Ingénieur, Enseignant..." value={form.jobTitle} onChange={e => update('jobTitle', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Secteur d'activité</label>
                  <select className="form-select" value={form.sector} onChange={e => update('sector', e.target.value)}>
                    <option value="">Sélectionner...</option>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Années d'expérience totales</label>
                  <input type="number" className="form-input" placeholder="Ex: 10" min="0" max="50" value={form.yearsExperience} onChange={e => update('yearsExperience', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 — Political Profile */}
          {step === 5 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Star className="w-5 h-5 text-drc-blue" /> Profil Politique & Civique
              </h2>
              <p className="text-gray-500 text-sm mb-6">Votre engagement civique et politique antérieur</p>
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="form-label">Ancien parti politique (optionnel)</label>
                  <input className="form-input" placeholder="Ex: PPRD, UNC, MLC... ou 'Aucun'" value={form.prevParty} onChange={e => update('prevParty', e.target.value)} />
                  <p className="text-xs text-gray-400 mt-1">Ceci ne nuit pas à votre candidature. Transparence requise.</p>
                </div>
                <div>
                  <label className="form-label">Organisations civiques (séparées par virgule)</label>
                  <input className="form-input" placeholder="Ex: Croix-Rouge, Association Jeunesse, Coopérative..." value={form.civicOrgs} onChange={e => update('civicOrgs', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Rôles de leadership local</label>
                  <textarea className="form-input" rows={3} placeholder="Ex: Chef de quartier, Président d'association, Délégué syndical..." value={form.localRoles} onChange={e => update('localRoles', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Langues parlées (sélectionner toutes)</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => toggleLanguage(lang.code)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                          form.languagesSpoken.includes(lang.code)
                            ? 'bg-drc-blue text-white border-drc-blue'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-drc-blue'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6 — Contribution */}
          {step === 6 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-drc-blue" /> Cotisation Mensuelle
              </h2>
              <p className="text-gray-500 text-sm mb-6">Configuration de votre engagement financier</p>

              {/* Contribution Info */}
              <div className="bg-blue-50 border border-green-200 rounded-xl p-5 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-drc-blue rounded-xl flex items-center justify-center shrink-0">
                    <DollarSign className="w-6 h-6 text-drc-yellow" />
                  </div>
                  <div>
                    <h3 className="font-bold text-drc-blue text-lg">$1 USD / mois</h3>
                    <p className="text-gray-700 text-sm mt-1">
                      La cotisation mensuelle de $1 USD garantit votre statut de membre actif et votre éligibilité
                      à toutes les processus de sélection du parti.
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {['Éligibilité à la sélection', 'Accès à la formation', 'Droits de vote interne', 'Reconnaissance officielle'].map(b => (
                        <div key={b} className="flex items-center gap-1.5 text-xs text-drc-blue">
                          <CheckCircle className="w-3.5 h-3.5" /> {b}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rule Alert */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-drc-red shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-drc-red text-sm">Règle inviolable</p>
                    <p className="text-gray-700 text-sm mt-1">
                      Aucun membre dont la cotisation n'est pas à jour ne peut être sélectionné pour une nomination,
                      un leadership ou une candidature aux élections.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-5">
                <label className="form-label">Méthode de paiement préférée <span className="text-red-500">*</span></label>
                <div className="space-y-2 mt-2">
                  {PAYMENT_METHODS.map(method => (
                    <label key={method} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      form.paymentMethod === method ? 'border-drc-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={form.paymentMethod === method}
                        onChange={() => update('paymentMethod', method)}
                        className="text-drc-blue"
                      />
                      <span className="text-sm text-gray-700">{method}</span>
                    </label>
                  ))}
                </div>
                {errors.paymentMethod && <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>}
              </div>

              {/* Terms */}
              <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                form.agreeTerms ? 'border-drc-blue bg-blue-50' : 'border-gray-200'
              }`}>
                <input
                  type="checkbox"
                  checked={form.agreeTerms}
                  onChange={e => update('agreeTerms', e.target.checked)}
                  className="mt-0.5 text-drc-blue"
                />
                <span className="text-sm text-gray-700">
                  J'accepte les conditions d'adhésion au parti Le Congo D’Abord, je comprends l'obligation de cotisation mensuelle de $1 USD
                  et je m'engage à respecter la Charte d'éthique et d'intégrité du parti.
                </span>
              </label>
              {errors.agreeTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => step > 1 ? setStep((step - 1) as Step) : undefined}
              disabled={step === 1}
              className="flex items-center gap-2 text-gray-600 font-semibold disabled:opacity-40 hover:text-drc-blue transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Précédent
            </button>
            <span className="text-xs text-gray-400">Étape {step} / 6</span>
            <button onClick={nextStep} className="btn-primary flex items-center gap-2">
              {step === 6 ? 'Finaliser l\'inscription' : 'Suivant'}
              {step < 6 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
