# Skills and Competencies DataViz

This repo contains data visualisations for skills and competencies data.

The root contains two working directories:

- `src` - contains the library code for the visualisations which is built and
- distributed as a package.
- `examples` - contains the storybook code for the visualisations.

## Usage Examples

### Vanilla JS

Can be used as below:

```js
const generateRandomData = (n, categoryCount) =>
  Array.from({ length: n }, (_, i) => ({
    skill: `skill-${i}`,
    category: `category-${Math.floor(Math.random() * categoryCount)}`,
    lvl: Math.floor(Math.random() * 10),
  }))

renderRadialPlot('dataviz_root', data, {
    innerRadius: 0,
    width: 640,
    // height: _height:undefined,
    innerRadius: 80,
    outerPadding: 100,
    categoryPadding: 0.1,
    skillPadding: 0.05,
    arcPercent: 0.8,
    arcStartOffset: 0.1,
    annotationPadding: 10,
    lineThickness: 2,
    labelTextColor: "black",
    lvlTextColor: "#ccc",
    lvlArcColor: "#121519",
    // colourList:d3.schemeAccent,
  })
```

## Contributing

### Preview

The visualisations can be previewed using storybook.
Run `pnpm run storybook` to start the storybook server.

### Linter

We use the default vite eslint setup. Run `pnpm run lint` to lint the code.

It is also recommended to use the eslint extension for your editor.

### Formatting

We use prettier for code formatting. Run `pnpm run format` to format the code.

### Testing

<!-- TODO: Implement testing -->

We use vitest for testing. Run `pnpm run test` to run the tests.
