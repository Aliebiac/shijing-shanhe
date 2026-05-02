export type PoemCategory = '风' | '雅' | '颂';

export interface PoemPoint {
  id: string;
  title: string;
  category: PoemCategory;
  latitude: number;
  longitude: number;
  locationName: string;
  note: string;
}

export const poems: PoemPoint[] = [
  {
    id: 'guanju',
    title: '关雎',
    category: '风',
    latitude: 34.76,
    longitude: 113.65,
    locationName: '河南郑州附近',
    note: 'V2 示例点位',
  },
  {
    id: 'jianjia',
    title: '蒹葭',
    category: '风',
    latitude: 34.34,
    longitude: 108.94,
    locationName: '陕西西安附近',
    note: 'V2 示例点位',
  },
  {
    id: 'caiwei',
    title: '采薇',
    category: '雅',
    latitude: 34.26,
    longitude: 108.95,
    locationName: '陕西关中附近',
    note: 'V2 示例点位',
  },
  {
    id: 'mian',
    title: '绵',
    category: '雅',
    latitude: 34.5,
    longitude: 107.4,
    locationName: '陕西岐山附近',
    note: 'V2 示例点位',
  },
  {
    id: 'qingmiao',
    title: '清庙',
    category: '颂',
    latitude: 34.22,
    longitude: 108.88,
    locationName: '陕西丰镐附近',
    note: 'V2 示例点位',
  },
];
