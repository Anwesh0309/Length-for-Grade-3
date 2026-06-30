import React from 'react';

export default function StoryIllustration({ slide = 0 }) {
  const imageUrls = [
    '/assets/images/story_slide_1.png',
    '/assets/images/story_slide_2.png',
    '/assets/images/story_slide_3.png',
    '/assets/images/story_slide_4.png',
  ];

  return (
    <div className="story-img w-full" style={{ aspectRatio: '16/9', overflow: 'hidden', borderRadius: '12px' }}>
      <img
        src={imageUrls[slide % imageUrls.length]}
        alt={`Story slide ${slide + 1}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  );
}
