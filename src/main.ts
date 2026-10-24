const portrait = document.querySelector<HTMLDivElement>("#portrait")!;
const spin = document.querySelector<HTMLButtonElement>("#spin")!;
function svgEl(tag: string, attrs: Record<string, string | number>) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [name, value] of Object.entries(attrs)) {
    el.setAttribute(name, String(value));
  }
  return el;
}
// The prototype grew inline. Keep it this way until the refactoring checkpoint.
const face = document.createElementNS("http://www.w3.org/2000/svg", "svg");
face.setAttribute("viewBox", "0 0 200 200");
face.setAttribute("role", "img");
face.setAttribute(
  "aria-label",
  "A startled face with a spiky halo and freckles on its cheeks and nose",
);

//spiky halo
for (let i = 0; i < 40; i++) {
  const angle = (i / 40) * Math.PI * 2;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const baseX = 100 + 78 * cos;
  const baseY = 100 + 86 * sin;
  const norm = Math.hypot(cos / 78, sin / 86);
  const ox = cos / 78 / norm;
  const oy = sin / 86 / norm;
  const reach = i % 2 === 0 ? 11 : 7;
  const points = [
    [baseX - oy * 5, baseY + ox * 5],
    [baseX + oy * 5, baseY - ox * 5],
    [baseX + ox * reach, baseY + oy * reach],
  ].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  face.append(svgEl("polygon", { points, fill: "#563b67" }));
}

const head = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
head.setAttribute("cx", "100");
head.setAttribute("cy", "100");
head.setAttribute("rx", "78");
head.setAttribute("ry", "86");
head.setAttribute("fill", "#f3cf87");
head.setAttribute("stroke", "#302c29");
head.setAttribute("stroke-width", "4");
face.append(head);

const leftEye = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "ellipse",
);
leftEye.setAttribute("cx", "72");
leftEye.setAttribute("cy", "82");
leftEye.setAttribute("rx", "6");
leftEye.setAttribute("ry", "9");
leftEye.setAttribute("fill", "#302c29");
face.append(leftEye);

const rightEye = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "ellipse",
);
rightEye.setAttribute("cx", "128");
rightEye.setAttribute("cy", "82");
rightEye.setAttribute("rx", "6");
rightEye.setAttribute("ry", "9");
rightEye.setAttribute("fill", "#302c29");
face.append(rightEye);

const nose = document.createElementNS("http://www.w3.org/2000/svg", "line");
nose.setAttribute("x1", "100");
nose.setAttribute("y1", "96");
nose.setAttribute("x2", "96");
nose.setAttribute("y2", "112");
nose.setAttribute("stroke", "#302c29");
nose.setAttribute("stroke-width", "4");
nose.setAttribute("stroke-linecap", "round");
face.append(nose);

const mouth = document.createElementNS("http://www.w3.org/2000/svg", "line");
mouth.setAttribute("x1", "75");
mouth.setAttribute("y1", "137");
mouth.setAttribute("x2", "125");
mouth.setAttribute("y2", "137");
mouth.setAttribute("stroke", "#302c29");
mouth.setAttribute("stroke-width", "4");
mouth.setAttribute("stroke-linecap", "round");
face.append(mouth);

// Freckles
function freckle(x: number, y: number, r: number) {
  face.append(
    svgEl("circle", {
      cx: x.toFixed(1),
      cy: y.toFixed(1),
      r,
      fill: "#a86a3c",
    }),
  );
}

for (const cx of [62, 138]) {
  for (let i = 0; i < 28; i++) {
    const dist = 20 * Math.sqrt((i + 0.5) / 28);
    const angle = i * 2.4 + cx;
    freckle(
      cx + dist * Math.cos(angle),
      114 + dist * Math.sin(angle),
      1 + (i % 3) * 0.6,
    );
  }
}

for (let i = 0; i < 14; i++) {
  freckle(86 + (i % 7) * 4.7, 98 + Math.floor(i / 7) * 7 + (i % 2) * 2, 1.2);
}

portrait.append(face);

spin.addEventListener("click", () => {
  // Restart rather than accumulate simultaneous animations on repeated clicks.
  for (const animation of face.getAnimations()) animation.cancel();
  face.animate(
    [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
    { duration: 800, easing: "ease-in-out" },
  );
});
