import { PhotoTemplate } from '../types';

export const PHOTO_TEMPLATES: PhotoTemplate[] = [
  {
    id: 'polaroid',
    name: 'Polaroid Classic',
    slots: 1,
    layout: 'polaroid',
    dimensions: {
      width: 320,
      height: 400,
      cols: 1,
      rows: 1,
    },
    outputWidth: 400,
    outputHeight: 500,
    photoSlots: [
      {
        x: 40,
        y: 40,
        width: 320,
        height: 320,
      },
    ],
  },
  {
    id: 'strip-2',
    name: 'Strip of 2',
    slots: 2,
    layout: 'strip',
    dimensions: {
      width: 280,
      height: 420,
      cols: 1,
      rows: 2,
    },
    outputWidth: 320,
    outputHeight: 480,
    photoSlots: [
      {
        x: 20,
        y: 20,
        width: 280,
        height: 200,
      },
      {
        x: 20,
        y: 240,
        width: 280,
        height: 200,
      },
    ],
  },
  {
    id: 'strip-3',
    name: 'Strip of 3',
    slots: 3,
    layout: 'strip',
    dimensions: {
      width: 280,
      height: 600,
      cols: 1,
      rows: 3,
    },
    outputWidth: 320,
    outputHeight: 680,
    photoSlots: [
      {
        x: 20,
        y: 20,
        width: 280,
        height: 200,
      },
      {
        x: 20,
        y: 240,
        width: 280,
        height: 200,
      },
      {
        x: 20,
        y: 460,
        width: 280,
        height: 200,
      },
    ],
  },
  {
    id: 'strip-4',
    name: 'Strip of 4',
    slots: 4,
    layout: 'strip',
    dimensions: {
      width: 280,
      height: 780,
      cols: 1,
      rows: 4,
    },
    outputWidth: 320,
    outputHeight: 880,
    photoSlots: [
      {
        x: 20,
        y: 20,
        width: 280,
        height: 200,
      },
      {
        x: 20,
        y: 240,
        width: 280,
        height: 200,
      },
      {
        x: 20,
        y: 460,
        width: 280,
        height: 200,
      },
      {
        x: 20,
        y: 680,
        width: 280,
        height: 200,
      },
    ],
  },
];