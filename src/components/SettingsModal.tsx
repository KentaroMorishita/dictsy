import React from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  voices: SpeechSynthesisVoice[];
  selectedVoice: string;
  onVoiceChange: (voiceName: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  voices,
  selectedVoice,
  onVoiceChange,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>
        
        <div className="mb-6">
          <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Voice:
          </label>
          <select
            id="voice-select"
            value={selectedVoice}
            onChange={(e) => onVoiceChange(e.target.value)}
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150 ease-in-out"
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
