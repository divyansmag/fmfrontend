import React from 'react';
import { X, CreditCard, ShieldCheck } from 'lucide-react';
import parentAvatar from '../../assets/avatars/parent.png';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  parentId?: string;
}

export const ParentIdModal: React.FC<Props> = ({ isOpen, onClose, parentId = 'PRN-8092-FM' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#18181b] rounded-2xl max-w-md w-full p-6 border border-gray-200 dark:border-[#27272f] shadow-2xl transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#27272f] pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-[#0d52ce]" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Digital Parent ID</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Digital ID Card Display */}
        <div className="bg-gradient-to-br from-[#0d52ce] to-[#1e40af] text-white rounded-2xl p-6 shadow-md relative overflow-hidden mb-4">
          {/* Background Decorative Circles */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-sm pointer-events-none" />
          <div className="absolute right-12 top-4 w-16 h-16 rounded-full bg-white/10 blur-xs pointer-events-none" />

          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-blue-200 uppercase block">FUTUREMINDS AI</span>
              <span className="text-xs font-semibold text-white/90">Official Parent Pass</span>
            </div>
            <ShieldCheck className="w-6 h-6 text-blue-200" />
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/80 flex-shrink-0">
              <img src={parentAvatar} alt="Priya Sharma" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-white leading-tight">Priya Sharma</h4>
              <p className="text-xs text-blue-100 font-medium">Guardian of Ananya Patel (Grade 8)</p>
            </div>
          </div>

          <div className="flex justify-between items-end border-t border-white/20 pt-3 text-xs">
            <div>
              <span className="text-[10px] text-blue-200 block uppercase">PARENT ID</span>
              <span className="font-mono font-bold tracking-wider text-sm">{parentId}</span>
            </div>
            <div>
              <span className="text-[10px] text-blue-200 block uppercase">STATUS</span>
              <span className="font-bold text-emerald-300">Verified Active</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#0d52ce] hover:bg-[#0b43aa] text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Close ID Card
          </button>
        </div>
      </div>
    </div>
  );
};
