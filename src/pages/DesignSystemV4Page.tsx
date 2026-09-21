import { useMemo, useState } from "react"
import { ReactFlowProvider } from "@xyflow/react"
import { FlowChart, layoutFlow } from "@/components/design-system"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Info, Play, RefreshCw, Sparkles, ChevronsUpDown } from "lucide-react"
import "@/design-system.css"

const tokens = [
  { name: "background", hex: "#fbf7f1", role: "page ground" },
  { name: "card", hex: "#fffdf9", role: "surface" },
  { name: "primary", hex: "#ff6b1a", role: "accent, buttons, focus" },
  { name: "secondary", hex: "#f5efe6", role: "subtle background" },
  { name: "muted", hex: "#f3f1ec", role: "muted surface" },
  { name: "foreground", hex: "#1a1714", role: "ink" },
  { name: "muted-foreground", hex: "#75716a", role: "secondary text" },
  { name: "border", hex: "#ded8cf", role: "hairlines" },
]

/* layoutFlow assigns columns, centres source groups on their shared target,
   and spawns exactly one anchor per connection. side-branch nodes pin to
   their parent's column via `column`. */
function makeMotionGraph() {
  return layoutFlow(
    [
      { id: "a", data: { kicker: "input", title: "brief", meta: "ready", delay: 80 } },
      { id: "b", data: { kicker: "runtime", title: "planner", meta: "builds route", kind: "hub", delay: 360 } },
      { id: "c", data: { kicker: "output", title: "render", meta: "in progress", kind: "machine", delay: 660 } },
      { id: "d", column: 1, data: { kicker: "external", title: "handoff", meta: "reference endpoint", kind: "external", delay: 960 } },
    ],
    [
      { id: "ab", source: "a", target: "b", data: { label: "queue", delay: 520 } },
      { id: "bc", source: "b", target: "c", data: { label: "route", delay: 820 } },
      { id: "bd", source: "b", target: "d", data: { label: "delegate", delay: 1120 } },
      { id: "dc", source: "d", target: "c", data: { label: "reference", kind: "callout", delay: 1320 } },
    ],
    { columnPitch: 230, centerIn: { width: 1132, height: 480 } },
  )
}

function makeArchGraph() {
  return layoutFlow(
    [
      { id: "keycloak", data: { kicker: "identity", title: "keycloak", meta: "auth and permissions" } },
      { id: "backend", data: { kicker: "service", title: "robot service", meta: "tasks and telemetry" } },
      { id: "hub", data: { kicker: "runtime hub", title: "robot context", meta: "pose and joint state", kind: "hub" } },
      { id: "scene", column: 1, data: { kicker: "visualization", title: "robot scene", meta: "model and overlays" } },
      { id: "r044", data: { kicker: "robot computer", title: "store robot", meta: "deployment target", kind: "machine" } },
      { id: "store", data: { kicker: "boundary", title: "store network", meta: "reference endpoint", kind: "external" } },
    ],
    [
      { id: "keycloak-hub", source: "keycloak", target: "hub" },
      { id: "backend-hub", source: "backend", target: "hub", data: { label: "tasks + telemetry" } },
      { id: "hub-r044", source: "hub", target: "r044", data: { label: "deploy" } },
      { id: "hub-scene", source: "hub", target: "scene" },
      { id: "scene-r044", source: "scene", target: "r044", data: { kind: "boundary" } },
    ],
    { columnPitch: 280 },
  )
}

type MotionLayerId = "edges" | "anchors" | "nodes" | "labels" | "arrows" | "panzoom" | "dots" | "minimap" | "controls"

const MOTION_LAYERS: { id: MotionLayerId; label: string }[] = [
  { id: "edges", label: "edges" },
  { id: "anchors", label: "anchors" },
  { id: "nodes", label: "nodes" },
  { id: "labels", label: "labels" },
  { id: "arrows", label: "arrows" },
  { id: "panzoom", label: "pan / zoom" },
  { id: "dots", label: "dot grid" },
  { id: "minimap", label: "minimap" },
  { id: "controls", label: "controls" },
]

export default function DesignSystemV4Page() {
  const [motionKey, setMotionKey] = useState(0)
  const motionGraph = useMemo(() => makeMotionGraph(), [motionKey])
  const archGraph = useMemo(() => makeArchGraph(), [])
  const [layers, setLayers] = useState<MotionLayerId[]>(["edges", "anchors", "dots", "minimap", "controls"])
  const hasLayer = (l: MotionLayerId) => layers.includes(l)

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background" style={{ fontFamily: '"Archivo", sans-serif' }}>
        <div className="mx-auto max-w-[1180px] px-6">

          {/* ======== TOKENS ======== */}
          <section className="py-14 border-t border-border">
            <div className="grid grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] gap-8 items-start mb-8">
              <h2 className="text-[clamp(30px,4vw,54px)] font-extrabold leading-[0.98] tracking-[-0.045em] m-0 text-foreground">design tokens</h2>
              <p className="text-muted-foreground text-[15px] leading-relaxed m-0">shadcn semantic tokens mapped to the portfolio&apos;s warm palette. <code>--primary</code> is orange, surfaces are cream and paper.</p>
            </div>
            <div className="grid grid-cols-4 gap-3.5">
              {tokens.map(t => (
                <Tooltip key={t.name}>
                  <TooltipTrigger className="block">
                    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                      <div className="h-[72px]" style={{ background: t.hex }} />
                      <CardContent className="p-3">
                        <p className="text-[13px] font-bold text-foreground">--{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>{t.hex}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </section>

          {/* ======== COMPONENT LIBRARY ======== */}
          <section className="py-14 border-t border-border">
            <div className="grid grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] gap-8 items-start mb-8">
              <h2 className="text-[clamp(30px,4vw,54px)] font-extrabold leading-[0.98] tracking-[-0.045em] m-0 text-foreground">component library</h2>
              <div>
                <Badge variant="secondary"><Sparkles className="size-3" data-icon="inline-start" />shadcn/ui</Badge>
                <p className="text-muted-foreground text-[15px] leading-relaxed m-0 mt-2">built-in variants, semantic colors, accessible by default. compose with shadcn&apos;s Card + Button + Badge + Alert primitives.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3.5">
              {/* buttons */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">buttons</CardTitle>
                  <CardDescription><code>variant</code> + <code>size</code> props cover primary, outline, ghost, icon.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2 items-center">
                  <Button>open project</Button>
                  <Button variant="outline">view notes</Button>
                  <Button variant="ghost" size="icon"><RefreshCw className="size-4" /></Button>
                </CardContent>
              </Card>

              {/* tabs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">tabs</CardTitle>
                  <CardDescription>peer views inside one panel. selected state is automatic.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview">
                    <TabsList>
                      <TabsTrigger value="overview">overview</TabsTrigger>
                      <TabsTrigger value="system">system</TabsTrigger>
                      <TabsTrigger value="media">media</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>

              {/* input */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">input</CardTitle>
                  <CardDescription>semantic border and ring. focus ring is orange.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Input defaultValue="robotics" placeholder="filter projects" />
                </CardContent>
              </Card>

              {/* toggle group */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">toggle group</CardTitle>
                  <CardDescription>exclusive or multi-select between 2-5 options. <code>ToggleGroup</code> not manual <code>Button</code> loop.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ToggleGroup>
                    <ToggleGroupItem value="grid">grid</ToggleGroupItem>
                    <ToggleGroupItem value="list">list</ToggleGroupItem>
                    <ToggleGroupItem value="board">board</ToggleGroupItem>
                  </ToggleGroup>
                </CardContent>
              </Card>

              {/* accordion */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">accordion</CardTitle>
                  <CardDescription>expandable steps. replaces hand-rolled timeline divs.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion>
                    <AccordionItem value="map">
                      <AccordionTrigger className="text-sm">map the system</AccordionTrigger>
                      <AccordionContent className="text-[13px] text-muted-foreground">name the real surfaces and states before adding styling.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="wire">
                      <AccordionTrigger className="text-sm">wire the component</AccordionTrigger>
                      <AccordionContent className="text-[13px] text-muted-foreground">connect it to shared tokens before adding variants.</AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* status + loading */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">status &amp; loading</CardTitle>
                  <CardDescription><code>Alert</code> for messages, <code>Skeleton</code> for loading, <code>Progress</code> for steps.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Alert>
                    <Info className="size-4" />
                    <AlertTitle>design note</AlertTitle>
                    <AlertDescription>status uses words and placement, not color alone.</AlertDescription>
                  </Alert>
                  <Progress value={66} />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            </div>

            <Separator className="my-8" />

            {/* badges + tooltips row */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">badges:</span>
              <Badge>react</Badge>
              <Badge variant="secondary">three.js</Badge>
              <Badge variant="outline">robotics</Badge>
              <Tooltip>
                <TooltipTrigger className="inline-flex"><Badge variant="destructive">deprecated</Badge></TooltipTrigger>
                <TooltipContent>use <code>Tooltip</code> to explain badges</TooltipContent>
              </Tooltip>
            </div>

            {/* collapsible demo */}
            <Collapsible className="mt-6">
              <CollapsibleTrigger className="w-full">
                <Button variant="outline" className="w-full justify-between">
                  advanced patterns (collapsible)
                  <ChevronsUpDown className="size-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <Card>
                  <CardContent className="p-4 text-sm text-muted-foreground">
                    <code>Collapsible</code> wraps content that can be hidden. combine with <code>Card</code> for expandable detail sections. this replaces hand-rolled <code>useState</code> + conditional rendering.
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </section>

          {/* ======== CHART MOTION ======== */}
          <section className="py-14 border-t border-border">
            <div className="grid grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] gap-8 items-start mb-8">
              <h2 className="text-[clamp(30px,4vw,54px)] font-extrabold leading-[0.98] tracking-[-0.045em] m-0 text-foreground">chart motion</h2>
              <div>
                <Badge variant="secondary"><Sparkles className="size-3" data-icon="inline-start" />@xyflow/react</Badge>
                <p className="text-muted-foreground text-[15px] leading-relaxed m-0 mt-2">nodes pop in with spring physics, edges draw after endpoints appear. anchors spawn one per connection — a vertical group of sources is centred on its shared target. replay to see the staggered choreography, or toggle the layer switches to inspect each element.</p>
                <Button className="mt-3.5" onClick={() => setMotionKey(k => k + 1)}>
                  <Play className="size-4" data-icon="inline-start" /> replay animation
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="flex flex-wrap items-center gap-1.5 border-b border-border px-4 py-3">
                  <span className="text-xs text-muted-foreground mr-1.5">layers</span>
                  <ToggleGroup
                    variant="outline"
                    size="sm"
                    spacing={1}
                    value={layers}
                    onValueChange={(v) => setLayers(v as MotionLayerId[])}
                  >
                    {MOTION_LAYERS.map(l => (
                      <ToggleGroupItem key={l.id} value={l.id}>{l.label}</ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
                <ReactFlowProvider key={motionKey}>
                  <FlowChart
                    initialNodes={motionGraph.nodes}
                    initialEdges={motionGraph.edges}
                    animate
                    hideNodes={!hasLayer("nodes")}
                    hideEdges={!hasLayer("edges")}
                    showAnchors={hasLayer("anchors")}
                    showLabels={hasLayer("labels")}
                    showArrows={hasLayer("arrows")}
                    panZoom={hasLayer("panzoom")}
                    showBackground={hasLayer("dots")}
                    showMiniMap={hasLayer("minimap")}
                    showControls={hasLayer("controls")}
                  />
                </ReactFlowProvider>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-3 mt-4.5">
              {[
                { seq: "01", title: "orient", body: "the starting node enters first, anchoring the reader before any edge appears." },
                { seq: "02", title: "connect", body: "edges draw only after both related surfaces are visible, following the natural flow." },
                { seq: "03", title: "annotate", body: "notes enter last, with a small pop — they explain rather than define the structure." },
              ].map(n => (
                <Card key={n.seq}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2.5">
                      <Badge>{n.seq}</Badge>
                      <CardTitle className="text-[13px] tracking-wider uppercase text-muted-foreground">{n.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[13px] text-muted-foreground leading-relaxed m-0">{n.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Alert className="mt-3">
              <Info className="size-4" />
              <AlertTitle>timing</AlertTitle>
              <AlertDescription className="font-mono text-xs leading-7">
                80–140 ms between items &nbsp;·&nbsp; 420–720 ms per pop &nbsp;·&nbsp; no looping unless live
              </AlertDescription>
            </Alert>
          </section>

          {/* ======== ARCHITECTURE DIAGRAM ======== */}
          <section className="py-14 border-t border-border">
            <div className="grid grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] gap-8 items-start mb-8">
              <h2 className="text-[clamp(30px,4vw,54px)] font-extrabold leading-[0.98] tracking-[-0.045em] m-0 text-foreground">architecture diagram</h2>
              <div>
                <Badge variant="secondary">auto layout, same components</Badge>
                <p className="text-muted-foreground text-[15px] leading-relaxed m-0 mt-2">the cloud-to-robot system laid out by <code>layoutFlow</code> — columns follow flow depth, each source group centres on its target, side branches pin to their parent&apos;s column.</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary inline-block" />
                  cloud to deployed robot
                </CardTitle>
                <CardDescription>identity, robot data, operator controls, and store endpoints in one traceable view.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ReactFlowProvider>
                  <FlowChart initialNodes={archGraph.nodes} initialEdges={archGraph.edges} fitView />
                </ReactFlowProvider>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">one component system, one node language, one edge vocabulary.</p>
              </CardFooter>
            </Card>
          </section>

          {/* ======== MOTION PRIMITIVES ======== */}
          <section className="py-14 border-t border-border">
            <div className="grid grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] gap-8 items-start mb-8">
              <h2 className="text-[clamp(30px,4vw,54px)] font-extrabold leading-[0.98] tracking-[-0.045em] m-0 text-foreground">motion primitives</h2>
              <p className="text-muted-foreground text-[15px] leading-relaxed m-0">three CSS keyframes. no JS library needed. all respect <code>prefers-reduced-motion</code>.</p>
            </div>

            <div className="grid grid-cols-3 gap-3.5">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">node pop</CardTitle>
                  <CardDescription><code>.ds-anim-node</code> — spring scale + translateY. set <code>--delay</code> in ms.</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-[11px] font-mono text-muted-foreground leading-relaxed whitespace-pre-wrap">
{`@keyframes ds-node-pop {
  0%   { opacity:0; scale:0.86 }
  58%  { opacity:1; scale:1.045 }
  100% { opacity:1; scale:1 }
}`}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">edge draw</CardTitle>
                  <CardDescription><code>.ds-anim-edge</code> — stroke-dashoffset reveal. set <code>--edge-len</code>.</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-[11px] font-mono text-muted-foreground leading-relaxed whitespace-pre-wrap">
{`@keyframes ds-edge-draw {
  from { stroke-dashoffset: var(--edge-len) }
  to   { stroke-dashoffset: 0 }
}`}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">fade up</CardTitle>
                  <CardDescription><code>.ds-anim-fade</code> — opacity + translateY. 560ms ease.</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-[11px] font-mono text-muted-foreground leading-relaxed whitespace-pre-wrap">
{`@keyframes ds-fade-up {
  from { opacity:0; translateY:14px }
  to   { opacity:1; translateY:0 }
}`}
                  </pre>
                </CardContent>
              </Card>
            </div>

            <Alert className="mt-4.5">
              <Info className="size-4" />
              <AlertTitle>reduced motion</AlertTitle>
              <AlertDescription>all primitives gate behind <code className="font-mono">@media (prefers-reduced-motion: reduce)</code>. elements appear immediately at final position when active.</AlertDescription>
            </Alert>
          </section>

          {/* ======== USAGE ======== */}
          <section className="py-14 border-t border-border mb-20">
            <div className="grid grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] gap-8 items-start mb-8">
              <h2 className="text-[clamp(30px,4vw,54px)] font-extrabold leading-[0.98] tracking-[-0.045em] m-0 text-foreground">how to use</h2>
              <p className="text-muted-foreground text-[15px] leading-relaxed m-0">import styles once, compose graphs with typed React Flow nodes + shadcn chrome.</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <pre className="text-xs font-mono leading-[1.9] whitespace-pre overflow-x-auto text-foreground">
{`// 1. styles (once, in main.tsx)
import "@/design-system.css"

// 2. compose
import { ReactFlowProvider } from "@xyflow/react"
import { FlowChart, layoutFlow } from "@/components/design-system"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// 3. typed specs — no positions, no handle ids
//    layoutFlow assigns columns (longest-path depth), centres each
//    source group on its shared target, and spawns one anchor per
//    connection. pin side branches to their parent's column.
const { nodes, edges } = layoutFlow(
  [
    { id: "a", data: { kicker: "input", title: "start" } },
    { id: "b", data: { kicker: "runtime", title: "planner" } },
    { id: "c", column: 1, data: { kicker: "external", title: "handoff" } },
  ],
  [
    { source: "a", target: "b" },
    { source: "b", target: "c" },
  ],
)

// 4. wrap in Card for chrome
<Card>
  <CardHeader><CardTitle>system architecture</CardTitle></CardHeader>
  <CardContent>
    <ReactFlowProvider>
      <FlowChart initialNodes={nodes} initialEdges={edges} />
    </ReactFlowProvider>
  </CardContent>
</Card>`}
                </pre>
              </CardContent>
            </Card>
          </section>

        </div>
      </div>
    </TooltipProvider>
  )
}