import React, { useState } from 'react';
import { ChildInfo, Scores, AnalysisResult } from './types';
import { QUESTIONS } from './constants';
import { generateAnalysis } from './services/aiService';
import ReportView from './components/ReportView';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Calendar, 
  School, 
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  Printer, 
  FileText,
  Sparkles,
  ArrowRight,
  Users
} from 'lucide-react';

const initialChildInfo: ChildInfo = {
  name: '',
  age: 7,
  gender: 'male',
  guardianName: '',
  consultationDate: new Date().toISOString().split('T')[0],
  institutionName: '',
  counselorName: '',
};

const initialScores: Scores = {
  q1: 3, q2: 3, q3: 3, q4: 3, q5: 3, q6: 3, q7: 3, q8: 3, q9: 3, q10: 3,
  q11: 3, q12: 3, q13: 3, q14: 3, q15: 3,
};

export default function App() {
  const [step, setStep] = useState<'info' | 'scores' | 'memo' | 'loading' | 'report'>('info');
  const [childInfo, setChildInfo] = useState<ChildInfo>(initialChildInfo);
  const [scores, setScores] = useState<Scores>(initialScores);
  const [memo, setMemo] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleGenerate = async () => {
    setStep('loading');
    try {
      const result = await generateAnalysis(childInfo, scores, memo);
      setAnalysis(result);
      setStep('report');
    } catch (error) {
      console.error('Error generating analysis:', error);
      alert('분석 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
      setStep('memo');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-premium-bg text-premium-text-body font-sans selection:bg-navy/10">
      <AnimatePresence mode="wait">
        {step === 'info' && (
          <motion.div
            key="info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-[520px] mx-auto pt-16 px-6 pb-20"
          >
            <div className="mb-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-navy/5 text-navy rounded-full text-[11px] font-bold uppercase tracking-widest mb-6 border border-navy/10">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                Premium Analysis System
              </div>
              <h1 className="text-[32px] font-bold text-premium-text-title tracking-tight leading-tight mb-3">
                아동 발달 프리미엄 분석 리포트
              </h1>
              <p className="text-premium-text-desc font-medium text-sm leading-relaxed">
                전문 상담 알고리즘 기반으로<br />우리 아이의 발달 상태를 분석합니다
              </p>
            </div>

            <div className="bg-white p-8 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-premium-border/50">
              <div className="space-y-6">
                <div className="flex flex-col">
                  <label className="premium-label">
                    <User className="w-4 h-4 text-navy" /> 아동 이름
                  </label>
                  <input
                    type="text"
                    value={childInfo.name}
                    onChange={(e) => setChildInfo({ ...childInfo, name: e.target.value })}
                    className="premium-input"
                    placeholder="이름을 입력하세요"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="premium-label">
                      <Calendar className="w-4 h-4 text-navy" /> 연령 (5~13세)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="13"
                      value={childInfo.age}
                      onChange={(e) => setChildInfo({ ...childInfo, age: parseInt(e.target.value) })}
                      className="premium-input"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="premium-label">
                      <User className="w-4 h-4 text-navy" /> 성별
                    </label>
                    <div className="grid grid-cols-2 gap-2 h-[56px]">
                      <button
                        onClick={() => setChildInfo({ ...childInfo, gender: 'male' })}
                        className={`rounded-[12px] font-bold text-sm transition-all border ${
                          childInfo.gender === 'male' 
                            ? 'bg-navy text-white border-navy' 
                            : 'bg-[#f1f3f5] text-premium-text-desc border-premium-border'
                        }`}
                      >
                        남아
                      </button>
                      <button
                        onClick={() => setChildInfo({ ...childInfo, gender: 'female' })}
                        className={`rounded-[12px] font-bold text-sm transition-all border ${
                          childInfo.gender === 'female' 
                            ? 'bg-navy text-white border-navy' 
                            : 'bg-[#f1f3f5] text-premium-text-desc border-premium-border'
                        }`}
                      >
                        여아
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="premium-label">
                      <Users className="w-4 h-4 text-navy" /> 보호자명
                    </label>
                    <input
                      type="text"
                      value={childInfo.guardianName}
                      onChange={(e) => setChildInfo({ ...childInfo, guardianName: e.target.value })}
                      className="premium-input"
                      placeholder="성함을 입력하세요"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="premium-label">
                      <Calendar className="w-4 h-4 text-navy" /> 상담일
                    </label>
                    <input
                      type="date"
                      value={childInfo.consultationDate}
                      onChange={(e) => setChildInfo({ ...childInfo, consultationDate: e.target.value })}
                      className="premium-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="premium-label">
                      <School className="w-4 h-4 text-navy" /> 기관명
                    </label>
                    <input
                      type="text"
                      value={childInfo.institutionName}
                      onChange={(e) => setChildInfo({ ...childInfo, institutionName: e.target.value })}
                      className="premium-input"
                      placeholder="기관명을 입력하세요"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="premium-label">
                      <FileText className="w-4 h-4 text-navy" /> 상담자명
                    </label>
                    <input
                      type="text"
                      value={childInfo.counselorName}
                      onChange={(e) => setChildInfo({ ...childInfo, counselorName: e.target.value })}
                      className="premium-input"
                      placeholder="성함을 입력하세요"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setStep('scores')}
                    disabled={!childInfo.name || !childInfo.institutionName}
                    className="w-full h-[60px] bg-navy text-white rounded-[14px] font-bold text-lg flex items-center justify-center gap-2 hover:bg-navy/90 active:scale-[0.98] transition-all disabled:opacity-30 disabled:hover:scale-100 shadow-lg shadow-navy/20"
                  >
                    다음 단계로 <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-[#f1f3f5] p-5 rounded-[12px] space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-premium-text-body">
                    <div className="w-4 h-4 rounded-full bg-navy/10 flex items-center justify-center">
                      <span className="text-[10px] text-navy">✔</span>
                    </div>
                    전문가 발달 분석 리포트 제공
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-premium-text-body">
                    <div className="w-4 h-4 rounded-full bg-navy/10 flex items-center justify-center">
                      <span className="text-[10px] text-navy">✔</span>
                    </div>
                    학부모 상담 자료 활용 가능
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-premium-text-body">
                    <div className="w-4 h-4 rounded-full bg-navy/10 flex items-center justify-center">
                      <span className="text-[10px] text-navy">✔</span>
                    </div>
                    월간 성장 리포트 구독 서비스 제공 예정
                  </div>
                </div>

                <p className="text-center text-[11px] text-premium-text-desc font-medium">
                  본 리포트는 전문 상담 알고리즘 기반으로 생성됩니다
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'scores' && (
          <motion.div
            key="scores"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-4xl mx-auto pt-20 px-6 pb-20"
          >
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold text-premium-text-title tracking-tight mb-4">발달 문항 체크</h1>
              <p className="text-premium-text-desc font-medium">각 문항에 대해 아동의 상태를 0~5점으로 평가해주세요.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {QUESTIONS.map((q, i) => (
                <div key={q.id} className="bg-white p-8 rounded-[20px] shadow-sm border border-premium-border/50 flex flex-col gap-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gold uppercase tracking-widest">{q.area}</span>
                      <h3 className="text-lg font-bold text-premium-text-title leading-tight">{i + 1}. {q.label}</h3>
                    </div>
                    <span className="text-3xl font-black italic text-navy/5">Q{i + 1}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    {[0, 1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        onClick={() => setScores({ ...scores, [q.id]: score })}
                        className={`flex-1 py-4 rounded-xl font-bold transition-all ${scores[q.id as keyof Scores] === score ? 'bg-navy text-white scale-105 shadow-md' : 'bg-[#f1f3f5] text-premium-text-desc hover:bg-stone-200'}`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-premium-text-desc uppercase tracking-widest px-2">
                    <span>전혀 해당 없음</span>
                    <span>매우 높음</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex gap-4">
              <button
                onClick={() => setStep('info')}
                className="flex-1 h-[60px] bg-white border border-premium-border text-premium-text-title rounded-[14px] font-bold flex items-center justify-center gap-2 hover:bg-stone-50 transition-all"
              >
                <ChevronLeft className="w-5 h-5" /> 이전
              </button>
              <button
                onClick={() => setStep('memo')}
                className="flex-[2] h-[60px] bg-navy text-white rounded-[14px] font-bold text-lg flex items-center justify-center gap-2 hover:bg-navy/90 transition-all shadow-lg shadow-navy/20"
              >
                다음 단계로 <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 'memo' && (
          <motion.div
            key="memo"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-[520px] mx-auto pt-20 px-6 pb-20"
          >
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold text-premium-text-title tracking-tight mb-4">보호자 관찰 메모</h1>
              <p className="text-premium-text-desc font-medium">부모님이 평소 느끼시는 아동의 특징이나 고민을 자유롭게 적어주세요.</p>
            </div>

            <div className="bg-white p-8 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-premium-border/50">
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full h-64 p-6 bg-[#f8f9fb] border border-premium-border rounded-[12px] focus:outline-none focus:border-navy transition-all font-medium leading-relaxed resize-none placeholder:text-[#888888]"
                placeholder="예: 집에서는 집중력이 좋은 편인데, 밖에서는 산만하다는 이야기를 듣습니다..."
              />

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setStep('scores')}
                  className="flex-1 h-[60px] bg-white border border-premium-border text-premium-text-title rounded-[14px] font-bold flex items-center justify-center gap-2 hover:bg-stone-50 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" /> 이전
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex-[2] h-[60px] bg-navy text-white rounded-[14px] font-bold text-lg flex items-center justify-center gap-2 hover:bg-navy/90 transition-all shadow-lg shadow-navy/20"
                >
                  프리미엄 발달 리포트 생성하기 <Sparkles className="w-5 h-5 text-gold" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-premium-bg/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-center p-6"
          >
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full border-4 border-navy/10 border-t-navy animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-gold animate-pulse" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-premium-text-title tracking-tight mb-4">전문가 분석 리포트 생성 중...</h2>
            <p className="text-premium-text-desc font-medium max-w-md leading-relaxed">
              AI 전문가가 아동의 점수와 연령 기준을 비교하여<br />
              심층적인 발달 분석을 수행하고 있습니다. 잠시만 기다려주세요.
            </p>
          </motion.div>
        )}

        {step === 'report' && analysis && (
          <motion.div
            key="report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="fixed top-6 right-6 z-50 flex gap-4 print:hidden">
              <button
                onClick={() => setStep('memo')}
                className="p-4 bg-white border border-premium-border text-premium-text-title rounded-[14px] font-bold flex items-center gap-2 shadow-xl hover:bg-stone-50 transition-all"
              >
                <ChevronLeft className="w-5 h-5" /> 수정하기
              </button>
              <button
                onClick={handlePrint}
                className="p-4 bg-navy text-white rounded-[14px] font-bold flex items-center gap-2 shadow-xl hover:bg-navy/90 transition-all"
              >
                <Printer className="w-5 h-5" /> 인쇄 / PDF 저장
              </button>
            </div>
            
            <ReportView childInfo={childInfo} analysis={analysis} memo={memo} />
            
            <div className="max-w-4xl w-full px-6 pb-20 mt-12 print:hidden">
              <div className="bg-white p-12 rounded-[32px] shadow-xl border border-premium-border/50 text-center">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-3xl font-bold text-premium-text-title mb-4">상담을 성공적으로 마치셨나요?</h3>
                <p className="text-premium-text-desc font-medium mb-10">생성된 리포트는 학부모님께 신뢰를 주는 최고의 상담 도구가 됩니다.</p>
                <button
                  onClick={() => {
                    setStep('info');
                    setChildInfo(initialChildInfo);
                    setScores(initialScores);
                    setMemo('');
                    setAnalysis(null);
                  }}
                  className="px-12 py-5 bg-navy text-white rounded-[18px] font-bold text-xl hover:bg-navy/90 transition-all flex items-center gap-3 mx-auto shadow-xl shadow-navy/20"
                >
                  새로운 상담 시작하기 <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
