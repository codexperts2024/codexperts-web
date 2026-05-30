import event1 from '@/app/events/images/event1.png';
import yearEnd from '@/app/events/images/yearEndCoverPic.png';
import competitionCover from '@/app/events/images/competitionCover.png';

import codingPic from '@/app/events/images/codingCover.png';

import competition1 from '@/app/events/images/competition1.png';
import competition2 from '@/app/events/images/competition2.png';
import competition3 from '@/app/events/images/competition3.png';
import competition4 from '@/app/events/images/competition4.png';
import competition5 from '@/app/events/images/competition5.png';
import competition6 from '@/app/events/images/competition6.png';
import competition7 from '@/app/events/images/competition7.png';
import competition8 from '@/app/events/images/competition8.png';
import competition9 from '@/app/events/images/competition9.png';

import networking1 from '@/app/events/images/networking1.png';
import networking2 from '@/app/events/images/networking2.png';
import networking3 from '@/app/events/images/networking3.png';
import networking4 from '@/app/events/images/networking4.png';
import networking5 from '@/app/events/images/networking5.png';
import networking6 from '@/app/events/images/networking6.png';
import networking7 from '@/app/events/images/networking7.png';
import networking8 from '@/app/events/images/networking8.png';
import networking9 from '@/app/events/images/networking9.png';


export const clubEvents = [
    {id: 1, category: 'Featured Competition', 
        title: 'LeetCode Session 2026', 
        date: '2026-06-01',
        endDate: null, 
        registration:'', 
        description: 'Join CodeXperts @ Seneca for its first ever LeetCode session! Coders of all levels are welcomed to solve various algorithmic problems so feel free to drop by.',
        infoDescription: 'Join us for our first ever LeetCode session! Whether you are a beginner or an experienced coder, this is your chance to tackle challenges, share insights, and grow as a developer.\n\nDo not miss the opportunity to connect with like-minded peers and sharpen your problem-solving skills. All experience levels welcome - see you there!',
        cta: 'Register Now', 
        location:'Techinal Lab', 
        school:'Seneca College', 
        image: codingPic,
        gallery: null,
        tracks: [
        { name: 'Algorithmic Mastery', sub: 'Optimization & Logic' },
        { name: 'Tool Innovation', sub: 'Utility & Design' }
        ]},
    {id: 2, category: 'Coding Competition', 
        title: 'CodeXperts Coding Competition', 
        date: '2026-03-21', 
        endDate: null,
        registration:'', 
        description: 'Programmers of all levels joined to solve algorithms for grand prizes.', 
        infoDescription:'This intensive laboratory session was a deep-dive into the architectural nuances of systems programming using Rust. Participants explored the intricacies of memory safety without a garbage collector, focusing on ownership, borrowing, and lifetimes.\n\nThe workshop moved beyond basic syntax, challenging students to implement low-level optimizations and safe concurrency patterns. It was designed for those looking to bridge the gap between high-level logic and metal-level performance, providing a rigorous technical framework for building reliable software systems.',
        cta: 'Learn More', 
        image: competitionCover, 
        gallery: [competition1, competition2, competition3, competition4, competition5, competition6, competition7, competition8, competition9],
        location:'Room 402', school:'Seneca College',
        tracks: null},
    {id: 3, category: 'Social', 
        title: 'CodeXperts Chicken & Networking Event ', 
        date: '2026-03-09', 
        endDate: null,
        registration:'', 
        description: 'Networking events filled with delicious fried chicken, Krispy Kreme donuts, and great conversations.', 
        infoDescription: 'We had an amazing time at our codeXperts Chicken Night & Networking event on March 9, 2026. There is nothing better than fueling our coding brains with delicious fried chicken, Krispy Kreme donuts, and great conversations. \n\nIt was inspiring to see so many members connecting, sharing ideas, and building our community together. A huge thank you to everyone who joined us and made this night so special!', 
        cta: 'Gallery', 
        image: event1, 
        gallery: [networking1, networking2, networking3, networking4, networking5, networking6, networking7, networking8, networking9],
        location:'Room S1077', 
        school:'Seneca & York',
        tracks: null},
        
    {id: 4, category: 'Social', 
        title: 'CodeXperts Year-End Event ', 
        date: '2025-12-30', 
        endDate: null,
        registration:'', 
        description: 'Celebrating the end of the year with an amazing lunch of pizza, wings, and salad.', 
        infoDescription: '', cta: 'Gallery', 
        image: yearEnd, 
        gallery: null,
        location:"Professor's House", 
        school:''},
    
    
];
