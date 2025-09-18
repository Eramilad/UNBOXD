
import React, { useState, useContext, createContext } from 'react';
import { Globe, Volume2, Mic, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  translate: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const translations = {
  en: {
    dashboard: 'Dashboard',
    jobs: 'Jobs',
    earnings: 'Earnings',
    profile: 'Profile',
    newJob: 'New Job Available',
    acceptJob: 'Accept Job',
    jobCompleted: 'Job Completed',
    totalEarnings: 'Total Earnings',
    rating: 'Rating',
    welcome: 'Welcome back',
    loading: 'Loading...',
    error: 'Error occurred'
  },
  ha: { // Hausa
    dashboard: 'Babban Shafi',
    jobs: 'Ayyuka',
    earnings: 'Kudin da ka samu',
    profile: 'Bayanan ka',
    newJob: 'Sabon Aiki yana akwai',
    acceptJob: 'Karbi Aikin',
    jobCompleted: 'An kammala Aikin',
    totalEarnings: 'Jimillar Kudin da ka samu',
    rating: 'Matsayi',
    welcome: 'Maraba da dawo',
    loading: 'Ana loding...',
    error: 'Kuskure ya faru'
  },
  ig: { // Igbo
    dashboard: 'Isi Peeji',
    jobs: 'Ọrụ',
    earnings: 'Ego i nwetara',
    profile: 'Nkọwa gị',
    newJob: 'Ọrụ ọhụrụ dị',
    acceptJob: 'Nabata Ọrụ',
    jobCompleted: 'Ọrụ agwụla',
    totalEarnings: 'Mkpokọta Ego i nwetara',
    rating: 'Ọnọdụ',
    welcome: 'Nnọọ ka ị laghachi',
    loading: 'Na-emepe...',
    error: 'Njehie mere'
  },
  yo: { // Yoruba
    dashboard: 'Ojú-ìwé Àkọkọ',
    jobs: 'Àwọn Iṣẹ́',
    earnings: 'Owó tí o ti jẹ',
    profile: 'Àlàyé rẹ',
    newJob: 'Iṣẹ́ tuntun wà',
    acceptJob: 'Gba Iṣẹ́ náà',
    jobCompleted: 'Iṣẹ́ ti parí',
    totalEarnings: 'Àpapọ̀ Owó tí o ti jẹ',
    rating: 'Ipò',
    welcome: 'Kú àbọ̀',
    loading: 'Ń ṣe ìbẹ̀rẹ̀...',
    error: 'Àṣìṣe kan ṣẹlẹ̀'
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    localStorage.setItem('preferred_language', lang);
  };

  const translate = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageSupport = () => {
  const [isListening, setIsListening] = useState(false);
  const { currentLanguage, setLanguage, translate } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
    { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
    { code: 'yo', name: 'Yoruba', flag: '🇳🇬' }
  ];

  const startVoiceCommand = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = currentLanguage === 'en' ? 'en-US' : 'ha-NG';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const command = event.results[0][0].transcript.toLowerCase();
        processVoiceCommand(command);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  };

  const processVoiceCommand = (command: string) => {
    // Simple voice commands
    if (command.includes('dashboard') || command.includes('home')) {
      window.location.hash = '#dashboard';
    } else if (command.includes('jobs') || command.includes('work')) {
      window.location.hash = '#jobs';
    } else if (command.includes('earnings') || command.includes('money')) {
      window.location.hash = '#earnings';
    } else if (command.includes('profile')) {
      window.location.hash = '#profile';
    }
    
    // Text-to-speech feedback
    const speech = new SpeechSynthesisUtterance(`Navigating to ${command}`);
    speech.lang = currentLanguage === 'en' ? 'en-US' : 'ha-NG';
    speechSynthesis.speak(speech);
  };

  const speakText = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = currentLanguage === 'en' ? 'en-US' : 
                  currentLanguage === 'ha' ? 'ha-NG' :
                  currentLanguage === 'ig' ? 'ig-NG' : 'yo-NG';
    speechSynthesis.speak(speech);
  };

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Language Settings
          </CardTitle>
          <CardDescription>
            Choose your preferred language for the app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={currentLanguage} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex items-center space-x-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Voice Commands */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mic className="h-5 w-5 mr-2" />
            Voice Control
          </CardTitle>
          <CardDescription>
            Navigate the app using voice commands
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={startVoiceCommand}
            disabled={isListening}
            className="w-full"
            variant={isListening ? "destructive" : "default"}
          >
            <Mic className="h-4 w-4 mr-2" />
            {isListening ? 'Listening...' : 'Start Voice Command'}
          </Button>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Voice Commands:</h4>
            <div className="text-sm space-y-1">
              <p>• "Dashboard" - Go to dashboard</p>
              <p>• "Jobs" - View available jobs</p>
              <p>• "Earnings" - Check earnings</p>
              <p>• "Profile" - View profile</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Text-to-Speech */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Volume2 className="h-5 w-5 mr-2" />
            Audio Assistance
          </CardTitle>
          <CardDescription>
            Listen to important information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={() => speakText(translate('welcome'))}
              className="w-full"
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Test Audio (Welcome Message)
            </Button>
            
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Audio assistance reads job details, earnings updates, and important notifications aloud in your preferred language.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            WhatsApp Flow
          </CardTitle>
          <CardDescription>
            Access basic features via WhatsApp for low-tech devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Available WhatsApp Commands:</h4>
              <div className="text-sm space-y-1">
                <p><Badge variant="outline" className="mr-2">JOBS</Badge> View available jobs</p>
                <p><Badge variant="outline" className="mr-2">BALANCE</Badge> Check earnings balance</p>
                <p><Badge variant="outline" className="mr-2">STATUS</Badge> Update availability</p>
                <p><Badge variant="outline" className="mr-2">HELP</Badge> Get assistance</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open('https://wa.me/2348000000000', '_blank')}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Connect WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
