import { useEffect, useRef, useState } from 'react';

const ECHARTS_CDN = 'https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js';
const CHINA_GEOJSON_URL =
  'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json';

function loadEcharts() {
  if (window.echarts) {
    return Promise.resolve(window.echarts);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = ECHARTS_CDN;
    script.async = true;
    script.onload = () => resolve(window.echarts);
    script.onerror = () => reject(new Error('ECharts 加载失败'));
    document.head.appendChild(script);
  });
}

function ChinaMap() {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function initChart() {
      try {
        const echarts = await loadEcharts();
        const geoJson = await fetch(CHINA_GEOJSON_URL).then((res) => {
          if (!res.ok) {
            throw new Error('中国 GeoJSON 数据加载失败');
          }
          return res.json();
        });

        if (!mounted || !chartRef.current) return;

        echarts.registerMap('china2d', geoJson);

        const chart = echarts.init(chartRef.current);
        instanceRef.current = chart;

        chart.setOption({
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'item',
            formatter: '{b}',
          },
          geo: {
            map: 'china2d',
            roam: true,
            zoom: 1.08,
            label: {
              show: false,
            },
            itemStyle: {
              areaColor: '#e2e8f0',
              borderColor: '#64748b',
              borderWidth: 1,
            },
            emphasis: {
              itemStyle: {
                areaColor: '#cbd5e1',
              },
            },
          },
          series: [],
        });

        const resizeHandler = () => chart.resize();
        window.addEventListener('resize', resizeHandler);
        chartRef.current.__resizeHandler = resizeHandler;
      } catch (err) {
        if (mounted) {
          setError(err.message || '地图初始化失败');
        }
      }
    }

    initChart();

    return () => {
      mounted = false;
      if (chartRef.current?.__resizeHandler) {
        window.removeEventListener('resize', chartRef.current.__resizeHandler);
      }
      instanceRef.current?.dispose();
    };
  }, []);

  if (error) {
    return <div className="map-error">{error}</div>;
  }

  return <div ref={chartRef} className="china-map" aria-label="中国地图" />;
}

export default ChinaMap;
