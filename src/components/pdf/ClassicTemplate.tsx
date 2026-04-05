import React from 'react';
import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import Html from 'react-pdf-html';

const htmlStylesheet = {
  h1: { fontSize: 24, marginBottom: 10, fontWeight: 'bold' },
  h2: { fontSize: 16, marginTop: 15, marginBottom: 6, borderBottom: '1px solid #333', paddingBottom: 2, fontWeight: 'bold' },
  h3: { fontSize: 13, marginTop: 10, marginBottom: 4, fontWeight: 'bold' },
  p: { fontSize: 11, marginBottom: 5, lineHeight: 1.4 },
  ul: { marginBottom: 10, marginLeft: 15 },
  li: { fontSize: 11, marginBottom: 3, lineHeight: 1.3 }
};

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Inter', color: '#111' },
});

export function ClassicTemplate({ htmlContent }: { htmlContent: string }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Html stylesheet={htmlStylesheet}>{htmlContent}</Html>
      </Page>
    </Document>
  );
}
