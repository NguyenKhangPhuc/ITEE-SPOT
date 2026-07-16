/**
 * PURPOSE:
 * Renders the Professional Module section of the edit user profile interface (02_PROFESSIONAL_MODULE).
 * It includes text fields for Current Company, Job Title, and Company Unit,
 * and dropdown select options for University, Academic Programme, Degree Level, and Graduation Year.
 *
 * CONTEXT/PARENT FILE:
 * Subcomponent of UserProfileClient.tsx, located at 'app/profile/components/ProfessionalModuleSection.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - register (UseFormRegister<ProfileInsert>, Required): react-hook-form register callback.
 * - errors (FieldErrors<ProfileInsert>, Required): react-hook-form validation errors.
 */

'use client'

import { UseFormRegister, FieldErrors } from "react-hook-form"
import { UNIVERSITY, PROGRAMME, DEGREE, YEAR } from "../../types/enum"
import { ProfileInsert } from "../../types/profile"
import { tw } from "@/app/constants/design-tokens"

interface ProfessionalModuleSectionProps {
  register: UseFormRegister<ProfileInsert>
  errors: FieldErrors<ProfileInsert>
}

export default function ProfessionalModuleSection({
  register,
  errors,
}: ProfessionalModuleSectionProps) {
  return (
    <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 flex flex-col gap-5 relative overflow-hidden select-none`}>
      
      {/* Section Header with tag */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e8e1df] uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm text-[#00e0b3]">school</span>
          <span>02_PROFESSIONAL_MODULE</span>
        </div>
        <span className="px-2 py-0.5 border border-[#00e0b3]/20 bg-[#00e0b3]/5 text-[#00e0b3] rounded-sm font-mono text-[7px] font-bold uppercase tracking-widest">
          AFFILIATIONS
        </span>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 select-text">
        
        {/* Current Company */}
        <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
          <label className="text-[8px] font-mono text-[#b9cbc2] uppercase tracking-wider">
            CURRENT COMPANY
          </label>
          <input
            {...register("company_name")}
            type="text"
            placeholder="e.g. TechNova Solutions"
            className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm w-full outline-none focus:border-[#00e0b3]/50 transition-colors"
          />
          {errors.company_name && (
            <span className="text-[8px] font-mono text-red-400 uppercase mt-0.5">
              {errors.company_name.message}
            </span>
          )}
        </div>

        {/* Job Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[8px] font-mono text-[#b9cbc2] uppercase tracking-wider">
            JOB TITLE
          </label>
          <input
            {...register("job_title")}
            type="text"
            placeholder="e.g. Senior Systems Architect"
            className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm w-full outline-none focus:border-[#00e0b3]/50 transition-colors"
          />
          {errors.job_title && (
            <span className="text-[8px] font-mono text-red-400 uppercase mt-0.5">
              {errors.job_title.message}
            </span>
          )}
        </div>

        {/* Company Unit */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[8px] font-mono text-[#b9cbc2] uppercase tracking-wider">
            COMPANY UNIT
          </label>
          <input
            {...register("company_unit")}
            type="text"
            placeholder="e.g. R&D Infrastructure"
            className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm w-full outline-none focus:border-[#00e0b3]/50 transition-colors"
          />
          {errors.company_unit && (
            <span className="text-[8px] font-mono text-red-400 uppercase mt-0.5">
              {errors.company_unit.message}
            </span>
          )}
        </div>

        {/* University (Select) */}
        <div className="flex flex-col gap-1.5 select-none">
          <label className="text-[8px] font-mono text-[#b9cbc2] uppercase tracking-wider">
            UNIVERSITY
          </label>
          <div className="relative">
            <select
              {...register("university")}
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pr-8 rounded-sm w-full outline-none focus:border-[#00e0b3]/50 transition-colors appearance-none"
            >
              <option value="">PICK_AN_OPTION.EXE</option>
              {Object.values(UNIVERSITY).map((uni) => (
                <option key={uni} value={uni}>
                  {uni}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-3 text-xs text-[#83958d] pointer-events-none">
              keyboard_arrow_down
            </span>
          </div>
          {errors.university && (
            <span className="text-[8px] font-mono text-red-400 uppercase mt-0.5">
              {errors.university.message}
            </span>
          )}
        </div>

        {/* Academic Programme (Select) */}
        <div className="flex flex-col gap-1.5 select-none">
          <label className="text-[8px] font-mono text-[#b9cbc2] uppercase tracking-wider">
            ACADEMIC PROGRAMME
          </label>
          <div className="relative">
            <select
              {...register("programme")}
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pr-8 rounded-sm w-full outline-none focus:border-[#00e0b3]/50 transition-colors appearance-none"
            >
              <option value="">PICK_AN_OPTION.EXE</option>
              {Object.values(PROGRAMME).map((prog) => (
                <option key={prog} value={prog}>
                  {prog}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-3 text-xs text-[#83958d] pointer-events-none">
              keyboard_arrow_down
            </span>
          </div>
          {errors.programme && (
            <span className="text-[8px] font-mono text-red-400 uppercase mt-0.5">
              {errors.programme.message}
            </span>
          )}
        </div>

        {/* Degree Level (Select) */}
        <div className="flex flex-col gap-1.5 select-none">
          <label className="text-[8px] font-mono text-[#b9cbc2] uppercase tracking-wider">
            DEGREE LEVEL
          </label>
          <div className="relative">
            <select
              {...register("degree")}
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pr-8 rounded-sm w-full outline-none focus:border-[#00e0b3]/50 transition-colors appearance-none"
            >
              <option value="">PICK_AN_OPTION.EXE</option>
              {Object.values(DEGREE).map((deg) => (
                <option key={deg} value={deg}>
                  {deg}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-3 text-xs text-[#83958d] pointer-events-none">
              keyboard_arrow_down
            </span>
          </div>
          {errors.degree && (
            <span className="text-[8px] font-mono text-red-400 uppercase mt-0.5">
              {errors.degree.message}
            </span>
          )}
        </div>

        {/* Graduation Year (Select) */}
        <div className="flex flex-col gap-1.5 select-none">
          <label className="text-[8px] font-mono text-[#b9cbc2] uppercase tracking-wider">
            GRADUATION YEAR
          </label>
          <div className="relative">
            <select
              {...register("year")}
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pr-8 rounded-sm w-full outline-none focus:border-[#00e0b3]/50 transition-colors appearance-none"
            >
              <option value="">PICK_AN_OPTION.EXE</option>
              {Object.values(YEAR).map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-3 text-xs text-[#83958d] pointer-events-none">
              keyboard_arrow_down
            </span>
          </div>
          {errors.year && (
            <span className="text-[8px] font-mono text-red-400 uppercase mt-0.5">
              {errors.year.message}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
