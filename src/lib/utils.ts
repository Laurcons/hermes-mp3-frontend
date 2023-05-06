export function getReadableTextForBg(bgColor: string) {
  // remove leading #
  bgColor = bgColor.split('#').pop()!;
  // bgColor might be #XXX or #XXXXXX
  const size = Math.round(bgColor.length / 3);
  const rgb = [
    parseInt(bgColor.substring(0, size), 16),
    parseInt(bgColor.substring(size, size * 2), 16),
    parseInt(bgColor.substring(size * 2, size * 3), 16),
  ];

  const brightness = Math.round(
    (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000,
  );

  return brightness > 150 ? 'black' : 'white';
}
