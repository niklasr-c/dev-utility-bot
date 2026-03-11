export function testRegex(pattern: string, text: string, flags: string = 'g') {
  try {
    const regex = new RegExp(pattern, flags);
    const matches = text.match(regex) || [];
    
    return { 
      isValid: true, 
      matches: Array.from(matches) 
    };
  } catch (error: any) {
    // Falls das Pattern fehlerhaft ist (z.B. eine ungeschlossene Klammer)
    return { 
      isValid: false, 
      error: error.message, 
      matches: [] 
    };
  }
}