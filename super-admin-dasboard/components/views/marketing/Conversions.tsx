"use client";

import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer } from "recharts";

const funnelData = [
  { name: "Page Visits", value: 37700, fill: "#00ffcc" },
  { name: "Challenge Page View", value: 18200, fill: "#00d4a8" },
  { name: "Registration Started", value: 8400, fill: "#00b894" },
  { name: "Payment Initiated", value: 4200, fill: "#ffbc7c" },
  { name: "Purchased", value: 2085, fill: "#ff6b6b" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card rounded-xl p-3 text-xs">
        <p className="text-white font-semibold">{payload[0]?.payload?.name}</p>
        <p className="text-[#00ffcc]">{payload[0]?.value?.toLocaleString()} users</p>
      </div>
    );
  }
  return null;
};

export default function ConversionsView() {
  return (
    <div className="page-fade space-y-5">
      <div>
        <h1 className="text-2xl font-bold font-display text-white">Conversion Funnel</h1>
        <p className="text-sm text-[#b9cbc2]/70 mt-0.5">Step-by-step visitor-to-customer conversion analysis.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Overall Conv. Rate", value: "5.53%", color: "text-[#00ffcc]" },
          { label: "Purchases (Week)", value: "2,085", color: "text-white" },
          { label: "Avg Order Value", value: "$285", color: "text-[#ffbc7c]" },
          { label: "Revenue Generated", value: "$594K", color: "text-[#00ffcc]" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <p className="text-[10px] tracking-widest text-[#b9cbc2]/50 uppercase mb-1">{s.label}</p>
            <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-sm font-semibold font-display text-white mb-4">Funnel Visualization</h2>
          <ResponsiveContainer width="100%" height={280}>
            <FunnelChart>
              <Tooltip content={<CustomTooltip />} />
              <Funnel dataKey="value" data={funnelData} isAnimationActive>
                <LabelList position="right" fill="#b9cbc2" stroke="none" dataKey="name" style={{ fontSize: 11 }} />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h2 className="text-sm font-semibold font-display text-white mb-4">Step-by-Step Drop-off</h2>
          <div className="space-y-3">
            {funnelData.map((step, i) => {
              const dropoff = i > 0 ? (((funnelData[i - 1].value - step.value) / funnelData[i - 1].value) * 100).toFixed(1) : null;
              return (
                <div key={step.name} className="p-3 rounded-xl bg-[#0b2f2d]/30 border border-[rgba(0,255,204,0.06)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-white">{step.name}</span>
                    <span className="text-sm font-bold font-display text-white">{step.value.toLocaleString()}</span>
                  </div>
                  {dropoff && (
                    <p className="text-[10px] text-[#ff6b6b]">-{dropoff}% drop from previous step</p>
                  )}
                  <div className="mt-1.5 h-1 bg-[#0b2f2d] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(step.value / funnelData[0].value) * 100}%`, background: step.fill }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
