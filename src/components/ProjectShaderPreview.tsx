import { useEffect, useRef, useState } from "react"
import { useIsPresent, useReducedMotion } from "framer-motion"
import sources from "@/lib/legacy-shader-sources"

const vertex = "#version 300 es\nin vec2 a_pos;void main(){gl_Position=vec4(a_pos,0.,1.);}"
const preamble = `#version 300 es
precision highp float;
precision highp int;
out vec4 outFragColor;
uniform vec3 iResolution;
uniform float iTime, iTimeDelta, iSampleRate;
uniform int iFrame;
uniform vec4 iMouse, iDate;
uniform vec3 iChannelResolution[4];
uniform float iChannelTime[4];
`

export default function ProjectShaderPreview({ shaderId }: { shaderId: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const present = useIsPresent()
  const [playing, setPlaying] = useState(!reduced)
  const [error, setError] = useState(false)
  const update = useRef<() => void>(() => {})
  const motion = useRef({ playing, present })
  const source = sources[shaderId]

  useEffect(() => { if (reduced) setPlaying(false) }, [reduced])
  useEffect(() => { motion.current = { playing, present }; update.current() }, [playing, present])
  useEffect(() => {
    const element = canvas.current
    if (!element || !source) return
    const gl = element.getContext("webgl2", { antialias: false, premultipliedAlpha: false })
    if (!gl) { setError(true); return }
    const shaders: WebGLShader[] = []
    const compile = (type: number, body: string) => {
      const shader = gl.createShader(type)
      if (!shader) throw new Error("Shader unavailable")
      shaders.push(shader)
      gl.shaderSource(shader, body); gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error("Shader compilation failed")
      return shader
    }
    const program = gl.createProgram()
    if (!program) { setError(true); return }
    try {
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex))
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, preamble + source.code + "\nvoid main(){vec4 c=vec4(0.);mainImage(c,gl_FragCoord.xy);outFragColor=c;}"))
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Shader linking failed")
    } catch {
      shaders.forEach(shader => gl.deleteShader(shader)); gl.deleteProgram(program); setError(true); return
    }
    shaders.forEach(shader => gl.deleteShader(shader))
    const vao = gl.createVertexArray(), buffer = gl.createBuffer()
    gl.bindVertexArray(vao); gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, "a_pos")
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    const uniform = (name: string) => gl.getUniformLocation(program, name)
    const u = { resolution: uniform("iResolution"), time: uniform("iTime"), delta: uniform("iTimeDelta"), frame: uniform("iFrame"), mouse: uniform("iMouse"), date: uniform("iDate") }
    let raf = 0, elapsed = 0, previous = 0, frame = 0, visible = false
    const mouse = [0, 0, 0, 0]
    const draw = (delta = 0) => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      const width = Math.max(1, Math.round(element.clientWidth * dpr)), height = Math.max(1, Math.round(element.clientHeight * dpr))
      if (element.width !== width || element.height !== height) { element.width = width; element.height = height }
      gl.viewport(0, 0, width, height); gl.useProgram(program); gl.bindVertexArray(vao)
      gl.uniform3f(u.resolution, width, height, 1); gl.uniform1f(u.time, elapsed); gl.uniform1f(u.delta, delta); gl.uniform1i(u.frame, frame++)
      gl.uniform4f(u.mouse, mouse[0]!, mouse[1]!, mouse[2]!, mouse[3]!)
      const date = new Date()
      gl.uniform4f(u.date, date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds())
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    const shouldRun = () => visible && !document.hidden && motion.current.playing && motion.current.present
    const tick = (now: number) => {
      raf = 0
      if (!shouldRun()) return
      const delta = previous ? Math.min((now - previous) / 1000, .1) : 0
      previous = now; elapsed += delta; draw(delta); raf = requestAnimationFrame(tick)
    }
    const sync = () => {
      if (!shouldRun()) { cancelAnimationFrame(raf); raf = 0; previous = 0 }
      else if (!raf) raf = requestAnimationFrame(tick)
    }
    update.current = sync
    const observer = new IntersectionObserver(([entry]) => { visible = !!entry?.isIntersecting; sync() }, { threshold: .1 })
    observer.observe(element)
    const resize = new ResizeObserver(() => draw())
    resize.observe(element)
    const pointer = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect(), ratio = element.width / rect.width
      mouse[0] = (event.clientX - rect.left) * ratio; mouse[1] = (rect.bottom - event.clientY) * ratio
      if (event.buttons) { mouse[2] = mouse[0]; mouse[3] = mouse[1] }
      if (!motion.current.playing) draw()
    }
    element.addEventListener("pointermove", pointer)
    document.addEventListener("visibilitychange", sync)
    draw()
    return () => {
      cancelAnimationFrame(raf); observer.disconnect(); resize.disconnect(); update.current = () => {}
      document.removeEventListener("visibilitychange", sync); element.removeEventListener("pointermove", pointer)
      gl.deleteBuffer(buffer); gl.deleteVertexArray(vao); gl.deleteProgram(program)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    }
  }, [source])

  return <div className="archive-shader">
    {error ? <p className="archive-shader-error" role="status">Live preview unavailable. Use the ShaderToy link below to view this study.</p> : <>
      <canvas ref={canvas} aria-label={source?.name ?? shaderId} role="img" />
      <button type="button" onClick={() => setPlaying(value => !value)}>{playing ? "Pause animation" : "Play animation"}</button>
    </>}
  </div>
}
