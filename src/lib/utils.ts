import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type ServiceIconName = 'stethoscope' | 'test-tube-diagonal' | 'house' | 'monitor-smartphone'
export type ServiceVisualTone = 'sage' | 'linen' | 'gold' | 'mist'
export type ServiceCategory =
  | 'sexual-health-men'
  | 'sexual-health-women'
  | 'male-fertility'
  | 'female-fertility'
  | 'couple-care'
  | 'infection-screening'
  | 'lifestyle-wellness'
export type ServiceCareMode = 'clinic' | 'online' | 'lab-coordination'

export type ServiceConditionGroup = {
  title: string
  items: string[]
}

export type ServiceDetailSection = {
  title: string
  body: string
  items?: string[]
}

export type ServiceItem = {
  slug: string
  name: string
  category: ServiceCategory
  priority: number
  tag: string
  meta: string
  summary: string
  description: string
  problem?: string
  whoItsFor: string[]
  benefits: string[]
  concerns: string[]
  conditionGroups?: ServiceConditionGroup[]
  detailSections?: ServiceDetailSection[]
  careModes: ServiceCareMode[]
  visual:
    | {
        type: 'image'
        src: string
        alt?: string
        fit?: 'cover' | 'contain'
      }
    | {
        type: 'icon'
        icon: ServiceIconName
        tone: ServiceVisualTone
      }
}

export type ServiceCategoryMeta = {
  id: ServiceCategory
  eyebrow: string
  title: string
  description: string
}

export type CareModeMeta = {
  id: ServiceCareMode
  title: string
  description: string
}

export const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM',
]

export const SERVICE_CATEGORIES: ServiceCategoryMeta[] = [
  {
    id: 'sexual-health-men',
    eyebrow: 'Sexual Health (Men)',
    title: 'Advanced Diagnosis & Personalized Treatments',
    description: 'Comprehensive evaluation and effective solutions to restore performance, confidence, and overall sexual wellness.',
  },
  {
    id: 'sexual-health-women',
    eyebrow: 'Sexual Health (Women)',
    title: 'Confidential Care for Women’s Sexual Wellness',
    description: 'Sensitive evaluation and counseling for desire, arousal, pain, dryness, orgasm concerns, and relationship comfort.',
  },
  {
    id: 'male-fertility',
    eyebrow: 'Male Fertility',
    title: 'Comprehensive Fertility Care & Diagnostics',
    description: 'Targeted solutions to improve reproductive outcomes, including advanced testing, screening, and treatment for low sperm count.',
  },
  {
    id: 'female-fertility',
    eyebrow: 'Female Fertility & Gynecology',
    title: 'Personalized Care for Women’s Health',
    description: 'Advanced treatments addressing the root causes of infertility, hormonal imbalances, and complete gynecological care.',
  },
  {
    id: 'couple-care',
    eyebrow: 'Couple Care',
    title: 'Joint Evaluation & Treatment Planning',
    description: 'Step-by-step guidance and support for couples facing difficulties conceiving, working together toward successful pregnancy.',
  },
  {
    id: 'infection-screening',
    eyebrow: 'Infection Screening',
    title: 'Private STI / STD Screening & Guidance',
    description: 'Confidential consultation, lab coordination, and treatment guidance for sexually transmitted infections and related concerns.',
  },
  {
    id: 'lifestyle-wellness',

    eyebrow: 'Lifestyle & Wellness',
    title: 'Holistic Management for Long-Term Health',
    description: 'Programs integrating stress reduction, hormonal management, and nutritional guidance to enhance reproductive health and performance.',
  },
]

export const CARE_MODES: CareModeMeta[] = [
  {
    id: 'clinic',
    title: 'Clinic Visit',
    description: 'For examinations, clinical assessments, report reviews, and consultations that need in-person care.',
  },
  {
    id: 'online',
    title: 'Online Consultation',
    description: 'A practical option for first guidance, review appointments, and ongoing support from outside Goa.',
  },
  {
    id: 'lab-coordination',
    title: 'Lab Coordination',
    description: 'Helps patients complete recommended blood tests and understand reports alongside the treatment plan.',
  },
]

export const SERVICES: ServiceItem[] = [
  // 1. Sexual Health (Men)
  {
    slug: 'erectile-dysfunction',
    name: 'Erectile Dysfunction Treatment',
    category: 'sexual-health-men',
    priority: 1,
    tag: 'ED Treatment',
    meta: 'Performance & Confidence',
    summary: 'Advanced diagnosis and treatment to restore performance and confidence.',
    description: 'Targeted care for difficulty achieving or maintaining an erection. We provide advanced diagnosis and personalized treatments to help restore sexual health and confidence.',
    problem: 'Difficulty achieving or maintaining erection',
    whoItsFor: ['Men experiencing difficulty achieving or maintaining erections', 'Individuals facing performance anxiety or stress', 'Patients with underlying conditions affecting sexual health'],
    benefits: ['Restores sexual performance and confidence', 'Addresses root causes for long-term improvement', 'Improves relationship satisfaction', 'Provides a safe and confidential care environment'],
    concerns: ['Erectile dysfunction', 'Performance anxiety', 'Loss of confidence in sexual situations'],
    conditionGroups: [
      {
        title: 'Performance concerns',
        items: ['Erectile dysfunction', 'Impotence concerns', 'Inability to consummate after marriage', 'Performance anxiety'],
      },
      {
        title: 'Medical context',
        items: ['Diabetes-related erection concerns', 'Heart health and medicine-related performance changes', 'Age-related erection difficulty'],
      },
    ],
    careModes: ['clinic', 'online'],
    visual: { type: 'image', src: '/servicespic/erectile-dysfunction-treatment.jpg' },
  },
  {
    slug: 'premature-ejaculation',
    name: 'Premature Ejaculation Treatment',
    category: 'sexual-health-men',
    priority: 2,
    tag: 'PE Treatment',
    meta: 'Control & Satisfaction',
    summary: 'Effective solutions to improve control and sexual satisfaction.',
    description: 'Comprehensive approach to managing early ejaculation and lack of control. Our treatments are designed to improve timing, control, and overall sexual satisfaction.',
    problem: 'Early ejaculation and lack of control',
    whoItsFor: ['Men experiencing early ejaculation', 'Individuals seeking better control during intimacy', 'Couples looking to improve their sexual experience'],
    benefits: ['Improves control and timing', 'Enhances sexual satisfaction for both partners', 'Reduces performance anxiety', 'Customized treatment plans based on individual needs'],
    concerns: ['Premature ejaculation', 'Lack of control', 'Anxiety related to performance'],
    conditionGroups: [
      {
        title: 'Timing and control',
        items: ['Premature ejaculation', 'Early ejaculation', 'Difficulty controlling timing', 'Relationship stress due to timing concerns'],
      },
      {
        title: 'Sensitivity concerns',
        items: ['Sensitive glans', 'Performance pressure', 'Anxiety before intercourse'],
      },
    ],
    careModes: ['clinic', 'online'],
    visual: { type: 'image', src: '/servicespic/premature-ejaculation-treatment.avif' },
  },
  {
    slug: 'male-sexual-wellness',
    name: 'Male Sexual Wellness',
    category: 'sexual-health-men',
    priority: 3,
    tag: 'Wellness',
    meta: 'Evaluation & Balance',
    summary: 'Complete evaluation of sexual health including lifestyle and hormones.',
    description: 'A holistic assessment of male sexual health, addressing issues like low libido, fatigue, and hormonal imbalance to improve overall well-being and vitality.',
    problem: 'Low libido, fatigue, hormonal imbalance',
    whoItsFor: ['Men experiencing low sex drive or fatigue', 'Individuals suspecting hormonal imbalances', 'Those wanting a comprehensive sexual health checkup'],
    benefits: ['Identifies and treats root causes of low libido', 'Restores energy levels and vitality', 'Balances hormones for improved health', 'Integrates lifestyle and nutritional guidance'],
    concerns: ['Low libido', 'Chronic fatigue', 'Hormonal imbalances like low testosterone'],
    conditionGroups: [
      {
        title: 'Desire and vitality',
        items: ['Low libido', 'Loss of sexual interest', 'Sexual weakness', 'Chronic fatigue affecting intimacy'],
      },
      {
        title: 'Hormonal and fitness review',
        items: ['Low testosterone concerns', 'Androgen imbalance', 'Sex potency fitness checkup', 'Lifestyle factors affecting sexual health'],
      },
    ],
    careModes: ['clinic', 'online', 'lab-coordination'],
    visual: { type: 'image', src: '/servicespic/male-sexual-wellness.jpg' },
  },
  {
    slug: 'ejaculation-disorders',
    name: 'Ejaculation Disorders Treatment',
    category: 'sexual-health-men',
    priority: 4,
    tag: 'Disorders',
    meta: 'Reproductive Health',
    summary: 'Treatment for ejaculation-related conditions to improve reproductive health.',
    description: 'Specialized care for conditions such as pain during ejaculation, delayed ejaculation, or blood in semen, aimed at improving both comfort and reproductive health.',
    problem: 'Pain, delayed ejaculation, blood in semen',
    whoItsFor: ['Men experiencing pain during ejaculation', 'Individuals with delayed ejaculation', 'Patients noticing blood in their semen'],
    benefits: ['Alleviates pain and discomfort', 'Improves overall reproductive health', 'Addresses potential underlying infections or conditions', 'Provides peace of mind through thorough diagnostics'],
    concerns: ['Painful ejaculation', 'Delayed ejaculation', 'Hematospermia (blood in semen)'],
    conditionGroups: [
      {
        title: 'Ejaculation changes',
        items: ['Delayed ejaculation', 'Absent ejaculation', 'Retarded ejaculation or orgasm', 'Painful ejaculation'],
      },
      {
        title: 'Semen-related symptoms',
        items: ['Blood-like semen concerns', 'Pus-like discharge in semen', 'Semen in urine', 'Low semen volume concerns'],
      },
    ],
    careModes: ['clinic', 'lab-coordination'],
    visual: { type: 'image', src: '/servicespic/ejaculation-disorders-treatment.jpg' },
  },
  {
    slug: 'dhat-nightfall-semen-concerns',
    name: 'Dhat, Nightfall & Semen Concerns',
    category: 'sexual-health-men',
    priority: 4.5,
    tag: 'Semen Concerns',
    meta: 'Confidential Evaluation',
    summary: 'Private consultation for nightfall, Dhat-like worries, and semen-related anxiety.',
    description: 'Sexual health consultations for men worried about nightfall, semen discharge, Dhat-like symptoms, or repeated anxiety about sexual weakness. The focus is on understanding the concern, discussing relevant symptoms and history, and planning any further assessment with a clinician.',
    problem: 'Nightfall, Dhat-like concerns, semen discharge worries, and anxiety about weakness',
    whoItsFor: ['Men worried about frequent nightfall or semen loss', 'Patients experiencing sticky or watery discharge concerns', 'Individuals feeling anxious, weak, or confused after semen-related symptoms'],
    benefits: ['Provides a non-judgmental evaluation', 'Discusses body changes and symptoms that may need assessment', 'Offers guidance on lifestyle and stress concerns', 'Coordinates tests when infection or urinary symptoms need review'],
    concerns: ['Dhat-like symptoms', 'Nightfall', 'Sticky or watery secretion', 'Low semen volume worries', 'Anxiety about sexual weakness'],
    conditionGroups: [
      {
        title: 'Common concerns',
        items: ['Dhat-like semen loss worries', 'Nightfall', 'Sticky or watery secretion', 'Low semen level concerns', 'Masturbation anxiety'],
      },
      {
        title: 'Related symptoms',
        items: ['Weakness after discharge', 'Anxiety after masturbation or intercourse', 'Urinary symptoms needing testing', 'Repeated fear about fertility or masculinity'],
      },
    ],
    detailSections: [
      {
        title: 'What patients often ask about',
        body: 'Many men worry that nightfall, watery discharge, masturbation, or a small amount of semen loss will permanently reduce strength or fertility. The consultation separates semen-loss myths from symptoms that may need medical review.',
        items: ['Nightfall frequency and sleep pattern', 'Masturbation anxiety and guilt', 'Watery or sticky discharge', 'Weakness fears after discharge'],
      },
      {
        title: 'When testing may be useful',
        body: 'If discharge is linked with burning, pain, fever, odor, or urinary discomfort, Dr. Bhusanar may recommend urine, semen, or infection-related tests before deciding the treatment plan.',
        items: ['Burning urination with discharge', 'Painful discharge', 'Repeated urinary irritation', 'Partner-exposure concerns when relevant'],
      },
    ],
    careModes: ['clinic', 'online', 'lab-coordination'],
    visual: { type: 'image', src: '/servicespic/dhat-nightfall-semen-concerns.jpg' },
  },
  {
    slug: 'penile-curvature-genital-health',
    name: 'Penile Curvature & Genital Health',
    category: 'sexual-health-men',
    priority: 4.6,
    tag: 'Genital Health',
    meta: 'Examination & Guidance',
    summary: 'Evaluation for curvature, shape concerns, discomfort, and intimate health worries.',
    description: 'A private consultation for men concerned about penile curvature, abnormal shape, discomfort, sensitive areas, or other genital health symptoms. The clinic helps decide whether reassurance, medical treatment, diagnostic testing, or referral is the safest next step.',
    problem: 'Curvature, shape concerns, discomfort, or repeated worry about genital health',
    whoItsFor: ['Men noticing curvature or shape changes', 'Patients with discomfort, sensitivity, or anxiety about genital health', 'Individuals unsure whether symptoms need medical evaluation'],
    benefits: ['Provides respectful examination and clear guidance', 'Identifies symptoms that may need tests or referral', 'Reduces anxiety with practical explanation', 'Keeps intimate health discussions confidential'],
    concerns: ['Penile curvature', 'Abnormal shape concerns', 'Sensitive glans', 'Discomfort during intimacy', 'Genital health anxiety'],
    conditionGroups: [
      {
        title: 'Shape and sensitivity',
        items: ['Penile curvature', 'Hidden or shrunken appearance concerns', 'Sensitive glans', 'Pain or discomfort during intimacy'],
      },
      {
        title: 'When to review',
        items: ['Sudden change in shape', 'Blue veins, swelling, or pain', 'Foreskin tightness or phimosis', 'Testis or scrotum pain'],
      },
    ],
    detailSections: [
      {
        title: 'Genital appearance and shape concerns',
        body: 'A private examination can help clarify whether curvature, a hidden or shrunken appearance, blue veins, swelling, or size-related anxiety is a normal variation, a treatable condition, or something that needs referral.',
        items: ['Penile curvature', 'Hidden or shrunken appearance concerns', 'Blue veins', 'Swelling or pain', 'Body-image anxiety'],
      },
      {
        title: 'Symptoms that need timely review',
        body: 'Pain, ulcers or sores, discharge, foreskin tightness, phimosis, testis or scrotum pain, and burning urination after sex should be discussed promptly so infection, inflammation, injury, or urinary causes can be checked.',
        items: ['Ulcers or sores', 'Foreskin tightness or phimosis', 'Testis or scrotum pain', 'Burning urination after sex'],
      },
    ],
    careModes: ['clinic', 'online', 'lab-coordination'],
    visual: { type: 'image', src: '/servicespic/penile-curvature-genital-health.jpg' },
  },

  // 2. Male Fertility
  {
    slug: 'male-infertility',
    name: 'Male Infertility Treatment',
    category: 'male-fertility',
    priority: 5,
    tag: 'Infertility',
    meta: 'Reproductive Outcomes',
    summary: 'Comprehensive fertility care to improve reproductive outcomes.',
    description: 'Advanced diagnostic and treatment protocols for men facing issues like low sperm count or poor sperm quality, focused on improving the chances of conception.',
    problem: 'Low sperm count, poor quality',
    whoItsFor: ['Men diagnosed with infertility', 'Couples struggling to conceive due to male factors', 'Individuals needing advanced reproductive care'],
    benefits: ['Improves sperm count and quality', 'Enhances overall fertility potential', 'Provides clear treatment pathways based on diagnostics', 'Supports couples in their conception journey'],
    concerns: ['Male factor infertility', 'Poor sperm morphology or motility', 'Difficulty conceiving'],
    conditionGroups: [
      {
        title: 'Sperm health findings',
        items: ['Abnormal sperm morphology', 'Low sperm motility', 'Low sperm count', 'Dead sperm findings'],
      },
      {
        title: 'Advanced male-factor concerns',
        items: ['Azoospermia or nil sperm', 'Antisperm antibody concerns', 'Ejaculatory factors affecting fertility', 'Unexplained male-factor infertility'],
      },
    ],
    detailSections: [
      {
        title: 'Understanding semen analysis findings',
        body: 'Male fertility care starts by interpreting semen analysis education in simple language: count, motility, morphology, volume, and signs of infection or inflammation.',
        items: ['Abnormal sperm morphology', 'Low sperm motility', 'Dead sperm findings', 'Low semen volume'],
      },
      {
        title: 'Advanced male-factor evaluation',
        body: 'When reports show azoospermia or nil sperm, antisperm antibody concerns, or repeated abnormal reports, the clinic guides next tests, lifestyle correction, treatment planning, and referral when needed.',
        items: ['Azoospermia or nil sperm', 'Antisperm antibody concerns', 'Repeated abnormal semen reports', 'Hormonal review'],
      },
    ],
    careModes: ['clinic', 'online', 'lab-coordination'],
    visual: { type: 'image', src: '/servicespic/male-infertility-treatment.jpg' },
  },
  {
    slug: 'low-sperm-count',
    name: 'Low Sperm Count Treatment',
    category: 'male-fertility',
    priority: 6,
    tag: 'Oligospermia',
    meta: 'Targeted Solutions',
    summary: 'Targeted solutions to increase sperm count and quality.',
    description: 'Personalized treatment plans addressing oligospermia (low sperm count) caused by lifestyle factors, hormonal issues, or other underlying conditions.',
    problem: 'Oligospermia due to lifestyle or hormonal issues',
    whoItsFor: ['Men diagnosed with low sperm count', 'Individuals with hormonal imbalances affecting fertility', 'Patients looking to optimize their fertility through lifestyle changes'],
    benefits: ['Specifically targets causes of low sperm count', 'Balances hormones to support sperm production', 'Provides actionable lifestyle and nutritional advice', 'Monitors progress through regular testing'],
    concerns: ['Oligospermia', 'Hormonal imbalance affecting fertility', 'Lifestyle factors impacting sperm health'],
    conditionGroups: [
      {
        title: 'Report findings',
        items: ['Low sperm count', 'Low sperm motility', 'Poor morphology', 'Dead sperm findings'],
      },
      {
        title: 'Contributing factors',
        items: ['Hormonal imbalance', 'Stress and poor sleep', 'Smoking or alcohol impact', 'Heat exposure and lifestyle factors'],
      },
    ],
    detailSections: [
      {
        title: 'What low count can mean',
        body: 'A low sperm count does not always mean the same treatment for every patient. The plan depends on count, motility, morphology, infection signs, hormone reports, lifestyle, and the couple’s fertility timeline.',
        items: ['Semen analysis education', 'Hormone testing review', 'Lifestyle and nutrition review', 'Follow-up report comparison'],
      },
      {
        title: 'Monitoring progress',
        body: 'Because sperm production changes over time, treatment guidance often includes repeat reports and practical lifestyle steps rather than a one-visit promise.',
        items: ['Repeat semen analysis', 'Review of treatment options with a clinician', 'Discussion of sleep, stress, diet, and habits'],
      },
    ],
    careModes: ['clinic', 'online', 'lab-coordination'],
    visual: { type: 'image', src: '/servicespic/low-sperm-count-treatment.webp' },
  },
  {
    slug: 'fertility-diagnostic-testing',
    name: 'Fertility Diagnostic Testing',
    category: 'male-fertility',
    priority: 7,
    tag: 'Diagnostics',
    meta: 'Analysis & Testing',
    summary: 'Includes semen analysis, hormone testing, ultrasound, and genetic tests.',
    description: 'Comprehensive diagnostic services to identify the root causes of unknown fertility issues. Our advanced testing provides a clear picture of your reproductive health.',
    problem: 'Unknown fertility issues',
    whoItsFor: ['Couples beginning their fertility evaluation', 'Men needing semen analysis or hormone testing', 'Individuals requiring advanced genetic or ultrasound evaluations'],
    benefits: ['Provides accurate and comprehensive diagnosis', 'Guides personalized treatment planning', 'Identifies hidden or underlying fertility issues', 'Uses state-of-the-art diagnostic tools'],
    concerns: ['Unknown causes of infertility', 'Need for detailed reproductive health analysis', 'Requirement for specific fertility tests'],
    conditionGroups: [
      {
        title: 'Male testing',
        items: ['Semen analysis education', 'Hormone testing', 'Sperm motility and morphology review', 'Azoospermia or nil sperm confirmation'],
      },
      {
        title: 'Couple testing coordination',
        items: ['Timing and ovulation history', 'Blood test coordination', 'Ultrasound guidance when needed', 'Report explanation for both partners'],
      },
    ],
    detailSections: [
      {
        title: 'Why diagnostics come first',
        body: 'The clinic explains reports in plain language and discusses the next steps, which may include further assessment, treatment options, lifestyle guidance, specialist referral, or couple evaluation.',
        items: ['Semen analysis education', 'Hormone panel review', 'Infection screening where needed', 'Couple fertility timeline'],
      },
    ],
    careModes: ['clinic', 'lab-coordination'],
    visual: { type: 'image', src: '/servicespic/fertility-diagnostic=testing.jpg' },
  },
  {
    slug: 'early-infertility-screening',
    name: 'Early Infertility Screening',
    category: 'male-fertility',
    priority: 8,
    tag: 'Screening',
    meta: 'Early Detection',
    summary: 'Early detection and prevention-focused fertility care.',
    description: 'Proactive screening for individuals experiencing early symptoms like erectile dysfunction or fatigue, aimed at early detection and preserving future fertility.',
    problem: 'Early symptoms like ED, fatigue',
    whoItsFor: ['Men wanting to proactively check their fertility', 'Individuals with symptoms like ED or fatigue wanting to rule out fertility impacts', 'Those planning for future parenthood'],
    benefits: ['Identifies potential issues before they become severe', 'Allows for early intervention and prevention', 'Provides peace of mind', 'Integrates with overall sexual wellness checks'],
    concerns: ['Proactive fertility health', 'Impact of early symptoms on future fertility', 'Preventive care'],
    careModes: ['clinic', 'online', 'lab-coordination'],
    visual: { type: 'image', src: '/servicespic/early-infertility-screening.jpg' },
  },

  // 3. Sexual Health (Women)
  {
    slug: 'female-sexual-wellness',
    name: 'Female Sexual Wellness',
    category: 'sexual-health-women',
    priority: 8.5,
    tag: 'Women’s Wellness',
    meta: 'Desire & Comfort',
    summary: 'Confidential care for desire, arousal, orgasm, dryness, and intimacy concerns.',
    description: 'Sensitive consultation for women experiencing low desire, arousal difficulty, absent orgasm, dryness, discomfort, or reduced enjoyment during intimacy. Care is private, respectful, and planned around physical, hormonal, emotional, and relationship factors.',
    problem: 'Low desire, arousal difficulty, dryness, absent orgasm, or reduced enjoyment',
    whoItsFor: ['Women experiencing low sexual desire or arousal concerns', 'Patients with vaginal dryness or discomfort affecting intimacy', 'Individuals wanting private guidance before or after marriage'],
    benefits: ['Creates a safe space to discuss intimate concerns', 'Reviews hormonal, lifestyle, stress, and relationship factors', 'Coordinates gynecological or lab review when needed', 'Supports comfort, confidence, and communication'],
    concerns: ['Low sex desire', 'Sexual arousal disorder', 'Absent orgasm', 'Dryness of vagina', 'Lack of enjoyment during intercourse'],
    conditionGroups: [
      {
        title: 'Desire and arousal',
        items: ['Low sex desire', 'Hypoactive sexual desire concerns', 'Sexual arousal difficulty', 'Sexual aversion or fear'],
      },
      {
        title: 'Comfort and satisfaction',
        items: ['Absent orgasm', 'Reduced enjoyment during intercourse', 'Vaginal dryness', 'Body-image concerns and breast-size concerns as counseling topics'],
      },
    ],
    detailSections: [
      {
        title: 'Desire, arousal, and comfort',
        body: 'Female sexual wellness is approached respectfully, without blame. Low desire, arousal difficulty, absent orgasm, sexual aversion, and dryness can involve hormones, stress, pain, medicines, relationship pressure, or past experiences.',
        items: ['Low desire', 'Arousal concerns', 'Absent orgasm', 'Sexual aversion', 'Vaginal dryness'],
      },
      {
        title: 'Counseling without unrealistic promises',
        body: 'Questions about body image or breast-size concerns are handled as counseling and confidence concerns, not as enlargement promises. When symptoms suggest a gynecological or hormonal cause, testing or referral may be advised.',
        items: ['Body-image concerns', 'Breast-size concerns as counseling only', 'Premarital questions', 'Relationship comfort'],
      },
    ],
    careModes: ['clinic', 'online', 'lab-coordination'],
    visual: { type: 'image', src: '/servicespic/female-sexual-wellness.jpg' },
  },
  {
    slug: 'painful-intercourse-vaginismus',
    name: 'Painful Intercourse & Vaginismus Care',
    category: 'sexual-health-women',
    priority: 8.6,
    tag: 'Painful Intimacy',
    meta: 'Comfort & Counseling',
    summary: 'Support for pain during intercourse, vaginismus, dryness, and white discharge concerns.',
    description: 'Compassionate evaluation for pain during intercourse, vaginismus, vaginal dryness, white discharge, or fear around intimacy. The clinic helps identify infection, inflammation, anxiety, pelvic-floor, or gynecological causes and guides the next step privately.',
    problem: 'Painful intercourse, vaginismus, dryness, white discharge, or fear of intimacy',
    whoItsFor: ['Women experiencing pain or tightness during intercourse', 'Patients with vaginismus-like symptoms or fear around intimacy', 'Individuals with recurrent discharge, dryness, or irritation'],
    benefits: ['Supports comfort with private, step-by-step guidance', 'Identifies infection or gynecological issues that need treatment', 'Combines counseling, lifestyle support, and referral when needed', 'Helps couples approach intimacy with less fear and pressure'],
    concerns: ['Pain during intercourse', 'Vaginismus', 'Leucorrhoea or white discharge', 'Posterior fourchette discomfort', 'Vaginal dryness and irritation'],
    conditionGroups: [
      {
        title: 'Pain and tightness',
        items: ['Pain during intercourse', 'Vaginismus', 'Fear or tightening before intimacy', 'Posterior fourchette discomfort'],
      },
      {
        title: 'Discharge and irritation',
        items: ['Leucorrhoea or white discharge', 'Vaginal dryness', 'Burning or irritation', 'Recurrent irritation or infection concerns'],
      },
    ],
    detailSections: [
      {
        title: 'Pain, fear, and tightening',
        body: 'Painful intercourse and vaginismus-like tightness are treated with patience. The goal is to understand whether pain is related to infection, dryness, pelvic-floor response, fear, relationship pressure, or gynecological causes.',
        items: ['Pain during intercourse', 'Fear or tightness before intercourse', 'Vaginismus-like symptoms', 'Posterior fourchette discomfort'],
      },
      {
        title: 'Discharge and irritation review',
        body: 'Leucorrhoea, recurrent irritation, burning, odor, or dryness may need examination and lab coordination. The clinic can guide treatment planning and partner discussion when infection is suspected.',
        items: ['Leucorrhoea or white discharge', 'Recurrent irritation', 'Vaginal dryness', 'Burning or itching'],
      },
    ],
    careModes: ['clinic', 'online', 'lab-coordination'],
    visual: { type: 'image', src: '/servicespic/painful-intercourse-vaginismus.jpg' },
  },

  // 4. Female Fertility & Gynecology
  {
    slug: 'pcos-pcod-treatment',
    name: 'PCOS / PCOD Treatment',
    category: 'female-fertility',
    priority: 9,
    tag: 'PCOS/PCOD',
    meta: 'Hormonal Balance',
    summary: 'Personalized care to restore hormonal balance and fertility.',
    description: 'Specialized treatment for Polycystic Ovary Syndrome (PCOS) and PCOD, addressing hormonal imbalances, irregular periods, and their impact on fertility.',
    problem: 'Hormonal imbalance, irregular periods',
    whoItsFor: ['Women diagnosed with PCOS or PCOD', 'Individuals experiencing irregular menstrual cycles', 'Patients struggling with PCOS-related infertility'],
    benefits: ['Restores hormonal balance and cycle regularity', 'Improves chances of natural conception', 'Manages symptoms like weight gain or acne', 'Provides comprehensive lifestyle and medical management'],
    concerns: ['PCOS / PCOD', 'Irregular menstrual cycles', 'Hormonal imbalances'],
    careModes: ['clinic', 'online', 'lab-coordination'],
    visual: { type: 'image', src: '/servicespic/PCOD-PCOS.webp' },
  },
  {
    slug: 'female-infertility',
    name: 'Female Infertility Treatment',
    category: 'female-fertility',
    priority: 10,
    tag: 'Infertility',
    meta: 'Advanced Care',
    summary: 'Advanced treatments addressing root causes of infertility.',
    description: 'Comprehensive evaluation and treatment for women having difficulty conceiving. We focus on identifying and treating the root causes to improve reproductive success.',
    problem: 'Difficulty conceiving',
    whoItsFor: ['Women struggling to conceive naturally', 'Patients needing advanced fertility diagnostics', 'Individuals requiring personalized fertility treatment plans'],
    benefits: ['Identifies specific causes of female infertility', 'Offers advanced, evidence-based treatments', 'Supports overall reproductive health', 'Provides emotional and medical support throughout the process'],
    concerns: ['Female factor infertility', 'Unexplained infertility', 'Difficulty getting pregnant'],
    conditionGroups: [
      {
        title: 'Hormonal factors',
        items: ['High prolactin-related fertility concerns', 'Thyroid-related fertility concerns', 'Irregular cycles affecting conception'],
      },
      {
        title: 'Pregnancy and conception history',
        items: ['Difficulty conceiving after one year', 'Recurrent pregnancy loss', 'Unexplained female-factor infertility'],
      },
    ],
    detailSections: [
      {
        title: 'Hormonal and cycle review',
        body: 'Female infertility evaluation may include cycle history, ovulation pattern, thyroid-related fertility concerns, high prolactin-related concerns, PCOS/PCOD symptoms, and other hormone-linked factors.',
        items: ['High prolactin-related fertility concerns', 'Thyroid-related fertility concerns', 'Irregular cycles', 'Ovulation tracking'],
      },
      {
        title: 'Pregnancy history and next steps',
        body: 'Recurrent pregnancy loss or repeated difficulty conceiving should be reviewed with both emotional care and appropriate medical evaluation. The clinic helps organize reports and referral when specialist care is needed.',
        items: ['Recurrent pregnancy loss', 'Difficulty conceiving after one year', 'Couple fertility planning', 'Report review'],
      },
    ],
    careModes: ['clinic', 'online', 'lab-coordination'],
    visual: { type: 'image', src: '/servicespic/female-infertility-treatment.jpg' },
  },
  {
    slug: 'fibroid-treatment',
    name: 'Fibroid Treatment',
    category: 'female-fertility',
    priority: 11,
    tag: 'Fibroids',
    meta: 'Uterine Health',
    summary: 'Diagnosis and treatment to improve uterine health.',
    description: 'Expert care for uterine fibroids that may be causing pain, heavy bleeding, or affecting fertility. Our treatments are designed to improve uterine health and overall well-being.',
    problem: 'Uterine fibroids affecting fertility',
    whoItsFor: ['Women diagnosed with uterine fibroids', 'Patients experiencing symptoms like heavy bleeding or pelvic pain', 'Individuals whose fertility is impacted by fibroids'],
    benefits: ['Manages and treats fibroid symptoms', 'Improves uterine health for better fertility outcomes', 'Offers both medical and minimally invasive options', 'Reduces pain and discomfort'],
    concerns: ['Uterine fibroids', 'Heavy menstrual bleeding', 'Pelvic pain related to fibroids'],
    careModes: ['clinic', 'online'],
    visual: { type: 'image', src: '/servicespic/fibroid-treatment.avif' },
  },
  {
    slug: 'endometriosis-treatment',
    name: 'Endometriosis Treatment',
    category: 'female-fertility',
    priority: 12,
    tag: 'Endometriosis',
    meta: 'Symptom Management',
    summary: 'Specialized care to manage symptoms and improve fertility.',
    description: 'Comprehensive management of endometriosis, focusing on alleviating painful periods, managing symptoms, and improving fertility outcomes for affected women.',
    problem: 'Painful periods and infertility',
    whoItsFor: ['Women suffering from painful periods or pelvic pain', 'Patients diagnosed with endometriosis', 'Individuals struggling with fertility due to endometriosis'],
    benefits: ['Reduces pain and improves quality of life', 'Manages disease progression', 'Optimizes fertility for those trying to conceive', 'Provides specialized, compassionate care'],
    concerns: ['Endometriosis', 'Severe menstrual pain', 'Infertility linked to endometriosis'],
    careModes: ['clinic', 'online'],
    visual: { type: 'image', src: '/servicespic/endometriosis-treatment.webp' },
  },
  {
    slug: 'gynecological-care',
    name: 'Gynecological Care',
    category: 'female-fertility',
    priority: 13,
    tag: 'Gynecology',
    meta: 'Women’s Health',
    summary: 'Complete women’s health services including routine checkups and disorder management.',
    description: 'Comprehensive gynecological services addressing menstrual disorders, infections, ovarian cysts, and providing overall health care for women at all stages of life.',
    problem: 'Menstrual disorders, infections, cysts',
    whoItsFor: ['Women needing routine gynecological exams', 'Patients with menstrual irregularities or infections', 'Individuals managing conditions like ovarian cysts'],
    benefits: ['Provides comprehensive preventive care', 'Effectively treats infections and menstrual disorders', 'Monitors and manages cysts and other common issues', 'Promotes overall women’s health and wellness'],
    concerns: ['Menstrual irregularities', 'Vaginal infections', 'Ovarian cysts', 'Routine women’s health checks'],
    conditionGroups: [
      {
        title: 'Common gynecological concerns',
        items: ['Irregular cycles', 'Vaginal infections', 'Ovarian cysts', 'Pelvic discomfort'],
      },
      {
        title: 'When to seek care',
        items: ['Recurrent irritation', 'Unusual discharge', 'Heavy or painful periods', 'Fertility-related cycle concerns'],
      },
    ],
    detailSections: [
      {
        title: 'Women’s health review',
        body: 'Gynecological care supports menstrual, infection, cyst, and hormone-related concerns. Patients can begin with a confidential consultation and then complete tests or referral only when needed.',
        items: ['Irregular cycles', 'Infections', 'Cysts', 'Hormonal symptoms', 'Fertility-linked gynecology concerns'],
      },
    ],
    careModes: ['clinic', 'online', 'lab-coordination'],
    visual: { type: 'image', src: '/servicespic/gynecological-care.jpg' },
  },

  // 4. Couple Care
  {
    slug: 'couple-fertility-consultation',
    name: 'Couple Fertility Consultation',
    category: 'couple-care',
    priority: 14,
    tag: 'Consultation',
    meta: 'Joint Evaluation',
    summary: 'Joint evaluation and treatment planning for couples.',
    description: 'A collaborative approach to fertility care, offering joint evaluation and coordinated treatment planning for couples experiencing difficulty conceiving.',
    problem: 'Difficulty conceiving together',
    whoItsFor: ['Couples beginning their fertility journey', 'Partners who both need fertility evaluation', 'Those seeking a coordinated, joint treatment plan'],
    benefits: ['Evaluates both partners simultaneously for faster answers', 'Creates a unified, coordinated treatment plan', 'Reduces stress by addressing fertility as a team', 'Provides comprehensive support for the couple'],
    concerns: ['Couple infertility', 'Need for joint reproductive evaluation', 'Coordinated treatment planning'],
    careModes: ['clinic', 'online'],
    visual: { type: 'image', src: '/servicespic/couple-fertility-consultation.webp' },
  },
  {
    slug: 'parenthood-planning',
    name: 'Parenthood Planning',
    category: 'couple-care',
    priority: 15,
    tag: 'Planning',
    meta: 'Step-by-Step Guidance',
    summary: 'Step-by-step guidance toward successful pregnancy.',
    description: 'Expert guidance and structured planning for couples facing confusion or delays in conception, helping them navigate their path to successful parenthood.',
    problem: 'Confusion or delays in conception',
    whoItsFor: ['Couples planning to start a family', 'Individuals confused about the conception process', 'Partners experiencing delays but not yet diagnosed with infertility'],
    benefits: ['Provides a clear, step-by-step roadmap to conception', 'Educates couples on optimal timing and practices', 'Reduces anxiety related to conception delays', 'Offers professional support and monitoring'],
    concerns: ['Pre-conception planning', 'Delays in getting pregnant', 'Understanding the conception window'],
    careModes: ['clinic', 'online'],
    visual: { type: 'image', src: '/servicespic/parenthood-planning.jpg' },
  },
  {
    slug: 'sex-counseling-education',
    name: 'Sex Counseling & Education',
    category: 'couple-care',
    priority: 15.5,
    tag: 'Counseling',
    meta: 'Private Guidance',
    summary: 'Sex therapy, premarital counseling, performance guidance, and couple communication support.',
    description: 'Private counseling for individuals and couples who want practical, respectful guidance around intimacy, performance confidence, premarital questions, communication, and sexual health education. Sessions are designed to reduce confusion and help patients make informed decisions.',
    problem: 'Confusion, anxiety, communication gaps, or lack of reliable sexual health guidance',
    whoItsFor: ['Individuals wanting confidential sexual health education', 'Couples needing communication or intimacy guidance', 'Patients preparing for marriage or working through performance anxiety'],
    benefits: ['Provides clear, non-judgmental education', 'Supports healthier couple communication', 'Reduces fear, myths, and performance pressure', 'Connects counseling with medical evaluation when symptoms need review'],
    concerns: ['Premarital sex education', 'Sex therapy', 'Performance confidence', 'Couple communication', 'Anxiety around intimacy'],
    conditionGroups: [
      {
        title: 'Education and counseling',
        items: ['Premarital counseling', 'First-intercourse guidance', 'Sex therapy', 'Reliable sexual health education'],
      },
      {
        title: 'Couple support',
        items: ['Communication around intimacy', 'Fear or hesitation before intercourse', 'Performance confidence', 'Safe sex questions'],
      },
    ],
    detailSections: [
      {
        title: 'Practical sex education',
        body: 'Sex counseling helps patients replace fear and misinformation with clear guidance. Topics can include first-intercourse guidance, safe sex, contraception questions, hygiene, consent, and when symptoms need a medical review.',
        items: ['Premarital counseling', 'First-intercourse guidance', 'Safe sex', 'Sexual health myths', 'Consent and communication'],
      },
      {
        title: 'Anxiety and relationship support',
        body: 'Performance confidence, masturbation myths, guilt, fear of failure, and couple communication can be discussed privately. The clinic keeps the tone respectful and can connect counseling with medical evaluation when symptoms are present.',
        items: ['Performance confidence', 'Masturbation myths', 'Couple communication', 'Fear around intimacy', 'Non-judgmental counseling for sexual identity or relationship questions'],
      },
    ],
    careModes: ['clinic', 'online'],
    visual: { type: 'image', src: '/servicespic/sex-counseling-education.jpg' },
  },

  // 5. Infection Screening
  {
    slug: 'sti-std-screening-treatment',
    name: 'STI / STD Screening & Treatment Guidance',
    category: 'infection-screening',
    priority: 15.8,
    tag: 'STI / STD',
    meta: 'Private Testing',
    summary: 'Confidential screening, lab coordination, and treatment guidance for sexually transmitted infections.',
    description: 'Private consultation for possible sexually transmitted infections, including symptoms such as discharge, sores, burning, pain, or exposure concerns. The clinic can coordinate appropriate testing, explain results, and guide treatment or referral when needed.',
    problem: 'Possible STI exposure, symptoms, or concern after intimate contact',
    whoItsFor: ['Patients with possible STI exposure or symptoms', 'Individuals needing private testing and report explanation', 'Couples who want screening before treatment planning or marriage'],
    benefits: ['Keeps testing and discussion confidential', 'Coordinates labs for accurate diagnosis where needed', 'Supports timely treatment guidance and partner counseling', 'Helps reduce anxiety with clear next steps'],
    concerns: ['Chlamydia concerns', 'Gonorrhoea symptoms', 'Genital herpes', 'Syphilis screening', 'Discharge, sores, burning, or exposure anxiety'],
    conditionGroups: [
      {
        title: 'Common STI concerns',
        items: ['Chlamydia', 'Gonorrhoea', 'Genital herpes', 'Syphilis', 'General STI exposure concerns'],
      },
      {
        title: 'Symptoms to discuss',
        items: ['Discharge', 'Genital ulcers or sores', 'Burning urination', 'Pain after intercourse', 'Partner-exposure concerns'],
      },
    ],
    detailSections: [
      {
        title: 'Private STI / STD symptom review',
        body: 'Symptoms such as discharge, genital ulcers or sores, blisters, burning urination, pain after intercourse, or partner-exposure concerns should be discussed early. Testing helps avoid guessing and protects both partners.',
        items: ['Discharge', 'Genital ulcers or sores', 'Burning urination', 'Pain after intercourse', 'Partner-exposure concerns'],
      },
      {
        title: 'Testing and treatment guidance',
        body: 'The clinic can coordinate lab testing for suspected chlamydia, gonorrhoea, genital herpes, syphilis, and related infections, then explain reports and guide treatment planning or referral when needed.',
        items: ['Chlamydia', 'Gonorrhoea', 'Genital herpes', 'Syphilis', 'Partner counseling'],
      },
    ],
    careModes: ['clinic', 'online', 'lab-coordination'],
    visual: { type: 'image', src: '/servicespic/sti-std-screening-treatment.jpg' },
  },

  // 6. Lifestyle & Wellness
  {
    slug: 'homeopathy-consultation',
    name: 'Homeopathic Consultation & Medicines',
    category: 'lifestyle-wellness',
    priority: 15.9,
    tag: 'Homeopathy',
    meta: 'Consultation & medicines',
    summary: 'Homeopathic consultations and medicines are available at the clinic following an individual consultation.',
    description: 'Discuss your health concerns, history and current medicines with the clinic’s homeopathy practitioner. Homeopathic medicines are also available, with any proposed plan and follow-up explained during your consultation. This service listing does not promise a cure or a particular treatment outcome.',
    whoItsFor: ['People wishing to discuss homeopathic care with a practitioner', 'Patients seeking information about homeopathic medicines available at the clinic', 'Existing patients arranging a homeopathy follow-up'],
    benefits: ['Time to discuss your concerns and health history', 'An explanation of the proposed consultation plan', 'Information about available medicines and follow-up'],
    concerns: ['Questions about homeopathic care', 'Discussion of current medicines', 'Follow-up appointments'],
    detailSections: [{
      title: 'Homeopathic medicines at the clinic',
      body: 'Ask the clinic about homeopathic medicine availability during your consultation. The practitioner will explain any proposed medicines and follow-up. Availability and individual suitability are discussed before a plan is agreed.',
    }],
    careModes: ['clinic'],
    visual: {
      type: 'image',
      src: '/clinical-team/dr-raju-bhusnar.jpeg',
      alt: 'Dr. Raju Bhusanar at Yashraj Clinic',
      fit: 'contain',
    },
  },
  {
    slug: 'stress-fertility-management',
    name: 'Stress & Fertility Management',
    category: 'lifestyle-wellness',
    priority: 16,
    tag: 'Stress Management',
    meta: 'Reproductive Health',
    summary: 'Programs to reduce stress and improve fertility.',
    description: 'Holistic programs designed to manage and reduce stress levels, recognizing the significant impact stress can have on reproductive health and fertility outcomes.',
    problem: 'Stress affecting reproductive health',
    whoItsFor: ['Individuals experiencing high stress levels', 'Couples whose fertility may be impacted by lifestyle stress', 'Patients looking for holistic support during fertility treatments'],
    benefits: ['Lowers stress levels to improve overall health', 'Positively impacts hormonal balance and fertility', 'Teaches effective coping and relaxation techniques', 'Enhances the success rates of other fertility treatments'],
    concerns: ['Stress-induced fertility issues', 'Anxiety related to trying to conceive', 'Need for holistic support'],
    careModes: ['clinic', 'online'],
    visual: { type: 'image', src: '/servicespic/stress-fertility-management.avif' },
  },
  {
    slug: 'hormonal-lifestyle-management',
    name: 'Hormonal & Lifestyle Management',
    category: 'lifestyle-wellness',
    priority: 17,
    tag: 'Lifestyle',
    meta: 'Long-term Health',
    summary: 'Lifestyle-based treatment for long-term health and hormonal balance.',
    description: 'Comprehensive management of lifestyle factors such as obesity, alcohol consumption, smoking, and overall hormonal imbalance to improve long-term health and fertility.',
    problem: 'Obesity, alcohol, smoking, imbalance',
    whoItsFor: ['Individuals needing to optimize their lifestyle for fertility', 'Patients struggling with obesity or metabolic issues', 'Those looking to quit smoking or reduce alcohol for reproductive health'],
    benefits: ['Improves overall physical health and hormonal balance', 'Increases chances of conception naturally', 'Provides structured guidance for healthy habit formation', 'Supports long-term reproductive and general wellness'],
    concerns: ['Lifestyle impacts on fertility', 'Obesity and hormonal imbalance', 'Need for structured lifestyle changes'],
    careModes: ['clinic', 'online', 'lab-coordination'],
    visual: { type: 'image', src: '/servicespic/harmonal-lifestyle-management.jpg' },
  },
  {
    slug: 'nutrition-sexual-health',
    name: 'Nutrition & Sexual Health',
    category: 'lifestyle-wellness',
    priority: 18,
    tag: 'Nutrition',
    meta: 'Diet & Supplements',
    summary: 'Diet and supplement guidance for better performance and health.',
    description: 'Targeted nutritional counseling and supplement guidance tailored to improve sexual health, performance, and overall vitality, addressing poor diet impacts.',
    problem: 'Poor diet affecting performance',
    whoItsFor: ['Individuals looking to improve sexual health through diet', 'Patients needing guidance on supplements for fertility', 'Those experiencing performance issues related to poor nutrition'],
    benefits: ['Optimizes nutritional intake for sexual health', 'Provides evidence-based supplement recommendations', 'Boosts energy and performance naturally', 'Complements other medical treatments effectively'],
    concerns: ['Nutritional deficiencies affecting sexual health', 'Need for specific diet plans for fertility', 'Understanding the right supplements to take'],
    careModes: ['clinic', 'online'],
    visual: { type: 'image', src: '/servicespic/nutrition-sexual-health.jpg' },
  }
];

export const ORDERED_SERVICES = [...SERVICES].sort((a, b) => a.priority - b.priority)

export function getServiceBySlug(slug: string) {
  return SERVICES.find((service) => service.slug === slug)
}

export function getServicesByCategory(category: ServiceCategory) {
  return ORDERED_SERVICES.filter((service) => service.category === category)
}

export function getCategoryMeta(category: ServiceCategory) {
  return SERVICE_CATEGORIES.find((item) => item.id === category)
}

export function getCareModeMeta(mode: ServiceCareMode) {
  return CARE_MODES.find((item) => item.id === mode)
}

export function getRelatedServices(slug: string, limit = 3) {
  const current = getServiceBySlug(slug)
  if (!current) return []

  const sameCategory = ORDERED_SERVICES.filter(
    (service) => service.slug !== slug && service.category === current.category
  )
  const fallback = ORDERED_SERVICES.filter(
    (service) => service.slug !== slug && service.category !== current.category
  )

  return [...sameCategory, ...fallback].slice(0, limit)
}
