'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);
  // One easing vocabulary for the whole site.
  CustomEase.create('zr.out', '0.16, 1, 0.3, 1');
  CustomEase.create('zr.inOut', '0.76, 0, 0.24, 1');
  gsap.defaults({ ease: 'zr.out', duration: 1 });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
