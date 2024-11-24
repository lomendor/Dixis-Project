import React, { Profiler, ProfilerOnRenderCallback } from 'react';

interface ComponentProfilerProps {
  id: string;
  children: React.ReactNode;
}

export function ComponentProfiler({ id, children }: ComponentProfilerProps) {
  const onRender: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    // Log only slow renders (> 16ms)
    if (actualDuration > 16) {
      console.log(`[Profiler] ${id}:
        Phase: ${phase}
        Actual Duration: ${actualDuration.toFixed(2)}ms
        Base Duration: ${baseDuration.toFixed(2)}ms
        Start Time: ${startTime.toFixed(2)}ms
        Commit Time: ${commitTime.toFixed(2)}ms
      `);
    }
  };

  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  );
}