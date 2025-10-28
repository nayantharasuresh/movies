import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Validation schemas
const mediaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Type is required"),
  director: z.string().min(1, "Director is required"),
  budget: z.string().min(1, "Budget is required"),
  location: z.string().min(1, "Location is required"),
  duration: z.string().min(1, "Duration is required"),
  yearTime: z.string().min(1, "Year/Time is required"),
});

// GET /api/media - Get all media with pagination
app.get('/api/media', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [media, totalCount] = await Promise.all([
      prisma.media.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.media.count(),
    ]);

    res.json({
      media,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// POST /api/media - Create new media
app.post('/api/media', async (req, res) => {
  try {
    const validatedData = mediaSchema.parse(req.body);
    
    const media = await prisma.media.create({
      data: validatedData,
    });
    
    res.status(201).json(media);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error creating media:', error);
      res.status(500).json({ error: 'Failed to create media' });
    }
  }
});

// PUT /api/media/:id - Update media
app.put('/api/media/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = mediaSchema.parse(req.body);
    
    const media = await prisma.media.update({
      where: { id },
      data: validatedData,
    });
    
    res.json(media);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error updating media:', error);
      res.status(500).json({ error: 'Failed to update media' });
    }
  }
});

// DELETE /api/media/:id - Delete media
app.delete('/api/media/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    await prisma.media.delete({
      where: { id },
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
});