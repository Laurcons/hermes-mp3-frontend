export function getReadableTextForBg(bgColor: string) {
  const rgb = [
    bgColor.substring(0, 2),
    bgColor.substring(2, 2),
    bgColor.substring(4, 2),
  ];

  const brightness = Math.round(
    (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) /
      1000,
  );

  return brightness > 125 ? 'black' : 'white';
}
