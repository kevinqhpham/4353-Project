const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const { Readable } = require('stream');

const supabaseUrl = 'https://ngnaehayrjwlccyguvia.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nbmFlaGF5cmp3bGNjeWd1dmlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MzE2NjksImV4cCI6MjA1NzUwNzY2OX0.XYPIwnE8vZGnXo17d5o0lOoO7Tit4omsN_UPBRdOKUM';
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all events (for frontend use)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('events').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err.message });
  }
});

router.get('/report', async (req, res) => {
  const format = req.query.format || 'csv';

  try {
    const { data, error } = await supabase.from('events').select('*');
    if (error) throw error;

    if (format === 'csv') {
      const { Parser } = require('json2csv');
      console.log("CSV export data:", data);
      const parser = new Parser();
      const csv = parser.parse(data);

      res.header('Content-Type', 'text/csv');
      res.attachment('events_report.csv');
      return res.send(csv);
    } else if (format === 'pdf') {
      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument();
      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=events_report.pdf');
        res.send(pdfBuffer);
      });

      // Add title to the PDF
      doc.fontSize(18).text('Events Report', { align: 'center' });
      doc.moveDown();

      // Check if there is data and add each event to the PDF
      if (data && data.length > 0) {
        data.forEach((event, idx) => {
          doc.fontSize(12).text(`${idx + 1}. Event Name: ${event.title || 'N/A'}`);
          doc.text(`   Date: ${event.date || 'N/A'}`);
          doc.text(`   Time: ${event.time || 'N/A'}`);
          doc.text(`   Location: ${event.location || 'N/A'}`);
          doc.text(`   Description: ${event.description || 'N/A'}`);
          doc.moveDown();
        });
      } else {
        doc.fontSize(12).text('No events found.');
      }

      doc.end();
    } else {
      res.status(400).json({ message: 'Invalid format. Use ?format=csv or ?format=pdf' });
    }
  } catch (err) {
    console.error('Report generation error:', err);
    res.status(500).json({ message: 'Error generating report', error: err.message });
  }
});





module.exports = router;