import React from "react";
import { Doctor } from "../../types";

type DoctorsOnDutyListProps = {
  title: string;
  data: Doctor[];
  isAdmin?: boolean;
  onDoctorStatusChange?: (id: string, status: Doctor["status"]) => void;
};

const DoctorsOnDutyList: React.FC<DoctorsOnDutyListProps> = ({
  title,
  data,
  isAdmin,
  onDoctorStatusChange,
}) => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
      {title}
    </h1>
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-nowrap">
              Doctor Profile
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-nowrap">
              Specialization
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center text-nowrap">
              Availability Status
            </th>
            {isAdmin && (
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center text-nowrap">
                Administrative Action
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {(data || []).map((doctor, index) => {
            const doctorId = (doctor as any)._id || doctor.id;
            return (
              <tr
                key={doctorId || index}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4 font-bold text-slate-800">
                  {doctor.name}
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">
                  {doctor.specialization}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      doctor.status === "On Duty"
                        ? "bg-green-100 text-green-700"
                        : doctor.status === "On Break"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {doctor.status}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-center">
                    <select
                      value={doctor.status}
                      onChange={(event) =>
                        onDoctorStatusChange?.(
                          doctorId,
                          event.target.value as Doctor["status"],
                        )
                      }
                      className="text-[10px] font-bold uppercase bg-slate-100 border-none rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none transition-all cursor-pointer hover:bg-slate-200"
                    >
                      <option value="On Duty">On Duty</option>
                      <option value="On Break">On Break</option>
                      <option value="Off Duty">Off Duty</option>
                    </select>
                  </td>
                )}
              </tr>
            );
          })}
          {!data?.length && (
            <tr>
              <td
                colSpan={isAdmin ? 4 : 3}
                className="p-10 text-center text-slate-400 italic"
              >
                No records found. Use management modules to add data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default DoctorsOnDutyList;
