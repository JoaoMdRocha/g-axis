# gAxis [![codecov](https://codecov.io/gh/ft-interactive/g-axis/branch/master/graph/badge.svg)](https://codecov.io/gh/ft-interactive/g-axis)

Pre styled centralised repository of axis for use with the FT's g-chartframe architecture as part of the Visual Vocabulary. Creates ordinal, linear or date axis that can be appended to the <b>.plot</b> obejct in the g-chartframe hopefully eliminating the need to code another standard axis or set up the tick format for a date sequence.

This is a guide aimed mostly a users building chart templates or interactive graphics and not a user guide for the Visual Vocabulary.

The axis module also appends the correct script tags for use with the FT Pre-Flight script in Adobe Illustrator.

Should work with other builds where the axis is called into a pre drfined g or svg elements.

### Prerequisites
The FT axis styles---add the folowwing link in your index file header

``` html
<link rel="stylesheet" href="//rawgit.com/ft-interactive/visual-vocabulary-templates/master/styles.css">
```
The [d3 library](https://d3js.org/) is already installed in the build

### Manual installation

If you are working within the g-chartfram architecture add the following code to the top of your index.js


```
import * as gAxis from 'g-axis
```

### NPM install
Not yet deployed

## <a id='important'>Important information</a>

All examples shown are from the web frame style.

<b>Note: Always create and call your y-axis before executing any code to draw your chart.</b> Pass the axis to the chart code, not the other way round. This means that any inbuilt functionality generated by the axis such as <b>.invert()</b> or <b>.logScale()</b> will be passed automatically to the chart and avoid you having to create extra code.

Create and call a y-axis first, as it returms <b>.labelWidth()</b>, which holds a value equal to the width of the widest tick label on the y-axis. This value is used to re-define the left or right margin of the chartFrame before defining the <b>.range()</b> of the x axis e.g.

yOrdinal axis where the width of 'Switzerland' is returned in <b>.labelWidth()</b>
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLabel-large.png)
The tick 'Dem Republic of Congo' is much longer so will leave less space for the x axis <b>.range()</b>
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLabel-small.png)

For more detail on <b>.labelWidth()</b> and its use in positioning see:

* [yLinear Postioning](#ylinpos)

The following axis types are currently defined in this repo (click to jump to section)

* [yLinear](#ylinear)
* [yOrdinal](#yordinal)
* [xDate](#xdate)
* xLinear()
* xOrdinal()

# <a id='ylinstarted'>yLinear</a>

<b>Note</b> All examples shown are from the web frame style.
yLinear() creates a d3 linear axis with a couple of additional feature to help manage styling and day-to-day production of charts that use a linear y-axis.

Create and call a y-axis first, as it returms <b>.labelWidth()</b> that holds a value equal to the width of the widest tick label on the y-axis. This value is used to re-define the left or right margin of the chartframe before crteating the x-axis. For more information see [yLinear Postioning](#ylinpos)

* [Getting started](#ylinstarted)
* [yLinear Postioning](#ylinpos)
* [Full yLinear API reference](#ylinearapi)
* See [.tickSize()](#ylineartickSize) for positioning axis with short or long ticks


## <a id='ylinstarted'>Getting started</a>
Add the following code to your index.js to append a default y-axis to the current frame object (grey here but not normally visible)

<b>Note</b> yLinear default alignment is right.

```
const yAxis = gAxis.yLinear()
const currentFrame = frame[frameName];

currentFrame.plot()
	.call(yAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-default.png)

Use the current frame dimensions to define your <b>.range()</b> and the <b>.ticksize()</b> and a <b>.domian()</b>. This will give you a basic working axis correctly positioned
```
const yAxis = gAxis.yLinear()
const currentFrame = frame[frameName];

 yAxis
    .domain([0,200])
    .range([currentFrame.dimension().height,0])
    .tickSize(currentFrame.dimension().width)

currentFrame.plot()
    .call(yAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-sized.png)

It is good practice to pass <b>.plotDim(), .rem() .divisor() </b>and <b>.frameName</b> to the axis when you first set it up as they are used in some of the in-built functionality, such as <b>.banding()</b> and <b>.label()</b> and attaching id tags used by the Pre-flight illustrator script. It would also be a good idea to pass <b>.invert()</b> and <b>.logScale()</b> at this point also.
```
const currentFrame = frame[frameName];
const yAxis = yLinear();
const tickSize = currentFrame.dimension().width;
const plotDim = [currentFrame.dimension().width, currentFrame.dimension().height];

yAxis
	.plotDim(plotDim)
	.tickSize(tickSize)
	.align(yAxisAlign)
	.domain([Math.min(yMin, valueExtent[0]), Math.max(yMax, valueExtent[1])])
	.range([currentFrame.dimension().height, 0])
	.frameName(frameName)
	.invert(yScaleInvert)
	.logScale(yLogScale)
	.divisor(divisor);

currentFrame.plot()
	.call(yAxis);
```

## <a id='ylinpos'>yLinear positioning</a>
Before you can position an axis you need to know the steps the g-axis component goes through to render left and right align axis when it is called. yLinear axis nearly always have a <b>.tickSize()</b> to be taken into account. To see what happen when you render a y-axis without a ticksize see the similar [yOrdinal postioning](#yordpos).

yLinear axis always take the left hand side of the currentFrame.plot() as their origin. Axis with a left alignment will be drawn from the origin to the left and similarly from the origin to the right for right alignment e.g.
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-alignRight.png)

Axis with a left alignment will be drawn from the origin to the left and so need to be translated to be positioned correctly (see code below).
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-alignLeft.png)

The rendered axis returns the width of the widest text label on the y- axis via <b>.labelWidth()</b>. this will vary depending on the text e.g. '100,000' will return a larger value than '10'
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-labelwidth.png)

<b>.labelWidth()</b> is used to amend the appropriate margin of the currentFrame so that text is positioned outside the plot object. The following code when added to you index.js file after the y-axis has been called will resize the margin depending on the <b>.align()</b> for axis with ticks of a standard size. For positioning axis where the ticks are longer or shorter then the width of the chartFrame see [tickSize()](#ylineartickSize).

```
// return the value in the variable newMargin and move axis if needed
if (yAxisAlign === 'right') {
	const newMargin = yAxis.labelWidth() + currentFrame.margin().right;
	// Use newMargin redefine the new margin and range of xAxis
	currentFrame.margin({ right: newMargin });
}
if (yAxisAlign === 'left') {
	const newMargin = yAxis.labelWidth() + currentFrame.margin().left;
	// Use newMargin redefine the new margin and range of xAxis
  	.margin({ left: newMargin });
	yAxis.yLabel().attr('transform', `translate(${(yAxis.tickSize() - yAxis.labelWidth())},0)`);
}
d3.select(currentFrame.plot().node().parentNode)
	.call(currentFrame);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-resized.png)

The currentFrame can then be used to correctly define the <b>.range()</b> values of an x-axis.

<b>Important note .labelWidth()</b> is also used to resize the <b>.tickSize()</b> when the <b>tickSize()</b> is greater than the width of the longest label, reducing the size of the tick by the <b>.labelWidth()</b>. This is so that the axis sits in the chartFrame correctly when the frame is re-sized for more information see [tickSize()](#ylineartickSize).

## <a id='ylinearapi'>yLinear API reference</a>

* [.align([String])](#ylinearalign)
* [.banding([Boolean])](#ylinearbanding)
* [.divisor([Number])](#ylineardivisor)
* [.domain([Array])](#ylineardomain)
* [.frameName([String])](#ylinearframeName)
* [.invert([Array])](#ylinearinvert)
* [.label([Object])](#ylinearlabel)
* [.labelWidth([Number])](#ylinearlabelWidth)
* [.logScale([Boolean])](#ylinearnLog)
* [.numTicks([Number])](#ylinearnumTicks)
* [.rem([Number])](#ylinearyRem)
* [.tickFormat([count[, specifier]]](#ylinearFormat)
* [.tickSize([Number]](#ylineartickSize)
* [.yAxishighlight([Array])](#ylinearyAxishighlight)

### <a id='ylinearalign'>myAxis.align([String]</a>
 "right" or "left". Determines the alignment of the tick text set as "right" by default.
```
yAxis
	.align('left');
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-left.png)
```
yAxis
	.align('right');
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-right.png)


### <a id='ylinearbanding'>myAxis.banding([Boolean]</a>
Toggles the axis banding on or off. Adds shaded bands between alternative major axis ticks, so increasing the number of ticks will increase the number of bands.

<b>Note</b> This function will not work correctly unless both <b>.plotDim()</b> and <b>.rem()</b> have also been passed to the axis.
```
const plotDim = [currentFrame.dimension().width, currentFrame.dimension().height];

yAxis
	.plotDim(plotDim)
	.rem(currentFrame.rem())
	.banding(true)
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-banding.png)
```
const plotDim = [currentFrame.dimension().width, currentFrame.dimension().height];

yAxis
	.plotDim(plotDim)
	.rem(currentFrame.rem())
	.banding(true)
	.numTicks(10)
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-banding2.png)

### <a id='ylineardivisor'>myAxis.divisor([Number]</a>
Used to help format ticks values whane the data range contains large number e.g. GDP where the figures could be measured in millions or billions. The tick label figure is divided by the number passed to the divisor, by default this is set to 1 so appears to make no difference. On an axis where the figures are measured in millions 0 - 2,000,000 setting the divisor to 1,000,000 would cause the axis labels to appear as 0 - 2.0.

<b>Note </b> It is very important to make he appropriate addition to the subtitle of the chart when the divisor has a value other that 1 e.g. adding the text 'million'

Without using a divisor the chart would be labelled like this:
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-divisorBefore.png)

After:

```
yAxis
	.divisor(1000000)
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-divisorAfter.png)


### <a id='ylineardomain'>myAxis.domain([Array])</a>
Defines the axis domain in the same way as you would when creating a normal d3.scaleLinear() scale. If no <b>.domain()</b> is defined the default is [0,10000].

### <a id='ylinearframeName'>myAxis.frameName([String])</a>
Used to pass the id of the current plot object and add unique ids to the tick label for use with the illustrator Pre Flight script. frameName is passed into the object keys loop and is intergral.
```
yAxis
	.frameName(frameName)
```

### <a id='ylinearinvert'>myAxis.invert([Boolean])</a>
Inverts the scale so that the lowest figures are nearer the top and the highest figures are nearer the bottom. By creating the axis first and then passing it to the code drawing the chart will ensure that this function is passed to the chart.
```
yAxis
	.invert(true)
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-invert.png)

### <a id='ylinearlabel'>myAxis.label([Object])</a>
<b>Note .label()</b> requires that the axis has been passed both <b>.rem()</b> and <b>.plotDim()</b> to work correctly

Adds and positions an axis label. Labels can be positioned in nine locations by specifying the horizontal and vertical alignment, and rotated through 360 degrees. Text anchoir points can also be specified. For more information and examples on positioning see [Postioning yLinear labels](#ylinearlabelPos)

Adding the following code will set a default label
```
const plotDim = [currentFrame.dimension().width, currentFrame.dimension().height];
const label = {
	tag: 'default axis label'
}
yAxis
	.rem(currentFrame.rem())
	.plotDim(plotdim)
	.label(true)
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-labelDefault.png)

### <a id='ylinearlabelPos'>Postioning yLinear labels)</a>
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-labelPosition.png)

Positioning a label top left on a right hand axis.

<b>Note</b> that rotate is set to 360 degrees and not zero. This is because passing zero is read as false by javascript. Labels on a y-axis are set to 90 degrees by sefault, but passing zero to an axis will cause it to fail. The way round this is to rotate the text through a full 360 degrees. 
```
const plotDim = [currentFrame.dimension().width, currentFrame.dimension().height];
const label = {
    tag: 'Top left and rotated 360 degrees, anchor ‘end’',
    vert: 'top',
    hori:'right',
    anchor: 'end',
    rotate 360,
}
yAxis
    .rem(currentFrame.rem())
    .plotDim(plotdim)
    .label(true)
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-labelTopright.png)
Most commonly used right hand axis. <b>Note</b> if note specified, the vertical position and text anchor revert to their default setting.
```
const plotDim = [currentFrame.dimension().width, currentFrame.dimension().height];
const label = {
    tag: 'Middle right, right hand axis',
    hori:'right',
}
yAxis
    .rem(currentFrame.rem())
    .plotDim(plotdim)
    .label(true)
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-labelCenterright.png)

### <a id='ylinearlabelWidth'>myAxis.labelWidth([Number])</a>
Used to return the width of the text on the axis tick. Will vary depending on tick e.g. a label of '1,000,000' will be wider than a label of '10' and will return a higher value. See [yLinear Postioning](#ylinpos) and [important information](#important)

### <a id='ylinearnLog'>myAxis.logScale([Boolean])</a>
Logscales are a nonlinear scale used when there is a large range in the dataset, commonly used to project earthquake data or to minimise clustering when the data contains statistical outlayers e.g. Point 11 on the chart below. All the other data on the chart is grouped between 0 and 100, so when it is projected using a standard linear scale, it is difficult to disyinguish.
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-linearScale.png)

Using a log scale disperses some of the clustering and makes the data easier to read, but still shows the outlaying point 11.

<b>Note </b>That log scales cannot start from zero so the <b>yMin</b> value of your chart will probably have to be changed (set to 10 below). Its also worth checking for errors when you have extreeme values in your dataset.
```
yAxis
    .logscale(true)
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-logScale.png)


### <a id='ylinearnumTicks'>myAxis.numTicks([Number])</a>
As they name suggest defines how many ticks are on the axis. 0 to 200 with 3 tick would give a zero line, a 100 and 200 line.If not enough ticks have been specifiesd d3 will automatically increase the number.
```
yAxis
    .numTicks(3)
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-numticks.png)
```
yAxis
    .numTicks(5)
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-numticks5.png)

### <a id='ylinearrange'>myAxis.range([Array])</a>
Defines the axis  range in the same way as you would when creating a normal d3.scaleLinear(). If no <b>.range()</b> is defined the default is [120,0])

### <a id='ylinearyRem'>myAxis.rem([Number])</a>
Used to calculate the ticksize for short ticks and positioning labels. Should usually be the currentFrame.rem() which is the height of the text in the subtitle. This keeps things tick sizes and dot radii proportional to the frame.

### <a id='ylinearFormat'>myAxis.tickFormat([count[, specifier]])</a>
Overrides the in-built axis formatting to allow you to format labels in the way you would on any d3 linear axis e.g. two decimal places.
```
yAxis
.tickFormat(d3.format(".2f"))
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-labelFormat.png)

### <a id='ylineartickSize'>myAxis.tickSize([Number])</a>
<b>Note</b> The default is 300px. Unless the value specified for the <b>.tickSize()</b> is less than the width of the longest label, the size of the tick drawn on the chart will be the the value passed to <b>tickSize()</b> minus the width of the widest label on the axis. For more information see [yLinear Postioning](#ylinpos). This is so that ticks can be positioned in the chartFrame correctly e.g.

```
const currentFrame = frame[frameName];
const yAxis = yLinear();// sets up yAxis
const tickSize = currentFrame.dimension().width;// Used when drawing the yAxis ticks

yAxis
    .tickSize(tickSize)

// Draw the yAxis first, this will position the yAxis correctly and measure the width of the label text
currentFrame.plot()
    .call(yAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-tickSize.png)

Sizeing of ticks on a chart can be broken down into three categories.

* [Short ticks - any tick where the size is shorter than the frame width](#ylinearyshortTicks)
* [Standard ticks - ticks that are the same size a the current frame](#ylinearystandardTicks)
* [Long ticks - tick wider than the current frame](#ylinearyLongTicks)

#### <a id='ylinearyshortTicks'>Short ticks</a>
Where the specified <b>.tickSize()</b> is shorter than the width of the currentFrame. Most commonly used on dual axis charts. When creating a right aligned axis you will need to translate it, this is the opposite of [Standard ticks](#ylinearystandardTicks) and [Long ticks](#ylinearyLongTicks) where the left align axis needs to be moved to position it correctly not the right. The following examples use <b>.rem()</b> to define the size of the ticks as this makes them proportional to each frame style.

Right aligned axis
```
const yAxis = gAxis.yLinear()
const currentFrame = frame[frameName];
const tickSize = currentFrame.rem() *.75

 yAxis
    .domain([0,200])
    .range([currentFrame.dimension().height,0])
    .tickSize(currentFrame.dimension().width)

currentFrame.plot()
    .call(yAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-tickShort.png)

Add the following code to translate the axis into the correct position and adjust the right margin of the currentFrame so that the labels and the ticks are on the outside of the frame. For information on this see [yLinear Postioning](#ylinpos) and [important information](#important).
```
const newMargin = yAxis.labelWidth() + currentFrame.margin().right + tickSize;
// Use newMargin redefine the new margin and range of xAxis
currentFrame.margin({ right: newMargin });
yAxis.yLabel().attr('transform', `translate(${currentFrame.dimension().width},0)`);

d3.select(currentFrame.plot().node().parentNode)
	.call(currentFrame);
```
 ![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-tickShortRightTrans.png)


#### <a id='ylinearystandardTicks'>Standard ticks</a>
Where the specified <b>.tickSize()</b> is the same as width of the currentFrame. It is the most commonly used tick size on the <b>yLinear</b> axis.
For a left hand axis, you will need to translate the axis:
```
const yAxis = gAxis.yLinear()
const currentFrame = frame[frameName];

 yAxis
    .domain([0,200])
    .range([currentFrame.dimension().height,0])
    .tickSize(currentFrame.dimension().width)

currentFrame.plot()
    .call(yAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-tickStandard.png)

You will need to adjust the currentFrame right hand margin to include the width of the tick lables so that the labels are on the outside of the currentFrame. For information on this see [yLinear Postioning](#ylinpos) and [important information](#important).
```
const newMargin = yAxis.labelWidth() + currentFrame.margin().right;
// Use newMargin redefine the new margin and range of xAxis
currentFrame.margin({ right: newMargin });

currentFrame.plot()
    .call(yAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-right.png)

For a left hand axis:

```
const yAxis = gAxis.yLinear()
const currentFrame = frame[frameName];

 yAxis
    .domain([0,200])
    .range([currentFrame.dimension().height,0])
    .tickSize(currentFrame.dimension().width)
    .align('left')

currentFrame.plot()
    .call(yAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-tickStandardL.png)

This will then need to be tranlated the width of the currentFrame to position it correctly and you will need to adjust the currentFrame left hand margin to include the width of the tick lables so that the labels are on the outside of the currentFrame. For information on this see [yLinear Postioning](#ylinpos) and [important information](#important).

```
const newMargin = yAxis.labelWidth() + currentFrame.margin().left;
//Use newMargin redefine the new margin and range of xAxis
currentFrame.margin({ left: newMargin });
yAxis.yLabel().attr('transform', `translate(${(yAxis.tickSize() - yAxis.labelWidth())},0)`);

d3.select(currentFrame.plot().node().parentNode)
            .call(currentFrame);;
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-left.png)

#### <a id='ylinearyLongTicks'>Long ticks</a>
Where the tick is longer than the currentFrame width. Mostly used on long vertical charts. Defining how far out from the currentFram.plot() the tick should protrude is completely arbitrary. It can be a constant number or a vary between frames. To do the latter its convenient to use <b>.rem()</b> which I shall for this example. For a right hand axis that will not need a translate transformation:
```
const yAxis = gAxis.yLinear()
const currentFrame = frame[frameName];

 yAxis
    .domain([0,200])
    .range([currentFrame.dimension().height,0])
    .tickSize(currentFrame.dimension().width + (currentFrame.rem() *.75))

currentFrame.plot()
    .call(yAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-longRight.png)
You will need to adjust the currentFrame right hand margin to include the width of the tick lables so that the labels and an amount of the ticks equal to the <b>.rem() * .75</b> is prodruding from the <b>currentFrame.plot()</b>are on the outside of the currentFrame. For information on this see [yLinear Postioning](#ylinpos) and [important information](#important).
```
const newMargin = yAxis.labelWidth() + currentFrame.margin().right;
// Use newMargin redefine the new margin and range of xAxis
currentFrame.margin({ right: newMargin });

currentFrame.plot()
    .call(yAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-longRightSized.png)

For the left hand axis:
```
const yAxis = gAxis.yLinear()
const currentFrame = frame[frameName];

 yAxis
    .domain([0,200])
    .range([currentFrame.dimension().height,0])
    .tickSize(currentFrame.dimension().width + (currentFrame.rem() *.75))
    .align('left')

currentFrame.plot()
    .call(yAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-longLeft.png)

This will then need to be tranlated the width of the currentFrame to position it correctly and you will need to adjust the currentFrame left hand margin to include the width of the tick lables so that the labels are on the outside of the currentFrame. For information on this see [yLinear Postioning](#ylinpos) and [important information](#important).

```
const newMargin = yAxis.labelWidth() + currentFrame.margin().left;

//Use newMargin redefine the new margin and range of xAxis
currentFrame.margin({ left: newMargin });
yAxis.yLabel().attr('transform', `translate(${(yAxis.tickSize() - yAxis.labelWidth() - (currentFrame.rem() *.75))},0)`);

d3.select(currentFrame.plot().node().parentNode)
.call(currentFrame);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-tickLongLTrans.png)

### <a id='ylinearyAxishighlight'>myAxis.yAxishighlight([Number])</a>
Changes the style of the tick specified from the normal thin 'axis' style to the thicker 'baseline'. Mostly used on index charts where the 100 line should be highlighted or when the minimum tick value goes below zero.
```
yAxis
  .yAxishighlight(100)
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-highlight.png)
```
yAxis
  .yAxishighlight(-100)
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yLinear-highlight2.png)

# <a id='yordinal'>yOrdinal</a>
<b>Note</b> All examples shown are from the web frame style.
yOrdinal() creates a d3 linear axis with a couple of additional feature to help manage styling and day-to-day production of charts that use an ordinal y-axis.

Create and call a y-axis first, as it returms <b>.labelWidth()</b> that holds a value equal to the width of the widest tick label on the y-axis. This value is used to re-define the left or right margin of the chartframe before creating the x-axis. For more information see [yOrdinal Postioning](#yordpos)

* [Getting started](#yordstarted)
* [yOrdinal postioning](#yordpos)

## <a id='yordstarted'>Getting started</a>
Add the following code to your index.js to append a default y-axis to the current frame object (grey here but not normally visible)

<b>Note</b> yOrdinal default alignment is left.

```
const yAxis = yOrdinal();// sets up yAxis

currentFrame.plot()
	.call(yAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yOrdinal-default.png)

Use the current frame dimensions to define your <b>.range()</b>. The default <b>.tickSize()</b> on the yOrdinal axis is 0. Also shown here with the default <b>.domain()</b> For more infor mation on changing this and positioning yOrdinal axis with tick see ticksize tc

```
const yAxis = yOrdinal();// sets up yAxis

yAxis
	.rangeRound([0,currentFrame.dimension().height]);

currentFrame.plot()
	.call(yAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yOrdinal-range.png)

It is good practice to pass <b>.plotDim()</b>, <b>.rem()</b>, <b>.divisor()</b> and <b>.frameName()</b> to the axis when you first set it up as they are used in some of the in-built functionality, such as <b>.banding()</b> and <b>.label()</b> and attaching id tags used by the Pre-flight illustrator script. It would also be a good idea to pass <b>.invert()</b> and <b>.logScale()</b> at this point also. This will then need to be correctly positioned, see [yOrdinal postioning](#yordpos)
```
const currentFrame = frame[frameName];
const yAxis = yOrdinal();
const plotDim = [currentFrame.dimension().width, currentFrame.dimension().height];

yAxis
	.plotDim(plotDim)
	.align(yAxisAlign)
	.domain([Math.min(yMin, valueExtent[0]), Math.max(yMax, valueExtent[1])])
	.range([currentFrame.dimension().height, 0])
	.frameName(frameName)
	.invert(yScaleInvert)
	.logScale(yLogScale)
	.divisor(divisor);

currentFrame.plot()
	.call(yAxis);
```

## <a id='yordpos'>yOrdinal positioning</a>
yOrdinal axis always take the left hand side of the currentFrame.plot() as their origin. Unless a <b>tickSize()</b> is specified both the left and right aligned axis are drawn to the left of the origin e.g.
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yOrdinal-alignleft.png)

Only if a <b>tickSize()</b> is specified on a right align axis (can't think when this would be) does the axis get push to the right e.g.
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/yOrdinal-alignleft.png)
```
const currentFrame = frame[frameName];
const yAxis = yOrdinal();
const plotDim = [currentFrame.dimension().width, currentFrame.dimension().height];

yAxis
	.plotDim(plotDim)
	.tickSize(300)
	.align(yAxisAlign)
	.domain([Math.min(yMin, valueExtent[0]), Math.max(yMax, valueExtent[1])])
	.range([currentFrame.dimension().height, 0])
	.frameName(frameName)
	.invert(yScaleInvert)
	.logScale(yLogScale)
	.divisor(divisor);

currentFrame.plot()
	.call(yAxis);
```






# <a id='xdate'>xDate</a>

<b>Note</b> Your y-axis of choice should be created and appended to the current frame before attaching an x-axis as the size of the y-axis tick text should be used to determine the .domain() of the new x-axis

Add the following code to your index.js to append a default xDate() axis to the current frame (grey here but is not normally visible). <b>Note</b> that <b>.tickSize()</b> is included although not vital to create the axis. No positioning has been applied. The minor axis is visible as the default setting for <b>.minorAxis() </b>is true.

```
const xAxis = gAxis.xDate();
const currentFrame = frame[frameName];

xAxis
	.tickSize(currentFrame.rem()*.75)
	.minorTickSize(currentFrame.rem()*.3)

currentFrame.plot()
	.call(xAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/xDate-default.png)

### Postioning

To position the axis in the frame add the following code after the axis has been called. This will place the axis correctly at eithr the top or bottom depending on the <b>.align()</b> setter, bottom by default. If full height ticks length are defined then this code will need to be re-calculated, see examples

```
if (align == 'bottom' ){
    myXAxis.xLabel().attr('transform', `translate(0,${currentFrame.dimension().height})`);
    if(minorAxis) {
        myXAxis.xLabelMinor().attr('transform', `translate(0,${currentFrame.dimension().height})`);
    }
}
if (align == 'top' ){
    myXAxis.xLabel().attr('transform', `translate(0,${myXAxis.tickSize()})`);
}
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/xDate-default-bottom.png)
You can now use the <b>.align()</b> to position the axis at the top or the bottom of the fram, see API reference

### xDate API reference

#xAxis<b>.domain([Array])</b> defines the axis domain in the same way as you would when creating a normal d3.scaleTime(). If no <b>.domain()</b> is defined the default is [Jan 01 1970,Jun 01 2017]

#xAxis<b>.range([Array])</b> defines the axis  range in the same way as you would when creating a normal d3.scaleLinear(). If no <b>.range()</b> is defined the default is [0,220])

#xAxis<b>.fullYear([boolean])</b> used on charts where <b>interval('year')</b>is used and forces the notation into a full year i.e 1977 instead of 77

#xAxis<b>.interval([String])</b> Defines the tick interval on the axis (see examples). By default this is set to "lustrum" meaning every five years. It can be set to:
 * "century" -- every one hundred years
 * "jubilee" -- every fifty years
 * "decade" -- every ten years
 * "lustrum" -- every five years
 * "years" -- every year
 * "quarters" -- every 3 months (Q1, Q2, Q3 etc, although the data still nees to be a valid date)
 * "months" -- every month
 * "weeks" -- every week
 * "days" -- every day

The interval of the ticks will also effect the tick formatting, which will default to the following:
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/xDate-tick-format.png)

#xAxis<b>.tickSize([Number])</b> Defines the size of the ticks. Usually set to <b>.rem()</b> *.75 for the major ticks. When full height ticks are required some adjustment will be needed to the positioning of the axis, see examples

#xAxis<b>.minorTickSize([String])</b> Defines the size of the minor ticks. Usually set to <b>.rem()</b>*.3. When full height ticks are required some adjustment will be needed to the positioning of the axis
<b>Note</b> When the height of the current frame is equal to the <b>.minorTickSize()</b> then the minor tick will change 'axis' and not 'baseline' resulting in the dotted tick lines

#xAxis<b>.minorTickSize([Boolean])</b> Set to true by default this determines if the minor axis is displayed or not

#xAxis<b>.xlabel()</b> Returns an accessor to allow the axis ticks to have changes made to their style

#xAxis<b>.xabel()</b> Returns an accessor to allow the axis ticks to have changes made to their style

## xDate Examples
### Yearly

From Jan 1 2005 to June 1 2017, with each year labeled and no minor axis. Full years are turned off by default
```
const xAxis = xaxisDate();//sets up yAxis
const currentFrame = frame[frameName];

let mindate = new Date(2005,1,1);
let maxdate = new Date(2017,6,1);

myXAxis
	.domain([mindate,maxdate])
	.range([0,currentFrame.dimension().width])
	.interval("years")
	.minorAxis(false)

currentFrame.plot()
    .call(myXAxis);
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/xDate-yearly.png)

### Every ten years

From Jan 1 1940 to June 1 2017, with every ten years labeled and a minor axis
```
const xAxis = xaxisDate();//sets up yAxis
const currentFrame = frame[frameName];

let mindate = new Date(1940,1,1);
let maxdate = new Date(2017,6,1);

myXAxis
	.domain([mindate,maxdate])
	.range([0,currentFrame.dimension().width])
	.interval("decade")
	.minorAxis(true)
	.tickSize(currentFrame.rem()*.75)
	.minorTickSize(currentFrame.rem()*.3)
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/xDate-decades.png)

### Every five years

From Jan 1 1986 to June 1 2017, with every five years labeled and a minor axis
```
const xAxis = xaxisDate();//sets up yAxis
const currentFrame = frame[frameName];

let mindate = new Date(1986,1,1);
let maxdate = new Date(2017,6,1);

myXAxis
	.domain([mindate,maxdate])
	.range([0,currentFrame.dimension().width])
	.interval("lustrun")
	.minorAxis(true)
	.tickSize(currentFrame.rem()*.75)
	.minorTickSize(currentFrame.rem()*.3)
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/xDate-lustrum.png)

### Every month
From Jun 1 1991 to Feb 1 2000, with month years labeled and no minor axis
```
const xAxis = xaxisDate();//sets up yAxis
const currentFrame = frame[frameName];

let mindate = new Date(1999,6,1);
let maxdate = new Date(2000,2,1);

myXAxis
	.domain([mindate,maxdate])
	.range([0,currentFrame.dimension().width])
	.interval("months")
	.minorAxis(false)
	.tickSize(currentFrame.rem()*.75)
	.minorTickSize(currentFrame.rem()*.3)
```
![alt tag](https://github.com/ft-interactive/g-axis/blob/master/images/xDate-months.png)

## <a id='ylinear'>yLinear</a>

## xOrdinal

## yLinear

## yOrdinal


