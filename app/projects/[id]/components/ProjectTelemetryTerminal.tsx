/**
 * PURPOSE:
 * Renders a terminal-like circuit telemetry container displaying details of the project's systems,
 * nodes, and deployment statuses.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/projects/[id]/SingleProjectClient.tsx' to simplify the architecture presentation block.
 *
 * INPUTS / PARAMETERS:
 * - projectTitle (string | null, Required): Title of the showcase project.
 * - groupName (string | null, Required): Name of the student group/team.
 * - memberCount (number, Required): The total number of active member nodes.
 */

'use client'

interface ProjectTelemetryTerminalProps {
  projectTitle: string | null
  groupName: string | null
  memberCount: number
}

export default function ProjectTelemetryTerminal({
  projectTitle,
  groupName,
  memberCount,
}: ProjectTelemetryTerminalProps) {
  /**
   * BEHAVIORAL MECHANISM:
   * The component renders a styled dark container with monospace lettering. It prints simulated
   * diagnostic messages (such as SYSTEM_BOOT, NODE_ARRAY, TEAM_IDENT, and NODE_COUNT) by
   * transforming the raw properties into uppercase alphanumeric strings.
   *
   * PARAMETERS:
   * - props (ProjectTelemetryTerminalProps): Properties representing project, team, and member details.
   *
   * RETURNS:
   * - React.JSX.Element: The rendered terminal log box.
   */
  const cleanTitle = (projectTitle ?? 'UNTITLED').toUpperCase().replace(/[^A-Z0-9]/g, '_')
  const cleanGroup = (groupName ?? 'UNKNOWN').toUpperCase().replace(/[^A-Z0-9]/g, '_')

  return (
    <div className="bg-[#100e0d] border border-white/5 rounded-sm p-4 font-mono text-[9px] text-[#00e0b3] leading-relaxed flex flex-col gap-1.5 mb-4 select-none">
      <div>[SYSTEM_BOOT] initializing architecture definition...</div>
      <div>[NODE_ARRAY] {cleanTitle}</div>
      <div>[TEAM_IDENT] {cleanGroup}</div>
      <div>[NODE_COUNT] {memberCount} active contributor nodes</div>
      <div>[STATUS] PROJECT_ARCHIVE_VERIFIED_STABLE</div>
    </div>
  )
}
