const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const { Readable } = require('stream');

const supabaseUrl = 'https://ngnaehayrjwlccyguvia.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nbmFlaGF5cmp3bGNjeWd1dmlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MzE2NjksImV4cCI6MjA1NzUwNzY2OX0.XYPIwnE8vZGnXo17d5o0lOoO7Tit4omsN_UPBRdOKUM';
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all events
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
    // Fetch events and volunteer history
    const [eventsRes, historyRes] = await Promise.all([
      supabase.from('events').select('*'),
      supabase
        .from('volunteer_history')
        .select(`
          id,
          created_at,
          hours_volunteered,
          date_participated,
          event_id,
          users (
            id,
            username,
            email
          )
        `)
    ]);

    if (eventsRes.error) throw eventsRes.error;
    if (historyRes.error) throw historyRes.error;

    const events = eventsRes.data;
    const volunteerHistory = historyRes.data;

    // CSV 
    if (format === 'csv') {
      const csvSections = [];

      csvSections.push('--- Events ---');
      const eventParser = new Parser();
      csvSections.push(eventParser.parse(events));

      const volunteerFormatted = volunteerHistory.map((v) => ({
        Volunteer: v.users?.username || 'N/A',
        Email: v.users?.email || 'N/A',
        EventID: v.event_id,
        HoursVolunteered: v.hours_volunteered,
        DateParticipated: v.date_participated,
      }));
      csvSections.push('\n--- Volunteer Participation History ---');
      const volunteerParser = new Parser();
      csvSections.push(volunteerParser.parse(volunteerFormatted));

      const combinedCSV = csvSections.join('\n\n');
      res.header('Content-Type', 'text/csv');
      res.attachment('full_report.csv');
      return res.send(combinedCSV);
    }

    // PDF
    else if (format === 'pdf') {
      const doc = new PDFDocument();
      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=full_report.pdf');
        res.send(pdfBuffer);
      });

      doc.fontSize(18).text('Events Report', { align: 'center' });
      doc.moveDown();

      if (events.length > 0) {
        events.forEach((event, idx) => {
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

      doc.addPage();
      doc.fontSize(18).text('Volunteer Participation History', { align: 'center' });
      doc.moveDown();

      if (volunteerHistory.length > 0) {
        volunteerHistory.forEach((v, idx) => {
          doc.fontSize(12).text(`${idx + 1}. Volunteer: ${v.users?.username || 'N/A'} (${v.users?.email || 'N/A'})`);
          doc.text(`   Event ID: ${v.event_id}`);
          doc.text(`   Hours Volunteered: ${v.hours_volunteered}`);
          doc.text(`   Date Participated: ${v.date_participated}`);
          doc.moveDown();
        });
      } else {
        doc.fontSize(12).text('No volunteer history found.');
      }

      doc.end();
    }

    else {
      res.status(400).json({ message: 'Invalid format. Use ?format=csv or ?format=pdf' });
    }

  } catch (err) {
    console.error('Report generation error:', err);
    res.status(500).json({ message: 'Error generating report', error: err.message });
  }
});


module.exports = router;