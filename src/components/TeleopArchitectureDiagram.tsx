/** Teleoperation system architecture: operator-side VR ↔ integrated interface ↔ remote-site drivers & hardware. */
export default function TeleopArchitectureDiagram() {
  return (
    <div className="teleop-arch" role="img" aria-label="System architecture: the operator's VR headset connects through an integrated interface to arm, hand, and gimbal drivers on the remote site. The camera streams video directly back to the headset; the integrated interface initializes that connection.">

      {/* Operator side */}
      <div className="teleop-arch-zone teleop-arch-operator">
        <span className="teleop-arch-zone-label">Operator Side</span>
        <div className="teleop-arch-node teleop-arch-vr">
          <span className="teleop-arch-label">VR Headset</span>
          <span className="teleop-arch-detail">Motion input & live video display</span>
        </div>
      </div>

      {/* VR → Interface link */}
      <div className="teleop-arch-link" aria-hidden="true">
        <span className="teleop-arch-arrow" />
        <span className="teleop-arch-flow">Pose data</span>
      </div>

      {/* Integrated interface — centerpiece */}
      <div className="teleop-arch-node teleop-arch-interface">
        <span className="teleop-arch-label">Integrated Interface</span>
        <span className="teleop-arch-detail">Unified control layer</span>
      </div>

      {/* Interface → Drivers fan-out */}
      <div className="teleop-arch-fanout" aria-hidden="true">
        <div className="teleop-arch-fanout-branch">
          <span className="teleop-arch-arrow" />
          <span className="teleop-arch-flow">Arm driver</span>
        </div>
        <div className="teleop-arch-fanout-branch">
          <span className="teleop-arch-arrow" />
          <span className="teleop-arch-flow">Hand driver</span>
        </div>
        <div className="teleop-arch-fanout-branch">
          <span className="teleop-arch-arrow" />
          <span className="teleop-arch-flow">Gimbal driver</span>
        </div>
      </div>

      {/* Remote site */}
      <div className="teleop-arch-zone teleop-arch-remote">
        <span className="teleop-arch-zone-label">Remote Site</span>
        <div className="teleop-arch-node teleop-arch-hw">
          <span className="teleop-arch-label">2 Robot Arms</span>
        </div>
        <div className="teleop-arch-node teleop-arch-hw">
          <span className="teleop-arch-label">2 Dexterous Hands</span>
        </div>
        <div className="teleop-arch-node teleop-arch-hw teleop-arch-camera">
          <span className="teleop-arch-label">Camera Gimbal</span>
          <span className="teleop-arch-detail">Head-tracked pan / tilt</span>
        </div>
      </div>

      {/* Video return path: camera → VR (direct stream, initialized by interface) */}
      <div className="teleop-arch-return" aria-hidden="true">
        <span className="teleop-arch-return-line" />
        <span className="teleop-arch-return-label">Video stream (direct · initialized by interface)</span>
      </div>
    </div>
  )
}
