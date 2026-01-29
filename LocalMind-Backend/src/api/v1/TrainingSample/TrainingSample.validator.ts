import { z } from 'zod'

const SectionSchema = z.object({
  title: z.string().min(1, 'Section title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Section content is required'),
})

const AnswerTemplateSchema = z.object({
  greeting: z.string().max(500, 'Greeting too long').optional(),
  answer: z.string().min(10, 'Answer must be at least 10 characters').max(5000, 'Answer too long'),
  sections: z.array(SectionSchema).default([]),
  suggestions: z.array(z.string().min(1).max(200)).default([]),
})

export const createTrainingSampleSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters').max(1000),
  type: z.enum(['qa', 'snippet', 'doc', 'faq', 'other']).default('qa'),
  answerTemplate: AnswerTemplateSchema,
  codeSnippet: z.string().max(10000).optional(),
  tags: z.array(z.string().min(1).max(50)).default([]),
  language: z.string().default('en').max(10),
})

export const updateTrainingSampleSchema = createTrainingSampleSchema.partial()

export const vectorSearchSchema = z.object({
  query: z.string().min(1, 'Query is required'),
  topK: z.number().int().min(1).max(100).default(5),
  filters: z.object({
    type: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    sourceType: z.enum(['manual', 'dataset']).optional(),
    isActive: z.boolean().optional(),
    language: z.string().optional(),
  }).optional(),
})
