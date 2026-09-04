export interface Discipline {
  id: string;
  label: string;
  /** Background color for the discipline universe */
  color: string;
  /** Text color (black or white) depending on bg contrast */
  textColor: string;
  /** Recto card image (with colored background) */
  cardImage: string;
  /** Solid color background image */
  colorImage: string;
  /** Logo without background (for overlays) */
  logoImage: string;
  /** Source folders in public/assets that belong to this discipline */
  folders: string[];
}

export const DISCIPLINES: Discipline[] = [
  {
    id: 'branding',
    label: 'BRANDING',
    color: '#F2F083',
    textColor: '#111111',
    cardImage: '/assets/LOGO ALEXIA NAYA-01.png',
    colorImage: '/assets/LOGO ALEXIA NAYA-07.png',
    logoImage: '/assets/LOGO ALEXIA NAYA-13.png',
    folders: ['Logo', 'Affiche', 'Pub', 'Packaging'],
  },
  {
    id: 'da-photo',
    label: 'DA PHOTO',
    color: '#E34040',
    textColor: '#FFFFFF',
    cardImage: '/assets/LOGO ALEXIA NAYA-02.png',
    colorImage: '/assets/LOGO ALEXIA NAYA-08.png',
    logoImage: '/assets/LOGO ALEXIA NAYA-14.png',
    folders: ['Photographies'],
  },
  {
    id: 'illustration',
    label: 'ILLUSTRATION',
    color: '#A8C850',
    textColor: '#111111',
    cardImage: '/assets/LOGO ALEXIA NAYA-03.png',
    colorImage: '/assets/LOGO ALEXIA NAYA-09.png',
    logoImage: '/assets/LOGO ALEXIA NAYA-15.png',
    folders: ['Illustrations'],
  },
  {
    id: 'edition',
    label: 'ÉDITION',
    color: '#A5D4D8',
    textColor: '#111111',
    cardImage: '/assets/LOGO ALEXIA NAYA-04.png',
    colorImage: '/assets/LOGO ALEXIA NAYA-10.png',
    logoImage: '/assets/LOGO ALEXIA NAYA-16.png',
    folders: [],
  },
  {
    id: 'video',
    label: 'VIDÉO',
    color: '#CCA8D5',
    textColor: '#111111',
    cardImage: '/assets/LOGO ALEXIA NAYA-05.png',
    colorImage: '/assets/LOGO ALEXIA NAYA-11.png',
    logoImage: '/assets/LOGO ALEXIA NAYA-17.png',
    folders: ['Video'],
  },
  {
    id: 'pochette',
    label: 'POCHETTE',
    color: '#FFFFFF',
    textColor: '#111111',
    cardImage: '/assets/LOGO ALEXIA NAYA-06.png',
    colorImage: '/assets/LOGO ALEXIA NAYA-12.png',
    logoImage: '/assets/LOGO ALEXIA NAYA-18.png',
    folders: ['Pochettes'],
  },
];

export function getDisciplineById(id: string): Discipline | undefined {
  return DISCIPLINES.find((d) => d.id === id);
}
