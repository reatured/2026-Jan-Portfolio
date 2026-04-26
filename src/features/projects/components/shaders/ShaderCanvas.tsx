import React, { useEffect, useRef, useState } from 'react';
import shaderSources from './sources.json';

const VERTEX_SHADER = `#version 300 es
in vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }`;

const FRAGMENT_PREAMBLE = `#version 300 es
precision highp float;
precision highp int;
out vec4 outFragColor;
uniform vec3 iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform int iFrame;
uniform vec4 iMouse;
uniform vec4 iDate;
uniform float iSampleRate;
uniform vec3 iChannelResolution[4];
uniform float iChannelTime[4];
`;

const FRAGMENT_EPILOGUE = `
void main(){
  vec4 c = vec4(0.0);
  mainImage(c, gl_FragCoord.xy);
  outFragColor = c;
}`;

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('createShader failed');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) || 'unknown shader compile error';
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
}

function buildProgram(gl: WebGL2RenderingContext, fragmentBody: string): WebGLProgram {
  const fragSource = FRAGMENT_PREAMBLE + '\n' + fragmentBody + '\n' + FRAGMENT_EPILOGUE;
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSource);
  const program = gl.createProgram();
  if (!program) throw new Error('createProgram failed');
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) || 'unknown link error';
    gl.deleteProgram(program);
    throw new Error(log);
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return program;
}

export type ShaderCanvasProps = {
  shaderId: string;
  className?: string;
  ariaLabel?: string;
  paused?: boolean;
};

export const ShaderCanvas: React.FC<ShaderCanvasProps> = ({ shaderId, className, ariaLabel, paused = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [inView, setInView] = useState(false);

  const source = (shaderSources as Record<string, { name: string; code: string }>)[shaderId];

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { setInView(true); io.disconnect(); return; }
    }, { rootMargin: '200px' });
    io.observe(wrap);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    setError(null);
    if (!inView) return;
    if (!source) { setError(`Unknown shader: ${shaderId}`); return; }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', { antialias: true, premultipliedAlpha: false });
    if (!gl) { setError('WebGL2 unavailable'); return; }

    let program: WebGLProgram;
    try {
      program = buildProgram(gl, source.code);
    } catch (e: any) {
      setError(e?.message?.slice(0, 400) || 'compile error');
      return;
    }

    const vao = gl.createVertexArray();
    const vbo = gl.createBuffer();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'iResolution');
    const uTime = gl.getUniformLocation(program, 'iTime');
    const uDelta = gl.getUniformLocation(program, 'iTimeDelta');
    const uFrame = gl.getUniformLocation(program, 'iFrame');
    const uMouse = gl.getUniformLocation(program, 'iMouse');
    const uDate = gl.getUniformLocation(program, 'iDate');

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const syncSize = () => {
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      const w = Math.max(1, Math.floor(cw * dpr));
      const h = Math.max(1, Math.floor(ch * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    let raf = 0;
    let frame = 0;
    let prev = performance.now();
    const start = prev;

    const render = (now: number) => {
      const delta = (now - prev) / 1000;
      prev = now;
      if (paused) { raf = requestAnimationFrame(render); return; }
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      if (uRes) gl.uniform3f(uRes, canvas.width, canvas.height, 1);
      if (uTime) gl.uniform1f(uTime, (now - start) / 1000);
      if (uDelta) gl.uniform1f(uDelta, delta);
      if (uFrame) gl.uniform1i(uFrame, frame);
      if (uMouse) gl.uniform4f(uMouse, 0, 0, 0, 0);
      if (uDate) {
        const d = new Date();
        gl.uniform4f(uDate, d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds());
      }
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame++;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      gl.deleteProgram(program);
      gl.deleteBuffer(vbo);
      gl.deleteVertexArray(vao);
    };
  }, [shaderId, source, paused, inView]);

  return (
    <div ref={wrapRef} className={className} style={{ position: 'relative', width: '100%', height: '100%', background: '#000', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        aria-label={ariaLabel || source?.name || 'Shader'}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
      {error && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#ff8888', fontFamily: 'monospace', fontSize: '0.7rem', padding: '12px',
          background: 'rgba(0,0,0,0.6)', textAlign: 'center', whiteSpace: 'pre-wrap', overflow: 'auto',
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default ShaderCanvas;
