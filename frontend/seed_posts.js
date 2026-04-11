// Seed Community Posts for all destinations
// This script initializes sample posts in localStorage

const communityPosts = [
  // BALI POSTS
  {
    author: 'Rina Kusuma',
    place_name: 'Bali',
    location: 'Bali, Indonesia',
    date: '2024-12-15',
    rating: 5,
    images: ['https://images.unsplash.com/photo-1537225228614-b4fad34a2c4d?w=600'],
    caption: 'Absolutely stunning sunrise at Tanah Lot! The golden light dancing on the waves is unforgettable.',
    blog: 'The temple sits majestically on a rock formation surrounded by the Indian Ocean. Highly recommend visiting during sunset for the most magical experience. Don\'t forget to bring sturdy shoes for the stairs!'
  },
  {
    author: 'Marco Santoro',
    place_name: 'Bali',
    location: 'Bali, Indonesia',
    date: '2024-12-10',
    rating: 5,
    images: ['https://images.unsplash.com/photo-1578898657097-b58f38da4bf8?w=600'],
    caption: 'The rice terraces of Tegallalang are even more beautiful in person than in photographs!',
    blog: 'Spent the morning walking through the emerald green rice fields. The cascading terraces create such an incredible landscape. Definitely visit early to avoid crowds and get the best photos.'
  },
  {
    author: 'Priya Kapoor',
    place_name: 'Bali',
    location: 'Ubud, Bali',
    date: '2024-12-05',
    rating: 4,
    images: ['https://images.unsplash.com/photo-1537225228614-b4fad34a2c4d?w=600'],
    caption: 'Amazing traditional massage at the local spa. Such a rejuvenating experience!',
    blog: 'Balinese massage is truly world-class. Found this hidden gem of a spa in Ubud. Affordable prices and authentic treatments. The therapists really know their craft!'
  },

  // TOKYO POSTS
  {
    author: 'Takeshi Yamamoto',
    place_name: 'Tokyo',
    location: 'Tokyo, Japan',
    date: '2024-12-14',
    rating: 5,
    images: ['https://images.unsplash.com/photo-1540959375944-7049f642e9a8?w=600'],
    caption: 'Tokyo at night is absolutely mesmerizing! The neon lights and endless energy are unforgettable.',
    blog: 'Shibuya Crossing and the entire Shinjuku district light up like a dream. The city never sleeps and the atmosphere is incredible. Must visit Senso-ji Temple during the day for a contrast!'
  },
  {
    author: 'Sophie Chen',
    place_name: 'Tokyo',
    location: 'Tokyo, Japan',
    date: '2024-12-08',
    rating: 5,
    images: ['https://images.unsplash.com/photo-1540959375944-7049f642e9a8?w=600'],
    caption: 'The food here is phenomenal! From street food to Michelin-starred restaurants, Tokyo has it all.',
    blog: 'Had authentic ramen in a tiny shop near Akihabara - the broth was simmered for hours and absolutely divine. Tokyo\'s food culture is world-renowned for a reason.'
  },

  // KYOTO POSTS
  {
    author: 'Yuki Tanaka',
    place_name: 'Kyoto',
    location: 'Kyoto, Japan',
    date: '2024-12-12',
    rating: 5,
    images: ['https://images.unsplash.com/photo-1516856866081-d282a0f896e2?w=600'],
    caption: 'Walking through thousands of torii gates at Fushimi Inari is like stepping into another world!',
    blog: 'The orange gateway tunnels create an almost spiritual experience. Plan to spend at least 2-3 hours here. Early morning visits are best to avoid crowds.'
  },
  {
    author: 'Anna Mueller',
    place_name: 'Kyoto',
    location: 'Kyoto, Japan',
    date: '2024-12-09',
    rating: 5,
    images: ['https://images.unsplash.com/photo-1516856866081-d282a0f896e2?w=600'],
    caption: 'Geisha district in Gion is enchanting. The traditional wooden houses and geishas in full makeup are magical!',
    blog: 'Strolled through Gion at dusk and saw genuine geishas heading to appointments. The preserved wooden buildings and lantern-lit streets take you back in time.'
  },

  // PARIS POSTS
  {
    author: 'Sophie Laurent',
    place_name: 'Paris',
    location: 'Paris, France',
    date: '2024-12-13',
    rating: 5,
    images: ['https://images.unsplash.com/photo-1511739001486-6bfe966ce51b?w=600'],
    caption: 'The Eiffel Tower at sunrise is absolutely breathtaking. Worth waking up early for!',
    blog: 'Arrived at Trocadero at 5:30 AM to watch the sunrise illuminate the tower. The golden hour photography opportunities are incredible. Paris is truly the City of Light!'
  },
  {
    author: 'James Wilson',
    place_name: 'Paris',
    location: 'Paris, France',
    date: '2024-12-07',
    rating: 5,
    images: ['https://images.unsplash.com/photo-1511739001486-6bfe966ce51b?w=600'],
    caption: 'Louvre Museum is overwhelming in the best way. The art collection is mind-blowing!',
    blog: 'Spent an entire day in the Louvre and still didn\'t see everything! The Mona Lisa lives up to the hype but don\'t miss the sculptures and other masterpieces.'
  },
  {
    author: 'Isabella Romano',
    place_name: 'Paris',
    location: 'Paris, France',
    date: '2024-12-01',
    rating: 5,
    images: ['https://images.unsplash.com/photo-1511739001486-6bfe966ce51b?w=600'],
    caption: 'Street-side café culture in Paris is exactly as romantic as you imagine!',
    blog: 'Spent hours people-watching from a sidewalk café in the Latin Quarter with croissants and wine. This is how Parisians live and it\'s perfection.'
  },

  // SWISS ALPS POSTS
  {
    author: 'Hans Mueller',
    place_name: 'Swiss Alps',
    location: 'Swiss Alps, Switzerland',
    date: '2024-12-11',
    rating: 5,
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'],
    caption: 'The mountain views are absolutely insane! Crystal clear peaks and Alpine villages scattered below.',
    blog: 'Took the Jungfrau railway to the top of Europe at 3,454 meters. The panoramic views of the Eiger, Matterhorn, and surrounding peaks are otherworldly. Highly recommend!'
  },
  {
    author: 'Elena Keller',
    place_name: 'Swiss Alps',
    location: 'Interlaken, Switzerland',
    date: '2024-12-04',
    rating: 5,
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'],
    caption: 'Paragliding over the Alps: bucket list completely checked off!',
    blog: 'The adrenaline rush was incredible, but the views were even more stunning. Flying over pristine mountain valleys and emerald lakes is an experience I\'ll never forget.'
  },

  // MALDIVES POSTS
  {
    author: 'Ahmed Hassan',
    place_name: 'Maldives',
    location: 'Maldives, Indian Ocean',
    date: '2024-12-10',
    rating: 5,
    images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600'],
    caption: 'Crystal clear turquoise waters and white sand beaches - paradise found!',
    blog: 'Booked an overwater bungalow and woke up to fish swimming beneath my room. The water is so transparent you can see the coral from your deck. Absolute dreamland!'
  },
  {
    author: 'Olivia Brown',
    place_name: 'Maldives',
    location: 'Male, Maldives',
    date: '2024-12-06',
    rating: 5,
    images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600'],
    caption: 'Snorkeling with tropical fish and rays right from the beach!',
    blog: 'The coral reefs here are vibrant and teeming with life. Saw rays, sharks (harmless!), and hundreds of colorful fish species. The water temperature is perfect year-round.'
  },

  // GOA POSTS
  {
    author: 'Arun Prabhu',
    place_name: 'Goa',
    location: 'Goa, India',
    date: '2024-12-09',
    rating: 5,
    images: ['https://images.unsplash.com/photo-1595733707802-6b2626ef1c91?w=600'],
    caption: 'Beach parties in Goa are legendary! Amazing music, sunset views, and incredible energy!',
    blog: 'Hit up the beach shacks and clubs during sunset time. The vibe is relaxed during the day but comes alive at night. Try the fresh seafood at the beachside restaurants!'
  },
  {
    author: 'Priya Nair',
    place_name: 'Goa',
    location: 'Anjuna, Goa',
    date: '2024-12-02',
    rating: 4,
    images: ['https://images.unsplash.com/photo-1595733707802-6b2626ef1c91?w=600'],
    caption: 'Wednesday flea market at Anjuna is a must-visit! Unique handicrafts and local treasures.',
    blog: 'Found amazing souvenirs and local artwork at bargain prices. The market has a great bohemian vibe with live music and street food. Perfect place to spend a full afternoon.'
  },

  // MANALI POSTS
  {
    author: 'Vikram Singh',
    place_name: 'Manali',
    location: 'Manali, India',
    date: '2024-12-08',
    rating: 5,
    images: ['https://images.unsplash.com/photo-1606665529032-45cf3d8e2e8d?w=600'],
    caption: 'Adventure paradise! Paragliding over the Himalayas was absolutely thrilling!',
    blog: 'Solang Valley is the perfect spot for adventure activities. Whether it\'s paragliding, zip-lining, or horseback riding, Manali has something for every adrenaline junkie.'
  },
  {
    author: 'Deepika Sharma',
    place_name: 'Manali',
    location: 'Manali, India',
    date: '2024-11-30',
    rating: 5,
    images: ['https://images.unsplash.com/photo-1606665529032-45cf3d8e2e8d?w=600'],
    caption: 'Trekking to Beas Kund was an incredible experience with stunning Alpine meadows!',
    blog: 'The 10km trek takes you through pine forests and meadows to a beautiful glacier lake. The cool mountain air and peaceful surroundings make it totally worth the effort. Best in September-October.'
  },

  // VARANASI POSTS
  {
    author: 'Rajesh Kumar',
    place_name: 'Varanasi',
    location: 'Varanasi, India',
    date: '2024-12-07',
    rating: 5,
    images: ['https://images.unsplash.com/photo-1609867528233-b551faad0c89?w=600'],
    caption: 'The spiritual energy of Varanasi during Aarti ceremony is simply divine',
    blog: 'Took a boat ride on the Ganges during evening Aarti - the candlelight, prayers, and sacred atmosphere was deeply moving. Varanasi is truly a spiritual hub of India.'
  },
  {
    author: 'Anjali Verma',
    place_name: 'Varanasi',
    location: 'Varanasi, India',
    date: '2024-11-28',
    rating: 5,
    images: ['https://images.unsplash.com/photo-1609867528233-b551faad0c89?w=600'],
    caption: 'The ghats of Varanasi are bustling with life, history, and profound spirituality!',
    blog: 'Each ghat has its own story. While experiencing this place, understanding its spiritual significance and accepting its rawness is important. Wear comfortable shoes and respect the sacred sites.'
  },

  // QUEENSTOWN POSTS
  {
    author: 'Jack Holden',
    place_name: 'Queenstown',
    location: 'Queenstown, New Zealand',
    date: '2024-12-06',
    rating: 5,
    images: ['https://images.unsplash.com/photo-1599935015215-5ef74ef5be24?w=600'],
    caption: 'Bungy jumping off the Kawarau Bridge is an insane rush! Heart pounding and exhilarating!',
    blog: 'The adrenaline is unmatched. Standing on that bridge was nerve-wracking but the freefall is absolutely incredible. Queenstown is the adventure capital for a reason!'
  },
  {
    author: 'Sarah Wilson',
    place_name: 'Queenstown',
    location: 'Queenstown, New Zealand',
    date: '2024-12-03',
    rating: 5,
    images: ['https://images.unsplash.com/photo-1599935015215-5ef74ef5be24?w=600'],
    caption: 'Jet boating on Lake Wakatipu with the Southern Alps backdrop - pure magic!',
    blog: 'The scenic beauty combined with the thrill of wild jet boat maneuvers makes this unforgettable. Bring a waterproof jacket because you will get splashed! Absolutely worth it.'
  }
];

// Initialize posts in localStorage
function initializePostsInLocalStorage() {
  const existingPosts = localStorage.getItem('community_posts');
  
  if (!existingPosts) {
    localStorage.setItem('community_posts', JSON.stringify(communityPosts));
    console.log('✅ Community posts initialized! Added', communityPosts.length, 'posts.');
  } else {
    console.log('✅ Community posts already exist in localStorage.');
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initializePostsInLocalStorage, communityPosts };
}
