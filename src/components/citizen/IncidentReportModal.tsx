import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Camera, 
  Upload, 
  Clock,
  ChevronRight,
  ChevronLeft,
  Users,
  Brain
} from 'lucide-react';
import { useDisasterStore } from '../../services/useDisasterStore';
import { DisasterType, SeverityLevel } from '../../types/disaster';
import { soundEffects } from '../../services/soundEffects';

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({ isOpen, onClose }) => {
  const { store } = useDisasterStore();

  const [step, setStep] = useState<number>(1);
  const [disasterType, setDisasterType] = useState<DisasterType>('FLOOD');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('HIGH');
  const [peopleAffected, setPeopleAffected] = useState<number>(10);
  const [photoAttached, setPhotoAttached] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);
  const [aiConfidence, setAiConfidence] = useState<number | null>(null);

  if (!isOpen) return null;

  const simulatePhotoAnalysis = () => {
    setPhotoAttached(true);
    soundEffects.playVerificationBlip();
    alert('Photo attached. AI will analyze water level, damage, and people present for verification.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const created = store.reportIncident({
        type: disasterType,
        title: title || `${disasterType} Emergency in ${locationName || 'Local Sector'}`,
        description: description || `Ground report submitted by citizen with severity ${severity}.`,
        locationName: locationName || 'District Urban Sector 3',
        severity,
        estimatedPeopleAffected: Number(peopleAffected) || 5,
        reporterName: 'Verified Citizen (App User)',
        hasPhotoEvidence: photoAttached
      });

      const confidence = created.confidenceScore || 68;
      setAiConfidence(confidence);
      soundEffects.playVerificationBlip();
      setSubmittedReportId(created.id);
      setIsSubmitting(false);
      setStep(5); // Success state
    }, 800);
  };

  const handleResetAndClose = () => {
    setStep(1);
    setTitle('');
    setDescription('');
    setLocationName('');
    setSubmittedReportId(null);
    setAiConfidence(null);
    setPhotoAttached(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-800/90 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/30 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono">REPORT GROUND INCIDENT</h3>
              <p className="text-[11px] text-gray-400">Step {Math.min(4, step)} of 4 • Authority Triage Queue</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form / Steps */}
        <div className="p-6">
          
          {/* Step 1: What Happened? */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-300 font-bold mb-2">
                  1. Select Disaster Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['FLOOD', 'FIRE', 'EARTHQUAKE', 'CYCLONE', 'LANDSLIDE', 'OTHER'] as DisasterType[]).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setDisasterType(t)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition ${
                        disasterType === t
                          ? 'bg-blue-600 text-white border-blue-400 shadow'
                          : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                      }`}
                    >
                      <div className="text-lg mb-0.5">
                        {t === 'FLOOD' ? '🌊' : t === 'FIRE' ? '🔥' : t === 'EARTHQUAKE' ? '🌎' : t === 'CYCLONE' ? '🌪️' : t === 'LANDSLIDE' ? '⛰️' : '⚠️'}
                      </div>
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-300 font-bold mb-1">
                  Incident Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Rising flood water overtopping street wall"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-300 font-bold mb-1">
                  Brief Ground Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe visible danger, trapped individuals, water level, or smoke intensity..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-sm text-white focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow"
                >
                  <span>Next: Location</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Where? */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-300 font-bold mb-1">
                  Location / Landmark / Street Name
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-red-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g., Sector 4 Riverbank Road near Bridge 2"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-gray-950/80 p-3.5 rounded-xl border border-gray-800 text-xs text-gray-300 space-y-1.5 font-mono">
                <div className="flex justify-between items-center text-blue-400 font-bold">
                  <span>GPS Telemetry Coordinate Tag:</span>
                  <span className="bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800 text-[10px]">
                    AUTO-CAPTURED
                  </span>
                </div>
                <div className="text-gray-400">Lat: 13.0827° N, Lng: 80.2707° E (Sector 3 Geo-Polygon)</div>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-xl flex items-center gap-1 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow"
                >
                  <span>Next: Severity & Impact</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Severity & Casualties */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-300 font-bold mb-2">
                  Severity Assessment Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['CRITICAL', 'HIGH', 'MODERATE', 'LOW'] as SeverityLevel[]).map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setSeverity(s)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition ${
                        severity === s
                          ? s === 'CRITICAL' ? 'bg-red-600 text-white border-red-400'
                            : s === 'HIGH' ? 'bg-amber-600 text-white border-amber-400'
                            : 'bg-blue-600 text-white border-blue-400'
                          : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-300 font-bold mb-1">
                  Estimated People Affected / At Risk
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-blue-400 absolute left-3.5 top-3" />
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    value={peopleAffected}
                    onChange={(e) => setPeopleAffected(Number(e.target.value))}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-xl flex items-center gap-1 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow"
                >
                  <span>Next: Evidence & Submit</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Evidence & Submit */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-300 font-bold mb-1.5">
                  Optional Ground Evidence (Photo / Video)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={simulatePhotoAnalysis}
                    className={`p-4 rounded-xl border-2 text-center transition ${
                      photoAttached
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : 'border-dashed border-gray-700 bg-gray-950/40 hover:border-gray-600 text-gray-300'
                    }`}
                  >
                    <Camera className="w-6 h-6 mx-auto mb-1.5" />
                    <p className="text-xs font-semibold">Take Photo</p>
                    {photoAttached && (
                      <div className="flex items-center justify-center gap-1 text-emerald-400 mt-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="text-[10px]">Attached</span>
                      </div>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={simulatePhotoAnalysis}
                    className="p-4 rounded-xl border-2 border-dashed border-gray-700 bg-gray-950/40 hover:border-gray-600 text-gray-300 text-center transition"
                  >
                    <Upload className="w-6 h-6 mx-auto mb-1.5" />
                    <p className="text-xs font-semibold">Upload Photo</p>
                    <p className="text-[10px] text-gray-500 mt-1">AI analysis enabled</p>
                  </button>
                </div>
              </div>

              <div className="bg-blue-950/30 border border-blue-800/60 p-3 rounded-xl text-xs text-blue-200">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <Brain className="w-3.5 h-3.5 text-blue-400" />
                  <span>AI-Powered Verification</span>
                </div>
                <p className="text-[11px] text-blue-200/80">
                  Photo analysis extracts water level, damaged structures, and people count. Confidence score calculated automatically.
                </p>
              </div>

              <div className="bg-amber-950/30 border border-amber-800/60 p-3 rounded-xl text-xs text-amber-200">
                <span className="font-bold">⚠️ Notice: </span>
                Citizen reports are transmitted to the Command Center and marked as <strong>Pending Verification</strong>.
                Do not submit false distress calls.
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-xl flex items-center gap-1 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition shadow-lg shadow-red-900/40"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Submit Incident Report'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Submitted Confirmation State */}
          {step === 5 && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in duration-200">
              <div className="w-16 h-16 bg-emerald-950 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-white">✅ Incident Report Received</h4>
                <p className="text-xs text-gray-300 font-mono mt-1">Tracking ID: {submittedReportId}</p>
              </div>

              <div className="bg-amber-950/50 border border-amber-600/80 p-3.5 rounded-xl text-xs text-amber-200 max-w-sm mx-auto space-y-1">
                <div className="font-bold flex items-center justify-center gap-1 text-amber-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Status: PENDING VERIFICATION</span>
                </div>
                <p className="text-[11px] text-amber-200/80">
                  Transmitted to Disaster Command Center. Responders will verify ground telemetry and assign rescue teams.
                </p>
              </div>

              {aiConfidence !== null && (
                <div className="bg-blue-950/50 border border-blue-600/80 p-3.5 rounded-xl text-xs text-blue-200 max-w-sm mx-auto space-y-1">
                  <div className="font-bold flex items-center justify-center gap-1 text-blue-300">
                    <Brain className="w-3.5 h-3.5" />
                    <span>AI Confidence Score: {aiConfidence}%</span>
                  </div>
                  <p className="text-[11px] text-blue-200/80">
                    Based on: source type, evidence quality, and independent corroboration.
                  </p>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden mt-1">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        aiConfidence >= 80 ? 'bg-emerald-500' : aiConfidence >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${aiConfidence}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="pt-3">
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow"
                >
                  Back to Emergency Hub
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
