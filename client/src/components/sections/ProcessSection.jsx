import React, { useState, useRef, useEffect } from "react";
import Modal from "../ui/Modal";
import ProcessCard from "./ProcessCard";
import {
  FiClipboard,
  FiMapPin,
  FiZap,
  FiFileText,
  FiLayers,
  FiShield,
  FiTool,
  FiSearch,
  FiAward
} from 'react-icons/fi';

const steps = [
  { Icon: FiClipboard, title: "Client Brief", short: "Understanding requirements", desc: "We understand client requirements, project goals, budget planning, and design expectations before starting the construction process." },
  { Icon: FiMapPin, title: "Site Analysis", short: "Feasibility & evaluation", desc: "We analyze site conditions, feasibility, land measurements, and environmental factors before planning." },
  { Icon: FiZap, title: "Concept Design", short: "Initial layouts", desc: "Initial layouts and architectural concepts are designed based on client requirements and space planning." },
  { Icon: FiFileText, title: "Detailed Design", short: "Final drawings", desc: "Detailed drawings, floor plans, elevations, and technical specifications are prepared for execution." },
  { Icon: FiLayers, title: "Structural Planning", short: "Engineering design", desc: "Engineering calculations and structural planning ensure safety, strength, and durability." },
  { Icon: FiShield, title: "Approval", short: "Legal approvals", desc: "Legal permissions, approvals, and required documentation are completed before construction begins." },
  { Icon: FiTool, title: "Execution", short: "Construction begins", desc: "Construction activities begin using quality materials, modern methods, and skilled execution." },
  { Icon: FiSearch, title: "Inspection", short: "Quality checks", desc: "Regular quality inspections and safety checks are conducted throughout the project." },
  { Icon: FiAward, title: "Completion", short: "Project handover", desc: "The completed project is finalized, inspected, and successfully handed over to the client." },
];

function ProcessSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: "", desc: "" });

  function openProcessPopup(title, desc) {
    setModalData({ title, desc });
    setModalOpen(true);
  }

  const sectionRef = useRef(null);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) el.classList.add('pw-inview');
      });
    }, { threshold: 0.18 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <section className="how-we-work" ref={sectionRef}>
        <div className="process-head">
          <div className="process-subtitle">OUR PROCESS</div>
          <h2 className="process-main">How We <span className="gold">Work</span></h2>
          <div className="process-divider"><div className="proc-line" /><div className="proc-diamond">◆</div><div className="proc-line" /></div>
          <p className="process-lead">From vision to reality, crafted with precision.</p>
        </div>

        <div className="process-grid" role="list">
          {/* Top row: first 6 */}
            <div className="process-top" aria-hidden={false}>
                {(() => {
                  const approval = steps.find(s => /approv/i.test(s.title));
                  let topSix = steps.slice(0,6);
                  if (approval) {
                    const structIndexInTop = topSix.findIndex(s => /structur/i.test(s.title));
                    const approvalIndexInTop = topSix.findIndex(s => /approv/i.test(s.title));
                    if (structIndexInTop !== -1) {
                      if (approvalIndexInTop === -1) {
                        topSix.splice(structIndexInTop + 1, 0, approval);
                        topSix = topSix.slice(0,6);
                      } else if (approvalIndexInTop !== structIndexInTop + 1) {
                        topSix.splice(approvalIndexInTop, 1);
                        topSix.splice(structIndexInTop + 1, 0, approval);
                      }
                    }
                  }
                  return topSix.map((s, i) => (
                    <ProcessCard
                      key={s.title}
                      Icon={s.Icon}
                      title={s.title}
                      short={s.short}
                      onClick={() => openProcessPopup(s.title, s.desc)}
                      style={{ transitionDelay: `${i * 80}ms` }}
                      tabIndex={0}
                    />
                  ));
                })()}
              </div>

              <div style={{ flexBasis: '100%', height: 28 }} aria-hidden />

            <div className="process-bottom" aria-hidden={false}>
              {steps.slice(6).map((s, j) => (
                <ProcessCard
                  key={s.title}
                  Icon={s.Icon}
                  title={s.title}
                  short={s.short}
                  onClick={() => openProcessPopup(s.title, s.desc)}
                  style={{ transitionDelay: `${j * 80}ms` }}
                  tabIndex={0}
                />
              ))}
            </div>

          </div>

      </section>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h3>{modalData.title}</h3>
        <p>{modalData.desc}</p>
      </Modal>
    </>
  );
}

export default ProcessSection;
