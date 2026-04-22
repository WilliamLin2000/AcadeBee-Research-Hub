import { Mail, ShieldCheck, Wrench, Users } from 'lucide-react'
import brandLogo from '../assets/square img0.png'
import williamPhoto from '../assets/square img3.png'
import './AboutPage.css'

const FOUNDER = {
  name: 'William Lin',
  role: '創辦人 · 生醫工程博士生',
  bio: '生物力學 / 醫學工程與人工智慧整合應用，負責 AcadeBee 的產品、工程與日常營運。',
  story:
    '我相信好的媒合工具應讓研究方與接案者都看得懂流程、找得到彼此。AcadeBee 由我獨立開發與營運，從一人專案起步，會依使用者回饋持續改進。',
  photo: williamPhoto,
  initials: 'WL',
}

const VALUES = [
  {
    title: '透明流程',
    desc: '任務刊登、報價、承接與狀態更新皆可追蹤，降低溝通成本。',
    icon: Wrench,
  },
  {
    title: '學術信任',
    desc: '支援學術信箱驗證與 ORCID 連結，提升合作對象識別度。',
    icon: ShieldCheck,
  },
  {
    title: '長期共創',
    desc: '透過需求端與接案端持續回饋，逐步打造更可靠的研究媒合體驗。',
    icon: Users,
  },
]

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>關於 AcadeBee</h1>
        <p>
          AcadeBee 致力於連結研究需求方與專業接案者，提供更透明、可追蹤且可信任的學術任務媒合流程。
        </p>
      </section>

      <section className="about-section">
        <h2>我們在做什麼</h2>
        <div className="about-values-grid">
          {VALUES.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.title} className="about-value-card">
                <Icon size={20} className="about-value-icon" />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="about-section">
        <h2>創辦人與營運</h2>
        <p className="about-section-note">
          AcadeBee 由 William Lin 獨立開發與營運。以下為創辦人背景與營運理念；平台亦持續依回饋迭代。
        </p>
        <article className="about-team-profile">
          <div className="about-team-brand" aria-hidden="true">
            <img src={brandLogo} alt="" className="about-team-brand-mark" />
            <span className="about-team-brand-text">
              <span className="about-team-brand-acade">Acade</span>
              <span className="about-team-brand-bee">Bee</span>
            </span>
          </div>
          <div className="about-team-profile-media">
            {FOUNDER.photo ? (
              <img
                src={FOUNDER.photo}
                alt={`${FOUNDER.name} portrait`}
                className="about-team-portrait"
              />
            ) : (
              <div className="about-team-avatar-fallback about-team-portrait-fallback" aria-hidden="true">
                {FOUNDER.initials}
              </div>
            )}
          </div>
          <div className="about-team-profile-body">
            <p className="about-team-profile-label">獨立開發與營運</p>
            <h3>{FOUNDER.name}</h3>
            <p className="about-team-profile-role">{FOUNDER.role}</p>
            <p className="about-team-bio">{FOUNDER.bio}</p>
            <div className="about-team-profile-divider" aria-hidden="true" />
            <p className="about-team-story">{FOUNDER.story}</p>
          </div>
        </article>
      </section>

      <section className="about-section">
        <h2>聯絡我們</h2>
        <div className="about-contact-card">
          <Mail size={18} />
          <div>
            <p className="about-contact-label">合作、建議與問題回報</p>
            <p className="about-contact-value">acadebeeresearchhub@gmail.com</p>
          </div>
        </div>
      </section>

      <section className="about-disclaimer">
        <p>
          聲明：AcadeBee 的核心宗旨是提供研究需求方與專業接案者的媒合服務。平台僅提供資訊刊登、
          配對與溝通管道，不介入雙方履約內容、報酬支付、驗收標準或其他衍生爭議；相關責任由合作雙方自行承擔。
        </p>
      </section>
    </div>
  )
}
