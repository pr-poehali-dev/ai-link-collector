import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface PromptTemplate {
  id: string;
  name: string;
  category: 'creative' | 'business' | 'code' | 'analysis' | 'social';
  description: string;
  template: string;
  icon: string;
  variables: string[];
}

interface HistoryItem {
  id: string;
  prompt: string;
  timestamp: number;
  templateName?: string;
}

const templates: PromptTemplate[] = [
  {
    id: '1',
    name: 'Генерация контента',
    category: 'creative',
    description: 'Создание креативного текста на любую тему',
    template: 'Напиши {length} текст на тему "{topic}" в стиле {style}. {additional}',
    icon: 'PenTool',
    variables: ['length', 'topic', 'style', 'additional']
  },
  {
    id: '2',
    name: 'Анализ текста',
    category: 'analysis',
    description: 'Глубокий анализ текста или документа',
    template: 'Проанализируй следующий текст: "{text}". Обрати внимание на {focus}. {instruction}',
    icon: 'Search',
    variables: ['text', 'focus', 'instruction']
  },
  {
    id: '3',
    name: 'Написание кода',
    category: 'code',
    description: 'Генерация кода на любом языке',
    template: 'Напиши код на {language} для {task}. Требования: {requirements}',
    icon: 'Code',
    variables: ['language', 'task', 'requirements']
  },
  {
    id: '4',
    name: 'Бизнес-план',
    category: 'business',
    description: 'Создание бизнес-планов и стратегий',
    template: 'Составь {type} для {business}. Целевая аудитория: {audience}. Бюджет: {budget}',
    icon: 'Briefcase',
    variables: ['type', 'business', 'audience', 'budget']
  },
  {
    id: '5',
    name: 'Посты для соцсетей',
    category: 'social',
    description: 'Контент для социальных сетей',
    template: 'Создай пост для {platform} про {topic}. Стиль: {tone}. Добавь {elements}',
    icon: 'Share2',
    variables: ['platform', 'topic', 'tone', 'elements']
  },
  {
    id: '6',
    name: 'Email-рассылка',
    category: 'business',
    description: 'Письма для email-маркетинга',
    template: 'Напиши email для {purpose}. Тема письма: {subject}. Целевое действие: {cta}',
    icon: 'Mail',
    variables: ['purpose', 'subject', 'cta']
  },
  {
    id: '7',
    name: 'Идеи для контента',
    category: 'creative',
    description: 'Генерация идей и концепций',
    template: 'Предложи {count} идей для {project}. Тематика: {theme}. {constraints}',
    icon: 'Lightbulb',
    variables: ['count', 'project', 'theme', 'constraints']
  },
  {
    id: '8',
    name: 'Исправление ошибок',
    category: 'code',
    description: 'Отладка и исправление кода',
    template: 'Найди и исправь ошибки в этом коде: {code}. Язык: {language}. {context}',
    icon: 'Bug',
    variables: ['code', 'language', 'context']
  },
  {
    id: '9',
    name: 'Резюме документа',
    category: 'analysis',
    description: 'Краткое изложение длинных текстов',
    template: 'Создай краткое резюме ({format}) для: {document}. Фокус на: {key_points}',
    icon: 'FileText',
    variables: ['format', 'document', 'key_points']
  },
  {
    id: '10',
    name: 'SEO-оптимизация',
    category: 'business',
    description: 'Тексты с учетом SEO',
    template: 'Напиши SEO-оптимизированный текст про {topic}. Ключевые слова: {keywords}. Длина: {length}',
    icon: 'TrendingUp',
    variables: ['topic', 'keywords', 'length']
  }
];

const categories = [
  { id: 'all', name: 'Все', icon: 'LayoutGrid' },
  { id: 'creative', name: 'Креатив', icon: 'Sparkles' },
  { id: 'business', name: 'Бизнес', icon: 'Briefcase' },
  { id: 'code', name: 'Код', icon: 'Code' },
  { id: 'analysis', name: 'Анализ', icon: 'BarChart' },
  { id: 'social', name: 'Соцсети', icon: 'MessageCircle' }
];

const toneOptions = [
  { value: 'professional', label: 'Профессиональный' },
  { value: 'casual', label: 'Неформальный' },
  { value: 'friendly', label: 'Дружелюбный' },
  { value: 'humorous', label: 'С юмором' },
  { value: 'serious', label: 'Серьёзный' }
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [customPrompt, setCustomPrompt] = useState('');
  const [tone, setTone] = useState('professional');
  const [language, setLanguage] = useState('русский');
  const [finalPrompt, setFinalPrompt] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('promptHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (prompt: string, templateName?: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      prompt,
      timestamp: Date.now(),
      templateName
    };
    const newHistory = [newItem, ...history].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem('promptHistory', JSON.stringify(newHistory));
  };

  const filteredTemplates = templates.filter(
    template => selectedCategory === 'all' || template.category === selectedCategory
  );

  const handleTemplateSelect = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    const newVars: Record<string, string> = {};
    template.variables.forEach(v => {
      newVars[v] = '';
    });
    setVariables(newVars);
    setFinalPrompt('');
  };

  const handleVariableChange = (varName: string, value: string) => {
    setVariables(prev => ({ ...prev, [varName]: value }));
  };

  const generatePrompt = () => {
    let result = '';
    let templateName: string | undefined;

    if (selectedTemplate) {
      result = selectedTemplate.template;
      Object.entries(variables).forEach(([key, value]) => {
        result = result.replace(`{${key}}`, value || `[${key}]`);
      });
      templateName = selectedTemplate.name;
    } else if (customPrompt) {
      result = customPrompt;
      templateName = 'Свой промпт';
    }

    if (result) {
      const prefix = `Ты - Grok, AI-ассистент. Тон: ${toneOptions.find(t => t.value === tone)?.label}. Язык ответа: ${language}.\n\n`;
      const fullPrompt = prefix + result;
      setFinalPrompt(fullPrompt);
      saveToHistory(fullPrompt, templateName);
    }
  };

  const copyToClipboard = (text?: string) => {
    navigator.clipboard.writeText(text || finalPrompt);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setFinalPrompt(item.prompt);
    setShowHistory(false);
  };

  const deleteHistoryItem = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('promptHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('promptHistory');
  };

  const clearAll = () => {
    setSelectedTemplate(null);
    setVariables({});
    setCustomPrompt('');
    setFinalPrompt('');
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <div className="inline-block neo-shadow rounded-3xl px-8 py-6 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              Конструктор промптов для Grok 🤖
            </h1>
            <p className="text-muted-foreground text-lg">
              Создавай идеальные промпты за минуту
            </p>
          </div>
        </header>

        <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="neo-shadow rounded-2xl p-4">
            <label className="text-sm font-medium text-foreground mb-2 block">Тон общения</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full neo-inset border-0 bg-transparent text-foreground px-4 py-3 rounded-xl focus:outline-none"
            >
              {toneOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="neo-shadow rounded-2xl p-4">
            <label className="text-sm font-medium text-foreground mb-2 block">Язык ответа</label>
            <Input
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="Например: русский"
              className="neo-inset border-0 bg-transparent"
            />
          </div>

          <div className="neo-shadow rounded-2xl p-4 flex items-end gap-2">
            <button
              onClick={clearAll}
              className="flex-1 neo-shadow hover:neo-pressed rounded-xl px-4 py-3 font-medium text-foreground transition-all flex items-center justify-center gap-2"
            >
              <Icon name="RotateCcw" size={18} />
              Сбросить
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex-1 neo-shadow hover:neo-pressed rounded-xl px-4 py-3 font-medium text-primary transition-all flex items-center justify-center gap-2 relative"
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
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  px-5 py-2.5 rounded-2xl font-medium transition-all duration-200 flex items-center gap-2
                  ${selectedCategory === category.id
                    ? 'neo-pressed bg-primary/10 text-primary'
                    : 'neo-shadow hover:neo-inset text-foreground'
                  }
                `}
              >
                <Icon name={category.icon} size={16} />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Icon name="Layers" size={24} />
              Шаблоны промптов
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`
                    w-full text-left neo-shadow rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02]
                    ${selectedTemplate?.id === template.id ? 'neo-pressed bg-primary/5' : ''}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="neo-shadow rounded-xl p-2 bg-gradient-to-br from-primary/20 to-accent/20 shrink-0">
                      <Icon name={template.icon} size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                      <Badge variant="secondary" className="mt-2 neo-inset border-0 text-xs">
                        {categories.find(c => c.id === template.category)?.name}
                      </Badge>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Icon name="Settings" size={24} />
              Настройки промпта
            </h2>
            
            {selectedTemplate && (
              <div className="neo-shadow rounded-2xl p-6 mb-4">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Icon name={selectedTemplate.icon} size={18} />
                  {selectedTemplate.name}
                </h3>
                <div className="space-y-4">
                  {selectedTemplate.variables.map(varName => (
                    <div key={varName}>
                      <label className="text-sm font-medium text-foreground mb-2 block capitalize">
                        {varName.replace('_', ' ')}
                      </label>
                      <Input
                        value={variables[varName] || ''}
                        onChange={(e) => handleVariableChange(varName, e.target.value)}
                        placeholder={`Введите ${varName}...`}
                        className="neo-inset border-0 bg-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="neo-shadow rounded-2xl p-6 mb-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Edit" size={18} />
                Или создай свой промпт
              </h3>
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Напиши здесь свой собственный промпт..."
                className="neo-inset border-0 bg-transparent min-h-[120px] resize-none"
              />
            </div>

            <button
              onClick={generatePrompt}
              disabled={!selectedTemplate && !customPrompt}
              className="w-full neo-shadow hover:neo-pressed rounded-2xl px-6 py-4 font-bold text-lg text-primary transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              <Icon name="Sparkles" size={22} />
              Сгенерировать промпт
            </button>

            {finalPrompt && (
              <div className="neo-shadow rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Icon name="Check" size={18} className="text-green-500" />
                    Готовый промпт
                  </h3>
                  <button
                    onClick={copyToClipboard}
                    className="neo-shadow hover:neo-pressed rounded-xl px-4 py-2 text-sm font-medium text-primary transition-all flex items-center gap-2"
                  >
                    <Icon name="Copy" size={16} />
                    Копировать
                  </button>
                </div>
                <div className="neo-inset rounded-xl p-4 bg-gradient-to-br from-primary/5 to-accent/5">
                  <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">{finalPrompt}</pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {showHistory && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowHistory(false)}>
            <div className="neo-shadow rounded-3xl p-6 max-w-3xl w-full max-h-[80vh] overflow-hidden bg-background" onClick={(e) => e.stopPropagation()}>
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
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {item.templateName && (
                            <Badge variant="secondary" className="neo-inset border-0 text-xs">
                              {item.templateName}
                            </Badge>
                          )}
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