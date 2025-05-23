import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SettingsModal from './SettingsModal';

// Mock SpeechSynthesisVoice type as it might not be available in JSDOM
interface MockSpeechSynthesisVoice {
  name: string;
  lang: string;
  default: boolean;
  localService: boolean;
  voiceURI: string;
}

const mockVoices: MockSpeechSynthesisVoice[] = [
  { name: "Test Voice 1", lang: "en-US", default: false, localService: true, voiceURI: "test-voice-1" },
  { name: "Test Voice 2", lang: "en-GB", default: false, localService: true, voiceURI: "test-voice-2" },
  { name: "US English Samantha", lang: "en-US", default: true, localService: true, voiceURI: "samantha" },
];

describe('SettingsModal', () => {
  const mockOnClose = jest.fn();
  const mockOnVoiceChange = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    mockOnClose.mockClear();
    mockOnVoiceChange.mockClear();
  });

  test('does not render when isOpen is false', () => {
    render(
      <SettingsModal
        isOpen={false}
        onClose={mockOnClose}
        voices={mockVoices as SpeechSynthesisVoice[]}
        selectedVoice={mockVoices[0].name}
        onVoiceChange={mockOnVoiceChange}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  test('renders correctly when isOpen is true', () => {
    render(
      <SettingsModal
        isOpen={true}
        onClose={mockOnClose}
        voices={mockVoices as SpeechSynthesisVoice[]}
        selectedVoice={mockVoices[0].name}
        onVoiceChange={mockOnVoiceChange}
      />
    );
    // Using 'dialog' role implicitly added by the browser for such structures,
    // or we can add an explicit role="dialog" to the modal container for robustness.
    // For now, let's check for the title, which is a strong indicator.
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByLabelText('Voice:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
  });

  test('populates voice selection dropdown with provided voices', () => {
    render(
      <SettingsModal
        isOpen={true}
        onClose={mockOnClose}
        voices={mockVoices as SpeechSynthesisVoice[]}
        selectedVoice={mockVoices[0].name}
        onVoiceChange={mockOnVoiceChange}
      />
    );
    const voiceSelect = screen.getByLabelText('Voice:') as HTMLSelectElement;
    expect(voiceSelect.options.length).toBe(mockVoices.length);
    mockVoices.forEach((voice, index) => {
      expect(voiceSelect.options[index].value).toBe(voice.name);
      expect(voiceSelect.options[index].text).toBe(`${voice.name} (${voice.lang})`);
    });
  });

  test('shows the correct voice as selected', () => {
    const selectedVoiceName = mockVoices[1].name;
    render(
      <SettingsModal
        isOpen={true}
        onClose={mockOnClose}
        voices={mockVoices as SpeechSynthesisVoice[]}
        selectedVoice={selectedVoiceName}
        onVoiceChange={mockOnVoiceChange}
      />
    );
    const voiceSelect = screen.getByLabelText('Voice:') as HTMLSelectElement;
    expect(voiceSelect.value).toBe(selectedVoiceName);
  });

  test('calls onVoiceChange with the new voice name when selection changes', () => {
    const initialVoice = mockVoices[0].name;
    const newVoiceToSelect = mockVoices[1].name;
    render(
      <SettingsModal
        isOpen={true}
        onClose={mockOnClose}
        voices={mockVoices as SpeechSynthesisVoice[]}
        selectedVoice={initialVoice}
        onVoiceChange={mockOnVoiceChange}
      />
    );
    const voiceSelect = screen.getByLabelText('Voice:');
    fireEvent.change(voiceSelect, { target: { value: newVoiceToSelect } });
    expect(mockOnVoiceChange).toHaveBeenCalledTimes(1);
    expect(mockOnVoiceChange).toHaveBeenCalledWith(newVoiceToSelect);
  });

  test('calls onClose when the "Done" button is clicked', () => {
    render(
      <SettingsModal
        isOpen={true}
        onClose={mockOnClose}
        voices={mockVoices as SpeechSynthesisVoice[]}
        selectedVoice={mockVoices[0].name}
        onVoiceChange={mockOnVoiceChange}
      />
    );
    const doneButton = screen.getByRole('button', { name: 'Done' });
    fireEvent.click(doneButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
