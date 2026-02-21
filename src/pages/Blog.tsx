import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { blogArticles, getArticleContent } from '@/data/blogData';
import { useInView } from '@/hooks/useInView';
import { useLanguage } from '@/contexts/LanguageContext';
import heroBg from '@/assets/Ukon_Estate_Hero.avif';
import heroVideo from '@/assets/Ukon_Estate_hero-video-v2.mp4';

const Blog = () => {
  const { ref, isInView } = useInView();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  );

  const categoryMap: Record<string, string> = {
    'All': 'blog.categoryAll',
    'Investing': 'blog.categoryInvesting',
    'Market Report': 'blog.categoryMarketReport',
  };

  const categories = ['All', 'Investing', 'Market Report'];

  const filteredPosts = useMemo(() => {
    return blogArticles.filter((post) => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const content = getArticleContent(post, language);
      const matchesSearch =
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, language]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative py-32 md:py-40 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
  
            poster={heroBg}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ display: 'block', transform: 'scale(1.05)' }}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/65" />

          <div className="container mx-auto px-4 relative z-10">
            <div ref={ref} className="max-w-2xl">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="inline-block px-4 py-2 bg-white/10 text-white/70 rounded-full text-sm font-medium mb-8 tracking-wide"
              >
                {t('blog.ourBlog')}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-[2.75rem] md:text-[3.5rem] lg:text-[4.5rem] font-bold text-white mb-8 tracking-tight leading-[1.05]"
              >
                {t('blog.headline')}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/50 text-lg max-w-xl"
              >
                {t('blog.subheadline')}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="py-6 border-b border-border sticky top-20 z-30 bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={15} />
                <Input
                  type="text"
                  placeholder={t('blog.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 rounded-md border-border/40 text-sm placeholder:text-muted-foreground/35 focus:border-foreground/20"
                />
              </div>

              <div className="flex gap-0">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      if (category === 'All') {
                        setSearchParams({});
                      } else {
                        setSearchParams({ category });
                      }
                    }}
                    className={`px-4 py-1.5 text-[13px] transition-colors duration-150 ${
                      selectedCategory === category
                        ? 'text-foreground font-medium border-b border-foreground'
                        : 'text-muted-foreground/40 hover:text-muted-foreground/70 border-b border-transparent'
                    }`}
                  >
                    {t(categoryMap[category])}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Article Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                {filteredPosts.map((post, index) => {
                  const content = getArticleContent(post, language);
                  return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="group cursor-pointer bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm transition-shadow duration-200 hover:shadow-md"
                    onClick={() => navigate(`/${language}/intelligence/${post.slug}`)}
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                        src={post.image}
                        alt={content.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Category label */}
                      <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground/45 font-medium">
                        {post.category}
                      </span>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-foreground mt-2.5 mb-3 leading-tight tracking-tight group-hover:text-foreground/75 transition-colors duration-150 line-clamp-2">
                        {content.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-muted-foreground/50 text-[13px] leading-relaxed line-clamp-2 mb-5">
                        {content.excerpt}
                      </p>

                      {/* Meta + CTA row */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/30">
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground/35">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={10} />
                            {formatDate(post.date)}
                          </span>
                          <span className="w-px h-2.5 bg-border/50" />
                          <span className="flex items-center gap-1.5">
                            <Clock size={10} />
                            {post.readingTime} min
                          </span>
                        </div>
                        <span className="flex items-center gap-1.5 text-[13px] text-foreground/45 font-medium group-hover:text-foreground group-hover:gap-2.5 transition-all duration-150">
                          {t('blog.readArticle')}
                          <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </motion.article>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground/60 text-sm">
                  {t('blog.noArticlesFound')}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-ukon-navy rounded-xl p-10 md:p-14 text-center">
              <h2 className="text-base font-bold tracking-[0.2em] text-white uppercase mb-4">
                {t('blog.stayUpdated')}
              </h2>
              <div className="w-10 h-px bg-white/20 mx-auto mb-5" />
              <p className="text-white/45 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
                {t('blog.subscriberDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto items-stretch">
                <Input
                  type="email"
                  placeholder={t('blog.emailPlaceholder')}
                  className="h-10 bg-white/5 border-white/10 text-white placeholder:text-white/25 rounded-md text-sm focus:border-white/20 flex-1"
                />
                <button className="h-10 px-8 bg-white text-ukon-navy font-medium text-sm rounded-md hover:bg-white/85 transition-colors duration-150 whitespace-nowrap">
                  {t('blog.subscribe')}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
