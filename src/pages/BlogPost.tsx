import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { blogArticles, getArticleContent } from '@/data/blogData';
import { renderChart } from '@/components/charts/ChartRegistry';
import { useLanguage } from '@/contexts/LanguageContext';

const BlogPost = () => {
  const { slug, lang } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const article = blogArticles.find((a) => a.slug === slug);
  const content = article ? getArticleContent(article, lang ?? 'en') : null;

  useEffect(() => {
    if (!content) return;
    document.title = content.seoTitle;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content.metaDescription);
  }, [content]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!article || !content) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Article not found</h1>
          <button
            onClick={() => navigate(`/${lang}/intelligence`)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('blog.backToBlog')}
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero Image */}
        <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <img
            src={article.image}
            alt={content.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        </section>

        {/* Article Content */}
        <section className="relative -mt-32 z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* Article Header Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-background rounded-sm p-8 md:p-12 mb-12"
              >
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-7">
                  <button
                    onClick={() => navigate(`/${lang}/intelligence`)}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:underline transition-all duration-150"
                  >
                    <ArrowLeft size={12} className="opacity-60" />
                    {t('blog.backToBlog')}
                  </button>
                  <span className="text-muted-foreground/30 text-xs">·</span>
                  <span className="text-xs text-muted-foreground/50">
                    {article.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-bold text-foreground leading-[1.15] tracking-tight mb-6">
                  {content.title}
                </h1>

                {/* Meta row */}
                <div className="flex items-center gap-5 text-sm text-muted-foreground/50">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span>{formatDate(article.date)}</span>
                  </div>
                  <span className="w-px h-3 bg-border" />
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} />
                    <span>{article.readingTime} min read</span>
                  </div>
                  <span className="w-px h-3 bg-border" />
                  <span>{article.author}</span>
                </div>
              </motion.div>

              {/* Article Body */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-3xl mx-auto pb-24"
              >
                {content.sections.map((section, index) => (
                  <div key={index} className="mb-12">
                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-5 tracking-tight">
                      {section.heading}
                    </h2>
                    <div className="w-8 h-px bg-foreground/15 mb-6" />
                    {section.content.split('\n\n').map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="text-muted-foreground leading-[1.8] text-[15px] mb-5 last:mb-0"
                      >
                        {paragraph.trim()}
                      </p>
                    ))}
                    {section.chartId && renderChart(section.chartId)}
                  </div>
                ))}

                {/* Closing divider */}
                <div className="w-12 h-px bg-foreground/20 mx-auto mt-16 mb-12" />

                {/* Institutional closing CTA */}
                <div className="text-center">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground/40 font-medium mb-3">
                    {t('blog.closingLabel')}
                  </p>
                  <p className="text-muted-foreground/60 text-sm max-w-md mx-auto leading-relaxed">
                    {t('blog.closingText')}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
