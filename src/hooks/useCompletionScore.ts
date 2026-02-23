import { useMemo } from 'react';
import { analyzeContent, type JSONContent } from '@/lib/tiptap-utils';

interface CompletionScoreReturn {
  score: number;
  maxScore: number;
  percent: number;
  missing: string[];
}

export function useCompletionScore(formData: any): CompletionScoreReturn {
  return useMemo(() => {
    let score = 0;
    const maxScore = 115;
    const missing: string[] = [];

    // Title (10 points)
    if (formData.title && formData.title.length >= 5) {
      score += 10;
    } else {
      missing.push('Property title');
    }

    // Price (10 points)
    if (formData.price && parseFloat(formData.price) > 0) {
      score += 10;
    } else {
      missing.push('Property price');
    }

    // Address with coordinates (10 points)
    if (formData.address && formData.address.length >= 10 && formData.latitude && formData.longitude) {
      score += 10;
    } else {
      missing.push('Complete address with location');
    }

    // Bedrooms (5 points)
    if (formData.bedrooms && parseInt(formData.bedrooms) > 0) {
      score += 5;
    } else {
      missing.push('Number of bedrooms');
    }

    // Bathrooms (5 points)
    if (formData.bathrooms && parseInt(formData.bathrooms) > 0) {
      score += 5;
    } else {
      missing.push('Number of bathrooms');
    }

    // Area m² (5 points)
    if (formData.m2 && parseInt(formData.m2) > 0) {
      score += 5;
    } else {
      missing.push('Property area (m²)');
    }

    // Description summary (10 points) — min 50 chars
    const descSum = formData.description_summary || '';
    if (descSum.length >= 50) {
      score += 10;
    } else {
      missing.push('Property description (min 50 chars)');
    }

    // Description interior (5 points) — min 30 chars
    const descInt = formData.description_interior || '';
    if (descInt.length >= 30) {
      score += 5;
    }

    // Images (5 + 5 + 5 = up to 15 points)
    const imageCount = formData.images ? formData.images.length : 0;
    if (imageCount >= 1) {
      score += 5;
    } else {
      missing.push('At least 1 image');
    }
    if (imageCount >= 4) {
      score += 5;
    }
    if (imageCount >= 8) {
      score += 5;
    }

    // Interior features (5 points) — at least 2
    const interiorFeats = formData.interior_features || [];
    if (interiorFeats.length >= 2) {
      score += 5;
    } else {
      missing.push('At least 2 interior features');
    }

    // Outdoor features (5 points) — at least 1
    const outdoorFeats = formData.outdoor_features || [];
    if (outdoorFeats.length >= 1) {
      score += 5;
    } else {
      missing.push('At least 1 outdoor feature');
    }

    // Lifestyle tags (5 points) — at least 1
    const lifestyleTags = formData.lifestyle_tags || [];
    if (lifestyleTags.length >= 1) {
      score += 5;
    } else {
      missing.push('At least 1 lifestyle tag');
    }

    // Virtual tour URL (5 points)
    if (formData.virtual_tour_url && formData.virtual_tour_url.trim().length > 0) {
      score += 5;
    }

    // Rich text formatting bonuses (5 + 5 + 5 = 15 points)
    const descJson = formData.description_json as JSONContent | null;
    if (descJson) {
      const analysis = analyzeContent(descJson);

      // Uses headings (5 points)
      if (analysis.headingCount >= 1) {
        score += 5;
      } else {
        missing.push('Use headings to structure description');
      }

      // 500+ words (5 points)
      if (analysis.wordCount >= 500) {
        score += 5;
      } else {
        missing.push('Write 500+ words in description');
      }

      // Uses list formatting (5 points)
      if (analysis.listCount >= 1) {
        score += 5;
      } else {
        missing.push('Add a feature list to description');
      }
    } else {
      missing.push('Use rich text formatting in description');
    }

    // Cap score at maxScore
    const cappedScore = Math.min(score, maxScore);
    const percent = Math.round((cappedScore / maxScore) * 100);

    return {
      score: cappedScore,
      maxScore,
      percent,
      missing,
    };
  }, [formData]);
}
