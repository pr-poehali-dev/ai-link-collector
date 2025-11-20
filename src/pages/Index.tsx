import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface AIService {
  id: string;
  name: string;
  description: string;
  category: 'text' | 'image' | 'video' | 'audio';
  url: string;
  icon: string;
}

const aiServices: AIService[] = [
  {
    id: '1',
    name: 'ChatGPT',
    description: 'Мощный ИИ для генерации текста и диалогов',
    category: 'text',
    url: 'https://chat.openai.com',
    icon: 'MessageSquare'
  },
  {
    id: '2',
    name: 'DALL-E',
    description: 'Генерация изображений по текстовому описанию',
    category: 'image',
    url: 'https://openai.com/dall-e',
    icon: 'Image'
  },
  {
    id: '3',
    name: 'Midjourney',
    description: 'Создание художественных изображений',
    category: 'image',
    url: 'https://midjourney.com',
    icon: 'Palette'
  },
  {
    id: '4',
    name: 'ElevenLabs',
    description: 'Генерация реалистичной речи',
    category: 'audio',
    url: 'https://elevenlabs.io',
    icon: 'Mic'
  },
  {
    id: '5',
    name: 'Runway',
    description: 'Создание и редактирование видео с ИИ',
    category: 'video',
    url: 'https://runwayml.com',
    icon: 'Video'
  },
  {
    id: '6',
    name: 'Claude',
    description: 'ИИ-ассистент для сложных задач',
    category: 'text',
    url: 'https://claude.ai',
    icon: 'Brain'
  },
  {
    id: '7',
    name: 'Stable Diffusion',
    description: 'Open-source генератор изображений',
    category: 'image',
    url: 'https://stability.ai',
    icon: 'Sparkles'
  },
  {
    id: '8',
    name: 'Synthesia',
    description: 'Создание AI-видео с аватарами',
    category: 'video',
    url: 'https://synthesia.io',
    icon: 'PersonStanding'
  },
  {
    id: '9',
    name: 'Murf AI',
    description: 'Превращение текста в озвучку',
    category: 'audio',
    url: 'https://murf.ai',
    icon: 'Volume2'
  },
  {
    id: '10',
    name: 'Jasper',
    description: 'ИИ для копирайтинга и контента',
    category: 'text',
    url: 'https://jasper.ai',
    icon: 'FileText'
  },
  {
    id: '11',
    name: 'Pika',
    description: 'Генерация видео из текста',
    category: 'video',
    url: 'https://pika.art',
    icon: 'Film'
  },
  {
    id: '12',
    name: 'Suno',
    description: 'Создание музыки с помощью ИИ',
    category: 'audio',
    url: 'https://suno.ai',
    icon: 'Music'
  }
];

const categories = [
  { id: 'all', name: 'Все', icon: 'LayoutGrid' },
  { id: 'text', name: 'Текст', icon: 'FileText' },
  { id: 'image', name: 'Изображения', icon: 'Image' },
  { id: 'video', name: 'Видео', icon: 'Video' },
  { id: 'audio', name: 'Аудио', icon: 'Headphones' }
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('aiServicesFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('aiServicesFavorites', JSON.stringify(newFavorites));
  };

  const filteredServices = aiServices.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <div className="inline-block neo-shadow rounded-3xl px-8 py-6 mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              AI Каталог 🤖
            </h1>
            <p className="text-muted-foreground text-lg">
              Бесплатные AI-сервисы в одном месте
            </p>
          </div>
        </header>

        <div className="mb-8 neo-shadow rounded-2xl p-4">
          <div className="relative">
            <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder="Поиск AI-сервисов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 neo-inset border-0 bg-transparent text-lg h-14 rounded-xl focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="mb-10">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  px-6 py-3 rounded-2xl font-medium transition-all duration-200 flex items-center gap-2
                  ${selectedCategory === category.id
                    ? 'neo-pressed bg-primary/10 text-primary'
                    : 'neo-shadow hover:neo-inset text-foreground'
                  }
                `}
              >
                <Icon name={category.icon} size={18} />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <div
              key={service.id}
              className="neo-shadow rounded-3xl p-6 hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="neo-shadow rounded-2xl p-4 bg-gradient-to-br from-primary/20 to-accent/20">
                  <Icon name={service.icon} size={28} className="text-primary" />
                </div>
                <button
                  onClick={() => toggleFavorite(service.id)}
                  className="neo-shadow rounded-xl p-2 hover:neo-pressed transition-all"
                >
                  <Icon 
                    name={favorites.includes(service.id) ? 'Heart' : 'Heart'} 
                    size={20}
                    className={favorites.includes(service.id) ? 'text-red-500 fill-red-500' : 'text-muted-foreground'}
                  />
                </button>
              </div>

              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {service.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {service.description}
              </p>

              <div className="flex items-center justify-between">
                <Badge 
                  variant="secondary" 
                  className="neo-inset border-0 text-xs font-medium px-3 py-1"
                >
                  {categories.find(c => c.id === service.category)?.name}
                </Badge>
                <a
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-shadow rounded-xl px-4 py-2 text-sm font-medium text-primary hover:neo-pressed transition-all flex items-center gap-1"
                >
                  Открыть
                  <Icon name="ExternalLink" size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-16 neo-shadow rounded-3xl">
            <Icon name="SearchX" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Ничего не найдено
            </h3>
            <p className="text-muted-foreground">
              Попробуйте изменить поисковый запрос или фильтр
            </p>
          </div>
        )}

        {favorites.length > 0 && selectedCategory === 'all' && !searchQuery && (
          <div className="mt-16">
            <div className="neo-shadow rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Icon name="Star" size={28} className="text-primary" />
                <h2 className="text-2xl font-bold text-foreground">
                  Избранное ({favorites.length})
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {aiServices.filter(s => favorites.includes(s.id)).map(service => (
                  <a
                    key={service.id}
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neo-shadow rounded-2xl p-4 hover:neo-pressed transition-all text-center group"
                  >
                    <Icon name={service.icon} size={24} className="mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
