import * as d3 from 'd3';

export default function () {
	let scale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, 220]);
	let tickSize = 50;
	let numTicks = 5;
	let align = 'bottom';
	let xAxisHighlight = 0;
	let xLabel;

	function axis(parent) {
		const xAxis = getAxis(align)
			.tickSize(tickSize)
			.ticks(numTicks)
			.scale(scale);

		xLabel = parent.append('g')
			.attr('class', 'axis xAxis')
			.call(xAxis);

		const origin = xLabel.selectAll('.tick')
			.filter(function (d) {
				return d === 0 || d === xAxisHighlight;
			})
			.classed('baseline', true);
	}

	axis.align = (d) => {
		if (!d) return align;
		align = d;
		return axis;
	};
	axis.scale = (d) => {
		if (!d) return scale;
		scale = d;
		return axis;
	};
	axis.domain = (d) => {
		scale.domain(d);
		return axis;
	};
	axis.range = (d) => {
		scale.range(d);
		return axis;
	};
	axis.tickSize = (d) => {
		if (d === undefined) return tickSize;
		tickSize = d;
		return axis;
	};
	axis.xLabel = (d) => {
		if (d === undefined) return xLabel;
		xLabel = d;
		return axis;
	};
	axis.numTicks = (d) => {
		if (d === undefined) return numTicks;
		numTicks = d;
		return axis;
	};
	axis.xAxisHighlight = (d) => {
		xAxisHighlight = d;
		return axis;
	};

	function getAxis(alignment) {
		return{
            'top': d3.axisTop(),
            'bottom':d3.axisBottom()
        } [alignment];
	}

	return axis;
}
