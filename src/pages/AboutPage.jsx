import { Mail, ShieldCheck, Wrench, Users } from 'lucide-react'
import brandLogo from '../assets/square img0.png'
import williamPhoto from '../assets/square img3.png'
import './AboutPage.css'

const TEAM_MEMBERS = [
  {
    name: 'Jeng Heng (William) Lin',
    role: 'CEO',
    bio: 'Biomedical Engineer and Biomechanist',
    story: '以研究背景與產品思維，持續降低學術合作的溝通成本。',
    photo: williamPhoto,
    initials: 'WL',
  },
]

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
  const leadMember = TEAM_MEMBERS[0]

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
        <h2>開發團隊</h2>
        <p className="about-section-note">
          目前由核心成員主導產品與技術方向，持續優化平台體驗與合作品質。
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
            {leadMember.photo ? (
              <img
                src={leadMember.photo}
                alt={`${leadMember.name} portrait`}
                className="about-team-portrait"
              />
            ) : (
              <div className="about-team-avatar-fallback about-team-portrait-fallback" aria-hidden="true">
                {leadMember.initials}
              </div>
            )}
          </div>
          <div className="about-team-profile-body">
            <p className="about-team-profile-label">Core Leadership</p>
            <h3>{leadMember.name}</h3>
            <p className="about-team-profile-role">{leadMember.role}</p>
            <p className="about-team-bio">{leadMember.bio}</p>
            <div className="about-team-profile-divider" aria-hidden="true" />
            <p className="about-team-story">{leadMember.story}</p>
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
