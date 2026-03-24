import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const AGE_DB: Record<number, any> = {
  5: {
    raw: "정서적 유대감과 자아 인식이 강해지는 시기입니다. 이 시기 아동은 자기중심적 사고가 강하며 감정 기복이 크고 집중력이 짧은 경향이 있습니다. 또래와의 갈등이 잦을 수 있으나 이는 사회성 발달의 자연스러운 과정입니다.",
    summary: "정서적 유대감과 자아 인식이 강해지는 시기",
    focus: "구체적인 활동에 10~15분 내외로 집중 가능",
    emotion: "자기조절을 시도하나 감정 기복이 여전히 큼",
    social: "또래와 놀이를 시작하나 자기중심적 성향이 강함",
    self_control: "외부 지시를 따르며 사회적 규칙 습득 시작 단계",
    growth: "소근육 발달과 언어적 자기 표현 능력이 폭발적으로 증가"
  },
  6: {
    raw: "질서와 규칙을 이해하며 사회적 관계가 확장되는 전환기입니다. 규칙을 이해하기 시작하고 또래 관계가 증가하지만, 감정 폭발이 여전히 존재할 수 있습니다. 칭찬에 대한 의존도가 높은 시기입니다.",
    summary: "질서와 규칙을 이해하며 사회적 관계가 확장되는 전환기",
    focus: "흥미 있는 활동에 15~20분 정도 몰입 가능",
    emotion: "칭찬과 인정에 민감하며 감정 폭발이 점차 줄어듦",
    social: "규칙이 있는 게임에 참여하며 동성 친구를 선호하기 시작",
    self_control: "충동을 제어하려는 의지가 생기나 성인의 도움 필요",
    growth: "기본 생활 습관의 자립과 상상력이 구체화되는 시기"
  },
  7: {
    raw: "공식적인 학교 교육에 적응하며 책임감이 형성되는 시기입니다. 학교 생활에 적응하기 시작하며 집중력이 눈에 띄게 증가합니다. 타인과의 비교 의식이 형성되며 규칙 준수 능력이 상승합니다.",
    summary: "공식적인 학교 교육에 적응하며 책임감이 형성되는 시기",
    focus: "정규 수업 시간(40분) 동안 주의 유지 능력 발달 중",
    emotion: "타인의 평가를 의식하며 비난이나 실패에 민감함",
    social: "또래 내 인정 욕구가 강해지고 집단 내 서열 의식 형성",
    self_control: "규칙 준수 능력이 향상되며 스스로 조절하려는 노력 보임",
    growth: "논리적 사고의 시작과 학교라는 새로운 사회 환경 적응력 강화"
  },
  8: {
    raw: "자아 능력을 평가하고 구체적인 목표를 설정하는 시기입니다. 자기 통제력이 발달하고 친구 관계가 중요해집니다. 책임감이 형성되기 시작하며 감정 표현이 다양해집니다.",
    summary: "자아 능력을 평가하고 구체적인 목표를 설정하는 시기",
    focus: "과제 완수에 대한 집중력과 끈기가 안정적으로 발달함",
    emotion: "감정 표현이 다양해지고 타인의 감정에 공감하기 시작",
    social: "친밀한 단작 친구 관계가 형성되며 팀워크를 경험함",
    self_control: "스스로 해야 할 일을 챙기는 자기주도성 형성 시작",
    growth: "인과관계 파악 능력 및 신체적 조정 능력이 정교해짐"
  },
  9: {
    raw: "주관적 생각이 뚜렷해지며 내적인 자아 신뢰가 형성되는 시기입니다. 자기 통제력이 더욱 정교해지고 또래와의 유대감이 깊어집니다. 책임감 있는 행동이 관찰되기 시작합니다.",
    summary: "주관적 생각이 뚜렷해지며 내적인 자아 신뢰가 형성되는 시기",
    focus: "추상적인 과제에도 일정 시간 이상의 집중 유지 가능",
    emotion: "성취 욕구가 강해지고 자신의 능력에 대한 고민 시작",
    social: "성별에 따른 집단 문화가 형성되며 소속감을 매우 중시함",
    self_control: "시간 관리 및 계획 수립의 기초적인 실행 능력 발달",
    growth: "추론적 사고력과 사고의 유연성이 크게 증가하는 시기"
  },
  10: {
    raw: "비판적 사고가 시작되고 자기 평가가 정교해지는 시기입니다. 논리적 사고가 증가하며 또래의 영향력이 매우 커집니다. 자존감의 변동이 생길 수 있는 중요한 시점입니다.",
    summary: "비판적 사고가 시작되고 자기 평가가 정교해지는 학동기 정점",
    focus: "자신의 의지에 따라 효율적으로 집중력을 배분하고 유지함",
    emotion: "자존감의 변동이 심하며 내적 갈등과 고민이 증가함",
    social: "또래 집단(Peer Pressure)의 영향력이 부모보다 커지는 시기",
    self_control: "규칙의 상대성을 이해하고 상황에 맞는 유연한 조절 가능",
    growth: "메타인지(생각에 대한 생각) 능력이 발달하여 자기 객관화 시작"
  },
  11: {
    raw: "신체적 변화와 함께 정서적 독립성이 싹트는 시기입니다. 논리적 사고가 고도화되며 자신의 능력을 스스로 평가하기 시작합니다. 또래 집단의 문화에 깊게 동화되는 경향이 있습니다.",
    summary: "신체 변화와 함께 정서적 독립성이 싹트는 사춘기 전조기",
    focus: "고난도 과제나 흥미 분야에 대해 심층적인 몰입 발휘",
    emotion: "이유 없는 불안이나 예민함이 나타나며 내면의 변화 시작",
    social: "가치관이 비슷한 친구들과 폐쇄적이고 끈끈한 관계 형성",
    self_control: "욕구와 의무 사이의 갈등을 스스로 조절하는 힘 강화",
    growth: "추상적 개념의 완벽한 이해와 논리적 변론 능력 발달"
  },
  12: {
    raw: "사춘기 초기에 진입하여 정체성 고민이 본격화되는 시기입니다. 감정 기복이 커지고 독립에 대한 욕구가 강해집니다. 권위에 대한 저항이 나타날 수 있는 발달적 특성을 보입니다.",
    summary: "사춘기 초기 신체 변화와 정체성 고민이 본격화되는 전환기",
    focus: "자신의 가치관이 투영된 활동에 대해 성인 수준의 몰입",
    emotion: "감정 기복이 급격해지며 독립에 대한 욕구가 폭발함",
    social: "가족보다 친구 관계를 우선시하며 사회적 자아 정립",
    self_control: "독립적 결정에 따른 책임 이행의 과도기로 기복이 존재",
    growth: "비판적 수용 능력과 정교한 문제 해결 전략 수립 가능"
  },
  13: {
    raw: "자아 정체성 확립을 위해 자신만의 세계를 구축하는 시기입니다. 정서적 독립 욕구가 강하며 가치관의 혼란을 경험할 수 있습니다. 또래 집단과의 유대감을 통해 자아를 확인합니다.",
    summary: "자아 정체성 확립을 위해 자신만의 세계를 구축하는 시기",
    focus: "목표 지향적인 주의 집중과 효율적인 정보 처리 능력",
    emotion: "가치관 혼란과 정서적 독립 욕구로 인한 내적 갈등 심화",
    social: "또래 집단 규범에 절대적이나 동시에 소외를 두려워함",
    self_control: "개인적인 도덕적 기준 정립과 자기조절의 내면화",
    growth: "고도의 추상적/논리적 사고와 자아 비판적 성찰 가능"
  }
};

app.post('/api/generate', async (req, res) => {
  const { childInfo, scores, scoresWithMeaning, memo } = req.body;

  try {
    const concentration = (scores.q1 + scores.q2 + scores.q11) / 3;
    const emotionalRegulation = (scores.q3 + scores.q4 + scores.q12) / 3;
    const sociality = (scores.q5 + scores.q6 + scores.q13) / 3;
    const selfExpression = (scores.q7 + scores.q14) / 2;
    const selfRegulation = (scores.q8 + scores.q9 + scores.q15) / 3;
    const challenge = scores.q10;

    const ageData = AGE_DB[childInfo.age] || {};

    const prompt = `
      당신은 아동발달 상담 전문가입니다. 아래 데이터를 기반으로 JSON 리포트를 생성하되, 다음의 **절대 규칙**을 준수하십시오.

      [아동 정보 및 점수]
      - 이름/연령/성별: ${childInfo.name} / ${childInfo.age}세 / ${childInfo.gender === 'male' ? '남아' : '여아'}
      - 보호자 메모: ${memo}
      - 개별 점수(0-5): ${scoresWithMeaning.map((s: any) => `${s.id}: ${s.score}점${s.meaning ? ` - ${s.meaning}` : ''}`).join(', ')}
      - 영역 평균: 집중력(${concentration.toFixed(2)}), 감정조절(${emotionalRegulation.toFixed(2)}), 사회성(${sociality.toFixed(2)}), 자기표현(${selfExpression.toFixed(2)}), 자기조절(${selfRegulation.toFixed(2)}), 도전성(${challenge.toFixed(2)})

      [문항별 핵심 의미]
      - Q1: 주어진 과제나 활동에 5분 이상 집중하는 능력.
      - Q2: 주변 자극 속에서도 목표에 집중을 유지하는 능력.
      - Q3: 자신의 감정을 인지하고 말로 표현하는 능력.
      - Q4: 부정적 감정 이후 안정 상태로 돌아오는 능력.
      - Q5: 집단 속 규칙과 질서를 이해하고 따르는 능력.
      - Q6: 타인에게 먼저 다가가 관계를 시작하는 능력.
      - Q7: 생각과 감정을 명확하게 전달하는 능력.
      - Q8: 해야 할 일을 끝까지 수행하는 능력.
      - Q9: 즉각적인 욕구를 통제하고 목표를 선택하는 능력.
      - Q10: 새로운 시도와 실패를 받아들이는 태도.
      - Q11: 외부 자극 속에서도 주의 집중을 유지하는 능력.
      - Q12: 감정 회복 속도 및 정서 안정 능력.
      - Q13: 관계 회복력 및 사회적 유연성.
      - Q14: 감정 및 욕구의 언어적 표현 능력.
      - Q15: 충동 억제 및 자기조절 능력.

      [영역별 필수 포함 개념]
      - 집중력: '주의 지속' 및 '환경 저항(자극 인내)'의 관점에서 해석
      - 감정조절: '감정 인식'과 '정서적 회복'의 관점에서 해석
      - 사회성: '사회 규범 수용'과 '관계 시작(접근성)'의 관점에서 해석
      - 자기표현: '의사 전달의 명확성' 관점에서 해석
      - 자기조절: '과제 수행력'과 '충동 억제'의 관점에서 해석
      - 도전성: '새로운 도전 태도'와 '실패 수용/성장 태도' 관점에서 해석

      [연령 발달 기준]
      - 발달 원문: ${ageData.raw}
      - 발달 요약: ${ageData.summary}
      - 집중 특성: ${ageData.focus}
      - 감정 특성: ${ageData.emotion}
      - 사회성 특성: ${ageData.social}
      - 자기조절 특성: ${ageData.self_control}
      - 성장 특성: ${ageData.growth}

      [🚨 PROFESSIONAL EDITOR LOCK - 전문가 문장 및 톤 강제]
      1. **문장 구조 강제**: 모든 분석 문장은 **"행동 → 능력 → 발달 과정"**의 논리적 구조를 유지하십시오.
         - 예: "{아동}이 주변 자극에 반응하는 것은(행동) '주의 지속 능력'이 형성되는(능력) 자연스러운 '발달 과정'에 해당합니다."
      2. **전문 용어 변환 (반드시 사용)**:
         - '감정' → **'감정 조절 능력'**
         - '집중' → **'주의 지속 능력'**
         - '행동/태도' → **'자기조절 능력'**
      3. **단정적 전문가 어조**: '보입니다, 추정됩니다, ~인 것 같습니다' 사용을 **전면 금지**하고, **'~상태입니다', '~과정입니다'**와 같이 단정적인 문장을 사용하십시오.
      4. **문장 종결 어미 제한 (반드시 다음 중 선택)**:
         - "~발달 과정에 있습니다", "~경험이 축적되는 단계입니다", "~자연스럽게 나타나는 발달 반응입니다"
      5. **부정어 차단 및 필수 변환**:
         - '부족' → **'아직 안정되지 않은 상태'**
         - '문제' → **'발달 과정'**
         - '어려움' → **'경험이 필요한 단계'**
         - 그 외 '미발달, 결함, 지연' 등 부정적 단어 절대 사용 금지.

      [🚨 CRITICAL PRIORITY LOCK - 최우선 잠금 규칙]
      1. **첫 문장 패턴 강제**: 반드시 **"{아이 이름} 어린이는 {연령 raw 의미} 발달 단계에 있습니다."**로 시작하십시오.
      2. **종합 해석(summary) 4문단 구조**: 
         - 1문단(연령 특성), 2문단(현재 상태), 3문단(원인 분석-연령 연결), 4문단(성장 방향)
      3. **해석 우선순위**: 1순위(연령 원문) > 2순위(점수) > 3순위(메모)

      [✅ SELF VALIDATION - 출력 전 최종 확인]
      - 모든 문장이 "행동→능력→발달 과정" 구조이며, 연령 기준이 포함되었는가? (YES/NO)
      - 감정/집중 등의 단어가 '능력 용어'로 변환되었으며, 단정적인 종결 어미를 사용했는가? (YES/NO)
      - 금지어(부족, 문제 등)가 배제되고 전문가 문장 가이드에 부합하는가? (YES/NO)
      * 하나라도 NO일 경우, 절대 출력하지 말고 처음부터 다시 작성하십시오.

      [반드시 지켜야 할 출력 JSON 스키마]
      {
        "summary": "종합 발달 해석 (위 4문단 구조 및 스타일 가이드 엄수)",
        "ageComparison": "연령 기준 대비 상태 (발달 과정 관점의 판단 및 근거)",
        "rootCauses": "현재 행동의 원인 분석 (원문과 현재 데이터의 연결)",
        "strengths": ["핵심 강점 1 (형성 원인 및 확장 방향 포함)", "핵심 강점 2 (형성 원인 및 확장 방향 포함)"],
        "weaknesses": ["보완 필요 영역 1 (발달 단계/경험 부족 관점)", "보완 필요 영역 2 (발달 단계/경험 부족 관점)"],
        "homeGuide": ["가정 연계 가이드 1", "가정 연계 가이드 2", "가정 연계 가이드 3"],
        "institutionGuide": "기관 지도 방향 (수업 적용 방법)",
        "closing": "마무리 문장 (전문가적 격려와 성장 가능성 강조)"
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional child development expert who provides analysis in JSON format." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    res.json({
      areas: {
        concentration,
        emotionalRegulation,
        sociality,
        selfExpression,
        selfRegulation,
        challenge,
      },
      ...result,
    });
  } catch (error: any) {
    console.error('Error calling OpenAI:', error);
    res.status(500).json({ error: 'AI 분석 생성 중 오류가 발생했습니다.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
