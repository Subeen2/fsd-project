"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TeapotGeometry } from "three/examples/jsm/geometries/TeapotGeometry.js";
import GUI from "lil-gui";

// ─── 데모 목록 ────────────────────────────────────────────────────────────────
const DEMOS = [
  { id: "cube", label: "01. 회전하는 큐브" },
  { id: "lighting", label: "02. 조명 + 재질" },
  { id: "texture", label: "03. 텍스처 매핑" },
  { id: "particles", label: "04. 파티클" },
  { id: "wave", label: "05. 웨이브 파티클" },
  { id: "teapot", label: "06. 유타 주전자" },
] as const;

type DemoId = (typeof DEMOS)[number]["id"];

// ─── 데모별 설명 ──────────────────────────────────────────────────────────────
const DESC: Record<DemoId, { title: string; points: string[] }> = {
  cube: {
    title: "Scene · Camera · Renderer",
    points: [
      "WebGLRenderer로 canvas에 렌더링",
      "PerspectiveCamera — fov, aspect, near/far",
      "BoxGeometry + MeshBasicMaterial",
      "requestAnimationFrame 루프로 애니메이션",
    ],
  },
  lighting: {
    title: "조명 & PBR 재질",
    points: [
      "MeshStandardMaterial — 물리 기반 렌더링",
      "AmbientLight — 전체 균일 조명",
      "PointLight — 점 광원 (위치·색상·강도)",
      "DirectionalLight — 방향성 조명",
    ],
  },
  texture: {
    title: "텍스처 매핑",
    points: [
      "TextureLoader로 이미지 로드",
      "map — 기본 색상 텍스처",
      "UV 좌표로 이미지 → 3D 표면 매핑",
      "SphereGeometry로 구체에 적용",
    ],
  },
  particles: {
    title: "파티클 시스템",
    points: [
      "BufferGeometry + Float32Array로 좌표 직접 설정",
      "PointsMaterial — 점 크기·색상·투명도",
      "Points 오브젝트로 수천 개 점 한번에 렌더",
      "마우스 위치에 따라 회전 반응",
    ],
  },
  wave: {
    title: "웨이브 파티클",
    points: [
      "격자(grid) 형태로 파티클 배치",
      "sin/cos 함수로 시간 기반 Y 위치 변동",
      "BufferGeometry attributes 매 프레임 업데이트",
      "needsUpdate = true 로 GPU에 변경 반영",
    ],
  },
  teapot: {
    title: "유타 주전자 (Utah Teapot)",
    points: [
      "TeapotGeometry — 3D 그래픽 역사적 표준 모델",
      "OrbitControls — 마우스로 회전·줌·패닝",
      "lil-gui — 런타임 파라미터 조작 패널",
      "6가지 재질 전환 (wireframe ~ reflective)",
    ],
  },
};

// ─── 데모 초기화 함수들 ───────────────────────────────────────────────────────

function initCube(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0f172a");

  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100,
  );
  camera.position.z = 3;

  const geometry = new THREE.BoxGeometry(1.4, 1.4, 1.4);
  const material = new THREE.MeshBasicMaterial({
    color: "#2563eb",
    wireframe: true,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // 축 헬퍼 (X=빨강, Y=초록, Z=파랑)
  scene.add(new THREE.AxesHelper(2));

  let rafId = 0;
  const animate = () => {
    rafId = requestAnimationFrame(animate);
    cube.rotation.x += 0.008;
    cube.rotation.y += 0.012;
    renderer.render(scene, camera);
  };
  animate();

  return () => {
    cancelAnimationFrame(rafId);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}

function initLighting(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0f172a");

  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100,
  );
  camera.position.set(0, 1.5, 4);
  camera.lookAt(0, 0, 0);

  // 조명
  const ambient = new THREE.AmbientLight("#ffffff", 0.3);
  scene.add(ambient);

  const point = new THREE.PointLight("#60a5fa", 80, 20);
  point.position.set(2, 3, 2);
  point.castShadow = true;
  scene.add(point);

  const dir = new THREE.DirectionalLight("#f0abfc", 1.5);
  dir.position.set(-3, 4, 1);
  scene.add(dir);

  // 오브젝트
  const sphereGeo = new THREE.SphereGeometry(0.9, 32, 32);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: "#3b82f6",
    roughness: 0.3,
    metalness: 0.6,
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  sphere.castShadow = true;
  scene.add(sphere);

  const torusGeo = new THREE.TorusGeometry(1.6, 0.12, 16, 80);
  const torusMat = new THREE.MeshStandardMaterial({
    color: "#a78bfa",
    roughness: 0.4,
    metalness: 0.5,
  });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  scene.add(torus);

  let rafId = 0;
  let t = 0;
  const animate = () => {
    rafId = requestAnimationFrame(animate);
    t += 0.01;
    torus.rotation.x = t * 0.5;
    torus.rotation.y = t;
    point.position.x = Math.sin(t) * 3;
    point.position.z = Math.cos(t) * 3;
    renderer.render(scene, camera);
  };
  animate();

  return () => {
    cancelAnimationFrame(rafId);
    sphereGeo.dispose();
    sphereMat.dispose();
    torusGeo.dispose();
    torusMat.dispose();
    renderer.dispose();
  };
}

function initTexture(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0f172a");

  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100,
  );
  camera.position.z = 3;

  const ambient = new THREE.AmbientLight("#ffffff", 0.6);
  scene.add(ambient);
  const dir = new THREE.DirectionalLight("#ffffff", 1.2);
  dir.position.set(3, 5, 3);
  scene.add(dir);

  // 캔버스 텍스처 (이미지 없이 직접 그리기)
  const texCanvas = document.createElement("canvas");
  texCanvas.width = 256;
  texCanvas.height = 256;
  const ctx = texCanvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0, "#2563eb");
  grad.addColorStop(0.5, "#7c3aed");
  grad.addColorStop(1, "#0ea5e9");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 256; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 256);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(256, i);
    ctx.stroke();
  }

  ctx.fillStyle = "white";
  ctx.font = "bold 32px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("THREE.JS", 128, 128);
  ctx.font = "16px sans-serif";
  ctx.fillText("Texture Mapping", 128, 160);

  const texture = new THREE.CanvasTexture(texCanvas);

  const geo = new THREE.SphereGeometry(1.2, 64, 64);
  const mat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.5 });
  const sphere = new THREE.Mesh(geo, mat);
  scene.add(sphere);

  let rafId = 0;
  const animate = () => {
    rafId = requestAnimationFrame(animate);
    sphere.rotation.y += 0.005;
    renderer.render(scene, camera);
  };
  animate();

  return () => {
    cancelAnimationFrame(rafId);
    geo.dispose();
    mat.dispose();
    texture.dispose();
    renderer.dispose();
  };
}

function initParticles(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0f172a");

  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100,
  );
  camera.position.z = 5;

  const COUNT = 2000;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const color = new THREE.Color();

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

    color.setHSL(Math.random() * 0.3 + 0.55, 0.9, 0.65);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const mouse = { x: 0, y: 0 };
  const onMouseMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouse.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
  };
  canvas.addEventListener("mousemove", onMouseMove);

  let rafId = 0;
  const animate = () => {
    rafId = requestAnimationFrame(animate);
    points.rotation.y += (mouse.x * 0.5 - points.rotation.y) * 0.05;
    points.rotation.x += (mouse.y * 0.3 - points.rotation.x) * 0.05;
    renderer.render(scene, camera);
  };
  animate();

  return () => {
    cancelAnimationFrame(rafId);
    canvas.removeEventListener("mousemove", onMouseMove);
    geo.dispose();
    mat.dispose();
    renderer.dispose();
  };
}

function initWave(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0f172a");

  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100,
  );
  camera.position.set(0, 6, 10);
  camera.lookAt(0, 0, 0);

  const COLS = 40;
  const ROWS = 40;
  const GAP = 0.22;
  const COUNT = COLS * ROWS;

  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const color = new THREE.Color();

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      positions[i * 3] = (c - COLS / 2) * GAP;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = (r - ROWS / 2) * GAP;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({ size: 0.07, vertexColors: true });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
  const colAttr = geo.getAttribute("color") as THREE.BufferAttribute;

  let rafId = 0;
  let t = 0;
  const animate = () => {
    rafId = requestAnimationFrame(animate);
    t += 0.03;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c;
        const x = posAttr.getX(i);
        const z = posAttr.getZ(i);
        const y = Math.sin(x * 2 + t) * 0.4 + Math.cos(z * 2 + t * 0.8) * 0.4;
        posAttr.setY(i, y);

        const h = (y + 0.8) / 1.6;
        color.setHSL(0.55 + h * 0.2, 0.9, 0.4 + h * 0.4);
        colAttr.setXYZ(i, color.r, color.g, color.b);
      }
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    points.rotation.y += 0.003;
    renderer.render(scene, camera);
  };
  animate();

  return () => {
    cancelAnimationFrame(rafId);
    geo.dispose();
    mat.dispose();
    renderer.dispose();
  };
}

function initTeapot(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#aaaaaa");

  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    1,
    80000,
  );
  camera.position.set(-600, 550, 1300);

  // 조명
  const ambientLight = new THREE.AmbientLight(0x7c7c7c, 2.0);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
  dirLight.position.set(0.32, 0.39, 0.7);
  scene.add(dirLight);

  // OrbitControls
  const controls = new OrbitControls(camera, canvas);
  controls.addEventListener("change", () => renderer.render(scene, camera));

  // UV 그리드 텍스처 (canvas로 생성)
  const texCanvas = document.createElement("canvas");
  texCanvas.width = 512;
  texCanvas.height = 512;
  const ctx = texCanvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = "#aaaaaa";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 512; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }
  ctx.fillStyle = "#e63946";
  for (let r = 0; r < 16; r++) {
    for (let c = 0; c < 16; c++) {
      if ((r + c) % 2 === 0) ctx.fillRect(c * 32, r * 32, 32, 32);
    }
  }
  const textureMap = new THREE.CanvasTexture(texCanvas);
  textureMap.wrapS = textureMap.wrapT = THREE.RepeatWrapping;
  textureMap.colorSpace = THREE.SRGBColorSpace;

  type ShadingKey = "wireframe" | "flat" | "smooth" | "glossy" | "textured";
  const materials: Record<ShadingKey, THREE.Material> = {
    wireframe: new THREE.MeshBasicMaterial({ wireframe: true }),
    flat: new THREE.MeshPhongMaterial({
      specular: 0x000000,
      flatShading: true,
      side: THREE.DoubleSide,
    }),
    smooth: new THREE.MeshLambertMaterial({ side: THREE.DoubleSide }),
    glossy: new THREE.MeshPhongMaterial({
      color: 0xc0c0c0,
      specular: 0x404040,
      shininess: 300,
      side: THREE.DoubleSide,
    }),
    textured: new THREE.MeshPhongMaterial({
      map: textureMap,
      side: THREE.DoubleSide,
    }),
  };

  const TEAPOT_SIZE = 300;
  let teapot: THREE.Mesh | null = null;

  const params = {
    tessellation: 15,
    bottom: true,
    lid: true,
    body: true,
    fitLid: false,
    nonblinn: false,
    shading: "glossy" as ShadingKey,
  };

  function buildTeapot() {
    if (teapot) {
      teapot.geometry.dispose();
      scene.remove(teapot);
    }
    const geo = new TeapotGeometry(
      TEAPOT_SIZE,
      params.tessellation,
      params.bottom,
      params.lid,
      params.body,
      params.fitLid,
      !params.nonblinn,
    );
    teapot = new THREE.Mesh(geo, materials[params.shading]);
    scene.add(teapot);
    renderer.render(scene, camera);
  }

  buildTeapot();

  // lil-gui
  const gui = new GUI({ container: canvas.parentElement! });
  gui.domElement.style.position = "absolute";
  gui.domElement.style.top = "12px";
  gui.domElement.style.right = "12px";
  gui
    .add(params, "tessellation", [2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 40, 50])
    .name("Tessellation")
    .onChange(buildTeapot);
  gui.add(params, "lid").name("뚜껑").onChange(buildTeapot);
  gui.add(params, "body").name("몸통").onChange(buildTeapot);
  gui.add(params, "bottom").name("바닥").onChange(buildTeapot);
  gui.add(params, "fitLid").name("뚜껑 밀착").onChange(buildTeapot);
  gui.add(params, "nonblinn").name("원본 스케일").onChange(buildTeapot);
  gui
    .add(params, "shading", [
      "wireframe",
      "flat",
      "smooth",
      "glossy",
      "textured",
    ])
    .name("재질")
    .onChange(buildTeapot);

  // 리사이즈 대응
  const onResize = () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.render(scene, camera);
  };
  window.addEventListener("resize", onResize);

  return () => {
    window.removeEventListener("resize", onResize);
    controls.dispose();
    gui.destroy();
    teapot?.geometry.dispose();
    Object.values(materials).forEach((m) => m.dispose());
    textureMap.dispose();
    renderer.dispose();
  };
}

const INIT_FN: Record<DemoId, (canvas: HTMLCanvasElement) => () => void> = {
  cube: initCube,
  lighting: initLighting,
  texture: initTexture,
  particles: initParticles,
  wave: initWave,
  teapot: initTeapot,
};

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
export default function ThreeDemo() {
  const [activeDemo, setActiveDemo] = useState<DemoId>("cube");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 이전 데모 정리
    cleanupRef.current?.();

    // canvas 크기를 컨테이너에 맞춤
    const container = canvas.parentElement!;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    cleanupRef.current = INIT_FN[activeDemo](canvas);

    return () => {
      cleanupRef.current?.();
    };
  }, [activeDemo]);

  const desc = DESC[activeDemo];

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#0f172a",
        color: "#e2e8f0",
        fontFamily: "monospace",
      }}
    >
      {/* 사이드바 */}
      <aside
        style={{
          width: 220,
          borderRight: "1px solid #1e293b",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: "20px 16px 12px",
            borderBottom: "1px solid #1e293b",
          }}
        >
          <div
            style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.1em" }}
          >
            THREE.JS
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#f8fafc",
              marginTop: 2,
            }}
          >
            Interactive Demo
          </div>
        </div>
        <nav style={{ flex: 1, padding: "8px 0" }}>
          {DEMOS.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDemo(d.id)}
              style={{
                display: "block",
                width: "100%",
                padding: "10px 16px",
                textAlign: "left",
                background: activeDemo === d.id ? "#1e293b" : "transparent",
                border: "none",
                borderLeft: `3px solid ${activeDemo === d.id ? "#2563eb" : "transparent"}`,
                color: activeDemo === d.id ? "#60a5fa" : "#94a3b8",
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {d.label}
            </button>
          ))}
        </nav>
        {/* 설명 패널 */}
        <div style={{ padding: 16, borderTop: "1px solid #1e293b" }}>
          <div
            style={{
              fontSize: 11,
              color: "#60a5fa",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            {desc.title}
          </div>
          <ul style={{ margin: 0, paddingLeft: 14 }}>
            {desc.points.map((p, i) => (
              <li
                key={i}
                style={{
                  fontSize: 11,
                  color: "#64748b",
                  marginBottom: 5,
                  lineHeight: 1.5,
                }}
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* 캔버스 영역 */}
      <main style={{ flex: 1, position: "relative" }}>
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: "100%" }}
        />
        {/* 데모 이름 오버레이 */}
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            padding: "4px 10px",
            background: "rgba(15,23,42,0.7)",
            border: "1px solid #1e293b",
            borderRadius: 6,
            fontSize: 11,
            color: "#64748b",
          }}
        >
          {DEMOS.find((d) => d.id === activeDemo)?.label}
        </div>
      </main>
    </div>
  );
}
