import event1 from '@/app/events/images/event1.png';
import yearEnd1 from '@/app/events/images/yearEnd1.png';
import codingComp1 from '@/app/events/images/codingComp1.png';

export const clubEvents = [
    {id: 1, category: 'Coding Competition', title: 'CodeXperts Coding Competition', date: '2026-03-21', description: 'Programmers of all levels joined to solve algorithms for grand prizes.', eDescription:
        'This intensive laboratory session was a deep-dive into the architectural nuances of systems programming using Rust. Participants explored the intricacies of memory safety without a garbage collector, focusing on ownership, borrowing, and lifetimes.\n\nThe workshop moved beyond basic syntax, challenging students to implement low-level optimizations and safe concurrency patterns. It was designed for those looking to bridge the gap between high-level logic and metal-level performance, providing a rigorous technical framework for building reliable software systems.',
         cta: 'Learn More', 
         image: codingComp1, 
         location:'Room 402', school:'Seneca College'},
    {id: 2, category: 'Social', title: 'CodeXperts Chicken & Networking Event ', date: '2026-03-09', description: 'Networking events filled with delicious fried chicken, Krispy Kreme donuts, and great conversations.', eDescription: '', cta: 'Gallery', 
        image: event1, location:'Room S1077', school:'Seneca & York'},
    {id: 3, category: 'Social', title: 'CodeXperts Year-End Event ', date: '2025-12-30', description: 'Celebrating the end of the year with an amazing lunch of pizza, wings, and salad.', eDescription: '', cta: 'Gallery', 
        image: yearEnd1, 
        location:"Professor's House", school:''}
];

export const upcomingEvents = [
    {id: 1, category: 'Featured Competition', title: 'Spring Coding Competition 2026', date: '2026-03-14',
    endDate: '2026-03-16', registration:'', description: 'Join 200+ developers for a 48-hour sprint. Solve algorithmic puzzles, build innovative tools, and win exclusive prizes from the Digital Atelier.',
         infoDescription: 'Dive into a 48-hour intensive sprint designed to push your technical boundaries. The Spring Coding Competition 2026 brings together the brightest minds to solve complex algorithmic puzzles and build innovative software tools from the ground up.\n\nWhether you are a backend specialist or a creative frontend developer, this is your laboratory to experiment, iterate, and compete for exclusive prizes and industry recognition.',
         cta: 'Register Now', location:'Techinal Lab', school:'Seneca College', tracks: [
      { name: 'Algorithmic Mastery', sub: 'Optimization & Logic' },
      { name: 'Tool Innovation', sub: 'Utility & Design' }
    ]},

];