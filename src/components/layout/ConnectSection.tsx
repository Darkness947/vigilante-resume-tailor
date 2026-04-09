"use client";

import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { Terminal, User, Globe, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function ConnectSection() {
  const t = useTranslations('Links');
  const shouldReduceMotion = useReducedMotion();

  const links = [
    { 
      id: 'github', 
      icon: Terminal, 
      href: 'https://github.com/Darkness947', 
      label: t('github'),
      color: 'hover:text-primary hover:border-primary/50'
    },
    { 
      id: 'linkedin', 
      icon: User, 
      href: 'https://www.linkedin.com/in/hussain-alhumaidi-6726b334a', 
      label: t('linkedin'),
      color: 'hover:text-blue-400 hover:border-blue-400/50'
    },
    { 
      id: 'portfolio', 
      icon: Globe, 
      href: 'https://hussain-portfolio-dev.netlify.app', 
      label: t('portfolio'),
      color: 'hover:text-emerald-400 hover:border-emerald-400/50'
    },
    { 
      id: 'email', 
      icon: Mail, 
      href: 'mailto:husdfdf@gmail.com', 
      label: t('email'),
      color: 'hover:text-secondary hover:border-secondary/50'
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-16">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center md:text-start"
      >
        <h2 className="display-font text-3xl font-black tracking-tight sm:text-4xl">
          {t('title')}
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          {t('subtitle')}
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((link, idx) => (
          <motion.div
            key={link.id}
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <a 
              href={link.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block group"
            >
              <Card className={`relative overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-300 group-hover:bg-muted/50 ${link.color}`}>
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/50 to-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="flex items-center gap-4 py-8">
                  <div className="p-3 rounded-lg bg-muted group-hover:bg-background transition-colors">
                    <link.icon className="size-6" />
                  </div>
                  <div>
                    <p className="text-sm font-black tracking-widest uppercase opacity-50 group-hover:opacity-100 transition-opacity">
                      {link.id}
                    </p>
                    <h3 className="text-lg font-bold tracking-tight">
                      {link.label}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
