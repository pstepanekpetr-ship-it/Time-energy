// Finger point diagrams — Su Jok "byol" meridian projection system.
// Uses the actual scanned artwork (fingers/*.png), cropped directly from BOTH of
// obr_bodu.pdf's hand rectangles — left hand and right hand are each the real drawing
// for that hand, not a mirrored copy — with a red circle overlaid at the measured pixel
// position of the requested point.
//
// pointXY holds each meridian's own point 1-5 pixel coordinates on its group's image,
// measured directly off a version of the source with every point numbered. Heights are
// not shared across a trio, and the palmarMiddle group's h/l cross sides between
// points 4 and 5, exactly as drawn.
const FINGER_GROUPS = {
  palmarMiddleLeft: {
    finger: 'middle', aspectEn: 'palmar', hand: 'left', image: 'fingers/palmar-middle.png', imgW: 696, imgH: 1320,
    pointXY: {
      h: [[205, 1050], [205, 950], [205, 700], [205, 600], [478, 285]],
      d: [[340, 1200], [340, 1105], [340, 950], [340, 700], [340, 285]],
      l: [[478, 1150], [478, 1050], [478, 950], [478, 700], [205, 360]],
    },
  },
  palmarMiddleRight: {
    finger: 'middle', aspectEn: 'palmar', hand: 'right', image: 'fingers/palmar-middle-right.png', imgW: 776, imgH: 1320,
    pointXY: {
      l: [[118, 1210], [118, 1085], [118, 955], [118, 730], [118, 355]],
      d: [[270, 1290], [270, 1105], [270, 955], [270, 730], [270, 300]],
      h: [[420, 1250], [420, 1105], [420, 955], [420, 730], [420, 300]],
    },
  },
  palmarIndexLeft: {
    finger: 'index', aspectEn: 'palmar', hand: 'left', image: 'fingers/palmar-index.png', imgW: 774, imgH: 1320,
    pointXY: {
      e: [[178, 1030], [178, 800], [178, 600], [178, 505], [178, 155]],
      i: [[338, 1055], [338, 815], [338, 540], [338, 430], [338, 163]],
      a: [[506, 1030], [506, 700], [506, 600], [506, 530], [506, 155]],
    },
  },
  palmarIndexRight: {
    finger: 'index', aspectEn: 'palmar', hand: 'right', image: 'fingers/palmar-index-right.png', imgW: 722, imgH: 1320,
    pointXY: {
      a: [[178, 1055], [178, 700], [178, 600], [178, 540], [178, 180]],
      i: [[305, 1080], [305, 850], [305, 650], [305, 450], [305, 250]],
      e: [[465, 1055], [465, 810], [465, 600], [465, 500], [465, 180]],
    },
  },
  dorsalIndexLeft: {
    finger: 'index', aspectEn: 'dorsal', hand: 'left', image: 'fingers/dorsal-index.png', imgW: 722, imgH: 1320,
    pointXY: {
      b: [[161, 905], [161, 805], [161, 700], [161, 600], [161, 155]],
      j: [[332, 890], [332, 790], [332, 700], [332, 440], [332, 163]],
      f: [[503, 905], [503, 805], [503, 740], [503, 600], [503, 155]],
    },
  },
  dorsalIndexRight: {
    finger: 'index', aspectEn: 'dorsal', hand: 'right', image: 'fingers/dorsal-index-right.png', imgW: 774, imgH: 1320,
    pointXY: {
      f: [[178, 925], [178, 850], [178, 750], [178, 600], [178, 195]],
      j: [[305, 900], [305, 800], [305, 700], [305, 440], [305, 195]],
      b: [[465, 925], [465, 850], [465, 750], [465, 600], [465, 195]],
    },
  },
  dorsalMiddleLeft: {
    finger: 'middle', aspectEn: 'dorsal', hand: 'left', image: 'fingers/dorsal-middle.png', imgW: 776, imgH: 1320,
    pointXY: {
      c: [[131, 1010], [131, 930], [131, 845], [131, 680], [131, 330]],
      k: [[308, 985], [308, 900], [308, 800], [308, 550], [308, 330]],
      g: [[467, 1010], [467, 930], [467, 845], [467, 680], [467, 270]],
    },
  },
  dorsalMiddleRight: {
    finger: 'middle', aspectEn: 'dorsal', hand: 'right', image: 'fingers/dorsal-middle-right.png', imgW: 696, imgH: 1320,
    pointXY: {
      g: [[178, 1010], [178, 930], [178, 850], [178, 700], [178, 300]],
      k: [[305, 1000], [305, 910], [305, 845], [305, 560], [305, 355]],
      c: [[465, 1010], [465, 930], [465, 850], [465, 700], [465, 355]],
    },
  },
};

const MERIDIAN_TO_GROUP_BASE = {
  h: 'palmarMiddle', d: 'palmarMiddle', l: 'palmarMiddle',
  e: 'palmarIndex', i: 'palmarIndex', a: 'palmarIndex',
  b: 'dorsalIndex', j: 'dorsalIndex', f: 'dorsalIndex',
  c: 'dorsalMiddle', k: 'dorsalMiddle', g: 'dorsalMiddle',
};

// Returns everything needed to place the red circle for one active (meridian, point, hand).
function getFingerDiagramInfo(meridianLetter, point, hand) {
  const groupKey = MERIDIAN_TO_GROUP_BASE[meridianLetter] + (hand === 'right' ? 'Right' : 'Left');
  const group = FINGER_GROUPS[groupKey];
  const [x, y] = group.pointXY[meridianLetter][point - 1];
  return {
    groupKey, finger: group.finger, aspectEn: group.aspectEn,
    image: group.image, imgW: group.imgW, imgH: group.imgH,
    xPercent: (x / group.imgW) * 100, yPercent: (y / group.imgH) * 100,
    hand, point,
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getFingerDiagramInfo, FINGER_GROUPS, MERIDIAN_TO_GROUP_BASE };
}
