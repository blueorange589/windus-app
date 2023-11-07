const colors = [
    'black', 'white', 'slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 
    'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
]

const common = {
  directions: ["center", "top", "right", "bottom", "left"],
  corners: ['bottom', 'center', 'left', 'left-bottom', 'left-top', 'right', 'right-bottom', 'right-top', 'top'],
  sizes: {
    px: "1px",
    0: "0px",
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    2.5: "0.625rem",
    3: "0.75rem",
    3.5: "0.875rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    11: "2.75rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    28: "7rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    44: "11rem",
    48: "12rem",
    52: "13rem",
    56: "14rem",
    60: "15rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
    96: "24rem",
  },
  ratio4: {
    "1/2": "50%",
    "1/3": "33.333333%",
    "2/3": "66.666667%",
    "1/4": "25%",
    "2/4": "50%",
    "3/4": "75%",
  },
  ratio6: {
    "1/2": "50%",
    "1/3": "33.333333%",
    "2/3": "66.666667%",
    "1/4": "25%",
    "2/4": "50%",
    "3/4": "75%",
    "1/5": "20%",
    "2/5": "40%",
    "3/5": "60%",
    "4/5": "80%",
    "1/6": "16.666667%",
    "2/6": "33.333333%",
    "3/6": "50%",
    "4/6": "66.666667%",
    "5/6": "83.333333%",
  },
  ratio12: {
    "1/12": "8.333333%",
    "2/12": "16.666667%",
    "3/12": "25%",
    "4/12": "33.333333%",
    "5/12": "41.666667%",
    "6/12": "50%",
    "7/12": "58.333333%",
    "8/12": "66.666667%",
    "9/12": "75%",
    "10/12": "83.333333%",
    "11/12": "91.666667%",
    full: "100%"
  },
  zeroEight: [0,1,2,4,8],
  sizeAbbr: ["3xs", "2xs", 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl' ],
  sizeAbbrMini: [ 'sm', 'md', 'lg', 'xl', '2xl', '3xl']
}

const getList = (prefix, list) => {
  const outs = []
  list.forEach(el => {
    const text = [prefix, el].join('-')
    outs.push(text)
  });
  return outs
}


const getNums = (prefix, start, end, step, suffix) => {
  const outs = []
  if(Array.isArray(start)) {
    start.forEach(i => {
      const txt = [prefix, i, suffix].join('-')
      outs.push(txt)
    })
  } else {
    for(let i = start; i<=end; i++) {
      let num = i
      if(step) {
        num = step * i
      }
      const txt = [prefix, num, suffix].join('-')
      outs.push(txt)
    }
  }
  return outs
}

const getVars = (prefix, node) => {
  const out = []
  if(Array.isArray(node)) {
    node.forEach(k => {
      const text = [prefix, k].join('-')
      out.push(text)
    })
  } else{
    Object.keys(node).forEach(k => {
      const text = [prefix, k].join('-')
      out.push(text)
    })
  }
  
  return out
}

const getColors = (p) => {
  const colorList = []
  colors.forEach(c => {
    colorList.push(`${p}-${c}-50`, `${p}-${c}-100`, `${p}-${c}-200`, `${p}-${c}-300`, `${p}-${c}-400`, `${p}-${c}-500`, `${p}-${c}-600`, `${p}-${c}-700`, `${p}-${c}-800`, `${p}-${c}-900`)
  })
  return colorList
}

export const options = {
  display: {
    display: ['block', 'inline-block', 'inline', 'flex', 'inline-flex', 'table', 'inline-table', 'table-caption', 'table-cell', 'table-column', 'table-column-group', 'table-footer-group', 'table-header-group', 'table-row-group', 'table-row', 'flow-root', 'grid', 'inline-grid', 'contents', 'list-item', 'hidden'],
    position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
    visibility: ['visible', 'invisibile', 'collapse'],
    opacity: getNums('opacity', 0, 10, 10),
    columns: ["auto", ...getNums('columns', 1, 12)]
  },
  flex: {
    flex: ['flex-1', 'flex-auto', 'flex-initial', 'flex-none'],
    flexBasis: ['basis-auto', ...getVars('basis', common.sizes), ...getVars('basis', common.ratio6), ...getVars('basis', common.ratio12), 'basis-full'],
    flexGrow: ['grow', 'grow-0'],
    flexShrink: ['shrink', 'shrink-0'],
    flexDirection: ['flex-row', 'flex-row-reverse', 'flex-col', 'flex-col-reverse'],
    order: ['order-first', 'order-last', 'order-none', ...getNums('order',1,12)],
    flexWrap: ['flex-wrap', 'flex-wrap-reverse', 'flex-no-wrap']
  },
  grid: {
    gridAutoColumns: getList('auto-cols', ['auto', 'min', 'max', 'fr']),
    gridAutoRows: getList('auto-rows', ['auto', 'min', 'max', 'fr']),
    gridColumn: ["auto", ...getNums('col-span',1,12), "col-span-full"],
    gridColumnEnd: ["auto", ...getNums('col-end',1,13)],
    gridColumnStart: ["auto", ...getNums('col-start',1,13)],
    gridRow: ["auto", ...getNums('row-span',1,6), "row-span-full"],
    gridRowEnd: ["auto", ...getNums('row-end',1,7)],
    gridRowStart: ["auto", ...getNums('row-start',1,7)],
    gridTemplateColumns: ["grid-cols-none", ...getNums('grid-cols', 1, 12) ],
    gridTemplateRows: ["grid-rows-none", ...getNums('grid-rows', 1, 6) ],
    gap: [...getNums('gap',1,12), ...getNums('gap-x',1,12), ...getNums('gap-y', 1,12)],
  },
  positioning: {
    top: ['top-auto', ...getVars('top', common.sizes), 'top-full'],
    right: ['right-auto', ...getVars('right', common.sizes), 'right-full'],
    bottom: ['bottom-auto', ...getVars('bottom', common.sizes), 'bottom-full'],
    left: ['left-auto', ...getVars('left', common.sizes), 'left-full'],
    start: ['start-auto', ...getVars('start', common.sizes), 'start-full'],
    end: ['end-auto', ...getVars('end', common.sizes), 'end-full'],
    inset: ['inset-auto', ...getVars('inset', common.sizes), 'inset-full'],
    insetX: ['inset-x-auto', ...getVars('inset-x', common.sizes), 'inset-full'],
    insetY: ['inset-y-auto', ...getVars('inset-y', common.sizes), 'inset-full'],
  },
  alignment: {
    alignContent: getList('content', ['normal', 'center', 'start', 'end', 'between', 'around', 'evenly', 'baseline', 'stretch']),
    justifyContent: getList('justify', ['normal', 'center', 'start', 'end', 'between', 'around', 'evenly', 'stretch']),
    placeContent: getList('place-content', ['center', 'start', 'end', 'between', 'around', 'evenly', 'baseline', 'stretch']),
    alignItems: getList('items', ['center', 'start', 'end', 'baseline', 'stretch']),
    justifyItems: getList('justify-items', ['center', 'start', 'end', 'stretch']),
    placeItems: getList('place-items', ['center', 'start', 'end', 'baseline', 'stretch']),
    alignSelf: getList('self', ['auto', 'start', 'end', 'center', 'baseline', 'stretch']),
    justifySelf: getList('justify-self', ['auto', 'center', 'start', 'end', 'stretch']),
    placeSelf: getList('place-self', ['auto', 'center', 'start', 'end', 'stretch']),
    verticalAlign: getList('align', ['baseline', 'top', 'middle', 'bottom', 'text-top', 'text-bottom', 'sub', 'super']),
  },
  sizing: {
    width: ["w-auto", ...getVars("w", common.sizes), ...getVars("w", common.ratio6), ...getVars("w", common.ratio12), ...getList('w', [ 'full', 'screen', 'min', 'max', 'fit']) ],
    minWidth: getList('min-w', [ 'full', 'min', 'max', 'fit']),
    maxWidth: ['max-w-0', 'max-w-none', ...getVars('max-w', common.sizeAbbr), ...getList('max-w', [ 'full', 'min', 'max', 'fit'])],
    height: ['h-auto', ...getVars('h', common.ratio6), ...getList('h', [ 'full', 'min', 'max', 'fit']) ],
    minHeight: ['min-h-0', ...getList('min-h', ['min', 'max', 'none', 'full', 'screen', 'fit'])],
    maxHeight: [...getVars('max-h', common.sizes), ...getList('max-h', ['min', 'max', 'none', 'full', 'screen', 'fit']) ],
  },
  spacing: {
    margin: getVars('m', common.sizes),
    marginTop: getVars('mt', common.sizes),
    marginRight: getVars('mr', common.sizes),
    marginBottom: getVars('mb', common.sizes),
    marginLeft: getVars('ml', common.sizes),
    marginX: getVars('mx', common.sizes),
    marginY: getVars('my', common.sizes),
    padding: getVars('p', common.sizes),
    paddingTop: getVars('pt', common.sizes),
    paddingRight: getVars('pr', common.sizes),
    paddingBottom: getVars('pb', common.sizes),
    paddingLeft: getVars('pl', common.sizes),
    paddingX: getVars('px', common.sizes),
    paddingY: getVars('py', common.sizes),
  },
  font: {
    fontFamily: {arial: 'Arial', inter: 'Inter'},
    fontSize: getVars('text', common.sizeAbbr),
    fontWeight: ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'],
    fontStyle: ['font-italic', 'font-normal'],
    textAlign: ["text-left", "text-center", "text-right", "text-justify", "text-start", "text-end"],
    textColor: getColors('text'),
    textDecorationColor: getColors('decoration'),
    textDecorationThickness: ['decoration-thickness-auto', ...getVars('decoration-thickness', common.zeroEight)],
    textIndent: getVars('indent', common.sizes),
    textUnderlineOffset: ['underline-offset-auto', ...getVars('underline-offset', common.zeroEight)],
    lineHeight: ['leading-none', 'leading-tight', 'leading-snug', 'leading-normal', 'leading-relaxed', 'leading-loose', 'leading-3', 'leading-4', 'leading-5', 'leading-6', 'leading-7', 'leading-8', 'leading-9', 'leading-10', ],
    letterSpacing: getList('tracking', ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest']),
    textTransform: ["uppercase", "lowercase", "capitalize", "normal-case"],
    listStylePosition: ['list-inside', 'list-outside'],
    listStyleType : ['list-none', 'list-disc', 'list-decimal'],
  },
  borders: {
    borderRadius: ['rounded-none', getVars('rounded', common.sizeAbbrMini)],
    borderWidth: [
      'border',
      ...getList('border', ['x', 'y', 't', 'r', 'b', 'l', 's', 'e']),
      ...getVars('border', common.zeroEight), 
      ...getVars('border-x', common.zeroEight), 
      ...getVars('border-y', common.zeroEight),
      ...getVars('border-t', common.zeroEight),
      ...getVars('border-r', common.zeroEight),
      ...getVars('border-b', common.zeroEight),
      ...getVars('border-l', common.zeroEight),
      ...getVars('border-s', common.zeroEight),
      ...getVars('border-e', common.zeroEight),
    ],
    borderStyle: getList('border', ['solid', 'dashed', 'dotted', 'double', 'hidden', 'none']),
    borderColor: getColors('border'),
  },
  background: {
    backgroundColor: getColors('bg'),
    backgroundSize: getList('bg', ['auto', 'cover', 'contain']),
    backgroundImage: getList('bg', ['none', 'gradient-to-t', 'gradient-to-tr', 'gradient-to-r', 'gradient-to-br', 'gradient-to-b', 'gradient-to-bl', 'gradient-to-l', 'gradient-to-tl']),
    backgroundPosition: getList('bg', common.corners),
    backgroundAttachment: getList('bg', ['fixed', 'local', 'scroll']),
    backgroundClip: getList('bg-clip', ['border', 'padding', 'content', 'text']),
    backgroundRepeat: ['bg-repeat', 'bg-no-repeat', ...getList('bg-repeat', ['x', 'y', 'round', 'space'])],
    backgroundOrigin: getList('bg-origin', ['border', 'padding', 'content']),
    gradientColorStops: getColors('from'),
    gradientColorStops: getColors('via'),
    gradientColorStops: getColors('to'),
    gradientColorStopPositions: getNums('from', 0, 20, 5, '%'),
    fill: getColors('fill'),
  },
  shadow: {
    boxShadow: getVars('shadow', common.sizeAbbrMini),
    boxShadowColor: getColors('shadow'),
    dropShadow: getVars('drop-shadow', common.sizeAbbrMini),
  },
  outline: {
    outlineStyle: ['outline', getList('outline', ['dashed', 'dotted', 'double', 'none'])],
    outlineWidth: getVars('outline-width', common.zeroEight),
    outlineOffset: getVars('outline-offset', common.zeroEight),
    outlineColor: getColors('outline-color')
  },
  effects: {
    blur: ['blur', getVars('blur', common.sizeAbbrMini)],
    brightness: getList('brightness', [0, 50, 75, 90, 95, 100, 105, 110, 125, 150, 200]),
    contrast: getNums('brightness', 0, 8, 25),
    grayscale: ['grayscale-0', 'grayscale-100'],
    hueRotate: getList('hue-rotate', [0, 15, 30, 60, 90, 180]),
    invert: ['invert', 'invert-0'],
    saturate: getNums('saturate', 0, 4, 50),
    sepia: ['sepia', 'sepia-0'],
  },
  backdrop: {
    backdropBlur: ['backdrop-blur', getVars('backdrop-blur', common.sizeAbbrMini)],
    backdropBrightness: getList('backdrop-brightness', [0, 50, 75, 90, 95, 100, 105, 110, 125, 150, 200]),
    backdropContrast: getList('backdrop-contrast', [0, 50, 75, 100, 125, 150, 200]),
    backdropGrayscale: ['backdrop-grayscale', 'backdrop-grayscale-0'],
    backdropHueRotate: getList('backdrop-hue-rotate', [0, 15, 30, 60, 90, 180]),
    backdropInvert: ['backdrop-invert', 'backdrop-invert-0'],
    backdropOpacity: getNums('backdrop-opacity', 0, 10, 10),
    backdropSaturate: getNums('backdrop-saturate', 0, 4, 50),
    backdropSepia: ['backdrop-sepia', 'backdrop-sepia-0'],
  },
  animate: {
    transitionDelay: [...getList('delay', [0, 75, 100, 150, 200, 300, 500, 700, 1000])],
    transitionDuration: [...getList('duration', [0, 75, 100, 150, 200, 300, 500, 700, 1000])],
    transitionProperty: ['transition', getList('transition', ['none', 'all', 'colors', 'opacity', 'shadow', 'transform'])],
    transitionTimingFunction: ['ease-in', 'ease-out', 'ease-in-out', 'ease-linear'],
    animation: getList('animate', ['none', 'spin', 'ping', 'pulse', 'bounce']),
  },
  transforms: {
    translate: [
      ...getVars('translate-x', common.sizes), 
      ...getVars('translate-y', common.sizes),
      ...getVars('translate-x', common.ratio4),
      ...getVars('translate-y', common.ratio4),
      'translate-x-full',
      'translate-y-full',
    ],
    transformOrigin: getList('origin', common.corners),
    rotate: getList('rotate', [0, 1, 2, 3, 6, 12, 45, 90, 180]),
    skew: getList('skew', [0, 1, 2, 3, 6, 12]),
    scale: getList('scale', [0, 50, 75, 90, 95, 100, 105, 110, 125, 150]),
  },
  divide: {
    divideStyle: getList('divide', ['solid', 'dashed', 'dotted', 'double', 'none']),
    divideColor: getColors('divide'),
    divideWidth: getVars('divide-width', common.zeroEight),
  },
  misc: {
    cursor: ['cursor-auto', 'cursor-default', 'cursor-pointer', 'cursor-wait', 'cursor-text', 'cursor-progress'],
    zIndex: ['z-auto', ...getNums('z', 0, 5, 10)],
    float: ['float-left','float-right','float-none'],
    clear: getList('clear', ['left', 'right', 'both', 'none']),
    overflow: [...getList('overflow', ['auto', 'hidden', 'clip', 'visible', 'scroll']),...getList('overflow-x', ['auto', 'hidden', 'clip', 'visible', 'scroll']),...getList('overflow-y', ['auto', 'hidden', 'clip', 'visible', 'scroll'])],
    overScroll: [...getList('overscroll', ['auto', 'contain', 'none']),...getList('overscroll-x', ['auto', 'contain', 'none']),...getList('overscroll-y', ['auto', 'contain', 'none'])],
    aria: getList('aria', ['busy', 'checked', 'disabled', 'expanded', 'hidden', 'pressed', 'readonly', 'required', 'selected']),
    aspectRatio: { auto: "auto", square: "1 / 1", video: "16 / 9" },
    objectFit: getList('object', ['contain', 'cover', 'fill', 'none', 'scale-down']),
    objectPosition: getVars('object', common.corners),
  },
}   