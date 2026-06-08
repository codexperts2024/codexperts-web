// Social media links config — add a new school object to expand
export const socialLinks = {
  linkedin: {
    url: 'https://linkedin.com/company/codexperts2024',
  },
  github: {
    url: 'https://github.com/codexperts2024',
  },
  email: {
    url: 'mailto:codexperts2024@gmail.com',
  },
  // Official club signup portals per school — set url to null until available
  clubSignup: [
    { school: 'Seneca College', url: 'https://clubs.ssfinc.ca/CXS/club_signup' },
    { school: 'York University', url: null },
  ],
  // Public — hover dropdown per school
  instagram: [
    { school: 'Seneca', url: 'https://instagram.com/codexperts_seneca' },
    { school: 'York', url: 'https://www.instagram.com/codexperts_yorku/' },
    // { school: 'TMU', url: 'https://instagram.com/codexperts_tmu' },
  ],
  // Member only — hover dropdown per school
  discord: [
    { school: 'Seneca', url: 'https://discord.gg/SxXDZagWuH' },
    { school: 'York', url: 'https://discord.gg/york-placeholder' },
    // { school: 'TMU', url: 'https://discord.gg/tmu-placeholder' },
  ],
}
