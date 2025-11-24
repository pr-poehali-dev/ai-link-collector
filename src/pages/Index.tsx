import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

interface VideoPromptParams {
  photoDescription: string;
  videoStyle: string;
  duration: number;
  transition: string;
  movement: string;
  atmosphere: string;
  pace: string;
  effects: string[];
  music: string;
  colorGrade: string;
}

interface HistoryItem {
  id: string;
  prompt: string;
  timestamp: number;
  params: Partial<VideoPromptParams>;
}

const videoStyles = [
  { 
    value: 'cinematic', 
    label: 'Кинематографичный', 
    description: 'Как в фильме, драматичный',
    example: 'Широкоэкранный формат, глубокие тени, контрастное освещение, плавные движения камеры'
  },
  { 
    value: 'documentary', 
    label: 'Документальный', 
    description: 'Реалистичный, естественный',
    example: 'Естественное освещение, живые моменты, минимум эффектов, аутентичность'
  },
  { 
    value: 'dreamy', 
    label: 'Сказочный', 
    description: 'Мягкий, волшебный',
    example: 'Мягкий фокус, световые блики, пастельные тона, эфирная атмосфера'
  },
  { 
    value: 'dynamic', 
    label: 'Динамичный', 
    description: 'Энергичный, быстрый',
    example: 'Быстрые переходы, резкие движения, высокая контрастность, яркие акценты'
  },
  { 
    value: 'nostalgic', 
    label: 'Ностальгический', 
    description: 'Ретро, винтажный',
    example: 'Зернистость плёнки, выцветшие цвета, старые фотоэффекты, тёплые оттенки'
  },
  { 
    value: 'modern', 
    label: 'Современный', 
    description: 'Чистый, минимализм',
    example: 'Простота линий, чёткие переходы, минимум эффектов, геометричность'
  },
  { 
    value: 'artistic', 
    label: 'Художественный', 
    description: 'Креативный, арт-хаус',
    example: 'Необычные ракурсы, абстракция, игра с цветом, экспериментальные эффекты'
  },
  { 
    value: 'commercial', 
    label: 'Рекламный', 
    description: 'Яркий, привлекательный',
    example: 'Насыщенные цвета, идеальная композиция, динамичный монтаж, глянец'
  }
];

const transitions = [
  { value: 'smooth', label: 'Плавный', icon: 'Waves' },
  { value: 'fade', label: 'Затухание', icon: 'Circle' },
  { value: 'zoom', label: 'Зум', icon: 'ZoomIn' },
  { value: 'slide', label: 'Скольжение', icon: 'MoveRight' },
  { value: 'dissolve', label: 'Растворение', icon: 'Droplet' },
  { value: 'cut', label: 'Резкий срез', icon: 'Scissors' },
  { value: 'morph', label: 'Морфинг', icon: 'Blend' }
];

const movements = [
  { value: 'static', label: 'Статично', description: 'Минимум движения' },
  { value: 'slow_pan', label: 'Медленная панорама', description: 'Плавное движение камеры' },
  { value: 'dolly', label: 'Приближение/отдаление', description: 'Движение вперёд-назад' },
  { value: 'orbit', label: 'Облёт', description: 'Круговое движение' },
  { value: 'parallax', label: 'Параллакс', description: '3D-эффект глубины' },
  { value: 'tracking', label: 'Слежение', description: 'Следование за объектом' }
];

const atmospheres = [
  { value: 'calm', label: 'Спокойная', color: 'bg-blue-500/20' },
  { value: 'energetic', label: 'Энергичная', color: 'bg-orange-500/20' },
  { value: 'mysterious', label: 'Таинственная', color: 'bg-purple-500/20' },
  { value: 'joyful', label: 'Радостная', color: 'bg-yellow-500/20' },
  { value: 'melancholic', label: 'Меланхоличная', color: 'bg-gray-500/20' },
  { value: 'romantic', label: 'Романтичная', color: 'bg-pink-500/20' },
  { value: 'epic', label: 'Эпичная', color: 'bg-red-500/20' },
  { value: 'peaceful', label: 'Умиротворённая', color: 'bg-green-500/20' }
];

const paces = [
  { value: 'very_slow', label: 'Очень медленно', speed: '0.5x' },
  { value: 'slow', label: 'Медленно', speed: '0.75x' },
  { value: 'normal', label: 'Нормально', speed: '1x' },
  { value: 'fast', label: 'Быстро', speed: '1.5x' },
  { value: 'very_fast', label: 'Очень быстро', speed: '2x' }
];

const effectsList = [
  { value: 'particles', label: 'Частицы', icon: 'Sparkles' },
  { value: 'light_leaks', label: 'Световые блики', icon: 'Sun' },
  { value: 'blur', label: 'Размытие фона', icon: 'Blur' },
  { value: 'vignette', label: 'Виньетка', icon: 'Circle' },
  { value: 'grain', label: 'Зерно/шум', icon: 'Tv' },
  { value: 'glitch', label: 'Глитч', icon: 'Zap' },
  { value: 'glow', label: 'Свечение', icon: 'Lightbulb' },
  { value: 'chromatic', label: 'Хроматическая аберрация', icon: 'Prism' }
];

const colorGrades = [
  { value: 'natural', label: 'Естественная', description: 'Натуральные цвета' },
  { value: 'warm', label: 'Тёплая', description: 'Оранжево-жёлтые тона' },
  { value: 'cool', label: 'Холодная', description: 'Сине-зелёные тона' },
  { value: 'vintage', label: 'Винтаж', description: 'Ретро, выцветшие цвета' },
  { value: 'cinematic', label: 'Киношная', description: 'Контрастная, насыщенная' },
  { value: 'bw', label: 'Чёрно-белая', description: 'Монохром' },
  { value: 'pastel', label: 'Пастельная', description: 'Мягкие, нежные тона' },
  { value: 'vibrant', label: 'Яркая', description: 'Насыщенные цвета' }
];

export default function Index() {
  const [params, setParams] = useState<VideoPromptParams>({
    photoDescription: '',
    videoStyle: 'cinematic',
    duration: 10,
    transition: 'smooth',
    movement: 'slow_pan',
    atmosphere: 'calm',
    pace: 'normal',
    effects: [],
    music: '',
    colorGrade: 'natural'
  });

  const [finalPrompt, setFinalPrompt] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showStylePreview, setShowStylePreview] = useState(false);
  const [previewStyle, setPreviewStyle] = useState<typeof videoStyles[0] | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('videoPromptHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const updateParam = <K extends keyof VideoPromptParams>(key: K, value: VideoPromptParams[K]) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const toggleEffect = (effect: string) => {
    setParams(prev => ({
      ...prev,
      effects: prev.effects.includes(effect)
        ? prev.effects.filter(e => e !== effect)
        : [...prev.effects, effect]
    }));
  };

  const generatePrompt = () => {
    const style = videoStyles.find(s => s.value === params.videoStyle)?.label || 'кинематографичный';
    const trans = transitions.find(t => t.value === params.transition)?.label.toLowerCase() || 'плавный';
    const move = movements.find(m => m.value === params.movement)?.label.toLowerCase() || 'медленная панорама';
    const atm = atmospheres.find(a => a.value === params.atmosphere)?.label.toLowerCase() || 'спокойная';
    const paceLabel = paces.find(p => p.value === params.pace)?.label.toLowerCase() || 'нормально';
    const color = colorGrades.find(c => c.value === params.colorGrade)?.label.toLowerCase() || 'естественная';

    let prompt = `Создай видео из фотографий с таким описанием: ${params.photoDescription || '[Опиши фотографии]'}.\n\n`;
    
    prompt += `СТИЛЬ: ${style}\n`;
    prompt += `ДЛИТЕЛЬНОСТЬ: ${params.duration} секунд\n`;
    prompt += `ПЕРЕХОДЫ: ${trans}\n`;
    prompt += `ДВИЖЕНИЕ КАМЕРЫ: ${move}\n`;
    prompt += `АТМОСФЕРА: ${atm}\n`;
    prompt += `ТЕМП: ${paceLabel}\n`;
    prompt += `ЦВЕТОКОРРЕКЦИЯ: ${color}\n`;

    if (params.effects.length > 0) {
      const effectLabels = params.effects.map(e => 
        effectsList.find(ef => ef.value === e)?.label.toLowerCase()
      ).join(', ');
      prompt += `ЭФФЕКТЫ: ${effectLabels}\n`;
    }

    if (params.music) {
      prompt += `МУЗЫКА: ${params.music}\n`;
    }

    prompt += `\nСделай видео плавным, профессиональным и визуально привлекательным.`;

    setFinalPrompt(prompt);
    saveToHistory(prompt, params);
  };

  const saveToHistory = (prompt: string, currentParams: VideoPromptParams) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      prompt,
      timestamp: Date.now(),
      params: { ...currentParams }
    };
    const newHistory = [newItem, ...history].slice(0, 15);
    setHistory(newHistory);
    localStorage.setItem('videoPromptHistory', JSON.stringify(newHistory));
  };

  const copyToClipboard = (text?: string) => {
    navigator.clipboard.writeText(text || finalPrompt);
  };

  const loadFromHistory = (item: HistoryItem) => {
    if (item.params) {
      setParams(item.params as VideoPromptParams);
    }
    setFinalPrompt(item.prompt);
    setShowHistory(false);
  };

  const deleteHistoryItem = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('videoPromptHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('videoPromptHistory');
  };

  const resetParams = () => {
    setParams({
      photoDescription: '',
      videoStyle: 'cinematic',
      duration: 10,
      transition: 'smooth',
      movement: 'slow_pan',
      atmosphere: 'calm',
      pace: 'normal',
      effects: [],
      music: '',
      colorGrade: 'natural'
    });
    setFinalPrompt('');
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <div className="inline-block neo-shadow rounded-3xl px-8 py-6 mb-4">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2">
              Grok: Видео из Фото 🎬
            </h1>
            <p className="text-muted-foreground text-lg">
              Создай промпт для генерации видео из фотографий
            </p>
          </div>
        </header>

        <div className="mb-6 flex gap-4 justify-center">
          <button
            onClick={resetParams}
            className="neo-shadow hover:neo-pressed rounded-xl px-6 py-3 font-medium text-foreground transition-all flex items-center gap-2"
          >
            <Icon name="RotateCcw" size={18} />
            Сбросить
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="neo-shadow hover:neo-pressed rounded-xl px-6 py-3 font-medium text-primary transition-all flex items-center gap-2 relative"
          >
            <Icon name="History" size={18} />
            История
            {history.length > 0 && (
              <Badge className="absolute -top-2 -right-2 neo-shadow bg-primary text-primary-foreground border-0 h-6 w-6 flex items-center justify-center p-0">
                {history.length}
              </Badge>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="space-y-6">
            <div className="neo-shadow rounded-3xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Image" size={24} />
                Описание фотографий
              </h2>
              <Input
                value={params.photoDescription}
                onChange={(e) => updateParam('photoDescription', e.target.value)}
                placeholder="Опиши, что на фотографиях: пейзажи, люди, события..."
                className="neo-inset border-0 bg-transparent h-12"
              />
            </div>

            <div className="neo-shadow rounded-3xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Palette" size={24} />
                Стиль видео
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {videoStyles.map(style => (
                  <div key={style.value} className="relative">
                    <button
                      onClick={() => updateParam('videoStyle', style.value)}
                      className={`
                        w-full p-4 rounded-2xl text-left transition-all
                        ${params.videoStyle === style.value
                          ? 'neo-pressed bg-primary/10 border-2 border-primary'
                          : 'neo-shadow hover:neo-inset'
                        }
                      `}
                    >
                      <div className="font-semibold text-foreground mb-1">{style.label}</div>
                      <div className="text-xs text-muted-foreground">{style.description}</div>
                    </button>
                    <button
                      onClick={() => {
                        setPreviewStyle(style);
                        setShowStylePreview(true);
                      }}
                      className="absolute top-2 right-2 neo-shadow hover:neo-pressed rounded-lg p-1.5 transition-all bg-background"
                    >
                      <Icon name="Eye" size={14} className="text-primary" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="neo-shadow rounded-3xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Clock" size={24} />
                Длительность: {params.duration} сек
              </h2>
              <Slider
                value={[params.duration]}
                onValueChange={(value) => updateParam('duration', value[0])}
                min={3}
                max={60}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>3 сек</span>
                <span>60 сек</span>
              </div>
            </div>

            <div className="neo-shadow rounded-3xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Film" size={24} />
                Переходы
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {transitions.map(trans => (
                  <button
                    key={trans.value}
                    onClick={() => updateParam('transition', trans.value)}
                    className={`
                      p-3 rounded-xl flex flex-col items-center gap-2 transition-all
                      ${params.transition === trans.value
                        ? 'neo-pressed bg-primary/10 text-primary'
                        : 'neo-shadow hover:neo-inset text-foreground'
                      }
                    `}
                  >
                    <Icon name={trans.icon} size={20} />
                    <span className="text-xs font-medium">{trans.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="neo-shadow rounded-3xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Move" size={24} />
                Движение камеры
              </h2>
              <div className="space-y-2">
                {movements.map(move => (
                  <button
                    key={move.value}
                    onClick={() => updateParam('movement', move.value)}
                    className={`
                      w-full p-4 rounded-xl text-left transition-all
                      ${params.movement === move.value
                        ? 'neo-pressed bg-primary/10 border-2 border-primary'
                        : 'neo-shadow hover:neo-inset'
                      }
                    `}
                  >
                    <div className="font-semibold text-foreground">{move.label}</div>
                    <div className="text-xs text-muted-foreground">{move.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="neo-shadow rounded-3xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Wind" size={24} />
                Атмосфера
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {atmospheres.map(atm => (
                  <button
                    key={atm.value}
                    onClick={() => updateParam('atmosphere', atm.value)}
                    className={`
                      p-4 rounded-xl font-medium transition-all
                      ${params.atmosphere === atm.value
                        ? `neo-pressed ${atm.color} border-2 border-primary text-primary`
                        : 'neo-shadow hover:neo-inset text-foreground'
                      }
                    `}
                  >
                    {atm.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="neo-shadow rounded-3xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Gauge" size={24} />
                Темп
              </h2>
              <div className="space-y-2">
                {paces.map(pace => (
                  <button
                    key={pace.value}
                    onClick={() => updateParam('pace', pace.value)}
                    className={`
                      w-full p-3 rounded-xl flex items-center justify-between transition-all
                      ${params.pace === pace.value
                        ? 'neo-pressed bg-primary/10 text-primary'
                        : 'neo-shadow hover:neo-inset text-foreground'
                      }
                    `}
                  >
                    <span className="font-medium">{pace.label}</span>
                    <Badge variant="secondary" className="neo-inset border-0 text-xs">
                      {pace.speed}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            <div className="neo-shadow rounded-3xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Sparkles" size={24} />
                Эффекты
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {effectsList.map(effect => (
                  <button
                    key={effect.value}
                    onClick={() => toggleEffect(effect.value)}
                    className={`
                      p-3 rounded-xl flex items-center gap-2 transition-all
                      ${params.effects.includes(effect.value)
                        ? 'neo-pressed bg-primary/10 text-primary'
                        : 'neo-shadow hover:neo-inset text-foreground'
                      }
                    `}
                  >
                    <Icon name={effect.icon} size={18} />
                    <span className="text-sm font-medium">{effect.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="neo-shadow rounded-3xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Droplet" size={24} />
                Цветокоррекция
              </h2>
              <div className="space-y-2">
                {colorGrades.map(color => (
                  <button
                    key={color.value}
                    onClick={() => updateParam('colorGrade', color.value)}
                    className={`
                      w-full p-4 rounded-xl text-left transition-all
                      ${params.colorGrade === color.value
                        ? 'neo-pressed bg-primary/10 border-2 border-primary'
                        : 'neo-shadow hover:neo-inset'
                      }
                    `}
                  >
                    <div className="font-semibold text-foreground">{color.label}</div>
                    <div className="text-xs text-muted-foreground">{color.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="neo-shadow rounded-3xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Music" size={24} />
                Музыкальное сопровождение
              </h2>
              <Input
                value={params.music}
                onChange={(e) => updateParam('music', e.target.value)}
                placeholder="Например: спокойная фоновая музыка, эпичный саундтрек..."
                className="neo-inset border-0 bg-transparent h-12"
              />
            </div>
          </div>
        </div>

        <div className="neo-shadow rounded-3xl p-8 mb-6">
          <button
            onClick={generatePrompt}
            disabled={!params.photoDescription}
            className="w-full neo-shadow hover:neo-pressed rounded-2xl px-8 py-6 font-bold text-2xl text-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <Icon name="Sparkles" size={28} />
            Сгенерировать промпт
          </button>

          {finalPrompt && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                  <Icon name="Check" size={20} className="text-green-500" />
                  Готовый промпт для Grok
                </h3>
                <button
                  onClick={() => copyToClipboard()}
                  className="neo-shadow hover:neo-pressed rounded-xl px-5 py-3 font-medium text-primary transition-all flex items-center gap-2"
                >
                  <Icon name="Copy" size={18} />
                  Копировать
                </button>
              </div>
              <div className="neo-inset rounded-2xl p-6 bg-gradient-to-br from-primary/5 to-accent/5">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">{finalPrompt}</pre>
              </div>
            </div>
          )}
        </div>

        {showStylePreview && previewStyle && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50" onClick={() => setShowStylePreview(false)}>
            <div className="neo-shadow rounded-3xl p-8 max-w-2xl w-full bg-background" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <Icon name="Palette" size={28} className="text-primary" />
                  {previewStyle.label}
                </h2>
                <button
                  onClick={() => setShowStylePreview(false)}
                  className="neo-shadow hover:neo-pressed rounded-xl p-2 transition-all"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <div className="neo-inset rounded-2xl p-6 mb-6 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="mb-4">
                  <Badge variant="secondary" className="neo-shadow border-0 mb-3">
                    Описание стиля
                  </Badge>
                  <p className="text-foreground text-lg">{previewStyle.description}</p>
                </div>

                <div>
                  <Badge variant="secondary" className="neo-shadow border-0 mb-3">
                    Характеристики
                  </Badge>
                  <p className="text-muted-foreground leading-relaxed">{previewStyle.example}</p>
                </div>
              </div>

              <div className="neo-shadow rounded-2xl p-6 mb-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Icon name="Lightbulb" size={20} />
                  Когда использовать
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  {previewStyle.value === 'cinematic' && (
                    <>
                      <p>• Свадебные видео и торжественные события</p>
                      <p>• Путешествия и пейзажи</p>
                      <p>• Истории с эмоциональным подтекстом</p>
                      <p>• Профессиональные портфолио</p>
                    </>
                  )}
                  {previewStyle.value === 'documentary' && (
                    <>
                      <p>• Репортажи и события</p>
                      <p>• Семейные архивы</p>
                      <p>• Образовательный контент</p>
                      <p>• Повседневная жизнь</p>
                    </>
                  )}
                  {previewStyle.value === 'dreamy' && (
                    <>
                      <p>• Романтические истории</p>
                      <p>• Детские воспоминания</p>
                      <p>• Сказочные события</p>
                      <p>• Творческие проекты</p>
                    </>
                  )}
                  {previewStyle.value === 'dynamic' && (
                    <>
                      <p>• Спортивные моменты</p>
                      <p>• Активный отдых и приключения</p>
                      <p>• Молодёжный контент</p>
                      <p>• Музыкальные клипы</p>
                    </>
                  )}
                  {previewStyle.value === 'nostalgic' && (
                    <>
                      <p>• Старые семейные фото</p>
                      <p>• Воспоминания из прошлого</p>
                      <p>• Ретро-тематика</p>
                      <p>• Трогательные истории</p>
                    </>
                  )}
                  {previewStyle.value === 'modern' && (
                    <>
                      <p>• Бизнес-презентации</p>
                      <p>• Архитектура и дизайн</p>
                      <p>• Технологии и инновации</p>
                      <p>• Корпоративный контент</p>
                    </>
                  )}
                  {previewStyle.value === 'artistic' && (
                    <>
                      <p>• Творческие эксперименты</p>
                      <p>• Выставки и галереи</p>
                      <p>• Авторские проекты</p>
                      <p>• Концептуальные истории</p>
                    </>
                  )}
                  {previewStyle.value === 'commercial' && (
                    <>
                      <p>• Продуктовые презентации</p>
                      <p>• Рекламные ролики</p>
                      <p>• Социальные сети</p>
                      <p>• Промо-материалы</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    updateParam('videoStyle', previewStyle.value);
                    setShowStylePreview(false);
                  }}
                  className="flex-1 neo-shadow hover:neo-pressed rounded-xl px-6 py-3 font-semibold text-primary transition-all flex items-center justify-center gap-2"
                >
                  <Icon name="Check" size={18} />
                  Выбрать этот стиль
                </button>
                <button
                  onClick={() => setShowStylePreview(false)}
                  className="neo-shadow hover:neo-pressed rounded-xl px-6 py-3 font-medium text-foreground transition-all"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}

        {showHistory && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowHistory(false)}>
            <div className="neo-shadow rounded-3xl p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden bg-background" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Icon name="History" size={28} />
                  История промптов
                </h2>
                <div className="flex gap-2">
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="neo-shadow hover:neo-pressed rounded-xl px-4 py-2 text-sm font-medium text-red-500 transition-all flex items-center gap-2"
                    >
                      <Icon name="Trash2" size={16} />
                      Очистить
                    </button>
                  )}
                  <button
                    onClick={() => setShowHistory(false)}
                    className="neo-shadow hover:neo-pressed rounded-xl p-2 transition-all"
                  >
                    <Icon name="X" size={20} />
                  </button>
                </div>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-16 neo-inset rounded-2xl">
                  <Icon name="FileX" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">История пуста</p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-2">
                  {history.map((item) => (
                    <div key={item.id} className="neo-shadow rounded-2xl p-4 hover:scale-[1.01] transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="neo-inset border-0 text-xs">
                            {videoStyles.find(s => s.value === item.params.videoStyle)?.label || 'Видео'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.timestamp).toLocaleString('ru-RU', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyToClipboard(item.prompt)}
                            className="neo-shadow hover:neo-pressed rounded-lg p-2 text-primary transition-all"
                          >
                            <Icon name="Copy" size={16} />
                          </button>
                          <button
                            onClick={() => loadFromHistory(item)}
                            className="neo-shadow hover:neo-pressed rounded-lg p-2 text-primary transition-all"
                          >
                            <Icon name="RotateCcw" size={16} />
                          </button>
                          <button
                            onClick={() => deleteHistoryItem(item.id)}
                            className="neo-shadow hover:neo-pressed rounded-lg p-2 text-red-500 transition-all"
                          >
                            <Icon name="Trash2" size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-foreground line-clamp-3">{item.prompt}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}