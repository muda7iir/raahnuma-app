export function isSpeechRecognitionSupported(): boolean {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export function isSpeechSynthesisSupported(): boolean {
  return 'speechSynthesis' in window;
}

export function createRecognition(): SpeechRecognition | null {
  if (!isSpeechRecognitionSupported()) return null;
  const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognitionAPI();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  return recognition;
}

export function getVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSynthesisSupported()) return [];
  return window.speechSynthesis.getVoices();
}

export function speak(
  text: string,
  options?: { voiceId?: string; rate?: number; pitch?: number; onEnd?: () => void; onStart?: () => void }
): SpeechSynthesisUtterance | null {
  if (!isSpeechSynthesisSupported()) return null;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = getVoices();
  if (options?.voiceId) {
    const voice = voices.find(v => v.voiceURI === options.voiceId);
    if (voice) utterance.voice = voice;
  }
  utterance.rate = options?.rate ?? 1;
  utterance.pitch = options?.pitch ?? 1;
  if (options?.onEnd) utterance.onend = options.onEnd;
  if (options?.onStart) utterance.onstart = options.onStart;
  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) window.speechSynthesis.cancel();
}

export function pauseSpeaking(): void {
  if (isSpeechSynthesisSupported()) window.speechSynthesis.pause();
}

export function resumeSpeaking(): void {
  if (isSpeechSynthesisSupported()) window.speechSynthesis.resume();
}

export function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/[-*]\s/g, '')
    .replace(/\d+\.\s/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim();
}
