import React from 'react';
import { Document, Page, StyleSheet, View } from '@react-pdf/renderer';
import Html from 'react-pdf-html';

const htmlStylesheet = {
  h1: { fontSize: 28, marginBottom: 5, fontWeight: 'bold', color: '#4f46e5' }, // Indigo-600
  h2: { fontSize: 16, marginTop: 16, marginBottom: 8, borderBottom: '2px solid #e0e7ff', paddingBottom: 2, fontWeight: 'bold', color: '#3730a3' },
  h3: { fontSize: 13, marginTop: 10, marginBottom: 4, fontWeight: 'bold', color: '#111827' },
  p: { fontSize: 11, marginBottom: 6, lineHeight: 1.5, color: '#374151' },
  ul: { marginBottom: 10, marginLeft: 10 },
  li: { fontSize: 11, marginBottom: 4, lineHeight: 1.4, color: '#4b5563' }
};

const styles = StyleSheet.create({
  page: { padding: '40px 50px', fontFamily: 'Inter', backgroundColor: '#fafafa' },
  accentBorder: { position: 'absolute', top: 0, left: 0, bottom: 0, width: 8, backgroundColor: '#4f46e5' }
});

export function ModernTemplate({ htmlContent }: { htmlContent: string }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.accentBorder} />
        <Html stylesheet={htmlStylesheet}>{htmlContent}</Html>
      </Page>
    </Document>
  );
}
