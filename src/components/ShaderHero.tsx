import { useRef, useEffect, useState } from "react"

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`

const FRAG = `precision highp float;
uniform vec2 iResolution;uniform float iTime;
vec2 rnd(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}
void main(){
  vec3 BONE=vec3(.984,.969,.945);vec3 CREAM=vec3(.941,.863,.764);vec3 AMBER=vec3(.965,.678,.490);
  vec2 uv=gl_FragCoord.xy/iResolution.xy;
  uv.y*=iResolution.y/iResolution.x;
  float zoom=7.0,offset=0.1;
  uv*=zoom;
  vec2 iuv=floor(uv),fuv=fract(uv);
  vec3 col=vec3(0.0);float md=1.;
  for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
    vec2 nb=vec2(float(x),float(y));
    vec2 pt=rnd(iuv+nb);pt=vec2(.5)+.5*sin(iTime*.35+6.075*pt);
    vec2 d=nb+pt-fuv;d+=offset*rnd(iuv)*step(.5,uv.x/10.);
    float dd=length(d);md=min(md,dd);
  }
  float cell=clamp(md*1.55,0.,1.);
  float rings=smoothstep(0.,.1,abs(sin(24.*md))-.82);
  col=mix(CREAM,BONE,cell);
  col=mix(col,AMBER,rings*.24);
  float lp=(30.+iResolution.x*.015)/iResolution.x;
  vec2 luv=vec2(uv.x/lp,uv.y/(lp*(iResolution.y/iResolution.x)));
  float wash=1.-smoothstep(.05,1.15,length(luv-vec2(.38,.16)));
  col=mix(col,BONE,wash*.22);col=mix(col,AMBER,(1.-wash)*.06);
  col+=vec3(.08);
  col=max(col,vec3(.784,.753,.722));
  float luma=dot(col,vec3(.2126,.7152,.0722));
  col=mix(col,BONE,clamp((.87-luma)/.30,0.,1.));
  col=mix(col,vec3(.941,.882,.824),.18);
  col*=1.-.14*(length(uv-vec2(3.5,.6))/zoom);
  gl_FragColor=vec4(col,1.);
}`

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null
  return s
}

export default function ShaderHero() {
  const cv = useRef<HTMLCanvasElement>(null)
  const [ok, setOk] = useState(false)
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

  useEffect(() => {
    if (reduced) return
    const c = cv.current
    if (!c) return
    const gl = c.getContext("webgl2")
    if (!gl) return
    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const pr = gl.createProgram()!
    gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr)
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return
    gl.useProgram(pr)
    const buf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(pr, "p")
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const uR = gl.getUniformLocation(pr, "iResolution")
    const uT = gl.getUniformLocation(pr, "iTime")
    let scale = 1, fpsFrames = 0, fpsLast = performance.now(), stopped = false, degraded = false
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    function size() {
      const w = Math.max(1, Math.floor(c!.clientWidth * dpr * scale))
      const h = Math.max(1, Math.floor(c!.clientHeight * dpr * scale))
      if (c!.width !== w || c!.height !== h) { c!.width = w; c!.height = h; gl!.viewport(0, 0, w, h) }
    }

    const start = performance.now()
    function frame(now: number) {
      if (stopped) return
      size()
      gl!.uniform2f(uR, c!.width, c!.height)
      gl!.uniform1f(uT, (now - start) / 1000)
      gl!.drawArrays(gl!.TRIANGLES, 0, 3)
      fpsFrames++
      if (now - fpsLast >= 1000) {
        const fps = fpsFrames * 1000 / (now - fpsLast)
        if (!degraded && fps < 34) { scale = 0.55; degraded = true }
        else if (degraded && fps < 20) { stopped = true; c!.style.opacity = "0" }
        if (!degraded) setOk(true)
        fpsFrames = 0; fpsLast = now
      }
      requestAnimationFrame(frame)
    }
    size()
    requestAnimationFrame(frame)
    window.addEventListener("resize", size)
    return () => { stopped = true; window.removeEventListener("resize", size) }
  }, [reduced])

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <canvas ref={cv} className="absolute inset-0 w-full h-full block" />
      {/* static gradient fallback: visible while the shader loads or when reduced */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${ok && !reduced ? "opacity-0" : "opacity-100"}`}
        style={{ background: "radial-gradient(ellipse 46% 42% at 68% 34%, rgba(255,107,26,.10), transparent 68%), radial-gradient(ellipse 60% 50% at 30% 72%, rgba(240,220,195,.20), transparent 70%), var(--color-cream)" }} />
    </div>
  )
}