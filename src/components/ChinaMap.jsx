import { useEffect, useMemo, useRef, useState } from 'react';

const ECHARTS_CDN = 'https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js';
const CHINA_GEOJSON_URL = '/maps/china.geojson';

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

function ChinaMap({ poems, activeCategory }) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);
  const [error, setError] = useState('');
  const [selectedPoem, setSelectedPoem] = useState(null);
  const [chartReady, setChartReady] = useState(false);

  const mapData = useMemo(
    () =>
      poems.map((poem) => ({
        ...poem,
        name: poem.title,
        value: [poem.longitude, poem.latitude],
      })),
    [poems]
  );

  useEffect(() => {
    let mounted = true;

    async function initChart() {
      try {
        const echarts = await loadEcharts();
        const response = await fetch(CHINA_GEOJSON_URL);

        if (!response.ok) {
          throw new Error(`中国地图数据加载失败（HTTP ${response.status}）。请确认 /public/maps/china.geojson 文件存在且可访问。`);
        }

        const geoJson = await response.json();
        const hasFeatures =
          geoJson?.type === 'FeatureCollection' &&
          Array.isArray(geoJson.features) &&
          geoJson.features.length > 0;

        if (!hasFeatures) {
          throw new Error('中国地图数据格式无效：期望 FeatureCollection 且 features 非空。');
        }

        if (!mounted || !chartRef.current) return;

        echarts.registerMap('china2d', geoJson);

        const chart = echarts.init(chartRef.current);
        instanceRef.current = chart;

        chart.setOption({
          backgroundColor: 'transparent',
          tooltip: { show: false },
          geo: {
            map: 'china2d',
            roam: true,
            zoom: 1.08,
            label: { show: false },
            itemStyle: {
              areaColor: '#e2e8f0',
              borderColor: '#64748b',
              borderWidth: 1,
            },
            emphasis: {
              label: { show: false },
              itemStyle: { areaColor: '#cbd5e1' },
            },
          },
        });
        setChartReady(true);

        const resizeHandler = () => chart.resize();
        window.addEventListener('resize', resizeHandler);
        chartRef.current.__resizeHandler = resizeHandler;

        chart.on('click', (params) => {
          if (params?.seriesType === 'scatter' && params.data) {
            setSelectedPoem(params.data);
          }
        });
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : '地图初始化失败，请稍后重试。');
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

  useEffect(() => {
    if (!instanceRef.current || !chartReady) return;

    instanceRef.current.setOption({
      series: [
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          data: mapData,
          symbol: 'circle',
          symbolSize: 11,
          itemStyle: {
            color: '#60a5fa',
            borderColor: '#1d4ed8',
            borderWidth: 1,
            opacity: activeCategory === 'all' ? 0.25 : 0.2,
          },
          emphasis: { scale: 1.2, itemStyle: { opacity: 1 } },
          tooltip: { show: false },
        },
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          data: activeCategory === 'all' ? [] : mapData.filter((item) => item.category === activeCategory),
          symbol: 'circle',
          symbolSize: 14,
          itemStyle: {
            color: '#ef4444',
            borderColor: '#991b1b',
            borderWidth: 1.5,
            opacity: 1,
          },
          emphasis: { scale: 1.2, itemStyle: { opacity: 1 } },
          tooltip: { show: false },
          zlevel: 2,
        },
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          data: mapData,
          symbolSize: 1,
          itemStyle: { opacity: 0 },
          tooltip: { show: false },
          silent: true,
          label: {
            show: true,
            formatter: (params) => {
              const title = params.data?.title || params.name || '';
              if (activeCategory === 'all' || params.data?.category === activeCategory) {
                return `{active|${title}}`;
              }
              return `{dim|${title}}`;
            },
            position: 'right',
            distance: 6,
            color: '#000000',
            fontSize: 16,
            padding: [4, 8],
            backgroundColor: '#ffffff',
            borderColor: '#dc2626',
            borderWidth: 1,
            borderRadius: 2,
            rich: {
              active: {
                color: '#000000',
                fontSize: 16,
                fontWeight: 600,
                opacity: 1,
              },
              dim: {
                color: '#000000',
                fontSize: 16,
                opacity: 0.45,
              },
            },
          },
          labelLayout: { hideOverlap: false },
          encode: { tooltip: -1 },
          z: 100,
          zlevel: 10,
        },
      ],
    }, { replaceMerge: ['series'] });
  }, [mapData, activeCategory, chartReady]);

  if (error) {
    return <div className="map-error">{error}</div>;
  }

  return (
    <div className="map-wrapper">
      <div ref={chartRef} className="china-map" aria-label="中国地图" />
      {selectedPoem && (
        <aside className="poem-info-box">
          <button type="button" className="info-close" onClick={() => setSelectedPoem(null)}>
            ×
          </button>
          <h3>{selectedPoem.title}</h3>
          <p>分类：{selectedPoem.category}</p>
          <p>地点：{selectedPoem.locationName}</p>
          <p>备注：{selectedPoem.note}</p>
          <p>诗文内容将在后续版本加入。</p>
        </aside>
      )}
    </div>
  );
}

export default ChinaMap;
