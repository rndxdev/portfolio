// Résumé content. Skills/summary are populated; Experience and Education are left
// empty on purpose — fill them in with your real history (template shown below).
// Projects and certifications are pulled live from their own data files by the page.
export const resume = {
  name: 'Ryan Dickinson',
  title: 'Full-Stack Developer',
  location: 'Michigan, USA',
  email: 'hello@rndx.dev',
  website: 'https://rndx.dev',
  github: 'https://github.com/rndxdev',

  summary:
    'Full-stack developer focused on building useful, well-crafted, open-source software. ' +
    'I got into programming to solve real problems and enjoy shipping tools that strengthen ' +
    'communities — from a C++ Unix shell to a community-driven ice-safety platform.',

  skills: [
    { group: 'Backend', items: ['PHP', 'Laravel', 'Node.js', 'Express', 'REST APIs', 'GraphQL'] },
    { group: 'Frontend', items: ['Vue 3', 'JavaScript (ES2023)', 'Tailwind CSS', 'HTML5', 'CSS3'] },
    { group: 'Databases', items: ['PostgreSQL', 'MySQL', 'MariaDB', 'SQLite'] },
    { group: 'Systems & Tools', items: ['C / C++', 'Python', 'Linux', 'Git'] },
  ],

  // TODO — add your real roles. Shape:
  // { role: 'Software Developer', company: 'Acme Co.', period: '2023 — Present',
  //   location: 'Remote', bullets: ['Shipped X', 'Led Y'] },
  experience: [],

  // TODO — add your education / bootcamps. Shape:
  // { credential: 'B.S. Computer Science', school: 'University of X', period: '2019 — 2023' },
  education: [],
}
