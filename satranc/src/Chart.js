import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as echarts from 'echarts';

function Chart({ options }) {
    const chartRef = useRef();

    useEffect(() => {
        const chart = echarts.init(chartRef);
        chart.setOption(options);
    }, [options]);

    return <div style={{width: 400, height: 400}} id='chart' ref={chartRef}></div>
}

Chart.propTypes = {
    options: PropTypes.any,
}

export default Chart;